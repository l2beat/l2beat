import {
  PRIVACY_ADVERSARIES,
  PRIVACY_ADVERSARY_ORDER,
  PRIVACY_FIELD_ORDER,
  PRIVACY_FIELDS,
} from '@l2beat/config/build/common/privacyAdversaries'
import { PRIVACY_CATEGORIES } from '@l2beat/config/build/common/privacyCategories'
import { FRAMEWORK_ADVERSARY_TEXT } from './privacyFrameworkText'

export type PrivacyMethodologyFigureData = ReturnType<
  typeof getPrivacyMethodologyFigureData
>

/**
 * The definitions the figures show. They come in as props: the config build
 * is CommonJS, which the browser bundle cannot import from.
 */
export function getPrivacyMethodologyFigureData() {
  return {
    /** In spine order: public observer, chain analyst, network observer, insider, future. */
    adversaries: PRIVACY_ADVERSARY_ORDER.map((id) => ({
      id,
      label: PRIVACY_ADVERSARIES[id].label,
      text: FRAMEWORK_ADVERSARY_TEXT[id],
    })),
    fields: PRIVACY_FIELD_ORDER.map((id) => ({
      id,
      label: PRIVACY_FIELDS[id].label,
    })),
    categories: Object.values(PRIVACY_CATEGORIES).map(
      ({ id, label, description }) => ({ id, label, description }),
    ),
  }
}
