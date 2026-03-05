/**
 * Compacts Google Places hours string into grouped format.
 * Input:  "Monday: 9:00 AM – 11:00 PM | Tuesday: 9:00 AM – 11:00 PM | ..."
 * Output: "Mon–Fri: 9:00 AM – 11:00 PM\nSat–Sun: 7:30 AM – 11:00 PM"
 */

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu",
  Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

function normalize(s: string): string {
  // Replace narrow/thin/non-breaking spaces with normal space
  return s.replace(/[\u2009\u202f\u00a0]/g, " ").trim();
}

interface DayHours {
  day: string;
  time: string;
}

function parseDays(raw: string): DayHours[] {
  const parts = raw.split("|").map(s => normalize(s));
  const result: DayHours[] = [];

  for (const part of parts) {
    const colonIdx = part.indexOf(":");
    if (colonIdx === -1) continue;
    const day = part.slice(0, colonIdx).trim();
    const time = part.slice(colonIdx + 1).trim();
    if (DAY_ORDER.includes(day)) {
      result.push({ day, time });
    }
  }

  // Sort by day order
  result.sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));
  return result;
}

function groupConsecutive(days: DayHours[]): string[] {
  if (days.length === 0) return [];

  // Check if all 7 days have same hours
  if (days.length === 7) {
    const allSame = days.every(d => d.time === days[0].time);
    if (allSame) {
      if (days[0].time === "Open 24 hours") return ["Open 24 hours"];
      return [`Every day: ${days[0].time}`];
    }
  }

  const groups: { start: number; end: number; time: string }[] = [];

  for (const d of days) {
    const idx = DAY_ORDER.indexOf(d.day);
    const last = groups[groups.length - 1];

    if (last && last.time === d.time && idx === last.end + 1) {
      last.end = idx;
    } else {
      groups.push({ start: idx, end: idx, time: d.time });
    }
  }

  return groups.map(g => {
    const startName = DAY_SHORT[DAY_ORDER[g.start]];
    const endName = DAY_SHORT[DAY_ORDER[g.end]];
    const label = g.start === g.end ? startName : `${startName}–${endName}`;

    if (g.time === "Closed") return `${label}: Closed`;
    if (g.time === "Open 24 hours") return `${label}: Open 24h`;
    return `${label}: ${g.time}`;
  });
}

export function formatHoursCompact(raw: string | undefined | null): string | null {
  if (!raw) return null;

  const days = parseDays(raw);
  if (days.length === 0) return normalize(raw); // fallback: return cleaned raw

  const lines = groupConsecutive(days);
  return lines.join("\n");
}
