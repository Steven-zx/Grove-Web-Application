import React, { useEffect, useState } from "react";
import { MapPin, Phone, Key, AlertCircle } from "lucide-react";
import { profileService } from "../services/profileService";
import MobileNavbar from "../components/layout/MobileNavbar";
import MobileSidebar from "../components/layout/MobileSidebar";

export default function ProfileMobile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editContact, setEditContact] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const profileData = await profileService.getProfile();
      setUser(profileData);
      setEditFirstName(profileData?.first_name || "");
      setEditLastName(profileData?.last_name || "");
      setEditLocation(profileData?.address || "");
      setEditContact(profileData?.phone || "");
    } catch (err) {
      setError(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      await profileService.updateProfile({
        firstName: editFirstName,
        lastName: editLastName,
        phone: editContact,
        address: editLocation,
      });
      setUser(prev => ({
        ...prev,
        first_name: editFirstName,
        last_name: editLastName,
        phone: editContact,
        address: editLocation,
      }));
      setEditMode(false);
    } catch (err) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setPasswordError("");
      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError("All fields are required");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("New passwords do not match");
        return;
      }
      if (newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters long");
        return;
      }
      setUpdating(true);
      await profileService.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);
    } catch (err) {
      setPasswordError(err?.message || "Failed to change password");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />
        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 px-4 sm:px-3 md:px-2 pt-34 pb-8 space-y-6 sm:space-y-5 md:space-y-4">
          <div className="h-48 flex items-center justify-center text-gray-600">Loading profile...</div>
        </main>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />
        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 px-4 sm:px-3 md:px-2 pt-34 pb-8 space-y-6 sm:space-y-5 md:space-y-4">
          <div className="h-48 flex items-center justify-center text-red-600">{error}</div>
        </main>
      </div>
    );
  }

  const fullName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '';
  const avatarLetter = fullName ? fullName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 px-4 sm:px-3 md:px-2 pt-34 pb-8 space-y-6 sm:space-y-5 md:space-y-4">
        <div className="inline-flex items-center gap-2 text-sm text-[#1E1E1E] bg-white px-4 py-2 rounded-lg border border-[#D9D9D9] mb-4">
          <span>Profile</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-[#E4E9E4] flex items-center justify-center text-2xl font-medium text-[#1E1E1E]">{avatarLetter}</div>
          <div className="flex-1">
            {!editMode ? (
              <div className="font-medium text-lg">{fullName || 'No name set'}</div>
            ) : (
              <div className="flex gap-2">
                <input className="flex-1 border rounded px-2 py-1" value={editFirstName} onChange={e => setEditFirstName(e.target.value)} placeholder="First" />
                <input className="flex-1 border rounded px-2 py-1" value={editLastName} onChange={e => setEditLastName(e.target.value)} placeholder="Last" />
              </div>
            )}
            <div className="text-sm text-gray-600 mt-1">{user?.email || 'No email'}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-[#222]">
            <MapPin size={16} />
            {editMode ? (
              <input value={editLocation} onChange={e => setEditLocation(e.target.value)} className="border rounded px-2 py-1 w-full" placeholder="Address" />
            ) : (
              <span>{user?.address || 'No address set'}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#222] mt-2">
            <Phone size={16} />
            {editMode ? (
              <input value={editContact} onChange={e => setEditContact(e.target.value)} className="border rounded px-2 py-1 w-full" placeholder="Phone" />
            ) : (
              <span>{user?.phone || 'No phone number set'}</span>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            {!editMode ? (
              <button onClick={() => setEditMode(true)} className="flex-1 py-2 rounded-full bg-[#40863A] text-white">Edit profile</button>
            ) : (
              <>
                <button onClick={handleSave} disabled={updating} className="flex-1 py-2 rounded-full bg-[#40863A] text-white">{updating ? 'Saving...' : 'Save'}</button>
                <button onClick={() => { setEditMode(false); setEditFirstName(user?.first_name||''); setEditLastName(user?.last_name||''); setEditLocation(user?.address||''); setEditContact(user?.phone||''); }} className="flex-1 py-2 rounded-full bg-gray-200 text-[#222]">Cancel</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#D9D9D9] p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Password</div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Key size={16} />
          <input type="password" value="************" readOnly className="border rounded px-3 py-2 w-full bg-[#FAFAFA]" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowPasswordModal(true)} className="flex-1 py-2 rounded-full bg-[#40863A] text-white">Change password</button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-3">Change Password</h3>
            {passwordError && <div className="mb-3 text-sm text-red-600">{passwordError}</div>}
            <div className="space-y-3">
              <input type="password" placeholder="Current Password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
              <input type="password" placeholder="New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
              <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleChangePassword} disabled={updating} className="flex-1 py-2 rounded-full bg-[#40863A] text-white">{updating ? 'Changing...' : 'Change Password'}</button>
              <button onClick={()=>{ setShowPasswordModal(false); setPasswordError(''); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }} className="flex-1 py-2 rounded-full bg-gray-200 text-[#222]">Cancel</button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
