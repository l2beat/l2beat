import React from 'react'

import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from './Arrows'
import { EthereumLineIcon } from './chart/EthereumLineIcon'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from './Chevron'
import { ActivityIcon } from './pages/ActivityIcon'
import { RiskIcon } from './pages/RiskIcon'
import { TvlIcon } from './pages/TvlIcon'
import { DiscordIcon } from './products/DiscordIcon'
import { GithubIcon } from './products/GithubIcon'
import { InstagramIcon } from './products/InstagramIcon'
import { LinkedInIcon } from './products/LinkedInIcon'
import { MediumIcon } from './products/MediumIcon'
import { RedditIcon } from './products/RedditIcon'
import { TelegramIcon } from './products/TelegramIcon'
import { TwitterIcon } from './products/TwitterIcon'
import { YouTubeIcon } from './products/YouTubeIcon'
import { OptimismIcon } from './providers/OptimismIcon'
import { StarkWareIcon } from './providers/StarkWareIcon'
import { ZkSyncIcon } from './providers/ZkSyncIcon'
import { AppsIcon } from './symbols/AppsIcon'
import { ArchivedIcon } from './symbols/ArchivedIcon'
import { BulletIcon } from './symbols/BulletIcon'
import { CheckIcon } from './symbols/CheckIcon'
import { CodeIcon } from './symbols/CodeIcon'
import { DocumentIcon } from './symbols/DocumentIcon'
import { FinanceIcon } from './symbols/FinanceIcon'
import { GlobeIcon } from './symbols/GlobeIcon'
import { InfoIcon } from './symbols/InfoIcon'
import { MenuCloseIcon } from './symbols/MenuCloseIcon'
import { MenuOpenIcon } from './symbols/MenuOpenIcon'
import { MilestoneIcon } from './symbols/MilestoneIcon'
import { MoonIcon } from './symbols/MoonIcon'
import { OutLinkIcon } from './symbols/OutLinkIcon'
import { SearchIcon } from './symbols/SearchIcon'
import { ShieldIcon } from './symbols/ShieldIcon'
import { SunIcon } from './symbols/SunIcon'
import { UnverifiedIcon } from './symbols/UnverifiedIcon'
import { UpcomingIcon } from './symbols/UpcomingIcon'
import { UserIcon } from './symbols/UserIcon'
import { WarningIcon } from './symbols/WarningIcon'

export default {
  title: 'Components/Icons',
}

function Template(props: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-lg justify-center gap-2 p-4">
      {props.children}
    </div>
  )
}

export function ChartIcons() {
  return (
    <Template>
      <EthereumLineIcon />
    </Template>
  )
}

export function PageIcons() {
  return (
    <Template>
      <TvlIcon />
      <RiskIcon />
      <ActivityIcon />
    </Template>
  )
}

export function ProductIcons() {
  return (
    <Template>
      <DiscordIcon />
      <GithubIcon />
      <InstagramIcon />
      <LinkedInIcon />
      <MediumIcon />
      <RedditIcon />
      <TelegramIcon />
      <TwitterIcon />
      <YouTubeIcon />
    </Template>
  )
}

export function ProviderIcons() {
  return (
    <Template>
      <OptimismIcon />
      <StarkWareIcon />
      <ZkSyncIcon />
    </Template>
  )
}

export function SymbolIcons() {
  return (
    <Template>
      <AppsIcon />
      <ArchivedIcon />
      <BulletIcon />
      <CheckIcon />
      <CodeIcon />
      <DocumentIcon />
      <FinanceIcon />
      <GlobeIcon />
      <InfoIcon />
      <OutLinkIcon />
      <MenuCloseIcon />
      <MenuOpenIcon />
      <MilestoneIcon />
      <MoonIcon />
      <SearchIcon />
      <ShieldIcon />
      <SunIcon />
      <UnverifiedIcon />
      <UpcomingIcon />
      <UserIcon />
      <WarningIcon />
    </Template>
  )
}

export function ArrowIcons() {
  return (
    <Template>
      <ArrowUpIcon />
      <ArrowDownIcon />
      <ArrowRightIcon />
    </Template>
  )
}

export function ChevronIcons() {
  return (
    <Template>
      <ChevronLeftIcon />
      <ChevronRightIcon />
      <ChevronDownIcon />
    </Template>
  )
}
