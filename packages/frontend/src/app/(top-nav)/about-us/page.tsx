import { ContentWrapper } from '~/components/content-wrapper'
import { CustomLink } from '~/components/link/custom-link'

export default function Page() {
  return (
    <>
      <Header />
      <ContentWrapper>
        <div className="mt-8 grid gap-4 md:mt-20 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p>
              What sets L2BEAT apart is our unwavering commitment to delivering
              accurate and reliable information. We strive to be an impartial
              and independent watchdog that acts in the best interest of users
              and the broader ecosystem while always remaining credibly neutral
              and faithful to reality and facts. We deliver data and tools that
              allow our community to educate themselves, transact securely, and
              make well-informed decisions.
            </p>
            <p>
              This approach has earned us recognition and a solid reputation in
              the industry, garnering praise from the global Ethereum community
              and making our voice highly valued by numerous organizations and
              institutions. We are unafraid of being vocal and opinionated when
              our values are at stake.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <p>Our work spans a wide range of areas, including:</p>
            <ul className="list-disc pl-4">
              <li>
                Research and analysis of public protocols, including L2s and
                bridges,
              </li>
              <li>
                Participation in protocol governance and security councils,
              </li>
              <li>Development of transparency solutions like explorers,</li>
              <li>Monitoring of smart contract upgrades,</li>
              <li>Operation of nodes, and validators,</li>
              <li>Publication of research reports,</li>
              <li>Organization of conferences.</li>
            </ul>
            <p>
              We receive generous funding from various public goods
              organizations, such as Gitcoin and the Ethereum Foundation, as
              well as from various private donors and investors. Additionally,
              we collaborate closely with leading companies in the space by
              accepting grants for specific projects.
            </p>
          </div>
        </div>
        <div className="mt-6">
          You most likely have a lot of questions. We have created the{' '}
          <CustomLink href="/faq">Frequently Asked Questions</CustomLink> page
          just for you.
        </div>
      </ContentWrapper>
    </>
  )
}

function Header() {
  return (
    <header className="bg-pure-white py-24 dark:bg-zinc-900">
      <ContentWrapper className="flex items-center justify-center leading-[1.15]">
        <div className="w-full">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:justify-between">
            <h1 className="text-6xl font-bold">About L2BEAT</h1>
            <p className="w-full text-lg font-light lg:w-3/5">
              We are a public goods company dedicated to providing onchain
              transparency.
            </p>
          </div>
        </div>
      </ContentWrapper>
    </header>
  )
}
