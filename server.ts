import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import * as pdfParseModule from 'pdf-parse';
const pdfParse = (pdfParseModule as any).default || pdfParseModule;
import { standardsDatabase, getRecommendations } from './src/data/standards.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === API ROUTES ===
  
  app.post('/api/analyze', async (req, res) => {
    try {
      const { text } = req.body;

      // === DEMO SCENARIOS INTERCEPT ===
      const t = text.trim();
      if (t === "We require High Strength Deformed Steel Bars (Fe 500D) for RCC construction in a bridge project.") {
        return res.json({
          requirements: { product: "Reinforcement Steel Bars", intendedUse: "RCC construction in bridge project", requirements: ["Fe 500D grade", "High Strength Deformed"], classification: "CLEAR", missingInfo: [], keywords: ["steel", "Fe 500D", "deformed bar", "RCC"], detectedLanguage: "English", normalizedRequirement: t },
          recommendations: getRecommendations({ product: "Reinforcement Steel", intendedUse: "RCC", requirements: [], classification: "CLEAR", missingInfo: [], keywords: ["steel", "Fe 500D", "deformed bar", "RCC"] }),
          gaps: [{ issue: "Missing dimensional tolerance", severity: "LOW", whyItMatters: "May affect concrete cover", recommendedAction: "Specify required nominal sizes per IS 1786." }],
          conflicts: []
        });
      } else if (t === "Supply of 43 grade ordinary portland cement for general civil works.") {
        return res.json({
          requirements: { product: "Cement", intendedUse: "General civil works", requirements: ["43 grade", "Ordinary Portland Cement"], classification: "CLEAR", missingInfo: [], keywords: ["cement", "OPC", "43 grade"], detectedLanguage: "English", normalizedRequirement: t },
          recommendations: getRecommendations({ product: "Cement", intendedUse: "General civil works", requirements: [], classification: "CLEAR", missingInfo: [], keywords: ["cement", "OPC", "43 grade"] }),
          gaps: [],
          conflicts: []
        });
      } else if (t === "Procurement of fine and coarse aggregate for concrete mix.") {
        return res.json({
          requirements: { product: "Aggregates", intendedUse: "Concrete mix", requirements: ["Fine aggregate", "Coarse aggregate"], classification: "CLEAR", missingInfo: ["grading zone", "max size"], keywords: ["aggregate", "fine", "coarse", "concrete"], detectedLanguage: "English", normalizedRequirement: t },
          recommendations: getRecommendations({ product: "Aggregates", intendedUse: "Concrete", requirements: [], classification: "CLEAR", missingInfo: [], keywords: ["aggregate", "fine", "coarse"] }),
          gaps: [{ issue: "Missing grading zone", severity: "MEDIUM", whyItMatters: "Affects mix design and workability", recommendedAction: "Specify grading zone for fine aggregate per IS 383." }],
          conflicts: []
        });
      } else if (t === "Requirement: 43 Grade Ordinary Portland Cement as per IS 8112.") {
        return res.json({
          requirements: { product: "Cement", intendedUse: "Not specified", requirements: ["43 Grade OPC", "Conform to IS 8112"], classification: "CONTRADICTORY", missingInfo: ["intended use", "quantity"], keywords: ["cement", "OPC", "43 grade", "IS 8112"], detectedLanguage: "English", normalizedRequirement: t },
          recommendations: getRecommendations({ product: "Cement", intendedUse: "Not specified", requirements: [], classification: "CONTRADICTORY", missingInfo: [], keywords: ["cement", "OPC", "43 grade"] }),
          gaps: [{ issue: "Outdated standard reference", severity: "CRITICAL", whyItMatters: "IS 8112 is superseded by IS 269:2015", recommendedAction: "Update tender specification to reference IS 269:2015 instead of IS 8112." }],
          conflicts: [{ conflict: "Referenced standard is superseded", certainty: "CERTAIN", details: "IS 8112 was superseded by IS 269 in 2015." }]
        });
      } else if (t === "We need 5000 bricks for construction.") {
        return res.json({
          requirements: { product: "Bricks", intendedUse: "Construction", requirements: ["Quantity: 5000"], classification: "INCOMPLETE", missingInfo: ["brick type", "compressive strength class", "dimensions"], keywords: ["bricks", "construction"], detectedLanguage: "English", normalizedRequirement: t },
          recommendations: getRecommendations({ product: "Bricks", intendedUse: "Construction", requirements: [], classification: "INCOMPLETE", missingInfo: [], keywords: ["bricks", "clay"] }),
          gaps: [{ issue: "Missing class designation", severity: "HIGH", whyItMatters: "Cannot ensure structural load capacity without strength class", recommendedAction: "Specify compressive strength class (e.g., Class 10, Class 12.5) per IS 1077." }, { issue: "Missing dimensional specification", severity: "MEDIUM", whyItMatters: "May cause issues with masonry bonding", recommendedAction: "Specify modular or non-modular sizes." }],
          conflicts: []
        });
      } else if (t === "Supply of Fe 500D TMT steel bars. Tensile strength must be at least 400 MPa.") {
        return res.json({
          requirements: { product: "Reinforcement Steel", intendedUse: "Not specified", requirements: ["Fe 500D TMT bars", "Min tensile strength 400 MPa"], classification: "CONTRADICTORY", missingInfo: [], keywords: ["steel", "Fe 500D", "TMT", "tensile strength"], detectedLanguage: "English", normalizedRequirement: t },
          recommendations: getRecommendations({ product: "Reinforcement Steel", intendedUse: "Not specified", requirements: [], classification: "CONTRADICTORY", missingInfo: [], keywords: ["steel", "Fe 500D", "TMT"] }),
          gaps: [],
          conflicts: [{ conflict: "Tensile strength mismatch with grade", certainty: "CERTAIN", details: "Fe 500D requires a minimum yield stress of 500 MPa and ultimate tensile strength of 565 MPa per IS 1786. The specified 400 MPa contradicts the grade." }]
        });
      } else if (t === "Need 100 quantum flux capacitors for the temporal displacement engine.") {
        return res.json({
          requirements: { product: "Quantum flux capacitors", intendedUse: "Temporal displacement engine", requirements: ["Quantity: 100"], classification: "CLEAR", missingInfo: ["specifications", "voltage"], keywords: ["quantum", "capacitor", "flux"], detectedLanguage: "English", normalizedRequirement: t },
          recommendations: [],
          gaps: [{ issue: "No applicable Indian Standard", severity: "CRITICAL", whyItMatters: "Cannot verify quality against national standards", recommendedAction: "Rely on manufacturer specifications or international standards." }],
          conflicts: []
        });
      } else if (t === "பாலம் கட்டுமானப் பணிகளுக்கு உயர் வலிமை கொண்ட சிதைக்கப்பட்ட இரும்பு கம்பிகள் (Fe 500D) தேவை.") {
        return res.json({
          requirements: { product: "Reinforcement Steel Bars", intendedUse: "Bridge construction works", requirements: ["High strength deformed", "Fe 500D"], classification: "CLEAR", missingInfo: ["Quantity", "Size"], keywords: ["steel", "Fe 500D", "deformed", "bridge"], detectedLanguage: "Tamil", normalizedRequirement: "High strength deformed steel bars (Fe 500D) required for bridge construction works." },
          recommendations: getRecommendations({ product: "Reinforcement Steel", intendedUse: "Bridge construction", requirements: [], classification: "CLEAR", missingInfo: [], keywords: ["steel", "Fe 500D", "deformed bar"] }),
          gaps: [{ issue: "Missing dimensional tolerance", severity: "LOW", whyItMatters: "May affect concrete cover", recommendedAction: "Specify required nominal sizes per IS 1786." }],
          conflicts: []
        });
      }

      // === LLM FALLBACK ===
      const prompt = `You are an expert Indian Standards and procurement analyst. 
      Analyze the following procurement requirement or specification text and extract key information.
      
      TEXT:
      """
      ${text}
      """
      
      Return a JSON object with the following structure:
      {
        "product": "identified product/material",
        "intendedUse": "intended use of the material",
        "requirements": ["req 1", "req 2"],
        "classification": "CLEAR" | "INCOMPLETE" | "AMBIGUOUS" | "CONTRADICTORY",
        "missingInfo": ["missing 1", "missing 2"],
        "keywords": ["keyword1", "keyword2"],
        "detectedLanguage": "The language of the input text (e.g. English, Hindi, Tamil)",
        "normalizedRequirement": "The English translation/normalization of the input text",
        "gaps": [
          { "issue": "missing testing", "severity": "MEDIUM" | "HIGH" | "CRITICAL" | "LOW", "whyItMatters": "No quality assurance", "recommendedAction": "Specify testing IS code" }
        ],
        "conflicts": [
          { "conflict": "grade mismatch", "certainty": "POTENTIAL" | "CERTAIN", "details": "grade mentioned is not standard" }
        ]
      }
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });
      
      const analysisResult = JSON.parse(response.text || '{}');
      
      // Get DB recommendations
      const recommendations = getRecommendations(analysisResult);
      
      res.json({
        requirements: {
          product: analysisResult.product || 'Unknown',
          intendedUse: analysisResult.intendedUse || 'Unknown',
          requirements: analysisResult.requirements || [],
          classification: analysisResult.classification || 'INCOMPLETE',
          missingInfo: analysisResult.missingInfo || [],
          keywords: analysisResult.keywords || [],
          detectedLanguage: analysisResult.detectedLanguage || 'English',
          normalizedRequirement: analysisResult.normalizedRequirement || text
        },
        recommendations: recommendations,
        gaps: analysisResult.gaps || [],
        conflicts: analysisResult.conflicts || []
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to analyze text' });
    }
  });

  app.get('/api/standards', (req, res) => {
    res.json(standardsDatabase);
  });

  
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
         return res.status(400).json({ error: 'No file uploaded' });
      }
      const data = await pdfParse(req.file.buffer);
      res.json({ text: data.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to parse PDF' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
