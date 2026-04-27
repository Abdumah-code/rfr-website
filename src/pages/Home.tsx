import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="w-[min(1100px,92%)] mx-auto">
      <h1 className="text-[clamp(34px,4.3vw,58px)] leading-[1.05] m-0 mb-4 font-bold">
        Roll for Roleplay
      </h1>
      <p className="text-muted leading-[1.6] mb-4">
        Vi bygger ett community för episka äventyr, bra DMs och en seriös men varm vibe.
      </p>

      <div className="flex gap-3 flex-wrap mt-4">
        <Link 
          to="/adventures" 
          className="inline-flex items-center justify-center gap-[10px] border-0 cursor-pointer py-3 px-4 rounded-[14px] font-extrabold bg-white/92 text-black/92 transition-all duration-160 no-underline hover:-translate-y-[2px]"
        >
          Se Adventures
        </Link>
        <button 
          onClick={() => alert('Orders section coming soon!')}
          className="inline-flex items-center justify-center gap-[10px] border-0 cursor-pointer py-3 px-4 rounded-[14px] font-extrabold bg-white/8 text-text-main border border-white/14 transition-all duration-160 no-underline hover:bg-white/12 hover:-translate-y-[2px]"
        >
          Orders
        </button>
      </div>

      <div className="mt-6 p-5 rounded-[18px] bg-card border border-stroke backdrop-blur-[12px] shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
        <h2 className="m-0 mb-3 text-[22px] font-bold">Who we are</h2>
        <p className="text-muted leading-[1.6] m-0">
          Kort om er vision, hur sessions funkar, och varför RFR är annorlunda.
        </p>
      </div>
    </section>
  );
}
