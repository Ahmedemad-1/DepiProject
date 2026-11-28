/**
 * PAGE   : Login
 * ROUTE  : /login
 * PURPOSE: Sign in with the demo API and return the user to a protected page.
 */
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { login as loginRequest } from "../services/api.js";
import { isValidEmail, isValidPassword } from "../utils/validators.js";
import { sitePhoto } from "../config/photos.js";

export default function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function validate() {
    const nextErrors = {};
    const email = values.email.trim();

    if (!email) nextErrors.email = "Enter your email address.";
    else if (!isValidEmail(email))
      nextErrors.email = "Enter a valid email address.";

    if (!values.password) nextErrors.password = "Enter your password.";
    else if (!isValidPassword(values.password))
      nextErrors.password = "Your password must be at least 6 characters.";

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
      document.getElementById(`login-${firstInvalid}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const user = await loginRequest(
        values.email.trim().toLowerCase(),
        values.password,
      );
      login(user);

      const from = location.state?.from;
      if (from?.pathname) {
        navigate(
          { pathname: from.pathname, search: from.search, hash: from.hash },
          { replace: true },
        );
      } else {
        navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
      }
    } catch (error) {
      setFormError(
        error.message === "Invalid email or password"
          ? "Invalid email or password. Check both fields and try again."
          : "We couldn’t sign you in. Check your connection and try again.",
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
          <h1>Welcome back</h1>
          <p className="lead">Sign in to pick up where you left off.</p>
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
                <h2>Make room for something memorable.</h2>
                <p className="muted">
                  Sign in to manage your orders and plan your next visit.
                </p>
              </aside>
            </div>
            <div className="col-md-8 col-lg-5">
              <div className="form-card login-card">
                <p className="login-card-kicker">Your account</p>
                <h2 className="sm mb-4">Sign in</h2>
                <form onSubmit={submit} noValidate>
                  <div className="d-grid gap-3">
                    <FormInput
                      id="login-email"
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
                      id="login-password"
                      label="Password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={changeValue}
                      error={errors.password}
                      autoComplete="current-password"
                      minLength={6}
                    />
                  </div>
                  <div className="form-foot">
                    <button
                      type="submit"
                      className="btn-solid"
                      disabled={submitting}
                    >
                      {submitting ? "Signing in…" : "Sign In"}
                    </button>
                    <p className="mb-0">
                      New here? <Link to="/register">Create an account</Link>
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
