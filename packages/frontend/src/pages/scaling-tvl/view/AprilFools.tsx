import { Milestone } from '@l2beat/config'
import React from 'react'

import { FooterProps, NavbarProps } from '../../../components'
import { ScalingTvlViewProps } from './ScalingTvlView'

export interface AprilFoolsProps {
  tvl: string
  tvlWeeklyChange: string
  tvlEndpoint: string
  tvlView: ScalingTvlViewProps
  navbar: NavbarProps
  footer: FooterProps
  showActivity: boolean
  milestones?: Milestone[]
}

export function AprilFools(props: AprilFoolsProps) {
  if (!new Date().toISOString().startsWith('2023-04-01')) {
    return null
  }

  return (
    <>
      <div className="min-h-[100vh] bg-[#000000] pb-[70px] text-[#FFFFFF]">
        <nav className="flex h-[22px] justify-center">
          <ul className="flex h-full items-center justify-center gap-4 md:gap-8">
            <li className="text-[11px] uppercase text-[#969696]">
              <a href="https://gov.l2beat.com">Forum</a>
            </li>
            <li className="text-[11px] uppercase text-[#969696]">
              <a href="/donate">Donate</a>
            </li>
            <li className="text-[11px] uppercase text-[#969696]">
              <a href="/faq">FAQ</a>
            </li>
            <li className="text-[11px] uppercase text-[#969696]">
              <a href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f">
                Jobs
              </a>
            </li>
          </ul>
        </nav>

        <div className="h-[60px] border-b border-[#000000] bg-[#0E0E0E] pl-[100px]">
          <div className="select-none pt-[6px] text-[32px] font-bold">
            <span>L2 </span>
            <span className="rounded-md bg-[#FF9900] px-2 text-[#000000]">
              BEAT
            </span>
          </div>
        </div>

        <div className="mb-[21px] flex flex-wrap gap-2 bg-[#0E0E0E] px-[16px] md:px-[60px]">
          <a
            className="block h-[39px] border-b-2 border-[#FF9900] px-[16px] pt-[12px] text-center text-[10px] uppercase md:w-[160px] md:px-0"
            href="/scaling/tvl"
          >
            Scaling
          </a>
          <a
            className="block h-[39px] px-[16px] pt-[12px] text-center text-[10px] uppercase md:w-[160px] md:px-0"
            href="/bridges/tvl"
          >
            Bridges
          </a>
          <a
            className="block h-[39px] px-[16px] pt-[12px] text-center text-[10px] uppercase md:w-[160px] md:px-0"
            href="/scaling/tvl"
          >
            Total Value Locked
          </a>
          <a
            className="block h-[39px] px-[16px] pt-[12px] text-center text-[10px] uppercase md:w-[160px] md:px-0"
            href="/scaling/risk"
          >
            Risk Analysis
          </a>
          <a
            className="block h-[39px] px-[16px] pt-[12px] text-center text-[10px] uppercase md:w-[160px] md:px-0"
            href="/scaling/activity"
          >
            Activity
          </a>
        </div>

        <div className="mx-auto max-w-[932px] border border-[#232323] py-[16px] text-center text-[16px]">
          You are now viewing L2BEAT on April 1st 2023.{' '}
          <a href="#content" className="text-[#FF9000]">
            Scroll down.
          </a>
        </div>
        <div className="mx-auto max-w-[1402px] px-[16px] md:px-[40px]">
          <div className="mt-[38px] mb-[15px] text-[18px]">
            Hot Layer Twos on Ethereum
          </div>
          <div className="mb-[28px] flex flex-wrap gap-2">
            <a
              className="rounded-[20px] border-2 border-[#212121] bg-[#151515] py-[9px] px-[16px] text-[14px]"
              href="/scaling/tvl"
            >
              Scaling
            </a>
            <a
              className="rounded-[20px] border-2 border-[#212121] bg-[#151515] py-[9px] px-[16px] text-[14px]"
              href="/bridges/tvl"
            >
              Bridges
            </a>
            <a
              className="rounded-[20px] border-2 border-[#212121] bg-[#151515] py-[9px] px-[16px] text-[14px]"
              href="/scaling/tvl"
            >
              Total Value Locked
            </a>
            <a
              className="rounded-[20px] border-2 border-[#212121] bg-[#151515] py-[9px] px-[16px] text-[14px]"
              href="/scaling/risk"
            >
              Risk Analysis
            </a>
            <a
              className="rounded-[20px] border-2 border-[#212121] bg-[#151515] py-[9px] px-[16px] text-[14px]"
              href="/scaling/activity"
            >
              Activity
            </a>
          </div>
          <div className="grid grid-cols-1 gap-[11px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {props.tvlView.items
              .filter((item) => !item.isUpcoming && !item.isArchived)
              .map((item, i) => (
                <a
                  key={i}
                  className="block h-[242px]"
                  href={`/scaling/projects/${item.slug}`}
                >
                  <div className="relative">
                    <img
                      className="h-[181px] w-full"
                      src={`/aprilfools/blur-${i % 9}.png`}
                    />
                    <img
                      className="absolute top-[50%] left-[50%] w-[30%] translate-x-[-50%] translate-y-[-50%]"
                      src={`/icons/${item.slug}.png`}
                    />
                    <div className="absolute bottom-[7px] right-[6px] rounded bg-[#1B1B1B] bg-opacity-80 px-[6px] py-[1px] text-[12px] text-[#C6C6C6]">
                      {item.tvl}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-[6px]">
                    <div className="text-[12px] text-[#C6C6C6]">
                      {item.name}
                    </div>
                    <div className="flex gap-4">
                      <div className="text-[11px] text-[#767676]">
                        {item.sevenDayChange}
                      </div>
                      <div className="text-[11px] text-[#767676]">
                        {item.marketShare}
                      </div>
                    </div>
                  </div>
                  <div className="text-[17px] text-[#C6C6C6]">
                    {item.technology}, {item.purpose}
                  </div>
                </a>
              ))}
          </div>
        </div>
      </div>
      <div id="content" />
    </>
  )
}
