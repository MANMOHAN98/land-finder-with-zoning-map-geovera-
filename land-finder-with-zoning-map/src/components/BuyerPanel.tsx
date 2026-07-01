import React from 'react';
import { LandListing, InquiryMessage, UserProfile } from '../types';
import { ZONING_RULES } from '../data';
import { LanguageCode, translateDynamicText, TRANSLATIONS } from '../translations';
import { 
  Bookmark, 
  Send, 
  DollarSign, 
  Clock, 
  MessageCircle, 
  FolderHeart,
  ChevronRight,
  User,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface BuyerPanelProps {
  currentBuyer: UserProfile;
  listings: LandListing[];
  bookmarks: string[];
  messages: InquiryMessage[];
  onSelectListing: (id: string) => void;
  onRemoveBookmark: (e: React.MouseEvent, id: string) => void;
  currentLanguage?: LanguageCode;
  viewMode?: 'saved' | 'messages';
}

export default function BuyerPanel({
  currentBuyer,
  listings,
  bookmarks,
  messages,
  onSelectListing,
  onRemoveBookmark,
  currentLanguage = 'EN',
  viewMode
}: BuyerPanelProps) {
  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['EN'][key] || key;
  };

  const getLabel = (key: string): string => {
    const labels: Record<string, Record<LanguageCode, string>> = {
      saved_title: { EN: 'My Saved Tracts', HI: 'मेरे सहेजे गए प्लॉट', BN: 'আমার সংরক্ষিত প্লট', TE: 'నా సేవ్ చేసిన ప్లాట్లు', MR: 'माझे जतन केलेले प्लॉट', TA: 'சேமிக்கப்பட்ட எனது நிலங்கள்', GU: 'મારા સંગ્રહિત પ્લોટ', KN: 'ನನ್ನ ಉಳಿಸಿದ ಪ್ಲಾಟ್‌ಗಳು', PA: 'ਮੇਰੇ ਸੁਰੱਖਿਅਤ ਕੀਤੇ ਪਲਾਟ', ML: 'എന്റെ സേവ് ചെയ്ത പ്ലോട്ടുകൾ' },
      saved_desc: { EN: 'Bookmarked properties for fast metrics inspection.', HI: 'त्वरित मानचित्र निरीक्षण के लिए बुकमार्क की गई संपत्तियां।', BN: 'দ্রুত মানচিত্র परिदर्शনের জন্য বুকমার্ক করা সম্পত্তি।', TE: 'త్వరిత మ్యాప్ తనిీ కోసం బుక్‌మార్క్ చేయబడిన ప్లాట్లు.', MR: 'त्वरित नकाशा तपासणीसाठी बुकमार्क केलेले प्लॉट.', TA: 'வரைபடத்தின் மூலம் விரைவாகக் கண்டறிய சேமிக்கப்பட்ட நிலங்கள்.', GU: 'નકશા પર ઝડપી તપાસ માટે બુકમાર્ક કરેલ પ્लोટ.', KN: 'ಕ್ಷಿಪ್ರ ಭೂಪಟ ಪರಿಶೀಲನೆಗಾಗಿ ಬುಕ್‌ಮಾರ್ಕ್ ಮಾಡಲಾದ ಗುಣಲಕ್ಷಣಗಳು.', PA: "ਨਕਸ਼ੇ 'ਤੇ ਤੁਰੰਤ ਜਾਂਚ ਲਈ ਬੁੱਕਮਾਰਕ ਕੀਤੇ ਪਲਾਟ।", ML: 'വേഗത്തിൽ മാപ്പിൽ പരിശോധിക്കുന്നതിനായി അടയാളപ്പെടുത്തിയ പ്ലോട്ടുകൾ.' },
      no_saved: { EN: 'No properties saved yet.', HI: 'अभी तक कोई संपत्ति सहेजी नहीं गई है।', BN: 'এখনো কোনো সম্পত্তি সংরক্ষিত হয়নি।', TE: 'ఇంका ఏ ప్లాట్లు సేవ్ చేయబడలేదు.', MR: 'अद्याप कोणतेही प्लॉट जतन केलेले नाहीत.', TA: 'இன்னும் எந்த நிலமும் சேமிக்கப்படவில்லை.', GU: 'હજી સુધી કોઈ પ્લોટ સેવ કર્યો નથી.', KN: 'ಇನ್ನೂ ಯಾವುದೇ ಗುಣಲಕ್ಷಣಗಳನ್ನು ಉಳಿಸಿಲ್ಲ.', PA: 'ਅਜੇ ਕੋਈ ਪਲਾਟ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।', ML: 'പ്ലോട്ടുകൾ ഒന്നും ഇതുവരെ സേവ് ചെയ്തിട്ടില്ല.' },
      saved_help: { EN: 'Tap the bookmark star on any listing card to save it here.', HI: 'इसे यहाँ सहेजने के लिए किसी भी सूची पत्र पर दिए गए स्टार को स्पर्श करें।', BN: 'এখানে সংরক্ষণ করতে যেকোনো লিস্টিং কার্ডে স্টারে ট্যাপ করুন।', TE: 'దీనిని ఇక్కడ సేవ్ చేయడానికి ప్లాట్ కార్డ్‌పై ఉన్న స్టార్ గుర్తును నొక్కండి.', MR: 'ते येथे जतन करण्यासाठी कोणत्याही कार्डवरील स्टारवर टॅप करा.', TA: 'இங்கு சேமிக்க நிலப் பட்டியலிலுள்ள நட்சத்திரக் குறியீட்டைத் தொடவும்.', GU: 'તેને અહીં સેવ કરવા માટે કોઈપણ લિસ્ટિંગカード પરના સ્ટાર આઇકોન પર ક્લિક કરો.', KN: 'ಇಲ್ಲಿ ಉಳಿಸಲು ಯಾವುದೇ ಲಿಸ್ಟಿಂಗ್ ಕಾರ್ಡ್‌ನಲ್ಲಿರುವ ನಕ್ಷತ್ರದ ಗುರುತನ್ನು ಒತ್ತಿರಿ.', PA: 'ਇੱਥੇ ਸੁਰੱਖਿਅਤ ਕਰਨ ਲਈ ਕਿਸੇ ਵੀ ਲਿਸਟਿੰਗ ਕਾਰਡ \'ਤੇ ਸਟਾਰ ਨੂੰ ਦਬਾਓ।', ML: 'പ്ലോട്ടുകൾ ഇവിടെ സേവ് ചെയ്യാനായി ലിസ്റ്റിംഗ് കാർഡിലെ നക്ഷത്ര ചിഹ്നത്തിൽ ക്ലിക്ക് ചെയ്യുക.' },
      delete_btn: { EN: 'Delete', HI: 'हटाएं', BN: 'মুছে ফেলুন', TE: 'తొలగించు', MR: 'हटवा', TA: 'நீக்கு', GU: 'નિકાલ કરો', KN: 'ಅಳಿಸು', PA: 'ਹਟਾਓ', ML: 'ഒഴിവാക്കുക' },
      neg_title: { EN: 'My Negotiations & Inquiries', HI: 'मेरी बातचीत और पूछताछ', BN: 'আমার আলোচনা ও অনুসন্ধান', TE: 'నా చర్చలు మరియు విचारారణలు', MR: 'माझी बोलणी आणि चौकशी', TA: 'எனது பேச்சுவார்த்தைகள் மற்றும் விசாரணைகள்', GU: 'મારી પૂછપરછો અને ઓફરો', KN: 'ನನ್ನ ಸಮಾಲೋಚನೆಗಳು ಮತ್ತು ವಿಚಾರಣೆಗಳು', PA: 'ਮੇਰੀ ਗੱਲਬਾਤ ਅਤੇ ਪੁੱਛਗਿੱਛ', ML: 'എന്റെ ചർച്ചകളും അന്വേഷണങ്ങളും' },
      neg_desc: { EN: 'Communication log with verified listing brokers.', HI: 'सत्यापित ब्रोकरों के साथ संचार लॉग।', BN: 'যাচাইকৃত ব্রোকারদের সাথে যোগাযোগের ইতিহাস।', TE: 'ధృవీకరించబడిన బ్రోకర్లతో సంభాషణల వివరాలు.', MR: 'सत्यापित ब्रोकरसोबतची बातचीत.', TA: 'அங்கீகரிக்கப்பட்ட தரகர்களுடனான தொடர்பு வரலாறு.', GU: 'ખરાઈ કરેલ બ્રોકરો સાથેની વાતચીતનો હિસાબ।', KN: 'ದೃಢೀಕೃತ ಬ್ರೋകರ್‌ಗಳೊಂದಿಗಿನ സംವಹನ ದಾಖಲೆ.', PA: 'ਪ੍ਰਮਾਣਿਤ ਬ੍ਰੋਕਰਾਂ ਨਾਲ ਗੱਲਬਾਤ ਦਾ ਰਿਕਾਰਡ।', ML: 'അംഗീകൃത ബ്രോക്കർമാരുമായുള്ള ആശയവിനിമയ ചരിത്രം.' }
    };
    return labels[key]?.[currentLanguage] || labels[key]?.['EN'] || key;
  };

  const savedProperties = listings.filter(l => bookmarks.includes(l.id));
  const mySentMessages = messages.filter(m => m.buyerId === currentBuyer.id);

  if (viewMode === 'saved') {
    return (
      <div id="buyer-workspace-saved" className="bg-slate-50/40 p-4 border border-slate-100 rounded-2xl">
        <div className="space-y-4">
          {savedProperties.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl shadow-xxs space-y-3 max-w-lg mx-auto my-4 transition-all">
              <span className="text-4xl block">✨</span>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">No saved properties available.</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                You haven't bookmarked any tracts yet. Search the land registry and hit the bookmark icon to save blocks here for auditing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedProperties.map(prop => {
                return (
                  <div 
                    key={prop.id}
                    onClick={() => onSelectListing(prop.id)}
                    className="bg-white border-2 border-slate-100 hover:border-emerald-500 hover:shadow-md p-4 rounded-2xl flex items-center justify-between gap-4 cursor-pointer group transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img 
                        src={prop.imageUrl} 
                        alt={prop.title} 
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200/60 shadow-xxs" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-black text-slate-800 truncate group-hover:text-emerald-700 transition-colors">
                          {translateDynamicText(prop.title, currentLanguage)}
                        </h5>
                        <span className="text-[10px] text-slate-505 flex items-center gap-0.5 mt-1 font-semibold truncate">
                          📍 {translateDynamicText(prop.location, currentLanguage)}
                        </span>
                        <div className="flex gap-2 mt-2 items-center flex-wrap">
                          <span className="text-[9px] font-bold font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">{prop.acres} Acres</span>
                          <span className="text-[9px] text-emerald-755 font-black font-mono ml-0.5">${prop.price.toLocaleString()}</span>
                          <span className="text-[8px] font-black tracking-wider text-slate-600 font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-150 uppercase">
                            {prop.zoning}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 select-none">
                      <button
                        id={`unbookmark-${prop.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveBookmark(e, prop.id);
                        }}
                        className="text-[10px] text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-rose-100 font-bold cursor-pointer shrink-0 transition"
                        title="Remove Bookmark"
                      >
                        {getLabel('delete_btn')}
                      </button>
                      <ChevronRight className="h-4 w-4 text-slate-300 shrink-0 group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (viewMode === 'messages') {
    return (
      <div id="buyer-workspace-messages" className="bg-slate-50/40 p-4 border border-slate-100 rounded-2xl">
        <div className="space-y-4">
          {mySentMessages.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl shadow-xxs space-y-3 max-w-lg mx-auto my-4 transition-all">
              <span className="text-4xl block">💬</span>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">No active offers or inquiries available.</h4>
              <p className="text-xs text-slate-505 max-w-sm mx-auto leading-relaxed">
                Your communication log is currently empty. To submit crop crop-tenders, ask planning questions, or place a price counter-offer, click on any land tract and tap the "Send Inquiry" button.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mySentMessages.map(msg => (
                <div key={msg.id} className="bg-white border-2 border-slate-100/90 rounded-2xl p-4.5 space-y-4.5 shadow-3xs hover:border-slate-200 transition duration-300">
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-2.5 border-slate-100">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-550 font-bold">
                      <span className="font-extrabold text-slate-800 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded-md">
                        {msg.type === 'offer' ? getLabel('offer_submitted') : getLabel('question_sent')}
                      </span>
                      <span className="truncate max-w-[200px]">{getLabel('on_word')}{translateDynamicText(msg.propertyName, currentLanguage)}</span>
                    </div>
                    
                    <span className={`text-[9px] font-bold font-mono px-2.5 py-1 rounded-full uppercase border ${
                      msg.status === 'accepted' 
                        ? 'bg-emerald-50 text-emerald-850 border-emerald-200/40' 
                        : msg.status === 'rejected' 
                        ? 'bg-rose-50 text-rose-850 border-rose-200/40' 
                        : msg.status === 'countered' 
                        ? 'bg-blue-50 text-blue-850 border-blue-200/40' 
                        : 'bg-amber-50 text-amber-850 border-amber-200/40 animate-pulse'
                    }`}>
                      {msg.status ? getLabel(`status_${msg.status}`) : getLabel('status_ongoing')}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {msg.type === 'offer' && (
                      <div className="flex items-center gap-2.5 bg-emerald-50/40 border border-emerald-100/40 p-2.5 rounded-xl text-slate-850">
                        <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-mono">{getLabel('offer_price')}</span>
                        <span className="text-emerald-800 font-black font-mono text-sm">${msg.offerPrice?.toLocaleString()}</span>
                        {msg.offerTerms && (
                          <span className="text-[10px] text-slate-555 italic truncate max-w-[200px]">({msg.offerTerms})</span>
                        )}
                      </div>
                    )}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 font-sans font-medium text-slate-700">
                      <span className="text-[9px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider font-mono">{getLabel('my_message')}</span>
                      <p className="italic">"{msg.message}"</p>
                    </div>
                  </div>

                  {msg.agentResponse && (
                    <div className="bg-amber-50/70 border border-amber-150 rounded-xl p-3 space-y-1.5 shadow-3xs">
                      <span className="text-[9px] font-extrabold text-amber-900 uppercase tracking-widest block font-mono">
                        {currentLanguage === 'HI' ? 'सत्यापित विक्रेता की प्रतिक्रिया:' : 'Verified Seller Response:'}
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed italic font-semibold">
                        "{msg.agentResponse}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="buyer-workspace" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col md:grid md:grid-cols-12 md:divide-x md:divide-slate-150">
      
      {/* LEFT COLUMN: Saved Land Plots (Bookmarks) */}
      <div className="md:col-span-5 p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-150">
          <FolderHeart className="h-5 w-5 text-emerald-700" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-805 font-mono">{getLabel('saved_title')}</h4>
            <p className="text-xxs text-slate-500 font-medium">{getLabel('saved_desc')}</p>
          </div>
        </div>

        {savedProperties.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <Bookmark className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 font-medium font-sans">{getLabel('no_saved')}</p>
            <p className="text-xxs text-slate-450 leading-relaxed max-w-[200px] mx-auto">{getLabel('saved_help')}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {savedProperties.map(prop => {
              const zoningInfo = ZONING_RULES[prop.zoning];
              return (
                <div 
                  key={prop.id}
                  onClick={() => onSelectListing(prop.id)}
                  className="bg-slate-50 border border-slate-200 hover:border-slate-350 p-3 rounded-lg flex items-center justify-between gap-3 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={prop.imageUrl} 
                      alt={prop.title} 
                      className="w-12 h-12 rounded object-cover shrink-0 border border-slate-200" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">
                        {translateDynamicText(prop.title, currentLanguage)}
                      </h5>
                      <span className="text-[10px] text-slate-500 flex items-center gap-0.5 mt-0.5 font-medium">
                        📍 {translateDynamicText(prop.location, currentLanguage)}
                      </span>
                      <div className="flex gap-1.5 mt-1 items-center">
                        <span className="text-[9px] font-mono text-slate-500 font-bold">{prop.acres} Ac</span>
                        <span className="text-[9px] text-emerald-700 font-bold font-mono">${prop.price.toLocaleString()}</span>
                        <span className="text-[8px] font-bold text-slate-600 font-mono px-1 rounded bg-slate-200">
                          {prop.zoning}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 text-right justify-between select-none">
                    <button
                      id={`unbookmark-${prop.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(e, prop.id);
                      }}
                      className="text-[10px] text-slate-400 hover:text-red-650 font-bold cursor-pointer shrink-0"
                      title="Remove Bookmark"
                    >
                      {getLabel('delete_btn')}
                    </button>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Submitted Offers & Active message histories */}
      <div className="md:col-span-7 p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-150">
          <MessageCircle className="h-5 w-5 text-emerald-700" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-805 font-mono">{getLabel('neg_title')}</h4>
            <p className="text-xxs text-slate-550 font-medium">{getLabel('neg_desc')}</p>
          </div>
        </div>

        {mySentMessages.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <Send className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 font-medium font-sans">{getLabel('no_neg')}</p>
            <p className="text-xxs text-slate-450 leading-relaxed max-w-[240px] mx-auto">{getLabel('neg_help')}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {mySentMessages.map(msg => (
              <div key={msg.id} className="bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 font-medium">
                    <span className="font-bold text-slate-700 uppercase tracking-wide">
                      {msg.type === 'offer' ? getLabel('offer_submitted') : getLabel('question_sent')}
                    </span>
                    <span>{getLabel('on_word')}{translateDynamicText(msg.propertyName, currentLanguage)}</span>
                  </div>
                  
                  {/* Status pills reflecting agent updates dynamically! */}
                  <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full uppercase border ${
                    msg.status === 'accepted' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                      : msg.status === 'rejected' 
                      ? 'bg-rose-50 text-rose-800 border-rose-100' 
                      : msg.status === 'countered' 
                      ? 'bg-blue-50 text-blue-800 border-blue-100' 
                      : 'bg-slate-100 text-slate-600 border-slate-200 animate-pulse'
                  }`}>
                    {msg.status ? getLabel(`status_${msg.status}`) : getLabel('status_ongoing')}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {msg.type === 'offer' && (
                    <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-lg text-slate-700">
                      <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wide font-mono">{getLabel('offer_price')}</span>
                      <span className="text-emerald-800 font-bold font-mono text-sm">${msg.offerPrice?.toLocaleString()}</span>
                      {msg.offerTerms && (
                        <span className="text-xxs text-slate-500 truncate ml-2">({msg.offerTerms})</span>
                      )}
                    </div>
                  )}
                  <p className="text-slate-655 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/95 font-sans font-medium">
                    <span className="text-[10px] text-slate-450 font-bold block mb-0.5">{getLabel('my_message')}</span>
                    "{msg.message}"
                  </p>
                </div>

                {/* Broker Responses live feed! */}
                {msg.agentResponse && (
                  <div className="bg-amber-50/70 border border-amber-150 rounded-lg p-2.5 space-y-1 shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-800 uppercase tracking-widest block font-mono">{currentLanguage === 'HI' ? 'सत्यापित विक्रेता की प्रतिक्रिया:' : 'Verified Seller Response:'}</span>
                    <p className="text-xs text-slate-750 leading-relaxed italic font-medium">
                      "{msg.agentResponse}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
