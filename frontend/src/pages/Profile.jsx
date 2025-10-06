// Profile Page

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Key, AlertCircle } from "lucide-react";
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editContact, setEditContact] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [updating, setUpdating] = useState(false);

    // Load user profile on component mount
    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const profileData = await profileService.getProfile();
            setUser(profileData);
            setEditFirstName(profileData.first_name || '');
            setEditLastName(profileData.last_name || '');
            setEditLocation(profileData.address || '');
            setEditContact(profileData.phone || '');
        } catch (err) {
            setError('Failed to load profile: ' + err.message);
            console.error('Profile load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            setUpdating(true);
            setError('');

            const updateData = {
                firstName: editFirstName,
                lastName: editLastName,
                phone: editContact,
                address: editLocation,
            };

            await profileService.updateProfile(updateData);
            
            // Update local user state
            setUser(prev => ({
                ...prev,
                first_name: editFirstName,
                last_name: editLastName,
                phone: editContact,
                address: editLocation,
            }));

            setEditMode(false);
            console.log('✅ Profile updated successfully');
        } catch (err) {
            setError('Failed to update profile: ' + err.message);
            console.error('Profile update error:', err);
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        setEditFirstName(user?.first_name || '');
        setEditLastName(user?.last_name || '');
        setEditLocation(user?.address || '');
        setEditContact(user?.phone || '');
        setEditMode(false);
    };

    const handleChangePassword = async () => {
        try {
            setPasswordError('');
            
            if (!currentPassword || !newPassword || !confirmPassword) {
                setPasswordError('All fields are required');
                return;
            }

            if (newPassword !== confirmPassword) {
                setPasswordError('New passwords do not match');
                return;
            }

            if (newPassword.length < 6) {
                setPasswordError('New password must be at least 6 characters long');
                return;
            }

            setUpdating(true);

            await profileService.changePassword({
                currentPassword,
                newPassword
            });

            // Reset form and close modal
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordModal(false);
            setPasswordError('');
            
            console.log('✅ Password changed successfully');
        } catch (err) {
            setPasswordError(err.message);
            console.error('Password change error:', err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <main className="bg-white min-h-screen max-w-screen-xl p-6" style={{ marginLeft: '3rem' }}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading profile...</div>
                </div>
            </main>
        );
    }

    if (error && !user) {
        return (
            <main className="bg-white min-h-screen max-w-screen-xl p-6" style={{ marginLeft: '3rem' }}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-red-600 flex items-center gap-2">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    const fullName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '';
    const avatarLetter = fullName ? fullName.charAt(0).toUpperCase() : 'U';

    return (
        <main className="bg-white min-h-screen max-w-screen-xl p-6" style={{ marginLeft: '3rem' }}>
            {/* Header */}
            <div className="pt-1 pb-5">
                <div className="inline-flex items-center gap-2 text-sm text-[#1E1E1E] bg-white px-4 py-2 rounded-lg border border-[#D9D9D9]">
                    <span>Profile</span>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="w-full max-w-xl mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle size={16} />
                        <span className="text-sm">{error}</span>
                    </div>
                </div>
            )}

            {/* Profile Information */}
            <div className="w-full max-w-xl bg-white rounded-xl border border-gray-200 p-8 mb-8 ml-0">
                <div className="flex flex-col gap-4">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-[#E4E9E4] flex items-center justify-center text-4xl font-medium text-[#1E1E1E]">
                        {avatarLetter}
                    </div>

                    {/* Name Fields */}
                    {editMode ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={editFirstName}
                                onChange={e => setEditFirstName(e.target.value)}
                                className="flex-1 border rounded px-3 py-2 text-[#222] bg-[#FAFAFA]"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={editLastName}
                                onChange={e => setEditLastName(e.target.value)}
                                className="flex-1 border rounded px-3 py-2 text-[#222] bg-[#FAFAFA]"
                            />
                        </div>
                    ) : (
                        <div className="text-2xl font-medium text-[#1E1E1E]">
                            {fullName || 'No name set'}
                        </div>
                    )}

                    {/* Email (Read-only) */}
                    <div className="flex items-center gap-2 text-[#666] text-sm">
                        <span>📧</span>
                        <span>{user?.email || 'No email'}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-[#222] font-medium">
                        <MapPin size={18} />
                        {editMode ? (
                            <input
                                type="text"
                                placeholder="Address"
                                value={editLocation}
                                onChange={e => setEditLocation(e.target.value)}
                                className="border rounded px-2 py-1 w-full max-w-xs text-[#222] bg-[#FAFAFA]"
                            />
                        ) : (
                            <span>{user?.address || 'No address set'}</span>
                        )}
                    </div>

                    {/* Contact */}
                    <div className="flex items-center gap-2 text-[#222] font-medium">
                        <Phone size={18} />
                        {editMode ? (
                            <input
                                type="text"
                                placeholder="Phone number"
                                value={editContact}
                                onChange={e => setEditContact(e.target.value)}
                                className="border rounded px-2 py-1 w-full max-w-xs text-[#222] bg-[#FAFAFA]"
                            />
                        ) : (
                            <span>{user?.phone || 'No phone number set'}</span>
                        )}
                    </div>

                    {/* Edit profile button */}
                    <div className="flex justify-end w-full">
                        {!editMode ? (
                            <button 
                                className="mt-4 px-4 py-2 rounded-full bg-[#40863A] text-white font-medium text-sm hover:bg-[#32692C] transition" 
                                style={{ minWidth: '120px' }} 
                                onClick={handleEdit}
                            >
                                Edit profile
                            </button>
                        ) : (
                            <div className="flex gap-2 mt-4">
                                <button 
                                    className="px-4 py-2 rounded-full bg-[#40863A] text-white font-medium text-sm hover:bg-[#32692C] transition disabled:opacity-50" 
                                    style={{ minWidth: '120px' }} 
                                    onClick={handleSave}
                                    disabled={updating}
                                >
                                    {updating ? 'Saving...' : 'Save'}
                                </button>
                                <button 
                                    className="px-4 py-2 rounded-full bg-gray-300 text-[#222] font-medium text-sm hover:bg-gray-400 transition" 
                                    style={{ minWidth: '120px' }} 
                                    onClick={handleCancel}
                                    disabled={updating}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Password Section */}
            <div className="w-full max-w-xl bg-white rounded-xl border border-[#D9D9D9] p-8">
                <div className="mb-4 text-lg font-medium text-[#222]">Password</div>
                <div className="flex items-center gap-2 mb-4">
                    <Key size={18} />
                    <input 
                        type="password" 
                        value="************" 
                        readOnly 
                        className="border border-[#D9D9D9] rounded-lg px-3 py-2 w-full max-w-xs text-[#222] bg-[#FAFAFA]" 
                    />
                </div>
                <div className="flex justify-end w-full">
                    <button 
                        className="px-4 py-2 rounded-full bg-[#40863A] text-white font-medium text-sm hover:bg-[#32692C] transition" 
                        style={{ minWidth: '120px' }}
                        onClick={() => setShowPasswordModal(true)}
                    >
                        Change password
                    </button>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-medium text-[#222] mb-4">Change Password</h3>
                        
                        {passwordError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="text-red-700 text-sm">{passwordError}</div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#222]"
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#222]"
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#222]"
                            />
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                className="flex-1 px-4 py-2 rounded-full bg-[#40863A] text-white font-medium text-sm hover:bg-[#32692C] transition disabled:opacity-50"
                                onClick={handleChangePassword}
                                disabled={updating}
                            >
                                {updating ? 'Changing...' : 'Change Password'}
                            </button>
                            <button
                                className="flex-1 px-4 py-2 rounded-full bg-gray-300 text-[#222] font-medium text-sm hover:bg-gray-400 transition"
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordError('');
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                                disabled={updating}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Profile;
