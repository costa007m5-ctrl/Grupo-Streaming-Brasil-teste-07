import React from 'react';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (imageUrl: string) => void;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Change Profile Picture</h2>
        <p className="text-gray-600 mb-4">Profile picture modal coming soon.</p>
        <button
          onClick={onClose}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
