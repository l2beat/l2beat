import { withThemeByDataAttribute } from '@storybook/addon-styling'
import React from 'react'
import { withPageBuildContext } from '../src/build/pageBuildContext'
import '../src/styles/style.css'
import { storybookBuildContext } from './buildContext'
import { allModes } from './modes'
import { viewports } from './viewports'

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
    attributeName: 'class',
  }),
  (Story) =>
    withPageBuildContext(storybookBuildContext, () => (
      <div className="m-4">
        <Story />
      </div>
    )),
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
