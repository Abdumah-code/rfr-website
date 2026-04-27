import { useState } from "react";

export default function ApplyForDM() {
  const [step, setStep] = useState<'form' | 'summary'>('form');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    languages: [] as string[],
    otherLanguage: '',
    experienceTime: '',
    systems: [] as string[],
    otherSystem: '',
    sessionCount: '',
    playStyle: [] as string[],
    balance: '',
    format: '',
    irlContent: '',
    visuals: [] as string[],
    tools: [] as string[],
    otherTool: '',
    sessionType: '',
    sessionLength: '',
    wantsPayment: '',
    price: '',
    freeTrial: '',
    playTimes: [] as string[],
    frequency: '',
    targetPlayers: '',
    guideNew: '',
    gameTone: '',
    ruleStrictness: '',
    conflictHandling: '',
    presentation: '',
    contactMethod: '',
    contactDiscord: '',
    contactEmail: '',
    contactPhone: '',
    consentGiven: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [profilePicName, setProfilePicName] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Namn krävs';
    if (!formData.age.trim()) newErrors.age = 'Ålder krävs';
    if (!formData.location.trim()) newErrors.location = 'Land/stad krävs';
    if (formData.languages.length === 0) newErrors.languages = 'Välj minst ett språk';
    if (formData.languages.includes('Annat') && !formData.otherLanguage.trim()) newErrors.otherLanguage = 'Specificera språk';

    if (!formData.experienceTime.trim()) newErrors.experienceTime = 'Erfarenhet krävs';
    if (formData.systems.length === 0) newErrors.systems = 'Välj minst ett system';
    if (formData.systems.includes('Annat') && !formData.otherSystem.trim()) newErrors.otherSystem = 'Specificera system';
    if (!formData.sessionCount.trim()) newErrors.sessionCount = 'Antal sessions krävs';

    if (formData.playStyle.length === 0) newErrors.playStyle = 'Välj minst en spelstil';
    if (!formData.balance) newErrors.balance = 'Välj balans';

    if (!formData.format) newErrors.format = 'Välj format';
    if ((formData.format === 'IRL' || formData.format === 'Båda') && !formData.irlContent.trim()) newErrors.irlContent = 'Ange stad/område';
    if (formData.visuals.length === 0) newErrors.visuals = 'Välj minst ett visuellt format';

    if (!formData.sessionType) newErrors.sessionType = 'Välj typ av sessions';
    if (!formData.sessionLength.trim()) newErrors.sessionLength = 'Ange sessionslängd';

    if (!formData.wantsPayment) newErrors.wantsPayment = 'Välj betalningsalternativ';
    if ((formData.wantsPayment === 'Ja' || formData.wantsPayment === 'Ibland') && !formData.price.trim()) newErrors.price = 'Ange pris';
    if (!formData.freeTrial) newErrors.freeTrial = 'Välj alternativ';

    if (formData.playTimes.length === 0) newErrors.playTimes = 'Välj minst en tid';
    if (!formData.frequency) newErrors.frequency = 'Välj frekvens';

    if (!formData.targetPlayers) newErrors.targetPlayers = 'Välj spelartyp';
    if (!formData.guideNew) newErrors.guideNew = 'Välj alternativ';
    if (!formData.gameTone) newErrors.gameTone = 'Välj ton';

    if (!formData.ruleStrictness) newErrors.ruleStrictness = 'Välj regelstriktness';
    if (!formData.conflictHandling.trim()) newErrors.conflictHandling = 'Beskriv hur du hanterar konflikter';

    if (!formData.presentation.trim()) newErrors.presentation = 'Bion är obligatorisk';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckboxChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const currentList = prev[field] as string[];
      if (currentList.includes(value)) {
        return { ...prev, [field]: currentList.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...currentList, value] };
      }
    });
  };

  const handleRadioChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProceed = () => {
    if (!validateForm()) {
      alert('Vänligen fyll i alla obligatoriska fält.');
      return;
    }
    setErrors({});
    setStep('summary');
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.contactMethod) newErrors.contactMethod = 'Välj hur du vill bli kontaktad';
    if (formData.contactMethod === 'Discord' && !formData.contactDiscord.trim()) newErrors.contactDiscord = 'Ange ditt Discord-namn';
    if (formData.contactMethod === 'E-post' && !formData.contactEmail.trim()) newErrors.contactEmail = 'Ange din e-postadress';
    if (formData.contactMethod === 'Telefon' && !formData.contactPhone.trim()) newErrors.contactPhone = 'Ange ditt telefonnummer';
    if (!formData.consentGiven) newErrors.consentGiven = 'Samtycke krävs för att skicka ansökan';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo(0, document.body.scrollHeight);
      alert('Vänligen fyll i dina kontaktuppgifter och godkänn villkoren.');
      return;
    }

    setErrors({});
    console.log("DM Application Data:", formData, profilePicName);
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setStep('form');
      window.scrollTo(0, 0);
    }, 4000);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-slate-800/60 p-10 md:p-16 rounded-3xl border-2 border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.2)] backdrop-blur-xl">
          <div className="text-7xl mb-5">🎉</div>
          <h1 className="text-3xl mb-3 text-green-300 font-bold">
            Tack för din ansökan!
          </h1>
          <p className="text-lg text-slate-400">
            Vi kollar igenom den och hör av oss snart!
          </p>
        </div>
      </div>
    );
  }

  const SummaryItem = ({ label, value }: { label: string, value: string | string[] }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    const displayValue = Array.isArray(value) ? value.join(', ') : value;
    return (
      <div className="border-b border-slate-400/10 py-3">
        <div className="text-sm text-slate-400 mb-1">{label}</div>
        <div className="text-slate-200 whitespace-pre-wrap">{displayValue}</div>
      </div>
    );
  };

  if (step === 'summary') {
    const finalLanguages = formData.languages.map(l => l === 'Annat' ? formData.otherLanguage : l);
    const finalSystems = formData.systems.map(s => s === 'Annat' ? formData.otherSystem : s);
    const finalTools = formData.tools.map(t => t === 'Annat' ? formData.otherTool : t);

    return (
      <section className="w-[min(900px,92%)] mx-auto pb-24">
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out] mt-8">
          <h2 className="text-2xl font-bold mb-6 text-amber-400">Sammanfattning av din ansökan</h2>
          
          <div className="space-y-1 bg-slate-900/40 p-6 rounded-lg border border-slate-400/20">
            <SummaryItem label="Namn" value={formData.name} />
            <SummaryItem label="Ålder" value={formData.age} />
            <SummaryItem label="Land/stad" value={formData.location} />
            <SummaryItem label="Språk" value={finalLanguages} />
            
            <SummaryItem label="Erfarenhet (tid)" value={formData.experienceTime} />
            <SummaryItem label="System" value={finalSystems} />
            <SummaryItem label="Antal sessions" value={formData.sessionCount} />
            
            <SummaryItem label="Spelstil" value={formData.playStyle} />
            <SummaryItem label="Balans (RP vs Combat)" value={formData.balance} />
            
            <SummaryItem label="Format" value={formData.format} />
            <SummaryItem label="IRL Stad/Område" value={formData.irlContent} />
            <SummaryItem label="Visuell presentation" value={formData.visuals} />
            <SummaryItem label="Verktyg" value={finalTools} />
            
            <SummaryItem label="Typ av sessions" value={formData.sessionType} />
            <SummaryItem label="Sessionslängd" value={formData.sessionLength} />
            
            <SummaryItem label="Ta betalt?" value={formData.wantsPayment} />
            {formData.wantsPayment !== 'Nej' && <SummaryItem label="Pris" value={`${formData.price} kr`} />}
            <SummaryItem label="Gratis prova-på" value={formData.freeTrial} />
            
            <SummaryItem label="Speltider" value={formData.playTimes} />
            <SummaryItem label="Frekvens" value={formData.frequency} />
            
            <SummaryItem label="Riktar sig till" value={formData.targetPlayers} />
            <SummaryItem label="För nya spelare?" value={formData.guideNew} />
            <SummaryItem label="Ton på spelet" value={formData.gameTone} />
            
            <SummaryItem label="Regelstriktness" value={formData.ruleStrictness} />
            <SummaryItem label="Konflikthantering" value={formData.conflictHandling} />
            
            <SummaryItem label="Presentation/Bio" value={formData.presentation} />
            {profilePicName && <SummaryItem label="Profilbild (filnamn)" value={profilePicName} />}
          </div>

          <div className="mt-8 bg-slate-900/40 p-6 sm:p-8 rounded-xl border border-slate-400/20">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="text-2xl">📬</span> Kontakt & Samtycke
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block mb-3 text-sm font-medium">Hur vill du bli kontaktad? *</label>
                <div className="flex gap-3 flex-wrap">
                  {['Discord', 'E-post', 'Telefon'].map(method => (
                    <div
                      key={method}
                      onClick={() => {
                        handleRadioChange('contactMethod', method);
                        setErrors(prev => ({ ...prev, contactMethod: '', contactDiscord: '', contactEmail: '', contactPhone: '' }));
                      }}
                      className={`py-3 px-5 bg-slate-800/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                        formData.contactMethod === method ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                      }`}
                    >
                      {method}
                    </div>
                  ))}
                </div>
                {errors.contactMethod && <div className="text-red-300 text-[13px] mt-1">{errors.contactMethod}</div>}
              </div>

              {formData.contactMethod === 'Discord' && (
                <div className="animate-[fadeIn_0.2s_ease-out]">
                  <label className="block mb-1.5 text-sm font-medium">Ange ditt Discord-namn (t.ex. David#1234 eller användar-ID) *</label>
                  <input
                    type="text"
                    className={`w-full p-3 bg-slate-800/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-800/80 ${errors.contactDiscord ? 'border-red-500' : 'border-slate-400/20'}`}
                    value={formData.contactDiscord}
                    onChange={e => handleTextChange('contactDiscord', e.target.value)}
                  />
                  {errors.contactDiscord && <div className="text-red-300 text-[13px] mt-1">{errors.contactDiscord}</div>}
                </div>
              )}

              {formData.contactMethod === 'E-post' && (
                <div className="animate-[fadeIn_0.2s_ease-out]">
                  <label className="block mb-1.5 text-sm font-medium">Ange din e-postadress *</label>
                  <input
                    type="email"
                    className={`w-full p-3 bg-slate-800/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-800/80 ${errors.contactEmail ? 'border-red-500' : 'border-slate-400/20'}`}
                    value={formData.contactEmail}
                    onChange={e => handleTextChange('contactEmail', e.target.value)}
                  />
                  {errors.contactEmail && <div className="text-red-300 text-[13px] mt-1">{errors.contactEmail}</div>}
                </div>
              )}

              {formData.contactMethod === 'Telefon' && (
                <div className="animate-[fadeIn_0.2s_ease-out]">
                  <label className="block mb-1.5 text-sm font-medium">Ange ditt telefonnummer *</label>
                  <input
                    type="tel"
                    className={`w-full p-3 bg-slate-800/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-800/80 ${errors.contactPhone ? 'border-red-500' : 'border-slate-400/20'}`}
                    value={formData.contactPhone}
                    onChange={e => handleTextChange('contactPhone', e.target.value)}
                  />
                  {errors.contactPhone && <div className="text-red-300 text-[13px] mt-1">{errors.contactPhone}</div>}
                </div>
              )}

              <div className="pt-4 border-t border-slate-400/10">
                <label className="flex items-start gap-4 cursor-pointer group hover:bg-slate-800/30 p-2 -ml-2 rounded-lg transition-colors">
                  <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-6 h-6 border-2 border-slate-400/30 rounded-md checked:bg-amber-400 checked:border-amber-400 transition-all cursor-pointer bg-slate-800"
                      checked={formData.consentGiven}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, consentGiven: e.target.checked }));
                        if (e.target.checked) setErrors(prev => ({ ...prev, consentGiven: '' }));
                      }}
                    />
                    <div className="absolute text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-200 font-medium select-none group-hover:text-amber-200 transition-colors">
                      Jag godkänner att Roll for Roleplay kontaktar mig via vald kontaktmetod angående min ansökan som spelledare. *
                    </span>
                    <p className="text-slate-400 text-[13px] mt-2 select-none">
                      Vi använder endast dina uppgifter för att hantera din ansökan. Du kan när som helst begära att dina uppgifter raderas.
                    </p>
                  </div>
                </label>
                {errors.consentGiven && <div className="text-red-300 text-[13px] mt-2 ml-10">{errors.consentGiven}</div>}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
             <button
              onClick={() => { setStep('form'); window.scrollTo(0, 0); }}
              className="w-full sm:w-auto py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-200 bg-slate-800 border border-slate-400/30 text-white hover:bg-slate-700"
            >
              Tillbaka & Redigera
            </button>
            <button
              onClick={handleFinalSubmit}
              className="w-full sm:w-auto py-4 px-8 rounded-lg font-semibold cursor-pointer transition-all duration-200 border-none text-base bg-gradient-to-br from-amber-400 to-amber-500 text-black shadow-[0_4px_12px_rgba(251,191,36,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(251,191,36,0.4)]"
            >
              📝 Skicka ansökan
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-[min(900px,92%)] mx-auto pb-24">
      <div className="sticky top-[73px] z-40 bg-slate-900/80 border-b border-slate-400/10 py-6 backdrop-blur-md mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold m-0 mb-2 bg-gradient-to-br from-amber-400 to-amber-500 bg-clip-text text-transparent font-mono">
              📝 Apply for DM
            </h1>
            <p className="m-0 text-slate-400 text-sm">
              Vill du bli en del av RFR DM Team? Fyll i ansökan nedan!
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Grundinfo */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">🌍</span> Grundinfo
          </h2>
          <div className="grid gap-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium">Namn *</label>
              <input
                type="text"
                className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 ${errors.name ? 'border-red-500' : 'border-slate-400/20'}`}
                value={formData.name}
                onChange={e => handleTextChange('name', e.target.value)}
              />
              {errors.name && <div className="text-red-300 text-[13px] mt-1">{errors.name}</div>}
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium">Ålder *</label>
              <input
                type="text"
                className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 ${errors.age ? 'border-red-500' : 'border-slate-400/20'}`}
                value={formData.age}
                onChange={e => handleTextChange('age', e.target.value)}
              />
              {errors.age && <div className="text-red-300 text-[13px] mt-1">{errors.age}</div>}
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium">Stad *</label>
              <input
                type="text"
                className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 ${errors.location ? 'border-red-500' : 'border-slate-400/20'}`}
                value={formData.location}
                onChange={e => handleTextChange('location', e.target.value)}
              />
              {errors.location && <div className="text-red-300 text-[13px] mt-1">{errors.location}</div>}
            </div>
            <div>
              <label className="block mb-3 text-sm font-medium">Språk: *</label>
              <div className="flex gap-3 flex-wrap">
                {['Svenska', 'Engelska', 'Annat'].map(lang => (
                  <div
                    key={lang}
                    onClick={() => handleCheckboxChange('languages', lang)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.languages.includes(lang) ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {lang}
                  </div>
                ))}
              </div>
              {errors.languages && <div className="text-red-300 text-[13px] mt-1">{errors.languages}</div>}
              {formData.languages.includes('Annat') && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Specificera..."
                    className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 ${errors.otherLanguage ? 'border-red-500' : 'border-slate-400/20'}`}
                    value={formData.otherLanguage}
                    onChange={e => handleTextChange('otherLanguage', e.target.value)}
                  />
                  {errors.otherLanguage && <div className="text-red-300 text-[13px] mt-1">{errors.otherLanguage}</div>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Erfarenhet som DM */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">🎲</span> Erfarenhet som DM
          </h2>
          <div className="grid gap-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium">Hur länge har du varit spelledare? *</label>
              <input
                type="text"
                className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 ${errors.experienceTime ? 'border-red-500' : 'border-slate-400/20'}`}
                value={formData.experienceTime}
                onChange={e => handleTextChange('experienceTime', e.target.value)}
              />
              {errors.experienceTime && <div className="text-red-300 text-[13px] mt-1">{errors.experienceTime}</div>}
            </div>
            <div>
              <label className="block mb-3 text-sm font-medium">Vilka system har du lett spel i? *</label>
              <div className="flex gap-3 flex-wrap">
                {['D&D 5e (2014 / 2024)', 'Pathfinder', 'Call of Cthulhu', 'LOTR Roleplay', 'Annat'].map(sys => (
                  <div
                    key={sys}
                    onClick={() => handleCheckboxChange('systems', sys)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.systems.includes(sys) ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {sys}
                  </div>
                ))}
              </div>
              {errors.systems && <div className="text-red-300 text-[13px] mt-1">{errors.systems}</div>}
              {formData.systems.includes('Annat') && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Vilket system?"
                    className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 ${errors.otherSystem ? 'border-red-500' : 'border-slate-400/20'}`}
                    value={formData.otherSystem}
                    onChange={e => handleTextChange('otherSystem', e.target.value)}
                  />
                  {errors.otherSystem && <div className="text-red-300 text-[13px] mt-1">{errors.otherSystem}</div>}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium">Hur många sessions har du ungefär hållit? *</label>
              <input
                type="text"
                className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 ${errors.sessionCount ? 'border-red-500' : 'border-slate-400/20'}`}
                value={formData.sessionCount}
                onChange={e => handleTextChange('sessionCount', e.target.value)}
              />
              {errors.sessionCount && <div className="text-red-300 text-[13px] mt-1">{errors.sessionCount}</div>}
            </div>
          </div>
        </div>

        {/* Din spelstil */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">🎭</span> Din spelstil
          </h2>
          <div className="grid gap-6">
            <div>
              <label className="block mb-3 text-sm font-medium">Hur skulle du beskriva din stil? (flerval) *</label>
              <div className="flex gap-3 flex-wrap">
                {['🎭 Roleplay-fokuserad', '⚔️ Combat-fokuserad', '🧠 Story & narrativ', '🧩 Pussel & exploration', '🎲 Casual / humor', '🧟 Dark / serious'].map(style => (
                  <div
                    key={style}
                    onClick={() => handleCheckboxChange('playStyle', style)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.playStyle.includes(style) ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {style}
                  </div>
                ))}
              </div>
              {errors.playStyle && <div className="text-red-300 text-[13px] mt-1">{errors.playStyle}</div>}
            </div>
            <div>
              <label className="block mb-3 text-sm font-medium">Hur balanserar du RP vs combat? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Mest RP', 'Mix', 'Mest combat'].map(opt => (
                  <div
                    key={opt}
                    onClick={() => handleRadioChange('balance', opt)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.balance === opt ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              {errors.balance && <div className="text-red-300 text-[13px] mt-1">{errors.balance}</div>}
            </div>
          </div>
        </div>

        {/* Hur du spelar */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">🗺️</span> Hur du spelar
          </h2>
          <div className="grid gap-6">
            <div>
              <label className="block mb-3 text-sm font-medium">Vilka format kan du köra? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Online', 'IRL', 'Båda'].map(opt => (
                  <div
                    key={opt}
                    onClick={() => handleRadioChange('format', opt)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.format === opt ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              {errors.format && <div className="text-red-300 text-[13px] mt-1">{errors.format}</div>}
              {(formData.format === 'IRL' || formData.format === 'Båda') && (
                <div className="mt-3">
                  <label className="block mb-1.5 text-sm font-medium text-slate-400">Om IRL, vilken stad/område? *</label>
                  <input
                    type="text"
                    className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 ${errors.irlContent ? 'border-red-500' : 'border-slate-400/20'}`}
                    value={formData.irlContent}
                    onChange={e => handleTextChange('irlContent', e.target.value)}
                  />
                  {errors.irlContent && <div className="text-red-300 text-[13px] mt-1">{errors.irlContent}</div>}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-3 text-sm font-medium">Hur presenterar du spelet visuellt? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Theater of the Mind', 'Battlemap (digital)', 'Minis & terräng (IRL)', 'Mix'].map(v => (
                  <div
                    key={v}
                    onClick={() => handleCheckboxChange('visuals', v)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.visuals.includes(v) ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {v}
                  </div>
                ))}
              </div>
              {errors.visuals && <div className="text-red-300 text-[13px] mt-1">{errors.visuals}</div>}
            </div>
            <div>
              <label className="block mb-3 text-sm font-medium">Vilka verktyg använder du? (valfri)</label>
              <div className="flex gap-3 flex-wrap">
                {['Roll20', 'Foundry', 'Discord', 'D&D Beyond', 'Annat'].map(t => (
                  <div
                    key={t}
                    onClick={() => handleCheckboxChange('tools', t)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.tools.includes(t) ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {t}
                  </div>
                ))}
              </div>
              {formData.tools.includes('Annat') && (
                <input
                  type="text"
                  placeholder="Vilka andra verktyg?"
                  className="mt-3 w-full p-3 bg-slate-900/60 border-2 border-slate-400/20 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80"
                  value={formData.otherTool}
                  onChange={e => handleTextChange('otherTool', e.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sessionsupplägg */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">⏱️</span> Sessionsupplägg
          </h2>
          <div className="grid gap-6">
            <div>
              <label className="block mb-3 text-sm font-medium">Vilka typer av sessions erbjuder du? *</label>
              <div className="flex gap-3 flex-wrap">
                {['One-shots', 'Kampanjer', 'Båda'].map(opt => (
                  <div
                    key={opt}
                    onClick={() => handleRadioChange('sessionType', opt)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.sessionType === opt ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              {errors.sessionType && <div className="text-red-300 text-[13px] mt-1">{errors.sessionType}</div>}
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium">Hur långa är dina sessions? *</label>
              <input
                type="text"
                placeholder="T.ex. 3-4 timmar"
                className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 ${errors.sessionLength ? 'border-red-500' : 'border-slate-400/20'}`}
                value={formData.sessionLength}
                onChange={e => handleTextChange('sessionLength', e.target.value)}
              />
              {errors.sessionLength && <div className="text-red-300 text-[13px] mt-1">{errors.sessionLength}</div>}
            </div>
          </div>
        </div>

        {/* Betalning */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">💰</span> Betalning
          </h2>
          <div className="grid gap-6">
            <div>
              <label className="block mb-3 text-sm font-medium">Vill du ta betalt? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Ja', 'Nej', 'Ibland'].map(opt => (
                  <div
                    key={opt}
                    onClick={() => handleRadioChange('wantsPayment', opt)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.wantsPayment === opt ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              {errors.wantsPayment && <div className="text-red-300 text-[13px] mt-1">{errors.wantsPayment}</div>}
              {(formData.wantsPayment === 'Ja' || formData.wantsPayment === 'Ibland') && (
                <div className="mt-3">
                  <label className="block mb-1.5 text-sm font-medium text-slate-400">Pris per spelare (kr) *</label>
                  <input
                    type="text"
                    className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 ${errors.price ? 'border-red-500' : 'border-slate-400/20'}`}
                    value={formData.price}
                    onChange={e => handleTextChange('price', e.target.value)}
                  />
                  {errors.price && <div className="text-red-300 text-[13px] mt-1">{errors.price}</div>}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-3 text-sm font-medium">Är du öppen för gratis prova-på sessioner? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Ja', 'Nej'].map(opt => (
                  <div
                    key={opt}
                    onClick={() => handleRadioChange('freeTrial', opt)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.freeTrial === opt ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              {errors.freeTrial && <div className="text-red-300 text-[13px] mt-1">{errors.freeTrial}</div>}
            </div>
          </div>
        </div>

        {/* Tillgänglighet */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">🌟</span> Tillgänglighet
          </h2>
          <div className="grid gap-6">
            <div>
              <label className="block mb-3 text-sm font-medium">När spelar du oftast? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Vardagar kväll', 'Helger', 'Flexibel'].map(t => (
                  <div
                    key={t}
                    onClick={() => handleCheckboxChange('playTimes', t)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.playTimes.includes(t) ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {t}
                  </div>
                ))}
              </div>
              {errors.playTimes && <div className="text-red-300 text-[13px] mt-1">{errors.playTimes}</div>}
            </div>
            <div>
              <label className="block mb-3 text-sm font-medium">Hur ofta vill du hålla sessions? *</label>
              <div className="flex gap-3 flex-wrap">
                {['1 gång / vecka', '2–3 gånger / vecka', '1 gång per månad'].map(opt => (
                  <div
                    key={opt}
                    onClick={() => handleRadioChange('frequency', opt)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.frequency === opt ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              {errors.frequency && <div className="text-red-300 text-[13px] mt-1">{errors.frequency}</div>}
            </div>
          </div>
        </div>

        {/* Spelartyper & preferenser */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">🧑‍🤝‍🧑</span> Spelartyper & preferenser
          </h2>
          <div className="grid gap-6">
            <div>
              <label className="block mb-3 text-sm font-medium">Vilka spelare riktar du dig till? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Nybörjare', 'Blandat', 'Erfarna'].map(opt => (
                  <div
                    key={opt}
                    onClick={() => handleRadioChange('targetPlayers', opt)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.targetPlayers === opt ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              {errors.targetPlayers && <div className="text-red-300 text-[13px] mt-1">{errors.targetPlayers}</div>}
            </div>
            <div>
              <label className="block mb-3 text-sm font-medium">Är du bekväm med att guida nya spelare? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Ja', 'Nej'].map(opt => (
                  <div
                    key={opt}
                    onClick={() => handleRadioChange('guideNew', opt)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.guideNew === opt ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              {errors.guideNew && <div className="text-red-300 text-[13px] mt-1">{errors.guideNew}</div>}
            </div>
            <div>
              <label className="block mb-3 text-sm font-medium">Vilken ton har dina spel? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Lättsam', 'Seriös', 'Mix'].map(opt => (
                  <div
                    key={opt}
                    onClick={() => handleRadioChange('gameTone', opt)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.gameTone === opt ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              {errors.gameTone && <div className="text-red-300 text-[13px] mt-1">{errors.gameTone}</div>}
            </div>
          </div>
        </div>

        {/* Regler & DM-approach */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">⚖️</span> Regler & DM-approach
          </h2>
          <div className="grid gap-6">
            <div>
              <label className="block mb-3 text-sm font-medium">Hur strikt följer du regler? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Rules as Written', 'Flexibel', 'Rule of Cool'].map(opt => (
                  <div
                    key={opt}
                    onClick={() => handleRadioChange('ruleStrictness', opt)}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      formData.ruleStrictness === opt ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              {errors.ruleStrictness && <div className="text-red-300 text-[13px] mt-1">{errors.ruleStrictness}</div>}
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium">Hur hanterar du konflikter vid bordet? *</label>
              <textarea
                className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 min-h-[110px] resize-y ${errors.conflictHandling ? 'border-red-500' : 'border-slate-400/20'}`}
                value={formData.conflictHandling}
                onChange={e => handleTextChange('conflictHandling', e.target.value)}
                placeholder="Beskriv kort din approach..."
              />
              {errors.conflictHandling && <div className="text-red-300 text-[13px] mt-1">{errors.conflictHandling}</div>}
            </div>
          </div>
        </div>

        {/* Presentation */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">✍️</span> Presentation
          </h2>
          <div>
            <label className="block mb-1.5 text-sm font-medium">Beskriv dig själv som DM (typ bio) *</label>
            <textarea
              className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 min-h-[160px] resize-y ${errors.presentation ? 'border-red-500' : 'border-slate-400/20'}`}
              value={formData.presentation}
              onChange={e => handleTextChange('presentation', e.target.value)}
              placeholder="Berätta lite om dig själv! Vem är du bakom systemet, varför du är en bra DM, vad du gillar etc."
            />
            {errors.presentation && <div className="text-red-300 text-[13px] mt-1">{errors.presentation}</div>}
          </div>
        </div>

        {/* Extra */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">🖼️</span> Extra
          </h2>
          <div>
            <label className="block mb-1.5 text-sm font-medium">Profilbild (valfri)</label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-slate-400
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-amber-400/20 file:text-amber-400
                hover:file:bg-amber-400/30 file:cursor-pointer cursor-pointer transition-colors"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) setProfilePicName(file.name);
              }}
            />
          </div>
        </div>

        {/* Proceed Step */}
        <div className="sticky bottom-6 bg-slate-900/95 border-2 border-amber-400/30 rounded-2xl p-6 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.3),0_0_40px_rgba(251,191,36,0.2)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-lg font-semibold mb-1">
                Redo att granska?
              </div>
              <div className="text-sm text-slate-400">
                Se över dina svar innan du skickar.
              </div>
            </div>

            <button
              className="w-full sm:w-auto py-4 px-8 rounded-lg font-semibold cursor-pointer transition-all duration-200 border-none text-base bg-gradient-to-br from-amber-400 to-amber-500 text-black shadow-[0_4px_12px_rgba(251,191,36,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(251,191,36,0.4)] flex items-center justify-center gap-2"
              onClick={handleProceed}
            >
              Gå vidare ➡️
            </button>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-3 px-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-300">
              <span>⚠️</span>
              <span>Vänligen fyll i alla obligatoriska fält</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
