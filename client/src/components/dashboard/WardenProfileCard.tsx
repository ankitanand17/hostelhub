//client/src/components/dashboard/WardenProfileCard.tsx
import type { User } from '../../types';

const getInitials = (user: User | null) => {
  if (!user) return '';
    const firstNameInitials = user.firstName ? user.firstName[0] : '';
    const lastNameInitials = user.lastName ? user.lastName[0] : '';
    return `${firstNameInitials}${lastNameInitials}`.toUpperCase();
};

interface WardenProfileCardProps {
  user: User | null;
}

const WardenProfileCard = ({ user }: WardenProfileCardProps) => {
  if (!user) {
    return null;
  }

  const profile = user.staffProfile;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-6">
        <div className="relative">
          {profile?.profilePhotoUrl ? (
            <img
              src={profile.profilePhotoUrl}
              alt="Warden Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200"
            />
          ) : (
            <div className="flex items-center justify-center w-24 h-24 text-3xl font-bold text-white bg-indigo-500 rounded-full border-4 border-indigo-200">
              {getInitials(user)}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
          <p className="text-sm font-semibold text-indigo-600">{profile?.jobTitle || 'Job Title Not Set'}</p>
          
          <div className="mt-4 space-y-2 text-gray-600">
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <a href={`mailto:${user.email}`} className="hover:text-indigo-600">{user.email}</a>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📞</span>
              <span>{profile?.staffContactNumber || 'Contact not available'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenProfileCard;