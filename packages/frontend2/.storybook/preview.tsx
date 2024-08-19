import React, { ReactNode } from 'react'
import { type Preview } from '@storybook/react'

import { withThemeByClassName } from '@storybook/addon-themes'

import { roboto } from '../src/fonts'
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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
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
