import React, { useState } from 'react';
import { chimeSynthesizer } from '../utils/audioChimes';

interface HeaderProps {
  onOpenProfile: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile, soundEnabled, onToggleSound }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 w-full z-40 bg-surface/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(46,35,37,0.04)] border-b border-surface-container">
      <div className="h-16 px-margin flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <img
            alt="PranaPose Lotus Mark"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2HH9iyNaOx5FBhygkwnPvffnfgFRg2ZSVhvmQupooFDs9GGYmZEaE24bcf9DWHNw61K8zXj0U2E_dEQ24KncHgmVbaZrt-SFXgNJOgLr_fXoXGf9Wi5c3IDgXHj__zpi67XPMDGHJcuihAnstjAVxIlV2lpcbZ-iUtDzHyZscIdmv_gKUo9bNqtejxIxUe8fcSP8iVyR57ZYaQ1KwXcvCjhwUCKMUgg0TwUQ8QpNYlGAdGwZF4VtO"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none">
              PranaPose
            </span>
            <span className="font-label-sm text-[11px] text-on-surface-variant font-headline-md italic leading-tight">
              Pranayama & Asana
            </span>
          </div>
        </div>

        {/* Right actions: Sound, Notifications, Profile */}
        <div className="flex items-center gap-1.5 relative">
          {/* Sound Chimes Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Disable breath chimes' : 'Enable breath chimes'}
            title={soundEnabled ? 'Chime audio enabled' : 'Chime audio muted'}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors relative"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary"></span>
          </button>

          {/* Profile Trigger */}
          <button
            onClick={onOpenProfile}
            aria-label="View Profile & Biometrics"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity ml-0.5"
          >
            <img
              alt="Practitioner Profile"
              className="w-8 h-8 rounded-full object-cover border border-secondary-container"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuL7ryIU1MrKMT-e6iVdrS2cADzi4AVLJKTZgsG4Hqbwjv75tuVFnh8JtXMRxF-Z3C39D2yRf0zGNXKoVTdoO-33bfkCWIvtEZ9P_rmBgjLuhi8pDqmnmfxN4oRgNevkkFeJ1HbAEhSe7pN6HJ4UDQrqmRiuoiDoE046KW38nHPhcxm2NkEei7Geai0FouZ60G3dGAWY2cS-hUEON1DX7d2NJr8FlmgD5CJD0zu8Rji3HAehLHB9Tx"
            />
          </button>

          {/* Notifications Dropdown Bubble */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-72 rounded-2xl bg-surface-container-lowest p-3 shadow-xl border border-surface-container z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container">
                <span className="font-label-sm text-primary font-semibold">Sanctuary Alerts</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-on-surface-variant text-[11px] hover:text-primary"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-surface-container-low text-xs">
                  <p className="font-label-md text-on-surface">Twilight Pranayama Due</p>
                  <p className="font-body-sm text-on-surface-variant mt-0.5">
                    Integrate your warrior flow with 4 mins of cooling Sitali breath.
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-surface-container-low text-xs">
                  <p className="font-label-md text-on-surface">Sattvic Hydration Reminder</p>
                  <p className="font-body-sm text-on-surface-variant mt-0.5">
                    Kindle evening Agni with warm ginger and tulsi tea.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
