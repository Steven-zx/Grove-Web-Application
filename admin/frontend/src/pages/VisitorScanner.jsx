import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Camera, X, CheckCircle, XCircle, User, Calendar, Home, Car, Users, Target, Upload } from "lucide-react";

export default function VisitorScanner() {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cameraPermission, setCameraPermission] = useState(null);
  const codeReaderRef = useRef(null);
  const [visitors, setVisitors] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const imgPreviewRef = useRef(null);
  const fileInputRef = useRef(null);
  const clearUploadedImage = () => {
    setUploadedImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    // Load visitors from localStorage on mount
    const stored = localStorage.getItem('scannedVisitors');
    if (stored) {
      setVisitors(JSON.parse(stored));
    }
  }, []);

  const saveVisitor = (visitorData) => {
    const newVisitor = {
      ...visitorData,
      scannedAt: new Date().toISOString(),
      id: Date.now()
    };
    const updated = [newVisitor, ...visitors];
    setVisitors(updated);
    localStorage.setItem('scannedVisitors', JSON.stringify(updated));
  };

  const startScanning = async () => {
    setError("");
    setSuccess("");
    setScannedData(null);

    try {
      if (!window.isSecureContext) {
        throw new Error("Camera requires a secure context (HTTPS/localhost)");
      }

      // Initialize QR code reader
      codeReaderRef.current = new BrowserMultiFormatReader();
      
      setIsScanning(true);

      // Start decoding
      if (videoRef.current) {
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.muted = true;
        videoRef.current.onloadedmetadata = () => {
          try { videoRef.current.play(); } catch (_) {}
        };
      }

      const deviceId = selectedCameraId || undefined;
      await codeReaderRef.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            handleScanSuccess(result.getText());
          }
          if (err && err.name !== "NotFoundException") {
            // surface intermittent errors only for debugging
            console.debug("ZXing video decode warning:", err);
          }
        }
      );
      setCameraPermission(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraPermission(false);
      setError(err?.message || "Unable to access camera. Please grant camera permission and try again.");
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };
  // Load available video input devices (cameras)
  useEffect(() => {
    async function loadDevices() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter(d => d.kind === "videoinput");
        setCameras(cams);
        // Prefer back/environment camera where label hints at facing
        const envCam = cams.find(c => /back|environment/i.test(c.label));
        setSelectedCameraId(envCam?.deviceId || cams[0]?.deviceId || "");
      } catch (e) {
        console.debug("enumerateDevices failed", e);
      }
    }
    loadDevices();
  }, []);

  const scanFromImageElement = async (imgEl, objectUrl) => {
    if (!codeReaderRef.current) {
      codeReaderRef.current = new BrowserMultiFormatReader();
    }
    try {
      let result;
      if (objectUrl && typeof codeReaderRef.current.decodeFromImageUrl === "function") {
        try {
          result = await codeReaderRef.current.decodeFromImageUrl(objectUrl);
          handleScanSuccess(result.getText());
          return;
        } catch (e) {
          // fall through to element/canvas methods
          console.debug("decodeFromImageUrl failed, trying element/canvas", e);
        }
      }
      if (typeof codeReaderRef.current.decodeFromImageElement === "function") {
        result = await codeReaderRef.current.decodeFromImageElement(imgEl);
      } else if (typeof codeReaderRef.current.decodeFromImage === "function") {
        result = await codeReaderRef.current.decodeFromImage(imgEl);
      } else if (typeof codeReaderRef.current.decodeFromCanvas === "function") {
        const sourceW = imgEl.naturalWidth || imgEl.width;
        const sourceH = imgEl.naturalHeight || imgEl.height;
        const scale = Math.min(800 / Math.max(sourceW, sourceH), 2);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(sourceW * scale);
        canvas.height = Math.round(sourceH * scale);
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
        result = await codeReaderRef.current.decodeFromCanvas(canvas);
      } else {
        throw new Error("Image decoding not supported in this ZXing build");
      }
      handleScanSuccess(result.getText());
    } catch (e) {
      console.error("Image decode error:", e);
      setError(e?.message || "Unable to read QR code from image. Please upload a clear, well-lit QR.");
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleImageUpload = async (evt) => {
    setError("");
    setSuccess("");
    const file = evt.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setUploadedImageUrl(objectUrl);
    // Create an Image element to feed into ZXing
    const img = new Image();
    img.onload = async () => {
      await scanFromImageElement(img, objectUrl);
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      setError("Could not load image for scanning.");
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  const handleScanSuccess = (qrText) => {
    try {
      const data = JSON.parse(qrText);
      
      // Validate that it's visitor data
      if (data.visitor && data.resident && data.purpose) {
        setScannedData(data);
        saveVisitor(data);
        setSuccess(`Visitor "${data.visitor}" checked in successfully!`);
        stopScanning();
        
        // Auto-clear success message after 5 seconds
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError("Invalid QR code format. Please use a valid visitor QR code.");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setError("Unable to read QR code. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all visitor history?")) {
      setVisitors([]);
      localStorage.removeItem('scannedVisitors');
      setSuccess("Visitor history cleared.");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (isScanning) {
        stopScanning();
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Visitor QR Scanner</h1>
        <p className="text-gray-600">Scan visitor QR codes to log entry</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <XCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Scanner Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-stretch">
        {/* Left: Camera Scanner */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Camera size={24} />
            Live Camera Scanner
          </h2>

          {/* Camera selector */}
          {cameras.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Select camera</label>
              <select
                value={selectedCameraId}
                onChange={(e) => setSelectedCameraId(e.target.value)}
                className="px-3 py-2 border rounded w-full"
              >
                {cameras.map((c) => (
                  <option key={c.deviceId} value={c.deviceId}>
                    {c.label || `Camera ${c.deviceId.slice(0,6)}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Main content area */}
          {!isScanning && (
            <div className="text-center py-8 flex-1">
              <div className="mb-4">
                <Camera size={64} className="mx-auto text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">Click the button below to start scanning</p>
              {cameraPermission === false && (
                <p className="text-red-600 text-sm mt-4">
                  Camera permission denied. Please enable camera access in your browser settings.
                </p>
              )}
            </div>
          )}

          {isScanning && (
            <div className="flex-1">
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 border-4 border-[#40863A] pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white rounded-lg"></div>
                </div>
              </div>
              <p className="text-gray-600 text-center">Position the QR code within the frame</p>
            </div>
          )}

          {/* Bottom-aligned action button */}
          <div className="mt-auto text-center">
            {!isScanning ? (
              <button
                onClick={startScanning}
                className="px-6 py-3 bg-[#40863A] text-white rounded-lg hover:bg-[#356d2f] transition-colors inline-flex items-center gap-2 mx-auto"
              >
                <Camera size={20} />
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopScanning}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2 mx-auto"
              >
                <X size={20} />
                Stop Scanning
              </button>
            )}
          </div>
        </div>

        {/* Right: Upload Image Scanner */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-4">Upload QR Image</h2>
          <p className="text-gray-600 mb-3">Upload a clear PNG/JPG of the QR code.</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Preview area (fills available space) */}
          {uploadedImageUrl ? (
            <div className="flex justify-center flex-1 mb-8">
              <div className="relative">
                <img
                  ref={imgPreviewRef}
                  src={uploadedImageUrl}
                  alt="QR preview"
                  className="max-h-80 h-auto border-4 border-[#40863A] rounded-lg"
                />
                <button
                  type="button"
                  onClick={clearUploadedImage}
                  aria-label="Clear uploaded image"
                  className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 min-h-[320px] w-full max-w-[400px] text-center text-gray-500 flex-1 flex items-center justify-center mx-auto mb-8">
              No image selected yet
            </div>
          )}

          {/* Bottom-centered upload action */}
          <div className="mt-auto text-center">
            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="px-6 py-3 bg-[#40863A] text-white rounded-lg hover:bg-[#356d2f] transition-colors inline-flex items-center gap-2 mx-auto"
            >
              <Upload size={20} />
              Upload QR Image
            </button>
          </div>
        </div>
      </div>

      {/* Scanned Data Display */}
      {scannedData && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-green-500">
          <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center gap-2">
            <CheckCircle size={24} />
            Visitor Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User size={20} className="text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Visitor Name</p>
                <p className="font-semibold text-lg">{scannedData.visitor}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User size={20} className="text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Resident</p>
                <p className="font-semibold text-lg">{scannedData.resident}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target size={20} className="text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Purpose</p>
                <p className="font-semibold text-lg">{scannedData.purpose}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Home size={20} className="text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Residence</p>
                <p className="font-semibold text-lg">{scannedData.residence}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Car size={20} className="text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-semibold text-lg">{scannedData.vehicle || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users size={20} className="text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Number of Visitors</p>
                <p className="font-semibold text-lg">{scannedData.numVisitors}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Visit Date</p>
                <p className="font-semibold text-lg">{scannedData.date}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">QR Generated</p>
                <p className="font-semibold text-lg">{formatDate(scannedData.generatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visitor History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users size={24} />
            Recent Visitors ({visitors.length})
          </h2>
          {visitors.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
        
        {visitors.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No visitors scanned yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Visitor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Resident</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Purpose</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Residence</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vehicle</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Scanned At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{visitor.visitor}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{visitor.resident}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{visitor.purpose}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{visitor.residence}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{visitor.vehicle || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(visitor.scannedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
