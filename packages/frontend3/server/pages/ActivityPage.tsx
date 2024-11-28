import { Page } from '../components/Page'
import { ActivityProject } from '../services/ActivityService'

interface Props {
  projects: ActivityProject[]
}

export function ActivityPage(props: Props) {
  return (
    <Page title="Activity - Demo">
      <table>
        <thead>
          <tr>
            <td className="px-2 py-1 text-left">#</td>
            <td className="px-2 py-1 text-left">Name</td>
            <td className="px-2 py-1 text-right">TPS</td>
            <td className="px-2 py-1 text-right">Max TPS</td>
          </tr>
        </thead>
        <tbody>
          {props.projects.map((project, i) => (
            <tr key={project.id}>
              <td className="px-2 py-1">{i + 1}</td>
              <td className="px-2 py-1">{project.name}</td>
              <td className="px-2 py-1 text-right">{project.currentTps}</td>
              <td className="px-2 py-1 text-right">{project.maxTps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  )
}
