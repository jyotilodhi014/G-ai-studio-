# PranaPose — Serene Yoga Pose Corrector & Mindful Wellness Sanctuary

An intelligent, calming yoga pose correction and mindful practice app that analyzes posture photos and camera snapshots using Gemini Multimodal AI. The app highlights alignment strengths and flaws, delivers somatic micro-correction cues, prescribes pose evolutions, provides pre- and post-asana Pranayama breath pacing with soft chime audio, and suggests personalized Sattvic/Ayurvedic meal plans based on practitioner biometrics (BMI, height, weight, gender).

## User Review & Critical Decisions

> [!IMPORTANT]
> All key design and product decisions have been aligned with your preferences and the provided Serene Botanical Sanctuary specifications:

- **Pose Capture & Vision**: Live camera snapshot stream plus instant device photo upload, preloaded with a curated gallery of reference asanas (Virabhadrasana II, Vrikshasana, Adho Mukha Svanasana, Trikonasana, Bhujangasana).
- **Nutritional Framework**: Grounded in Yogic Sattvic and Ayurvedic dietary wisdom, calibrated strictly to user biometrics (height, weight, gender, age, calculated BMI and category).
- **Breathwork Guidance**: Concentric breathing visual pacer coupled with gentle procedural harmonic audio chimes (Web Audio API) for inhale, retain, and exhale intervals.
- **Visual Design**: Strict Serene Botanical Sanctuary theme — soft linen canvas (`#FAF4F3`), warm clay and dusty rose accents (`#7E4E5A`, `#FDC6D4`), serif display titles (Newsreader) and clean ergonomic body copy (Plus Jakarta Sans).

---

## 1. Overview & Core Concept

### What It Does
- **Biomechanical Pose Scan**: Practitioners upload an image or capture a snapshot via webcam. The system processes the image using Gemini Vision AI to recognize the pose, calculate a Harmony Score, place alignment markers, list strengths (pros), identify alignment mistakes (cons), provide somatic verbal cues to overcome flaws, and offer advanced pose progressions (evolutions).
- **Integrated Pranayama**: Tailors breathwork sequences before (prepare / solar heating) and after (integrate / lunar cooling) the scanned pose, featuring an interactive pacing ring with soft harmonic chimes.
- **Biometric Sattvic Nutrition Engine**: Calculates practitioner BMI and classifies status, outputting personalized Ayurvedic and Sattvic meal timetables, prana-replenishing recipes, and dosha balance guidelines.
- **Practice Sanctuary Log**: Practitioners can save analyzed sessions, bookmark favorite cues, and track their somatic progress over time.

### Target Audience & Persona
Yoga enthusiasts, practitioners of all levels, and yoga teachers seeking safe posture alignment feedback, mindful breath integration, and holistic Ayurvedic nutrition without mechanical clutter.

---

## 2. User Experience & Visual Design

```
┌─────────────────────────────────────────────────────────────┐
│                    PranaPose Sanctuary                      │
├─────────────────────────────────────────────────────────────┤
│  [ Header: Lotus Brand · Notifications · Practitioner Profile ] │
│                                                             │
│  [ View Tabs: ✦ Pose Alignment  |  ≋ Breath Resonance  ]    │
├───────────────────────────────┬─────────────────────────────┤
│        Pose Analysis          │      Integrated Breath      │
│  • Biomechanical AR Mat       │  • Concentric Pacer Ring    │
│  • Harmony Score & Live Pins  │  • Inhale / Hold / Exhale   │
│  • Strengths Executed (Pros)  │  • Soft Crystal Chimes (Web)│
│  • Somatic Adjustments (Cons) │  • Pre/Post Asana Curations │
│  • Pose Evolutions Carousel   │  • Somatosensory Metrics    │
├───────────────────────────────┴─────────────────────────────┤
│                 Mindful Nutrition Tab                       │
│  • Practitioner Profile (Height, Weight, Gender, Age, BMI) │
│  • Sattvic / Ayurvedic Dosha Diet & Prana Meal Timing       │
│  • Hydrating Elixirs & Post-Asana Replenishment             │
├─────────────────────────────────────────────────────────────┤
│  [ Bottom Navigation: Scan · Pranayama · Nutrition · Profile ]│
└─────────────────────────────────────────────────────────────┘
```

### Key User Flows
1. **Pose Scan & Correct Flow**:
   - Practitioner opens **Scan**, selects a photo or triggers the camera snapshot.
   - Multimodal AI analyzes posture geometry, returning a harmony score, detected joint angles, pros, cons, step-by-step corrections, and evolutions.
   - Interactive pins allow tapping to inspect joint angle discrepancies.
