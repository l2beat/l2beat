import { Project } from '@l2beat/config'
import { Page } from '../../common/Page'
import { Footer } from '../../common/Footer'
import { Navbar } from '../../common/Navbar'

interface Props {
  projects: Project[]
}

export function HomePage({ projects }: Props) {
  return (
    <Page title="L2BEAT – The state of the layer two ecosystem">
      <Navbar />
      <div>
        <h1>Home</h1>
        <p>Sweet home!</p>
        <ol>
          {projects.map((project, i) => (
            <li key={i}>
              <a href={`/projects/${project.slug}`}>{project.name}</a>
            </li>
          ))}
        </ol>
      </div>
      <Footer />
    </Page>
  )
}
