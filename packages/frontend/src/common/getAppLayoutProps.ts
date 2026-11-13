import { PROJECT_COUNTDOWNS } from '@l2beat/config'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { getWhatsNewItem } from '~/server/features/changelog/getWhatsNewItem'

export function getAppLayoutProps(): Promise<AppLayoutProps> {
  return Promise.resolve({
    whatsNewItem: getWhatsNewItem(),
    countdowns: PROJECT_COUNTDOWNS,
  })
}
