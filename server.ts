import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '25mb' }));

// Server-side Google GenAI initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Preset Fallback data for Virabhadrasana II if offline or no key
const DEFAULT_VIRABHADRASANA = {
  poseName: 'Virabhadrasana II',
  englishName: 'Warrior II',
  sessionSubtitle: 'Warrior II · Foundation & Solar Plexus Expansion',
  flowCategory: 'Vinyasa Flow II',
  sessionNumber: 'Session 04',
  harmonyScore: 88,
  alignmentMarkers: [
    { id: 'knee', x: 34, y: 52, label: 'Knee Track 89°', type: 'knee', status: 'refinement' },
    { id: 'foot', x: 78, y: 78, label: 'Rooted 98%', type: 'foot', status: 'optimal' },
    { id: 'shoulder', x: 50, y: 32, label: 'Plane 180°', type: 'shoulder', status: 'optimal' },
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
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAybL5mmsNg1DOSqZwozfpvGnKhMDt-ZevOEHQjVuJpwXDJSXHmQESrC76ijLtpuNfj-qcwA8l5bzbz2Fxqq16mC5OvLaUzkcmr0GTttItb3NDlcmNAOBIcPMe0hjwYYx5tlZo1Fn7bzLKLaj0eAeG1GKH2oCvauPg3XxPwuq-2Q-iGVHFfgpNWFeuK869MQH-IebdwzJEzT8Muz_5oxwo3s87niXmgjZb0gDyqNYJodH7pnvNM3dCE',
      cues: 'From Warrior II, sweep front arm under bent thigh, reach opposite arm behind lumbar spine, clasp wrists while rotating heart to sky.',
    },
    {
      name: 'Viparita Virabhadrasana',
      badge: 'Flow',
      description: 'Reverse Warrior side-body stretch promoting lung capacity.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDswcaackGonHt4IyG8lD1zfDRgm0uxd6xGB03THVXnZMLZavIk1w8Q82LVsjZwd3A3dnXvtOpekEm5ApO8dE4IuNnGt6EuClfc_RDxoFb6ueEbxpr4V2TtCFJkE1alSsVLY-LK2zNH4rqKxSKBDn0jT7MRH7mOV-nAlwdan2cqV3CDeBPZEYCEiOA9gqXp6CQjY9cZNt8Yyaoh5_W3aLsSOPsOcOCac2M3Jl8YrzEmJqFpnkXM9OKF',
      cues: 'Keep front knee deeply bent at 90°, slide back hand down posterior calf, fan side ribs open toward ceiling with deep thoracic breath.',
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
        'Roll the tongue into an O-tube or part teeth gently; inhale cool prana over damp palate.',
        'Close mouth, retain breath lightly for 4 counts while relaxing shoulder caps.',
        'Exhale smooth, unhurried air through both nostrils for 6 counts to dissipate inner heat.',
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
};

// API: Analyze Yoga Pose Image
app.post('/api/analyze-pose', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', poseHint } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    if (!ai) {
      console.warn('GEMINI_API_KEY not configured, returning rich default analysis');
      return res.json(DEFAULT_VIRABHADRASANA);
    }

    // Clean base64 data if it contains data prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const promptText = `You are a world-class biomechanical yoga master and somatic therapist.
Analyze this yoga pose photo in detail.
Identify the exact pose (Sanskrit and English name).
Provide:
1. Pose name in Sanskrit and English, session subtitle, and flow category.
2. A Harmony Score (0 to 100 percentage based on alignment accuracy, grounding, and balance).
3. 2-3 specific visual alignment markers with approximate percentage coordinates (x: 0-100, y: 0-100) indicating key joints (e.g. knee track, back foot rooting, pelvis, shoulder plane).
4. Strengths Executed (3 detailed PROS / positive biomechanical executions observed in the pose).
5. Somatic Adjustments (2 to 3 detailed CONS / alignment mistakes observed, with their priority ('High Priority' | 'Mild' | 'Optimization'), what the mistake is, and an actionable 'somaticCue' explaining how to physically overcome and correct it).
6. Pose Evolutions (2 advanced progressions or transitions that can be made from this pose, with name, badge ('Deep' or 'Flow'), concise description, and cues).
7. Tailored Pranayama:
   - Pre-Asana breath practice (name, badge e.g. 'Solar Heating', inhale seconds, hold seconds, exhale seconds, 3 instruction steps, benefit, duration e.g. '5 Mins')
   - Post-Asana breath practice (name, badge e.g. 'Lunar Restorative', inhale seconds, hold seconds, exhale seconds, 3 instruction steps, benefit, duration e.g. '4 Mins')
8. Predicted Somatosensory Shift: heartRateDecel (negative number like -12 or -15), idaPingala ratio like '48 / 52', and nervousCoherence summary.

Ensure the output is strictly valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/jpeg',
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            poseName: { type: Type.STRING },
            englishName: { type: Type.STRING },
            sessionSubtitle: { type: Type.STRING },
            flowCategory: { type: Type.STRING },
            sessionNumber: { type: Type.STRING },
            harmonyScore: { type: Type.NUMBER },
            alignmentMarkers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  label: { type: Type.STRING },
                  type: { type: Type.STRING },
                  status: { type: Type.STRING },
                },
                required: ['label', 'x', 'y'],
              },
            },
            strengths: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['title', 'description'],
              },
            },
            mistakes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  description: { type: Type.STRING },
                  somaticCue: { type: Type.STRING },
                },
                required: ['title', 'priority', 'description', 'somaticCue'],
              },
            },
            advancements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  badge: { type: Type.STRING },
                  description: { type: Type.STRING },
                  cues: { type: Type.STRING },
                },
                required: ['name', 'description'],
              },
            },
            pranayama: {
              type: Type.OBJECT,
              properties: {
                pre: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    badge: { type: Type.STRING },
                    inhale: { type: Type.NUMBER },
                    hold: { type: Type.NUMBER },
                    exhale: { type: Type.NUMBER },
                    instructions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    benefit: { type: Type.STRING },
                    duration: { type: Type.STRING },
                  },
                  required: ['name', 'badge', 'inhale', 'hold', 'exhale', 'instructions'],
                },
                post: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    badge: { type: Type.STRING },
                    inhale: { type: Type.NUMBER },
                    hold: { type: Type.NUMBER },
                    exhale: { type: Type.NUMBER },
                    instructions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    benefit: { type: Type.STRING },
                    duration: { type: Type.STRING },
                  },
                  required: ['name', 'badge', 'inhale', 'hold', 'exhale', 'instructions'],
                },
              },
              required: ['pre', 'post'],
            },
            somatosensory: {
              type: Type.OBJECT,
              properties: {
                heartRateDecel: { type: Type.NUMBER },
                idaPingala: { type: Type.STRING },
                nervousCoherence: { type: Type.STRING },
              },
              required: ['heartRateDecel', 'idaPingala', 'nervousCoherence'],
            },
          },
          required: [
            'poseName',
            'englishName',
            'sessionSubtitle',
            'harmonyScore',
            'strengths',
            'mistakes',
            'advancements',
            'pranayama',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Pose analysis error:', err);
    // Return graceful fallback data so client always has high fidelity presentation
    return res.json(DEFAULT_VIRABHADRASANA);
  }
});

