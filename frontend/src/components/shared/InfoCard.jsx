import React from "react";

export default function InfoCard({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white flex flex-col items-start gap-2">
      <div className="flex items-center gap-2 mb-2 p-8 pb-2">
        {icon && <span className="text-green-600">{icon}</span>}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="text-sm text-gray-600 p-8 pt-0">
        {children}
      </div>
    </div>
  );
}