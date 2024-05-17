import React from 'react'
import '../src/styles/style.css'
import { allModes } from './modes'
import { viewports } from './viewports'

export const decorators = [
  (Story) => (
    <div className="m-4">
      <Story />
    </div>
  ),
]

export const parameters = {
  layout: 'fullscreen',
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
export const tags = ['autodocs']
