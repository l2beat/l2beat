import { layer2s } from '@l2beat/config'
import { LogoGenerator } from './components/logo-generator'

export default function Page() {
  return (
    <div className="bg-pure-white p-4">
      <LogoGenerator
        projects={layer2s.map((l2) => ({
          name: l2.display.name,
          slug: l2.display.slug,
          isUpcoming: l2.isUpcoming,
          isArchived: l2.isArchived,
        }))}
      />
    </div>
  )
}
