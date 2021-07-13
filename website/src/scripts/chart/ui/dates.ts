const MONTHS: Record<string, string> = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
}

export function toDateRange(from: string, to: string) {
  const [year1, month1, day1] = from.split('-')
  const [year2, month2, day2] = to.split('-')

  const first = toNiceDate(day1, month1, year1 !== year2 ? year1 : undefined)
  const second = toNiceDate(day2, month2, year2)

  return `${first} &ndash;\n${second}`
}

function toNiceDate(day: string, month: string, year?: string) {
  return year === undefined
    ? `${parseInt(day)} ${MONTHS[month]}`
    : `${parseInt(day)} ${MONTHS[month]} ${parseInt(year)}`
}
