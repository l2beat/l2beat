import { BridgeDescription, ProjectDetails } from '@l2beat/config'
import { formatDate } from '../../../../scripts/chart/ui/dates'
import { OutLink } from '../../../common'

import { EtherscanLink } from './EtherscanLink'
import { ProjectParameter } from './ProjectParameter'
import { Pointers } from './Pointers'

interface Props {
  details: ProjectDetails
  bridges: BridgeDescription[]
}

export function ProjectDetails({ details, bridges }: Props) {
  return (
    <main className="ProjectDetails">
      <section className="ProjectDetails-Section">
        <h2 className="ProjectDetails-Title">Project overview</h2>
        <ul className="ProjectDetails-Parameters">
          <ProjectParameter
            name="Website:"
            value={<OutLink href={details.website}>{details.website}</OutLink>}
          />
          <ProjectParameter
            name="Technology:"
            value={details.technology.name}
            tooltip={details.technology.details}
          />
          {details.parameters.map((param, i) => (
            <ProjectParameter key={i} {...param} />
          ))}
        </ul>
      </section>

      {details.notes && (
        <section className="ProjectDetails-Section">
          <h2 className="ProjectDetails-Title">Notes</h2>
          <p className="ProjectDetails-Text">{details.notes.text}</p>
          <Pointers
            className="ProjectDetails-Links"
            pointers={details.notes.pointers}
          />
        </section>
      )}

      <section className="ProjectDetails-Section">
        <h2 className="ProjectDetails-Title">Tracked bridges</h2>
        <ul className="ProjectDetails-Links">
          {bridges.map((bridge, i) => (
            <li key={i}>
              <EtherscanLink address={bridge.address} /> -{' '}
              {bridge.tokens.map((t: string) => t).join(', ')}
            </li>
          ))}
        </ul>
      </section>

      {details.news && (
        <section className="ProjectDetails-Section">
          <h2 className="ProjectDetails-Title">News</h2>
          <ul className="ProjectDetails-Links">
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
