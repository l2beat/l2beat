import { BridgeDescription, ProjectDetails } from '@l2beat/config'
import { formatDate } from '../../../../scripts/chart/ui/dates'
import { OutLink } from '../../../common'

import { EtherscanLink } from './EtherscanLink'
import { Parameter } from './Parameter'
import { Pointers } from './Pointers'

interface ProjectDescriptionProps {
  details: ProjectDetails
  bridges: BridgeDescription[]
}

export function ProjectDescription({
  details,
  bridges,
}: ProjectDescriptionProps) {
  return (
    <main className="description">
      <section className="description__section">
        <h2 className="description__title">Project overview</h2>
        <ul className="parameters">
          <Parameter
            name="Website:"
            value={<OutLink href={details.website}>{details.website}</OutLink>}
          />
          <Parameter
            name="Technology:"
            value={details.technology.name}
            tooltip={details.technology.details}
          />
          {details.parameters.map((param, i) => (
            <Parameter key={i} {...param} />
          ))}
        </ul>
      </section>

      {details.notes && (
        <section className="description__section">
          <h2 className="description__title">Notes</h2>
          <p className="description__text">{details.notes.text}</p>
          <Pointers
            className="description__links"
            pointers={details.notes.pointers}
          />
        </section>
      )}

      <section className="description__section">
        <h2 className="description__title">Tracked bridges</h2>
        <ul className="description__links">
          {bridges.map((bridge, i) => (
            <li key={i}>
              <EtherscanLink address={bridge.address} /> -{' '}
              {bridge.tokens.map((t: string) => t).join(', ')}
            </li>
          ))}
        </ul>
      </section>

      {details.news && (
        <section className="description__section">
          <h2 className="description__title">News</h2>
          <ul className="description__links">
            {details.news.map((news, i) => (
              <li key={i}>
                {/* TODO: date formatting should be done already */}
                {formatDate(news.date)} &ndash;{' '}
                <OutLink href={news.link}>{news.name}</OutLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