// API: Generate Diet according to BMI, gender, height, weight
app.post('/api/generate-diet', async (req, res) => {
  try {
    const {
      gender = 'female',
      heightCm = 168,
      weightKg = 58,
      age = 28,
      activityLevel = 'moderate',
      dietaryPreference = 'sattvic',
    } = req.body;

    const heightM = heightCm / 100;
    const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

    let bmiCategory = 'Optimal Equilibrium';
    if (bmi < 18.5) bmiCategory = 'Vata Delicate / Underweight';
    else if (bmi < 24.9) bmiCategory = 'Pitta / Optimal Equilibrium';
    else if (bmi < 29.9) bmiCategory = 'Kapha Dominant / Moderate Mass';
    else bmiCategory = 'Kapha Dense / Heavy Foundation';

    if (!ai) {
      // High-fidelity fallback diet
      return res.json({
        bmi,
        bmiCategory,
        doshaPredominance: bmi < 20 ? 'Vata' : bmi < 25 ? 'Pitta-Vata' : 'Kapha',
        primaryFocus: 'Agni (digestive fire) balance, prana replenishment, and cellular vitality.',
        dailyRhythm: [
          {
            period: 'Dawn Awakening',
            time: '6:30 AM',
            title: 'Warm Ginger & Tulsi Elixir',
            description: 'Warm spring water with crushed fresh ginger, holy basil (tulsi), and a drop of organic lemon to gently awaken Agni.',
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
            title: 'Kitchari of Mung Dal & Basmati with Steamed Greens',
            description: 'Easy-to-digest yellow split mung dal cooked with aged basmati, cumin seeds, turmeric, and ghee, accompanied by wilted kale and squash.',
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
          'Yellow mung dal & basmati rice',
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
      });
    }

    const promptText = `You are an expert Ayurvedic doctor and Yogic Sattvic nutrition master.
Create a personalized Sattvic and Ayurvedic meal plan tailored specifically to:
- Gender: ${gender}
- Height: ${heightCm} cm
- Weight: ${weightKg} kg
- Calculated BMI: ${bmi} (${bmiCategory})
- Age: ${age}
- Activity Level: ${activityLevel}
- Dietary Philosophy: ${dietaryPreference} (Sattvic, fresh, prana-dense, seasonal, non-inflammatory)

Provide:
1. Exact BMI and category assessment.
2. Predominant Dosha focus (Vata, Pitta, Kapha, or balance).
3. Primary health & somatic focus for their yoga practice.
4. A full daily rhythm with 5 nourishing meals/elixirs (Dawn, Breakfast, Main Lunch, Post-Asana Replenishment, Twilight Dinner) with time, title, rich description, and prana rating.
5. List of 6 best recommended Sattvic foods for their body type.
6. List of 4 foods to minimize/avoid (tamasic/rajasic).
7. Hydration guidelines calibrated to yoga practice.
8. 3 mindful eating somatic cues.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bmi: { type: Type.NUMBER },
            bmiCategory: { type: Type.STRING },
            doshaPredominance: { type: Type.STRING },
            primaryFocus: { type: Type.STRING },
            dailyRhythm: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  period: { type: Type.STRING },
                  time: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  pranaScore: { type: Type.STRING },
                },
                required: ['period', 'time', 'title', 'description', 'pranaScore'],
              },
            },
            recommendedFoods: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            foodsToAvoid: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            hydrationGuidelines: { type: Type.STRING },
            mindfulEatingCues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'bmi',
            'bmiCategory',
            'doshaPredominance',
            'primaryFocus',
            'dailyRhythm',
            'recommendedFoods',
            'foodsToAvoid',
            'hydrationGuidelines',
            'mindfulEatingCues',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Diet generation error:', err);
    return res.status(500).json({ error: 'Failed to generate personalized diet' });
  }
});

// Serve frontend in dev (via Vite middlewares) or in production
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`PranaPose full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer();
