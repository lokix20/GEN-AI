import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/translation.json";
import hi from "../locales/hi/translation.json";

const te = {
  common: { appName: "హరిత సహాయక్", tagline: "మీ ఏఐ వ్యవసాయ సహాయకుడు", save: "దాచు", cancel: "రద్దు చేయి", logout: "లాగ్ అవుట్" },
  nav: { dashboard: "డ్యాష్‌బోర్డ్", chat: "AI సహాయకుడు", diseaseDetection: "పంట నిర్ధారణ", weather: "వాతావరణం", market: "మండి ధరలు", schemes: "ప్రభుత్వ పథకాలు", cropCalendar: "పంట క్యాలెండర్", irrigation: "నీటి యాజమాన్యం", farmDiary: "వ్యవసాయ రికార్డు", expertConsultation: "నిపుణుల సలహా" },
  dashboard: { welcome: "నమస్కారం, {{name}}", quickActions: "త్వరిత పనులు", checkCrop: "పంట తెగులు పరీక్షించండి" },
  auth: {
    loginTitle: "మళ్లీ స్వాగతం",
    loginSubtitle: "మీ పంటల సమాచారం చూడటానికి లాగిన్ అవ్వండి",
    registerTitle: "ఖాతా సృష్టించండి",
    registerSubtitle: "ఉచితంగా ప్రారంభించండి — క్రెడిట్ కార్డు అవసరం లేదు",
    name: "పేరు",
    email: "ఇమెయిల్",
    phone: "ఫోన్ నంబర్",
    password: "పాస్‌వర్డ్",
    loginButton: "లాగిన్",
    registerButton: "ఖాతా సృష్టించండి",
    forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
    dontHaveAccount: "ఖాతా లేదా?",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా?",
    signUp: "సైన్ అప్",
    signIn: "సైన్ ఇన్",
    continueWithGoogle: "Google తో కొనసాగండి",
    verifyTitle: "మీ ఫోన్‌ను ధృవీకరించండి",
    verifySubtitle: "మేము పంపిన 6 అంకెల కోడ్‌ను నమోదు చేయండి",
    otpCode: "ధృవీకరణ కోడ్",
    resendCode: "కోడ్ మళ్లీ పంపండి",
    verifyButton: "ధృవీకరించండి",
    forgotTitle: "పాస్‌వర్డ్ రీసెట్ చేయండి",
    forgotSubtitle: "రీసెట్ కోడ్ పొందడానికి మీ ఇమెయిల్ నమోదు చేయండి",
    sendResetCode: "రీసెట్ కోడ్ పంపండి",
    resetTitle: "కొత్త పాస్‌వర్డ్ పెట్టండి",
    newPassword: "కొత్త పాస్‌వర్డ్",
    resetButton: "పాస్‌వర్డ్ మార్చండి",
    backToLogin: "లాగిన్‌కు తిరిగి వెళ్లండి",
  },
};

const ta = {
  common: { appName: "ஹரிதா சகாயக்", tagline: "உங்கள் AI விவசாய உதவியாளர்", save: "சேமி", cancel: "ரத்து செய்", logout: "வெளியேறு" },
  nav: { dashboard: "டாஷ்போர்டு", chat: "AI உதவியாளர்", diseaseDetection: "பயிர் நோய் கண்டறிதல்", weather: "வானிலை", market: "சந்தை விலைகள்", schemes: "அரசு திட்டங்கள்", cropCalendar: "பயிர் காலண்டர்", irrigation: "நீர்ப்பாசனம்", farmDiary: "பண்ணை குறிப்பேடு", expertConsultation: "நிபுணர் உதவி" },
  dashboard: { welcome: "வணக்கம், {{name}}", quickActions: "விரைவுச் செயல்பாடுகள்", checkCrop: "பயிர் நோய் பரிசோதிக்க" }
};

const kn = {
  common: { appName: "ಹರಿತ ಸಹಾಯಕ್", tagline: "ನಿಮ್ಮ AI ಕೃಷಿ ಸಹಾಯಕ", save: "ಉಳಿಸಿ", cancel: "ರದ್ದುಮಾಡಿ", logout: "ಲಾಗ್ ಔಟ್" },
  nav: { dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", chat: "AI ಸಹಾಯಕ", diseaseDetection: "ಬೆಳೆ ರೋಗ ಪತ್ತೆ", weather: "ಹವಾಮಾನ", market: "ಮಂಡಿ ದರಗಳು", schemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", cropCalendar: "ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್", irrigation: "ನೀರಾವರಿ", farmDiary: "ಕೃಷಿ ಡೈರಿ", expertConsultation: "ತಜ್ಞರ ನೆರವು" },
  dashboard: { welcome: "ನಮಸ್ಕಾರ, {{name}}", quickActions: "ತ್ವರಿತ ಕಾರ್ಯಗಳು", checkCrop: "ಬೆಳೆ ರೋಗ ಪರೀಕ್ಷಿಸಿ" }
};

