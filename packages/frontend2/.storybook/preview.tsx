import { type Preview } from '@storybook/react'
import React from 'react'

import { withThemeByClassName } from '@storybook/addon-themes'

import { TooltipProvider } from '../src/app/_components/tooltip/tooltip'
import { roboto } from '../src/fonts'
import '../src/styles/globals.css'
import { allModes } from './modes'
import { viewports } from './viewports'

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
    (Story) => {
      return (
        <main className={`p-4 font-sans ${roboto.variable}`}>
          <TooltipProvider>
            <Story />
          </TooltipProvider>
        </main>
      )
    },
  ],
}

export default preview
