import { viewports } from './viewports'

type Viewport = keyof typeof viewports
type Theme = 'light' | 'dark'

type ModeKey = `${Theme} ${Viewport}`
type Mode = {
  theme: Theme
  viewport: Viewport
}

export const allModes: Record<ModeKey, Mode> = {
  'light mobile': {
    theme: 'light',
    viewport: 'mobile',
  },
  'dark mobile': {
    theme: 'dark',
    viewport: 'mobile',
  },
  'light desktop': {
    theme: 'light',
    viewport: 'desktop',
  },
  'dark desktop': {
    theme: 'dark',
    viewport: 'desktop',
  },
}

export const onlyDesktopModes = {
  'light mobile': {
    disable: true,
  },
  'dark mobile': {
    disable: true,
  },
}

export const onlyMobileModes = {
  'light desktop': {
    disable: true,
  },
  'dark desktop': {
    disable: true,
  },
}
