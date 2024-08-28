import React from 'react'

import { assert } from '@l2beat/shared-pure'
import { Config } from '../../../build/config'
import { getIncludedProjectsTvlBreakdown } from '../../../utils/getIncludedProjectsTvlBreakdown'
import { PagesData } from '../../Page'

export function getSummaryPage(config: Config, pagesData: PagesData) {
  assert(pagesData.tvlBreakdownApiResponse, 'Missing tvlBreakdownApiResponse')

  const tvlBreakdownProjects = getIncludedProjectsTvlBreakdown(
    [...config.layer2s, ...(config.features.layer3sTvl ? config.layer3s : [])],
    pagesData.tvlApiResponse,
    pagesData.tvlBreakdownApiResponse,
  )

  // NOTE(piotradamczyk): Temporary main page for legacy frontend before we port all the pages.

  return {
    slug: '/scaling/summary',
    page: (
      <div>
        <h1>Index of L2BEAT's legacy frontend</h1>
        <h2>Scaling detail pages</h2>
        <ul>
          {[...config.layer2s, ...config.layer3s]
            .sort(byName)
            .map((project) => (
              <a
                href={`/scaling/projects/${project.display.slug}`}
                key={project.display.slug}
              >
                <li key={project.display.slug}>{project.display.name}</li>
              </a>
            ))}
        </ul>
        <h2>Scaling TVL breakdown pages</h2>
        <ul>
          {tvlBreakdownProjects.sort(byName).map((project) => (
            <a
              href={`/scaling/projects/${project.display.slug}/tvl-breakdown`}
              key={project.display.slug}
            >
              <li key={project.display.slug}>{project.display.name}</li>
            </a>
          ))}
        </ul>
        <h2>Bridges detail pages</h2>
        <ul>
          {config.bridges.sort(byName).map((project) => (
            <a
              href={`/bridges/projects/${project.display.slug}`}
              key={project.display.slug}
            >
              <li key={project.display.slug}>{project.display.name}</li>
            </a>
          ))}
        </ul>
      </div>
    ),
  }
}

function byName(
  a: { display: { name: string } },
  b: { display: { name: string } },
) {
  return a.display.name.localeCompare(b.display.name)
}
