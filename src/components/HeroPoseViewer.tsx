import React, { useState } from 'react';
import { PoseAnalysisData, AlignmentMarker } from '../types/yoga';

interface HeroPoseViewerProps {
  poseData: PoseAnalysisData;
  isAnalyzing: boolean;
  onOpenCamera: () => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectPreset: (key: string) => void;
  activeMarkerId: string | null;
  onSelectMarker: (marker: AlignmentMarker | null) => void;
}

export const HeroPoseViewer: React.FC<HeroPoseViewerProps> = ({
  poseData,
  isAnalyzing,
  onOpenCamera,
  onUploadFile,
  onSelectPreset,
  activeMarkerId,
  onSelectMarker,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${poseData.poseName} - PranaPose Alignment`,
        text: `Achieved ${poseData.harmonyScore}% Harmony in ${poseData.englishName} with PranaPose!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2400);
    }
  };

  return (
    <div className="w-full">
      {/* Sub-Header / Pose Title Strip */}
      <div className="px-margin pt-2 pb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px]">
              <span className="material-symbols-outlined text-[13px] material-symbols-fill">spa</span>
              {poseData.flowCategory || 'Vinyasa Flow'}
            </span>
            <span className="font-label-sm text-[11px] text-outline">
              {poseData.sessionNumber || 'Session 04'}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mt-0.5 leading-tight">
            {poseData.poseName}
          </h1>
          <p className="font-body-sm text-on-surface-variant font-headline-md italic">
            {poseData.englishName} · {poseData.sessionSubtitle}
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => setIsBookmarked((prev) => !prev)}
            aria-label="Save to Log"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm ${
              isBookmarked
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isBookmarked ? 'material-symbols-fill' : ''
              }`}
            >
              {isBookmarked ? 'bookmark_added' : 'bookmark'}
            </span>
          </button>

          <button
            onClick={handleShare}
            aria-label="Share Practice"
            className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest flex items-center justify-center transition-all active:scale-90 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>

          {/* Share Toast */}
          {showShareToast && (
            <div className="absolute top-12 right-0 bg-inverse-surface text-inverse-on-surface px-3 py-1.5 rounded-full text-xs whitespace-nowrap shadow-md z-30">
              Practice summary link copied!
            </div>
          )}
        </div>
      </div>

      {/* Hero Visual: Practitioner Alignment Capture */}
      <div className="px-margin pb-4">
        <div className="relative w-full rounded-3xl overflow-hidden bg-surface-container shadow-sm border border-outline-variant/30">
          {/* Main Visual */}
          <div className="w-full h-72 sm:h-80 relative bg-surface-container-high">
            <img
              src={
                poseData.imageUrl ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuA6-DOLwjAB0b_JfVO8qvOz5dMrzGAxbAHfk7Z88cUU9Ve7q2f8tf8ayVY5z-a1HF1QMpNzmWi_t29EpOsJc7ForKfJk6GRV4TEb_l0TpiICs5NJf2wuj6jyBgiFF2ziWcNJ0vNlmZcrYT7Te0cBJM2hpgt2qqkRoupVvUm9ee1_ksKE8dGrCXvaCqQRfth4X35dfCzkqs2bIh8EITLvka73dRvHS55Ak5PLIcZhumfbIwkxno5dlMP'
              }
              alt={poseData.poseName}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isAnalyzing ? 'opacity-40 blur-[1px]' : 'opacity-100'
              }`}
            />

            {/* Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/20 to-transparent"></div>

            {/* Analyzing Loading Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-inverse-surface/50 backdrop-blur-sm z-20">
                <div className="w-12 h-12 rounded-full border-3 border-secondary-container border-t-primary animate-spin mb-3"></div>
                <span className="font-headline-sm text-white text-base">
                  Analyzing Biomechanics...
                </span>
                <span className="font-body-sm text-white/80 text-xs mt-1">
                  Gemini Vision inspecting joint geometry & somatic plane
                </span>
              </div>
            )}

            {/* AR Alignment Pins / Markers Overlay */}
            {!isAnalyzing &&
              poseData.alignmentMarkers &&
              poseData.alignmentMarkers.map((marker) => {
                const isSelected = activeMarkerId === marker.id;
                return (
                  <div
                    key={marker.id}
                    style={{ top: `${marker.y}%`, left: `${marker.x}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <button
                      onClick={() => onSelectMarker(isSelected ? null : marker)}
                      className="relative flex items-center justify-center group focus:outline-none"
                    >
                      {/* Pulsing halo */}
                      <span className="absolute w-7 h-7 rounded-full bg-secondary-fixed/50 animate-ping pointer-events-none"></span>
                      {/* Core pin */}
                      <span
                        className={`w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center shadow-md transition-transform group-hover:scale-125 ${
                          marker.status === 'optimal'
                            ? 'bg-primary'
                            : 'bg-primary-fixed'
                        }`}
                      ></span>

                      {/* Pill Badge */}
                      <div
                        className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full font-label-sm text-[11px] whitespace-nowrap shadow-md backdrop-blur-sm transition-all ${
                          isSelected
                            ? 'bg-primary text-on-primary ring-2 ring-white scale-105'
                            : 'bg-inverse-surface/90 text-inverse-on-surface opacity-95'
                        }`}
                      >
                        {marker.label}
                      </div>
                    </button>
                  </div>
                );
              })}

            {/* Harmony Score Badge */}
            <div className="absolute top-3 left-3 bg-surface-container-lowest/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2 border border-surface-container">
              <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[15px] text-on-secondary-container material-symbols-fill">
                  balance
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="font-headline-sm text-headline-sm text-primary leading-none">
                  {poseData.harmonyScore}%
                </span>
                <span className="font-label-sm text-on-surface-variant font-medium ml-1">
                  Harmony
                </span>
              </div>
            </div>

            {/* Live Scan Status & Action Triggers */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-inverse-on-surface z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
                <span className="font-label-sm text-[11px] text-inverse-on-surface/90 tracking-wide uppercase font-semibold">
                  AI Biomechanical Scan
                </span>
              </div>

              {/* Re-scan / Capture Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setShowPresetMenu((prev) => !prev)}
                  className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/95 hover:bg-surface-container-lowest text-primary text-label-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 border border-surface-container"
                >
                  <span className="material-symbols-outlined text-[15px]">flip_camera_ios</span>
                  <span>Re-scan</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                </button>

                {/* Scan Options Popup */}
                {showPresetMenu && (
                  <div className="absolute right-0 bottom-10 w-60 rounded-2xl bg-surface-container-lowest p-2 shadow-2xl border border-surface-container z-30 animate-fadeIn">
                    <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider px-2 py-1 block">
                      Capture or Switch Asana
                    </span>

                    {/* Camera Trigger */}
                    <button
                      onClick={() => {
                        setShowPresetMenu(false);
                        onOpenCamera();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left font-label-md text-xs text-on-surface hover:bg-surface-container flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-primary text-[18px]">photo_camera</span>
                      <span>Live Camera Snapshot</span>
                    </button>

                    {/* File Upload Trigger */}
                    <button
                      onClick={() => {
                        setShowPresetMenu(false);
                        fileInputRef.current?.click();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left font-label-md text-xs text-on-surface hover:bg-surface-container flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-primary text-[18px]">upload</span>
                      <span>Upload Device Photo</span>
                    </button>

                    <div className="my-1 border-t border-surface-container"></div>
                    <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider px-2 py-1 block">
                      Preset Asanas
                    </span>

                    <button
                      onClick={() => {
                        setShowPresetMenu(false);
                        onSelectPreset('warrior2');
                      }}
                      className="w-full px-3 py-1.5 rounded-xl text-left font-body-sm text-xs text-on-surface hover:bg-surface-container flex items-center justify-between"
                    >
                      <span>Virabhadrasana II</span>
                      <span className="text-[10px] text-outline">Warrior II</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowPresetMenu(false);
                        onSelectPreset('treePose');
                      }}
                      className="w-full px-3 py-1.5 rounded-xl text-left font-body-sm text-xs text-on-surface hover:bg-surface-container flex items-center justify-between"
                    >
                      <span>Vrikshasana</span>
                      <span className="text-[10px] text-outline">Tree Pose</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowPresetMenu(false);
                        onSelectPreset('downDog');
                      }}
                      className="w-full px-3 py-1.5 rounded-xl text-left font-body-sm text-xs text-on-surface hover:bg-surface-container flex items-center justify-between"
                    >
                      <span>Adho Mukha Svanasana</span>
                      <span className="text-[10px] text-outline">Downward Dog</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onUploadFile}
          className="hidden"
        />
      </div>
    </div>
  );
};