const ml = {
  common: { appName: "ഹരിത സഹായക്", tagline: "നിങ്ങളുടെ AI കാർഷിക സഹായി", save: "സൂക്ഷിക്കുക", cancel: "റദ്ദാക്കുക", logout: "ലോഗ് ഔട്ട്" },
  nav: { dashboard: "ഡാഷ്‌ബോർഡ്", chat: "AI സഹായി", diseaseDetection: "വിള രോഗ നിർണ്ണയം", weather: "കാലാവസ്ഥ", market: "വിപണി വിലകൾ", schemes: "സർക്കാർ പദ്ധതികൾ", cropCalendar: "വിള കലണ്ടർ", irrigation: "നനക്കൽ ക്രമീകരണം", farmDiary: "ഫാം ഡയറി", expertConsultation: "വിദഗ്ദ്ധ സഹായം" },
  dashboard: { welcome: "നമസ്കാരം, {{name}}", quickActions: "ദ്രുത പ്രവർത്തനങ്ങൾ", checkCrop: "വിള പരിശോധിക്കുക" }
};

const mr = {
  common: { appName: "हरित सहाय्यक", tagline: "तुमचा एआय शेती सहाय्यक", save: "जतन करा", cancel: "रद्द करा", logout: "लॉग आउट" },
  nav: { dashboard: "डॅशबोर्ड", chat: "एआय सहाय्यक", diseaseDetection: "पिक रोग निदान", weather: "हवामान", market: "बाजार भाव", schemes: "सरकारी योजना", cropCalendar: "पिक कॅलेंडर", irrigation: "सिंचन नियोजन", farmDiary: "शेत डायरी", expertConsultation: "तज्ज्ञ मदत" },
  dashboard: { welcome: "नमस्कार, {{name}}", quickActions: "जलद कृती", checkCrop: "पिकांचे आजार तपासा" }
};

const bn = {
  common: { appName: "হরিথা সহায়ক", tagline: "আপনার AI কৃষি সহকারী", save: "সংরক্ষণ", cancel: "বাতিল", logout: "লগ আউট" },
  nav: { dashboard: "ড্যাশবোর্ড", chat: "AI সহকারী", diseaseDetection: "ফসল রোগ নির্ণয়", weather: "আবহাওয়া", market: "বাজার দর", schemes: "সরকারি প্রকল্প", cropCalendar: "ফসল ক্যালেন্ডার", irrigation: "সেচ পরিকল্পনা", farmDiary: "খামার ডায়েরি", expertConsultation: "বিশেষজ্ঞ সহায়তা" },
  dashboard: { welcome: "শুভ অপরাহ্ন, {{name}}", quickActions: "দ্রুত কাজ", checkCrop: "ফসল পরীক্ষা করুন" }
};

const gu = {
  common: { appName: "હરિથા સહાયક", tagline: "તમારા AI ખેતી સહાયક", save: "સાચવો", cancel: "રદ કરો", logout: "લોગ આઉટ" },
  nav: { dashboard: "ડેશબોર્ડ", chat: "AI સહાયક", diseaseDetection: "પાક રોગ નિદાન", weather: "હવામાન", market: "બજાર ભાવ", schemes: "સરકારી યોજનાઓ", cropCalendar: "પાક કેલેન્ડર", irrigation: "સિંચાઈ આયોજન", farmDiary: "ખેતર ડાયરી", expertConsultation: "નિષ્ણાત મદદ" },
  dashboard: { welcome: "શુભ બપોર, {{name}}", quickActions: "ઝડપી કાર્યો", checkCrop: "પાક રોગ તપાસો" }
};

