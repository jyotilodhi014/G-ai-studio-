import React from 'react';
import { PoseEvolution } from '../types/yoga';

interface CuesModalProps {
  evolution: PoseEvolution | null;
  onClose: () => void;
}

export const CuesModal: React.FC<CuesModalProps> = ({ evolution, onClose }) => {
  if (!evolution) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
                {evolution.badge} Evolution
              </span>
              <span className="font-label-sm text-outline">Biomechanics</span>
            </div>
            <h3 className="font-headline-md text-on-surface text-xl">{evolution.name}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {evolution.imageUrl && (
          <div className="w-full h-40 rounded-2xl overflow-hidden bg-surface-container mb-4">
            <img src={evolution.imageUrl} alt={evolution.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-surface-container-low">
            <span className="font-label-sm text-primary uppercase font-bold tracking-wider block mb-1">
              Evolution Intention
            </span>
            <p className="font-body-md text-on-surface text-sm">{evolution.description}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-high border border-outline-variant/30">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">self_improvement</span>
              <span className="font-label-sm text-primary font-bold">Step-by-Step Somatic Transition Cues</span>
            </div>
            <p className="font-body-sm text-on-surface-variant text-sm leading-relaxed">{evolution.cues}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-full bg-primary text-on-primary font-label-md text-sm hover:opacity-95 transition-all shadow-sm"
        >
          Integrated Into Practice
        </button>
      </div>
    </div>
  );
};
