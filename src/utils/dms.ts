export interface DMUser {
  id: string;
  name: string;
  username: string;
  password?: string;
}

export const DEFAULT_DMS: DMUser[] = [
  { id: "1", name: "Daniel", username: "daniel", password: "daniel" },
  { id: "2", name: "Pontus", username: "pontus", password: "pontus" },
  { id: "3", name: "Thomas", username: "thomas", password: "thomas" },
  { id: "4", name: "Gideon", username: "gideon", password: "gideon" }
];

export function getDMs(): DMUser[] {
  const dms = localStorage.getItem('rfr_dms_users');
  if (dms) {
    try {
      const parsed = JSON.parse(dms);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
        // Migration from old string array
        const migrated: DMUser[] = parsed
          .filter(name => name !== "David" && name !== "RFR DM Team")
          .map((name, index) => ({
            id: crypto.randomUUID(),
            name,
            username: name.toLowerCase(),
            password: name.toLowerCase()
          }));
        saveDMs(migrated);
        return migrated;
      }
      return parsed;
    } catch (e) {
      return DEFAULT_DMS;
    }
  }
  return DEFAULT_DMS;
}

export function saveDMs(dms: DMUser[]) {
  localStorage.setItem('rfr_dms_users', JSON.stringify(dms));
}
