import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "sv" | "en";

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (sv: string, en: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "sv",
  toggleLang: () => {},
  t: (sv) => sv,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("rfr-lang") as Lang) || "sv";
  });

  const toggleLang = () => {
    const next: Lang = lang === "sv" ? "en" : "sv";
    localStorage.setItem("rfr-lang", next);
    setLangState(next);
  };

  // Helper: pick sv or en string inline
  const t = (sv: string, en: string) => lang === "sv" ? sv : en;

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}