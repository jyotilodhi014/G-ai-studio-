import React from 'react';
import { PoseAnalysisData, PoseEvolution, AlignmentMarker } from '../types/yoga';

interface PoseAlignmentSectionProps {
  poseData: PoseAnalysisData;
  onInspectEvolution: (evolution: PoseEvolution) => void;
  activeMarker: AlignmentMarker | null;
  onCloseMarker: () => void;
}

export const PoseAlignmentSection: React.FC<PoseAlignmentSectionProps> = ({
  poseData,
  onInspectEvolution,
  activeMarker,
  onCloseMarker,
}) => {
  return (
    <div className="flex flex-col space-y-6 px-margin pb-6">
      {/* Active Pin Callout (if practitioner tapped an AR marker) */}
      {activeMarker && (
        <div className="p-3.5 rounded-2xl bg-primary-fixed border border-primary/20 shadow-sm flex items-start justify-between animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">adjust</span>
            <div>
              <span className="font-label-md text-on-primary-fixed block font-bold">
                Biomechanic Marker: {activeMarker.label}
              </span>
              <p className="font-body-sm text-on-primary-fixed-variant text-xs mt-0.5">
                Target alignment status is {activeMarker.status || 'optimal'}. Keep joint stacked
                over stable foundation to prevent tendon strain.
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMarker}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/60 text-primary text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* SECTION 1: STRENGTHS EXECUTED (PROS) */}
      <div className="p-4 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Strengths Executed</h2>
          </div>
          <span className="font-label-sm text-[11px] text-primary font-semibold">
            {poseData.strengths.length} Detected
          </span>
        </div>

        <div className="space-y-2.5">
          {poseData.strengths.map((strength, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-surface-container-low flex items-start gap-2.5 transition-colors hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px] text-primary mt-0.5 material-symbols-fill">
                check_circle
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-label-lg text-on-surface font-semibold text-sm">
                  {strength.title}
                </h3>
                <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed mt-0.5">
                  {strength.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: SOMATIC ADJUSTMENTS (CONS & HOW TO OVERCOME THEM) */}
      <div className="p-4 rounded-3xl bg-surface-container-high shadow-sm border border-outline-variant/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[16px]">tune</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Somatic Adjustments</h2>
          </div>
          <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">
            Micro-Refinements
          </span>
        </div>

        <div className="space-y-3">
          {poseData.mistakes.map((mistake, idx) => {
            const isHigh = mistake.priority === 'High Priority';
            const isMild = mistake.priority === 'Mild';
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-[0_2px_8px_rgba(46,35,37,0.03)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-primary font-semibold text-sm">
                    {mistake.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] font-semibold ${
                      isHigh
                        ? 'bg-error-container text-on-error-container'
                        : isMild
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {mistake.priority}
                  </span>
                </div>

                <p className="font-body-sm text-on-surface text-xs mt-1 leading-relaxed">
                  {mistake.description}
                </p>

                {/* Overcoming the flaw with a somatic cue */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-surface-container-low text-on-secondary-container font-body-sm text-xs flex items-start gap-2 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">
                    self_improvement
                  </span>
                  <div className="leading-relaxed">
                    <strong className="font-label-md text-on-surface">Somatic Cue: </strong>
                    <span>{mistake.somaticCue}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: POSE EVOLUTIONS (ADVANCEMENTS THAT CAN BE MADE) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Pose Evolutions</h2>
          <span className="font-label-sm text-primary font-semibold text-xs">Expand Practice</span>
        </div>
        <p className="font-body-sm text-on-surface-variant text-xs mb-3">
          Ready to deepen {poseData.poseName}? Explore fluid transitions and progressive advancements.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {poseData.advancements.map((evo, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between"
            >
              <div>
                {evo.imageUrl ? (
                  <div className="relative w-full h-28 rounded-xl overflow-hidden bg-surface-container mb-2.5">
                    <img src={evo.imageUrl} alt={evo.name} className="w-full h-full object-cover" />
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-inverse-surface/80 text-inverse-on-surface text-[10px] font-label-sm font-semibold backdrop-blur-sm">
                      {evo.badge}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-12 flex items-center justify-between px-2 mb-2 bg-surface-container-low rounded-xl">
                    <span className="text-xs font-semibold text-primary">{evo.badge} Progression</span>
                    <span className="material-symbols-outlined text-primary text-[18px]">altitude</span>
                  </div>
                )}

                <h3 className="font-label-lg text-on-surface font-semibold text-sm">{evo.name}</h3>
                <p className="font-body-sm text-on-surface-variant text-xs line-clamp-2 mt-1 leading-relaxed">
                  {evo.description}
                </p>
              </div>

              <button
                onClick={() => onInspectEvolution(evo)}
                className="mt-3 w-full py-2 rounded-full bg-surface-container-low text-primary font-label-sm text-xs font-semibold hover:bg-surface-container transition-colors text-center flex items-center justify-center gap-1"
              >
                <span>Inspect Cues</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
