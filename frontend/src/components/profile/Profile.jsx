import React from 'react';
import { useAuthStore } from '../../state/authStore';
import { useNavigationStore } from '../../state/navigationStore';

const Profile = () => {
  const { user } = useAuthStore();
  const { setCurrentPage } = useNavigationStore();

  const displayName = user?.name || user?.username || 'User';
  const avatar = user?.avatar || user?.photoURL || user?.image || '';
  const role = user?.role || 'TEAM_MEMBER';
  const department = user?.department || '—';
  const experienceYears = user?.experienceYears ?? 0;
  const workMode = user?.workMode || '—';
  const email = user?.email || '—';
  const phone = user?.phone || '—';
  const skills = Array.isArray(user?.skills) ? user.skills : [];
  const notifEmail = user?.notifEmail ?? false;
  const notifPush = user?.notifPush ?? false;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-light-bg-secondary flex items-center justify-center text-slate-600">
          {avatar ? (
            <img src={avatar} alt={`${displayName} avatar`} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-semibold">{displayName.charAt(0)}</span>
          )}
        </div>
        <div>
          <div className="text-2xl font-bold text-light-text dark:text-dark-text">{displayName}</div>
          <div className="text-light-text-secondary dark:text-dark-text-secondary">{role} • {department}</div>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setCurrentPage('onboarding')}
            className="px-4 py-2 rounded-lg bg-[var(--light-primary)] text-white"
          >
            Edit profile
          </button>
        </div>
      </div>

      {/* Personal details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-light-bg-secondary shadow-glass-sm dark:bg-dark-surface dark:border-dark-bg-secondary">
          <h3 className="font-semibold mb-3 text-light-text dark:text-dark-text">Personal</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-light-text-secondary dark:text-dark-text-secondary">Name</span><span className="font-medium text-light-text dark:text-dark-text">{displayName}</span></div>
            <div className="flex justify-between"><span className="text-light-text-secondary dark:text-dark-text-secondary">Role</span><span className="font-medium text-light-text dark:text-dark-text">{role}</span></div>
            <div className="flex justify-between"><span className="text-light-text-secondary dark:text-dark-text-secondary">Department</span><span className="font-medium text-light-text dark:text-dark-text">{department}</span></div>
            <div className="flex justify-between"><span className="text-light-text-secondary dark:text-dark-text-secondary">Experience</span><span className="font-medium text-light-text dark:text-dark-text">{experienceYears}+ years</span></div>
            <div className="flex justify-between"><span className="text-light-text-secondary dark:text-dark-text-secondary">Work mode</span><span className="font-medium text-light-text dark:text-dark-text">{workMode}</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-light-bg-secondary shadow-glass-sm dark:bg-dark-surface dark:border-dark-bg-secondary">
          <h3 className="font-semibold mb-3 text-light-text dark:text-dark-text">Contact</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-light-text-secondary dark:text-dark-text-secondary">Email</span><span className="font-medium text-light-text dark:text-dark-text">{email}</span></div>
            <div className="flex justify-between"><span className="text-light-text-secondary dark:text-dark-text-secondary">Phone</span><span className="font-medium text-light-text dark:text-dark-text">{phone}</span></div>
            <div className="flex justify-between"><span className="text-light-text-secondary dark:text-dark-text-secondary">Notifications</span><span className="font-medium text-light-text dark:text-dark-text">{notifEmail ? 'Email' : ''}{notifEmail && notifPush ? ' • ' : ''}{notifPush ? 'Push' : (!notifEmail ? '—' : '')}</span></div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl p-4 border border-light-bg-secondary shadow-glass-sm dark:bg-dark-surface dark:border-dark-bg-secondary">
        <h3 className="font-semibold mb-3 text-light-text dark:text-dark-text">Skills</h3>
        {skills.length ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="px-3 h-8 rounded-full bg-light-bg-secondary text-sm flex items-center dark:bg-dark-bg-secondary">{s}</span>
            ))}
          </div>
        ) : (
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">No skills added yet.</div>
        )}
      </div>
    </div>
  );
};

export default Profile;


