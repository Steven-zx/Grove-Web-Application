import React from "react";

export default function AnnouncementCard({ author, date, content, image }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#40863A]">A</div>
        <div>
          <div className="font-semibold text-[#1e1e1e]">{author}</div>
          <div className="text-xs text-gray-400">{date}</div>
        </div>
      </div>
      <div className="text-sm text-[#1e1e1e] mb-2">{content}</div>
      {image && <img src={image} alt="Announcement" className="rounded-xl w-full object-cover max-h-96" />}
    </div>
  );
}
