interface TopBarVariantData {
  variant: 'gitcoin' | 'l2warsaw'
  lastBannerChangeTime: number
}

const localStorageKey = 'topBarVariantData'

const gitcoinStartDate = new Date('2023-08-15T12:00:00.000Z')
const gitcoinEndDate = new Date('2023-08-29T12:00:00.000Z')

export function configureTopBars() {
  const variant = getBannerVariant()

  const gitcoinBanner = document.querySelector('.TopBar-Gitcoin')
  const l2warsawBanner = document.querySelector('.TopBar-L2Warsaw')

  if (variant === 'gitcoin') {
    gitcoinBanner?.classList.remove('hidden')
    l2warsawBanner?.classList.add('hidden')
  }

  if (variant === 'l2warsaw') {
    gitcoinBanner?.classList.add('hidden')
    l2warsawBanner?.classList.remove('hidden')
  }
}

//
//     August 2023
// Mo Tu We Th Fr Sa Su
//     1  2  3  4  5  6
//  7  8  9 10 11 12 13
// 14 15 16 17 18 19 20
// 21 22 23 24 25 26 27
// 28 29 30 31
//
// NOTE(radomski): Gitcoin round starts on the 15th and ends on the 29th. On
// 15th, 27th, 28th, and 29th no matter what the local storage says, display
// the gitcoin banner. On those days we do not need to write anything into the
// local storage since it's always going to be gitcoin. On the first occurrence
// that the date does not fall into gitcoin start or end (so 16th-26th) and we
// do not have anything in the local storage, write the L2Warsaw banner. And
// cycle which banner to show every 24h. For time before and after the entire
// Gitcoin round always display the L2Warsaw banner.
function getBannerVariant(): 'gitcoin' | 'l2warsaw' {
  const now = new Date()

  const gitcoinIsLive = now <= gitcoinEndDate && now >= gitcoinStartDate
  if (!gitcoinIsLive) {
    return 'l2warsaw'
  }

  const gitcoinBarOverride =
    isWithinDayAfter(gitcoinStartDate) ||
    isWithinThreeDaysBefore(gitcoinEndDate)

  if (gitcoinBarOverride) {
    return 'gitcoin'
  }

  const presentTopBarData = readStorage()

  const newTopBarData: TopBarVariantData = {
    variant: 'l2warsaw',
    lastBannerChangeTime: now.getTime(),
  }

  if (!presentTopBarData) {
    writeStorage(newTopBarData)
    return newTopBarData.variant
  }

  const lastSwapDate = new Date(presentTopBarData.lastBannerChangeTime)
  if (hasDayPassedSince(lastSwapDate)) {
    newTopBarData.variant =
      presentTopBarData.variant === 'l2warsaw' ? 'gitcoin' : 'l2warsaw'
    writeStorage(newTopBarData)

    return newTopBarData.variant
  }

  return presentTopBarData.variant
}

function isWithinDayAfter(targetDate: Date) {
  const now = new Date()
  const oneDayMs = 24 * 60 * 60 * 1000
  const todayCheck = now >= targetDate
  const oneDayOffsetCheck = now.getTime() <= targetDate.getTime() + oneDayMs
  return todayCheck && oneDayOffsetCheck
}

function isWithinThreeDaysBefore(targetDate: Date) {
  const now = new Date()
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000
  const todayCheck = now <= targetDate
  const threeDaysOffsetCheck =
    now.getTime() >= targetDate.getTime() - threeDaysMs
  return todayCheck && threeDaysOffsetCheck
}

function hasDayPassedSince(sinceDate: Date) {
  const onyDayMs = 24 * 60 * 60 * 1000
  const now = new Date()

  return now.getTime() >= sinceDate.getTime() + onyDayMs
}

function writeStorage(data: TopBarVariantData) {
  localStorage.setItem(localStorageKey, JSON.stringify(data))
}

function readStorage(): TopBarVariantData | null {
  const data = localStorage.getItem(localStorageKey)
  if (!data) {
    return null
  }

  return JSON.parse(data) as TopBarVariantData
}
