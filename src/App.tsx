/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroPoseViewer } from './components/HeroPoseViewer';
import { PoseAlignmentSection } from './components/PoseAlignmentSection';
import { BreathResonanceSection } from './components/BreathResonanceSection';
import { DietNutritionSection } from './components/DietNutritionSection';
import { SanctuaryHomeView } from './components/SanctuaryHomeView';
import { BottomNav, MainTab } from './components/BottomNav';
import { CameraModal } from './components/CameraModal';
import { CuesModal } from './components/CuesModal';
import { SessionFlowModal } from './components/SessionFlowModal';
import {
  PoseAnalysisData,
  PoseEvolution,
  AlignmentMarker,
  UserBiometrics,
  DietPlan,
  PRESET_POSES,
} from './types/yoga';
import { chimeSynthesizer } from './utils/audioChimes';

const DEFAULT_BIOMETRICS: UserBiometrics = {
  gender: 'female',
  heightCm: 168,
  weightKg: 58,
  age: 28,
  activityLevel: 'moderate',
  dietaryPreference: 'sattvic',
};

const DEFAULT_DIET_PLAN: DietPlan = {
  bmi: 20.5,
  bmiCategory: 'Optimal Equilibrium',
  doshaPredominance: 'Pitta-Vata Balanced',
  primaryFocus: 'Agni (digestive fire) balance, prana replenishment, and cellular vitality.',
  dailyRhythm: [
    {
      period: 'Dawn Awakening',
      time: '6:30 AM',
      title: 'Warm Ginger & Tulsi Elixir',
      description: 'Warm spring water with crushed fresh ginger, holy basil (tulsi), and a drop of organic lemon to awaken Agni.',
      pranaScore: 'High Prana',
    },
    {
      period: 'Prana Breakfast',
      time: '8:30 AM',
      title: 'Golden Spiced Stewed Apples & Soaked Almonds',
      description: 'Organic apples simmered with Ceylon cinnamon and cardamom, paired with 7 overnight soaked and peeled almonds.',
      pranaScore: 'Ojas Nourishing',
    },
    {
      period: 'Solar Feast (Main Lunch)',
      time: '12:30 PM',
      title: 'Kitchari of Mung Dal & Aged Basmati with Steamed Greens',
      description: 'Easy-to-digest yellow split mung dal cooked with aged basmati, cumin seeds, turmeric, and ghee, accompanied by wilted greens.',
      pranaScore: 'Tridoshic Balance',
    },
    {
      period: 'Post-Asana Replenishment',
      time: '4:30 PM',
      title: 'Saffron Ashwagandha Golden Milk',
      description: 'Warm oat or almond milk infused with crushed saffron threads, ashwagandha root, and a hint of nutmeg to ease muscle fatigue.',
      pranaScore: 'Cellular Restoration',
    },
    {
      period: 'Twilight Dinner',
      time: '7:00 PM',
      title: 'Roasted Pumpkin & Coconut Ginger Velouté',
      description: 'Velvety pureed kabocha pumpkin soup with coconut milk, toasted pumpkin seeds, and cilantro. Light on the stomach before rest.',
      pranaScore: 'Soma Harmonizing',
    },
  ],
  recommendedFoods: [
    'Ghee (organic clarified butter)',
    'Yellow mung dal & aged basmati rice',
    'Fresh seasonal figs, dates & papayas',
    'Steamed zucchini, bottle gourd & leafy greens',
    'Soaked almonds and pumpkin seeds',
    'Cumin, coriander, fennel & turmeric',
  ],
  foodsToAvoid: [
    'Leftover, refrigerated or microwaved meals (Tamasic)',
    'Excessive raw pungent onions, garlic & chilis (Rajasic)',
    'Stale, deep-fried or canned food items',
    'Iced beverages during or directly after meals',
  ],
  hydrationGuidelines: 'Sip warm water or CCF tea (Cumin, Coriander, Fennel) throughout daylight hours. Avoid chugging cold liquids during asana practice.',
  mindfulEatingCues: [
    'Eat in a peaceful, quiet sanctuary without screens or distractions.',
    'Chew each mouthful mindfully until liquefied to kindle digestive Agni.',
    'Leave one-third of the stomach space for digestion and one-third for air/fluid.',
  ],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('scan');
  const [segmentedView, setSegmentedView] = useState<'alignment' | 'pranayama'>('alignment');
  const [currentPose, setCurrentPose] = useState<PoseAnalysisData>(PRESET_POSES.warrior2);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeMarker, setActiveMarker] = useState<AlignmentMarker | null>(null);
  const [selectedEvolution, setSelectedEvolution] = useState<PoseEvolution | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSessionFlowOpen, setIsSessionFlowOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userBiometrics, setUserBiometrics] = useState<UserBiometrics>(() => {
    try {
      const saved = localStorage.getItem('pranapose_biometrics');
      return saved ? JSON.parse(saved) : DEFAULT_BIOMETRICS;
    } catch {
      return DEFAULT_BIOMETRICS;
    }
  });
  const [dietPlan, setDietPlan] = useState<DietPlan>(() => {
    try {
      const saved = localStorage.getItem('pranapose_diet_plan');
      return saved ? JSON.parse(saved) : DEFAULT_DIET_PLAN;
    } catch {
      return DEFAULT_DIET_PLAN;
    }
  });
  const [isLoadingDiet, setIsLoadingDiet] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Sync sound toggle to audio synthesizer
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    chimeSynthesizer.enabled = next;
    if (next) chimeSynthesizer.playSingingBowl();
  };

  // Save biometrics to localStorage
  const handleUpdateBiometrics = (bio: UserBiometrics) => {
    setUserBiometrics(bio);
    try {
      localStorage.setItem('pranapose_biometrics', JSON.stringify(bio));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  // Recalculate Diet with Server / Gemini
  const handleRefreshDiet = async (bio: UserBiometrics) => {
    setIsLoadingDiet(true);
    try {
      const res = await fetch('/api/generate-diet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bio),
      });
      if (res.ok) {
        const data = await res.json();
        setDietPlan(data);
        localStorage.setItem('pranapose_diet_plan', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Diet refresh error:', err);
    } finally {
      setIsLoadingDiet(false);
    }
  };

  // Analyze Pose Image via Server / Gemini API
  const analyzeImage = async (base64Image: string, mimeType: string = 'image/jpeg') => {
    setIsAnalyzing(true);
    setActiveTab('scan');
    setSegmentedView('alignment');
    try {
      const res = await fetch('/api/analyze-pose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image, mimeType }),
      });
      if (res.ok) {
        const analysis = await res.json();
        setCurrentPose({
          ...analysis,
          imageUrl: base64Image,
        });
      }
    } catch (err) {
      console.error('Failed to analyze pose image:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Upload file handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      analyzeImage(result, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  // Live Camera Snapshot handler
  const handleCameraCapture = (base64Image: string) => {
    analyzeImage(base64Image, 'image/jpeg');
  };

  // Switch preset pose
  const handleSelectPreset = (key: string) => {
    const found = PRESET_POSES[key];
    if (found) {
      setCurrentPose(found);
      setActiveMarker(null);
      chimeSynthesizer.playSingingBowl();
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Top App Header */}
      <Header
        onOpenProfile={() => setShowProfileModal(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface">
        {/* VIEW 1: POSE SCAN & HARMONY (The Primary Screen from Mockup) */}
        {activeTab === 'scan' && (
          <div className="flex flex-col w-full animate-fadeIn">
            {/* Hero Practitioner Mat Viewer */}
            <HeroPoseViewer
              poseData={currentPose}
              isAnalyzing={isAnalyzing}
              onOpenCamera={() => setIsCameraOpen(true)}
              onUploadFile={handleFileUpload}
              onSelectPreset={handleSelectPreset}
              activeMarkerId={activeMarker?.id || null}
              onSelectMarker={(m) => setActiveMarker(m)}
            />

            {/* Interactive Segmented Flow Switcher */}
            <div className="px-margin pb-4">
              <div className="p-1 rounded-2xl bg-surface-container flex items-center relative border border-outline-variant/30">
                <button
                  onClick={() => setSegmentedView('alignment')}
                  className={`flex-1 py-2 px-3 rounded-xl font-label-lg text-sm text-center transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    segmentedView === 'alignment'
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">accessibility_new</span>
                  <span>Pose Alignment</span>
                </button>

                <button
                  onClick={() => setSegmentedView('pranayama')}
                  className={`flex-1 py-2 px-3 rounded-xl font-label-lg text-sm text-center transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    segmentedView === 'pranayama'
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">air</span>
                  <span>Breath Resonance</span>
                </button>
              </div>
            </div>

            {/* Sub-view: Pose Alignment or Breath Resonance */}
            {segmentedView === 'alignment' ? (
              <PoseAlignmentSection
                poseData={currentPose}
                onInspectEvolution={(evo) => setSelectedEvolution(evo)}
                activeMarker={activeMarker}
                onCloseMarker={() => setActiveMarker(null)}
              />
            ) : (
              <BreathResonanceSection poseData={currentPose} />
            )}

            {/* Floating Bottom Action Hub: Start Flow */}
            <div className="px-margin pt-1 pb-6">
              <div className="p-3 rounded-3xl bg-surface-container-lowest/95 backdrop-blur-md shadow-lg border border-outline-variant/30 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[24px] material-symbols-fill">
                    self_improvement
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-label-lg text-on-surface truncate font-semibold text-sm">
                    Full {currentPose.englishName} Session
                  </h3>
                  <p className="font-body-sm text-on-surface-variant truncate text-xs">
                    Alignment Check + 6m Breath integration
                  </p>
                </div>
                <button
                  onClick={() => setIsSessionFlowOpen(true)}
                  className="px-5 py-3 rounded-full bg-primary text-on-primary font-label-lg text-sm shrink-0 shadow-sm transition-transform active:scale-95 flex items-center gap-1 hover:opacity-95"
                >
                  <span>Start Flow</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: DEDICATED PRANAYAMA (BREATHWORK) TAB */}
        {activeTab === 'pranayama' && (
          <div className="flex flex-col w-full animate-fadeIn pt-2">
            <div className="px-margin pb-3">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline block">
                Integrated Breathwork Sanctuary
              </span>
              <h1 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
                Breath Resonance
              </h1>
              <p className="font-body-sm text-on-surface-variant font-headline-md italic">
                Pre- and post-asana breathing practices for {currentPose.poseName} ({currentPose.englishName}).
              </p>
            </div>
            <BreathResonanceSection poseData={currentPose} />
          </div>
        )}

        {/* VIEW 3: MINDFUL NUTRITION & BMI SECTION */}
        {activeTab === 'nutrition' && (
          <div className="pt-2 animate-fadeIn">
            <DietNutritionSection
              userBiometrics={userBiometrics}
              onUpdateBiometrics={handleUpdateBiometrics}
              dietPlan={dietPlan}
              onRefreshDiet={handleRefreshDiet}
              isLoadingDiet={isLoadingDiet}
            />
          </div>
        )}

        {/* VIEW 4: SANCTUARY HOME / DASHBOARD */}
        {activeTab === 'home' && (
          <div className="pt-2 animate-fadeIn">
            <SanctuaryHomeView
              onStartScan={() => setActiveTab('scan')}
              onOpenPranayama={() => setActiveTab('pranayama')}
              onOpenNutrition={() => setActiveTab('nutrition')}
              poseData={currentPose}
              dietPlan={dietPlan}
            />
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation Tab Bar */}
      <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        onSelectSample={(key) => {
          handleSelectPreset(key);
          setIsCameraOpen(false);
        }}
      />

      {/* Pose Evolution Cues Modal */}
      <CuesModal
        evolution={selectedEvolution}
        onClose={() => setSelectedEvolution(null)}
      />

      {/* Guided Full Session Flow Modal */}
      <SessionFlowModal
        isOpen={isSessionFlowOpen}
        onClose={() => setIsSessionFlowOpen(false)}
        poseData={currentPose}
      />

      {/* Practitioner Profile Preferences Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-surface-container">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">account_circle</span>
                <h3 className="font-headline-sm text-on-surface text-base">Practitioner Profile</h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant font-medium">Height & Weight:</span>
                <span className="font-bold text-on-surface">
                  {userBiometrics.heightCm} cm · {userBiometrics.weightKg} kg
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant font-medium">Calculated BMI:</span>
                <span className="font-bold text-primary">{dietPlan.bmi}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant font-medium">Constitution:</span>
                <span className="font-bold text-on-surface">{dietPlan.doshaPredominance}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-container">
                <span className="text-on-surface-variant font-medium">Diet Style:</span>
                <span className="font-bold text-on-surface capitalize">
                  {userBiometrics.dietaryPreference.replace('-', ' ')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowProfileModal(false);
                setActiveTab('nutrition');
              }}
              className="w-full py-2.5 rounded-full bg-primary text-on-primary font-label-md text-xs font-semibold shadow-sm hover:opacity-95"
            >
              Edit Nutrition & Body Stats
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
