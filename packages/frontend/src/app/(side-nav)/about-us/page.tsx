import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card'

export default function Page() {
  return (
    <>
      <MainPageHeader>About Us</MainPageHeader>
      <PrimaryCard>
        <h1 className="mb-4 text-3xl font-bold md:hidden">About Us</h1>
        <p className="mb-6 text-xl font-bold">
          Learn about L2BEAT and its mission
        </p>
        <Details />
      </PrimaryCard>
    </>
  )
}

function Details() {
  return (
    <div className="grid gap-4 text-base font-normal leading-6 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <p>
          We are a public goods company dedicated to providing onchain
          transparency.
        </p>
        <p>
          What sets L2BEAT apart is our unwavering commitment to delivering
          accurate and reliable information. We strive to be an impartial and
          independent watchdog that acts in the best interest of users and the
          broader ecosystem while always remaining credibly neutral and faithful
          to reality and facts. We deliver data and tools that allow our
          community to educate themselves, transact securely, and make
          well-informed decisions.
        </p>
        <p>
          This approach has earned us recognition and a solid reputation in the
          industry, garnering praise from the global Ethereum community and
          making our voice highly valued by numerous organizations and
          institutions. We are unafraid of being vocal and opinionated when our
          values are at stake.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <p>Our work spans a wide range of areas, including:</p>
        <ul className="list-disc pl-4">
          <li>
            Research and analysis of public protocols, including L2s and
            bridges,
          </li>
          <li>Participation in protocol governance and security councils,</li>
          <li>Development of transparency solutions like explorers,</li>
          <li>Monitoring of smart contract upgrades,</li>
          <li>Operation of nodes, and validators,</li>
          <li>Publication of research reports,</li>
          <li>Organization of conferences.</li>
        </ul>
        <p>
          We receive generous funding from various public goods organizations,
          such as Gitcoin and the Ethereum Foundation, as well as from various
          private donors and investors. Additionally, we collaborate closely
          with leading companies in the space by accepting grants for specific
          projects.
        </p>
      </div>
    </div>
  )
}
