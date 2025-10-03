import React from "react";

/**
 * FiltersCard - reusable filter card for admin/user pages
 * Props:
 * - title: string (e.g. "Filters")
 * - fields: array of { label, name, type, options? } (type: "select" | "date" | "text")
 * - values: object (current filter values)
 * - onChange: function (handle change)
 * - onSubmit: function (handle submit)
 * - submitText: string (button label)
 */
export default function FiltersCard({
  title = "Filters",
  fields = [],
  values = {},
  onChange,
  onSubmit,
  submitText = "Find",
}) {
  return (
    <form className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-4" onSubmit={onSubmit}>
      <h3 className="font-bold mb-2">{title}</h3>
      {fields.map(field => (
        <div key={field.name}>
          <label className="block text-sm font-medium mb-1">{field.label}</label>
          {field.type === "select" ? (
            <select
              name={field.name}
              value={values[field.name] || ""}
              onChange={onChange}
              className="w-full rounded-lg border border-[#D9D9D9] p-2"
            >
              {field.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.type === "date" ? (
            <input
              type="date"
              name={field.name}
              value={values[field.name] || ""}
              onChange={onChange}
              className="w-full rounded-lg border border-[#D9D9D9] p-2"
            />
          ) : (
            <input
              type="text"
              name={field.name}
              value={values[field.name] || ""}
              onChange={onChange}
              className="w-full rounded-lg border border-[#D9D9D9] p-2"
            />
          )}
        </div>
      ))}
      <button type="submit" className="rounded-full bg-[#40863A] text-white font-semibold px-6 py-2 mt-2 hover:bg-[#35702c] transition-colors">{submitText}</button>
    </form>
  );
}
