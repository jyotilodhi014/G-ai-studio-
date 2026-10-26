import React from 'react';

export type MainTab = 'scan' | 'pranayama' | 'nutrition' | 'home';

interface BottomNavProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'scan' as MainTab, label: 'Scan', icon: 'view_in_ar' },
    { id: 'pranayama' as MainTab, label: 'Pranayama', icon: 'air' },
    { id: 'nutrition' as MainTab, label: 'Nutrition', icon: 'spa' },
    { id: 'home' as MainTab, label: 'Home', icon: 'self_improvement' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-4px_24px_rgba(46,35,37,0.06)] border-t border-surface-container">
      <div className="h-20 px-4 mx-margin mb-1 flex justify-around items-center rounded-3xl bg-surface-container-low/95 shadow-[0_4px_20px_rgba(125,82,95,0.08)] border border-outline-variant/30">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all group ${
                isActive ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div
                className={`w-12 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? 'bg-secondary-container text-on-secondary-container' : 'group-hover:bg-surface-container'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive ? 'material-symbols-fill' : ''
                  }`}
                >
                  {tab.icon}
                </span>
              </div>
              <span className="font-label-sm text-[11px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
