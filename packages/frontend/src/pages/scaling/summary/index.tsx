import React from 'react'

import { Config } from '../../../build/config'

// NOTE(piotradamczyk): This is a temporary main page for the legacy frontend.
export function getSummaryPage(config: Config) {
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
