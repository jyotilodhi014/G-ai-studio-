import React, { useState, useEffect, useRef } from 'react';
import { PoseAnalysisData, PranayamaPhase } from '../types/yoga';
import { chimeSynthesizer } from '../utils/audioChimes';

interface BreathResonanceSectionProps {
  poseData: PoseAnalysisData;
}

export const BreathResonanceSection: React.FC<BreathResonanceSectionProps> = ({ poseData }) => {
  const [phaseType, setPhaseType] = useState<'pre' | 'post'>('pre');
  const [isPacerActive, setIsPacerActive] = useState(false);
  const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [activeAudioSequence, setActiveAudioSequence] = useState<string | null>(null);

  const activePranayama: PranayamaPhase =
    phaseType === 'pre'
      ? poseData.pranayama?.pre || {
          name: 'Ujjayi Wave (4 · 2 · 4)',
          badge: 'Solar Heating',
          inhale: 4,
          hold: 2,
          exhale: 4,
          instructions: [
            'Lightly contract the glottis at the back of the throat on both inhale and exhale.',
            'Generate a quiet, rhythmic whisper mimicking gentle ocean surf.',
            'Maintain during the 5-breath hold to temper the sympathetic surge.',
          ],
          benefit: 'HRV Resonance +18%',
          duration: '5 Mins',
        }
      : poseData.pranayama?.post || {
          name: 'Sitali Cooling (4 · 4 · 6)',
          badge: 'Lunar Restorative',
          inhale: 4,
          hold: 4,
          exhale: 6,
          instructions: [
            'Roll tongue into an O-tube or gently part lips; sip cool prana.',
            'Retain breath comfortably for 4 counts while relaxing temples.',
            'Exhale smooth, unhurried air through nostrils for 6 counts.',
          ],
          benefit: 'Vagal Tone Elevation',
          duration: '4 Mins',
        };

  // Timer loop for the breathing pacer
  useEffect(() => {
    if (!isPacerActive) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // State transition when counter hits 0
        if (breathState === 'inhale') {
          setBreathState('hold');
          chimeSynthesizer.playHoldChime();
          return activePranayama.hold;
        } else if (breathState === 'hold') {
          setBreathState('exhale');
          chimeSynthesizer.playExhaleChime();
          return activePranayama.exhale;
        } else {
          setBreathState('inhale');
          chimeSynthesizer.playInhaleChime();
          return activePranayama.inhale;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPacerActive, breathState, activePranayama]);

  const handleTogglePacer = () => {
    if (!isPacerActive) {
      setIsPacerActive(true);
      setBreathState('inhale');
      setSecondsRemaining(activePranayama.inhale);
      chimeSynthesizer.playInhaleChime();
    } else {
      setIsPacerActive(false);
    }
  };

  const handleResetPacer = () => {
    setIsPacerActive(false);
    setBreathState('inhale');
    setSecondsRemaining(activePranayama.inhale);
  };

  const handleSwitchPhase = (type: 'pre' | 'post') => {
    setPhaseType(type);
    setIsPacerActive(false);
    const target = type === 'pre' ? poseData.pranayama.pre : poseData.pranayama.post;
    setBreathState('inhale');
    setSecondsRemaining(target.inhale);
  };

  // Ring scale calculation for visual feedback
  const getRingScale = () => {
    if (breathState === 'inhale') return 'scale-115';
    if (breathState === 'hold') return 'scale-110';
    return 'scale-95';
  };

  return (
    <div className="flex flex-col space-y-6 px-margin pb-6 animate-fadeIn">
      {/* Pre vs Post Asana Switcher Bar */}
      <div className="p-1 rounded-2xl bg-surface-container flex items-center">
        <button
          onClick={() => handleSwitchPhase('pre')}
          className={`flex-1 py-2 px-3 rounded-xl font-label-md text-xs text-center transition-all flex items-center justify-center gap-1.5 ${
            phaseType === 'pre'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">wb_twilight</span>
          <span>Pre-Asana (Prepare)</span>
        </button>

        <button
          onClick={() => handleSwitchPhase('post')}
          className={`flex-1 py-2 px-3 rounded-xl font-label-md text-xs text-center transition-all flex items-center justify-center gap-1.5 ${
            phaseType === 'post'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">nights_stay</span>
          <span>Post-Asana (Integrate)</span>
        </button>
      </div>

      {/* ACTIVE BREATH RESONANCE PACER CARD */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col items-center relative overflow-hidden">
        {/* Subtle ambient blur glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary-fixed/40 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between w-full mb-3">
          <div>
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline block">
              Active Resonance Pacer
            </span>
            <h2 className="font-headline-md text-lg text-on-surface mt-0.5">
              {activePranayama.name}
            </h2>
          </div>
          <span
            className={`px-3 py-1 rounded-full font-label-sm text-xs font-semibold ${
              phaseType === 'pre'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container text-primary'
            }`}
          >
            {activePranayama.badge}
          </span>
        </div>

        {/* Concentric Breathing Circles Interactive Pacer */}
        <div className="my-6 relative w-52 h-52 flex items-center justify-center">
          {/* Outermost pulsing halo */}
          <div
            className={`absolute w-48 h-48 rounded-full bg-surface-container-high transition-transform duration-1000 ease-in-out ${
              isPacerActive ? getRingScale() : 'scale-100'
            }`}
          ></div>

          {/* Middle breathing ring */}
          <div
            className={`absolute w-40 h-40 rounded-full bg-secondary-container/60 transition-transform duration-1000 ease-in-out ${
              isPacerActive ? getRingScale() : 'scale-100'
            }`}
          ></div>

          {/* Inner core circle with text */}
          <div className="relative w-30 h-30 rounded-full bg-primary text-on-primary flex flex-col items-center justify-center shadow-lg select-none z-10">
            <span className="font-headline-md text-lg capitalize font-medium leading-none">
              {isPacerActive ? breathState : 'Ready'}
            </span>
            <span className="font-label-sm text-xs opacity-90 mt-1">
              {isPacerActive ? `${secondsRemaining}s` : `${activePranayama.duration}`}
            </span>
            <span className="text-[10px] opacity-75 mt-0.5">
              {breathState === 'inhale' ? 'Expand' : breathState === 'hold' ? 'Still' : 'Release'}
            </span>
          </div>
        </div>

        {/* Rhythm Ratios */}
        <div className="flex items-center gap-2 mt-1 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>Inhale {activePranayama.inhale}s</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>Hold {activePranayama.hold}s</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            <span>Exhale {activePranayama.exhale}s</span>
          </div>
        </div>

        {/* Live Pacer Controls */}
        <div className="mt-5 flex items-center gap-3 w-full">
          <button
            onClick={handleTogglePacer}
            className="flex-1 py-3 rounded-full bg-primary text-on-primary font-label-lg text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPacerActive ? 'pause' : 'play_arrow'}
            </span>
            <span>{isPacerActive ? 'Pause Resonance' : 'Start Resonance Pacer'}</span>
          </button>

          <button
            onClick={handleResetPacer}
            aria-label="Reset timer"
            className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">replay</span>
          </button>
        </div>
      </div>

      {/* CURATED BREATH SEQUENCES */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Curated Breath Sequences</h2>
          <span className="font-label-sm text-outline text-xs">Warrior Affinity</span>
        </div>
        <p className="font-body-sm text-on-surface-variant text-xs mb-3">
          Balances the intense muscular endurance and autonomic tone of the stance.
        </p>

        <div className="space-y-3">
          {/* Active Phase Pranayama Card */}
          <div className="p-4 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                  <span className="material-symbols-outlined text-[20px]">waves</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface text-base">
                    {activePranayama.name}
                  </h3>
                  <span className="font-label-sm text-on-surface-variant text-xs">
                    {activePranayama.badge} · {activePranayama.benefit}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-xs font-semibold">
                {activePranayama.duration}
              </span>
            </div>

            {/* Instruction Steps */}
            <div className="mt-3 pt-1 space-y-2">
              {activePranayama.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-on-surface font-body-sm text-xs">
                  <span className="font-label-sm text-primary font-bold shrink-0">{idx + 1}.</span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-surface-container">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-xs">
                <span className="material-symbols-outlined text-[15px] text-primary">favorite</span>
                <span>{activePranayama.benefit}</span>
              </div>
              <button
                onClick={() => {
                  chimeSynthesizer.playSingingBowl();
                  setActiveAudioSequence(
                    activeAudioSequence === activePranayama.name ? null : activePranayama.name
                  );
                }}
                className={`px-4 py-1.5 rounded-full font-label-sm text-xs transition-colors flex items-center gap-1.5 ${
                  activeAudioSequence === activePranayama.name
                    ? 'bg-primary text-on-primary'
                    : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {activeAudioSequence === activePranayama.name ? 'graphic_eq' : 'volume_up'}
                </span>
                <span>
                  {activeAudioSequence === activePranayama.name
                    ? 'Guided Audio Playing'
                    : 'Begin Guided Audio'}
                </span>
              </button>
            </div>
          </div>

          {/* Secondary Balancing Card: Nadi Shodhana (Alternate Nostril) */}
          <div className="p-4 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface text-base">Nadi Shodhana</h3>
                  <span className="font-label-sm text-on-surface-variant text-xs">
                    Alternate Nostril · Channel Equilibrium
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-xs font-semibold">
                4 Mins
              </span>
            </div>

            <div className="mt-3 pt-1 space-y-2">
              <div className="flex items-start gap-2.5 text-on-surface font-body-sm text-xs">
                <span className="font-label-sm text-primary font-bold shrink-0">1.</span>
                <span>Rest Vishnu Mudra with right hand: thumb on right nostril, ring finger on left.</span>
              </div>
              <div className="flex items-start gap-2.5 text-on-surface font-body-sm text-xs">
                <span className="font-label-sm text-primary font-bold shrink-0">2.</span>
                <span>Seal right nostril, inhale slowly through left nostril for 4 counts.</span>
              </div>
              <div className="flex items-start gap-2.5 text-on-surface font-body-sm text-xs">
                <span className="font-label-sm text-primary font-bold shrink-0">3.</span>
                <span>Switch, release right nostril and exhale 6 counts. Reset parasympathetic tone.</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-surface-container">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-xs">
                <span className="material-symbols-outlined text-[15px] text-primary">psychology</span>
                <span>Vagal Tone Elevation</span>
              </div>
              <button
                onClick={() => {
                  chimeSynthesizer.playSingingBowl();
                  setActiveAudioSequence(
                    activeAudioSequence === 'Nadi Shodhana' ? null : 'Nadi Shodhana'
                  );
                }}
                className={`px-4 py-1.5 rounded-full font-label-sm text-xs transition-colors flex items-center gap-1.5 ${
                  activeAudioSequence === 'Nadi Shodhana'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-primary hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {activeAudioSequence === 'Nadi Shodhana' ? 'graphic_eq' : 'volume_up'}
                </span>
                <span>
                  {activeAudioSequence === 'Nadi Shodhana' ? 'Guided Audio Playing' : 'Begin Guided Audio'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PHYSIOLOGICAL BIOMETRICS CARD */}
      <div className="p-4 rounded-3xl bg-surface-container-low shadow-sm border border-outline-variant/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">monitor_heart</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Predicted Somatosensory Shift
            </h2>
          </div>
          <span className="font-label-sm text-primary text-xs font-semibold">Biometric Model</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Deceleration Stat */}
          <div className="p-3 rounded-2xl bg-surface-container-lowest">
            <span className="font-label-sm text-on-surface-variant block text-[11px]">
              Heart Rate Decel
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline-md text-headline-md text-primary font-bold">
                {poseData.somatosensory?.heartRateDecel || -14}
              </span>
              <span className="font-label-sm text-on-surface text-xs">BPM</span>
            </div>
            <span className="font-body-sm text-outline text-[11px] mt-0.5 block">
              post 3-min integration
            </span>
          </div>

          {/* Ida / Pingala Balance */}
          <div className="p-3 rounded-2xl bg-surface-container-lowest">
            <span className="font-label-sm text-on-surface-variant block text-[11px]">
              Ida / Pingala Balance
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline-md text-headline-md text-primary font-bold">
                {poseData.somatosensory?.idaPingala || '48 / 52'}
              </span>
              <span className="font-label-sm text-on-surface text-xs">%</span>
            </div>
            <span className="font-body-sm text-outline text-[11px] mt-0.5 block">
              optimal autonomic state
            </span>
          </div>
        </div>

        {/* Minimalist SVG Nervous System Trend */}
        <div className="mt-3 p-3 rounded-2xl bg-surface-container-lowest flex items-center justify-between">
          <div>
            <span className="font-label-md text-on-surface block text-xs font-semibold">
              Nervous System Coherence
            </span>
            <span className="font-body-sm text-on-surface-variant text-[11px]">
              {poseData.somatosensory?.nervousCoherence || 'Calm focus, reduced cortisol spikes'}
            </span>
          </div>
          <div className="w-20 h-8 flex items-center shrink-0">
            <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 80 30">
              <path
                d="M2 18 C 15 18, 20 5, 30 15 C 40 25, 50 8, 60 14 C 70 20, 75 12, 78 12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
