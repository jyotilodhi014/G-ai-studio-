export interface AlignmentMarker {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label: string;
  type?: string;
  status?: 'optimal' | 'warning' | 'refinement';
}

export interface Strength {
  title: string;
  description: string;
}

export interface MistakeAdjustment {
  title: string;
  priority: 'High Priority' | 'Mild' | 'Optimization';
  description: string;
  somaticCue: string;
}

export interface PoseEvolution {
  name: string;
  badge: 'Deep' | 'Flow' | 'Core' | 'Balance';
  description: string;
  imageUrl?: string;
  cues: string;
}

export interface PranayamaPhase {
  name: string;
  badge: string;
  inhale: number;
  hold: number;
  exhale: number;
  instructions: string[];
  benefit: string;
  duration: string;
}

export interface SomatosensoryModel {
  heartRateDecel: number;
  idaPingala: string;
  nervousCoherence: string;
}

export interface PoseAnalysisData {
  id?: string;
  poseName: string;
  englishName: string;
  sessionSubtitle: string;
  flowCategory: string;
  sessionNumber?: string;
  harmonyScore: number;
  imageUrl?: string;
  alignmentMarkers: AlignmentMarker[];
  strengths: Strength[];
  mistakes: MistakeAdjustment[];
  advancements: PoseEvolution[];
  pranayama: {
    pre: PranayamaPhase;
    post: PranayamaPhase;
  };
  somatosensory: SomatosensoryModel;
}

export interface MealItem {
  period: string;
  time: string;
  title: string;
  description: string;
  pranaScore: string;
}

export interface DietPlan {
  bmi: number;
  bmiCategory: string;
  doshaPredominance: string;
  primaryFocus: string;
  dailyRhythm: MealItem[];
  recommendedFoods: string[];
  foodsToAvoid: string[];
  hydrationGuidelines: string;
  mindfulEatingCues: string[];
}

export interface UserBiometrics {
  gender: 'female' | 'male' | 'non-binary';
  heightCm: number;
  weightKg: number;
  age: number;
  activityLevel: 'gentle' | 'moderate' | 'intense';
  dietaryPreference: 'sattvic' | 'ayurvedic-tridoshic';
}

