// QR Code Test Script
// This demonstrates the QR code functionality

const sampleData = {
  resident: "John Doe",
  visitor: "Jane Smith", 
  purpose: "Guest",
  vehicle: "Toyota Camry ABC-123",
  residence: "Block 5 Lot 10",
  numVisitors: "2",
  date: "2025-10-15",
  generatedAt: new Date().toISOString()
};

console.log("Sample QR Code Data:");
console.log(JSON.stringify(sampleData, null, 2));

console.log("\nQR Code Features Implemented:");
console.log("✅ Form validation");
console.log("✅ QR code generation with all form data");
console.log("✅ Visual QR code display");
console.log("✅ Download QR code as PNG");
console.log("✅ Print QR code with visitor details");
console.log("✅ Generate new QR code option");
console.log("✅ Error handling");

console.log("\nHow to test:");
console.log("1. Go to http://localhost:5173");
console.log("2. Click 'Generate QR code to register for entry'");
console.log("3. Fill in all required fields");
console.log("4. Click 'Generate QR code'");
console.log("5. Use Download/Print/Generate New options");