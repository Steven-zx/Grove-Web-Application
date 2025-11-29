
import React from "react";
import MobileNavbar from "../components/layout/MobileNavbar";
import MobileSidebar from "../components/layout/MobileSidebar";

export default function GalleryMobile() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <>
      <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="pt-24 text-center text-gray-600">
        <h2 className="text-2xl font-bold mb-2">Gallery (Mobile)</h2>
        <p>This is a placeholder for the mobile Gallery page.</p>
      </div>
    </>
  );
}
