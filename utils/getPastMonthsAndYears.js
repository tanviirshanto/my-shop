export function getPastMonthsAndYears(numberOfMonths) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed
  
    const pastMonths = [];
    for (let i = 0; i < numberOfMonths; i++) {
      let year = currentYear;
      let month = currentMonth - i;
      if (month < 0) {
        year--;
        month += 12;
      }
  
      const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
  
      pastMonths.push({ year, month: month + 1, monthName }); // month + 1 to convert back to 1-indexed
    }
    return pastMonths;
  }