// Preset poses with rich realistic yoga analysis
export const PRESET_POSES: Record<string, PoseAnalysisData> = {
  warrior2: {
    id: 'warrior2',
    poseName: 'Virabhadrasana II',
    englishName: 'Warrior II',
    sessionSubtitle: 'Warrior II · Foundation & Solar Plexus Expansion',
    flowCategory: 'Vinyasa Flow II',
    sessionNumber: 'Session 04',
    harmonyScore: 88,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6-DOLwjAB0b_JfVO8qvOz5dMrzGAxbAHfk7Z88cUU9Ve7q2f8tf8ayVY5z-a1HF1QMpNzmWi_t29EpOsJc7ForKfJk6GRV4TEb_l0TpiICs5NJf2wuj6jyBgiFF2ziWcNJ0vNlmZcrYT7Te0cBJM2hpgt2qqkRoupVvUm9ee1_ksKE8dGrCXvaCqQRfth4X35dfCzkqs2bIh8EITLvka73dRvHS55Ak5PLIcZhumfbIwkxno5dlMP',
    alignmentMarkers: [
      { id: 'knee', x: 34, y: 52, label: 'Knee Track 89°', status: 'refinement' },
      { id: 'foot', x: 78, y: 78, label: 'Rooted 98%', status: 'optimal' },
      { id: 'shoulder', x: 50, y: 32, label: 'Plane 180°', status: 'optimal' },
    ],
    strengths: [
      {
        title: 'Solid Posterior Grounding',
        description: 'Outer razor blade edge of back foot is fully anchored with arched lift intact.',
      },
      {
        title: 'Radiant Clavicular Opening',
        description: 'Sternum lifted and collarbones broad across horizontal plane.',
      },
      {
        title: 'Drishti Focus',
        description: 'Eye gaze unwavering over middle right fingertip; nervous system settled.',
      },
    ],
    mistakes: [
      {
        title: 'Front Knee Drift',
        priority: 'High Priority',
        description: 'Right knee collapsing 4° medial.',
        somaticCue: 'Press into outer right hip and magnetize knee toward the pinky toe. Stack knee directly over ankle.',
      },
      {
        title: 'Trapezius Guarding',
        priority: 'Mild',
        description: 'Shoulder blades subtly creeping towards cervical spine.',
        somaticCue: 'Turn palms upwards to reset shoulder blades down back ribs, then rotate only forearms back down.',
      },
      {
        title: 'Pelvic Neutrality',
        priority: 'Optimization',
        description: 'Anterior tilt compressing lumbar spine.',
        somaticCue: 'Gently tuck tailbone toward earth, knit lower front ribs together to lengthen sacrum.',
      },
    ],
    advancements: [
      {
        name: 'Baddha Virabhadrasana',
        badge: 'Deep',
        description: 'Bound Warrior with chest release and deep hip opener.',
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAybL5mmsNg1DOSqZwozfpvGnKhMDt-ZevOEHQjVuJpwXDJSXHmQESrC76ijLtpuNfj-qcwA8l5bzbz2Fxqq16mC5OvLaUzkcmr0GTttItb3NDlcmNAOBIcPMe0hjwYYx5tlZo1Fn7bzLKLaj0eAeG1GKH2oCvauPg3XxPwuq-2Q-iGVHFfgpNWFeuK869MQH-IebdwzJEzT8Muz_5oxwo3s87niXmgjZb0gDyqNYJodH7pnvNM3dCE',
        cues: 'From Warrior II, thread front shoulder under front thigh, clasp hands behind lumbar spine, peel sternum open toward the sky while anchoring back foot.',
      },
      {
        name: 'Viparita Virabhadrasana',
        badge: 'Flow',
        description: 'Reverse Warrior side-body stretch promoting lung capacity.',
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDswcaackGonHt4IyG8lD1zfDRgm0uxd6xGB03THVXnZMLZavIk1w8Q82LVsjZwd3A3dnXvtOpekEm5ApO8dE4IuNnGt6EuClfc_RDxoFb6ueEbxpr4V2TtCFJkE1alSsVLY-LK2zNH4rqKxSKBDn0jT7MRH7mOV-nAlwdan2cqV3CDeBPZEYCEiOA9gqXp6CQjY9cZNt8Yyaoh5_W3aLsSOPsOcOCac2M3Jl8YrzEmJqFpnkXM9OKF',
        cues: 'Maintain deep 90° front knee bend, sweep leading arm skyward and gently slide back hand down back calf without collapsing the lumbar spine.',
      },
    ],
    pranayama: {
      pre: {
        name: 'Ujjayi Wave (4 · 2 · 4)',
        badge: 'Solar Heating',
        inhale: 4,
        hold: 2,
        exhale: 4,
        instructions: [
          'Lightly contract the glottis at the back of the throat on both inhale and exhale.',
          'Generate a quiet, rhythmic whisper mimicking gentle ocean surf.',
          'Maintain during the 5-breath hold in Warrior II to temper the sympathetic surge.',
        ],
        benefit: 'HRV Resonance +18%',
        duration: '5 Mins',
      },
      post: {
        name: 'Sitali Cooling (4 · 4 · 6)',
        badge: 'Lunar Restorative',
        inhale: 4,
        hold: 4,
        exhale: 6,
        instructions: [
          'Roll tongue into an O-tube or gently part lips; sip cool air across tongue.',
          'Retain smoothly for 4 counts while relaxing facial mask and eyelids.',
          'Exhale warm breath unhurriedly through nostrils for 6 counts to restore parasympathetic calm.',
        ],
        benefit: 'Vagal Tone Elevation',
        duration: '4 Mins',
      },
    },
    somatosensory: {
      heartRateDecel: -14,
      idaPingala: '48 / 52',
      nervousCoherence: 'Calm focus, reduced cortisol spikes',
    },
  },
  treePose: {
    id: 'treePose',
    poseName: 'Vrikshasana',
    englishName: 'Tree Pose',
    sessionSubtitle: 'Tree Pose · Root Chakra Grounding & Equilibrium',
    flowCategory: 'Hatha Balance I',
    sessionNumber: 'Session 02',
    harmonyScore: 92,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBuL7ryIU1MrKMT-e6iVdrS2cADzi4AVLJKTZgsG4Hqbwjv75tuVFnh8JtXMRxF-Z3C39D2yRf0zGNXKoVTdoO-33bfkCWIvtEZ9P_rmBgjLuhi8pDqmnmfxN4oRgNevkkFeJ1HbAEhSe7pN6HJ4UDQrqmRiuoiDoE046KW38nHPhcxm2NkEei7Geai0FouZ60G3dGAWY2cS-hUEON1DX7d2NJr8FlmgD5CJD0zu8Rji3HAehLHB9Tx',
    alignmentMarkers: [
      { id: 'foot-root', x: 50, y: 92, label: 'Tri-pod Base 96%', status: 'optimal' },
      { id: 'hip-level', x: 50, y: 56, label: 'Pelvic Level 2°', status: 'optimal' },
      { id: 'knee-hinge', x: 38, y: 64, label: 'Abduction 84°', status: 'refinement' },
    ],
    strengths: [
      {
        title: 'Single-Leg Proprioception',
        description: 'Micro-adjustments in standing ankle are steady and responsive.',
      },
      {
        title: 'Anjali Mudra Centering',
        description: 'Palms pressed evenly at heart center with thumbs resting at sternum.',
      },
      {
        title: 'Axial Spine Elongation',
        description: 'Crown of head reaching straight upward without rib flare.',
      },
    ],
    mistakes: [
      {
        title: 'Foot on Knee Joint',
        priority: 'High Priority',
        description: 'Bent foot pressing sideways directly into medial collateral ligament.',
        somaticCue: 'Slide sole either up onto inner thigh or down onto calf; never press directly against the knee joint.',
      },
      {
        title: 'Standing Hip Sinking',
        priority: 'Mild',
        description: 'Weight collapsing into standing outer hip joint.',
        somaticCue: 'Hug outer standing hip in toward midline; imagine lifting ribcage up out of pelvis.',
      },
    ],
    advancements: [
      {
        name: 'Utthita Hasta Padangusthasana',
        badge: 'Balance',
        description: 'Extended Hand-To-Big-Toe pose cultivating hamstring openness and steady core.',
        cues: 'From tree pose, hook big toe with index and middle fingers, extend leg straight forward and open out to side.',
      },
      {
        name: 'Vrksasana with Closed Eyes',
        badge: 'Deep',
        description: 'Sensory withdrawal (Pratyahara) testing deep vestibular and neuromuscular balance.',
        cues: 'Anchor gaze inward, soften jaw, soften breath, close eyes for 5 smooth rhythmic breath cycles.',
      },
    ],
    pranayama: {
      pre: {
        name: 'Sama Vritti (Equal Breath 4 · 4 · 4)',
        badge: 'Equilibrium',
        inhale: 4,
        hold: 4,
        exhale: 4,
        instructions: [
          'Breathe evenly through nose, equalizing the length of inhalation and exhalation.',
          'Hold gently at the peak without throat tension.',
          'Stabilizes the mental fluctuations (citta vritti) before balancing.',
        ],
        benefit: 'Vestibular Focus +22%',
        duration: '4 Mins',
      },
      post: {
        name: 'Bhramari (Humming Bee Breath)',
        badge: 'Nerve Soother',
        inhale: 4,
        hold: 2,
        exhale: 6,
        instructions: [
          'Inhale deep into belly.',
          'Close ears with thumbs, exhale with a resonant low pitch hummingbird buzz in skull.',
          'Releases standing leg muscle tension and calms amygdala.',
        ],
        benefit: 'Vagal Relaxation Spike',
        duration: '5 Mins',
      },
    },
    somatosensory: {
      heartRateDecel: -18,
      idaPingala: '50 / 50',
      nervousCoherence: 'Deep neural steadiness & stillness',
    },
  },
  downDog: {
    id: 'downDog',
    poseName: 'Adho Mukha Svanasana',
    englishName: 'Downward-Facing Dog',
    sessionSubtitle: 'Downward Dog · Inversion Energy & Spinal Decompression',
    flowCategory: 'Ashtanga Primary',
    sessionNumber: 'Session 01',
    harmonyScore: 85,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6-DOLwjAB0b_JfVO8qvOz5dMrzGAxbAHfk7Z88cUU9Ve7q2f8tf8ayVY5z-a1HF1QMpNzmWi_t29EpOsJc7ForKfJk6GRV4TEb_l0TpiICs5NJf2wuj6jyBgiFF2ziWcNJ0vNlmZcrYT7Te0cBJM2hpgt2qqkRoupVvUm9ee1_ksKE8dGrCXvaCqQRfth4X35dfCzkqs2bIh8EITLvka73dRvHS55Ak5PLIcZhumfbIwkxno5dlMP',
    alignmentMarkers: [
      { id: 'wrist', x: 25, y: 75, label: 'Hasta Bandha 92%', status: 'optimal' },
      { id: 'spine', x: 50, y: 40, label: 'Spine Angle 172°', status: 'refinement' },
      { id: 'heels', x: 75, y: 78, label: 'Heel Anchor 80%', status: 'refinement' },
    ],
    strengths: [
      {
        title: 'Active Finger Pad Suction',
        description: 'Hasta Bandha engaged; base of index knuckles firmly grounding the mat.',
      },
      {
        title: 'Serratus Anterior Activation',
        description: 'Shoulder blades wrapping wide around ribcage, creating neck freedom.',
      },
      {
        title: 'Sit Bones Elevation',
        description: 'Ischial tuberosities reaching up and back toward ceiling.',
      },
    ],
    mistakes: [
      {
        title: 'Thoracic Rounding',
        priority: 'High Priority',
        description: 'Tight hamstrings causing upper spine to hunch forward over wrists.',
        somaticCue: 'Bend knees generously to tilt pelvis anteriorly and lengthen the lumbar spine first.',
      },
      {
        title: 'Shoulders Crowding Ears',
        priority: 'Mild',
        description: 'Internally rotated upper arms pinching the neck.',
        somaticCue: 'Spin triceps toward each other and wrap armpits toward the heart.',
      },
    ],
    advancements: [
      {
        name: 'Eka Pada Adho Mukha Svanasana',
        badge: 'Flow',
        description: 'Three-Legged Downward Dog opening the hip while stabilizing the shoulders.',
        cues: 'Float one leg skyward with toes pointed down and hips square, pressing chest evenly back.',
      },
      {
        name: 'Downward Dog to Dolphin Pose',
        badge: 'Core',
        description: 'Forearm inversion building powerful shoulder girdle stability for headstand.',
        cues: 'Lower forearms parallel to floor, interlace fingers or keep palms flat, walk feet 2 inches forward.',
      },
    ],
    pranayama: {
      pre: {
        name: 'Kapalabhati (Skull Shining Breath)',
        badge: 'Solar Heating',
        inhale: 2,
        hold: 1,
        exhale: 2,
        instructions: [
          'Active sharp abdominal exhales paired with passive rebound inhalations.',
          'Clears sinuses and energizes the diaphragm prior to inversions.',
        ],
        benefit: 'Oxygen Saturation Boost',
        duration: '3 Mins',
      },
      post: {
        name: 'Balasana Deep Diaphragmatic Breath',
        badge: 'Restorative',
        inhale: 4,
        hold: 2,
        exhale: 6,
        instructions: [
          'Rest in Child’s Pose, breathing into posterior lung ribs.',
          'Decompresses lumbar spine and resets autonomic equilibrium.',
        ],
        benefit: 'Spinal Pressure Release',
        duration: '4 Mins',
      },
    },
    somatosensory: {
      heartRateDecel: -12,
      idaPingala: '49 / 51',
      nervousCoherence: 'Spinal decompression & cranial serenity',
    },
  },
};
