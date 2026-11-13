import { CustomLink } from '~/components/link/CustomLink'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { RENAME_ANNOUNCEMENT_PATH } from '~/consts/siteName'
import { ChevronIcon } from '~/icons/Chevron'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'

export function AboutUsPage(props: AppLayoutProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>About us</MainPageHeader>
        <PrimaryCard>
          <h2 className="mb-6 font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
            Learn about ETHBEAT and its mission
          </h2>
          <Details />
          <MoreAboutUs />
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}

function Details() {
  return (
    <div className="grid gap-4 font-normal text-base leading-6 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <p>
          We are ETHBEAT (formerly L2BEAT), a public goods company dedicated to
          providing onchain transparency.{' '}
          <CustomLink href={RENAME_ANNOUNCEMENT_PATH}>
            Why the new name?
          </CustomLink>
        </p>
        <p>
          What sets ETHBEAT apart is our unwavering commitment to delivering
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

const MORE_ABOUT_US = [
  {
    title: 'Governance',
    description:
      'The ETHBEAT Governance Team: the latest insights, analyses, and updates.',
    href: '/governance',
  },
  {
    title: 'Donate',
    description:
      "Support ETHBEAT's independent research & development with a donation.",
    href: '/donate',
  },
]

function MoreAboutUs() {
  return (
    <div className="mt-8 grid gap-4 border-divider border-t pt-6 md:grid-cols-2">
      {MORE_ABOUT_US.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="group flex items-center gap-4 rounded-lg border border-divider p-4 transition-colors hover:bg-surface-secondary/50"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="font-bold text-lg group-hover:text-link">
              {item.title}
            </span>
            <span className="text-secondary text-sm">{item.description}</span>
          </span>
          <ChevronIcon className="-rotate-90 size-3 shrink-0 fill-secondary transition-colors group-hover:fill-link" />
        </a>
      ))}
    </div>
  )
}
