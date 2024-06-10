import React from 'react'

import { FullPageHeader } from '../../../components/FullPageHeader'
import { Link } from '../../../components/Link'
import { PageContent } from '../../../components/PageContent'
import { OutLinkIcon } from '../../../components/icons'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import {
  DonateFundingSources,
  DonateFundingSourcesProps,
} from './DonateFundingSources'

export interface DonatePageProps {
  header: HeaderProps
  fundingSources: DonateFundingSourcesProps
}

export function DonatePage(props: DonatePageProps) {
  return (
    <DashboardLayout>
      <Header {...props.header} />
      <PageContent>
        <DonateFundingSources {...props.fundingSources} />
      </PageContent>
    </DashboardLayout>
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

function Header(props: HeaderProps) {
  return (
    <FullPageHeader>
      <div className="grid md:grid-cols-12">
        <div className="relative leading-normal md:col-span-7">
          <h1 className="font-bold text-6xl">Donate</h1>
          <p className="mt-6">
            Thank you for supporting L2BEAT’s mission to bring education and
            transparency to the blockchain space.
          </p>
          <p className="mt-6">
            We’re committed to delivering accurate and reliable information. We
            strive to be an impartial and independent watchdog that acts in the
            best interest of users and the broader ecosystem while always
            remaining credibly neutral and faithful to reality and facts. We
            deliver data and tools that allow our community to educate
            themselves, transact securely, and make well-informed decisions.
          </p>
          <p className="relative z-10 mt-6">
            Your support means a lot to our small, independent team. Thank you!
          </p>
          <div className="relative my-12 flex items-center justify-center md:hidden">
            <div className="z-10 flex flex-col items-center justify-center">
              <div className="size-[184px] rounded-xl bg-white p-3">
                <img src={props.qrCodeUrl} className="size-40" />
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
            <span className="text-purple-100 text-sm dark:text-pink-200">
              DONATE THROUGH
            </span>
            <div className="mt-2 flex flex-col gap-2 md:flex-row md:flex-wrap">
              {props.networks.map((network) => (
                <Link
                  key={network.name}
                  className="flex w-full justify-center gap-1.5 rounded-lg border border-gray-400 bg-gray-100 py-3 font-medium text-sm transition-colors md:w-max dark:border-zinc-500 dark:bg-zinc-800 dark:hover:bg-zinc-900 hover:bg-gray-200 md:px-3 md:py-1"
                  href={network.linkURL}
                  underline={false}
                >
                  {network.name}
                  <OutLinkIcon className="fill-current" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="relative col-span-5 hidden items-center justify-center md:flex">
          <div className="z-10 flex flex-col items-center justify-center">
            <div className="size-[236px] rounded-xl bg-white p-3">
              <img src={props.qrCodeUrl} className="size-[212px]" />
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
