import { BridgeDescription, ProjectDetails } from '@l2beat/config'

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
      <h2 className="description__title">Project overview</h2>

      <dl className="parameters">
        <Parameter
          name="Technology:"
          value={details.technology.name}
          tooltip={details.technology.details}
        />
        {details.parameters.map((param, i) => (
          <Parameter key={i} {...param} />
        ))}
      </dl>

      {details.notes && (
        <>
          <h2 className="description__title">Notes</h2>
          <p className="description__text">
            {details.notes.text} <Pointers pointers={details.notes.pointers} />
          </p>
        </>
      )}

      <h2 className="description__title">Tracked bridges</h2>
      <ul>
        {bridges.map((bridge, i) => (
          <li key={i}>
            <EtherscanLink address={bridge.address} /> -{' '}
            {bridge.tokens.map((t: string) => t).join(', ')}
          </li>
        ))}
      </ul>

      {details.news && (
        <>
          <h2 className="description__title">News</h2>
          <ul>
            {details.news.map((news, i) => (
              <li key={i}>
                <a href={news.link}>{news.name}</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
