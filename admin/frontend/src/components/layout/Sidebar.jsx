import React from "react";
import { NavLink } from "react-router-dom";
import { Home as Bell, Image, Flag, List, Calendar, ScanLine } from "lucide-react";
import logo from "../../assets/logo.svg";

const nav = [
  { to: "/announcements", label: "Announcements", icon: <Bell size={24} /> },
  { to: "/amenities", label: "Amenities", icon: <List size={24} /> },
  { to: "/gallery", label: "Gallery", icon: <Image size={24} /> },
  { to: "/reports", label: "Reports", icon: <Flag size={24} /> },
  { to: "/visitor-scanner", label: "Visitor Scanner", icon: <ScanLine size={24} /> },
];

export default function Sidebar() {
  return (
  <aside className="fixed top-0 left-0 h-screen w-74 bg-white p-4 flex flex-col z-30">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <img src={logo} alt="Logo" className="h-10" />
          <h1 className="text-xl font-bold" style={{ color: '#40863A', fontFamily: 'Montserrat, sans-serif' }}>
            Augustine Grove
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-4 rounded-r-lg transition-colors text-lg font-medium
                ${isActive ? "bg-[#E5EBE0] text-gray-900" : "bg-white text-gray-800 hover:bg-[#EFEFEF]"}
                `
              }
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              {item.icon}
              <span className="text-[1.15rem]">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="mt-auto text-xs text-gray-400 text-center">
        © 2025 Augustine Grove by Aser’s Angels
      </div>
    </aside>
  );
}