const pa = {
  common: { appName: "ਹਰਿਥਾ ਸਹਾਇਕ", tagline: "ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਹਾਇਕ", save: "ਸਾਂਭੋ", cancel: "ਰੱਦ ਕਰੋ", logout: "ਲੌਗ ਆਊਟ" },
  nav: { dashboard: "ਡੈਸ਼ਬੋਰਡ", chat: "AI ਸਹਾਇਕ", diseaseDetection: "ਫਸਲ ਬੀਮਾਰੀ ਪਛਾਣ", weather: "ਮੌਸਮ", market: "ਮੰਡੀ ਭਾਅ", schemes: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ", cropCalendar: "ਫਸਲ ਕੈਲੰਡਰ", irrigation: "ਸਿੰਚਾਈ ਯੋਜਨਾ", farmDiary: "ਖੇਤ ਡਾਇਰੀ", expertConsultation: "ਮਾਹਿਰ ਦੀ ਮਦਦ" },
  dashboard: { welcome: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ, {{name}}", quickActions: "ਤੁਰੰਤ ਕੰਮ", checkCrop: "ਫਸਲ ਬੀਮਾਰੀ ਜਾਂਚੋ" }
};

const or = {
  common: { appName: "ହରିଥା ସହାୟକ", tagline: "ଆପଣଙ୍କ AI କୃଷି ସହାୟକ", save: "ସଂରକ୍ଷଣ", cancel: "ବାତିଲ୍", logout: "ଲଗ୍ ଆଉଟ୍" },
  nav: { dashboard: "ଡ୍ୟାସବୋର୍ଡ", chat: "AI ସହାୟକ", diseaseDetection: "ଫସଲ ରୋଗ ଚିହ୍ନଟ", weather: "ପାଣିପାଗ", market: "ମଣ୍ଡି ଦର", schemes: "ସରକାରୀ ଯୋଜନା", cropCalendar: "ଫସଲ କ୍ୟାଲେଣ୍ଡର", irrigation: "ଜଳସେଚନ ଯୋଜନା", farmDiary: "ଫାର୍ମ ଡାଏରୀ", expertConsultation: "ବିଶେଷଜ୍ଞ ସହାୟତା" },
  dashboard: { welcome: "ନମସ୍କାର, {{name}}", quickActions: "ଦ୍ରୁତ କାର୍ଯ୍ୟ", checkCrop: "ଫସଲ ପରୀକ୍ଷା କରନ୍ତୁ" }
};

const as = {
  common: { appName: "হৰিথা সহায়ক", tagline: "আপোনাৰ AI কৃষি সহায়ক", save: "সংৰক্ষণ", cancel: "বাতিল", logout: "লগ আউট" },
  nav: { dashboard: "ডেচবৰ্ড", chat: "AI সহায়ক", diseaseDetection: "শস্যৰ ৰোগ নিৰ্ণয়", weather: "বতৰ", market: "বজাৰ দৰ", schemes: "চৰকাৰী আঁচনি", cropCalendar: "শস্য কেলণ্ডাৰ", irrigation: "জলসিঞ্চন পৰিকল্পনা", farmDiary: "ফাৰ্ম ডায়েৰী", expertConsultation: "বিশেষজ্ঞ সহায়" },
  dashboard: { welcome: "নমস্কাৰ, {{name}}", quickActions: "দ্ৰুত কাম", checkCrop: "শস্য ৰোগ পৰীক্ষা কৰক" }
};

const ur = {
  common: { appName: "ہریتھا سہائک", tagline: "آپ کا AI زرعی معاون", save: "محفوظ کریں", cancel: "منسوخ کریں", logout: "لاگ آؤٹ" },
  nav: { dashboard: "ڈیش بورڈ", chat: "AI معاون", diseaseDetection: "فصل کی بیماری کی تشخیص", weather: "موسم", market: "منڈی کے بھاؤ", schemes: "سرکاری اسکیمیں", cropCalendar: "فصل کا کیلنڈر", irrigation: "آبپاشی کا منصوبہ", farmDiary: "فارم ڈائری", expertConsultation: "ماہر کی مدد" },
  dashboard: { welcome: "شام بخیر، {{name}}", quickActions: "فوری اقدامات", checkCrop: "فصل کا جائزہ لیں" }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    te: { translation: te },
    ta: { translation: ta },
    kn: { translation: kn },
    ml: { translation: ml },
    mr: { translation: mr },
    bn: { translation: bn },
    gu: { translation: gu },
    pa: { translation: pa },
    or: { translation: or },
    as: { translation: as },
    ur: { translation: ur },
  },
  lng: localStorage.getItem("haritha-language") ?? "te",
  // Must be "en": it is the only resource with the full key set. Falling back to "te" (which only
  // defines `nav` and `dashboard`) meant any other key resolved to nothing and rendered raw —
  // e.g. the login screen showed "auth.loginTitle" / "auth.email" instead of real labels.
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("haritha-language", lng);
  window.dispatchEvent(new Event("haritha-language-change"));
});

export default i18n;
