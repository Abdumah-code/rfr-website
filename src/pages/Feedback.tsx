import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { adventuresData } from "../data/adventures";
import { getDMs } from "../utils/dms";

export default function Feedback() {
  const [searchParams] = useSearchParams();
  const adventureId = searchParams.get("adventure");

  const adventure = adventureId 
    ? adventuresData.find((a) => a.id === adventureId)
    : null;

  const [playerEmail, setPlayerEmail] = useState('');
  const [dmName, setDmName] = useState(adventure?.dm || '');
  
  const [ratings, setRatings] = useState({
    funRating: 0,
    storyEngagement: 0,
    dmClarity: 0
  });

  const [feedback, setFeedback] = useState({
    bestPart: '',
    balance: '',
    dmStrengths: '',
    improvements: '',
    playAgain: '',
    futureInvite: '',
    futureInfo: '',
    extraFeedback: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [dms, setDms] = useState<string[]>([]);

  useEffect(() => {
    const dmUsers = getDMs();
    setDms(["David", ...dmUsers.map(dm => dm.name)]);
  }, []);

  const resetForm = () => {
    setPlayerEmail('');
    setDmName(adventure?.dm || '');
    setRatings({ funRating: 0, storyEngagement: 0, dmClarity: 0 });
    setFeedback({
      bestPart: '',
      balance: '',
      dmStrengths: '',
      improvements: '',
      playAgain: '',
      futureInvite: '',
      futureInfo: '',
      extraFeedback: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!playerEmail) newErrors.playerEmail = 'E-post krävs';
    if (playerEmail && !playerEmail.includes('@')) newErrors.playerEmail = 'Ogiltig e-post';
    if (!dmName) newErrors.dmName = 'Välj DM';
    if (ratings.funRating === 0) newErrors.funRating = 'Betygsätt sessionen';
    if (ratings.storyEngagement === 0) newErrors.storyEngagement = 'Betygsätt berättelsen';
    if (ratings.dmClarity === 0) newErrors.dmClarity = 'Betygsätt tydlighet';
    if (!feedback.bestPart) newErrors.bestPart = 'Skriv något du gillade';
    if (!feedback.playAgain) newErrors.playAgain = 'Välj ett alternativ';
    if (!feedback.futureInvite) newErrors.futureInvite = 'Välj ett alternativ';
    if (!feedback.futureInfo) newErrors.futureInfo = 'Välj ett alternativ';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateEmailBody = () => {
    let body = '';
    
    body += `🎲 RFR SESSION FEEDBACK\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    body += `📧 Spelare: ${playerEmail}\n`;
    body += `🎭 DM: ${dmName}\n`;
    if (adventure) {
      body += `🗺️ Äventyr: ${adventure.title}\n`;
    }
    body += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    body += `⭐ BETYG\n\n`;
    body += `Hur roligt: ${ratings.funRating}/10 ${'★'.repeat(ratings.funRating)}${'☆'.repeat(10 - ratings.funRating)}\n`;
    body += `Berättelse: ${ratings.storyEngagement}/10 ${'★'.repeat(ratings.storyEngagement)}${'☆'.repeat(10 - ratings.storyEngagement)}\n`;
    body += `DM Tydlighet: ${ratings.dmClarity}/5 ${'★'.repeat(ratings.dmClarity)}${'☆'.repeat(5 - ratings.dmClarity)}\n\n`;

    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    body += `💬 FEEDBACK\n\n`;
    body += `Bästa delen:\n${feedback.bestPart}\n\n`;
    body += `Balans (strid/rollspel/utforskning):\n${feedback.balance || 'Ingen kommentar'}\n\n`;
    body += `DM gjorde bra:\n${feedback.dmStrengths || 'Ingen kommentar'}\n\n`;
    body += `Skulle vela ha annorlunda:\n${feedback.improvements || 'Ingen kommentar'}\n\n`;

    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    body += `🎯 FRAMTIDA SPEL\n\n`;
    body += `Spela igen: ${feedback.playAgain}\n`;
    body += `Inbjudan till framtida spel: ${feedback.futureInvite}\n`;
    body += `Info om framtida äventyr: ${feedback.futureInfo}\n\n`;

    if (feedback.extraFeedback) {
      body += `Övrig feedback:\n${feedback.extraFeedback}\n\n`;
    }

    return body;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      alert('Vänligen fyll i alla obligatoriska fält.');
      return;
    }

    const newFeedback = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      playerEmail,
      dmName,
      adventureTitle: adventure?.title,
      ratings,
      feedback
    };

    const existingFeedbacks = JSON.parse(localStorage.getItem('rfr_feedbacks') || '[]');
    localStorage.setItem('rfr_feedbacks', JSON.stringify([newFeedback, ...existingFeedbacks]));

    setSubmitted(true);
    setTimeout(() => {
      resetForm();
      setSubmitted(false);
    }, 3000);
  };

  const completionPercentage = () => {
    let total = 11;
    let filled = 0;

    if (playerEmail && playerEmail.includes('@')) filled++;
    if (dmName) filled++;
    if (ratings.funRating > 0) filled++;
    if (ratings.storyEngagement > 0) filled++;
    if (ratings.dmClarity > 0) filled++;
    if (feedback.bestPart) filled++;
    if (feedback.balance) filled++;
    if (feedback.playAgain) filled++;
    if (feedback.futureInvite) filled++;
    if (feedback.futureInfo) filled++;
    if (feedback.extraFeedback) filled++;

    return Math.round((filled / total) * 100);
  };

  const StarRating = ({ value, max, onChange, error }: { value: number, max: number, onChange: (val: number) => void, error?: string }) => (
    <div>
      <div className="flex gap-2 mb-2">
        {[...Array(max)].map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1)}
            className={`w-12 h-12 rounded-xl text-2xl transition-all duration-200 cursor-pointer ${
              i < value 
                ? 'bg-gradient-to-br from-amber-400 to-amber-500 border-2 border-amber-400 text-black' 
                : 'bg-slate-400/20 border-2 border-slate-400/30 text-slate-400 hover:bg-amber-400/30 hover:scale-110'
            }`}
          >
            {i < value ? '★' : '☆'}
          </button>
        ))}
      </div>
      <div className="text-sm text-slate-400">
        {value > 0 ? `${value}/${max}` : 'Välj betyg'}
      </div>
      {error && <div className="text-red-300 text-[13px] mt-1">{error}</div>}
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-slate-800/60 p-10 md:p-16 rounded-3xl border-2 border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.2)] backdrop-blur-xl">
          <div className="text-7xl mb-5">✅</div>
          <h1 className="text-3xl mb-3 text-green-300 font-bold">
            Tack för din feedback!
          </h1>
          <p className="text-lg text-slate-400">
            Ditt svar har skickats till DM
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-[min(900px,92%)] mx-auto pb-24">
      <div className="sticky top-[73px] z-40 bg-slate-900/80 border-b border-slate-400/10 py-6 backdrop-blur-md mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold m-0 mb-2 bg-gradient-to-br from-amber-400 to-amber-500 bg-clip-text text-transparent font-mono">
              🎲 RFR Session Feedback
            </h1>
            <p className="m-0 text-slate-400 text-sm">
              {adventure ? `Feedback för: ${adventure.title}` : 'Vad tyckte du om denna session?'}
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <div className="h-2 w-[200px] bg-slate-400/20 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(251,191,36,0.5)]" 
                style={{ width: `${completionPercentage()}%` }} 
              />
            </div>
            <div className="text-[13px] text-slate-400 font-mono">
              {completionPercentage()}% komplett
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Email & DM */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">📧</span>
            Vem är du?
          </h2>

          <div className="grid gap-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium">Din E-post *</label>
              <input
                type="email"
                className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] ${errors.playerEmail ? 'border-red-500' : 'border-slate-400/20'}`}
                value={playerEmail}
                onChange={(e) => setPlayerEmail(e.target.value)}
                placeholder="namn@example.com"
              />
              {errors.playerEmail && <div className="text-red-300 text-[13px] mt-1">{errors.playerEmail}</div>}
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium">Vem var din DM? *</label>
              <select
                className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] cursor-pointer ${errors.dmName ? 'border-red-500' : 'border-slate-400/20'}`}
                value={dmName}
                onChange={(e) => setDmName(e.target.value)}
              >
                <option value="">-- Välj DM --</option>
                {dms.map(dm => (
                  <option key={dm} value={dm}>{dm}</option>
                ))}
              </select>
              {errors.dmName && <div className="text-red-300 text-[13px] mt-1">{errors.dmName}</div>}
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            Betygsätt sessionen
          </h2>

          <div className="grid gap-8">
            <div>
              <label className="block mb-3 text-[15px] font-medium">1. Hur roligt hade du det? (1-10) *</label>
              <StarRating 
                value={ratings.funRating}
                max={10}
                onChange={(val) => setRatings({ ...ratings, funRating: val })}
                error={errors.funRating}
              />
            </div>

            <div>
              <label className="block mb-3 text-[15px] font-medium">2. Hur engagerande var berättelsen? (1-10) *</label>
              <StarRating 
                value={ratings.storyEngagement}
                max={10}
                onChange={(val) => setRatings({ ...ratings, storyEngagement: val })}
                error={errors.storyEngagement}
              />
            </div>

            <div>
              <label className="block mb-3 text-[15px] font-medium">3. Hur tydlig var DM? (1-5) *</label>
              <StarRating 
                value={ratings.dmClarity}
                max={5}
                onChange={(val) => setRatings({ ...ratings, dmClarity: val })}
                error={errors.dmClarity}
              />
            </div>
          </div>
        </div>

        {/* Text Feedback */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">💬</span>
            Feedback
          </h2>

          <div className="grid gap-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium">4. Vad tyckte du bäst om? *</label>
              <textarea
                className={`w-full p-3 bg-slate-900/60 border-2 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] min-h-[110px] resize-y ${errors.bestPart ? 'border-red-500' : 'border-slate-400/20'}`}
                value={feedback.bestPart}
                onChange={(e) => setFeedback({ ...feedback, bestPart: e.target.value })}
                placeholder="Berätta vad som var roligast eller bäst..."
              />
              {errors.bestPart && <div className="text-red-300 text-[13px] mt-1">{errors.bestPart}</div>}
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium">5. Var det lagom mycket strid, rollspel och utforskning?</label>
              <textarea
                className="w-full p-3 bg-slate-900/60 border-2 border-slate-400/20 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] min-h-[110px] resize-y"
                value={feedback.balance}
                onChange={(e) => setFeedback({ ...feedback, balance: e.target.value })}
                placeholder="För mycket strid? För lite rollspel? Perfekt balans?"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium">6. Något DM gjorde extra bra?</label>
              <textarea
                className="w-full p-3 bg-slate-900/60 border-2 border-slate-400/20 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] min-h-[110px] resize-y"
                value={feedback.dmStrengths}
                onChange={(e) => setFeedback({ ...feedback, dmStrengths: e.target.value })}
                placeholder="Beskriv något DM gjorde riktigt bra..."
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium">7. Något du önskar var annorlunda?</label>
              <textarea
                className="w-full p-3 bg-slate-900/60 border-2 border-slate-400/20 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] min-h-[110px] resize-y"
                value={feedback.improvements}
                onChange={(e) => setFeedback({ ...feedback, improvements: e.target.value })}
                placeholder="Konstruktiv kritik är uppskattat..."
              />
            </div>
          </div>
        </div>

        {/* Future Play */}
        <div className="bg-slate-800/40 border border-slate-400/15 rounded-xl p-6 sm:p-8 backdrop-blur-md animate-[slideIn_0.4s_ease-out]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            Framtida spel
          </h2>

          <div className="grid gap-6">
            <div>
              <label className="block mb-3 text-sm font-medium">8. Skulle du vilja spela igen? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Ja', 'Kanske', 'Nej'].map(option => (
                  <div
                    key={option}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      feedback.playAgain === option 
                        ? 'bg-amber-400/20 border-amber-400 text-amber-400' 
                        : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                    onClick={() => setFeedback({ ...feedback, playAgain: option })}
                  >
                    {option}
                  </div>
                ))}
              </div>
              {errors.playAgain && <div className="text-red-300 text-[13px] mt-1">{errors.playAgain}</div>}
            </div>

            <div>
              <label className="block mb-3 text-sm font-medium">9. Vill du bli inbjuden till framtida spel? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Ja', 'Nej'].map(option => (
                  <div
                    key={option}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      feedback.futureInvite === option 
                        ? 'bg-amber-400/20 border-amber-400 text-amber-400' 
                        : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                    onClick={() => setFeedback({ ...feedback, futureInvite: option })}
                  >
                    {option}
                  </div>
                ))}
              </div>
              {errors.futureInvite && <div className="text-red-300 text-[13px] mt-1">{errors.futureInvite}</div>}
            </div>

            <div>
              <label className="block mb-3 text-sm font-medium">10. Vill du få info om framtida äventyr? *</label>
              <div className="flex gap-3 flex-wrap">
                {['Ja', 'Nej'].map(option => (
                  <div
                    key={option}
                    className={`py-3 px-5 bg-slate-900/60 border-2 rounded-lg cursor-pointer transition-all text-[15px] ${
                      feedback.futureInfo === option 
                        ? 'bg-amber-400/20 border-amber-400 text-amber-400' 
                        : 'border-slate-400/20 hover:border-amber-400/50'
                    }`}
                    onClick={() => setFeedback({ ...feedback, futureInfo: option })}
                  >
                    {option}
                  </div>
                ))}
              </div>
              {errors.futureInfo && <div className="text-red-300 text-[13px] mt-1">{errors.futureInfo}</div>}
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium">Övrig feedback</label>
              <textarea
                className="w-full p-3 bg-slate-900/60 border-2 border-slate-400/20 rounded-lg text-slate-200 text-[15px] transition-all focus:outline-none focus:border-amber-400 focus:bg-slate-900/80 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] min-h-[80px] resize-y"
                value={feedback.extraFeedback}
                onChange={(e) => setFeedback({ ...feedback, extraFeedback: e.target.value })}
                placeholder="Något mer du vill dela med dig av?"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="sticky bottom-6 bg-slate-900/95 border-2 border-amber-400/30 rounded-2xl p-6 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.3),0_0_40px_rgba(251,191,36,0.2)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-lg font-semibold mb-1">
                Redo att skicka?
              </div>
              <div className="text-sm text-slate-400">
                Tack för att du delar din feedback!
              </div>
            </div>

            <button
              className="w-full sm:w-auto py-4 px-8 rounded-lg font-semibold cursor-pointer transition-all duration-200 border-none text-base bg-gradient-to-br from-amber-400 to-amber-500 text-black shadow-[0_4px_12px_rgba(251,191,36,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(251,191,36,0.4)]"
              onClick={handleSubmit}
            >
              🎲 Skicka feedback
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

