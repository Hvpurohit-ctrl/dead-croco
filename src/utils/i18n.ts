import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  navHome: string;
  navFeatures: string;
  navIndustries: string;
  navAbout: string;
  navWorkerPortal: string;
  navAdminPortal: string;
  navGetStarted: string;
  heroHeadline: string;
  heroSubheadline: string;
  btnGetStarted: string;
  btnExploreFeatures: string;
  btnCheckIn: string;
  btnCheckOut: string;
  checkedInStatus: string;
  checkedOutStatus: string;
  hoursWorked: string;
  overtime: string;
  todayShift: string;
  reportHazard: string;
  transparentPay: string;
  skillPassport: string;
  anonymousFeedback: string;
  fatigueWarning: string;
  safetyScore: string;
  viewPayslip: string;
  unSdg8Banner: string;
  voiceListen: string;
  languageSelect: string;
  switchRole: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'dead.croco',
    tagline: 'BE DEAD LIKE CROCO',
    navHome: 'Home',
    navFeatures: 'Features',
    navIndustries: 'Industries',
    navAbout: 'About & SDG 8',
    navWorkerPortal: 'Worker Portal',
    navAdminPortal: 'Admin Dashboard',
    navGetStarted: 'Get Started',
    heroHeadline: 'Fair Work. Safer Teams. Clearer Futures.',
    heroSubheadline:
      'dead.croco empowers workers with transparent pay, safer workplaces, and a voice that matters, while helping employers create healthier and more productive teams.',
    btnGetStarted: 'Get Started Now',
    btnExploreFeatures: 'Explore Platform Features',
    btnCheckIn: 'Check In to Shift',
    btnCheckOut: 'Check Out from Shift',
    checkedInStatus: 'Currently On Shift',
    checkedOutStatus: 'Shift Inactive',
    hoursWorked: 'Hours Worked',
    overtime: 'Overtime Hours',
    todayShift: "Today's Active Shift",
    reportHazard: 'Report Safety Hazard',
    transparentPay: 'Transparent Payslip',
    skillPassport: 'Digital Skill Passport',
    anonymousFeedback: 'Anonymous Feedback',
    fatigueWarning: 'Fatigue Alert Triggered',
    safetyScore: 'Workplace Safety Index',
    viewPayslip: 'View Full Payslip Breakdown',
    unSdg8Banner: 'Aligned with UN Sustainable Development Goal 8: Decent Work & Economic Growth',
    voiceListen: 'Listen via Audio',
    languageSelect: 'Language',
    switchRole: 'Switch Role / View',
  },
  hi: {
    appName: 'dead.croco',
    tagline: 'मगरमच्छ की तरह अडिग रहें (BE DEAD LIKE CROCO)',
    navHome: 'होम',
    navFeatures: 'सुविधाएं',
    navIndustries: 'उद्योग क्षेत्र',
    navAbout: 'परिचय व SDG 8',
    navWorkerPortal: 'श्रमिक पोर्टल',
    navAdminPortal: 'प्रशासक डैशबोर्ड',
    navGetStarted: 'शुरू करें',
    heroHeadline: 'उचित कार्य। सुरक्षित टीमें। उज्जवल भविष्य।',
    heroSubheadline:
      'dead.croco श्रमिकों को पारदर्शी वेतन, सुरक्षित कार्यस्थल और सशक्त आवाज़ देता है, साथ ही नियोक्ताओं को स्वस्थ और उत्पादक कार्यबल बनाने में मदद करता है।',
    btnGetStarted: 'अभी शुरू करें',
    btnExploreFeatures: 'विशेषताएं देखें',
    btnCheckIn: 'शिफ्ट में चेक-इन करें',
    btnCheckOut: 'शिफ्ट समाप्त (चेक-आउट)',
    checkedInStatus: 'शिफ्ट जारी है',
    checkedOutStatus: 'शिफ्ट समाप्त',
    hoursWorked: 'कुल कार्य घंटे',
    overtime: 'ओवरटाइम घंटे',
    todayShift: 'आज की शिफ्ट स्थिति',
    reportHazard: 'सुरक्षा खतरे की रिपोर्ट',
    transparentPay: 'पारदर्शी वेतन पर्ची',
    skillPassport: 'डिजिटल कौशल पासपोर्ट',
    anonymousFeedback: 'गुमनाम सुझाव',
    fatigueWarning: 'थकान चेतावनी सक्रिय',
    safetyScore: 'सुरक्षा सूचकांक',
    viewPayslip: 'वेतन गणना विवरण देखें',
    unSdg8Banner: 'संयुक्त राष्ट्र सतत विकास लक्ष्य 8: सम्मानजनक कार्य और आर्थिक वृद्धि',
    voiceListen: 'ऑडियो सुनें',
    languageSelect: 'भाषा',
    switchRole: 'भूमिका बदलें',
  },
  ta: {
    appName: 'dead.croco',
    tagline: 'முதலையைப் போல் உறுதியாக இருங்கள் (BE DEAD LIKE CROCO)',
    navHome: 'முகப்பு',
    navFeatures: 'அம்சங்கள்',
    navIndustries: 'தொழில்துறைகள்',
    navAbout: 'நோக்கம் & SDG 8',
    navWorkerPortal: 'தொழிலாளர் போர்டல்',
    navAdminPortal: 'நிர்வாக டாஷ்போர்டு',
    navGetStarted: 'தொடங்குக',
    heroHeadline: 'நியாயமான பணி. பாதுகாப்பான குழு. தெளிவான எதிர்காலம்.',
    heroSubheadline:
      'dead.croco தொழிலாளர்களுக்கு வெளிப்படையான ஊதியம், பாதுகாப்பான பணிச்சூழல் மற்றும் வலுவான குரலை வழங்குகிறது; அதேவேளையில் நிறுவனங்களுக்கு ஆரோக்கியமான குழுக்களை உருவாக்க உதவுகிறது.',
    btnGetStarted: 'இப்போதே தொடங்குக',
    btnExploreFeatures: 'அம்சங்களை அறிக',
    btnCheckIn: 'ஷிப்ட் செக்-இன்',
    btnCheckOut: 'ஷிப்ட் செக்-அவுட்',
    checkedInStatus: 'தற்போது பணியில் உள்ளார்',
    checkedOutStatus: 'பணி நிறைவுற்றது',
    hoursWorked: 'வேலை செய்த நேரம்',
    overtime: 'கூடுதல் நேரம் (OT)',
    todayShift: 'இன்றைய பணி விவரம்',
    reportHazard: 'பாதுகாப்பு குறைபாடு புகார்',
    transparentPay: 'தெளிவான ஊதிய ரசீது',
    skillPassport: 'டிஜிட்டல் திறன் பாஸ்போர்ட்',
    anonymousFeedback: 'பெயரற்ற கருத்துக்கணிப்பு',
    fatigueWarning: 'அதிக வேலைப்பளு எச்சரிக்கை',
    safetyScore: 'பாதுகாப்பு குறியீடு',
    viewPayslip: 'முழு ஊதிய விவரம் காண்க',
    unSdg8Banner: 'ஐ.நா நிலையான வளர்ச்சி இலக்கு 8: கண்ணியமான பணி மற்றும் பொருளாதார வளர்ச்சி',
    voiceListen: 'கேட்கவும்',
    languageSelect: 'மொழி',
    switchRole: 'பங்கு மாற்றம்',
  },
};

/**
 * Text-to-speech accessibility helper
 */
export function speakText(text: string, lang: Language = 'en'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (lang === 'ta') {
      utterance.lang = 'ta-IN';
    } else {
      utterance.lang = 'en-US';
    }
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
  }
}
