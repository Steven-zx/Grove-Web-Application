// Admin Report Details Page
import React from "react";
import { ArrowLeft } from "lucide-react";

// Props: report (object), onBack (function), onDelete (function), onResolve (function)
function ReportDetails({ report, onBack, onDelete, onResolve }) {
    if (!report) return null;

    // Toggle status between resolved and unresolved
    function handleToggleResolved() {
        onResolve(report.id, report.status === "resolved" ? "unresolved" : "resolved");
    }

    return (
        <div className="flex flex-col min-h-screen bg-white w-full">
            <div className="flex items-center gap-3 pt-8 pl-8 relative">
                {/* Back arrow */}
                <button
                    type="button"
                    className="p-0 mr-2 text-[#1E1E1E] hover:opacity-70"
                    onClick={onBack}
                    title="Back"
                >
                    <ArrowLeft size={28} color="#1E1E1E" strokeWidth={2} />
                </button>
                {/* Status and actions */}
                <button
                    type="button"
                    className={
                        report.status === "resolved"
                            ? "px-3 py-1 rounded bg-[#EFEFEF] text-[#40863A] border border-[#40863A] text-xs font-medium cursor-pointer"
                            : "text-[#1E1E1E] text-xs font-medium cursor-pointer bg-transparent border-none px-0 py-0"
                    }
                    style={report.status === "resolved" ? {} : { background: "none", border: "none" }}
                    onClick={handleToggleResolved}
                >
                    {report.status === "resolved" ? "Marked as resolved" : "Mark as resolved"}
                </button>
                <button
                    type="button"
                    className="ml-2 p-0 text-[#1E1E1E] hover:opacity-70"
                    title="Delete report"
                    onClick={() => onDelete(report.id)}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.5 7.5V13M9 7.5V13M11.5 7.5V13M3 5.5H15M13.5 5.5V14.5C13.5 15.0523 13.0523 15.5 12.5 15.5H5.5C4.94772 15.5 4.5 15.0523 4.5 14.5V5.5M7.5 5.5V4.5C7.5 3.94772 7.94772 3.5 8.5 3.5H9.5C10.0523 3.5 10.5 3.94772 10.5 4.5V5.5" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            <div className="pl-8 pt-6">
                <h2 className="text-2xl font-medium mb-2">{report.type}</h2>
                <div className="flex items-center gap-3 mb-2">
                    {/* User avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#EFEFEF] flex items-center justify-center text-lg font-bold text-[#1E1E1E]">
                        {report.name ? report.name[0] : "?"}
                    </div>
                    {/* Username and date/time */}
                    <div className="flex items-center w-full">
                        <div className="font-medium text-lg text-[#1E1E1E]">{report.name}</div>
                        <div className="text-sm text-[#222] font-normal ml-auto">
                            {report.date ? report.date : ""}
                            {report.time ? `, ${report.time}` : ", 8:01 AM"}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10" /> {/* Spacer for avatar alignment */}
                    <div>
                        <div className="font-medium text-sm text-[#222]">Location: {report.location || "Lorem Ipsum"}</div>
                        <div className="font-medium text-sm text-[#222]">Email Address or Mobile No.: {report.contact || "09123456789"}</div>
                    </div>
                </div>
                <div className="mt-4 mb-6 text-sm  text-[#222] max-w-5xl">
                    {/* Description, backend ready */}
                    {report.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tristique, odio ut egestas egestas, elit purus suscipit nisi, non posuere dui purus in lectus. Quisque non tellus sit amet tellus rutrum aliquet. Nam aliquet erat vel vestibulum ullamcorper. In tempor risus magna, eget faucibus leo ornare quis."}
                </div>
                {/* Attachments */}
                <div className="mt-6">
                    <div className="font-medium mb-2">Attachments</div>
                    {report.attachments && report.attachments.length > 0 ? (
                        <div className="flex gap-4 flex-wrap">
                            {report.attachments.map((file, idx) => (
                                <div key={idx} className="border rounded bg-[#FAFAFA] p-2 w-40 flex flex-col items-center">
                                    <div className="mb-1 text-xs text-[#222] w-full truncate">{file.name}</div>
                                    <img src={file.url} alt={file.name} className="w-32 h-32 object-contain bg-[#EFEFEF]" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-[#888]">No attachments</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReportDetails;
