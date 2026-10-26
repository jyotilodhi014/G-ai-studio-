import React, { useState } from 'react';
import { UserBiometrics, DietPlan } from '../types/yoga';

interface DietNutritionSectionProps {
  userBiometrics: UserBiometrics;
  onUpdateBiometrics: (bio: UserBiometrics) => void;
  dietPlan: DietPlan;
  onRefreshDiet: (bio: UserBiometrics) => Promise<void>;
  isLoadingDiet: boolean;
}

export const DietNutritionSection: React.FC<DietNutritionSectionProps> = ({
  userBiometrics,
  onUpdateBiometrics,
  dietPlan,
  onRefreshDiet,
  isLoadingDiet,
}) => {
  const [showEditInputs, setShowEditInputs] = useState(false);
  const [localBio, setLocalBio] = useState<UserBiometrics>(userBiometrics);

  const calculateBmi = (heightCm: number, weightKg: number) => {
    const h = heightCm / 100;
    if (h <= 0) return 21.5;
    return Number((weightKg / (h * h)).toFixed(1));
  };

  const currentBmi = calculateBmi(localBio.heightCm, localBio.weightKg);

  const handleSaveAndRefresh = async () => {
    onUpdateBiometrics(localBio);
    setShowEditInputs(false);
    await onRefreshDiet(localBio);
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Vata Delicate (Light Frame)', color: 'text-amber-700 bg-amber-50' };
    if (bmi < 24.9) return { label: 'Optimal Equilibrium (Sattvic Balance)', color: 'text-emerald-800 bg-emerald-50' };
    if (bmi < 29.9) return { label: 'Moderate Mass (Pitta-Kapha)', color: 'text-amber-800 bg-amber-50' };
    return { label: 'Heavy Foundation (Kapha Dense)', color: 'text-rose-800 bg-rose-50' };
  };

  const cat = getBmiCategory(currentBmi);

  return (
    <div className="flex flex-col space-y-6 px-margin pb-6 animate-fadeIn">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline block">
            Holistic Ayurveda & Yoga Diet
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
            Mindful Nutrition
          </h2>
          <p className="font-body-sm text-on-surface-variant font-headline-md italic">
            Calibrated strictly to your BMI, body frame, and daily asana intensity.
          </p>
        </div>
        <button
          onClick={() => setShowEditInputs((prev) => !prev)}
          className="px-3.5 py-1.5 rounded-full bg-surface-container-high text-primary font-label-sm text-xs font-semibold hover:bg-surface-container-highest transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">
            {showEditInputs ? 'check' : 'tune'}
          </span>
          <span>{showEditInputs ? 'Done' : 'Adjust Body'}</span>
        </button>
      </div>

      {/* PRACTITIONER BIOMETRIC PROFILE CARD */}
      <div className="p-4 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">accessibility</span>
            </div>
            <div>
              <span className="font-label-md text-on-surface font-semibold text-sm">
                Your Biometric Foundation
              </span>
              <span className="font-body-sm text-on-surface-variant text-[11px] block">
                {localBio.gender.toUpperCase()} · {localBio.age} YRS · {localBio.activityLevel} PRACTICE
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-headline-md text-2xl text-primary font-bold">{currentBmi}</span>
            <span className="font-label-sm text-outline text-[11px] ml-1">BMI</span>
          </div>
        </div>

        {/* Dynamic Category Pill */}
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full font-label-sm text-xs font-medium ${cat.color}`}>
            {cat.label}
          </span>
        </div>

        {/* BMI Visual Progress Range Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden relative">
            {/* Markers: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (30+) */}
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(Math.max(((currentBmi - 15) / (35 - 15)) * 100, 5), 100)}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-outline font-label-sm">
            <span>15 (Delicate)</span>
            <span>18.5</span>
            <span>22 (Balance)</span>
            <span>25</span>
            <span>30+ (Dense)</span>
          </div>
        </div>

        {/* Expandable Biometric Inputs Form */}
        {showEditInputs && (
          <div className="pt-4 border-t border-surface-container space-y-3.5 animate-fadeIn">
            <div className="grid grid-cols-2 gap-3">
              {/* Height Input */}
              <div className="p-3 rounded-2xl bg-surface-container-low">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <label className="text-on-surface">Height</label>
                  <span className="text-primary">{localBio.heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="210"
                  value={localBio.heightCm}
                  onChange={(e) =>
                    setLocalBio({ ...localBio, heightCm: parseInt(e.target.value) })
                  }
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Weight Input */}
              <div className="p-3 rounded-2xl bg-surface-container-low">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <label className="text-on-surface">Weight</label>
                  <span className="text-primary">{localBio.weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="140"
                  value={localBio.weightKg}
                  onChange={(e) =>
                    setLocalBio({ ...localBio, weightKg: parseInt(e.target.value) })
                  }
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Gender */}
              <div className="p-3 rounded-2xl bg-surface-container-low">
                <label className="text-xs font-semibold text-on-surface block mb-1">Gender</label>
                <select
                  value={localBio.gender}
                  onChange={(e) =>
                    setLocalBio({ ...localBio, gender: e.target.value as any })
                  }
                  className="w-full text-xs p-1.5 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant/40 focus:outline-none"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </div>

              {/* Dietary Philosophy */}
              <div className="p-3 rounded-2xl bg-surface-container-low">
                <label className="text-xs font-semibold text-on-surface block mb-1">
                  Diet Philosophy
                </label>
                <select
                  value={localBio.dietaryPreference}
                  onChange={(e) =>
                    setLocalBio({ ...localBio, dietaryPreference: e.target.value as any })
                  }
                  className="w-full text-xs p-1.5 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant/40 focus:outline-none"
                >
                  <option value="sattvic">Pure Sattvic (High Prana)</option>
                  <option value="ayurvedic-tridoshic">Ayurvedic Tri-Doshic</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveAndRefresh}
              disabled={isLoadingDiet}
              className="w-full py-2.5 rounded-full bg-primary text-on-primary font-label-md text-xs font-semibold hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoadingDiet ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Recalibrating Sattvic Plan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  <span>Save & Recalculate AI Diet</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* AYURVEDIC DOSHA FOCUS */}
      <div className="p-4 rounded-3xl bg-secondary-container/50 border border-secondary/20 shadow-sm flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-[24px] mt-0.5 material-symbols-fill">
          spa
        </span>
        <div>
          <h3 className="font-headline-sm text-on-surface text-sm">
            Dosha Resonance: {dietPlan.doshaPredominance} Alignment
          </h3>
          <p className="font-body-sm text-on-surface-variant text-xs mt-1 leading-relaxed">
            {dietPlan.primaryFocus}
          </p>
        </div>
      </div>

      {/* 5-MEAL DAILY PRANA TIMETABLE */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Daily Sattvic Rhythm</h2>
          <span className="font-label-sm text-outline text-xs">Agni Calibrated</span>
        </div>
        <p className="font-body-sm text-on-surface-variant text-xs mb-3">
          Synchronized with circadian digestive fire for optimum cellular lightness and flexibility.
        </p>

        <div className="space-y-3">
          {dietPlan.dailyRhythm.map((meal, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex items-start gap-3 transition-colors hover:bg-surface-container-low"
            >
              <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex flex-col items-center justify-center shrink-0 text-primary">
                <span className="text-[10px] font-bold font-label-sm">{meal.time}</span>
                <span className="material-symbols-outlined text-[18px]">
                  {idx === 0
                    ? 'wb_twilight'
                    : idx === 1
                    ? 'bakery_dining'
                    : idx === 2
                    ? 'sunny'
                    : idx === 3
                    ? 'coffee'
                    : 'nights_stay'}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-outline text-[11px]">{meal.period}</span>
                  <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[10px] font-semibold">
                    {meal.pranaScore}
                  </span>
                </div>
                <h4 className="font-label-lg text-on-surface font-semibold text-sm mt-0.5">
                  {meal.title}
                </h4>
                <p className="font-body-sm text-on-surface-variant text-xs mt-1 leading-relaxed">
                  {meal.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SATTVIC FOODS TO ENJOY & FOODS TO AVOID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Recommended Foods */}
        <div className="p-4 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
            <h3 className="font-label-lg text-on-surface font-semibold text-sm">
              Sattvic Foods to Favor
            </h3>
          </div>
          <ul className="space-y-1.5">
            {dietPlan.recommendedFoods.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-on-surface-variant font-body-sm">
                <span className="text-primary font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Foods to Minimize */}
        <div className="p-4 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-outline text-[18px]">do_not_disturb_on</span>
            <h3 className="font-label-lg text-on-surface font-semibold text-sm">
              Tamasic & Rajasic to Minimize
            </h3>
          </div>
          <ul className="space-y-1.5">
            {dietPlan.foodsToAvoid.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-on-surface-variant font-body-sm">
                <span className="text-outline font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* HYDRATION & MINDFUL EATING CUES */}
      <div className="p-4 rounded-3xl bg-surface-container-high border border-outline-variant/20 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">water_drop</span>
          <h3 className="font-headline-sm text-on-surface text-sm">Prana Hydration Principles</h3>
        </div>
        <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
          {dietPlan.hydrationGuidelines}
        </p>

        <div className="pt-2 border-t border-surface-container">
          <span className="font-label-sm text-primary font-bold text-xs block mb-1.5">
            Mindful Eating Cues
          </span>
          <div className="space-y-1.5">
            {dietPlan.mindfulEatingCues.map((cue, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-on-surface font-body-sm">
                <span className="text-primary font-bold shrink-0">{idx + 1}.</span>
                <span>{cue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
