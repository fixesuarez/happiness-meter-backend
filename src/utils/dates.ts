/**
 * @param date - date in the format "DD-MM-YYYY"
 */
export const getUTCDate = (date: string) => {
  const [day, month, year] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};