2. **Breath Resonance Flow**:
   - Practitioner switches to **Breath Resonance** or selects **Pre/Post-Asana** toggle.
   - Starts the resonance pacer: concentric rings swell with inhale, settle during retention, and contract on exhale with soothing audio chimes.
3. **Biometric Nutrition Flow**:
   - Practitioner inputs height, weight, gender, and age; BMI is calculated and displayed with a health spectrum indicator.
   - Tailored Sattvic daily meals (morning elixir, prana breakfast, noon grounding meal, post-practice tonic, light twilight dinner) are generated with macronutrient and Ayurvedic guidance.

### Visual Identity & Theme Tokens
- **Palette**:
  - Base Canvas: Soft Linen Cream (`#FFF8F7` / `#FAF4F3`)
  - Primary Clay: `#7E4E5A`
  - Dusty Rose Accent: `#FDC6D4` / `#D9A5B3`
  - Text: Deep Grounding Espresso (`#23191B`) and Warm Charcoal (`#504346`)
- **Typography**:
  - Display & Headlines: `Newsreader`, italic accents, elegant serifs
  - Body & Micro-labels: `Plus Jakarta Sans`, clean tabular numbers
- **Zero-Pill Rule**: Unboxed metadata separators (`·`), clean typography, full-width touch targets ($\ge 44\text{px}$).

---

## 3. Key Product Decisions & Trade-Offs

- **Server-Side Gemini Vision Integration (`gemini-3.8-flash`)**:
  - *Chosen Approach*: Node/Express server endpoint `/api/analyze-pose` utilizing `@google/genai` with structured JSON schema.
  - *Why*: Securely protects API credentials, provides fast multimodal image recognition, and enforces consistent JSON output for pros, cons, somatic cues, and progressions.
- **Web Audio Procedural Chimes**:
  - *Chosen Approach*: Lightweight Web Audio API synthesizer generating peaceful warm harmonic sine waves with exponential decay.
  - *Why*: Zero external audio asset dependencies; instant, reliable playback across mobile and desktop without network latency.
- **Local Persistence & Presets**:
  - *Chosen Approach*: `localStorage` stores user biometric profile, practice history, and bookmarks; initial library includes Virabhadrasana II, Vrikshasana, and Adho Mukha Svanasana with instant fallback data if offline.

---

## 4. Technical Architecture & Data Strategy

```
┌───────────────────────────────────────────────────────────────┐
│                       Client (React 19)                       │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐  │
│  │  Pose Scanner │  │ Breath Pacer  │  │ Biometric Diet    │  │
│  │  (Camera/File)│  │ (Audio Chime) │  │ (BMI Calculator)  │  │
│  └───────┬───────┘  └───────┬───────┘  └─────────┬─────────┘  │
│          │                  │                    │            │
│          ▼                  ▼                    ▼            │
│   [ Local State ]    [ Web Audio Ctx ]    [ Local Storage ]   │
└──────────┬────────────────────────────────────────────────────┘
           │ POST /api/analyze-pose (image base64)
           ▼
┌───────────────────────────────────────────────────────────────┐
│                   Server (Express + Gemini)                   │
│   • GoogleGenAI SDK with gemini-3.8-flash                     │
│   • Structured schema: harmonyScore, strengths, mistakes,     │
│     somaticCues, advancements, preBreath, postBreath          │
└───────────────────────────────────────────────────────────────┘
```

### Core Data Models
- **PoseAnalysis**:
  - `poseName`: Sanskrit and English name
  - `harmonyScore`: 0–100%
  - `imageUrl`: string (uploaded or preset)
  - `markers`: array of `{ id, x, y, label, type, angle }`
  - `strengths`: array of `{ title, description }`
  - `mistakes`: array of `{ title, priority, description, somaticCue }`
  - `advancements`: array of `{ name, description, imageUrl, badge }`
  - `prePranayama`: `{ title, type, duration, instructions, benefits }`
  - `postPranayama`: `{ title, type, duration, instructions, benefits }`
- **UserProfile**:
  - `gender`: string
  - `heightCm`: number
  - `weightKg`: number
  - `age`: number
  - `bmi`: number
  - `dietaryPreference`: 'sattvic' | 'ayurvedic-tridoshic'
  - `mealPlan`: `{ morning, breakfast, lunch, postYoga, dinner, guidelines }`
