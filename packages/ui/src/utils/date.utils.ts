export function areDatesEqual(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() && // Місяці починаються з 0 (січень = 0, грудень = 11)
      date1.getDate() === date2.getDate()
  );
}

export function isDateInPast(date: Date): boolean {
  const currentDate = new Date();

  // Видаляємо години, хвилини, секунди з поточної дати для точного порівняння
  currentDate.setHours(0, 0, 0, 0);
  // Видаляємо години, хвилини, секунди з переданої дати
  date.setHours(0, 0, 0, 0);

  // return date < currentDate || date.getDate() === currentDate.getDate();
  return date < currentDate;
}