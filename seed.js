const mongoose = require('mongoose');
require('dotenv').config();

const Disease = require('./models/Disease');
const FAQ = require('./models/FAQ');

// Sample diseases data
const sampleDiseases = [
  {
    name: "COVID-19",
    symptoms: ["Fever", "Cough", "Shortness of breath", "Fatigue", "Body aches", "Loss of taste or smell"],
    prevention: ["Wear masks", "Wash hands frequently", "Maintain social distance", "Get vaccinated", "Avoid crowded places"],
    vaccination_info: {
      available: true,
      vaccine_name: "COVID-19 Vaccine",
      age_groups: ["12+ years"],
      schedule: "2 doses, 3-4 weeks apart",
      side_effects: ["Mild fever", "Sore arm", "Fatigue"]
    },
    description: "COVID-19 is a respiratory illness caused by the SARS-CoV-2 virus. It can cause mild to severe symptoms and is highly contagious.",
    severity: "High",
    transmission: ["Airborne droplets", "Close contact", "Contaminated surfaces"],
    incubation_period: "2-14 days",
    treatment: ["Rest", "Fluids", "Fever reducers", "Hospital care for severe cases"],
    risk_factors: ["Age 65+", "Underlying health conditions", "Immunocompromised"]
  },
  {
    name: "Influenza (Flu)",
    symptoms: ["Fever", "Cough", "Sore throat", "Runny nose", "Body aches", "Headache", "Fatigue"],
    prevention: ["Annual flu vaccine", "Wash hands frequently", "Avoid close contact with sick people", "Stay home when sick"],
    vaccination_info: {
      available: true,
      vaccine_name: "Seasonal Flu Vaccine",
      age_groups: ["6 months and older"],
      schedule: "Annual vaccination",
      side_effects: ["Sore arm", "Mild fever", "Body aches"]
    },
    description: "Influenza is a viral infection that attacks the respiratory system. It can cause mild to severe illness and sometimes lead to death.",
    severity: "Medium",
    transmission: ["Airborne droplets", "Direct contact"],
    incubation_period: "1-4 days",
    treatment: ["Rest", "Fluids", "Antiviral medications", "Symptom relief"],
    risk_factors: ["Age 65+", "Young children", "Pregnant women", "Chronic health conditions"]
  },
  {
    name: "Malaria",
    symptoms: ["Fever", "Chills", "Sweating", "Headache", "Nausea", "Vomiting", "Body aches"],
    prevention: ["Use insect repellent", "Sleep under mosquito nets", "Take antimalarial medication", "Wear long sleeves and pants"],
    vaccination_info: {
      available: false,
      vaccine_name: null,
      age_groups: [],
      schedule: "Not widely available",
      side_effects: []
    },
    description: "Malaria is a life-threatening disease caused by parasites transmitted through the bites of infected mosquitoes.",
    severity: "High",
    transmission: ["Mosquito bites"],
    incubation_period: "7-30 days",
    treatment: ["Antimalarial drugs", "Hospital care for severe cases"],
    risk_factors: ["Travel to endemic areas", "Pregnant women", "Young children"]
  },
  {
    name: "Dengue Fever",
    symptoms: ["High fever", "Severe headache", "Pain behind eyes", "Muscle and joint pain", "Nausea", "Vomiting", "Rash"],
    prevention: ["Eliminate standing water", "Use mosquito repellent", "Wear protective clothing", "Install window screens"],
    vaccination_info: {
      available: true,
      vaccine_name: "Dengvaxia",
      age_groups: ["9-45 years"],
      schedule: "3 doses over 12 months",
      side_effects: ["Headache", "Muscle pain", "Fever"]
    },
    description: "Dengue fever is a mosquito-borne viral infection that can cause severe flu-like symptoms and potentially life-threatening complications.",
    severity: "High",
    transmission: ["Mosquito bites"],
    incubation_period: "3-14 days",
    treatment: ["Rest", "Fluids", "Pain relievers", "Hospital care for severe cases"],
    risk_factors: ["Travel to tropical areas", "Previous dengue infection", "Age and immune status"]
  },
  {
    name: "Tuberculosis (TB)",
    symptoms: ["Persistent cough", "Chest pain", "Coughing up blood", "Fatigue", "Weight loss", "Night sweats", "Fever"],
    prevention: ["BCG vaccine", "Avoid close contact with TB patients", "Good ventilation", "Cover mouth when coughing"],
    vaccination_info: {
      available: true,
      vaccine_name: "BCG Vaccine",
      age_groups: ["Infants and children"],
      schedule: "Single dose in childhood",
      side_effects: ["Mild fever", "Swelling at injection site"]
    },
    description: "Tuberculosis is a bacterial infection that primarily affects the lungs but can also affect other parts of the body.",
    severity: "High",
    transmission: ["Airborne droplets"],
    incubation_period: "2-12 weeks",
    treatment: ["Antibiotic treatment", "6-9 month course", "Directly observed therapy"],
    risk_factors: ["HIV infection", "Weakened immune system", "Close contact with TB patients", "Malnutrition"]
  }
];

