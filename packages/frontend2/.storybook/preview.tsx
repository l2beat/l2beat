import React, { ReactNode } from 'react'
import { type Preview } from '@storybook/react'

import { withThemeByClassName } from '@storybook/addon-themes'

import { roboto } from '../src/fonts'
import { viewports } from './viewports'
import { allModes } from './modes'
import '../src/styles/globals.css'

const withFonts = () => (Story: () => ReactNode) => {
  return (
    <main className={`font-sans ${roboto.variable}`}>
      <Story />
    </main>
  )
}

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      hideNoControlsWarning: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports,
    },
    chromatic: {
      modes: allModes,
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    withFonts(),
  ],
}

export default preview
