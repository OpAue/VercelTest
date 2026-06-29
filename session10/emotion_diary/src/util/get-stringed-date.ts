export const getStringedDate = (
  targetDate: Date
): string => {
  const year = targetDate.getFullYear();

  const month = String(
    targetDate.getMonth() + 1
  ).padStart(2, "0");

  const date = String(
    targetDate.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${date}`;
};