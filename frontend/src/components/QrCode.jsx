import React, { useEffect } from "react";
import GreenButton from "./ui/GreenButton";

const PURPOSE_OPTIONS = ["Delivery", "Maintenance", "Guest", "Other"];

export default function QrCodeModal({ open, onClose }) {
  const [form, setForm] = React.useState({
    resident: "",
    purpose: "",
    visitor: "",
    vehicle: "",
    residence: "",
    numVisitors: "1",
    date: ""
  });
  const [errors, setErrors] = React.useState({});
  useEffect(() => {
    if (open) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = scrollBarWidth > 0 ? `${scrollBarWidth}px` : '';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    };
  }, [open]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!form.resident) newErrors.resident = "Please fill out this field";
    if (!form.purpose) newErrors.purpose = "Please fill out this field";
    if (!form.visitor) newErrors.visitor = "Please fill out this field";
    if (!form.residence) newErrors.residence = "Please fill out this field";
    if (!form.numVisitors) newErrors.numVisitors = "Please fill out this field";
    if (!form.date) newErrors.date = "Please fill out this field";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstError = Object.keys(newErrors)[0];
      const el = document.querySelector(`[name='${firstError}']`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    // Submit logic here
    setErrors({});
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.25)" }}>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full relative">
        <button
          className="absolute top-4 right-4 text-2xl text-[#1e1e1e] hover:text-[#1e1e1e]"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6">Generate visitor QR code</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-1 text-gray-800">
              <span className="text-red-500 mr-1">*</span>Resident’s name
            </label>
            <input name="resident" value={form.resident} onChange={handleChange} type="text" className="w-full rounded-lg border border-[#D9D9D9] p-3 mb-2" placeholder="Your full name" required />
            {errors.resident && <div className="text-red-500 text-xs mb-2">{errors.resident}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">
              <span className="text-red-500 mr-1">*</span>Purpose of visit
            </label>
            <div className="relative">
              <select name="purpose" value={form.purpose} onChange={handleChange} className="w-full rounded-lg border border-[#D9D9D9] p-3 pr-10 mb-2 appearance-none" required>
            {errors.purpose && <div className="text-red-500 text-xs mb-2">{errors.purpose}</div>}
                <option value="" disabled>Select purpose</option>
                {PURPOSE_OPTIONS.map(opt => (
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
              <span className="text-red-500 mr-1">*</span>Visitor’s name
            </label>
            <input name="visitor" value={form.visitor} onChange={handleChange} type="text" className="w-full rounded-lg border border-[#D9D9D9] p-3 mb-2" placeholder="Visitor’s full name" required />
            {errors.visitor && <div className="text-red-500 text-xs mb-2">{errors.visitor}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">Vehicle (if any)</label>
            <input name="vehicle" value={form.vehicle} onChange={handleChange} type="text" className="w-full rounded-lg border border-[#D9D9D9] p-3 mb-2" placeholder="Vehicle model and plate number" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">
              <span className="text-red-500 mr-1">*</span>Residence to visit
            </label>
            <input name="residence" value={form.residence} onChange={handleChange} type="text" className="w-full rounded-lg border border-[#D9D9D9] p-3 mb-2" placeholder="House block and lot number" required />
            {errors.residence && <div className="text-red-500 text-xs mb-2">{errors.residence}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">
              <span className="text-red-500 mr-1">*</span>Number of visitors
            </label>
            <input name="numVisitors" value={form.numVisitors} onChange={handleChange} type="number" min="1" className="w-full rounded-lg border border-[#D9D9D9] p-3 mb-2" placeholder="1" required />
            {errors.numVisitors && <div className="text-red-500 text-xs mb-2">{errors.numVisitors}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">
              <span className="text-red-500 mr-1">*</span>Visit date
            </label>
            <input name="date" value={form.date} onChange={handleChange} type="date" className="w-full rounded-lg border border-[#D9D9D9] p-3 mb-2" placeholder="mm/dd/yyyy" required />
            {errors.date && <div className="text-red-500 text-xs mb-2">{errors.date}</div>}
          </div>
        <div className="flex justify-end mt-8">
          <GreenButton type="submit">Generate QR code</GreenButton>
        </div>
      </form>
      </div>
    </div>
  );
}