// Sample FAQ data
const sampleFAQs = [
  {
    question: "What are the common symptoms of COVID-19?",
    answer: "Common symptoms include fever, cough, shortness of breath, fatigue, body aches, and loss of taste or smell. Some people may have no symptoms at all.",
    category: "Disease Prevention",
    tags: ["covid-19", "symptoms", "coronavirus"],
    priority: 5,
    language: "en"
  },
  {
    question: "How can I prevent getting sick?",
    answer: "To prevent illness: wash hands frequently with soap and water, avoid close contact with sick people, get vaccinated, maintain a healthy diet, exercise regularly, and get adequate sleep.",
    category: "General Health",
    tags: ["prevention", "health", "wellness"],
    priority: 4,
    language: "en"
  },
  {
    question: "When should I get vaccinated?",
    answer: "Follow the recommended vaccination schedule for your age group. Consult with your healthcare provider about which vaccines you need and when to get them.",
    category: "Vaccination",
    tags: ["vaccination", "immunization", "schedule"],
    priority: 4,
    language: "en"
  },
  {
    question: "What should I do if I have a fever?",
    answer: "If you have a fever: rest, drink plenty of fluids, take fever-reducing medication if needed, monitor your temperature, and seek medical attention if the fever is high or persistent.",
    category: "Symptoms",
    tags: ["fever", "temperature", "treatment"],
    priority: 3,
    language: "en"
  },
  {
    question: "How often should I wash my hands?",
    answer: "Wash your hands: before eating, after using the bathroom, after coughing or sneezing, after touching surfaces in public places, and whenever they look dirty.",
    category: "General Health",
    tags: ["hygiene", "handwashing", "prevention"],
    priority: 4,
    language: "en"
  },
  {
    question: "What is the difference between a cold and the flu?",
    answer: "Colds are usually milder with symptoms like runny nose and sneezing. Flu symptoms are more severe and include fever, body aches, and fatigue. Flu can lead to serious complications.",
    category: "General Health",
    tags: ["cold", "flu", "symptoms", "difference"],
    priority: 3,
    language: "en"
  },
  {
    question: "Should I wear a mask?",
    answer: "Wear a mask in crowded indoor settings, when you have respiratory symptoms, or when required by local health guidelines. Masks help prevent the spread of respiratory illnesses.",
    category: "Disease Prevention",
    tags: ["mask", "prevention", "respiratory"],
    priority: 4,
    language: "en"
  },
  {
    question: "How can I boost my immune system?",
    answer: "Boost your immune system by: eating a balanced diet rich in fruits and vegetables, getting regular exercise, adequate sleep, managing stress, avoiding smoking, and staying hydrated.",
    category: "General Health",
    tags: ["immune system", "health", "wellness"],
    priority: 3,
    language: "en"
  }
];

