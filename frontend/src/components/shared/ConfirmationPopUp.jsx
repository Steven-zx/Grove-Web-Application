import React from "react";

/**
 * ConfirmationPopUp
 * Props:
 * - open: boolean (controls visibility)
 * - title: string (main message)
 * - description: string (optional details)
 * - confirmText: string (confirm button label)
 * - cancelText: string (cancel button label)
 * - onConfirm: function (called when confirm is clicked)
 * - onCancel: function (called when cancel is clicked)
 */
export default function ConfirmationPopUp({
	open,
	title = "Are you sure?",
	description = "",
	confirmText = "Confirm",
	cancelText = "Cancel",
	onConfirm,
	onCancel,
}) {
	if (!open) return null;
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
			style={{ backdropFilter: 'blur(2px)' }}
		>
			<div
				className="bg-white rounded-xl shadow-2xl p-6 max-w-xs w-full flex flex-col items-center"
				style={{ minWidth: 280 }}
			>
				<div className="font-semibold text-lg mb-2 text-center">{title}</div>
				{description && (
					<div className="text-sm text-gray-600 mb-4 text-center">{description}</div>
				)}
				<div className="flex gap-3 mt-2 w-full justify-center">
					<button
						className="px-4 py-2 rounded bg-[#1e1e1e] text-white font-medium hover:bg-[#333] transition-colors"
						onClick={onConfirm}
					>
						{confirmText}
					</button>
					<button
						className="px-4 py-2 rounded bg-gray-200 text-[#1e1e1e] font-medium hover:bg-gray-300 transition-colors"
						onClick={onCancel}
					>
						{cancelText}
					</button>
				</div>
			</div>
		</div>
	);
}
