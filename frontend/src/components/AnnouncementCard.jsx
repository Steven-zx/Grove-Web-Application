import React from "react";

export default function AnnouncementCard({ author, date, content, title, importance, category, image }) {
  const getImportanceColor = (importance) => {
    switch (importance?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#40863A]">A</div>
          <div>
            <div className="font-semibold text-[#1e1e1e]">{author}</div>
            <div className="text-xs text-gray-400">{date}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {category && (
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
              {category}
            </span>
          )}
          {importance && (
            <span className={`px-2 py-1 text-xs rounded-full ${getImportanceColor(importance)}`}>
              {importance}
            </span>
          )}
        </div>
      </div>
      
      {title && (
        <h3 className="font-bold text-lg text-[#1e1e1e] mb-1">{title}</h3>
      )}
      
      <div className="text-sm text-[#1e1e1e] mb-2">{content}</div>
      {image && <img src={image} alt="Announcement" className="rounded-xl w-full object-cover max-h-96" />}
    </div>
  );
}
