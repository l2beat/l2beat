import { withThemeByDataAttribute } from '@storybook/addon-styling'
import React from 'react'
import '../src/styles/main.scss'
import '../src/styles/style.css'
import { allModes } from './modes'
import { viewports } from './viewports'

document.body.classList.add(
  'bg-white',
  'text-black',
  'dark:bg-black',
  'dark:text-white',
)

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
    attributeName: 'class',
  }),
  (Story) => (
    <div style={{ margin: '1rem' }}>
      <Story />
    </div>
  ),
]

export const parameters = {
  layout: 'fullscreen',
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    hideNoControlsWarning: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: viewports,
  },
  chromatic: {
    modes: allModes,
  },
}
