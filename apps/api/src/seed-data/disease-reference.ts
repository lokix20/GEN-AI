export interface DiseaseReferenceEntry {
  cropName: string;
  diseaseName: string;
  cause: string;
  affectedArea: string;
  organicSolution: string;
  chemicalSolution: string;
  preventionTips: string[];
}

export const DISEASE_REFERENCE: DiseaseReferenceEntry[] = [
  {
    cropName: "Rice",
    diseaseName: "Bacterial Leaf Blight",
    cause: "Xanthomonas oryzae bacteria, spread by contaminated water and wounds from strong wind or pest damage.",
    affectedArea: "Leaf margins and tips",
    organicSolution: "Drain standing water, apply neem-based spray, and remove infected leaves to reduce spread.",
    chemicalSolution: "Copper oxychloride spray (0.3%) or streptocycline (as per local agri-extension dosage).",
    preventionTips: [
      "Use certified disease-resistant seed varieties",
      "Avoid excess nitrogen fertilizer",
      "Maintain proper field drainage",
      "Practice crop rotation with non-host crops",
    ],
  },
  {
    cropName: "Rice",
    diseaseName: "Rice Blast",
    cause: "Fungus Magnaporthe oryzae, favored by high humidity and dense planting.",
    affectedArea: "Leaves, neck, and panicles",
    organicSolution: "Apply Trichoderma-based bio-fungicide and ensure balanced spacing for airflow.",
    chemicalSolution: "Tricyclazole 75% WP spray at recommended field dose.",
    preventionTips: [
      "Avoid excess nitrogen application",
      "Use blast-resistant varieties",
      "Ensure proper field drainage",
      "Monitor during high-humidity periods",
    ],
  },
  {
    cropName: "Tomato",
    diseaseName: "Early Blight",
    cause: "Fungus Alternaria solani, common in warm humid weather with leaf wetness.",
    affectedArea: "Lower and older leaves first",
    organicSolution: "Neem oil spray every 7-10 days and remove affected lower leaves promptly.",
    chemicalSolution: "Mancozeb 75% WP (2-2.5 g/litre) spray at 7-10 day intervals.",
    preventionTips: [
      "Stake plants for good airflow",
      "Avoid overhead irrigation",
      "Rotate with non-solanaceous crops",
      "Mulch to reduce soil splash onto leaves",
    ],
  },
  {
    cropName: "Tomato",
    diseaseName: "Leaf Curl Virus",
    cause: "Whitefly-transmitted Tomato Leaf Curl Virus (ToLCV).",
    affectedArea: "Young leaves and shoot tips",
    organicSolution: "Yellow sticky traps for whiteflies and neem oil spray to reduce vector population.",
    chemicalSolution: "Imidacloprid 17.8% SL for whitefly control (as per label dosage).",
    preventionTips: [
      "Use virus-resistant tomato varieties",
      "Remove and destroy infected plants early",
      "Control whitefly population proactively",
      "Use reflective mulch to repel whiteflies",
    ],
  },
  {
    cropName: "Wheat",
    diseaseName: "Yellow Rust",
    cause: "Fungus Puccinia striiformis, favored by cool, moist conditions.",
    affectedArea: "Leaves in yellow stripe patterns",
    organicSolution: "Remove volunteer wheat plants and apply sulfur-based bio-fungicide early.",
    chemicalSolution: "Propiconazole 25% EC spray at first sign of infection.",
    preventionTips: [
      "Sow rust-resistant wheat varieties",
      "Avoid very early sowing in rust-prone areas",
      "Monitor fields regularly during cool weather",
      "Destroy crop residue after harvest",
    ],
  },
  {
    cropName: "Cotton",
    diseaseName: "Bollworm Infestation",
    cause: "Larvae of Helicoverpa armigera feeding on bolls and squares.",
    affectedArea: "Bolls, squares, and flowers",
    organicSolution: "Install pheromone traps and release Trichogramma parasitoids for biological control.",
    chemicalSolution: "Emamectin benzoate 5% SG at recommended dosage, rotating chemistry to avoid resistance.",
    preventionTips: [
      "Use Bt cotton varieties where recommended",
      "Scout fields weekly during flowering",
      "Avoid excessive nitrogen application",
      "Destroy crop residue post-harvest",
    ],
  },
  {
    cropName: "Potato",
    diseaseName: "Late Blight",
    cause: "Oomycete Phytophthora infestans, spreads rapidly in cool, wet weather.",
    affectedArea: "Leaves and tubers",
    organicSolution: "Copper-based bio-fungicide spray and improve field drainage to reduce leaf wetness.",
    chemicalSolution: "Metalaxyl + Mancozeb combination spray at first symptom.",
    preventionTips: [
      "Plant certified disease-free seed tubers",
      "Avoid overhead irrigation in humid weather",
      "Destroy volunteer plants and infected debris",
      "Hill soil properly around tubers",
    ],
  },
  {
    cropName: "Chili",
    diseaseName: "Anthracnose (Fruit Rot)",
    cause: "Fungal pathogens of the Colletotrichum genus, spread in warm humid conditions.",
    affectedArea: "Ripening fruits",
    organicSolution: "Remove and destroy infected fruits, apply neem oil spray weekly during fruiting.",
    chemicalSolution: "Carbendazim 50% WP spray as per label dosage.",
    preventionTips: [
      "Avoid water stagnation in the field",
      "Practice crop rotation",
      "Use disease-free seedlings",
      "Harvest fruits promptly at maturity",
    ],
  },
];

export function findClosestDiseaseEntry(cropName: string, seedIndex: number): DiseaseReferenceEntry {
  const cropMatches = DISEASE_REFERENCE.filter((entry) => entry.cropName.toLowerCase() === cropName.trim().toLowerCase());
  const pool = cropMatches.length > 0 ? cropMatches : DISEASE_REFERENCE;
  return pool[seedIndex % pool.length];
}
