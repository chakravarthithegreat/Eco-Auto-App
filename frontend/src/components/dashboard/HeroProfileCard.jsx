import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { useAuthStore } from '../../state/authStore';
import { Phone, MessageSquare } from 'lucide-react';

const HeroProfileCard = () => {
  const { user } = useAuthStore();

  const displayName = user?.name || user?.username || 'User';
  const role = user?.role || 'Team member';
  const department = user?.department || 'Operations';
  const avatarUrl = user?.avatar || user?.photoURL || user?.image || null;
  const [imageOk, setImageOk] = React.useState(true);

  return (
    <Card className="rounded-2xl overflow-hidden bg-white border border-light-bg-secondary shadow-glass-sm">
      <div className="relative w-full aspect-[4/5]">
        {/* Full-bleed image */}
        {avatarUrl && imageOk ? (
          <img
            src={avatarUrl}
            alt={`${displayName} portrait`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageOk(false)}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-light-bg-secondary">
            <span className="text-4xl font-semibold text-slate-700">{displayName.charAt(0)}</span>
          </div>
        )}

        {/* Experience pill (floating) */}
        <div className="absolute left-4 bottom-20 sm:bottom-24 px-4 h-10 rounded-2xl bg-black/85 text-white text-sm font-medium flex items-center gap-2 shadow-md">
          <span>4+ years experience</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
        </div>

        {/* Bottom glass bar with name/role and actions */}
        <div className="absolute left-3 right-3 bottom-3 rounded-2xl backdrop-blur-md bg-white/40 text-slate-900 border border-white/60 shadow-glass-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="min-w-0 flex-1 mr-3">
              <div className="text-white text-lg font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] truncate">{displayName}</div>
              <div className="text-white/80 text-sm truncate">{role}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-10 h-10 rounded-full bg-black/85 text-white flex items-center justify-center hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-95 transition"
                aria-label="Call"
                title="Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                className="w-10 h-10 rounded-full bg-black/85 text-white flex items-center justify-center hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-95 transition"
                aria-label="Message"
                title="Message"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HeroProfileCard;


