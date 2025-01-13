import { compact } from 'lodash'
import { type Metadata } from 'next'
import Image from 'next/image'
import { ContentWrapper } from '~/components/content-wrapper'
import { FullPageHeader } from '~/components/full-page-header'
import { CustomLink } from '~/components/link/custom-link'
import { env } from '~/env'
import { CustomLinkIcon } from '~/icons/outlink'
import { getDefaultMetadata } from '~/utils/metadata'
import { fundingSources } from './funding-sources'

export const metadata: Metadata = getDefaultMetadata({
  title: 'Donate - L2BEAT',
  openGraph: {
    url: '/donate',
  },
})

export default async function Page() {
  const gitcoinOption = env.NEXT_PUBLIC_GITCOIN_ROUND_LIVE

  const donateAddress = '0x41626BA92c0C2a1aD38fC83920300434082B1870'

  const networks = compact([
    {
      name: 'Ethereum',
      linkURL: `https://etherscan.io/address/${donateAddress}`,
    },
    {
      name: 'Arbitrum One',
      linkURL: `https://arbiscan.io/address/${donateAddress}`,
    },
    {
      name: 'OP Mainnet',
      linkURL: `https://optimistic.etherscan.io/address/${donateAddress}`,
    },
    {
      name: 'ZKsync Lite',
      linkURL: `https://zkscan.io/explorer/accounts/${donateAddress}`,
    },
    gitcoinOption && {
      name: 'Gitcoin',
      linkURL:
        'https://explorer.gitcoin.co/#/round/424/0x222ea76664ed77d18d4416d2b2e77937b76f0a35/0x222ea76664ed77d18d4416d2b2e77937b76f0a35-27',
    },
  ])

  return (
    <div>
      <Header ethereumAddress={donateAddress} networks={networks} />
      <ContentWrapper className="leading-[1.15]">
        <main>
          <DonateFundingSources />
        </main>
      </ContentWrapper>
    </div>
  )
}

interface HeaderProps {
  ethereumAddress: string
  networks: {
    name: string
    linkURL: string
  }[]
}

async function Header(props: HeaderProps) {
  return (
    <FullPageHeader contentWrapperClassName="leading-[1.15]">
      <div className="grid md:grid-cols-12">
        <div className="relative leading-normal md:col-span-7">
          <h1 className="text-5xl font-bold md:text-6xl">Donate</h1>
          <div className="mt-6 space-y-6">
            <p>
              Thank you for supporting L2BEAT&apos;s mission to bring education
              and transparency to the blockchain space.
            </p>
            <p>
              We&apos;re committed to delivering accurate and reliable
              information. We strive to be an impartial and independent watchdog
              that acts in the best interest of users and the broader ecosystem
              while always remaining credibly neutral and faithful to reality
              and facts. We deliver data and tools that allow our community to
              educate themselves, transact securely, and make well-informed
              decisions.
            </p>
            <p>
              Your support means a lot to our small, independent team. Thank
              you!
            </p>
          </div>
          <div className="relative my-12 flex items-center justify-center md:hidden">
            <div className="z-10 flex flex-col items-center justify-center">
              <div className="size-[184px] rounded-xl bg-white p-3">
                <Image
                  alt="QR Code of donate address"
                  src="/images/qr-codes/donate.png"
                  width={160}
                  height={160}
                  style={{
                    imageRendering: 'pixelated',
                  }}
                />
              </div>
              <p className="mx-auto mt-8 inline-block w-[21ch] break-all font-mono text-lg">
                {props.ethereumAddress}
              </p>
            </div>
            <div className="absolute flex size-full items-center justify-center">
              <div className="size-[356px] rounded-full bg-[#FFC2FD] blur-3xl dark:bg-[#7C387A]" />
            </div>
          </div>

          <div className="relative z-10 mt-6">
            <span className="text-sm uppercase text-purple-100 dark:text-pink-200">
              Donate through
            </span>
            <div className="mt-2 flex flex-col gap-2 md:flex-row md:flex-wrap">
              {props.networks.map((network) => (
                <CustomLink
                  key={network.name}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-divider bg-surface-secondary py-3 text-sm transition-colors duration-200 hover:bg-surface-secondary/50 md:w-max md:px-3 md:py-1"
                  href={network.linkURL}
                  underline={false}
                >
                  {network.name}
                  <CustomLinkIcon className="fill-current" />
                </CustomLink>
              ))}
            </div>
          </div>
        </div>
        <div className="relative col-span-5 hidden items-center justify-center md:flex">
          <div className="z-10 flex flex-col items-center justify-center">
            <div className="size-[236px] rounded-xl bg-white p-3">
              <Image
                alt="QR Code of donate address"
                src="/images/qr-codes/donate.png"
                width={212}
                height={212}
                style={{
                  imageRendering: 'pixelated',
                }}
              />
            </div>
            <p className="mx-auto mt-8 inline-block w-[21ch] break-all font-mono">
              {props.ethereumAddress}
            </p>
          </div>
          <div className="absolute flex size-full items-center justify-center">
            <div className="size-[400px] rounded-full bg-[#FFC2FD] blur-3xl dark:bg-[#7C387A]" />
          </div>
        </div>
      </div>
    </FullPageHeader>
  )
}

function DonateFundingSources() {
  return (
    <section id="funding-sources" className="mt-16 md:mt-20">
      <div className="rounded-lg md:bg-surface-primary md:p-8">
        <a
          className="mb-6 text-2xl font-bold md:text-3xl md:leading-normal"
          href="#funding-sources"
        >
          Funding sources
        </a>
        <p className="mt-6 text-base">
          As a public goods company, L2BEAT is financed in the open by the
          community. For transparency, we are providing L2BEAT&apos;s funding
          sources below.
        </p>
        <div className="mt-2 text-base leading-normal">
          <p>
            Those funding sources have been categorized based on the
            contribution amounts:
          </p>
          <ul className="ml-6 mt-2 list-disc">
            <li>
              <strong>Significant</strong>: Above 500,000 USD
            </li>
            <li>
              <strong>Medium</strong>: Between 100,000 USD and 500,000 USD
            </li>
            <li>
              <strong>Small</strong>: Below 100.000 USD
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto pb-3">
        <table>
          <thead>
            <tr className="h-14 border-b border-divider text-left text-sm text-secondary">
              <th className="min-w-[300px] md:pl-4">Source / Project</th>
              <th className="md:pl-4">Tier</th>
              <th className="md:pl-4">Description</th>
            </tr>
          </thead>
          <tbody>
            {fundingSources.map((item) => {
              return (
                <tr
                  className="h-14 border-b border-divider text-base last:border-b-0"
                  key={item.source}
                >
                  <td className="pr-4 md:px-4">{item.source}</td>
                  <td className="pr-4 md:px-4">{item.tier}</td>
                  <td className="whitespace-pre pr-4 md:whitespace-normal md:px-4">
                    {item.description}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-8 font-bold">Last updated: January 2024</div>
    </section>
  )
}
