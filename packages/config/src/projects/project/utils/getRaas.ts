import { type BadgeId, badges } from '../../badges'

export function getRaas(projectBadges: BadgeId[] | undefined) {
  const badge = projectBadges?.find((id) => badges[id].type === 'RaaS')
  if (!badge) {
    return undefined
  }
  return badges[badge].display.name
}
