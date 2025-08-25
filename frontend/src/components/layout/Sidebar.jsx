import React from "react";
import { NavLink } from "react-router-dom";
import { Home as HomeIcon, Bell, Image, Info, List } from "lucide-react";
import logo from "../../assets/logo.svg";

const nav = [
  { to: "/", label: "Home", icon: <HomeIcon size={18} /> },
  { to: "/announcements", label: "Announcements", icon: <Bell size={18} /> },
  { to: "/amenities", label: "Amenities", icon: <List size={18} /> },
  { to: "/gallery", label: "Gallery", icon: <Image size={18} /> },
  { to: "/about", label: "About", icon: <Info size={18} /> },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col h-screen">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <img src={logo} alt="Logo" className="h-10" />
          <h1 className="text-xl font-bold text-green-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${isActive ? "bg-[#E5EBE0] text-gray-900" : "bg-white text-gray-800 hover:bg-[#EFEFEF]"}
                `
              }
            >
              {item.icon}
              <span>{item.label}</span>
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
