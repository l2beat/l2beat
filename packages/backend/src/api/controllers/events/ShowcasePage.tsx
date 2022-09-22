import { ApiEvents, UnixTime } from '@l2beat/types'
import React from 'react'

import { reactToHtml } from '../status/view/reactToHtml'

interface ShowcasePageProps {
  events: ApiEvents
}

interface Event {
  project: string
  name: string | undefined
  maxHourly: number
  maxDaily: number
  hourly: number[]
  daily: number[]
  hourlyRange: [UnixTime | undefined, UnixTime | undefined]
  dailyRange: [UnixTime | undefined, UnixTime | undefined]
}

export function ShowcasePage({ events }: ShowcasePageProps) {
  const transformedEvents: Event[] = []

  Object.entries(events.projects).forEach(([key, value]) => {
    const maxIndex = value?.hourly.types.length ?? 0
    for (let i = 1; i < maxIndex; i++) {
      const hourly: number[] =
        value?.hourly.data.map((d) => d[i] as number) ?? []
      const daily: number[] = value?.daily.data.map((d) => d[i] as number) ?? []

      transformedEvents.push({
        project: key,
        name: value?.daily.types[i],
        maxHourly: Math.max(...hourly),
        maxDaily: Math.max(...daily),
        hourly,
        daily,
        hourlyRange: [
          value?.hourly.data[0][0],
          value?.hourly.data[value.hourly.data.length - 1][0],
        ],
        dailyRange: [
          value?.daily.data[0][0],
          value?.daily.data[value.daily.data.length - 1][0],
        ],
      })
    }
  })
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://classless.de/classless.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/charts.css/dist/charts.min.css"
        ></link>
        <style>{':root{--width:1600px}'}</style>
        <title>{'s'}</title>
      </head>
      <body>
        {transformedEvents.map((event, i) => {
          return (
            <div key={i.toString()}>
              <h1>
                {event.project} - {event.name}
              </h1>
              <h2>Hourly</h2>
              <blockquote>
                <div>
                  FROM {event.hourlyRange[0]?.toYYYYMMDD()} - TO{' '}
                  {event.hourlyRange[1]?.toYYYYMMDD()}
                </div>
                <div>
                  Average:
                  {Math.floor(
                    event.hourly.reduce((a, b) => a + b, 0) /
                      event.hourly.filter((h) => h != 0).length,
                  )}
                </div>
              </blockquote>
              <table className="charts-css column show-labels show-heading show-primary-axis show-4-secondary-axes">
                <caption>Hourly [0-{event.maxHourly}]</caption>
                <tbody style={{ height: 100 }}>
                  {event.hourly.map((d, id) => {
                    return (
                      <tr key={id.toString()}>
                        <td
                          style={
                            {
                              '--size': d / event.maxHourly,
                            } as React.CSSProperties
                          }
                        ></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <h2>Daily</h2>
              <blockquote>
                <div>
                  FROM {event.dailyRange[0]?.toYYYYMMDD()} - TO{' '}
                  {event.dailyRange[1]?.toYYYYMMDD()}
                </div>
                <div>
                  Average:
                  {Math.floor(
                    event.daily.reduce((a, b) => a + b, 0) /
                      event.daily.filter((h) => h != 0).length,
                  )}
                </div>
              </blockquote>
              <table className="charts-css column show-labels show-heading show-primary-axis show-4-secondary-axes">
                <caption>Daily [0-{event.maxDaily}]</caption>
                <tbody style={{ height: 100 }}>
                  {event.daily.map((d, id) => {
                    return (
                      <tr key={id.toString()}>
                        <td
                          style={
                            {
                              '--size': d / event.maxDaily,
                            } as React.CSSProperties
                          }
                        ></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
      </body>
    </html>
  )
}

export function renderShowcasePage(props: ShowcasePageProps) {
  return reactToHtml(<ShowcasePage {...props} />)
}
