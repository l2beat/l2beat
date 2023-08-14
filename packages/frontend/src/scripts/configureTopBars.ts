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

function getBannerVariant(): 'gitcoin' | 'l2warsaw' {
  const gitcoinBarOverride =
    isWithinDayAfter(gitcoinStartDate) ||
    isWithinThreeDaysBefore(gitcoinEndDate)

  if (gitcoinBarOverride) {
    return 'gitcoin'
  }

  const presentTopBarData = readStorage()

  const topBarDataToWrite: TopBarVariantData = {
    variant: Math.random() < 0.5 ? 'gitcoin' : 'l2warsaw',
    lastBannerChangeTime: Date.now(),
  }

  if (!presentTopBarData) {
    writeStorage(topBarDataToWrite)

    return topBarDataToWrite.variant
  }

  const lastSwapDate = new Date(presentTopBarData.lastBannerChangeTime)

  if (hasDayPassedSince(lastSwapDate)) {
    writeStorage(topBarDataToWrite)

    return topBarDataToWrite.variant
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
