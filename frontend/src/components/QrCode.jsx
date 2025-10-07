import React, { useEffect } from "react";
import QRCode from "qrcode";
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
  const [qrCodeUrl, setQrCodeUrl] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
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
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

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
    
    // Generate QR code
    try {
      setIsGenerating(true);
      const qrData = {
        resident: form.resident,
        visitor: form.visitor,
        purpose: form.purpose,
        vehicle: form.vehicle || "N/A",
        residence: form.residence,
        numVisitors: form.numVisitors,
        date: form.date,
        generatedAt: new Date().toISOString()
      };
      
      const qrString = JSON.stringify(qrData);
      const qrCodeDataUrl = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrCodeDataUrl);
      setErrors({});
    } catch (error) {
      console.error('QR Code generation failed:', error);
      setErrors({ general: "Failed to generate QR code. Please try again." });
    } finally {
      setIsGenerating(false);
    }
  }

  function handleDownloadQR() {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = `visitor-qr-${form.visitor.replace(/\s+/g, '-')}-${form.date}.png`;
    link.href = qrCodeUrl;
    link.click();
  }

  function handlePrintQR() {
    if (!qrCodeUrl) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Visitor QR Code - ${form.visitor}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px; 
            }
            .qr-container { 
              margin: 20px auto; 
              max-width: 400px; 
            }
            .visitor-info { 
              margin: 20px 0; 
              text-align: left; 
            }
            .visitor-info h2 { 
              text-align: center; 
              color: #2d5a27; 
            }
            .info-item { 
              margin: 8px 0; 
              padding: 5px 0; 
              border-bottom: 1px solid #eee; 
            }
            .label { 
              font-weight: bold; 
              color: #333; 
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h2>Grove Web Application</h2>
            <h3>Visitor Entry QR Code</h3>
            <img src="${qrCodeUrl}" alt="QR Code" />
            <div class="visitor-info">
              <div class="info-item">
                <span class="label">Visitor:</span> ${form.visitor}
              </div>
              <div class="info-item">
                <span class="label">Resident:</span> ${form.resident}
              </div>
              <div class="info-item">
                <span class="label">Purpose:</span> ${form.purpose}
              </div>
              <div class="info-item">
                <span class="label">Residence:</span> ${form.residence}
              </div>
              <div class="info-item">
                <span class="label">Date:</span> ${form.date}
              </div>
              <div class="info-item">
                <span class="label">Number of Visitors:</span> ${form.numVisitors}
              </div>
              ${form.vehicle ? `<div class="info-item"><span class="label">Vehicle:</span> ${form.vehicle}</div>` : ''}
            </div>
            <p style="font-size: 12px; color: #666;">
              Generated on: ${new Date().toLocaleString()}
            </p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  function handleNewQR() {
    setQrCodeUrl("");
    setForm({
      resident: "",
      purpose: "",
      visitor: "",
      vehicle: "",
      residence: "",
      numVisitors: "1",
      date: ""
    });
    setErrors({});
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.25)" }}>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-2xl text-[#1e1e1e] hover:text-[#1e1e1e]"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        
        {!qrCodeUrl ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Generate visitor QR code</h2>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {errors.general}
              </div>
            )}
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
                <GreenButton type="submit" disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate QR code"}
                </GreenButton>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Your Visitor QR Code</h2>
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <img 
                  src={qrCodeUrl} 
                  alt="Visitor QR Code" 
                  className="mx-auto mb-4"
                />
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Visitor:</strong> {form.visitor}</p>
                  <p><strong>Resident:</strong> {form.resident}</p>
                  <p><strong>Purpose:</strong> {form.purpose}</p>
                  <p><strong>Residence:</strong> {form.residence}</p>
                  <p><strong>Date:</strong> {form.date}</p>
                  <p><strong>Number of Visitors:</strong> {form.numVisitors}</p>
                  {form.vehicle && <p><strong>Vehicle:</strong> {form.vehicle}</p>}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download QR Code
                </button>
                <button
                  type="button"
                  onClick={handlePrintQR}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Print QR Code
                </button>
                <button
                  type="button"
                  onClick={handleNewQR}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Generate New QR
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
