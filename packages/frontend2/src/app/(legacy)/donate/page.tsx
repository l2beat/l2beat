import { compact } from 'lodash'
import { type Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { toDataURL } from 'qrcode'
import { showGitcoinOption } from '~/flags'
import OutLinkIcon from '~/icons/outlink.svg'
import { ContentWrapper } from '../_components/ContentWrapper'
import { OutLink } from '../_components/OutLink'

export const metadata: Metadata = {
  title: 'Donate - L2BEAT',
  openGraph: {
    url: 'https://l2beat.com/donate',
  },
}

const UPDATED_AT = new Date(Date.UTC(2024, 0))
const SIGNIFICANT_VALUE = 500000
const SMALL_VALUE = 100000

export default async function DonatePage() {
  const gitcoinOption = await showGitcoinOption()

  const donateAddress = '0x41626BA92c0C2a1aD38fC83920300434082B1870'
  const qrCodeUrl = await toDataURL(donateAddress, {
    color: {
      light: '#fafafa',
    },
    errorCorrectionLevel: 'H',
    margin: 0,
  })

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
      name: 'zkSync Lite',
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
      <Header
        ethereumAddress={donateAddress}
        qrCodeUrl={qrCodeUrl}
        networks={networks}
      />
      <ContentWrapper className="leading-[1.15]">
        <DonateFundingSources />
      </ContentWrapper>
    </div>
  )
}

interface HeaderProps {
  ethereumAddress: string
  qrCodeUrl: string
  networks: {
    name: string
    linkURL: string
  }[]
}

async function Header(props: HeaderProps) {
  const t = await getTranslations('donate')
  return (
    <header className="bg-pure-white py-24 dark:bg-zinc-900">
      <ContentWrapper className="flex items-center justify-center leading-[1.15]">
        <div className="grid md:grid-cols-12">
          <div className="relative leading-normal md:col-span-7">
            <h1 className="text-6xl font-bold">{t('title')}</h1>
            <div className="space-y-6 mt-6">{t.rich('description')}</div>
            <div className="relative my-12 flex items-center justify-center md:hidden">
              <div className="z-10 flex flex-col items-center justify-center">
                <div className="size-[184px] rounded-xl bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="QR Code of donate address"
                    src={props.qrCodeUrl}
                    className="size-40"
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
              <span className="text-sm text-purple-100 dark:text-pink-200 uppercase">
                {t('donateThrough.label')}
              </span>
              <div className="mt-2 flex flex-col gap-2 md:flex-row md:flex-wrap">
                {props.networks.map((network) => (
                  <OutLink
                    key={network.name}
                    className="flex justify-center items-center gap-1.5 text-sm rounded-lg border border-gray-400 bg-gray-100 py-3 transition-colors duration-200 hover:bg-gray-200 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:bg-zinc-900 md:px-3 md:py-1 w-full md:w-max"
                    href={network.linkURL}
                    underline={false}
                  >
                    {network.name}
                    <OutLinkIcon className="fill-current" />
                  </OutLink>
                ))}
              </div>
            </div>
          </div>
          <div className="relative col-span-5 hidden items-center justify-center md:flex">
            <div className="z-10 flex flex-col items-center justify-center">
              <div className="size-[236px] rounded-xl bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="QR Code of donate address"
                  src={props.qrCodeUrl}
                  className="size-[212px]"
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
      </ContentWrapper>
    </header>
  )
}

function DonateFundingSources() {
  const t = useTranslations('donate.fundingSources')
  const entries = [
    { key: 'ethereumFoundation', tier: 'significant' },
    { key: 'optimismRPGF', tier: 'significant' },
    { key: 'rewardsAndCompensation', tier: 'medium' },
    { key: 'gitcoin', tier: 'medium' },
    { key: 'directCommunityDonations', tier: 'small' },
    { key: 'l2Amsterdam', tier: 'small' },
    { key: 'l2Warsaw', tier: 'small' },
    { key: 'l2Days', tier: 'medium' },
    { key: 'upgradeabilityReport', tier: 'small' },
    { key: 'starkexExplorer', tier: 'medium' },
    { key: 'layerZeroDashboard', tier: 'medium' },
    { key: 'dacs', tier: 'small' },
  ] as const

  return (
    <section id="funding-sources" className="mt-16 md:mt-20">
      <div className="rounded-lg md:bg-gray-100 md:p-8 md:dark:bg-zinc-900">
        <a
          className="mb-6 text-2xl font-bold md:text-3xl md:leading-normal"
          href="#funding-sources"
        >
          {t('title')}
        </a>
        <p className="mt-6 text-base">{t('description')}</p>
        <div className="mt-2 text-base leading-normal">
          <p>{t('classification.description')}</p>
          <ul className="ml-6 mt-2 list-disc">
            {t.rich('classification.tiers', {
              significantValue: SIGNIFICANT_VALUE,
              smallValue: SMALL_VALUE,
            })}
          </ul>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto pb-3">
        <table>
          <thead>
            <tr className="h-14 border-b border-b-gray-200 text-left text-sm text-gray-50 dark:border-b-gray-800">
              <th className="min-w-[300px] md:pl-4">
                {t('table.columns.source')}
              </th>
              <th className="md:pl-4">{t('table.columns.tier')}</th>
              <th className="md:pl-4">{t('table.columns.description')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              return (
                <tr
                  className="h-14 border-b border-b-gray-200 text-base last:border-b-0 dark:border-b-gray-800"
                  key={entry.key}
                >
                  <td className="pr-4 md:px-4">
                    {t(`table.sources.${entry.key}.title`)}
                  </td>
                  <td className="pr-4 md:px-4">{t(`tier.${entry.tier}`)}</td>
                  <td className="whitespace-pre pr-4 md:whitespace-normal md:px-4">
                    {t.rich(`table.sources.${entry.key}.description`, {
                      dydxLink: (children) => (
                        <OutLink href="https://dydx.l2beat.com">
                          {children}
                        </OutLink>
                      ),
                      starkexRepo: (children) => (
                        <OutLink href="https://github.com/l2beat/starkex-explorer">
                          {children}
                        </OutLink>
                      ),
                    })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-8 font-bold">
        {t('lastUpdated', { updateDate: UPDATED_AT })}
      </div>
    </section>
  )
}
