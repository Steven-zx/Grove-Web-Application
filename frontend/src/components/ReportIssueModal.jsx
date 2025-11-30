import React from "react";

const ISSUE_TYPES = [
  "Noise", "Maintenance", "Safety", "Other"
];

export default function ReportIssueModal({ open, onClose }) {
  const [form, setForm] = React.useState({
    name: "",
    location: "",
    type: "",
    contact: "",
    description: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Submit logic here
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.25)" }}>
      <div
        className="relative bg-white rounded-2xl shadow-xl p-4 sm:p-8 w-[90vw] md:w-[55vw] max-w-xs sm:max-w-sm md:max-w-xs min-h-[40vh] max-h-[90vh] mx-2 flex flex-col"
        style={{ minWidth: '0', maxWidth: '100%', boxSizing: 'border-box', minHeight: '40vh', maxHeight: '90vh' }}
      >
        <button
          className="absolute top-4 right-4 text-2xl text-[#1e1e1e] hover:text-[#1e1e1e] cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6">Report an issue</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">
              <span className="text-red-500 mr-1">*</span>Name
            </label>
            <input name="name" value={form.name} onChange={handleChange} type="text" className="w-full rounded-lg border border-[#D9D9D9] p-3 mb-2" placeholder="Your full name" required />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">
              <span className="text-red-500 mr-1">*</span>Location
            </label>
            <input name="location" value={form.location} onChange={handleChange} type="text" className="w-full rounded-lg border border-[#D9D9D9] p-3 mb-2" placeholder="Where is the issue located?" required />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">
              <span className="text-red-500 mr-1">*</span>Issue type
            </label>
            <div className="relative">
              <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-lg border border-[#D9D9D9] p-3 pr-10 mb-2 appearance-none" required>
                <option value="" disabled>Select issue type</option>
                {ISSUE_TYPES.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">
              <span className="text-red-500 mr-1">*</span>Email address or mobile number
            </label>
            <input name="contact" value={form.contact} onChange={handleChange} type="text" className="w-full rounded-lg border border-[#D9D9D9] p-3 mb-2" placeholder="Your email address or mobile number" required />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1 text-[#1e1e1e]">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full rounded-lg border border-[#D9D9D9] p-3 mb-2" rows={4} placeholder="Please describe the issue in detail." />
          </div>
          <div className="md:col-span-2 flex justify-end mt-4">
            <button type="submit" className="rounded-full bg-[#40863A] text-white font-semibold px-8 py-3 text-base hover:bg-[#35702c] transition-colors cursor-pointer">Submit report</button>
          </div>
        </form>
      </div>
    </div>
  );
}
