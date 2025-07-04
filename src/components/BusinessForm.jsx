import "./BusinessForm.css";

function BusinessForm({ form, onChange, onSubmit, loading, errors, touched }) {
  return (
    <form className="business-form" onSubmit={onSubmit} autoComplete="off" aria-label="Business Search Form" noValidate>
      <label htmlFor="name" className="business-label">Business Name</label>
      <input
        id="name"
        type="text"
        name="name"
        placeholder="e.g. Cake & Co"
        value={form.name}
        onChange={onChange}
        required
        autoComplete="off"
        className={errors.name && touched.name ? "input-error" : ""}
      />
      {errors.name && touched.name && <div className="input-error-message">{errors.name}</div>}
      <label htmlFor="location" className="business-label">Location</label>
      <input
        id="location"
        type="text"
        name="location"
        placeholder="e.g. Mumbai"
        value={form.location}
        onChange={onChange}
        required
        autoComplete="off"
        className={errors.location && touched.location ? "input-error" : ""}
      />
      {errors.location && touched.location && <div className="input-error-message">{errors.location}</div>}
      <button type="submit" disabled={loading} aria-busy={loading}>
        Submit
      </button>
    </form>
  );
}

export default BusinessForm; 