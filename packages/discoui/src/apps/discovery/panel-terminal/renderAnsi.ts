import ansiHTML from 'ansi-html'
import type { Theme } from '../../../theme'

const ANSI_COLORS: Record<Theme, Parameters<typeof ansiHTML.setColors>[0]> = {
  dark: {
    reset: ['F0D8BD', '1D1816'], // [fg, bg]
    black: '000000',
    red: 'FB4A35',
    green: '9DDE6C',
    yellow: 'FABD30',
    blue: '8B8BE8',
    magenta: 'a73db5',
    cyan: '1c92a8',
    lightgrey: 'D3D3D3',
    darkgrey: 'A9A9A9',
  },
  light: {
    reset: ['412E18', 'FEFBF7'],
    black: '000000',
    red: 'D01601',
    green: '417501',
    yellow: '876201',
    blue: '5E5AB2',
    magenta: 'A439B1',
    cyan: '037386',
    lightgrey: '6B6B6B',
    darkgrey: '8A8A8A',
  },
}

// ansi-html keeps its colors in module state, so set them for every render.
export function renderAnsi(output: string, theme: Theme): string {
  ansiHTML.setColors(ANSI_COLORS[theme])
  return ansiHTML(output)
}
