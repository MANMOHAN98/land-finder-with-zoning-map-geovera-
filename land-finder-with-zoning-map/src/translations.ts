export type LanguageCode = 'EN' | 'HI' | 'BN' | 'TE' | 'MR' | 'TA' | 'GU' | 'KN' | 'PA' | 'ML';

export interface LanguageDef {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const INDIAN_LANGUAGES: LanguageDef[] = [
  { code: 'EN', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'HI', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'BN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'TE', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'MR', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'TA', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'GU', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'KN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'PA', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ML', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' }
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  EN: {
    gov_of_india: "GOVERNMENT OF INDIA",
    satellite_core: "SATELLITE CADASTRAL TRACKER",
    national_registry: "NATIONAL LAND CADASTRAL REGISTRY",
    official_node: "Official Node",
    cadastral_register: "CADASTRAL LAND INDEX",
    sign_in_inquire: "Sign In to Inquire",
    sign_out: "Sign Out",
    welcome: "Welcome",
    guest_view: "Public Portal Mode: You are currently browsing as a guest. Submit property inquiries, communicate with licensed land brokers, bookmark specific parcels, or register a custom profile by logging in below.",
    access_desk: "Access Secure Desk",
    
    // Stats
    total_area: "TOTAL MAPPED CADASTRAL AREA",
    security: "GOVERNMENT DATA SECURITY",
    tamperproof: "100% Cryptographic Integrity",
    active_hubs: "ACTIVE REGISTRY HUBS",
    verified_by_reg: "Verified by National Registry",
    metric_ref: "RESOURCE METRIC CONVERSION",

    // Search and Filters
    search_parcels: "Search Parcels & Listings",
    placeholder_search: "e.g. Outer Whitefield, Bandra, Westlake Hills, Palo Alto, Manhattan, Ludhiana...",
    filter_district: "Filter by District Hub",
    all_districts: "ALL DISTRICT HUBS (Punjab / Bengaluru / Jaisalmer / Pune / Manhattan / Austin)",
    zoning_category: "Zoning Code & Permitted Uses",
    all_categories: "ALL ZONING CLASSIFICATIONS",
    max_val: "Maximum Registry Valuation",
    only_starred: "Show Bookmarked Parcels Only",
    active_listings: "Active Land & Cadastral Listings",
    results_found: "parcels found in this district list",
    no_results: "No registry matches found for your filter.",
    reset_filter: "Reset Search Filters & Boundaries",

    // Map
    map_boundary: "CADASTRE BOUNDARY MAP",
    zoning_mode: "ZONING MAP MODE",
    satellite_mode: "SATELLITE VIEW",
    measure_area: "Measure Area",
    measuring_active: "Click on map to place vertex points",
    finish: "Finish",
    cancel: "Cancel",
    measured_result: "Measured Plot Area:",
    interactive_inspector: "Interactive Plot Boundary Inspector",
    no_parcel_selected: "No GIS parcel selected. Click on any parcel polygon within the active viewport above to fetch real-time cadastral details.",
    verified_title: "VERIFIED TITLE",
    price_reserved: "REGISTRY RESERVED PRICE",
    inquire_submit: "INQUIRE & SUBMIT OFFER",
    per_acre: "per acre",

    // Intelligent zoning and due diligence
    zoning_desk: "Zoning Code & Permitted Uses Index",
    zoning_description: "Municipal zoning codes dictate permitted structures, maximum heights, setbacks, and land use regulations. Select a zoning code to check active rules:",
    category_standards: "Zoning Standards:",
    setbacks_required: "REQUIRED BOUNDARY SETBACKS",
    max_height_reach: "MAXIMUM PERMITTED HEIGHT",
    permitted_uses: "PERMITTED USES & STRUCTURES",
    notice: "Notice: Zoning codes may change. Always consult official municipality blueprints before final land registration.",
    due_diligence: "Land Due Diligence Guidelines",
    diligence_subtitle: "Before buying development parcels, review the property survey and perform clean soil percolation or water table tests:",
    verified_status: "Verified",

    // Auth & Forms
    access_portal_header: "Verified Portal Access Gateway",
    role_investor: "Registered Citizen / Land Buyer",
    role_agent: "Licensed Real-Estate Broker / Agent",
    login_prompt: "Select role and enter details to securely authenticate with State database nodes.",
    full_name: "FULL LEGAL NAME",
    email_addr: "STATE REGISTERED EMAIL",
    tele_no: "SECURE PHONE NUMBER",
    sign_in_btn: "Verify Credentials & Open Dashboard",
    saved_bookmarks: "Saved Bookmarked Parcels",
    registered_inquiries: "My Registered Inquiries",
    no_inquiries: "No active land inquiries registered yet.",
    land_inquiry_form: "Land Registry Official Inquiry Desk",
    close: "Close",
    message_agent: "official channel message",
    submit_inquiry_btn: "Submit Formal General Inquiry",
    submit_offer_btn: "Submit Purchase Offer"
  },
  HI: {
    gov_of_india: "भारत सरकार",
    satellite_core: "जीआईएस सैटेलाइट कोर V4",
    national_registry: "राष्ट्रीय भूमि रजिस्ट्री",
    official_node: "आधिकारिक नोड",
    cadastral_register: "कैडस्ट्रल जीआईएस रजिस्टर",
    sign_in_inquire: "पूछताछ के लिए साइन इन करें",
    sign_out: "साइन आउट",
    welcome: "स्वागत है",
    guest_view: "सार्वजनिक पोर्टल मोड: आप वर्तमान में एक अतिथि के रूप में ब्राउज़ कर रहे हैं। कानूनी खरीद प्रस्ताव जमा करें, सत्यापित सरकारी दलालों से बात करें, या लॉगिन कर नई भूमि पंजीकृत करें।",
    access_desk: "सुरक्षित डेस्क खोलें",
    
    // Stats
    total_area: "कुल मैप किया गया क्षेत्र",
    security: "संप्रभु सुरक्षा",
    tamperproof: "100% छेड़छाड़-रोधी सुरक्षा",
    active_hubs: "सक्रिय जिला केंद्र",
    verified_by_reg: "भूमि रजिस्ट्री द्वारा सत्यापित",
    metric_ref: "मीट्रिक रूपांतरण संदर्भ",

    // Search and Filters
    search_parcels: "कैडस्ट्रल पार्सल खोजें",
    placeholder_search: "उदा. खेत, नहर, हाईवे, पुणे, लुधियाना...",
    filter_district: "जिले के अनुसार फ़िल्टर करें",
    all_districts: "सभी जिले (पंजाब / बेंगलुरु / राजस्थान / पुणे / नासिक)",
    zoning_category: "ज़ोनिंग दिशानिर्देश श्रेणी",
    all_categories: "सभी श्रेणियां",
    max_val: "अधिकतम रजिस्ट्री आरक्षित मूल्य",
    only_starred: "केवल सहेजे गए प्लॉट दिखाएं",
    active_listings: "सक्रिय कैडस्ट्रल भूमि सूची",
    results_found: "इस जिले में पंजीकृत पार्सल",
    no_results: "आपके फ़िल्टर के लिए कोई रजिस्ट्री परिणाम नहीं मिला।",
    reset_filter: "खोज फ़िल्टर और सीमाएं रीसेट करें",

    // Map
    map_boundary: "कैडस्ट्रल सीमा मानचित्र",
    zoning_mode: "ज़ोनिंग मानचित्र मोड",
    satellite_mode: "सैटेलाइट दृश्य",
    measure_area: "क्षेत्र मापें",
    measuring_active: "बिंदु रखने के लिए मानचित्र पर क्लिक करें",
    finish: "समाप्त",
    cancel: "रद्द करें",
    measured_result: "मापा गया प्लॉट क्षेत्र:",
    interactive_inspector: "इंटरैक्टिव प्लॉट सीमा निरीक्षक",
    no_parcel_selected: "कोई जीआईएस पार्सल चयनित नहीं है। वास्तविक समय की जानकारी के लिए ऊपर मानचित्र पर किसी भी प्लॉट पर क्लिक करें।",
    verified_title: "सत्यापित स्वामित्व",
    price_reserved: "रजिस्ट्री आरक्षित मूल्य",
    inquire_submit: "पूछताछ और प्रस्ताव भेजें",
    per_acre: "प्रति एकड़",

    // Intelligent zoning and due diligence
    zoning_desk: "ज़ोनिंग और भूमि उपयोग खुफिया डेस्क",
    zoning_description: "ज़ोनिंग वर्गीकरण कानूनी रूप से स्वीकृत संरचनाओं, ऊंचाई सीमाओं और विकास नियमों को निर्धारित करते हैं। नियम जानने के लिए एक कोड चुनें:",
    category_standards: "श्रेणी मानक:",
    setbacks_required: "आवश्यक सेटबैक",
    max_height_reach: "अधिकतम ऊंचाई सीमा",
    permitted_uses: "अनुमत उपयोग",
    notice: "सूचना: बिल्डिंग कोड बदल सकते हैं। किसी भी लेनदेन को अंतिम रूप देने से पहले हमेशा नगर निगम कोड की जांच करें।",
    due_diligence: "उचित सावधानी ऑडिट",
    diligence_subtitle: "भूमि का मूल्य पूरी तरह से पर्यावरण पर निर्भर करता है। उचित सावधानी अवधि के दौरान इन जांचों को पूरा करें:",
    verified_status: "सत्यापित",

    // Auth & Forms
    access_portal_header: "सत्यापित पोर्टल एक्सेस गेटवे",
    role_investor: "भूमि खरीददार / निवेशक",
    role_agent: "अधिकृत सब-रजिस्ट्रार अधिकारी / एजेंट",
    login_prompt: "राज्य डेटाबेस से सुरक्षित रूप से प्रमाणित करने के लिए अपनी भूमिका चुनें और विवरण दर्ज करें।",
    full_name: "पूरा कानूनी नाम",
    email_addr: "पंजीकृत ईमेल पता",
    tele_no: "सुरक्षित फोन नंबर",
    sign_in_btn: "क्रेडेंशियल सत्यापित करें और डैशबोर्ड खोलें",
    saved_bookmarks: "सहेजे गए बुकमार्क प्लॉट",
    registered_inquiries: "मेरी पंजीकृत पूछताछ",
    no_inquiries: "अभी तक कोई सक्रिय भूमि पूछताछ दर्ज नहीं की गई है।",
    land_inquiry_form: "भूमि रजिस्ट्री आधिकारिक पूछताछ डेस्क",
    close: "बंद करें",
    message_agent: "आधिकारिक संदेश",
    submit_inquiry_btn: "औपचारिक सामान्य पूछताछ भेजें",
    submit_offer_btn: "खरीद प्रस्ताव जमा करें"
  },
  BN: {
    gov_of_india: "ভারত সরকার",
    satellite_core: "জিআইএস স্যাটেলাইট কোর V4",
    national_registry: "জাতীয় ভূমি রেজিস্ট্রি",
    official_node: "অফিসিয়াল নোড",
    cadastral_register: "ক্যাডাস্ট্রাল জিআইএস রেজিস্টার",
    sign_in_inquire: "অনুসন্ধানের জন্য সাইন ইন করুন",
    sign_out: "সাইন আউট",
    welcome: "স্বাগতম",
    guest_view: "পাবলিক পোর্টাল মোড: আপনি বর্তমানে অতিথি হিসেবে ব্রাউজ করছেন। আইনি ক্রয় অফার জমা দিতে, সরকারি কর্মকর্তাদের সাথে যোগাযোগ করতে বা নতুন জমি নথিভুক্ত করতে লগইন করুন।",
    access_desk: "সুরক্ষিত ডেস্ক ব্যবহার করুন",
    
    // Stats
    total_area: "মোট ম্যাপ করা এলাকা",
    security: "সার্বভৌম নিরাপত্তা",
    tamperproof: "১০০% সুরক্ষিত ডাটা সিল",
    active_hubs: "সক্রিয় জেলা কেন্দ্র",
    verified_by_reg: "ভূমি রেজিস্ট্রি দ্বারা যাচাইকৃত",
    metric_ref: "মেট্রিক রূপান্তর রেফারেন্স",

    // Search and Filters
    search_parcels: "ক্যাডাস্ট্রাল পার্সেল খুঁজুন",
    placeholder_search: "যেমন: খামার, খাল, হাইওয়ে, পুনে, লুধিয়ানা...",
    filter_district: "জেলা অনুযায়ী ফিল্টার করুন",
    all_districts: "সমস্ত জেলা (পাঞ্জাব / বেঙ্গালুরু / রাজস্থান / পুনে / নাসিক)",
    zoning_category: "জোনিং নির্দেশিকা বিভাগ",
    all_categories: "সমস্ত ক্যাটাগরি",
    max_val: "সর্বোচ্চ রেজিস্ট্রি সংরক্ষিত মূল্য",
    only_starred: "শুধুমাত্র সংরক্ষিত প্লট দেখান",
    active_listings: "সক্রিয় ক্যাডাস্ট্রাল জমি তালিকা",
    results_found: "টি পার্সেল এই জেলায় নিবন্ধিত",
    no_results: "আপনার ফিল্টার অনুযায়ী কোনো জমি পাওয়া যায়নি।",
    reset_filter: "সার্চ ফিল্টার এবং সীমানা রিসেট করুন",

    // Map
    map_boundary: "ক্যাডাস্ট্রাল সীমানা মানচিত্র",
    zoning_mode: "জোনিং মানচিত্র মোড",
    satellite_mode: "স্যাটেলাইট ভিউ",
    measure_area: "ক্ষেত্রফল পরিমাপ",
    measuring_active: "বিন্দু যোগ করতে মানচিত্রে ক্লিক করুন",
    finish: "সম্পন্ন",
    cancel: "বাতিল করুন",
    measured_result: "পরিমাপকৃত প্লট এলাকা:",
    interactive_inspector: "ইন্টারেক্টিভ প্লট সীমানা পরিদর্শক",
    no_parcel_selected: "কোনো জিআইএস পার্সেল নির্বাচিত নেই। রিয়েল-টাইম তথ্যের জন্য উপরের মানচিত্রের যেকোনো প্লটের উপর ক্লিক করুন।",
    verified_title: "যাচাইকৃত স্বত্ব",
    price_reserved: "রেজিস্ট্রি সংরক্ষিত মূল্য",
    inquire_submit: "অনুসন্ধান ও অফার জমা দিন",
    per_acre: "প্রতি একর",

    // Intelligent zoning and due diligence
    zoning_desk: "জোনিং এবং ভূমি ব্যবহার তথ্য কেন্দ্র",
    zoning_description: "জোনিং কোডগুলি আইনত অনুমোদিত কাঠামো, উচ্চতা সীমা এবং উন্নয়ন বিধি নির্দেশ করে। নিয়ম পরীক্ষা করতে একটি কোড বেছে নিন:",
    category_standards: "বিভাগের মানসমূহ:",
    setbacks_required: "প্রয়োজনীয় দূরত্ব (সেটব্যাক)",
    max_height_reach: "সর্বোচ্চ উচ্চতা সীমা",
    permitted_uses: "অনুমোদিত ব্যবহারসমূহ",
    notice: "বিজ্ঞপ্তি: জোনিং নিয়মাবলী পরিবর্তিত হতে পারে। যেকোনো লেনদেন করার আগে সর্বদা সংশ্লিষ্ট পৌর সংস্থার কোড পরীক্ষা করুন।",
    due_diligence: "যথাযথ অনুসন্ধান অডিট",
    diligence_subtitle: "জমির মূল্য সম্পূর্ণরূপে পরিবেশগত কারণের উপর নির্ভর করে। আপনার অনুসন্ধানের সময় এই অডিটগুলি করুন:",
    verified_status: "যাচাইকৃত",

    // Auth & Forms
    access_portal_header: "যাচাইকৃত পোর্টাল অ্যাক্সেস গেটওয়ে",
    role_investor: "সার্বভৌম ভূমি ক্রেতা / বিনিয়োগকারী",
    role_agent: "অনুমোদিত সাব-রেজিস্ট্রার কর্মকর্তা / এজেন্ট",
    login_prompt: "রাজ্য ডেটাবেসের সাথে সুরক্ষিতভাবে সংযুক্ত হতে আপনার ভূমিকা নির্বাচন করুন এবং বিবরণ দিন।",
    full_name: "সম্পূর্ণ আইনি নাম",
    email_addr: "নিবন্ধিত ইমেল ঠিকানা",
    tele_no: "সুরক্ষিত ফোন নম্বর",
    sign_in_btn: "যাচাই করুন এবং ড্যাশবোর্ড খুলুন",
    saved_bookmarks: "সংরক্ষিত বুকমার্ক প্লট",
    registered_inquiries: "আমার নথিবদ্ধ অনুসন্ধানসমূহ",
    no_inquiries: "এখনও কোনো সক্রিয় অনুসন্ধান নথিভুক্ত করা হয়নি।",
    land_inquiry_form: "ভূমি রেজিস্ট্রি অফিসিয়াল অনুসন্ধান ডেস্ক",
    close: "বন্ধ করুন",
    message_agent: "অফিসিয়াল বার্তা",
    submit_inquiry_btn: "আনুষ্ঠানিক অনুসন্ধান সাবমিট করুন",
    submit_offer_btn: "ক্রয় অফার জমা দিন"
  },
  TE: {
    gov_of_india: "భారత ప్రభుత్వం",
    satellite_core: "GIS శాటిలైట్ కోర్ V4",
    national_registry: "జాతీయ భూ రిజిస్ట్రీ",
    official_node: "అధికారిక నోడ్",
    cadastral_register: "కాడస్ట్రల్ GIS రిజిస్టర్",
    sign_in_inquire: "విచారణ కోసం సైన్ ఇన్ చేయండి",
    sign_out: "సైన్ అవుట్",
    welcome: "స్వాగతం",
    guest_view: "పబ్లిక్ పోర్టల్ మోడ్: మీరు ప్రస్తుతం అతిథిగా బ్రౌజ్ చేస్తున్నారు. చట్టపరమైన కొనుగోలు ఆఫర్లను సమర్పించడానికి లేదా అధికారిక అధికారులతో మాట్లాడటానికి లాగిన్ అవ్వండి.",
    access_desk: "సురక్షిత డెస్క్ యాక్సెస్",
    
    // Stats
    total_area: "మొత్తం మ్యాప్ చేసిన ప్రాంతం",
    security: "సార్వభౌమ భద్రత",
    tamperproof: "100% ట్యాంపర్ ప్రూఫ్ రక్షణ సీల్స్",
    active_hubs: "యాక్టివ్ డిస్ట్రిక్ట్ హబ్‌లు",
    verified_by_reg: "భూ రిజిస్ట్రీ ద్వారా ధృవీకరించబడింది",
    metric_ref: "మెట్రిక్ మార్పిడి సూచన",

    // Search and Filters
    search_parcels: "భూమి పార్సెల్‌లను వెతకండి",
    placeholder_search: "ఉదా. పొలం, కాలువ, హైవే, పూణే, లూథియానా...",
    filter_district: "జిల్లా ఆధారంగా ఫిల్టర్",
    all_districts: "అన్ని జిల్లాలు (పంజాబ్ / బెంగళూరు / రాజస్థాన్ / పూణే / నాసిక్)",
    zoning_category: "జోనింగ్ గైడ్‌లైన్ వర్గం",
    all_categories: "అన్ని వర్గాలు",
    max_val: "గరిష్ట రిజిస్ట్రీ రిజర్వ్ ధర",
    only_starred: "సేవ్ చేసిన భూములు మాత్రమే చూపించు",
    active_listings: "యాక్టివ్ కాడస్ట్రల్ ల్యాండ్ లిస్టింగ్‌లు",
    results_found: "పార్సెల్‌లు ఈ జిల్లాలో రిజిస్టర్ చేయబడ్డాయి",
    no_results: "మీరు ఎంచుకున్న ఫిల్టర్‌కు తగ్గ భూములు లభించలేదు.",
    reset_filter: "ఫిల్టర్‌లను రీసెట్ చేయండి",

    // Map
    map_boundary: "కాడస్ట్రల్ సరిహద్దు మ్యాప్",
    zoning_mode: "జోనింగ్ మ్యాప్ మోడ్",
    satellite_mode: "శాటిలైట్ వ్యూ",
    measure_area: "ప్రాంతాన్ని కొలవండి",
    measuring_active: "బిందువులను ఉంచడానికి మ్యాప్ పై క్లిక్ చేయండి",
    finish: "పూర్తయింది",
    cancel: "రద్దు చేయి",
    measured_result: "కొలిచిన భూమి విస్తీర్ణం:",
    interactive_inspector: "ఇంటరాక్టివ్ భూ సరిహద్దు ఇన్‌స్పెక్టర్",
    no_parcel_selected: "ఏ GIS పార్సెల్ ఎంపిక చేయబడలేదు. వివరాల కోసం పై మ్యాప్‌లోని ఏదైనా భూమిపై క్లిక్ చేయండి.",
    verified_title: "ధృవీకరించబడిన శీర్షిక",
    price_reserved: "రిజిస్ట్రీ రిజర్వ్ ధర",
    inquire_submit: "విచారణ & ఆఫర్ సమర్పించండి",
    per_acre: "ఎకరాకు",

    // Intelligent zoning and due diligence
    zoning_desk: "జోనింగ్ & భూ వినియోగ సమాచార డెస్క్",
    zoning_description: "జోనింగ్ నిబంధనలు చట్టబద్ధమైన నిర్మాణాలు, ఎత్తు పరిమితులు మరియు అభివృద్ధి నిబంధనలను నిర్ణయిస్తాయి. నిబంధనలను తనిఖీ చేయడానికి ఒక కోడ్‌ను ఎంచుకోండి:",
    category_standards: "వర్గ ప్రమాణాలు:",
    setbacks_required: "సెట్‌బ్యాక్‌లు అవసరం",
    max_height_reach: "గరిష్ట ఎత్తు పరిమితి",
    permitted_uses: "అనుమతించబడిన ఉపయోగాలు",
    notice: "గమనిక: బిల్డింగ్ కోడ్‌లు మారవచ్చు. లావాదేవీని ఖരారు చేసే ముందు మునిసిపల్ కోడ్‌ని ఎల్లప్పుడూ తనిఖీ చేయండి.",
    due_diligence: "డ్యూ డిలిజెన్స్ ఆడిట్",
    diligence_subtitle: "భూమి విలువ పర్యావరణ కారకాలపై ఆధారపడి ఉంటుంది. మీ ఆడిట్ సమయంలో వీటిని తనిఖీ చేయండి:",
    verified_status: "ధృవీకరించబడింది",

    // Auth & Forms
    access_portal_header: "ధృవీకరించబడిన పోర్టల్ యాక్సెస్ గేట్‌వే",
    role_investor: "భూమి కొనుగోలుదారు / పెట్టుబడిదారు",
    role_agent: "అధికారిక సబ్-రిజిస్ట్రార్ అధికారి / ఏజెంట్",
    login_prompt: "సురక్షితంగా ప్రమాణీకరించడానికి మీ పాత్రను ఎంచుకుని, వివరాలను నమోదు చేయండి.",
    full_name: "పూర్తి చట్టపరమైన పేరు",
    email_addr: "రిజిస్టర్డ్ ఈమెయిల్",
    tele_no: "సురక్షిత ఫోన్ నంబర్",
    sign_in_btn: "లగిన్ చేసి డాష్‌బోర్డ్ తెరవండి",
    saved_bookmarks: "సేవ్ చేసిన బుక్‌మార్క్ భూములు",
    registered_inquiries: "నా రిజిస్టర్డ్ విచారణలు",
    no_inquiries: "ఇంకా ఎలాంటి విచారణలు నమోదు కాలేదు.",
    land_inquiry_form: "భూ రిజిస్ట్రీ అధికారిక విచారణ డెస్క్",
    close: "మూసివేయి",
    message_agent: "అధికారిక సందేశం",
    submit_inquiry_btn: "సాధారణ విచారణను సమర్పించండి",
    submit_offer_btn: "కొనుగోలు ఆఫర్ సమర్పించండి"
  },
  MR: {
    gov_of_india: "भारत सरकार",
    satellite_core: "GIS सॅटेलाइट कोर V4",
    national_registry: "राष्ट्रीय भूमी अभिलेख",
    official_node: "अधिकृत नोड",
    cadastral_register: "कॅडस्ट्रल जीआयएस रजिस्टर",
    sign_in_inquire: "चौकशीसाठी लॉगिन करा",
    sign_out: "लॉगआउट",
    welcome: "स्वागत आहे",
    guest_view: "सार्वजनिक पोर्टल मोड: आपण अतिथी म्हणून पाहत आहात. खरेदीचे कायदेशीर प्रस्ताव सादर करण्यासाठी किंवा अधिकृत अधिकाऱ्यांशी बोलण्यासाठी कृपया लॉगिन करा.",
    access_desk: "सुरक्षित डेस्क उघडा",
    
    // Stats
    total_area: "एकूण मॅप केलेले क्षेत्र",
    security: "सार्वभौम सुरक्षा",
    tamperproof: "100% फेरफार-मुक्त डेटा सुरक्षा",
    active_hubs: "सक्रिय जिल्हा केंद्र",
    verified_by_reg: "भूमी अभिलेखाद्वारे सत्यापित",
    metric_ref: "मेट्रिक रूपांतरण संदर्भ",

    // Search and Filters
    search_parcels: "प्लॉट किंवा गट शोधा",
    placeholder_search: "उदा. शेत, कालवा, महामार्ग, पुणे, लुधियाना...",
    filter_district: "जिल्ह्यानुसार फिल्टर",
    all_districts: "सर्व जिल्हे (पंजाब / बेंगळुरू / राजस्थान / पुणे / नाशिक)",
    zoning_category: "झोनिंग मार्गदर्शक तत्त्वे श्रेणी",
    all_categories: "सर्व श्रेणी",
    max_val: "कमाल आरक्षित शासकीय मूल्य",
    only_starred: "केवळ जतन केलेले प्लॉट दाखवा",
    active_listings: "सक्रिय कॅडस्ट्रल जमीन सूची",
    results_found: "गट या जिल्ह्यात नोंदणीकृत आहेत",
    no_results: "शोध निकषांशी जुळणारे भूमी अभिलेख सापडले नाहीत.",
    reset_filter: "शोध फिल्टर रीसेट करा",

    // Map
    map_boundary: "कॅडस्ट्रल सीमा नकाशा",
    zoning_mode: "झोनिंग नकाशा मोड",
    satellite_mode: "सॅटेलाइट व्ह्यू",
    measure_area: "क्षेत्रफळ मोजा",
    measuring_active: "बिंदू जोडण्यासाठी नकाशावर क्लिक करा",
    finish: "पूर्ण",
    cancel: "रद्द करा",
    measured_result: "मोजलेले क्षेत्रफळ:",
    interactive_inspector: "इंटरएक्टिव्ह प्लॉट सीमा निरीक्षक",
    no_parcel_selected: "कोणताही जीआयएस पार्सल निवडलेला नाही. अधिक माहितीसाठी नकाशावरील कोणत्याही प्लॉटवर क्लिक करा.",
    verified_title: "सत्यापित मालकी",
    price_reserved: "आरक्षित शासकीय मूल्य",
    inquire_submit: "चौकशी आणि खरेदी प्रस्ताव पाठवा",
    per_acre: "प्रति एकर",

    // Intelligent zoning and due diligence
    zoning_desk: "झोनिंग आणि जमीन वापर माहिती डेस्क",
    zoning_description: "झोनिंग वर्गीकरण कायदेशीर इमारती, उंची मर्यादा आणि विकास नियम निर्धारित करतात. नियम जाणून घेण्यासाठी कोड निवडा:",
    category_standards: "श्रेणी मानके:",
    setbacks_required: "आवश्यक अंतर (सेटबॅक)",
    max_height_reach: "कमाल उंची मर्यादा",
    permitted_uses: "मंजूर वापर",
    notice: "टीप: झोनिंग नियम बदलू शकतात. कोणताही व्यवहार पूर्ण करण्यापूर्वी नेहमी स्थानिक नगरपालिकेचे नियम तपासा.",
    due_diligence: "उचित दक्षता ऑडिट",
    diligence_subtitle: "जमिनीचे मूल्य हे पूर्णपणे पर्यावरणीय घटकांवर अवलंबून असते. आपल्या ऑडिट दरम्यान या घटकांची पडताळणी करा:",
    verified_status: "सत्यापित",

    // Auth & Forms
    access_portal_header: "सत्यापित पोर्टल प्रवेश गेटवे",
    role_investor: "जमीन खरेदीदार / गुंतवणूकदार",
    role_agent: "अधिकृत उपनिबंधक अधिकारी / एजंट",
    login_prompt: "राज्य डेटाबेससह सुरक्षितपणे जोडण्यासाठी आपली भूमिका निवडा आणि माहिती भरा.",
    full_name: "पूर्ण कायदेशीर नाव",
    email_addr: "नोंदणीकृत ईमेल",
    tele_no: "सुरक्षित फोन नंबर",
    sign_in_btn: "पडताळणी करा आणि डॅशबोर्ड उघडा",
    saved_bookmarks: "जतन केलेले बुकमार्क प्लॉट",
    registered_inquiries: "माझ्या नोंदणीकृत चौकशी",
    no_inquiries: "अद्याप कोणतीही सक्रिय चौकशी नोंदविलेली नाही.",
    land_inquiry_form: "जमीन नोंदणी चौकशी डेस्क",
    close: "बंद करा",
    message_agent: "अधिकृत संदेश",
    submit_inquiry_btn: "अधिकृत चौकशी सबमिट करा",
    submit_offer_btn: "खरेदी प्रस्ताव सादर करा"
  },
  TA: {
    gov_of_india: "இந்திய அரசு",
    satellite_core: "GIS செயற்கைக்கோள் கோர் V4",
    national_registry: "தேசிய நிலப் பதிவேடு",
    official_node: "அதிகாரப்பூர்வ முனை",
    cadastral_register: "நில எல்லை GIS பதிவேடு",
    sign_in_inquire: "விசாரிக்க உள்நுழையவும்",
    sign_out: "வெளியேறுக",
    welcome: "வரவேற்கிறோம்",
    guest_view: "பொது போர்ட்டல் முறை: நீங்கள் பார்வையாளராக உலாவுகிறீர்கள். சட்டப்பூர்வ சலுகைகளை சமர்ப்பிக்க அல்லது அதிகாரப்பூர்வ பிரதிநிதிகளைத் தொடர்பு கொள்ள உள்நுழையவும்.",
    access_desk: "பாதுகாப்பான மேசையை அணுகவும்",
    
    // Stats
    total_area: "மொத்த வரைபடப் பரப்பு",
    security: "இறையாண்மை பாதுகாப்பு",
    tamperproof: "100% மாற்றுதலுக்கு அப்பாற்பட்ட பாதுகாப்பு",
    active_hubs: "செயலில் உள்ள மாவட்ட மையங்கள்",
    verified_by_reg: "பதிவுத்துறையால் சரிபார்க்கப்பட்டது",
    metric_ref: "அளவீட்டு மாற்றக் குறிப்பு",

    // Search and Filters
    search_parcels: "நிலப்பகுதிகளைத் தேடுங்கள்",
    placeholder_search: "எ.கா. விவசாயம், கால்வாய், நெடுஞ்சாலை, புனே...",
    filter_district: "மாவட்ட வாரியாக வடிகட்டவும்",
    all_districts: "அனைத்து மாவட்டங்களும் (பஞ்சாப் / பெங்களூரு / ராஜஸ்தான் / புனே / நாசிக்)",
    zoning_category: "மண்டல வழிகாட்டுதல் வகை",
    all_categories: "அனைத்து பிரிவுகளும்",
    max_val: "அதிகபட்ச அரசு ஒதுக்கீடு மதிப்பு",
    only_starred: "சேமிக்கப்பட்ட நிலங்களை மட்டும் காட்டு",
    active_listings: "செயலில் உள்ள நிலப் பட்டியல்கள்",
    results_found: "பகுதிகள் இந்த மாவட்டத்தில் பதிவு செய்யப்பட்டுள்ளன",
    no_results: "உங்கள் தேடலுக்கு ஏற்ற நிலப் பகுதிகள் எதுவும் கிடைக்கவில்லை.",
    reset_filter: "தேடலை மீட்டமைക്കുക",

    // Map
    map_boundary: "நில எல்லை வரைபடம்",
    zoning_mode: "மண்டல வரைபட முறை",
    satellite_mode: "செயற்கைக்கோள் பார்வை",
    measure_area: "பரப்பளவை அளவிடு",
    measuring_active: "புள்ளிகளை வைக்க வரைபடத்தில் கிளிக் செய்யவும்",
    finish: "முடிந்தது",
    cancel: "ரத்து செய்",
    measured_result: "அளவிடப்பட்ட நிலப்பரப்பு:",
    interactive_inspector: "நில எல்லை ஊடாடும் ஆய்வாளர்",
    no_parcel_selected: "GIS நிலப்பகுதி எதுவும் தேர்ந்தெடுக்கப்படவில்லை. விவரங்களைக் காண வரைபடத்தில் உள்ள நிலத்தின் மீது கிளிக் செய்யவும்.",
    verified_title: "சரிபார்க்கப்பட்ட உரிமைச் சான்று",
    price_reserved: "அரசு ஒதுக்கீடு மதிப்பு",
    inquire_submit: "விசாரணை & சலுகை சமர்ப்பி",
    per_acre: "ஒரு ஏக்கர்",

    // Intelligent zoning and due diligence
    zoning_desk: "மண்டல வடிவமைப்பு & நிலப் பயன்பாட்டுத் தகவல் மையம்",
    zoning_description: "மண்டலக் குறியீடுகள் சட்டப்பூர்வ கட்டுமானங்கள், உயர வரம்புகள் மற்றும் மேம்பாட்டு விதிகளைத் தீர்மானிக்கின்றன. விதிகளைச் சரிபார்க்க ஒரு குறியீட்டைத் தேர்ந்தெடுக்கவும்:",
    category_standards: "வகை தரநிலைகள்:",
    setbacks_required: "தேவைப்படும் இடைவெளி",
    max_height_reach: "அதிகபட்ச உயரம்",
    permitted_uses: "அனுமதிக்கப்பட்ட பயன்பாடுகள்",
    notice: "அறிவிப்பு: கட்டிட விதிகள் மாறக்கூடும். ஒப்பந்தத்தை முடிப்பதற்கு முன் எப்போதும் உள்ளூர் நகராட்சி விதிகளைச் சரிபார்க்கவும்.",
    due_diligence: "முறையான தணிக்கை",
    diligence_subtitle: "நில மதிப்பு முற்றிலும் சுற்றுச்சூழல் காரணிகளைச் சார்ந்தது. உங்கள் தணிக்கையின் போது இவற்றைச் சரிபார்க்கவும்:",
    verified_status: "சரிபார்க்கப்பட்டது",

    // Auth & Forms
    access_portal_header: "சரிபார்க்கப்பட்ட போர்ட்டல் அணுகல் வாயில்",
    role_investor: "நில வாங்குபவர் / முதலீட்டாளர்",
    role_agent: "அங்கீகரிக்கப்பட்ட துணைப் பதிவாளர் / முகவர்",
    login_prompt: "பாதுகாப்பாக உள்நுழைய உங்கள் பங்கைத் தேர்ந்தெடுத்து விவரங்களை உள்ளிடவும்.",
    full_name: "முழு சட்டப்பூர்வ பெயர்",
    email_addr: "பதிவு செய்யப்பட்ட மின்னஞ்சல்",
    tele_no: "பாதுகாப்பான தொலைபேசி எண்",
    sign_in_btn: "சரிபார்த்து டாஷ்போர்டு திறக்கவும்",
    saved_bookmarks: "சேமிக்கப்பட்ட புக்மார்க் நிலங்கள்",
    registered_inquiries: "எனது பதிவு செய்யப்பட்ட விசாரணைகள்",
    no_inquiries: "செயலில் உள்ள விசாரணைகள் எதுவும் இல்லை.",
    land_inquiry_form: "நிலப் பதிவு விசாரணை மையம்",
    close: "மூடு",
    message_agent: "அதிகாரப்பூர்வ செய்தி",
    submit_inquiry_btn: "அதிகாரப்பூர்வ விசாரணையைச் சமர்ப்பிக்கவும்",
    submit_offer_btn: "வாங்கும் சலுகையைச் சமர்ப்பிக்கவும்"
  },
  GU: {
    gov_of_india: "ભારત સરકાર",
    satellite_core: "GIS સેટેલાઇટ કોર V4",
    national_registry: "રાષ્ટ્રીય જમીન રજિસ્ટ્રી",
    official_node: "સત્તાવાર નોડ",
    cadastral_register: "કેડસ્ટ્રલ જીઆઇએસ રજિસ્ટર",
    sign_in_inquire: "પૂછપરછ માટે લોગિન કરો",
    sign_out: "લોગઆઉટ",
    welcome: "સ્વાગત છે",
    guest_view: "જાહેર પોર્ટલ મોડ: તમે હાલમાં મુલાકાતી તરીકે પોર્ટલ જોઈ રહ્યા છો. કાનૂની ખરીદ પ્રસ્તાવ મોકલવા અથવા સરકારી પ્રતિનિધિઓનો સંપર્ક કરવા માટે લોગિન કરો.",
    access_desk: "સુરક્ષિત ડેસ્ક ખોલો",
    
    // Stats
    total_area: "કુલ મેપ કરેલ વિસ્તાર",
    security: "સાર્વભૌમ સુરક્ષા",
    tamperproof: "100% સુરક્ષિત ડેટા સીલ",
    active_hubs: "સક્રિય જિલ્લા કેન્દ્રો",
    verified_by_reg: "લેન્ડ રજિસ્ટ્રી દ્વારા ચકાસાયેલ",
    metric_ref: "મેટ્રિક રૂપાંતરણ સંદર્ભ",

    // Search and Filters
    search_parcels: "કેડસ્ટ્રલ જમીન પ્લોટ શોધો",
    placeholder_search: "દા.ત. ખેતર, નહેર, હાઇવે, પુણે, લુધિયાણા...",
    filter_district: "જિલ્લા મુજબ ફિલ્ટર",
    all_districts: "બધા જિલ્લા (પંજાબ / બેંગલુરુ / રાજસ્થાન / પુણે / નાસિક)",
    zoning_category: "ઝોનિંગ માર્ગદર્શિકા શ્રેણી",
    all_categories: "બધી શ્રેણીઓ",
    max_val: "મહત્તમ સરકારી અનામત કિંમત",
    only_starred: "માત્ર સાચવેલા પ્લોટો બતાવો",
    active_listings: "સક્રિય કેડસ્ટ્રલ જમીન યાદીઓ",
    results_found: "આ જિલ્લામાં નોંધાયેલા જમીન પ્લોટ છે",
    no_results: "તમારી શોધ સાથે મેળ ખાતી કોઈ જમીન માહિતી મળી નથી.",
    reset_filter: "શોધ અને સીમા ફિલ્ટર રીસેટ કરો",

    // Map
    map_boundary: "કેડસ્ટ્રલ સીમા નકશો",
    zoning_mode: "ઝોનિંગ નકશા મોડ",
    satellite_mode: "સેટેલાઇટ વ્યૂ",
    measure_area: "વિસ્તાર માપો",
    measuring_active: "બિંદુઓ મૂકવા માટે નકશા પર ક્લિક કરો",
    finish: "સંપૂર્ણ",
    cancel: "રદ કરો",
    measured_result: "માપેલ પ્લોટ વિસ્તાર:",
    interactive_inspector: "ઇન્ટરેક્ટિવ પ્લોટ સીમા નિરીક્ષક",
    no_parcel_selected: "જીઆઇએસ પ્લોટ પસંદ કરેલ નથી. વાસ્તવિક સમયની માહિતી મેળવવા માટે નકશાના કોઈપણ જમીન પ્લોટ પર ક્લિક કરો.",
    verified_title: "ચકાસાયેલ ટાઈટલ",
    price_reserved: "અનામત સરકારી કિંમત",
    inquire_submit: "પૂછપરછ અને ખરીદ પ્રસ્તાવ મોકલો",
    per_acre: "એકર દીઠ",

    // Intelligent zoning and due diligence
    zoning_desk: "ઝોનિંગ અને જમીન ઉપયોગ માહિતી ડેસ્ક",
    zoning_description: "ઝોનિંગ નિયમો કાયદેસર રીતે મંજૂર બાંધકામો, ઊંચાઈ મર્યાદા અને નિયમો નક્કી કરે છે. શ્રેણી તપાસવા માટે એક કોડ પસંદ કરો:",
    category_standards: "શ્રેણી ધોરણો:",
    setbacks_required: "જરૂરી સેટબેક",
    max_height_reach: "મહત્તમ ઊંચાઈ મર્યાદા",
    permitted_uses: "મંજૂર ઉપયોગો",
    notice: "નોંધ: બિલ્ડિંગ કોડમાં ફેરફાર થઈ શકે છે. વ્યવહાર કરતા પહેલા હંમેશા સંબંધિત નગરપાલિકાના નિયમો તપાસો.",
    due_diligence: "યોગ્ય નિરીક્ષણ ઓડિટ",
    diligence_subtitle: "જમીનનું મૂલ્ય સંપૂર્ણપણે પર્યાવરણ પર આધાર રાખે છે. ઓડિટ દરમિયાન આ બાબતો તપાસો:",
    verified_status: "ચકાસાયેલ",

    // Auth & Forms
    access_portal_header: "ચકાસાયેલ પોર્ટલ પ્રવેશ દ્વાર",
    role_investor: "જમીન ખરીદનાર / રોકાણકાર",
    role_agent: "અધિકૃત સબ-રજિસ્ટ્રાર અધિકારી / એજન્ટ",
    login_prompt: "સુરક્ષિત લોગિન કરવા માટે તમારી ભૂમિકા પસંદ કરો અને વિગતો ભરો.",
    full_name: "પૂરેપૂરું કાનૂની નામ",
    email_addr: "નોંધાયેલ ઈમેઈલ સરનામું",
    tele_no: "સુરક્ષિત ફોન નંબર",
    sign_in_btn: "વિગતો ચકાસો અને ડેશબોર્ડ ખોલો",
    saved_bookmarks: "સાચવેલા બુકમાર્ક પ્લોટ",
    registered_inquiries: "મારી નોંધાયેલી પૂછપરછ",
    no_inquiries: "હજુ સુધી કોઈ સક્રિય પૂછપરછ નોંધવામાં આવી નથી.",
    land_inquiry_form: "લેન્ડ રજિસ્ટ્રી સત્તાવાર પૂછપરછ ડેસ્ક",
    close: "બંધ કરો",
    message_agent: "સત્તાવાર સંદેશ",
    submit_inquiry_btn: "સત્તાવાર પૂછપરછ મોકલો",
    submit_offer_btn: "ખરીદ પ્રસ્તાવ જમા કરો"
  },
  KN: {
    gov_of_india: "ಭಾರತ ಸರ್ಕಾರ",
    satellite_core: "GIS ಉಪಗ್ರಹ ಕೋರ್ V4",
    national_registry: "ರಾಷ್ಟ್ರೀಯ ಭೂ ನೋಂದಣಿ",
    official_node: "ಅಧಿಕೃತ ನೋಡ್",
    cadastral_register: "ಭೂ ಗಡಿ ಜಿಐಎಸ್ ರಿಜಿಸ್ಟರ್",
    sign_in_inquire: "ವಿಚಾರಣೆಗಾಗಿ ಲಾಗಿನ್ ಮಾಡಿ",
    sign_out: "ಲಾಗ್ ಔಟ್",
    welcome: "ಸ್ವಾಗತ",
    guest_view: "ಸಾರ್ವಜನಿಕ ಪೋರ್ಟಲ್ ಮೋಡ್: ನೀವು ಪ್ರಸ್ತುತ ಅತಿಥಿಯಾಗಿ ವೀಕ್ಷಿಸುತ್ತಿದ್ದೀರಿ. ಆಫರ್‌ಗಳನ್ನು ಸಲ್ಲಿಸಲು ಅಥವಾ ಅಧಿಕೃತ ಅಧಿಕಾರಿಗಳೊಂದಿಗೆ ಮಾತನಾಡಲು ಲಾಗಿನ್ ಮಾಡಿ.",
    access_desk: "ಸುರಕ್ಷಿತ ಡೆಸ್ಕ್ ಪ್ರವೇಶಿಸಿ",
    
    // Stats
    total_area: "ಒಟ್ಟು ನಕ್ಷೆ ಮಾಡಿದ ಪ್ರದೇಶ",
    security: "ಸಾರ್ವಭೌಮ ಭದ್ರತೆ",
    tamperproof: "100% ತಿದ್ದುಪಡಿ ರಹಿತ ದತ್ತಾಂಶ ಭದ್ರತೆ",
    active_hubs: "ಸಕ್ರಿಯ ಜಿಲ್ಲಾ ಕೇಂದ್ರಗಳು",
    verified_by_reg: "ಭೂ ನೋಂದಣಿ ಇಲಾಖೆಯಿಂದ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿದೆ",
    metric_ref: "ಮೆಟ್ರಿಕ್ ಪರಿವರ್ತನೆ ಉಲ್ಲೇಖ",

    // Search and Filters
    search_parcels: "ಭೂಮಿ ಪಾರ್ಸೆಲ್‌ಗಳನ್ನು ಹುಡುಕಿ",
    placeholder_search: "ಉದಾ. ತೋಟ, ಕಾಲುವೆ, ಹೆದ್ದಾರಿ, ಪುಣೆ, ಬೆಂಗಳೂರು...",
    filter_district: "ಜಿಲ್ಲಾವಾರು ಫಿಲ್ಟರ್",
    all_districts: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು (ಪಂಜಾಬ್ / ಬೆಂಗಳೂರು / ರಾಜಸ್ಥಾನ / ಪುಣೆ / ನಾಸಿಕ್)",
    zoning_category: "ವಲಯ ಮಾರ್ಗಸೂಚಿ ವರ್ಗ",
    all_categories: "ಎಲ್ಲಾ ವರ್ಗಗಳು",
    max_val: "ಗರಿಷ್ಠ ಸರ್ಕಾರಿ ಮೀಸಲು ಬೆಲೆ",
    only_starred: "ಉಳಿಸಿದ ಭೂಮಿ ಮಾತ್ರ ತೋರಿಸು",
    active_listings: "ಸಕ್ರಿಯ ಭೂ ದಾಖಲೆಗಳ ಪಟ್ಟಿ",
    results_found: "ಅಂಶಗಳು ಈ ಜಿಲ್ಲೆಯಲ್ಲಿ ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿವೆ",
    no_results: "ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ತಕ್ಕ ದಾಖಲೆಗಳು ಲಭ್ಯವಿಲ್ಲ.",
    reset_filter: "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ",

    // Map
    map_boundary: "ಭೂ ಗಡಿ ನಕ್ಷೆ",
    zoning_mode: "ಜೋನಿಂಗ್ ನಕ್ಷೆ ಮೋಡ್",
    satellite_mode: "ಉಪಗ್ರಹ ವೀಕ್ಷಣೆ",
    measure_area: "ಪ್ರದೇಶ ಅಳತೆ",
    measuring_active: "ಬಿಂದುಗಳನ್ನು ಗುರುತಿಸಲು ನಕ್ಷೆಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    finish: "ಪೂರ್ಣಗೊಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    measured_result: "ಅಳತೆ ಮಾಡಿದ ಭೂ ವಿಸ್ತೀರ್ಣ:",
    interactive_inspector: "ಇಂಟರಾಕ್ಟಿವ್ ಭೂ ಗಡಿ ವೀಕ್ಷಕ",
    no_parcel_selected: "ಯಾವುದೇ ಜಿಐಎಸ್ ಭೂಮಿ ಆಯ್ಕೆಯಾಗಿಲ್ಲ. ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ನಕ್ಷೆಯ ಮೇಲಿನ ಭೂಮಿ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.",
    verified_title: "ದೃಢೀಕೃತ ಹಕ್ಕುಪತ್ರ",
    price_reserved: "ಸರ್ಕಾರಿ ಮೀಸಲು ಬೆಲೆ",
    inquire_submit: "ವಿಚಾರಣೆ ಮತ್ತು ಆಫರ್ ಸಲ್ಲಿಸಿ",
    per_acre: "ಪ್ರತಿ ಎಕರೆಗೆ",

    // Intelligent zoning and due diligence
    zoning_desk: "ಜೋನಿಂಗ್ ಮತ್ತು ಭೂ ಬಳಕೆ ಮಾಹಿತಿ ಕೇಂದ್ರ",
    zoning_description: "ಜೋನಿಂಗ್ ನಿಯಮಗಳು ಕಾನೂನುಬದ್ಧ ನಿರ್ಮಾಣಗಳು, ಎತ್ತರ ಮಿತಿಗಳು ಮತ್ತು ನಿಯಮಾವಳಿಗಳನ್ನು ನಿರ್ಧರಿಸುತ್ತವೆ. ವಿವರಗಳನ್ನು ತಿಳಿಯಲು ಕೋಡ್ ಆಯ್ಕೆಮಾಡಿ:",
    notice: "ಗಮನಿಸಿ: ಕಟ್ಟಡ ನಿಯಮಗಳು ಬದಲಾಗಬಹುದು. ಯಾವುದೇ ಒಪ್ಪಂದ ಮಾಡುವ ಮುನ್ನ ಯಾವಾಗಲೂ ಮುನ್ಸಿಪಲ್ ನಿಯಮಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    due_diligence: "ಡ್ಯೂ ಡಿಲಿಜೆನ್ಸ್ ಆಡಿಟ್",
    diligence_subtitle: "ಭೂಮಿಯ ಮೌಲ್ಯ ಪರಿಸರದ ಅಂಶಗಳ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿರುತ್ತದೆ. ಆಡಿಟ್ ಸಮಯದಲ್ಲಿ ಇವುಗಳನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ:",
    verified_status: "ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿದೆ",

    // Auth & Forms
    access_portal_header: "ದೃಢೀಕೃತ ಪೋರ್ಟಲ್ ಪ್ರವೇಶ ದ್ವಾರ",
    role_investor: "ಭೂಮಿ ಖರೀದಿದಾರ / ಹೂಡಿಕೆದಾರ",
    role_agent: "ಅಧಿಕೃತ ಉಪ-ನೋಂದಣಾಧಿಕಾರಿ / ಏಜೆಂಟ್",
    login_prompt: "ಸುರಕ್ಷಿತವಾಗಿ ಲಾಗಿನ್ ಆಗಲು ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆರಿಸಿ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.",
    full_name: "ಪೂರ್ಣ ಕಾನೂನು ಹೆಸರು",
    email_addr: "ನೋಂದಾಯಿತ ಇಮೇಲ್",
    tele_no: "ಸುರಕ್ಷಿತ ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
    sign_in_btn: "ಖಚಿತಪಡಿಸಿ ಮತ್ತು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ",
    saved_bookmarks: "ಉಳಿಸಿದ ಬುಕ್‌ಮಾರ್ಕ್ ಭೂಮಿಗಳು",
    registered_inquiries: "ನನ್ನ ನೋಂದಾಯಿತ ವಿಚಾರಣೆಗಳು",
    no_inquiries: "ಯಾವುದೇ ಸಕ್ರಿಯ ವಿಚಾರಣೆಗಳು ಇದುವರೆಗೆ ನೋಂದಣಿಯಾಗಿಲ್ಲ.",
    land_inquiry_form: "ಭೂ ನೋಂದಣಿ ವಿಚಾರಣಾ ಕೇಂದ್ರ",
    close: "ಮುಚ್ಚಿ",
    message_agent: "ಅಧಿಕೃತ ಸಂದೇಶ",
    submit_inquiry_btn: "ಅಧಿಕೃತ ವಿಚಾರಣೆಯನ್ನು ಸಲ್ಲಿಸಿ",
    submit_offer_btn: "ಖರೀದಿ ಆಫರ್ ಸಲ್ಲಿಸಿ"
  },
  PA: {
    gov_of_india: "ਭਾਰਤ ਸਰਕਾਰ",
    satellite_core: "ਜੀਆਈਐਸ ਸੈਟੇਲਾਈਟ ਕੋਰ V4",
    national_registry: "ਰਾਸ਼ਟਰੀ ਭੂਮੀ ਰਜਿਸਟਰੀ",
    official_node: "ਅਧਿਕਾਰਤ ਨੋਡ",
    cadastral_register: "ਕੈਡਸਟ੍ਰਲ ਜੀਆਈਐਸ ਰਜਿਸਟਰ",
    sign_in_inquire: "ਪੁੱਛਗਿੱਛ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ",
    sign_out: "ਸਾਈਨ ਆਊਟ",
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    guest_view: "ਪਬਲਿਕ ਪੋਰਟਲ ਮੋਡ: ਤੁਸੀਂ ਮਹਿਮਾਨ ਵਜੋਂ ਬ੍ਰਾਊਜ਼ ਕਰ ਰਹੇ ਹੋ। ਖਰੀਦ ਪ੍ਰਸਤਾਵ ਜਮ੍ਹਾਂ ਕਰਨ ਜਾਂ ਪ੍ਰਮਾਣਿਤ ਸਰਕਾਰੀ ਅਧਿਕਾਰੀਆਂ ਨਾਲ ਗੱਲ ਕਰਨ ਲਈ ਲੌਗਇਨ ਕਰੋ।",
    access_desk: "ਸੁਰੱਖਿਅਤ ਡੈਸਕ ਖੋਲ੍ਹੋ",
    
    // Stats
    total_area: "ਕੁੱਲ ਮੈਪ ਕੀਤਾ ਗਿਆ ਰਕਬਾ",
    security: "ਪ੍ਰਭੂਸੱਤਾ ਸੁਰੱਖਿਆ",
    tamperproof: "100% ਸੁਰੱਖਿਅਤ ਡੇਟਾ ਸੀਲ",
    active_hubs: "ਸਰਗਰਮ ਜਿਲ੍ਹਾ ਕੇਂਦਰ",
    verified_by_reg: "ਭੂਮੀ ਰਜਿਸਟਰੀ ਦੁਆਰਾ ਪ੍ਰਮਾਣਿਤ",
    metric_ref: "ਮੀਟ੍ਰਿਕ ਪਰਿਵਰਤਨ ਹਵਾਲਾ",

    // Search and Filters
    search_parcels: "ਪਲਾਟ ਜਾਂ ਖਸਰਾ ਨੰਬਰ ਲੱਭੋ",
    placeholder_search: "ਜਿਵੇਂ: ਖੇਤ, ਨਹਿਰ, ਹਾਈਵੇਅ, ਪੁਣੇ, ਲੁਧਿਆਣਾ...",
    filter_district: "ਜਿਲ੍ਹੇ ਦੇ ਅਨੁਸਾਰ ਫਿਲਟਰ",
    all_districts: "ਸਾਰੇ ਜਿਲ੍ਹੇ (ਪੰਜਾਬ / ਬੇਂਗਲੁਰੂ / ਰਾਜਸਥਾਨ / ਪੁਣੇ / ਨਾਸਿਕ)",
    zoning_category: "ਜ਼ੋਨਿੰਗ ਨਿਰਦੇਸ਼ ਸ਼੍ਰੇਣੀ",
    all_categories: "ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ",
    max_val: "ਵੱਧ ਤੋਂ ਵੱਧ ਰਜਿਸਟਰੀ ਰਾਖਵੀਂ ਕੀਮਤ",
    only_starred: "ਸਿਰਫ਼ ਸੁਰੱਖਿਅਤ ਕੀਤੇ ਪਲਾਟ ਦੇਖੋ",
    active_listings: "ਸਰਗਰਮ ਭੂਮੀ ਰਜਿਸਟਰੀਆਂ",
    results_found: "ਪਲਾਟ ਇਸ ਜਿਲ੍ਹੇ ਵਿੱਚ ਰਜਿਸਟਰਡ ਹਨ",
    no_results: "ਤੁਹਾਡੇ ਫਿਲਟਰ ਮੁਤਾਬਕ ਕੋਈ ਜ਼ਮੀਨ ਨਹੀਂ ਮਿਲੀ।",
    reset_filter: "ਫਿਲਟਰ ਰੀਸੈਟ ਕਰੋ",

    // Map
    map_boundary: "ਕੈਡਸਟ੍ਰਲ ਸੀਮਾ ਨਕਸ਼ਾ",
    zoning_mode: "ਜ਼ੋਨਿੰਗ ਨਕਸ਼ਾ ਮੋਡ",
    satellite_mode: "ਸੈਟੇਲਾਈਟ ਦ੍ਰਿਸ਼",
    measure_area: "ਰਕਬਾ ਮਾਪੋ",
    measuring_active: "ਬਿੰਦੂ ਲਗਾਉਣ ਲਈ ਨਕਸ਼ੇ 'ਤੇ ਕਲਿੱਕ ਕਰੋ",
    finish: "ਮੁਕੰਮਲ",
    cancel: "ਰੱਦ ਕਰੋ",
    measured_result: "ਮਾਪਿਆ ਹੋਇਆ ਰਕਬਾ:",
    interactive_inspector: "ਇੰਟਰਐਕਟਿਵ ਪਲਾਟ ਸੀਮਾ ਇੰਸਪੈਕਟਰ",
    no_parcel_selected: "ਕੋਈ ਪਲਾਟ ਚੁਣਿਆ ਨਹੀਂ ਗਿਆ। ਜਾਣਕਾਰੀ ਲਈ ਉੱਪਰ ਨਕਸ਼ੇ 'ਤੇ ਕਲਿੱਕ ਕਰੋ।",
    verified_title: "ਪ੍ਰਮਾਣਿਤ ਮਾਲਕੀ",
    price_reserved: "ਰਾਖਵੀਂ ਸਰਕਾਰੀ ਕੀਮਤ",
    inquire_submit: "ਪੁੱਛਗਿੱਛ ਅਤੇ ਖਰੀਦ ਪ੍ਰਸਤਾਵ ਭੇਜੋ",
    per_acre: "ਪ੍ਰਤੀ ਏਕੜ",

    // Intelligent zoning and due diligence
    zoning_desk: "ਜ਼ੋਨਿੰਗ ਅਤੇ ਜ਼ਮੀਨ ਵਰਤੋਂ ਸੂਚਨਾ ਡੈਸਕ",
    zoning_description: "ਜ਼ੋਨਿੰਗ ਨਿਯਮ ਇਮਾਰਤਾਂ ਦੀ ਸੀਮਾ, ਉਚਾਈ ਅਤੇ ਵਿਕਾਸ ਨਿਯਮਾਂ ਨੂੰ ਤੈਅ ਕਰਦੇ ਹਨ। ਨਿਯਮ ਜਾਣਨ ਲਈ ਇੱਕ ਕੋਡ ਚੁਣੋ:",
    notice: "ਸੂਚਨਾ: ਇਮਾਰਤੀ ਨਿਯਮ ਬਦਲ ਸਕਦੇ ਹਨ। ਕਿਸੇ ਵੀ ਲੈਣ-ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਹਮੇਸ਼ਾ ਨਗਰ ਨਿਗਮ ਦੇ ਨਿਯਮਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।",
    due_diligence: "ਉਚਿਤ ਨਿਰੀਖਣ ਆਡਿਟ",
    diligence_subtitle: "ਜ਼ਮੀਨ ਦੀ ਕੀਮਤ ਵਾਤਾਵਰਣ 'ਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ। ਆਡਿਟ ਦੌਰਾਨ ਇਹਨਾਂ ਗੱਲਾਂ ਦੀ ਪੜਤਾਲ ਕਰੋ:",
    verified_status: "ਪ੍ਰਮਾਣਿਤ",

    // Auth & Forms
    access_portal_header: "ਪ੍ਰਮਾਣਿਤ ਪੋਰਟਲ ਐਕਸੈਸ ਗੇਟਵੇ",
    role_investor: "ਭੂਮੀ ਖਰੀਦਦਾਰ / ਨਿਵੇਸ਼ਕ",
    role_agent: "ਅਧਿਕਾਰਤ ਉਪ-ਰਜਿਸਟਰਾਰ ਅਧਿਕਾਰੀ / ਏਜੰਟ",
    login_prompt: "ਸੁਰੱਖਿਅਤ ਲੋਗਿਨ ਲਈ ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ ਅਤੇ ਵੇਰਵੇ ਭਰੋ।",
    full_name: "ਪੂਰਾ ਕਾਨੂੰਨੀ ਨਾਮ",
    email_addr: "ਰਜਿਸਟਰਡ ਈਮੇਲ",
    tele_no: "ਸੁਰੱਖਿਅਤ ਫ਼ੋਨ ਨੰਬਰ",
    sign_in_btn: "ਵੇਰਵੇ ਪ੍ਰਮਾਣਿਤ ਕਰੋ ਅਤੇ ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ",
    saved_bookmarks: "ਸੁਰੱਖਿਅਤ ਕੀਤੇ ਬੁੱਕਮਾਰਕ ਪਲਾਟ",
    registered_inquiries: "ਮੇਰੀਆਂ ਰਜਿਸਟਰਡ ਪੁੱਛਗਿੱਛਾਂ",
    no_inquiries: "ਹਾਲੇ ਤੱਕ ਕੋਈ ਸਰਗਰਮ ਪੁੱਛਗਿੱਛ ਦਰਜ ਨਹੀਂ ਹੋਈ।",
    land_inquiry_form: "ਭੂਮੀ ਰਜਿਸਟਰੀ ਪੁੱਛਗਿੱਛ ਕੇਂਦਰ",
    close: "ਬੰਦ ਕਰੋ",
    message_agent: "ਅਧਿਕਾਰਤ ਸੁਨੇਹਾ",
    submit_inquiry_btn: "ਅਧਿਕਾਰਤ ਪੁੱਛਗਿੱਛ ਭੇਜੋ",
    submit_offer_btn: "ਖਰੀਦ ਪ੍ਰਸਤਾਵ ਜਮ੍ਹਾਂ ਕਰੋ"
  },
  ML: {
    gov_of_india: "ഭാരത സർക്കാർ",
    satellite_core: "GIS ഉപഗ്രഹ കോർ V4",
    national_registry: "ദേശീയ ഭൂമി രജിസ്ട്രി",
    official_node: "ഔദ്യോഗിക നോഡ്",
    cadastral_register: "ഭൂ അതിർത്തി രജിസ്റ്റർ",
    sign_in_inquire: "അന്വേഷണങ്ങൾക്കായി ലോഗിൻ ചെയ്യുക",
    sign_out: "ലോഗ് ഔട്ട്",
    welcome: "സ്വാഗതം",
    guest_view: "പൊതു പോർട്ടൽ മോഡ്: നിങ്ങൾ സന്ദർശകനായി വിവരങ്ങൾ കാണുന്നു. ഔദ്യോഗിക ഓഫറുകൾ സമർപ്പിക്കുന്നതിനും ഉദ്യോഗസ്ഥരുമായി ബന്ധപ്പെടുന്നതിനും ലോഗിൻ ചെയ്യുക.",
    access_desk: "സുരക്ഷിത ഡെസ്ക് തുറക്കുക",
    
    // Stats
    total_area: "ആകെ മാപ്പ് ചെയ്ത പ്രദേശം",
    security: "പരമാധികാര സുരക്ഷ",
    tamperproof: "100% സുരക്ഷിത ഡാറ്റാ സീലുകൾ",
    active_hubs: "സജീവ ജില്ലാ കേന്ദ്രങ്ങൾ",
    verified_by_reg: "ഭൂമി രജിസ്ട്രി സാക്ഷ്യപ്പെടുത്തിയത്",
    metric_ref: "മെട്രിക് പരിവർത്തന സൂചിക",

    // Search and Filters
    search_parcels: "ഭൂമി പ്ലോട്ടുകൾ തിരയുക",
    placeholder_search: "ഉദാ. കൃഷിസ്ഥലം, കനാൽ, ഹൈവേ, പൂനെ, ലുധിയാന...",
    filter_district: "ജില്ല തിരിച്ച് തിരയുക",
    all_districts: "എല്ലാ ജില്ലകളും (പഞ്ചാബ് / ബംഗളൂരു / രാജസ്ഥാൻ / പൂനെ / നാസിക്)",
    zoning_category: "സോണിംഗ് നിർദ്ദേശ മേഖല",
    all_categories: "എല്ലാ വിഭാഗങ്ങളും",
    max_val: "പരമാവധി സർക്കാർ നിശ്ചയിച്ച വില",
    only_starred: "സേവ് ചെയ്ത പ്ലോട്ടുകൾ മാത്രം കാണിക്കുക",
    active_listings: "സജീവ ഭൂമി രജിസ്ട്രികൾ",
    results_found: "പ്ലോട്ടുകൾ സജീവമായി രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്",
    no_results: "നിങ്ങൾ തിരഞ്ഞ ഫിൽറ്ററിൽ വിവരങ്ങൾ ഒന്നും ലഭ്യമല്ല.",
    reset_filter: "തിരച്ചിൽ ഫിൽറ്ററുകൾ റീസെറ്റ് ചെയ്യുക",

    // Map
    map_boundary: "ഭൂ അതിർത്തി മാപ്പ്",
    zoning_mode: "സോണിംഗ് മാപ്പ് മോഡ്",
    satellite_mode: "ഉപഗ്രഹ ദൃശ്യം",
    measure_area: "സ്ഥലം അളക്കുക",
    measuring_active: "ബിന്ദുക്കൾ അടയാളപ്പെടുത്താൻ മാപ്പിൽ ക്ലിക്ക് ചെയ്യുക",
    finish: "പൂർത്തിയാക്കുക",
    cancel: "റദ്ദാക്കുക",
    measured_result: "അളന്ന പ്ലോട്ട് വിസ്തീർണ്ണം:",
    interactive_inspector: "ഭൂ അതിർത്തി ഇൻസ്പെക്ടർ",
    no_parcel_selected: "GIS പ്ലോട്ട് തിരഞ്ഞെടുത്തിട്ടില്ല. മുകളിലെ മാപ്പിൽ ക്ലിക്ക് ചെയ്ത് തത്സമയ വിവരങ്ങൾ കാണുക.",
    verified_title: "സാക്ഷ്യപ്പെടുത്തിയ പ്രമാണം",
    price_reserved: "സർക്കാർ നിശ്ചയിച്ച വില",
    inquire_submit: "അന്വേഷണങ്ങളും ഓഫറുകളും സമർപ്പിക്കുക",
    per_acre: "ഒരു ഏക്കറിന്",

    // Intelligent zoning and due diligence
    zoning_desk: "സോണിംഗ് & ഭൂവിനിയോഗ വിവര കേന്ദ്രം",
    zoning_description: "സോണിംഗ് നിയമങ്ങൾ വികസന പരിധികളും നിയമങ്ങളും നിശ്ചയിക്കുന്നു. വിവരങ്ങൾക്കായി താഴെ ഒരു കോഡ് തിരഞ്ഞെടുക്കുക:",
    category_standards: "വിഭാഗം മാനദണ്ഡങ്ങൾ:",
    setbacks_required: "ആവശ്യമായ അകലം",
    max_height_reach: "പരമാവധി ഉയരം",
    permitted_uses: "അനുവദനീയമായ ഉപയോഗങ്ങൾ",
    notice: "അറിയിപ്പ്: നിർമ്മാണ നിയമങ്ങൾ മാറിയേക്കാം. ഇടപാടുകൾ നടത്തുന്നതിന് മുൻപ് മുൻസിപ്പൽ നിയമങ്ങൾ പരിശോധിക്കുക.",
    due_diligence: "യഥാർത്ഥ പരിശോധനാ ഓഡിറ്റ്",
    diligence_subtitle: "ഭൂമിയുടെ മൂല്യം പൂർണ്ണമായും പരിസ്ഥിതിയെ ആശ്രയിച്ചിരിക്കുന്നു. പരിശോധന വേളയിൽ ഇവ ഉറപ്പാക്കുക:",
    verified_status: "സാക്ഷ്യപ്പെടുത്തിയത്",

    // Auth & Forms
    access_portal_header: "സാക്ഷ്യപ്പെടുത്തിയ പോർട്ടൽ പ്രവേശന കവാടം",
    role_investor: "ഭൂമി വാങ്ങുന്നയാൾ / നിക്ഷേപകൻ",
    role_agent: "അധികാരപ്പെടുത്തിയ സബ് രജിസ്ട്രാർ ഓഫീസർ / ഏജന്റ്",
    login_prompt: "സുരക്ഷിതമായി ലോഗിൻ ചെയ്യുന്നതിന് റോൾ തിരഞ്ഞെടുത്ത് വിവരങ്ങൾ നൽകുക.",
    full_name: "മുഴുവൻ നിയമപരമായ പേര്",
    email_addr: "രജിസ്റ്റർ ചെയ്ത ഇമെയിൽ",
    tele_no: "സുരക്ഷിത ഫോൺ നമ്പർ",
    sign_in_btn: "വിവരങ്ങൾ സാക്ഷ്യപ്പെടുത്തി ഡാഷ്ബോർഡ് തുറക്കുക",
    saved_bookmarks: "സേവ് ചെയ്ത പ്ലോട്ടുകൾ",
    registered_inquiries: "എന്റെ അന്വേഷണങ്ങൾ",
    no_inquiries: "സജീവ അന്വേഷണങ്ങൾ ഒന്നും ഇതുവരെ രജിസ്റ്റർ ചെയ്തിട്ടില്ല.",
    land_inquiry_form: "ഭൂമി രജിസ്ട്രി ഔദ്യോഗിക അന്വേഷണ കേന്ദ്രം",
    close: "അടയ്ക്കുക",
    message_agent: "ഔദ്യോഗിക സന്ദേശം",
    submit_inquiry_btn: "അന്വേഷണം സമർപ്പിക്കുക",
    submit_offer_btn: "വാങ്ങൽ ഓഫർ സമർപ്പിക്കുക"
  }
};

// --- DYNAMIC DICTIONARY FOR PROPERTIES AND RULES ---
const DYNAMIC_DICTIONARY: Record<string, Record<string, string>> = {
  // 1. Property Titles
  "Punjab Golden Silt Farm Tract": {
    EN: "Punjab Golden Silt Farm Tract",
    HI: "पंजाब स्वर्ण जलोढ़ कृषि क्षेत्र",
    BN: "পাঞ্জাব সোনালী পলি খামার ট্র্যাক্ট",
    TE: "పంజాబ్ గోల్డেন సిల్ట్ ఫార్మ్ ట్రాక్ట్",
    MR: "पंजाब सुवर्ण गाळ शेत जमीन",
    TA: "பஞ்சாப் தங்க வண்டல் பண்ணை நிலம்",
    GU: "પંજાબ ગોલ્ડન સિલ્ટ ફાર્મ ટ્રેક્ટ",
    KN: "ಪಂಜಾಬ್ ಗೋಲ್ಡನ್ ಸಿಲ್ಟ್ ಫಾರ್ಮ್ ಪ್ಲಾಟ್",
    PA: "ਪੰਜਾਬ ਸੁਨਹਿਰੀ ਜਲੌਢ ਖੇਤੀਬਾੜੀ ਰਕਬਾ",
    ML: "പഞ്ചാബ് ഗോൾഡൻ സിൽറ്റ് ഫാം വിസ്തൃതി"
  },
  "Bengaluru Cyber-Belt Special Sector": {
    EN: "Bengaluru Cyber-Belt Special Sector",
    HI: "बेंगलुरु साइबर-बेल्ट विशेष क्षेत्र",
    BN: "ব্যাঙ্গালোর সাইবার-বেল্ট বিশেষ সেকশন",
    TE: "బెంగళూరు సైబర్-బెల్ట్ ప్రత్యేక రంగం",
    MR: "बेंगळुरू सायबर-बेल्ट विशेष क्षेत्र",
    TA: "பெங்களூரு சைபர்-பெல்ட் சிறப்பு மண்டலம்",
    GU: "બેંગલુરુ સાયબર-બેલ્ટ વિશેષ સેક્ટર",
    KN: "ಬೆಂಗಳೂರು ಸೈಬರ್-ಬೆಲ್ಟ್ ವಿಶೇಷ ವಲಯ",
    PA: "ਬੈਂਗਲੁਰੂ ਸਾਈਬਰ-ਬੇਲਟ ਵਿਸ਼ੇਸ਼ ਸੈਕਟਰ",
    ML: "ബെംഗളൂരു സൈബർ ബെൽറ്റ് പ്രത്യേക മേഖല"
  },
  "Rajasthan Arid Wind-Energy Corridor": {
    EN: "Rajasthan Arid Wind-Energy Corridor",
    HI: "राजस्थान शुष्क पवन-ऊर्जा कॉरिडोर",
    BN: "রাজস্থান শুষ্ক বায়ু শক্তি করিডোর",
    TE: "రాజస్థాన్ ఎడారి పవన శక్తి కారిడార్",
    MR: "राजस्थान शुष्क पवन-ऊर्जा कॉरिडोअर",
    TA: "ராஜஸ்தான் வறண்ட காற்று-சக்தி வழித்தடம்",
    GU: "રાજસ્થાન શુષ્ક પવન-ઉર્જા કોરિડોર",
    KN: "ರಾಜಸ್ಥಾನ ಶುಷ್ಕ ಪವನ ಶಕ್ತಿ ಕಾರಿಡಾರ್",
    PA: "ਰਾਜਸਥਾਨ ਖੁਸ਼ਕ ਪਵਨ-ਊਰਜਾ ਕੋਰੀਡੋਰ",
    ML: "രാജസ്ഥാൻ വരണ്ട കാറ്റാടി ഊർജ്ജ പാത"
  },
  "Pune Hills Eco-Retreat Ridge": {
    EN: "Pune Hills Eco-Retreat Ridge",
    HI: "पुणे हिल्स इको-रिट्रीट रिज",
    BN: "পুনে পাহাড় ইക്കോ-রিট্রিট রিজ",
    TE: "పూణే హిల్స్ ఎకో-రిట్రీట్ రిడ్జ్",
    MR: "पुणे हिल्स इको-रिट्रीट कडा",
    TA: "புனே மலைகள் சுற்றுச்சூழல் சுற்றுலா ரிட்ജ്",
    GU: "પુણે હિલ્સ ઇકો-રિટ્રીટ રિજ",
    KN: "ಪುಣೆ ಹಿಲ್ಸ್ ಇಕೋ-ರಿಟ್ರೀಟ್ ಪ್ಲಾಟ್",
    PA: "ਪੁਣੇ ਹਿਲਜ਼ ਈਕੋ-ਰੀਟ੍ਰੀਟ ਰਿਜ",
    ML: "പൂനെ ഹിൽസ് ഇക്കോ റിട്രീറ്റ് പ്രദേശം"
  },
  "Nashik Valley Vineyard Acreage": {
    EN: "Nashik Valley Vineyard Acreage",
    HI: "नासिक घाटी वाइनयार्ड क्षेत्र",
    BN: "নাশিক উপত্যকা আঙ্গুর ক্ষেত একর",
    TE: "నాసిక్ వ్యాలీ ద్రాక్ష తోటల విస్తీర్ണം",
    MR: "नाशिक खोरे द्राक्षबाग जमीन",
    TA: "நாசிக் பள்ளத்தாக்கு திராட்சைத் தோட்டம்",
    GU: "નાસિક ખીણ દ્રાક્ષની વાડી જમીન",
    KN: "ನಾಸಿಕ್ ವ್ಯಾಲಿ ದ್ರಾಕ್ಷಿ ತೋಟದ ಪ್ರದೇಶ",
    PA: "ਨਾਸਿਕ ਘਾਟੀ ਅੰਗੂਰਾਂ ਦੇ ਬਾਗ਼ ਦਾ ਰਕਬਾ",
    ML: "നാസിക് താഴ്‌വര മുന്തിരിത്തോട്ട വിസ്തൃതി"
  },

  // 2. Locations
  "Punjab": {
    EN: "Punjab", HI: "पंजाब", BN: "পাঞ্জাব", TE: "పంజాబ్", MR: "पंजाब", TA: "பஞ்சாப்", GU: "પંજાબ", KN: "ಪಂಜಾಬ್", PA: "ਪੰਜਾਬ", ML: "പഞ്ചാബ്"
  },
  "Bengaluru": {
    EN: "Bengaluru", HI: "बेंगलुरु", BN: "ব্যাঙ্গালোর", TE: "బెంగళూరు", MR: "बेंगळुरू", TA: "பெங்களூரு", GU: "બેંગલુરુ", KN: "ಬೆಂಗಳೂರು", PA: "ਬੈਂਗਲੁਰੂ", ML: "ബെംഗളൂരു"
  },
  "Jaisalmer": {
    EN: "Jaisalmer", HI: "जैसलमेर", BN: "জয়সলমের", TE: "జైసల్మేర్", MR: "जैसलमेर", TA: "ஜெய்சல்மேர்", GU: "જેસલમેર", KN: "ಜೈಸಲ್ಮೇರ್", PA: "ਜੈਸਲਮੇਰ", ML: "ജയ്സാൽമീർ"
  },
  "Pune": {
    EN: "Pune", HI: "पुणे", BN: "পুনে", TE: "పూణే", MR: "पुणे", TA: "புனே", GU: "પુણે", KN: "ಪುಣೆ", PA: "ਪੁਣੇ", ML: "പൂനെ"
  },
  "Maharashtra": {
    EN: "Maharashtra", HI: "महाराष्ट्र", BN: "মহারাষ্ট্র", TE: "మహారాష్ట్ర", MR: "महाराष्ट्र", TA: "மகாராஷ்டிரா", GU: "મહારાષ્ટ્ર", KN: "ಮಹಾರಾಷ್ಟ್ರ", PA: "ਮਹਾਰਾਸ਼ਟਰ", ML: "മഹാരാഷ്ട്ര"
  },
  "Ludhiana Plains, Punjab": {
    EN: "Ludhiana Plains, Punjab",
    HI: "लुधियाना मैदान, पंजाब",
    BN: "লুধিয়ানা সমভূমি, পাঞ্জাব",
    TE: "లూథియానా మైదానాలు, పంజాబ్",
    MR: "लुधियाना मैदान, पंजाब",
    TA: "லுதியானா சமவெளி, பஞ்சாப்",
    GU: "લુધિયાણા મેદાન, પંજાબ",
    KN: "ಲುಧಿಯಾನ ಮೈದಾನ, ಪಂಜಾಬ್",
    PA: "ਲੁਧਿਆਣਾ ਮੈਦਾਨ, ਪੰਜਾਬ",
    ML: "ലുധിയാന സമതലം, പഞ്ചാബ്"
  },
  "Outer Whitefield, Bengaluru": {
    EN: "Outer Whitefield, Bengaluru",
    HI: "आउटर व्हाइटफील्ड, बेंगलुरु",
    BN: "আউটার হোয়াইটফিল্ড, ব্যাঙ্গালোর",
    TE: "ఔటర్ వైట్‌ఫీల్డ్, బెంగళూరు",
    MR: "आउटर व्हाईटफिल्ड, बेंगळुरू",
    TA: "வெளிப்புற ஒயிட்பீல்ட், பெங்களூரு",
    GU: "આઉટર વ્હાઇટફિલ્ડ, બેંગલુરુ",
    KN: "ಔಟರ್ ವೈಟ್‌ಫೀಲ್ಡ್, ಬೆಂಗಳೂರು",
    PA: "ਆਊਟਰ ਵ੍ਹਾਈਟਫੀਲਡ, ਬੈਂਗਲੁਰੂ",
    ML: "ഔട്ടർ വൈറ്റ്ഫീൽഡ്, ബെംഗളൂരു"
  },
  "Pokhran Slopes, Jaisalmer": {
    EN: "Pokhran Slopes, Jaisalmer",
    HI: "पोखरण ढलान, जैसलमेर",
    BN: "পোখরান ঢাল, জয়সলমের",
    TE: "పోఖ్రాన్ వాలులు, జైసల్మేర్",
    MR: "पोखरण उतार, जैसलमेर",
    TA: "பொக்ரான் சரிவுகள், ஜெய்சல்மேர்",
    GU: "પોખરણ ઢોળાવ, જેસલમેર",
    KN: "ಪೋಖ್ರಾನ್ ಪ್ರಸ್ಥಭೂಮಿ, ಜೈಸಲ್ಮೇರ್",
    PA: "ਪੋਖਰਨ ਢਲਾਣਾਂ, ਜੈਸਲਮੇਰ",
    ML: "പൊഖ്റാൻ താഴ്‌വര, ജയ്സാൽമീർ"
  },
  "Lonavala Slopes, Pune": {
    EN: "Lonavala Slopes, Pune",
    HI: "लोनावला ढलान, पुणे",
    BN: "লোনাভালা ঢাল, পুনে",
    TE: "లోనావాలా వాలులు, పూణే",
    MR: "लोणावळा उतार, पुणे",
    TA: "லோனாவாலா சரிவுகள், புனே",
    GU: "લોનાવાલા ઢોળાવ, પુણે",
    KN: "ಲೋನಾವಾಲಾ ಇಳಿಜಾರು, ಪುಣೆ",
    PA: "ਲੋਨਾਵਾਲਾ ਢਲਾਣਾਂ, ਪੁਣੇ",
    ML: "ലോണാവാലാ ചരിവുകൾ, പൂനെ"
  },
  "Nashik Hills, Maharashtra": {
    EN: "Nashik Hills, Maharashtra",
    HI: "नासिक हिल्स, महाराष्ट्र",
    BN: "নাশিক পাহাড়, महाराष्ट्र",
    TE: "నాసిక్ కొండలు, మహారాష్ట్ర",
    MR: "नाशिक टेकड्या, महाराष्ट्र",
    TA: "நாசிக் மலைகள், மகாராஷ்டிரா",
    GU: "નાસિક હિલ્સ, મહારાષ્ટ્ર",
    KN: "ನಾಸಿಕ್ ಬೆಟ್ಟಗಳು, ಮಹಾರಾಷ್ಟ್ರ",
    PA: "ਨਾਸਿਕ ਪਹਾੜੀਆਂ, ਮਹਾਰਾਸ਼ਟਰ",
    ML: "നാസിക് കുന്നുകൾ, മഹാരാഷ്ട്ര"
  },

  // 3. District Counties
  "Ludhiana District": {
    EN: "Ludhiana District", HI: "लुधियाना जिला", BN: "লুধিয়ানা জেলা", TE: "లూథియానా జిల్లా", MR: "लुधियाना जिल्हा", TA: "லுதியானா மாவட்டம்", GU: "લુધિયાણા જિલ્લો", KN: "ಲುಧಿಯಾನ ಜಿಲ್ಲೆ", PA: "ਲੁਧਿਆਣਾ ਜਿਲ੍ਹਾ", ML: "ലുധിയാന ജില്ല"
  },
  "Bengaluru District": {
    EN: "Bengaluru District", HI: "बेंगलुरु जिला", BN: "ব্যাঙ্গালोर জেলা", TE: "బెంగళూరు జిల్లా", MR: "बेंगळुरू जिल्हा", TA: "பெங்களூரு மாவட்டம்", GU: "બેંગલુરુ જિલ્લો", KN: "ಬೆಂಗಳೂರು ಜಿಲ್ಲೆ", PA: "ਬੈਂਗਲੁਰੂ ਜਿਲ੍ਹਾ", ML: "ബെംഗളൂരു ജില്ല"
  },
  "Jaisalmer District": {
    EN: "Jaisalmer District", HI: "जैसलमेर जिला", BN: "জয়সলমের জেলা", TE: "జైసల్మేర్ జిల్లా", MR: "जैसलमेर जिल्हा", TA: "ஜெய்சல்மேர் மாவட்டம்", GU: "જેસલમેર જિલ્લો", KN: "ಜೈಸಲ್ಮೇರ್ ಜಿಲ್ಲೆ", PA: "ਜੈਸਲਮੇਰ ਜਿਲ੍ਹਾ", ML: "ജയ്സാൽമീർ ജില്ല"
  },
  "Pune District": {
    EN: "Pune District", HI: "पुणे जिला", BN: "পুনে জেলা", TE: "పూణే జిల్లా", MR: "पुणे जिल्हा", TA: "புனே மாவட்டம்", GU: "પુણે જિલ્લો", KN: "ಪುಣೆ ಜಿಲ್ಲೆ", PA: "ਪੁਣੇ ਜਿਲ੍ਹਾ", ML: "പൂനെ ജില്ല"
  },
  "Nashik District": {
    EN: "Nashik District", HI: "नासिक जिला", BN: "নাশিক জেলা", TE: "నాసిക് జిల్లా", MR: "नाशिक जिल्हा", TA: "நாசிக் மாவட்டம்", GU: "નાસિક જિલ્લો", KN: "ನಾಸಿക് ಜಿಲ್ಲೆ", PA: "ਨਾਸਿਕ ਜਿਲ੍ਹਾ", ML: "നാസിക് ജില്ല"
  },

  // 4. Infrastructure Features
  "Submersible pump with deep aquifer sweetwater": {
    EN: "Submersible pump with deep aquifer sweetwater",
    HI: "गहरे जलभृत मीठे पानी के साथ सबमर्सिबल पंप",
    BN: "গভীর মিষ্টি জলের সাবমার্সিবল পাম্প",
    TE: "తీపి నీటి సబ్‌మెర్సిబుల్ పంపు",
    MR: "गोड पाण्याचा सबमर्सिबल पंप",
    TA: "ஆழ்குழாய் கிணறு நீர் மின்சார பம்ப்",
    GU: "મીઠા પાણીનો સબમર્સિબલ પંપ",
    KN: "ಶುದ್ಧ ನೀರಿನ ಸಬ್‌ಮರ್ಸಿಬಲ್ ಪಂಪ್",
    PA: "ਮਿੱਠੇ ਪਾਣੀ ਦੀ ਸਬਮਰਸੀਬਲ ਮੋਟਰ",
    ML: "ശുദ്ധജല സബ്മേഴ്സിബിൾ പമ്പ്"
  },
  "Dual borewells with overhead storage tank": {
    EN: "Dual borewells with overhead storage tank",
    HI: "ओवरहेड वाटर स्टोरेज टैंक के साथ दोहरे बोरवेल",
    BN: "ওভারহেড স্টোরেজ ট্যাঙ্ক সহ ডাবল বোরওয়েল",
    TE: "ఓవర్‌హెడ్ స్టోరేజ్ ట్యాంక్‌తో డ్యూయల్ బోరుబావులు",
    MR: "वरच्या पाण्याच्या टाकीसह दोन कूपनलिका",
    TA: "மேல்நிலை நீர்த்தேக்கத் தொட்டியுடன் இரட்டை ஆழ்துளைக் கிணறுகள்",
    GU: "ઓવરહેડ પાણીની ટાંકી સાથે બે બોરવેલ",
    KN: "ನೀರಿನ ಟ್ಯಾಂಕ್ ಮತ್ತು ಎರಡು ಕೊಳವೆ ಬಾವಿಗಳು",
    PA: "ਪਾਣੀ ਦੀ ਟੈਂਕੀ ਦੇ ਨਾਲ ਦੋਹਰੇ ਬੋਰਵੈੱਲ",
    ML: "ഹെഡ്ഡ് വാട്ടർ ടാങ്കും ഇരട്ട ബോർവെല്ലുകളും"
  },
  "Borewell with high-saline solar pump": {
    EN: "Borewell with high-saline solar pump",
    HI: "उच्च खारेपन के पानी के साथ सौर बोरवेल पंप",
    BN: "সোলার ওয়াটার পাম্প সহ বোরওয়েল",
    TE: "సౌర విద్యుత్ బోరుబావి పంపు",
    MR: "सौर कूपनलिका पंप संच",
    TA: "சூரிய மின்சக்தி ஆழ்துளைக் கிணறு പമ്പ്",
    GU: "સોલાર વોટર પંપ વાળો બોરવેલ",
    KN: "ಸೌರ ವಿದ್ಯುತ್ ಕೊಳವೆ ಬಾವಿ ಪಂಪ್",
    PA: "ਸੋਲਰ ਪੈਨਲ ਨਾਲ ਲੈਸ ਟਿਊਬਵੈੱਲ",
    ML: "സോളാർ പമ്പ് ഘടിപ്പിച്ച ബോർവെൽ"
  },
  "Natural mountain spring and rainwater harvesting": {
    EN: "Natural mountain spring and rainwater harvesting",
    HI: "प्राकृतिक पहाड़ी झरना और वर्षा जल संचयन",
    BN: "প্রাকৃতিক পাহাড়ি ঝর্ণা ও বৃষ্টির জল সংরক্ষণ",
    TE: "సహజ పర్వత ঝరనా & వర్షపు నీటి సాగు",
    MR: "नैसर्गिक पर्वतीय झरा आणि पावसाचे पाणी साठवण",
    TA: "இயற்கை மலை நீர் மற்றும் மழைநீர் சேகரிப்பு",
    GU: "કુદરતી પહાડી ઝરણું અને વરસાદી પાણીનો સંગ્રહ",
    KN: "ನೈಸರ್ಗಿಕ ಬೆಟ್ಟದ ತೊರೆ ಮತ್ತು ಮಳೆನೀರು ಕೊಯ್ಲು",
    PA: "ਕੁਦਰਤੀ ਚਸ਼ਮਾ ਅਤੇ ਮੀਂਹ ਦੇ ਪਾਣੀ ਦੀ ਸੰਭਾਲ",
    ML: "സ്വാഭാവിക ഉറവയും മഴവെള്ള സംഭരണിയും"
  },
  "High pressure groundwater and canal allocation": {
    EN: "High pressure groundwater and canal allocation",
    HI: "उच्च दबाव का भूजल और आधिकारिक नहर जलापूर्ति",
    BN: "উচ্চ চাপের ভূগর্ভস্থ জল এবং খালের জল সরবরাহ",
    TE: "భూగర్భ జలాలు మరియు కాలువ నీటి సరఫరా",
    MR: "उच्च दाबाचे भूजल आणि कालवा पाणी वाटप",
    TA: "நிலத்தடி நீர் மற்றும் கால்வாய் நீர் விநியோகம்",
    GU: "ભૂગર્ભ જળ અને નહેર પાણીની ફાળવણી",
    KN: "ಅಂತರ್ಜಲ ಹಾಗೂ ನಾಲಾ ಜಲ ಸಂಪರ್ಕ",
    PA: "ਉੱਚ ਦਬਾਅ ਵਾਲਾ ਜ਼ਮੀਨੀ ਪਾਣੀ ਅਤੇ ਨਹਿਰੀ ਪਾਣੀ",
    ML: "കുഴൽക്കിണർ വെള്ളവും കനാൽ ജല വിതരണവും"
  },

  "Grid-tied solar microgrid backup (5kW)": {
    EN: "Grid-tied solar microgrid backup (5kW)",
    HI: "ग्रिड-कनेक्टेड सौर माइक्रोग्रिड बैकअप (5kW)",
    BN: "গ্রিড-টাইড সোলার মাইক্রোগ্রিড ব্যাকআপ (5kW)",
    TE: "గ్రిడ్-కనెక్టెడ్ సౌర పవర్ బ్యాకప్ (5kW)",
    MR: "ग्रीड-कनेक्टेड सोलर मायक्रोग्रीड बॅकअप (5kW)",
    TA: "மின்சார கிரிட் சோலார் பேக்கப் (5kW)",
    GU: "ગ્રીડ-જોડાયેલ સોલાર માઇક્રોગ્રીડ બેકઅપ (5kW)",
    KN: "ಸೌರ ಶಕ್ತಿ ಗ್ರಿಡ್ ವಿದ್ಯುತ್ ಬ್ಯಾಕಪ್ (5kW)",
    PA: "ਗਰਿੱਡ ਨਾਲ ਜੁੜਿਆ ਸੋਲਰ ਪਾਵਰ ਬੈਕਅੱਪ (5kW)",
    ML: "ഗ്രിഡ് ബന്ധിത സോളാർ പവർ ബാക്കപ്പ് (5kW)"
  },
  "11kV local substation line drop ready": {
    EN: "11kV local substation line drop ready",
    HI: "11kV स्थानीय सबस्टेशन बिजली लाइन तैयार",
    BN: "১১ কেভি স্থানীয় সাবস্টেশন বিদ্যুৎ লাইন প্রস্তুত",
    TE: "11kV విద్యుత్ సబ్‌స్టేషన్ లైన్ సిద్ధంగా ఉంది",
    MR: "११ केव्ही स्थानिक सबस्टेशन वीज लाईन जोडणी तयार",
    TA: "11kV உள்ளூர் துணை மின்நிலையம் இணைப்பு தயார்",
    GU: "11kV સ્થાનિક સબસ્ટેશન પાવર લાઇન રેડી",
    KN: "11kV ವಿದ್ಯುತ್ ಲೈನ್ ಸಂಪರ್ಕ ಲಭ್ಯವಿದೆ",
    PA: "11kV ਪਾਵਰ ਲਾਈਨ ਕੁਨੈਕਸ਼ਨ ਤਿਆਰ",
    ML: "11കെവി പ്രാദേശിക സബ്സ്റ്റേഷൻ ലൈൻ ലഭ്യമാണ്"
  },
  "High-Tension transmission grid nearby (200m)": {
    EN: "High-Tension transmission grid nearby (200m)",
    HI: "उच्च वोल्टेज बिजली ग्रिड पास में (200 मीटर)",
    BN: "উচ্চ ভোল্টেজ বিদ্যুৎ গ্রিড কাছেই (২০০ মিটার)",
    TE: "హై-టెన్షన్ పవర్ గ్రిడ్ సమీపంలో ఉంది (200మీ)",
    MR: "उच्च दाबाची वीज वाहिनी जवळ उपलब्ध (२०० मीटर)",
    TA: "அதிவேக மின்சார கிரிட் அருகில் உள்ளது (200மீ)",
    GU: "હાઈ-ટેન્શન વીજળી લાઈન નજીકમાં (200મી)",
    KN: "ಹೈ-ಟೆನ್ಶನ್ ವಿದ್ಯುತ್ ವಾಹಕ ಹತ್ತಿರದಲ್ಲಿದೆ (200ಮಿ)",
    PA: "ਹਾਈ-ਟੈਂਸ਼ਨ ਬਿਜਲੀ ਲਾਈਨ ਨਜ਼ਦੀਕ (200 ਮੀਟਰ)",
    ML: "ഹൈ-ടെൻഷൻ പവർ ഗ്രിഡ് സമീപത്തുണ്ട് (200മീ)"
  },
  "MSEDCL single-phase grid boundary poles": {
    EN: "MSEDCL single-phase grid boundary poles",
    HI: "MSEDCL सिंगल-फेज बिजली खंभे सीमा पर",
    BN: "MSEDCL সিঙ্গেল ফেজ বিদ্যুৎ সংযোগ খুটি",
    TE: "MSEDCL సింగిల్-ఫేజ్ విద్యుత్ స్తంభాలు సరిహద్దులో ఉన్నాయి",
    MR: "महावितरण सिंगल-फेज वीज खांब मर्यादेवर",
    TA: "மின்சார வாரிய ஒற்றை கட்ட மின் கம்பங்கள் எல்லைக்குள்",
    GU: "MSEDCL સિંગલ-ફેજ વીજળી થાંભલા સીમા પર",
    KN: "MSEDCL ಸಿಂಗಲ್-ಫೇಸ್ ವಿದ್ಯುತ್ ಕಂಬಗಳು ಗಡಿಯಲ್ಲಿವೆ",
    PA: "ਸਿੰਗਲ-ਫੇਜ਼ ਬਿਜਲੀ ਦੇ ਖੰਭੇ ਹੱਦ 'ਤੇ ਮੌਜੂਦ",
    ML: "എംഎസ്ഇഡിസിഎൽ സിംഗിൾ-ഫേസ് വൈദ്യുതി തൂണുകൾ ലഭ്യമാണ്"
  },
  "Connected 3-Phase agricultural feeder": {
    EN: "Connected 3-Phase agricultural feeder",
    HI: "कृषि उपयोग के लिए 3-फेज बिजली फीडर जुड़ा हुआ",
    BN: "৩-ফেজ কৃষি বিদ্যুৎ সংযোগ",
    TE: "3-ఫేజ్ వ్యవసాయ విద్యుత్ ఫీడర్ కనెక్ట్ చేయబడింది",
    MR: "शेतीसाठी ३-फेज वीज पुरवठा जोडून तयार",
    TA: "விவசாய பயன்பாட்டுக்கான 3-கட்ட மின் இணைப்பு",
    GU: "ખેતી માટે ૩-ફેજ પાવર ફીડર કનેક્ટેડ",
    KN: "ಕೃಷಿ ಬಳಕೆಗೆ 3-ಫೇಸ್ ವಿದ್ಯುತ್ ಸಂಪರ್ಕ ಸಿದ್ಧವಾಗಿದೆ",
    PA: "ਖੇਤੀਬਾੜੀ ਲਈ ਥ੍ਰੀ-ਫੇਜ਼ ਬਿਜਲੀ ਕਨੈਕਸ਼ਨ ਉਪਲਬਧ",
    ML: "കൃഷി ആവശ്യങ്ങൾക്കുള്ള 3-ഫേസ് വൈദ്യുതി ലഭ്യമാണ്"
  },

  "Earthen village panchayat track (4m)": {
    EN: "Earthen village panchayat track (4m)",
    HI: "कच्चा ग्रामीण पंचायत रास्ता (4 मीटर)",
    BN: "কাঁচা গ্রাম্য পঞ্চায়েত রাস্তা (৪ মিটার)",
    TE: "మట్టి రోడ్డు గ్రామ పంచాయతీ సరిహద్దు (4మీ)",
    MR: "कच्चा ग्रामीण पंचायत रस्ता (४ मीटर)",
    TA: "மண் கிராம பஞ்சாயத்து வழி (4மீ)",
    GU: "કાચો ગ્રામ પંચાયત રસ્તો (૪મી)",
    KN: "ಕಚ್ಚಾ ಗ್ರಾಮೀಣ ಪಂಚಾಯತಿ ರಸ್ತೆ (4ಮಿ)",
    PA: "ਕੱਚਾ ਗ੍ਰਾਮੀਣ ਪੰਚਾਇਤ ਰਸਤਾ (4 ਮੀਟਰ)",
    ML: "മൺ പഞ്ചായത്ത് റോഡ് സൗകര്യം (4മീ)"
  },
  "Four-lane national highway service lane": {
    EN: "Four-lane national highway service lane",
    HI: "फोर-लेन राष्ट्रीय राजमार्ग सर्विस रोड",
    BN: "চার লেনের জাতীয় মহাসড়ক সার্ভিস লেন",
    TE: "నాలుగు వరుసల జాతీయ రహదారి సర్వీస్ రోడ్డు",
    MR: "चारपदरी राष्ट्रीय महामार्ग जोड रस्ता",
    TA: "நான்கு வழி தேசிய நெடுஞ்சாலை சேவை வழி",
    GU: "ચાર લેન રાષ્ટ્રીય ધોરીમાર્ગ સર્વિસ રોડ",
    KN: "ನಾಲ್ಕು ಪಥದ ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ಸರ್ವಿಸ್ ರಸ್ತೆ",
    PA: "ਚਾਰ-ਮਾਰਗੀ ਰਾਸ਼ਟਰੀ ਸ਼ਾਹਰਾਹ ਸਰਵਿਸ ਰੋਡ",
    ML: "നാലുവരി ദേശീയപാത സർവീസ് റോഡ്"
  },
  "Gravel-bedded military bypass roadway": {
    EN: "Gravel-bedded military bypass roadway",
    HI: "बजरी वाला सैन्य बाईपास रोड",
    BN: "নুড়ি বিছানো সামরিক বাইপাস রাস্তা",
    TE: "రాళ్లతో కూడిన మిలటరీ బైపాస్ రోడ్డు",
    MR: "खडीचा लष्करी बाईपास रस्ता",
    TA: "சரளை கற்கள் பதிக்கப்பட்ட ராணுவ பைபாஸ் சாலை",
    GU: "પથરાળ સૈન્ય બાયપાસ રોડ",
    KN: "ಕಲ್ಲು ಹಾಸಿದ ಸೈನಿಕ ಬೈಪಾಸ್ ರಸ್ತೆ",
    PA: "ਬਜਰੀ ਵਾਲੀ ਮਿਲਟਰੀ ਬਾਈਪਾਸ ਸੜਕ",
    ML: "മെറ്റൽ ചെയ്ത സൈനിക ബൈപാസ് റോഡ് സൗകര്യം"
  },
  "Paved state bypass access loop road": {
    EN: "Paved state bypass access loop road",
    HI: "पक्का राज्य बाईपास मुख्य मार्ग",
    BN: "পাকা রাজ্য বাইপাস সড়ক সংযোগ",
    TE: "రాష్ట్ర స్థాయి బైపాస్ పక్కా రోడ్డు",
    MR: "पक्का राज्य महामार्ग जोड रस्ता",
    TA: "தரமான மாநில நெடுஞ்சாலை அணுகு சாலை",
    GU: "પાકો રાજ્ય બાયપાસ રોડ",
    KN: "ಡಾಂಬರು ಹಾಕಿದ ರಾಜ್ಯ ಬೈಪಾಸ್ ರಸ್ತೆ",
    PA: "ਪੱਕੀ ਸਟੇਟ ਬਾਈਪਾਸ ਲਿੰਕ ਸੜਕ",
    ML: "ടാറിട്ട സംസ്ഥാന ബൈപാസ് റോഡ്"
  },
  "State highway connector asphalt road": {
    EN: "State highway connector asphalt road",
    HI: "राज्य राजमार्ग से जुड़ने वाली डामर रोड",
    BN: "রাজ্য মহাসড়ক ডামার সড়ক সংযোগ",
    TE: "రాష్ట్ర రహదారి అనుసంధాన తారు రోడ్డు",
    MR: "राज्य महामार्ग डांबरी रस्ता संपर्क",
    TA: "மாநில நெடுஞ்சாலை இணைப்பு தார் சாலை",
    GU: "રાજ્ય ધોરીમાર્ગ ડામર રોડ કનેક્શન",
    KN: "ರಾಜ್ಯ ಹೆದ್ದಾರಿ ಸಂಪರ್ಕ ಡಾಂಬರು ರಸ್ತೆ",
    PA: "ਸਟੇਟ ਹਾਈਵੇਅ ਨਾਲ ਜੁੜਦੀ ਪੱਕੀ ਲਿੰਕ ਸੜਕ",
    ML: "സംസ്ഥാന പാതയുമായി ബന്ധിപ്പിക്കുന്ന ടാർ റോഡ്"
  },

  // 5. Short Property Descriptions
  "Pristine agricultural acreage featuring direct access to perennial irrigation canals. Rich alluvial silt deposits render this parcel highly catalogued for wheat, mustard, or high-yield crop rotation schedules. Comprehensive soil reports available on file. Standard government sub-sidized power hookup available nearby.": {
    EN: "Pristine agricultural acreage featuring direct access to perennial irrigation canals. Rich alluvial silt deposits render this parcel highly catalogued for wheat, mustard, or high-yield crop rotation schedules. Comprehensive soil reports available on file. Standard government sub-sidized power hookup available nearby.",
    HI: "प्राकृतिक कृषि भूमि जो बारहमासी सिंचाई नहरों से सीधी पहुंच प्रदान करती है। समृद्ध जलोढ़ गाद जमाव इस भूखंड को गेहूं, सरसों या उच्च उपज वाली फसल रोटेशन के लिए अत्यधिक उपयुक्त बनाते हैं। विस्तृत मृदा परीक्षण रिपोर्ट फाइल पर उपलब्ध है।",
    BN: "বারোমাসি সেচ খালের সরাসরি সংযোগ সহ প্রাচীন কৃষি জমি। পলি জমে এই জমি গম, সর্ষে বা উচ্চ ফলনশীল ফসল চাষের জন্য বিশেষ উপযোগী। মাটি পরীক্ষার রিপোর্ট ফাইলে উপলব্ধ।",
    TE: "నిరంతర నీటి పారుదల కాలువల సౌకర్యం ఉన్న వ్యవసాయ భూమి. ఇక్కడ గోధుమలు, ఆవాలు లేదా అధిక దిగుబడినిచ్చే పంటలు సాగు చేయడానికి భూమి ఎంతో అనుకూలం. నేల పరీక్ష నివేదిక అందుబాటులో ఉంది.",
    MR: "बारामाही सिंचन कालव्यांचा थेट रस्ता उपलब्ध असलेली सुपीक शेतजमीन. जाड गाळाची सुपीक माती या जमिनीला गहू, मोहरी किंवा इतर पिकांच्या लागवडीसाठी अत्यंत फायदेशीर ठरवते. माती चाचणी अहवाल उपलब्ध आहे.",
    TA: "ஆண்டு முழுவதும் நீர் பாயும் நீர்ப்பாசனக் கால்வாய் வசதியுடைய சிறந்த விவசாய நிலம். வண்டல் மண் படிவுகள் இந்த நிலத்தை கோதுமை, கடுகு அல்லது அதிக விளைச்சல் தரும் பயிர் சாகுபடிக்கு உகந்ததாக ஆக்குகிறது. மண் பரிசோதனை அறிக்கை தயார் நிலையில் உள்ளது.",
    GU: "બારમાસી સિંચાઈ નહેરની સીધી પહોંચ સાથેની ઉત્તમ ખેતીની જમીન. નદીની ફળદ્રુપ કાંપવાળી માટી આ પ્લોટને ઘઉં, રાયડો અથવા વધુ ઉપજ આપતા પાક માટે યોગ્ય બનાવે છે. માટી પરીક્ષણ રિપોર્ટ ઉપલબ્ધ છે.",
    KN: "ನೀರಾವರಿ ಕಾಲುವೆ ಸಂಪರ್ಕ ಹೊಂದಿರುವ ಅತ್ಯುತ್ತಮ ವ್ಯವಸಾಯ ಭೂಮಿ. ಫಲವತ್ತಾದ ಮಣ್ಣು ಈ ಜಾಗವನ್ನು ಗೋಧಿ, ಸಾಸಿವೆ ಅಥವಾ ಇತರ ಬೆಳೆ ಬೆಳೆಯಲು ಪೂರಕವಾಗಿಸಿದೆ. ಮಣ್ಣಿನ ಪರೀಕ್ಷಾ ವರದಿ ಲಭ್ಯವಿದೆ.",
    PA: "ਬਾਰਾਮਾਸੀ ਨਹਿਰੀ ਸਿੰਚਾਈ ਦੀ ਸੁਵਿਧਾ ਵਾਲੀ ਉਪਜਾਊ ਖੇਤੀਬਾੜੀ ਜ਼ਮੀਨ। ਨਹਿਰੀ ਪਾਣੀ ਕਾਰਨ ਇਹ ਰਕਬਾ ਕਣਕ, ਸਰ੍ਹੋਂ ਜਾਂ ਵੱਧ ਝਾੜ ਦੇਣ ਵਾਲੀਆਂ ਫਸਲਾਂ ਦੀ ਬਿਜਾਈ ਲਈ ਬਹੁਤ ਵਧੀਆ ਹੈ। ਮਿੱਟੀ ਟੈਸਟ ਰਿਪੋਰਟ ਮੌਜੂਦ ਹੈ।",
    ML: "വർഷം മുഴുവൻ ജലസേചനമുള്ള കനാൽ സൗകര്യമുള്ള കാർഷിക ഭൂമി. കളിമണ്ണ് നിറഞ്ഞ ഈ പ്രദേശം ഗോതമ്പ്, കടുക് അല്ലെങ്കിൽ ഉയർന്ന വിളവ് തരുന്ന വിളകൾ കൃഷി ചെയ്യാൻ അനുയോജ്യമാണ്. മണ്ണ് പരിശോധനാ റിപ്പോർട്ട് ഫയലിലുണ്ട്."
  },
  "Premium commercial-graded lot situated inside the newly mapped technological smart expansion tract outside Bengaluru city limits. Authorized for high-density office development, multi-tenant server facilities, or commercial retail hubs. All setback constraints cleard.": {
    EN: "Premium commercial-graded lot situated inside the newly mapped technological smart expansion tract outside Bengaluru city limits. Authorized for high-density office development, multi-tenant server facilities, or commercial retail hubs. All setback constraints cleard.",
    HI: "बेंगलुरु शहर के बाहर नवनिर्मित तकनीकी स्मार्ट विस्तार क्षेत्र में स्थित प्रीमियम वाणिज्यिक श्रेणी का भूखंड। उच्च घनत्व कार्यालय विकास, सर्वर सुविधाओं या शॉपिंग कॉम्प्लेक्स के लिए अधिकृत।",
    BN: "ব্যাঙ্গালোর শহরের বাইরে নতুন আইটি হাব সংলগ্ন বাণিজ্যিক ব্যবহারের উপযোগী প্রিমিয়াম প্লট। বহুতল অফিস ব্লক, আইটি পরিকাঠামো বা খুচরা ব্যবসার জন্য অনুমোদিত। সমস্ত ছাড়পত্র প্রস্তুত।",
    TE: "బెంగళూరు నగరం వెలుపల కొత్తగా అభివృద్ధి చెందుతున్న టెక్నాలಜಿ స్మార్ట్ కారిడార్‌లో ప్రీమియం కమర్షియల్ ప్లాట్. ఆఫీస్ భవనాలు, సర్వర్ కేంద్రాలు లేదా వ్యాపార సముదాయాలకు అనుకూలం.",
    MR: "बेंगळुरू शहराबाहेरील नवीन मोजणी केलेल्या टेक्नॉलॉजिकल स्मार्ट झोनमधील प्रीमियम व्यावसायिक प्लॉट. हाय-डेन्सिटी ऑफिस कॉम्प्लेक्स, आयटी सर्वर युनिट किंवा व्यावसायिक बाजारपेठेसाठी मंजूर.",
    TA: "பெங்களூரு மாநகர எல்லைக்கு வெளியே புதிதாக வடிவமைக்கப்பட்ட தொழில்நுட்ப பூங்கா பகுதிக்குள் அமைந்துள்ள வணிக பயன்பாட்டு நிலம். தகவல் தொழில்நுட்ப அலுவலகங்கள், சர்வர் மையங்கள் அல்லது வணிக வளாகங்கள் அமைக்க அனுமதிக்கப்பட்டது.",
    GU: "બેંગલુરુ શહેરની બહાર નવા આઇટી હબ વિસ્તારમાં આવેલ પ્રીમિયમ કોમર્શિયલ પ્લોટ. હાઈ-ડેન્સિટી ઓફિસ બિલ્ડિંગ, સર્વર સિસ્ટમ અથવા શોપિંગ સેન્ટર વિકસાવવા માટે મંજૂર થયેલ છે.",
    KN: "ಬೆಂಗಳೂರು ಹೊರವಲಯದ ಟೆಕ್ ಕಾರಿಡಾರ್‌ನಲ್ಲಿರುವ ವಾಣಿಜ್ಯ ಬಳಕೆಯ ಪ್ರೀಮಿಯಂ ನಿವೇಶನ. ಬಹುಮಹಡಿ ಕಚೇರಿಗಳು, ಐಟಿ ಸರ್ವರ್ ಕೇಂದ್ರಗಳು ಅಥವಾ ವಾಣಿಜ್ಯ ಸಂಸ್ಥೆಗಳ ನಿರ್ಮಾಣಕ್ಕೆ ಯೋಗ್ಯವಾಗಿದೆ.",
    PA: "ਬੈਂਗਲੁਰੂ ਸ਼ਹਿਰ ਦੇ ਬਾਹਰ ਨਵੇਂ ਬਣ ਰਹੇ ਤਕਨੀਕੀ ਸਮਾਰਟ ਜ਼ੋਨ ਵਿੱਚ ਪ੍ਰੀਮੀਅਮ ਵਪਾਰਕ ਪਲਾਟ। ਉੱਚ-ਪੱਧਰੀ ਦਫ਼ਤਰ, ਆਈਟੀ ਸਰਵਰ ਸੁਵਿਧਾਵਾਂ ਜਾਂ ਵਪਾਰਕ ਕੰਪਲੈਕਸ ਬਣਾਉਣ ਲਈ ਮਨਜ਼ੂਰਸ਼ੁਦਾ।",
    ML: "ബെംഗളൂരു നഗരാതിർത്തിക്ക് വെളിയിൽ പുതിയ ടെക്നോളജി സ്മാർട്ട് സോണിലുള്ള പ്രീമിയം വാണിജ്യ പ്ലോട്ട്. ബഹുനില ഓഫീസുകൾക്കോ ഐടി വികസനത്തിനോ വാണിജ്യ സ്ഥാപനങ്ങൾക്കോ അനുയോജ്യമാണ്."
  },
  "Immense barren acreage optimized for renewable alternative utility investments under central green infrastructure subsidies. Topographical terrain yields sustained high-velocity clear currents ideal for high-capacity wind turbine installs. Complete grid integration report ready on file.": {
    EN: "Immense barren acreage optimized for renewable alternative utility investments under central green infrastructure subsidies. Topographical terrain yields sustained high-velocity clear currents ideal for high-capacity wind turbine installs. Complete grid integration report ready on file.",
    HI: "केंद्रीय हरित ऊर्जा सब्सिडी के तहत अक्षय ऊर्जा बुनियादी ढांचा निवेश के लिए अनुकूलित विशाल बंजर क्षेत्र। भौगोलिक स्थिति निरंतर उच्च वेग वाली पवन धाराएं प्रदान करती है जो पवन टरबाइन के लिए आदर्श हैं।",
    BN: "সরকারি সবুজ শক্তি ভরতুকির আওতায় নবীকরণযোগ্য সবুজ শক্তি প্রকল্পের জন্য উপযোগী বিশাল জমি। বায়ুচালিত বিদ্যুৎ প্রকল্পের জন্য ভৌগোলিক অবস্থান এবং প্রবল বায়ুপ্রবাহ অত্যন্ত উপযুক্ত। গ্রিড সংযুক্তি রিপোর্ট তৈরি।",
    TE: "కేంద్ర ప్రభుత్వ క్లీన్ ఎనర్జీ సబ్సిడీల కింద పునరుత్పాదక ఇంధన పెట్టుబడుల కోసం భారీ బంజరు భూమి. గాలి మిల్లుల ఏర్పాటుకు అనువైన బలమైన గాలులు ఇక్కడ వీస్తాయి. గ్రిడ్ రిపోర్ట్ సిద్ధంగా ఉంది.",
    MR: "केंद्र सरकारच्या ग्रीन एनर्जी अनुदानांतर्गत अक्षय ऊर्जा प्रकल्पांसाठी अनुकूल असलेली अथांग मोकळी जमीन. वाऱ्याचा सततचा वेगवान प्रवाह पवनचक्की बसवण्यासाठी अत्यंत आदर्श आहे. पॉवर ग्रीड जोडणीचा अहवाल फाईलवर तयार आहे.",
    TA: "மத்திய அரசின் பசுமை மானியங்களின் கீழ் புதுப்பிக்கத்தக்க மாற்று எரிசக்தி முதலீடுகளுக்கு உகந்த பெரிய வெற்று நிலம். காற்றாலை அமைப்பதற்கு ஏற்ற அதிவேகக் காற்று இங்கு வீசுகிறது. மின் இணைப்பு அறிக்கை தயார் நிலையில் உள்ளது.",
    GU: "કેન્દ્રીય ગ્રીન એનર્જી સબસિડી હેઠળ રિન્યુએબલ એનર્જી પ્રોજેક્ટ માટે અનુકૂળ વિશાળ સોલાર-વિન્ડ જમીન. કેટોગ્રાફિકલ સ્થિતિ પવનચક્કી અથવા સોલાર પ્રોજેક્ટ માટે અત્યંત આદર્શ છે. ગ્રીડ કનેક્શન રિપોર્ટ રેડી છે.",
    KN: "ಕೇಂದ್ರ ಸರ್ಕಾರದ ಹಸಿರು ಇಂಧನ ಸಬ್ಸಿಡಿ ಅಡಿಯಲ್ಲಿ ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ಯೋಜನೆಗಳಿಗೆ ಸೂಕ್ತವಾದ ವಿಶಾಲವಾದ ನಿರುಪಯುಕ್ತ ಭೂಮಿ. ಪವನ ವಿದ್ಯುತ್ ಸ್ಥಾವರ ಸ್ಥಾಪಿಸಲು ಯೋಗ್ಯವಾದ ವೇಗದ ಹವಾಮಾನ ಹೊಂದಿದೆ. ಗಣನೀಯ ವರದಿ ಸಿದ್ಧವಿದೆ.",
    PA: "ਕੇਂਦਰ ਸਰਕਾਰ ਦੀ ਗ੍ਰੀਨ ਐਨਰਜੀ ਸਬਸਿਡੀ ਅਧੀਨ ਅਲਟਰਨੇਟਿਵ ਊਰਜਾ ਨਿਵੇਸ਼ ਲਈ ਅਨੁਕੂਲ ਵਿਸ਼ਾਲ ਜ਼ਮੀਨ। ਪਵਨ ਚੱਕੀਆਂ ਲਗਾਉਣ ਅਤੇ ਹਵਾ ਦੀ ਰਫਤਾਰ ਦੇ ਪੂਰੇ ਟੈਸਟ ਕਾਰਨ ਇਹ ਰਕਬਾ ਬਹੁਤ ਢੁਕਵਾਂ ਹੈ। ਗਰਿੱਡ ਕਨੈਕਸ਼ਨ ਰਿਪੋਰਟ ਤਿਆਰ ਹੈ।",
    ML: "കേന്ദ്ര സർക്കാർ ഹരിത സബ്സിഡികൾ പ്രകാരം പുനരുപയോഗ ഊർജ്ജ നിക്ഷേപങ്ങൾക്ക് അനുയോജ്യമായ വലിയ barren ഭൂമി. കാറ്റാടി യന്ത്രങ്ങൾ സ്ഥാപിക്കാൻ ഉചിതമായ ഉയർന്ന കാറ്റുമുള്ള പ്രദേശമാണ്. ഗ്രിഡ് കണക്ടിവിറ്റി റിപ്പോർട്ട് ഫയലിലുണ്ട്."
  },
  "Majestic stepped hills plot overlooking prime valley vistas under Pune rural development zones. Perfect fit for boutique eco-resorts, organic orchards, or premium luxury villas. Cleared soil reports with zero active landslide risk. Fresh mountain airflow and natural water springs.": {
    EN: "Majestic stepped hills plot overlooking prime valley vistas under Pune rural development zones. Perfect fit for boutique eco-resorts, organic orchards, or premium luxury villas. Cleared soil reports with zero active landslide risk. Fresh mountain airflow and natural water springs.",
    HI: "पुणे ग्रामीण विकास क्षेत्रों के तहत सुरम्य घाटी के दृश्यों को देखने वाला राजसी सीढ़ीदार पहाड़ी भूखंड। बुटीक इको-रिसॉर्ट्स, जैविक उद्यानों या आलीशान विला के लिए आदर्श। कोई भूस्खलन जोखिम नहीं।",
    BN: "পুনে গ্রামীণ উন্নয়ন জোনের অধীনে মনোরম উপত্যকার দৃশ্য সহ দুর্দান্ত পাহাড়ি ঢাল। ইকো-রিসর্ট, জৈব ফলের বাগান বা বিলাসবহুল ভিলার জন্য উপযুক্ত। ভূমিধসের কোনো ঝুঁকি নেই। পাহাড়ের তাজা বাতাস ও ঝর্ণার জল সমৃদ্ধ।",
    TE: "పూణే గ్రామీణ ప్రాంతంలో ప్రకృతి వాలులతో కూడిన పర్వత ప్రాంత ప్లాట్. విలాసవంతమైన రిసార్ట్స్, ఆర్గానిక్ పంటల తోటలు లేదా లగ్జరీ విల్లాల ఏర్పాటుకు అద్భుతమైన అవకాశం. కొండచరియలు విరిగిపడే ప్రమాదం లేదు.",
    MR: "पुणे ग्रामीण विकास क्षेत्रांतर्गत दरीचे विहंगम दृश्य असणारा विस्तीर्ण पायऱ्यांचा डोंगराळ प्लॉट. ब्युटीक इको-रिसॉर्ट्स, ऑरगॅनिक शेती किंवा प्रीमियम लक्झरी व्हिलासाठी उत्तम पर्याय. दरड कोसळण्याचा कोणताही धोका नाही; नैसर्गिक पाण्याचे झरे उपलब्ध.",
    TA: "புனே ஊரக வளர்ச்சி மண்டலத்தின் கீழ் பள்ளத்தாக்கின் காட்சிகளை நோக்கிய மலைச் சரிவு நிலம். இயற்கை சுற்றுலா விடுதிகள், ஆர்கானிக் பழத்தோட்டங்கள் அல்லது ஆடம்பர வில்லாக்கள் அமைக்க மிகவும் உகந்தது. நிலச்சரிவு ஆபத்து இல்லாத பகுதியாக சான்றளிக்கப்பட்டது.",
    GU: "પુણે ગ્રામીણ વિકાસ ઝોન હેઠળ ખીણના સુંદર નજારા સાથેની સીડીવાળી પહાડી જમીન. ઇકો-રિસોર્ટ, ઓર્ગેનિક બગીચાઓ અથવા વૈભવી વિલા માટે ઉત્તમ. ભૂસ્ખલનનો કોઈ ભય નથી. પહાડી શુદ્ધ હવા અને પાણીના કુદરતી ઝરણા.",
    KN: "ಪುಣೆ ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ ವಲಯದ ಅಡಿಯಲ್ಲಿ ಕಣಿವೆಯ ಸುಂದರ ನೋಟ ಹೊಂದಿರುವ ಇಳಿಜಾರಿನ ಗುಡ್ಡಗಾಡು ಪ್ರದೇಶ. ರೆಸಾರ್ಟ್, ಸಾವಯವ ತೋಟಗಾರಿಕೆ ಅಥವಾ ಆಕರ್ಷಕ ವಿಲ್ಲಾ ನಿರ್ಮಿಸಲು ಸೂಕ್ತ ಜಾಗ. ಭೂಕುಸಿತದ ಭಯವಿಲ್ಲ; ಶುದ್ಧ ಗಾಳಿ ಮತ್ತು ನೀರಿನ ಬುಗ್ಗೆ ಹೊಂದಿದೆ.",
    PA: "ਪੁਣੇ ਦੇ ਦਿਹਾਤੀ ਵਿਕਾਸ ਜ਼ੋਨ ਅਧੀਨ ਦਿਲਕਸ਼ ਘਾਟੀ ਦੇ ਨਜ਼ਾਰੇ ਵਾਲਾ ਸ਼ਾਨਦਾਰ ਪਹਾੜੀ ਪਲਾਟ। ਈਕੋ-ਰਿਜ਼ੌਰਟਸ, ਆਰਗੈਨਿਕ ਬਾਗ਼ਬਾਨੀ ਜਾਂ ਆਲੀਸ਼ਾਨ ਵਿੱਲਾ ਬਣਾਉਣ ਲਈ ਬਹੁਤ ਵਧੀਆ। ਜ਼ਮੀਨ ਖਿਸਕਣ ਦਾ ਕੋਈ ਖਤਰਾ ਨਹੀਂ, ਪਹਾੜੀ ਹਵਾ ਅਤੇ ਪਾਣੀ ਦੇ ਕੁਦਰਤੀ ਚਸ਼ਮੇ ਮੌਜੂਦ।",
    ML: "പുനെ റെസിഡൻഷ്യൽ വികസന മേഖലയിൽ താഴ്‌വരയുടെ മനോഹര ദൃശ്യങ്ങളുള്ള കുന്നിൻ ചരിവ്. റിസോർട്ടുകൾക്കോ ഓർഗാനിക് തോട്ടങ്ങൾക്കോ ആഡംബര വില്ലകൾക്കോ അനുയോജ്യമാണ്. ഉരുൾപൊട്ടൽ ഭീഷണിയില്ലാത്ത സുരക്ഷിത പ്രദേശം. തണുത്ത കാറ്റും സ്വാഭാവിക നീരുറവകളും."
  },
  "Breathtaking vineyard-ready agricultural land located in Nashik, the wine capital of India. Featuring mild micro-climatic patterns, high water drainage profiles, and natural drip lines linked. ADU or boutique tasting room permits ready for immediate approval.": {
    EN: "Breathtaking vineyard-ready agricultural land located in Nashik, the wine capital of India. Featuring mild micro-climatic patterns, high water drainage profiles, and natural drip lines linked. ADU or boutique tasting room permits ready for immediate approval.",
    HI: "भारत की वाइन राजधानी नासिक में स्थित शानदार अंगूर के बाग के लिए सुरक्षित कृषि भूमि। हल्के सूक्ष्म जलवायु पैटर्न, उच्च जल निकासी वाले क्षेत्र और ड्रिप सिंचाई लाइनों से जुड़ा हुआ।",
    BN: "ভারতের ওয়াইন রাজধানী নাশিকে অবস্থিত আঙুর চাষের জন্য প্রস্তুত অসাধারণ সমভূমি। হালকা আবহাওয়া, উন্নত পয়ঃপ্রণালী ব্যবস্থা ও প্রাকৃতিক ড্রিপ লাইনের সংযোগ সহ। বুটিখ টেস্টিং রুমের অনুমতি প্রস্তুত।",
    TE: "భారతదేశ ద్రాక్ష తోటల రాజధాని నాసిక్‌లో ద్రాక్ష సాగుకు సిద్ధంగా ఉన్న వ్యవసాయ భూమి. సహజమైన డ్రిప్ లైన్ల అనుసంధానం మరియు అద్భుతమైన వాతావरण సౌకర్యం కలిగి ఉంది.",
    MR: "भारताची वाईन कॅपिटल असलेल्या नाशिकमधील द्राक्ष लागवडीसाठी अत्यंत योग्य अशी शेतजमीन. सौम्य हवामान प्रकार, उत्कृष्ट पाण्याचा निचरा होणारी माती आणि ड्रिप इरिगेशन जोडलेले. वाईन चाचणी केंद्राच्या परवानग्या त्वरित उपलब्ध होऊ शकतात.",
    TA: "இந்தியாவின் திராட்சை ரச தலைநகரமான நாசிக்கில் அமைந்துள்ள திராட்சை சாகுபடிக்கு உகந்த நிலம். மிதமான காலநிலை, சிறந்த வடிகால் வசதிகள் மற்றும் சொட்டு நீர் பாசன வழிகள் கொண்டது. வணிக பயன்பாடு மற்றும் தங்கும் விடுதி அனுமதி உடனே பெறலாம்.",
    GU: "ભારતની વાઇન કેપિટલ નાસિકમાં આવેલ દ્રાક્ષની ખેતી માટે સક્ષમ જમીન. અનુકૂળ સૂક્ષ્મ આબોહવા, જળ નિકાસની ઉત્તમ વ્યવસ્થા અને ટપક સિંચાઈ લાઈનોથી જોડાયેલ. ટેસ્ટિંગ રૂમ અથવા કોટેજની પરવાનગીઓ ત્વરિત મંજૂર થઈ શકે છે.",
    KN: "ಭಾರತದ ದ್ರಾಕ್ಷಿ ರಾಜಧಾನಿ ನಾಸಿಕ್‌ನಲ್ಲಿರುವ ದ್ರಾಕ್ಷಿ ಬೇಸಾಯಕ್ಕೆ ಯೋಗ್ಯವಾದ ಭೂಮಿ. ಅನುಕೂಲಕರ ಹವಾಮಾನ, ಅತ್ಯುತ್ತಮ ಬಸಿದು ಹೋಗುವ ವ್ಯವಸ್ಥೆ ಹಾಗೂ ಹನಿ ನೀರಾವರಿ ಸೌಲಭ್ಯ ಹೊಂದಿದೆ. ಪರ್ಮಿಟ್‌ಗಳು ತಕ್ಷಣವೇ ಮಂಜೂರಾಗಬಲ್ಲವು.",
    PA: "ਨਾਸਿਕ (ਭਾਰਤ ਦੀ ਵਾਈਨ ਰਾਜਧਾਨੀ) ਵਿੱਚ ਸਥਿਤ ਅੰਗੂਰਾਂ ਦੇ ਬਾਗ਼ ਲਗਾਉਣ ਲਈ ਵਧੀਆ ਖੇਤੀਬਾੜੀ ਜ਼ਮੀਨ। ਵਧੀਆ ਜਲ ਨਿਕਾਸ ਪ੍ਰਣਾਲੀ ਅਤੇ ਡ੍ਰਿਪ ਸਿੰਚਾਈ ਪਾਈਪਾਂ ਪਹਿਲਾਂ ਹੀ ਵਿਛੀਆਂ ਹੋਈਆਂ ਹਨ। ਫਾਰਮ ਹਾਊਸ ਜਾਂ ਬਿਜ਼ਨਸ ਪਰਮਿਟ ਤੁਰੰਤ ਮਨਜ਼ੂਰ ਹੋਣ ਯੋਗ।",
    ML: "ഇന്ത്യയുടെ വൈൻ തലസ്ഥാനമായ നാസികിൽ മുന്തിരി കൃഷിക്ക് തയ്യാറാക്കിയ കാർഷിക ഭൂമി. അനുകൂല കാലാവസ്ഥയും മികച്ച ഡ്രെയിനേജും തുള്ളിനന സംവിധാനവുമുണ്ട്. ടൂറിസം അനുമതികൾ എളുപ്പത്തിൽ ലഭ്യമാണ്."
  }
};

// --- DYNAMIC TRANSLATION FUNCTION ---
export function translateDynamicText(text: string, currentLanguage: LanguageCode): string {
  if (!text) return "";
  if (currentLanguage === "EN") return text;

  // 1. Check exact match in dictionary
  const trimmed = text.trim();
  if (DYNAMIC_DICTIONARY[trimmed]) {
    return DYNAMIC_DICTIONARY[trimmed][currentLanguage] || DYNAMIC_DICTIONARY[trimmed]["EN"] || text;
  }

  // 2. Check partial word matches or dynamic substitutions for any dynamic phrases
  // Let's check common words to translate dynamic features if not matched exactly
  let result = text;
  
  // Quick small translations for some repeating phrases
  const wordMatches: Record<string, Record<string, string>> = {
    "Verified Buyer": {
      HI: "सत्यापित खरीदार", BN: "যাচাইকৃত ক্রেতা", TE: "ధృవీకరించబడిన కొనుగోలుదారు", MR: "नोंदणीकृत खरेदीदार", TA: "சரிபார்க்கப்பட்ட வாங்குபவர்", GU: "ચકાસાયેલ ખરીદનાર", KN: "ದೃಢೀಕೃತ ಖರೀದಿದಾರ", PA: "ਪ੍ਰਮਾਣਿਤ ਖਰੀਦਦਾਰ", ML: "സാക്ഷ്യപ്പെടുത്തിയ വാങ്ങുന്നയാൾ"
    },
    "Borewell with pump established": {
      HI: "स्थापित पंप के साथ बोरवेल", BN: "পাম্প সহ বোরওয়েল", TE: "బోరుబావి మరియు పంపు సిద్ధంగా ఉన్నాయి", MR: "कूपनलिका पंप बसवून तयार", TA: "ஆழ்துளைக் கிணறு பம்ப் உள்ளது", GU: "સ્થાપિત પંપ સાથે બોરવેલ", KN: "ಕೊಳವೆ ಬಾವಿ ಮತ್ತು ಪಂಪ್ ಅಳವಡಿಸಲಾಗಿದೆ", PA: "ਪੰਪ ਸਮੇਤ ਬੋਰਵੈੱਲ ਮੌਜੂਦ", ML: "പമ്പ് ഘടിപ്പിച്ച കുഴൽക്കിണർ"
    },
    "State electricity board grid drop nearby": {
      HI: "राज्य बिजली बोर्ड ग्रिड पास में उपलब्ध", BN: "বিদ্যুৎ সংযোগ খুটি কাছেই উপলব্ধ", TE: "విద్యుత్ బోర్డు గ్రిడ్ సమీపంలో ఉంది", MR: "राज्य वीज मंडळाची जोडणी जवळ उपलब्ध", TA: "மின்வாரிய இணைப்பு அருகில் தயாராக உள்ளது", GU: "વીજળી બોર્ડ ગ્રીડ નજીકમાં ઉપલબ્ધ", KN: "ವಿದ್ಯುತ್ ಲೈನ್ ಸಂಪರ್ಕ ಹತ್ತಿರದಲ್ಲಿದೆ", PA: "ਬਿਜਲੀ ਕੁਨੈਕਸ਼ਨ ਨਜ਼ਦੀਕ ਮੌਜੂਦ", ML: "സ്റേറ്റ് വൈദ്യുതി ബോർഡ് കണക്ഷൻ അടുത്തുണ്ട്"
    },
    "Metalled asphalt bypass road": {
      HI: "डामर बाईपास मुख्य सड़क", BN: "পাকা পিচ বাইপাস সড়ক", TE: "తారు బైపాస్ రోడ్డు", MR: "डांबरी बायपास मुख्य रस्ता", TA: "தார் அணுகு சாலை", GU: "ડામર બાયપાસ રોડ", KN: "ಡಾಂಬರು ಹಾಕಿ ಬೈಪಾಸ್ ರಸ್ತೆ", PA: "ਪੱਕੀ ਲਿੰਕ ਬਾਈਪਾਸ ਸੜਕ", ML: "ലിങ്ക് ടാർ റോഡ് സൗകര്യം"
    }
  };

  if (wordMatches[trimmed]) {
    return wordMatches[trimmed][currentLanguage] || trimmed;
  }

  return result;
}
