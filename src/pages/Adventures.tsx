import { Link } from "react-router-dom";
import { adventuresData } from "../data/adventures";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}/${m}/${y}`;
}

export default function Adventures() {
  return (
    <section className="w-[min(1100px,92%)] mx-auto">
      <h1 className="text-[clamp(34px,4.3vw,58px)] leading-[1.05] m-0 mb-4 font-bold">
        Upcoming Adventures
      </h1>
      <p className="text-muted leading-[1.6] mb-4">
        Tryck "Intresserad" för att anmäla intresse. Fullt = låst.
      </p>

      <div className="grid grid-cols-12 gap-4 mt-4">
        {adventuresData.map((a) => {
          const full = a.spotsLeft <= 0;
          const interestText = full ? "Fullt" : `Intresserad (${a.spotsLeft} kvar)`;

          return (
            <article key={a.id} className="col-span-12 md:col-span-6 p-5 rounded-[18px] bg-card border border-stroke backdrop-blur-[12px] shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
              <div className="flex items-start justify-between gap-4">
                <h2 className="m-0 text-[22px] font-bold">{a.title}</h2>
                <div className="text-xs font-black py-[6px] px-[10px] rounded-full bg-white/10 border border-white/14">
                  {a.language}
                </div>
              </div>

              <div className="mt-3 grid gap-[6px] text-muted">
                <div><strong>Datum:</strong> {formatDate(a.date)} {a.time}</div>
                <div><strong>DM:</strong> {a.dm}</div>
                <div><strong>Plats:</strong> {a.location}</div>
                <div><strong>Max:</strong> {a.maxPlayers}</div>
              </div>

              <div className="mt-4 flex gap-[10px] flex-wrap">
                <a 
                  href={full ? "#" : a.interestUrl}
                  target={full ? undefined : "_blank"}
                  rel="noreferrer"
                  className={`inline-flex items-center justify-center gap-[10px] border-0 py-3 px-4 rounded-[14px] font-extrabold transition-all duration-160 no-underline ${
                    full 
                      ? "opacity-55 pointer-events-none cursor-not-allowed bg-white/92 text-black/92" 
                      : "bg-white/92 text-black/92 hover:-translate-y-[2px] cursor-pointer"
                  }`}
                  onClick={(e) => {
                    if (full) e.preventDefault();
                  }}
                  aria-disabled={full}
                >
                  {interestText}
                </a>

                <Link 
                  to={`/feedback?adventure=${a.id}`}
                  className="inline-flex items-center justify-center gap-[10px] border-0 cursor-pointer py-3 px-4 rounded-[14px] font-extrabold bg-white/8 text-text-main border border-white/14 transition-all duration-160 no-underline hover:bg-white/12 hover:-translate-y-[2px]"
                >
                  Feedback
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
