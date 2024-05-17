import { withThemeByDataAttribute } from '@storybook/addon-styling'
import React from 'react'
import '../src/styles/style.css'
import { allModes } from './modes'
import { viewports } from './viewports'
import { withPageBuildContext } from '../src/components/navbar/navigationContext'

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
    withPageBuildContext(
      {
        config: {
          features: {
            activity: true,
            liveness: true,
            finality: true,
            banner: true,
            tvlBreakdown: true,
            implementationChange: true,
            gitcoinOption: true,
            hiringBadge: true,
            buildAllProjectPages: true,
            governancePage: true,
            costsPage: true,
            zkCatalog: true,
            tvl2: true,
            glossary: true,
          },
          links: {
            twitter: 'test',
            discord: 'test',
            github: 'test',
            linkedin: 'test',
            youTube: 'test',
            medium: 'test',
            forum: 'test',
            multisigReport: 'test',
          },
          backend: {
            apiUrl: '',
            mock: true,
            skipCache: false,
          },
          layer2s: [],
          layer3s: [],
          bridges: [],
          zkCatalogProjects: [],
          milestones: [],
        },
        path: '',
      },
      () => (
        <div className="m-4">
          <Story />
        </div>
      ),
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
