// Profile Page

import React, { useState } from "react";
import { MapPin, Phone, Key } from "lucide-react";

function Profile() {
    // Placeholder user data, backend-ready
    const [user, setUser] = useState({
        name: "John Smith",
        location: "Block 3, Lot 8, Phase 2",
        contact: "09123456789",
        avatar: null, // Use first letter of name
    });
    const [editMode, setEditMode] = useState(false);
    const [editLocation, setEditLocation] = useState(user.location);
    const [editContact, setEditContact] = useState(user.contact);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        setUser({
            ...user,
            location: editLocation,
            contact: editContact,
        });
        setEditMode(false);
    };

    const handleCancel = () => {
        setEditLocation(user.location);
        setEditContact(user.contact);
        setEditMode(false);
    };

    return (
        <main className="bg-white min-h-screen max-w-screen-xl p-6" style={{ marginLeft: '3rem' }}>
            {/* Header */}
            <div className="pt-1 pb-5">
                <div className="inline-flex items-center gap-2 text-sm text-[#1E1E1E] bg-white px-4 py-2 rounded-lg border border-[#D9D9D9]">
                <span>Profile</span>
                </div>
            </div>
            <div className="w-full max-w-xl bg-white rounded-xl border border-gray-200 p-8 mb-8 ml-0">
                <div className="flex flex-col gap-4">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-[#E4E9E4] flex items-center justify-center text-4xl font-medium text-[#1E1E1E]">
                        {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" /> : user.name[0]}
                    </div>
                    {/* Name */}
                    <div className="text-2xl font-medium text-[#1E1E1E]">{user.name}</div>
                    {/* Location */}
                    <div className="flex items-center gap-2 text-[#222] font-medium">
                        <MapPin size={18} />
                        {editMode ? (
                            <input
                                type="text"
                                value={editLocation}
                                onChange={e => setEditLocation(e.target.value)}
                                className="border rounded px-2 py-1 w-full max-w-xs text-[#222] bg-[#FAFAFA]"
                            />
                        ) : (
                            user.location
                        )}
                    </div>
                    {/* Contact */}
                    <div className="flex items-center gap-2 text-[#222] font-medium">
                        <Phone size={18} />
                        {editMode ? (
                            <input
                                type="text"
                                value={editContact}
                                onChange={e => setEditContact(e.target.value)}
                                className="border rounded px-2 py-1 w-full max-w-xs text-[#222] bg-[#FAFAFA]"
                            />
                        ) : (
                            user.contact
                        )}
                    </div>
                    {/* Edit profile button */}
                    <div className="flex justify-end w-full">
                        {!editMode ? (
                            <button className="mt-4 px-4 py-2 rounded-full bg-[#40863A] text-white font-medium text-sm hover:bg-[#32692C] transition" style={{ minWidth: '120px' }} onClick={handleEdit}>Edit profile</button>
                        ) : (
                            <div className="flex gap-2 mt-4">
                                <button className="px-4 py-2 rounded-full bg-[#40863A] text-white font-medium text-sm hover:bg-[#32692C] transition" style={{ minWidth: '120px' }} onClick={handleSave}>Save</button>
                                <button className="px-4 py-2 rounded-full bg-gray-300 text-[#222] font-medium text-sm hover:bg-gray-400 transition" style={{ minWidth: '120px' }} onClick={handleCancel}>Cancel</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full max-w-xl bg-white rounded-xl border border-[#D9D9D9] p-8">
                <div className="mb-4 text-lg font-medium text-[#222]">Password</div>
                <div className="flex items-center gap-2 mb-4">
                    <Key size={18} />
                    <input type="password" value="************" readOnly className="border border-[#D9D9D9] rounded-lg px-3 py-2 w-full max-w-xs text-[#222] bg-[#FAFAFA]" />
                </div>
                <div className="flex justify-end w-full">
                    <button className="px-4 py-2 rounded-full bg-[#40863A] text-white font-medium text-sm hover:bg-[#32692C] transition" style={{ minWidth: '120px' }}>Change password</button>
                </div>
            </div>
        </main>
    );
}

export default Profile;
