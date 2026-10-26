import React, { useState, useEffect } from 'react';
import { PoseAnalysisData } from '../types/yoga';
import { chimeSynthesizer } from '../utils/audioChimes';

interface SessionFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  poseData: PoseAnalysisData;
}

export const SessionFlowModal: React.FC<SessionFlowModalProps> = ({
  isOpen,
  onClose,
  poseData,
}) => {
  const [step, setStep] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(180);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setTimerSeconds(180);
      setIsRunning(true);
      return;
    }
    chimeSynthesizer.playSingingBowl();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isRunning]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">self_improvement</span>
            <span className="font-headline-sm text-sm text-on-surface">Guided Sanctuary Practice</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Session"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="flex gap-1.5 my-4">
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              step >= 0 ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          ></div>
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              step >= 1 ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          ></div>
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              step >= 2 ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          ></div>
        </div>

        {/* STEP 0: Posture Alignment Inspection */}
        {step === 0 && (
          <div className="space-y-4 py-2 animate-fadeIn">
            <div>
              <span className="font-label-sm text-outline uppercase tracking-wider text-[10px]">
                Stage 1 · Biomechanical Form
              </span>
              <h3 className="font-headline-md text-xl text-on-surface mt-0.5">
                {poseData.poseName} Alignment
              </h3>
              <p className="font-body-sm text-on-surface-variant text-xs mt-1">
                Establish the stance on your mat. Focus on the primary somatic adjustments.
              </p>
            </div>

            <div className="space-y-2">
              {poseData.mistakes.slice(0, 2).map((m, i) => (
                <div key={i} className="p-3 rounded-2xl bg-surface-container-low text-xs">
                  <span className="font-label-md text-primary font-bold">{m.title}: </span>
                  <span className="text-on-surface-variant">{m.somaticCue}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setStep(1);
                chimeSynthesizer.playInhaleChime();
              }}
              className="w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-sm mt-3 shadow-md hover:opacity-95"
            >
              Anchor Stance & Begin Breath Pacing →
            </button>
          </div>
        )}

        {/* STEP 1: Integrated Pranayama Breathing Pacing */}
        {step === 1 && (
          <div className="space-y-4 py-2 flex flex-col items-center text-center animate-fadeIn">
            <div>
              <span className="font-label-sm text-outline uppercase tracking-wider text-[10px]">
                Stage 2 · Breath Resonance
              </span>
              <h3 className="font-headline-md text-xl text-on-surface mt-0.5">
                {poseData.pranayama.pre.name}
              </h3>
            </div>

            {/* Glowing countdown ring */}
            <div className="relative w-40 h-40 flex items-center justify-center my-2">
              <div className="absolute inset-0 rounded-full bg-secondary-container/50 animate-pulse"></div>
              <div className="relative w-28 h-28 rounded-full bg-primary text-on-primary flex flex-col items-center justify-center shadow-lg">
                <span className="font-headline-md text-2xl font-bold">{formatTime(timerSeconds)}</span>
                <span className="text-[10px] opacity-80">Remaining</span>
              </div>
            </div>

            <p className="font-body-sm text-on-surface-variant text-xs max-w-xs">
              Lightly contract the glottis. Soften facial muscles. Let your prana anchor the solar plexus.
            </p>

            <button
              onClick={() => {
                setStep(2);
                chimeSynthesizer.playSingingBowl();
              }}
              className="w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-sm mt-2 shadow-md hover:opacity-95"
            >
              Transition to Sitali Integration →
            </button>
          </div>
        )}

        {/* STEP 2: Sitali Restorative Integration */}
        {step === 2 && (
          <div className="space-y-4 py-2 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-secondary-container mx-auto flex items-center justify-center text-primary mb-2">
              <span className="material-symbols-outlined text-[32px] material-symbols-fill">spa</span>
            </div>

            <h3 className="font-headline-md text-xl text-on-surface">Practice Integrated</h3>
            <p className="font-body-sm text-on-surface-variant text-xs max-w-sm mx-auto leading-relaxed">
              Your autonomic nervous system has modulated into parasympathetic equilibrium.
              Heart rate decelerated by {Math.abs(poseData.somatosensory.heartRateDecel || 14)} BPM.
            </p>

            <div className="p-3.5 rounded-2xl bg-surface-container-low text-left max-w-sm mx-auto">
              <span className="font-label-sm text-primary font-bold text-xs block mb-1">
                Post-Practice Nourishment
              </span>
              <p className="text-xs text-on-surface-variant">
                Drink a glass of warm water with cumin and fennel to kindle gentle Agni.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-sm shadow-md hover:opacity-95 mt-2"
            >
              Return to Sanctuary
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
