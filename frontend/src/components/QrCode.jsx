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

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState("");

  async function handleSubmit(e) {
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

    try {
      setLoading(true);
      const response = await fetch('/api/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resident_name: form.resident,
          full_name: form.visitor,
          visit_date: form.date,
          visit_purpose: form.purpose,
          mobile_number: form.residence, // Note: this might need adjustment based on your form structure
          vehicle_info: form.vehicle,
          residence_address: form.residence,
          num_visitors: form.numVisitors
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate QR code');
      }

      setSuccess(`QR code generated successfully! Code: ${data.qr_code}`);
      setErrors({});
      
      // Reset form after successful submission
      setTimeout(() => {
        setForm({
          resident: "",
          purpose: "",
          visitor: "",
          vehicle: "",
          residence: "",
          numVisitors: "1",
          date: ""
        });
        setSuccess("");
        onClose();
      }, 2000);
      
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
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
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {errors.general}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-1 text-gray-800">
              <span className="text-red-500 mr-1">*</span>Resident’s name
            </label>
            <input name="resident" value={form.resident} onChange={handleChange} type="text" className="w-full rounded-lg border border-gray-300 p-3 mb-2" placeholder="Your full name" required />
            {errors.resident && <div className="text-red-500 text-xs mb-2">{errors.resident}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">
              <span className="text-red-500 mr-1">*</span>Purpose of visit
            </label>
            <div className="relative">
              <select name="purpose" value={form.purpose} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-3 pr-10 mb-2 appearance-none" required>
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
            <input name="visitor" value={form.visitor} onChange={handleChange} type="text" className="w-full rounded-lg border border-gray-300 p-3 mb-2" placeholder="Visitor’s full name" required />
            {errors.visitor && <div className="text-red-500 text-xs mb-2">{errors.visitor}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">Vehicle (if any)</label>
            <input name="vehicle" value={form.vehicle} onChange={handleChange} type="text" className="w-full rounded-lg border border-gray-300 p-3 mb-2" placeholder="Vehicle model and plate number" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">
              <span className="text-red-500 mr-1">*</span>Residence to visit
            </label>
            <input name="residence" value={form.residence} onChange={handleChange} type="text" className="w-full rounded-lg border border-gray-300 p-3 mb-2" placeholder="House block and lot number" required />
            {errors.residence && <div className="text-red-500 text-xs mb-2">{errors.residence}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">
              <span className="text-red-500 mr-1">*</span>Number of visitors
            </label>
            <input name="numVisitors" value={form.numVisitors} onChange={handleChange} type="number" min="1" className="w-full rounded-lg border border-gray-300 p-3 mb-2" placeholder="1" required />
            {errors.numVisitors && <div className="text-red-500 text-xs mb-2">{errors.numVisitors}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#1e1e1e]">
              <span className="text-red-500 mr-1">*</span>Visit date
            </label>
            <input name="date" value={form.date} onChange={handleChange} type="date" className="w-full rounded-lg border border-gray-300 p-3 mb-2" placeholder="mm/dd/yyyy" required />
            {errors.date && <div className="text-red-500 text-xs mb-2">{errors.date}</div>}
          </div>
        <div className="flex justify-end mt-8">
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-full font-semibold bg-[#40863A] text-white hover:bg-[#35702c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate QR code'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
