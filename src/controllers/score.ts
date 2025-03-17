import { ScoreEntry } from "#src/models/score";
import dayjs from "dayjs";

export function fillMissingSundays(entries: ScoreEntry[]): ScoreEntry[] {
  const firstDayOfYear = getFirstSundayOfCurrentYear();
  const today = dayjs();
  const lastSunday = today.subtract(today.day(), "day");

  const allSundays: ScoreEntry[] = [];
  const existingDates = new Set(
    entries.map((entry) => dayjs(entry.date).format("YYYY/MM/DD")),
  );

  for (
    let date = firstDayOfYear;
    date.isSame(lastSunday) || date.isBefore(lastSunday);
    date = date.add(7, "day")
  ) {
    const formattedDate = date.format("YYYY/MM/DD");
    if (!existingDates.has(formattedDate)) {
      allSundays.push({ date: date.toDate(), score: null });
    }
  }

  return [...entries, ...allSundays].sort((a, b) =>
    dayjs(a.date).diff(dayjs(b.date)),
  );
}

const getFirstSundayOfCurrentYear = () => {
  let startDate = dayjs().startOf("year");
  while (startDate.day() !== 0) {
    startDate = startDate.add(1, "day");
  }
  return startDate;
};
