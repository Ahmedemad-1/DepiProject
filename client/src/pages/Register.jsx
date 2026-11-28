/**
 * PAGE   : Register
 * ROUTE  : /register
 * PURPOSE: Validate registration details, create a customer, and sign them in.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { sitePhoto } from "../config/photos.js";
import { emailExists, register as registerRequest } from "../services/api.js";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
} from "../utils/validators.js";

const EMPTY_VALUES = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const nextErrors = {};
    const email = values.email.trim();

    if (!values.name.trim()) nextErrors.name = "Enter your name.";
    if (!email) nextErrors.email = "Enter your email address.";
    else if (!isValidEmail(email))
      nextErrors.email = "Enter a valid email address.";

    if (!values.phone.trim()) nextErrors.phone = "Enter your phone number.";
    else if (!isValidPhone(values.phone.trim()))
      nextErrors.phone = "Use an Egyptian mobile number: 01XXXXXXXXX.";

    if (!values.password) nextErrors.password = "Create a password.";
    else if (!isValidPassword(values.password))
      nextErrors.password = "Your password must be at least 6 characters.";

    if (!values.confirmPassword)
      nextErrors.confirmPassword = "Confirm your password.";
    else if (values.confirmPassword !== values.password)
      nextErrors.confirmPassword = "The passwords do not match.";

    return nextErrors;
  }

  function changeValue(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFormError("");
  }

  async function submit(event) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError("");
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`register-${firstInvalid}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const email = values.email.trim().toLowerCase();
      if (await emailExists(email)) {
        setErrors((current) => ({
          ...current,
          email:
            "An account already uses this email. Sign in or use another email.",
        }));
        document.getElementById("register-email")?.focus();
        return;
      }

      const user = await registerRequest({
        name: values.name.trim(),
        email,
        phone: values.phone.trim(),
        password: values.password,
      });
      login(user);
      navigate("/", { replace: true });
    } catch {
      setFormError(
        "We couldn’t create your account. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="main">
      <section
        className="page-head login-head"
        style={{ "--photo": `url(${sitePhoto.hero[3]})` }}
      >
        <div className="container">
          <p className="tag">A place at the table</p>
          <h1>Make yourself at home</h1>
          <p className="lead">
            Create an account to order and reserve with ease.
          </p>
        </div>
      </section>
      <section className="sec login-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 d-none d-lg-flex">
              <aside className="login-aside">
                <span className="login-aside-mark" aria-hidden="true">
                  ✳
                </span>
                <p className="tag">Good food, good company</p>
                <h2>Your next favorite meal is waiting.</h2>
                <p className="muted">
                  Create your account to keep track of orders and plan your next
                  visit.
                </p>
              </aside>
            </div>
            <div className="col-md-8 col-lg-5">
              <div className="form-card login-card">
                <p className="login-card-kicker">Get started</p>
                <h2 className="sm mb-4">Create your account</h2>
                <form onSubmit={submit} noValidate>
                  <div className="d-grid gap-3">
                    <FormInput
                      id="register-name"
                      label="Name"
                      name="name"
                      value={values.name}
                      onChange={changeValue}
                      error={errors.name}
                      autoComplete="name"
                    />
                    <FormInput
                      id="register-email"
                      label="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={changeValue}
                      error={errors.email}
                      autoComplete="email"
                      inputMode="email"
                    />
                    <FormInput
                      id="register-phone"
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={values.phone}
                      onChange={changeValue}
                      error={errors.phone}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="01XXXXXXXXX"
                    />
                    <FormInput
                      id="register-password"
                      label="Password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={changeValue}
                      error={errors.password}
                      autoComplete="new-password"
                      minLength={6}
                    />
                    <FormInput
                      id="register-confirmPassword"
                      label="Confirm password"
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={changeValue}
                      error={errors.confirmPassword}
                      autoComplete="new-password"
                      minLength={6}
                    />
                  </div>
                  <div className="form-foot">
                    <button
                      type="submit"
                      className="btn-solid"
                      disabled={submitting}
                    >
                      {submitting ? "Creating account…" : "Create Account"}
                    </button>
                    <p className="mb-0">
                      Already registered? <Link to="/login">Sign in</Link>
                    </p>
                  </div>
                  {formError && (
                    <p className="form-error" role="alert">
                      {formError}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