// Hindi FAQ data
const hindiFAQs = [
  {
    question: "COVID-19 के सामान्य लक्षण क्या हैं?",
    answer: "सामान्य लक्षणों में बुखार, खांसी, सांस की तकलीफ, थकान, शरीर में दर्द और स्वाद या गंध की हानि शामिल हैं। कुछ लोगों में कोई लक्षण नहीं हो सकते।",
    category: "Disease Prevention",
    tags: ["covid-19", "लक्षण", "कोरोनावायरस"],
    priority: 5,
    language: "hi"
  },
  {
    question: "मैं बीमार होने से कैसे बच सकता हूं?",
    answer: "बीमारी से बचने के लिए: साबुन और पानी से हाथ धोएं, बीमार लोगों के साथ निकट संपर्क से बचें, टीकाकरण कराएं, स्वस्थ आहार लें, नियमित व्यायाम करें और पर्याप्त नींद लें।",
    category: "General Health",
    tags: ["रोकथाम", "स्वास्थ्य", "कल्याण"],
    priority: 4,
    language: "hi"
  }
];

// Telugu FAQ data
const teluguFAQs = [
  {
    question: "COVID-19 యొక్క సాధారణ లక్షణాలు ఏమిటి?",
    answer: "సాధారణ లక్షణాలలో జ్వరం, దగ్గు, శ్వాస తీసుకోవడంలో ఇబ్బంది, అలసట, శరీర నొప్పులు మరియు రుచి లేదా వాసన కోల్పోవడం ఉన్నాయి. కొంతమందికి ఏ లక్షణాలు కూడా ఉండకపోవచ్చు.",
    category: "Disease Prevention",
    tags: ["covid-19", "లక్షణాలు", "కరోనావైరస్"],
    priority: 5,
    language: "te"
  },
  {
    question: "నేను అనారోగ్యానికి గురికాకుండా ఎలా ఉండగలను?",
    answer: "అనారోగ్యానికి గురికాకుండా ఉండడానికి: సబ్బు మరియు నీటితో చేతులను తరచుగా కడగండి, అనారోగ్యంతో ఉన్న వ్యక్తులతో దగ్గరి సంప్రదింపులను నివారించండి, టీకాలు వేయించుకోండి, సమతుల్య ఆహారం తీసుకోండి, నియమితంగా వ్యాయామం చేయండి మరియు తగినంత నిద్ర తీసుకోండి.",
    category: "General Health",
    tags: ["నిరోధక", "ఆరోగ్యం", "క్షేమం"],
    priority: 4,
    language: "te"
  }
];

// Swahili FAQ data
const swahiliFAQs = [
  {
    question: "Je, dalili za kawaida za COVID-19 ni zipi?",
    answer: "Dalili za kawaida ni pamoja na homa, kikohozi, ugumu wa kupumua, uchovu, maumivu ya mwili, na kupoteza ladha au harufu. Baadhi ya watu wanaweza kuwa na dalili zozote.",
    category: "Disease Prevention",
    tags: ["covid-19", "dalili", "coronavirus"],
    priority: 5,
    language: "sw"
  },
  {
    question: "Je, ninawezaje kuepuka kuugua?",
    answer: "Ili kuepuka ugonjwa: osha mikono mara kwa mara kwa sabuni na maji, epuka kuwasiliana karibu na watu wagonjwa, pata chanjo, kula chakula cha usawa, fanya mazoezi mara kwa mara, na pata usingizi wa kutosha.",
    category: "General Health",
    tags: ["kinga", "afya", "uzima"],
    priority: 4,
    language: "sw"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthmate', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Disease.deleteMany({});
    await FAQ.deleteMany({});

    console.log('Cleared existing data');

    // Insert sample diseases
    await Disease.insertMany(sampleDiseases);
    console.log(`Inserted ${sampleDiseases.length} diseases`);

    // Insert sample FAQs
    const allFAQs = [...sampleFAQs, ...hindiFAQs, ...teluguFAQs, ...swahiliFAQs];
    await FAQ.insertMany(allFAQs);
    console.log(`Inserted ${allFAQs.length} FAQs`);

    console.log('Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
