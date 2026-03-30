import { expect } from 'earl'

import { normalizeIconPreviewModules } from './normalizeIconPreviewModules'

describe(normalizeIconPreviewModules.name, () => {
  it('filters helper exports and sorts concrete icons by category, path, and export', () => {
    function PolygonLogo() {
      return null
    }

    function TrendArrowUpIcon() {
      return null
    }

    function TrendArrowDownIcon() {
      return null
    }

    function ScalingIcon() {
      return null
    }

    function GithubIcon() {
      return null
    }

    function SuperchainIcon() {
      return null
    }

    const entries = normalizeIconPreviewModules({
      '/src/icons/TrendArrow.tsx': {
        TrendArrowUpIcon,
        TrendArrowDownIcon,
        helper: () => null,
      },
      '/src/icons/PolygonLogo.tsx': { PolygonLogo },
      '/src/icons/pages/Scaling.tsx': { ScalingIcon },
      '/src/icons/products/Github.tsx': { GithubIcon },
      '/src/icons/providers/SuperchainIcon.tsx': { SuperchainIcon },
    })

    expect(
      entries.map((entry) => ({
        category: entry.category,
        exportName: entry.exportName,
        sourcePath: entry.sourcePath,
      })),
    ).toEqual([
      {
        category: 'Core',
        exportName: 'PolygonLogo',
        sourcePath: 'PolygonLogo.tsx',
      },
      {
        category: 'Core',
        exportName: 'TrendArrowDownIcon',
        sourcePath: 'TrendArrow.tsx',
      },
      {
        category: 'Core',
        exportName: 'TrendArrowUpIcon',
        sourcePath: 'TrendArrow.tsx',
      },
      {
        category: 'Pages',
        exportName: 'ScalingIcon',
        sourcePath: 'pages/Scaling.tsx',
      },
      {
        category: 'Products',
        exportName: 'GithubIcon',
        sourcePath: 'products/Github.tsx',
      },
      {
        category: 'Providers',
        exportName: 'SuperchainIcon',
        sourcePath: 'providers/SuperchainIcon.tsx',
      },
    ])
  })
})
