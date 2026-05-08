import { useState } from "react";

// ── InputField Component ──────────────────────────────────────────────────────
function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error = "",
  disabled = false,
  required = false,
  hint = "",
}) {
  const [touched, setTouched] = useState(false);

  const showError = error && touched;

  const baseInput = `
    w-full px-3 py-2 rounded-lg border text-sm transition-all duration-150
    bg-white text-gray-900 placeholder-gray-400
    outline-none focus:ring-2
  `;

  const stateClasses = disabled
    ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
    : showError
    ? "border-red-400 focus:ring-red-100 focus:border-red-500"
    : "border-gray-300 focus:ring-blue-100 focus:border-blue-500";

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`${baseInput} ${stateClasses}`}
      />

      {/* Hint or Error */}
      {showError ? (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}

// ── Demo ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const errors = {
    name: form.name.length > 0 && form.name.length < 2 ? "Name must be at least 2 characters." : "",
    email: form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "Enter a valid email address." : "",
    age: form.age && (Number(form.age) < 1 || Number(form.age) > 120) ? "Age must be between 1 and 120." : "",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">InputField component demo</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          <InputField
            label="Full Name"
            value={form.name}
            onChange={set("name")}
            placeholder="Jane Doe"
            error={errors.name}
            required
            hint="First and last name"
          />
          <InputField
            label="Email"
            value={form.email}
            onChange={set("email")}
            type="text"
            placeholder="jane@example.com"
            error={errors.email}
            required
          />
          <InputField
            label="Age"
            value={form.age}
            onChange={set("age")}
            type="number"
            placeholder="25"
            error={errors.age}
            hint="Must be between 1–120"
          />
          <InputField
            label="Password"
            value={form.password}
            onChange={set("password")}
            type="password"
            placeholder="••••••••"
            required
            hint="Use 8+ characters"
          />
          <InputField
            label="Disabled Field"
            value="Read-only value"
            onChange={() => {}}
            disabled
            hint="This field cannot be edited"
          />

          <button className="mt-1 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}