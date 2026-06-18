import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

interface FeedbackSubmission {
  id: string;
  date: string;
  playerEmail: string;
  dmName: string;
  adventureTitle?: string;
  ratings: {
    funRating: number;
    storyEngagement: number;
    dmClarity: number;
  };
  feedback: {
    bestPart: string;
    balance: string;
    dmStrengths: string;
    improvements: string;
    playAgain: string;
    futureInvite: string;
    futureInfo: string;
    extraFeedback: string;
  };
}

export default function Mail() {
  const { loggedInUser } = useOutletContext<{ loggedInUser: string | null }>();
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]);
  const [selected, setSelected] = useState<FeedbackSubmission | null>(null);

  useEffect(() => {
    if (!loggedInUser) return;
    const stored = JSON.parse(localStorage.getItem('rfr_feedbacks') || '[]');
    // Filters by loggedInUser username (stored in lowercase in the database/session)
    const dmFeedbacks = stored.filter((f: FeedbackSubmission) => f.dmName?.toLowerCase() === loggedInUser.toLowerCase());
    setFeedbacks(dmFeedbacks);
  }, [loggedInUser]);

  return (
    <section className="w-[min(1100px,92%)] mx-auto pb-12">
      <h1 className="text-[clamp(34px,4.3vw,58px)] leading-[1.05] m-0 mb-4 font-bold">
        Inkorg
      </h1>
      
      <div className="rounded-[18px] bg-card border border-stroke backdrop-blur-[12px] shadow-[0_18px_60px_rgba(0,0,0,0.55)] overflow-hidden flex min-h-[600px] max-h-[80vh]">
        {/* Sidebar / List */}
        <div className={`w-full md:w-1/3 border-r border-stroke flex-col ${selected ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-stroke bg-black/20">
            <h2 className="text-lg font-bold m-0">Meddelanden ({feedbacks.length})</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {feedbacks.length === 0 ? (
              <div className="p-8 text-center text-muted">
                Inga nya meddelanden
              </div>
            ) : (
              feedbacks.map(f => (
                <div 
                  key={f.id}
                  onClick={() => setSelected(f)}
                  className={`p-4 border-b border-stroke cursor-pointer transition-colors hover:bg-white/5 ${selected?.id === f.id ? 'bg-white/10' : ''}`}
                >
                  <div className="font-bold truncate">{f.playerEmail}</div>
                  <div className="text-sm text-amber-400 truncate">{f.adventureTitle || 'Allmän Feedback'}</div>
                  <div className="text-xs text-muted mt-2">
                    {new Date(f.date).toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className={`w-full md:w-2/3 flex-col ${!selected ? 'hidden md:flex' : 'flex'}`}>
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted p-8 text-center">
              <div className="text-5xl mb-4">📭</div>
              <p>Välj ett meddelande för att läsa</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 border-b border-stroke bg-black/20 flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold m-0 mb-2">{selected.adventureTitle ? `Feedback: ${selected.adventureTitle}` : 'Feedback'}</h2>
                  <div className="text-muted">Från: <span className="text-white">{selected.playerEmail}</span></div>
                  <div className="text-muted text-sm mt-1">
                    {new Date(selected.date).toLocaleString('sv-SE')}
                  </div>
                </div>
                <button 
                  onClick={() => setSelected(null)}
                  className="md:hidden px-3 py-1.5 rounded-lg bg-white/10 text-sm hover:bg-white/20 transition-colors border-0 cursor-pointer text-white"
                >
                  Gå tillbaka
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Ratings */}
                <section>
                  <h3 className="text-lg font-bold mb-4 text-amber-400 border-b border-stroke pb-2">⭐ Betyg</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-black/20 p-4 rounded-xl border border-stroke">
                      <div className="text-sm text-muted mb-1">Hur roligt</div>
                      <div className="text-2xl font-bold">{selected.ratings.funRating}<span className="text-muted text-lg">/10</span></div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl border border-stroke">
                      <div className="text-sm text-muted mb-1">Berättelse</div>
                      <div className="text-2xl font-bold">{selected.ratings.storyEngagement}<span className="text-muted text-lg">/10</span></div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl border border-stroke">
                      <div className="text-sm text-muted mb-1">DM Tydlighet</div>
                      <div className="text-2xl font-bold">{selected.ratings.dmClarity}<span className="text-muted text-lg">/5</span></div>
                    </div>
                  </div>
                </section>

                {/* Text Feedback */}
                <section>
                  <h3 className="text-lg font-bold mb-4 text-amber-400 border-b border-stroke pb-2">💬 Kommentarer</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-bold text-muted mb-1">Bästa delen:</div>
                      <div className="bg-black/20 p-4 rounded-xl border border-stroke whitespace-pre-wrap text-[15px] leading-relaxed">{selected.feedback.bestPart}</div>
                    </div>
                    {selected.feedback.balance && (
                      <div>
                        <div className="text-sm font-bold text-muted mb-1">Balans (strid/rollspel/utforskning):</div>
                        <div className="bg-black/20 p-4 rounded-xl border border-stroke whitespace-pre-wrap text-[15px] leading-relaxed">{selected.feedback.balance}</div>
                      </div>
                    )}
                    {selected.feedback.dmStrengths && (
                      <div>
                        <div className="text-sm font-bold text-muted mb-1">Spelledaren gjorde bra:</div>
                        <div className="bg-black/20 p-4 rounded-xl border border-stroke whitespace-pre-wrap text-[15px] leading-relaxed">{selected.feedback.dmStrengths}</div>
                      </div>
                    )}
                    {selected.feedback.improvements && (
                      <div>
                        <div className="text-sm font-bold text-muted mb-1">Önskas annorlunda:</div>
                        <div className="bg-black/20 p-4 rounded-xl border border-stroke whitespace-pre-wrap text-[15px] leading-relaxed">{selected.feedback.improvements}</div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Future */}
                <section>
                  <h3 className="text-lg font-bold mb-4 text-amber-400 border-b border-stroke pb-2">🎯 Framtid</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-black/20 p-4 rounded-xl border border-stroke">
                      <div className="text-sm text-muted mb-1">Spela igen?</div>
                      <div className="font-bold">{selected.feedback.playAgain}</div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl border border-stroke">
                      <div className="text-sm text-muted mb-1">Inbjudan till framtida spel?</div>
                      <div className="font-bold">{selected.feedback.futureInvite}</div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl border border-stroke">
                      <div className="text-sm text-muted mb-1">Info om kommande äventyr?</div>
                      <div className="font-bold">{selected.feedback.futureInfo}</div>
                    </div>
                  </div>
                  {selected.feedback.extraFeedback && (
                    <div className="mt-4">
                      <div className="text-sm font-bold text-muted mb-1">Övrig feedback:</div>
                      <div className="bg-black/20 p-4 rounded-xl border border-stroke whitespace-pre-wrap text-[15px] leading-relaxed">{selected.feedback.extraFeedback}</div>
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
