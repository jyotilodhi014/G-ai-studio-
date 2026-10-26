import React from 'react';
import { PoseAnalysisData, DietPlan } from '../types/yoga';

interface SanctuaryHomeViewProps {
  onStartScan: () => void;
  onOpenPranayama: () => void;
  onOpenNutrition: () => void;
  poseData: PoseAnalysisData;
  dietPlan: DietPlan;
}

export const SanctuaryHomeView: React.FC<SanctuaryHomeViewProps> = ({
  onStartScan,
  onOpenPranayama,
  onOpenNutrition,
  poseData,
  dietPlan,
}) => {
  return (
    <div className="flex flex-col space-y-6 px-margin pb-6 animate-fadeIn">
      {/* Daily Intention Banner */}
      <div className="p-5 rounded-3xl bg-secondary-container/40 border border-secondary/20 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-label-sm text-outline text-[11px] uppercase tracking-wider block">
              Daily Asana Sanctuary
            </span>
            <h2 className="font-headline-lg text-2xl text-on-surface mt-1">
              Namaste, Practitioner
            </h2>
            <p className="font-body-sm text-on-surface-variant font-headline-md italic mt-1 max-w-sm">
              “Yoga is the journey of the self, through the self, to the self.”
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[26px] material-symbols-fill">spa</span>
          </div>
        </div>

        {/* Quick Asana Scan CTA */}
        <div className="mt-4 pt-3 border-t border-surface-container flex gap-2.5">
          <button
            onClick={onStartScan}
            className="flex-1 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-xs font-semibold shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            <span>Scan Yoga Pose</span>
          </button>
          <button
            onClick={onOpenPranayama}
            className="px-4 py-2.5 rounded-full bg-surface-container-high text-primary font-label-md text-xs font-semibold hover:bg-surface-container-highest transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">air</span>
            <span>Breathe</span>
          </button>
        </div>
      </div>

      {/* RECENT ASANA HARMONY SNAPSHOT */}
      <div className="p-4 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
            <h3 className="font-headline-sm text-on-surface text-base">Latest Alignment Scan</h3>
          </div>
          <span className="font-label-sm text-primary text-xs font-semibold">
            {poseData.harmonyScore}% Harmony
          </span>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface-container-low">
          <img
            src={poseData.imageUrl}
            alt={poseData.poseName}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-label-lg text-on-surface font-semibold text-sm truncate">
              {poseData.poseName}
            </h4>
            <p className="font-body-sm text-on-surface-variant text-xs truncate">
              {poseData.englishName} · {poseData.flowCategory}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-primary font-semibold">
                {poseData.strengths.length} strengths
              </span>
              <span className="text-outline text-[11px]">·</span>
              <span className="text-[11px] text-on-surface-variant">
                {poseData.mistakes.length} somatic cues
              </span>
            </div>
          </div>
          <button
            onClick={onStartScan}
            className="px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold shrink-0"
          >
            Review
          </button>
        </div>
      </div>

      {/* TODAY'S SATTVIC NUTRITION HIGHLIGHT */}
      <div className="p-4 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">restaurant</span>
            <h3 className="font-headline-sm text-on-surface text-base">Mindful Nutrition Plan</h3>
          </div>
          <button
            onClick={onOpenNutrition}
            className="font-label-sm text-primary text-xs font-semibold hover:underline"
          >
            View All Meals →
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-surface-container-low flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[20px]">sunny</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-outline uppercase">
              Solar Peak Agni · 12:30 PM
            </span>
            <h4 className="font-label-lg text-on-surface font-semibold text-sm">
              {dietPlan.dailyRhythm[2]?.title || 'Tridoshic Kitchari'}
            </h4>
            <p className="font-body-sm text-on-surface-variant text-xs mt-0.5 leading-relaxed">
              {dietPlan.dailyRhythm[2]?.description || 'Mung dal & aged basmati with ghee & steamed greens.'}
            </p>
          </div>
        </div>
      </div>

      {/* ASANA PRACTICE TIPS */}
      <div className="p-4 rounded-3xl bg-surface-container-high border border-outline-variant/20 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
          <h3 className="font-headline-sm text-on-surface text-sm">Somatic Sanctuary Wisdom</h3>
        </div>
        <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
          Before taking any standing warrior pose, ensure your posterior foot’s razor blade edge is firmly anchored. Inhale to broaden clavicles; exhale to soften the trapezius.
        </p>
      </div>
    </div>
  );
};
