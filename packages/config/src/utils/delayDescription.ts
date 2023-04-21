import { formatSeconds } from './formatSeconds'

export function delayDescriptionFromSeconds(delay: number): string {
  const delayString = formatSeconds(delay)

  return delayDescriptionFromString(delayString)
}

export function delayDescriptionFromString(delay: string): string {
  if (delay === '') {
    return 'Currently there is no delay before the upgrade, so the users will not have time to migrate.'
  }

  return `Currently there is ${delay} delay before the upgrade.`
}
