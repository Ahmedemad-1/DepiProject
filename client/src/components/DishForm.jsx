import { useState } from "react";
import FormInput from "./FormInput.jsx";

const ALL_SIZES = ["small", "medium", "large"];

function makeValues(item = {}) {
  return {
    name: item.name || "",
    nameAr: item.nameAr || "",
    description: item.description || "",
    descriptionAr: item.descriptionAr || "",
    basePrice: item.basePrice ?? "",
    image: item.image || "",
    imageSquare: item.imageSquare || "",
    categoryId: item.categoryId ? String(item.categoryId) : "",
    isVegetarian: Boolean(item.isVegetarian),
    isAvailable: item.isAvailable !== false,
    extras: (item.extras || []).map((extra) => ({
      name: extra.name || "",
      nameAr: extra.nameAr || "",
      price: extra.price ?? "",
    })),
  };
}

export default function DishForm({
  initialValues,
  categories,
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const [values, setValues] = useState(() => makeValues(initialValues));
  const [errors, setErrors] = useState({});

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function validate() {
    const nextErrors = {};
    const price = Number(values.basePrice);
    if (!values.name.trim()) nextErrors.name = "Enter the dish name.";
    if (!values.basePrice || !Number.isFinite(price) || price <= 0)
      nextErrors.basePrice = "Enter a price greater than 0.";
    if (!values.categoryId) nextErrors.categoryId = "Choose a category.";
    values.extras.forEach((extra, index) => {
      if (!extra.name.trim())
        nextErrors[`extra-${index}`] = "Enter a name or remove this extra.";
      if (
        extra.price === "" ||
        !Number.isFinite(Number(extra.price)) ||
        Number(extra.price) < 0
      )
        nextErrors[`extra-price-${index}`] = "Enter a price of 0 or more.";
    });
    return nextErrors;
  }

  function changeExtra(index, key, value) {
    setValues((current) => ({
      ...current,
      extras: current.extras.map((extra, i) =>
        i === index ? { ...extra, [key]: value } : extra,
      ),
    }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSubmit({
      ...values,
      basePrice: Number(values.basePrice),
      categoryId: Number(values.categoryId),
      availableSizes: ALL_SIZES,
      extras: values.extras.map((extra) => ({
        name: extra.name.trim(),
        nameAr: extra.nameAr.trim(),
        price: Number(extra.price),
      })),
    });
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <FormInput
            id="dish-name"
            label="Dish name"
            name="name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            error={errors.name}
            required
          />
        </div>
        <div className="col-md-6">
          <FormInput
            id="dish-name-ar"
            label="Arabic name"
            name="nameAr"
            value={values.nameAr}
            onChange={(event) => setField("nameAr", event.target.value)}
            required={false}
          />
        </div>
        <div className="col-md-6">
          <FormInput
            id="dish-price"
            label="Base price (USD)"
            name="basePrice"
            type="number"
            value={values.basePrice}
            onChange={(event) => setField("basePrice", event.target.value)}
            error={errors.basePrice}
            min="0.01"
            required
          />
        </div>
        <div className="col-md-6">
          <div className="field">
            <label htmlFor="dish-category">Category</label>
            <select
              id="dish-category"
              className="form-control"
              value={values.categoryId}
              onChange={(event) => setField("categoryId", event.target.value)}
              aria-invalid={errors.categoryId ? "true" : undefined}
              aria-describedby={
                errors.categoryId ? "dish-category-error" : undefined
              }
              required
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="field-err" id="dish-category-error">
                {errors.categoryId}
              </p>
            )}
          </div>
        </div>
        <div className="col-12">
          <div className="field">
            <label htmlFor="dish-description">Description</label>
            <textarea
              id="dish-description"
              className="form-control"
              rows={3}
              value={values.description}
              onChange={(event) => setField("description", event.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <FormInput
            id="dish-image"
            label="Image path or URL"
            name="image"
            value={values.image}
            onChange={(event) => setField("image", event.target.value)}
            placeholder="/images/dish-name.jpg"
            required={false}
          />
        </div>
        <div className="col-md-6">
          <FormInput
            id="dish-image-square"
            label="Square image path or URL"
            name="imageSquare"
            value={values.imageSquare}
            onChange={(event) => setField("imageSquare", event.target.value)}
            required={false}
          />
        </div>
        <div className="col-12 d-flex flex-wrap gap-4">
          <label className="form-check-label">
            <input
              className="form-check-input me-2"
              type="checkbox"
              checked={values.isVegetarian}
              onChange={(event) =>
                setField("isVegetarian", event.target.checked)
              }
            />
            Vegetarian
          </label>
          <label className="form-check-label">
            <input
              className="form-check-input me-2"
              type="checkbox"
              checked={values.isAvailable}
              onChange={(event) =>
                setField("isAvailable", event.target.checked)
              }
            />
            Available to order
          </label>
        </div>
        <div className="col-12">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <h3 className="h5 mb-0">Optional extras</h3>
            <button
              type="button"
              className="btn-ghost sm"
              onClick={() =>
                setValues((current) => ({
                  ...current,
                  extras: [
                    ...current.extras,
                    { name: "", nameAr: "", price: "" },
                  ],
                }))
              }
            >
              Add extra
            </button>
          </div>
          {values.extras.map((extra, index) => (
            <div className="row g-2 align-items-end mb-3" key={index}>
              <div className="col-md-5">
                <FormInput
                  id={`dish-extra-${index}`}
                  label="Extra name"
                  name={`extra-${index}`}
                  value={extra.name}
                  onChange={(event) =>
                    changeExtra(index, "name", event.target.value)
                  }
                  error={errors[`extra-${index}`]}
                  required={false}
                />
              </div>
              <div className="col-md-5">
                <FormInput
                  id={`dish-extra-price-${index}`}
                  label="Extra price (USD)"
                  name={`extra-price-${index}`}
                  type="number"
                  value={extra.price}
                  onChange={(event) =>
                    changeExtra(index, "price", event.target.value)
                  }
                  error={errors[`extra-price-${index}`]}
                  min="0"
                  required={false}
                />
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn-ghost sm mb-3"
                  onClick={() =>
                    setValues((current) => ({
                      ...current,
                      extras: current.extras.filter((_, i) => i !== index),
                    }))
                  }
                  aria-label={`Remove extra ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="form-foot">
        <button type="submit" className="btn-solid" disabled={submitting}>
          {submitting ? "Saving…" : "Save dish"}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
