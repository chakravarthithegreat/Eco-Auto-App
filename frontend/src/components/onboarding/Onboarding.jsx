import React from 'react';
import { useAuthStore } from '../../state/authStore';
import { useNavigationStore } from '../../state/navigationStore';

const steps = [
  'Photo',
  'Basics',
  'Skills',
  'Preferences',
  'Review'
];

const Onboarding = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const { setCurrentPage } = useNavigationStore();

  const [step, setStep] = React.useState(0);
  const [avatar, setAvatar] = React.useState(user?.avatar || '');
  const [name, setName] = React.useState(user?.name || user?.username || '');
  const [role, setRole] = React.useState(user?.role || 'TEAM_MEMBER');
  const [department, setDepartment] = React.useState(user?.department || 'Operations');
  const [experienceYears, setExperienceYears] = React.useState(user?.experienceYears || 4);
  const [skills, setSkills] = React.useState(user?.skills || []);
  const [skillInput, setSkillInput] = React.useState('');
  const [workMode, setWorkMode] = React.useState(user?.workMode || 'Hybrid');
  const [notifEmail, setNotifEmail] = React.useState(user?.notifEmail ?? true);
  const [notifPush, setNotifPush] = React.useState(user?.notifPush ?? true);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val) return;
    if (!skills.includes(val)) setSkills([...skills, val]);
    setSkillInput('');
  };

  const removeSkill = (label) => {
    setSkills(skills.filter((s) => s !== label));
  };

  const next = () => setStep(Math.min(step + 1, steps.length - 1));
  const back = () => setStep(Math.max(step - 1, 0));

  const finish = async () => {
    const payload = {
      avatar,
      name: name || user?.name,
      role,
      department,
      experienceYears: Number(experienceYears) || 0,
      skills,
      workMode,
      notifEmail,
      notifPush,
      onboardingComplete: true,
    };
    await updateProfile(payload);
    setCurrentPage('profile');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">Set up your profile</h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">Step {step + 1} of {steps.length} · {steps[step]}</p>
        <div className="mt-3 h-2 bg-light-bg-secondary rounded-full overflow-hidden dark:bg-dark-bg-secondary">
          <div className="h-full bg-[var(--light-primary)]" style={{ width: `${((step + 1) / steps.length) * 100}%` }}></div>
        </div>
      </div>

      {/* Step content */}
      {step === 0 && (
        <div className="bg-white rounded-2xl p-6 border border-light-bg-secondary shadow-glass-sm dark:bg-dark-surface dark:border-dark-bg-secondary">
          <label className="block text-sm font-medium text-light-text mb-2 dark:text-dark-text">Profile photo</label>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-light-bg-secondary flex items-center justify-center text-slate-600">
              {avatar ? (
                <img src={avatar} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span>No image</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="text-sm" />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 border border-light-bg-secondary shadow-glass-sm grid sm:grid-cols-2 gap-4 dark:bg-dark-surface dark:border-dark-bg-secondary">
          <div>
            <label className="block text-sm font-medium text-light-text mb-1 dark:text-dark-text">Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-light-bg-secondary px-3 py-2 bg-light-surface dark:bg-dark-surface dark:text-dark-text" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-text mb-1 dark:text-dark-text">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-lg border border-light-bg-secondary px-3 py-2 bg-light-surface dark:bg-dark-surface dark:text-dark-text">
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="TEAM_MEMBER">Team member</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-light-text mb-1 dark:text-dark-text">Department</label>
            <input value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full rounded-lg border border-light-bg-secondary px-3 py-2 bg-light-surface dark:bg-dark-surface dark:text-dark-text" placeholder="e.g., Operations" />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-text mb-1 dark:text-dark-text">Experience (years)</label>
            <input type="number" min="0" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className="w-full rounded-lg border border-light-bg-secondary px-3 py-2 bg-light-surface dark:bg-dark-surface dark:text-dark-text" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 border border-light-bg-secondary shadow-glass-sm dark:bg-dark-surface dark:border-dark-bg-secondary">
          <label className="block text-sm font-medium text-light-text mb-2 dark:text-dark-text">Top skills</label>
          <div className="flex items-center gap-2 mb-3">
            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} className="flex-1 rounded-lg border border-light-bg-secondary px-3 py-2 bg-light-surface dark:bg-dark-surface dark:text-dark-text" placeholder="Type a skill and press Enter" />
            <button onClick={addSkill} className="px-3 py-2 rounded-lg bg-[var(--light-primary)] text-white">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="px-3 h-8 rounded-full bg-light-bg-secondary text-sm flex items-center gap-2 dark:bg-dark-bg-secondary">
                {s}
                <button onClick={() => removeSkill(s)} className="text-slate-500 hover:text-slate-700">×</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-light-bg-secondary shadow-glass-sm grid sm:grid-cols-2 gap-4 dark:bg-dark-surface dark:border-dark-bg-secondary">
          <div>
            <label className="block text-sm font-medium text-light-text mb-1 dark:text-dark-text">Work mode</label>
            <select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className="w-full rounded-lg border border-light-bg-secondary px-3 py-2 bg-light-surface dark:bg-dark-surface dark:text-dark-text">
              <option>Onsite</option>
              <option>Hybrid</option>
              <option>Remote</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-light-text dark:text-dark-text">
              <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} /> Email notifications
            </label>
            <label className="flex items-center gap-2 text-sm text-light-text dark:text-dark-text">
              <input type="checkbox" checked={notifPush} onChange={(e) => setNotifPush(e.target.checked)} /> Push notifications
            </label>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="bg-white rounded-2xl p-6 border border-light-bg-secondary shadow-glass-sm space-y-3 dark:bg-dark-surface dark:border-dark-bg-secondary">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-light-bg-secondary">
              {avatar ? <img src={avatar} alt="preview" className="w-full h-full object-cover" /> : null}
            </div>
            <div>
              <div className="font-semibold text-light-text dark:text-dark-text">{name || user?.name}</div>
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{role} • {department} • {experienceYears}+ yrs</div>
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Skills: {skills.join(', ') || '—'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        <button onClick={back} disabled={step === 0} className="px-4 py-2 rounded-lg border border-light-bg-secondary text-light-text disabled:opacity-50 dark:text-dark-text dark:border-dark-bg-secondary">Back</button>
        {step < steps.length - 1 ? (
          <button onClick={next} className="px-4 py-2 rounded-lg bg-[var(--light-primary)] text-white">Next</button>
        ) : (
          <button onClick={finish} disabled={isLoading} className="px-4 py-2 rounded-lg bg-[var(--light-primary)] text-white">Finish</button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;


