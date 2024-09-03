import { type Preview } from '@storybook/react'
import React from 'react'

import { withThemeByClassName } from '@storybook/addon-themes'

import { GlossaryContextProvider } from '../src/app/_components/markdown/glossary-context'
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
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Atoms', 'Components', 'OG Images'],
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
    (Story) => {
      document.body.classList.add(roboto.variable, 'font-sans')
      return (
        <main className="m-8">
          <GlossaryContextProvider terms={[]}>
            <TooltipProvider>
              <Story />
            </TooltipProvider>
          </GlossaryContextProvider>
        </main>
      )
    },
  ],
}

export default preview
