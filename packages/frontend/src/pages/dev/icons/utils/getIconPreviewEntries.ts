import {
  type IconPreviewEntry,
  normalizeIconPreviewModules,
} from './normalizeIconPreviewModules'

export {
  ICON_PREVIEW_CATEGORIES,
  type IconPreviewCategory,
  type IconPreviewEntry,
} from './normalizeIconPreviewModules'

export type IconPreviewModule = Record<string, unknown>

export function getIconPreviewEntries(): IconPreviewEntry[] {
  const iconPreviewModules = import.meta.glob(
    [
      '/src/icons/**/*.tsx',
      '!/src/icons/SvgIcon.tsx',
      '!/src/icons/products/CustomIcon.tsx',
    ],
    { eager: true },
  ) as Record<string, IconPreviewModule>

  return normalizeIconPreviewModules(iconPreviewModules)
}
