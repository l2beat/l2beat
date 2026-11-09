import { ADVICE_ANCHORS } from '@l2beat/config/build/common/privacyAdversaries'
import { PRIVACY_METHODOLOGY_PATH } from './methodology/paths'

/** Copy shared by the HTML page and its markdown alternate. */
export const ADVICE = {
  sectionId: 'stay-private',
  title: 'How to stay private',
  intro:
    'What a careful user does with the reference app, in order. The ratings assume these steps.',
  againstLabel: 'Against',
  /** Our word for the steps, as the framework uses it, linking to this section. */
  label: 'Advice',
  methodologyLink: 'Every habit explained',
  methodologyHref: `${PRIVACY_METHODOLOGY_PATH}#${ADVICE_ANCHORS.section}`,
} as const
