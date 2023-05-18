import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'
import React from 'react'

import { ReportPerEscrow } from '../../../../core/reports/createReports'
import { Page } from './Page'
import { reactToHtml } from './reactToHtml'

interface Project {
  projectId: ProjectId
  escrows: {
    address: EthereumAddress
    balance: bigint
  }[]
}

interface EscrowsPageProps {
  projects: Project[]
  timestamp: UnixTime
}

function EscrowsPage({ projects, timestamp }: EscrowsPageProps) {
  return (
    <Page title="escrows">
      {timestamp.toDate().toString()}
      {projects.map(({ projectId, escrows }, i) => (
        <div key={i}>
          <h2>{projectId}</h2>
          <table>
            <thead>
              <tr>
                <th>address</th>
                <th>balance</th>
              </tr>
            </thead>
            <tbody>
              {escrows.map(({ address, balance }, i) => (
                <tr key={i}>
                  <td>{address}</td>
                  <td>{balance.toString()}</td>
                </tr>
              ))}
              <tr>
                <td>SUM</td>
                <td>
                  {escrows
                    .reduce((acc, escrow) => acc + escrow.balance, 0n)
                    .toString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </Page>
  )
}

export function renderEscrowsPage(
  reports: ReportPerEscrow[],
  timestamp: UnixTime,
) {
  const props = getEscrowPageProps(reports, timestamp)
  return reactToHtml(<EscrowsPage {...props} />)
}

function getEscrowPageProps(
  reports: ReportPerEscrow[],
  timestamp: UnixTime,
): EscrowsPageProps {
  const projects = new Map<ProjectId, Project>()

  for (const { projectId, escrow, balance } of reports) {
    let project = projects.get(projectId)
    if (!project) {
      project = {
        projectId,
        escrows: [],
      }
      projects.set(projectId, project)
    }
    project.escrows.push({
      address: escrow,
      balance: balance,
    })
  }

  return {
    projects: [...projects.values()],
    timestamp,
  }
}
