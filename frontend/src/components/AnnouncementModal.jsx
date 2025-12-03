import React from "react";
import { X } from "lucide-react";

export default function AnnouncementModal({ announcement, onClose }) {
  if (!announcement) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#40863A] flex items-center justify-center font-bold text-white text-lg">
              A
            </div>
            <div>
              <div className="font-semibold text-[#1e1e1e]">{announcement.author}</div>
              <div className="text-sm text-gray-500">{announcement.date}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Tags */}
          <div className="flex gap-2 mb-4">
            {announcement.category && (
              <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium">
                {announcement.category}
              </span>
            )}
            {announcement.importance && (
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${getImportanceColor(announcement.importance)}`}>
                {announcement.importance}
              </span>
            )}
          </div>

          {/* Title */}
          {announcement.title && (
            <h2 className="font-bold text-2xl text-[#1e1e1e] mb-4">
              {announcement.title}
            </h2>
          )}

          {/* Image */}
          {announcement.image && (
            <div className="mb-6">
              <img 
                src={announcement.image} 
                alt={announcement.title || "Announcement"} 
                className="rounded-xl w-full object-cover max-h-[500px]"
              />
            </div>
          )}

          {/* Description */}
          <div className="text-base text-[#1e1e1e] leading-relaxed whitespace-pre-wrap">
            {announcement.content}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-[#40863A] text-white font-semibold py-3 rounded-full hover:bg-[#35702c] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
