import React, { useRef, useState, useEffect } from 'react';
import { chimeSynthesizer } from '../utils/audioChimes';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  onSelectSample?: (sampleKey: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  onSelectSample,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Timer states (10s default headstart)
  const [timerDuration, setTimerDuration] = useState<number>(10);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdownRemaining, setCountdownRemaining] = useState<number>(10);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      cancelCountdown();
      return;
    }
    startCamera();
    return () => {
      stopCamera();
      cancelCountdown();
    };
  }, [isOpen, facingMode]);

  // Countdown timer loop
  useEffect(() => {
    if (!isCountingDown) return;

    const interval = setInterval(() => {
      setCountdownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          triggerCaptureNow();
          return 0;
        }

        // Soft audio feedback at final 3, 2, 1 seconds
        if (prev <= 4) {
          chimeSynthesizer.playHoldChime();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCountingDown]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraError(
          'Camera access is not supported in this browser environment. You can upload any photo or choose a sample asana.'
        );
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera stream notice (permission denied or unavailable):', err?.message || err);
      setCameraError(
        'Camera permission is restricted or denied in this preview window. You can easily upload a photo from your device or test with a sample asana.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const cancelCountdown = () => {
    setIsCountingDown(false);
    setCountdownRemaining(timerDuration);
  };

  const handleStartCapture = () => {
    if (timerDuration === 0) {
      triggerCaptureNow();
    } else {
      setCountdownRemaining(timerDuration);
      setIsCountingDown(true);
      chimeSynthesizer.playSingingBowl();
    }
  };

  const triggerCaptureNow = () => {
    setIsCountingDown(false);
    setIsFlashing(true);
    chimeSynthesizer.playInhaleChime();

    setTimeout(() => {
      setIsFlashing(false);
      handleSnap();
    }, 300);
  };

  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/jpeg', 0.88);
    stopCamera();
    onCapture(base64);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      stopCamera();
      onCapture(result);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Hidden fallback file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">photo_camera</span>
            <div>
              <h3 className="font-headline-sm text-on-surface text-base leading-tight">
                Pose Alignment Capture
              </h3>
              <span className="text-[11px] text-on-surface-variant font-headline-md italic">
                {timerDuration > 0
                  ? `${timerDuration}s Headstart Timer active`
                  : 'Instant capture mode'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              cancelCountdown();
              onClose();
            }}
            aria-label="Close Camera"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Video Canvas or Permission Denied Fallback */}
        <div className="relative w-full aspect-[4/3] bg-inverse-surface flex items-center justify-center overflow-hidden">
          {/* Flash Shutter Effect */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-40 transition-opacity duration-300 opacity-90"></div>
          )}

          {cameraError ? (
            <div className="p-6 text-center text-inverse-on-surface flex flex-col items-center max-w-sm">
              <div className="w-14 h-14 rounded-full bg-secondary-container/30 flex items-center justify-center mb-3 text-secondary-fixed">
                <span className="material-symbols-outlined text-3xl">no_photography</span>
              </div>
              <h4 className="font-headline-sm text-base text-white mb-1">
                Camera Permission Restricted
              </h4>
              <p className="font-body-sm text-xs text-white/80 leading-relaxed mb-4">
                {cameraError}
              </p>

              {/* Direct alternative actions */}
              <div className="w-full space-y-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-full bg-primary text-on-primary font-label-md text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95"
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  <span>Upload Photo from Device</span>
                </button>

                <div className="flex gap-2 w-full pt-1">
                  <button
                    onClick={() => onSelectSample && onSelectSample('warrior2')}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-label-sm"
                  >
                    Sample: Warrior II
                  </button>
                  <button
                    onClick={() => onSelectSample && onSelectSample('treePose')}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-label-sm"
                  >
                    Sample: Tree Pose
                  </button>
                  <button
                    onClick={() => onSelectSample && onSelectSample('downDog')}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-label-sm"
                  >
                    Sample: Down Dog
                  </button>
                </div>

                <button
                  onClick={startCamera}
                  className="mt-2 text-white/60 hover:text-white text-[11px] underline block mx-auto"
                >
                  Retry Camera Access
                </button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Minimal Mat & Alignment Overlay Grid */}
              <div className="absolute inset-0 pointer-events-none border border-white/20 m-4 rounded-2xl flex flex-col justify-between p-3 z-10">
                <div className="flex justify-between items-center text-white/70 font-label-sm text-[11px]">
                  <span>ALIGN MAT WITH LOWER GUIDE</span>
                  <span>STAND 2M BACK</span>
                </div>
                {/* Center crosshair */}
                <div className="self-center w-12 h-12 border border-white/30 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
                </div>
                <div className="text-center text-white/70 font-label-sm text-[11px]">
                  <span>KEEP FULL BODY IN FRAME</span>
                </div>
              </div>

              {/* 10-SECOND HEADSTART COUNTDOWN OVERLAY */}
              {isCountingDown && (
                <div className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center p-6 animate-fadeIn">
                  {/* Glowing Animated Countdown Orb */}
                  <div className="relative w-36 h-36 flex items-center justify-center my-2">
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full border-3 border-secondary-fixed/80"></div>
                    <div className="relative w-28 h-28 rounded-full bg-primary text-on-primary flex flex-col items-center justify-center shadow-2xl">
                      <span className="font-headline-lg text-4xl font-bold leading-none">
                        {countdownRemaining}
                      </span>
                      <span className="text-[11px] font-label-sm uppercase tracking-wider opacity-90 mt-1">
                        Seconds
                      </span>
                    </div>
                  </div>

                  {/* Serene Instructions */}
                  <div className="text-center max-w-xs mt-3">
                    <h4 className="font-headline-sm text-lg text-white font-semibold">
                      Step onto your mat
                    </h4>
                    <p className="font-body-sm text-white/85 text-xs mt-1">
                      Position your body and hold your asana steadily. Capturing automatically at 0.
                    </p>
                  </div>

                  {/* Abort / Cancel Button */}
                  <button
                    onClick={cancelCountdown}
                    className="mt-5 px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-label-md text-xs transition-colors backdrop-blur-md flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    <span>Cancel Countdown</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Controls & Headstart Timer Selector */}
        {!cameraError && (
          <div className="p-4 bg-surface flex flex-col gap-3">
            {/* Timer Headstart Selector Strip */}
            <div className="flex items-center justify-between px-1">
              <span className="font-label-sm text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">timer</span>
                <span>Pose Headstart Timer:</span>
              </span>

              <div className="p-1 rounded-xl bg-surface-container flex items-center gap-1">
                <button
                  onClick={() => {
                    setTimerDuration(10);
                    if (isCountingDown) setCountdownRemaining(10);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    timerDuration === 10
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  10s (Ideal)
                </button>
                <button
                  onClick={() => {
                    setTimerDuration(5);
                    if (isCountingDown) setCountdownRemaining(5);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    timerDuration === 5
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  5s
                </button>
                <button
                  onClick={() => {
                    setTimerDuration(0);
                    cancelCountdown();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    timerDuration === 0
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Instant
                </button>
              </div>
            </div>

            {/* Main Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleFacingMode}
                disabled={isCountingDown}
                title="Flip Camera"
                className="w-11 h-11 rounded-full bg-surface-container text-primary flex items-center justify-center hover:bg-surface-container-high transition-colors shrink-0 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">flip_camera_ios</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isCountingDown}
                title="Upload Photo"
                className="w-11 h-11 rounded-full bg-surface-container text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors shrink-0 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">upload</span>
              </button>

              {/* Main Trigger Button */}
              {isCountingDown ? (
                <button
                  onClick={cancelCountdown}
                  className="flex-1 py-3 px-5 rounded-full bg-secondary-container text-on-secondary-container font-label-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[20px] animate-spin">
                    progress_activity
                  </span>
                  <span>Capturing in {countdownRemaining}s (Tap to Cancel)</span>
                </button>
              ) : (
                <button
                  onClick={handleStartCapture}
                  className="flex-1 py-3 px-5 rounded-full bg-primary text-on-primary font-label-lg flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform hover:opacity-95"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {timerDuration > 0 ? 'timer' : 'camera'}
                  </span>
                  <span>
                    {timerDuration > 0
                      ? `Start ${timerDuration}s Timer & Pose`
                      : 'Capture Pose Now'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
