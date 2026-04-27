export interface Adventure {
  id: string;
  title: string;
  date: string;
  time: string;
  language: string;
  dm: string;
  maxPlayers: number;
  spotsLeft: number;
  location: string;
  interestUrl: string;
  feedbackUrl: string;
}

export const adventuresData: Adventure[] = [
  {
    id: "wolves-of-vargheim",
    title: "Wolves of Vargheim",
    date: "2026-02-01",
    time: "18:00",
    language: "SV/EN",
    dm: "RFR DM Team",
    maxPlayers: 5,
    spotsLeft: 2,
    location: "Norrköping / Online",
    interestUrl: "https://forms.gle/YOUR_INTEREST_FORM",
    feedbackUrl: "https://forms.gle/YOUR_FEEDBACK_FORM"
  }
];
