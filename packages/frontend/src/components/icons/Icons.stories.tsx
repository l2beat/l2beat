import React from 'react'

import { onlyDesktopModes } from '../../../.storybook/modes'
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from './Arrows'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from './Chevron'
import { EthereumLineIcon } from './chart/EthereumLineIcon'
import { ActivityIcon } from './pages/ActivityIcon'
import { CostsIcon } from './pages/CostsIcon'
import { DataAvailabilityIcon } from './pages/DataAvailabilityIcon'
import { FinalityIcon } from './pages/FinalityIcon'
import { LivenessIcon } from './pages/LivenessIcon'
import { RiskIcon } from './pages/RiskIcon'
import { SummaryIcon } from './pages/SummaryIcon'
import { TvlIcon } from './pages/TvlIcon'
import { DiscordIcon } from './products/DiscordIcon'
import { GithubIcon } from './products/GithubIcon'
import { InstagramIcon } from './products/InstagramIcon'
import { LinkedInIcon } from './products/LinkedInIcon'
import { MediumIcon } from './products/MediumIcon'
import { RedditIcon } from './products/RedditIcon'
import { TelegramIcon } from './products/TelegramIcon'
import { XIcon } from './products/XIcon'
import { YouTubeIcon } from './products/YouTubeIcon'
import { OptimismIcon } from './providers/OptimismIcon'
import { StarkWareIcon } from './providers/StarkWareIcon'
import { ZKStackIcon } from './providers/ZKStackIcon'
import { ZkSyncLiteIcon } from './providers/ZkSyncLiteIcon'
import { ActiveIcon } from './symbols/ActiveIcon'
import { AppsIcon } from './symbols/AppsIcon'
import { ArchivedIcon } from './symbols/ArchivedIcon'
import { BulletIcon } from './symbols/BulletIcon'
import { CanonicalIcon } from './symbols/CanonicalIcon'
import { CheckIcon } from './symbols/CheckIcon'
import { CircleQuestionMark } from './symbols/CircleQuestionMark'
import { CodeIcon } from './symbols/CodeIcon'
import { DocumentIcon } from './symbols/DocumentIcon'
import { EmptyStateIcon } from './symbols/EmptyStateIcon'
import { ExternalIcon } from './symbols/ExternalIcon'
import { FinanceIcon } from './symbols/FinanceIcon'
import { GlobeIcon } from './symbols/GlobeIcon'
import { HeartIcon } from './symbols/HeartIcon'
import { InfoIcon } from './symbols/InfoIcon'
import { Layer3sIcon } from './symbols/Layer3sIcon'
import { MenuCloseIcon } from './symbols/MenuCloseIcon'
import { MenuOpenIcon } from './symbols/MenuOpenIcon'
import { MilestoneIcon } from './symbols/MilestoneIcon'
import { MoonIcon } from './symbols/MoonIcon'
import { NativeIcon } from './symbols/NativeIcon'
import { OutLinkIcon } from './symbols/OutLinkIcon'
import { RoundedWarningIcon } from './symbols/RoundedWarningIcon'
import { SearchIcon } from './symbols/SearchIcon'
import { ShieldIcon } from './symbols/ShieldIcon'
import { SunIcon } from './symbols/SunIcon'
import { TriangleWarningIcon } from './symbols/TriangleWarningIcon'
import { UnverifiedIcon } from './symbols/UnverifiedIcon'
import { UpcomingIcon } from './symbols/UpcomingIcon'
import { UserIcon } from './symbols/UserIcon'
import { VerifiedIcon } from './symbols/VerifiedIcon'

const meta = {
  title: 'Other/Icons',
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
}
export default meta

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
      <SummaryIcon />
      <TvlIcon />
      <RiskIcon />
      <DataAvailabilityIcon />
      <LivenessIcon />
      <FinalityIcon />
      <ActivityIcon />
      <CostsIcon />
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
      <XIcon />
      <YouTubeIcon />
    </Template>
  )
}

export function ProviderIcons() {
  return (
    <Template>
      <OptimismIcon />
      <StarkWareIcon />
      <ZKStackIcon />
      <ZkSyncLiteIcon />
    </Template>
  )
}

export function SymbolIcons() {
  return (
    <Template>
      <ActiveIcon />
      <AppsIcon />
      <ArchivedIcon />
      <BulletIcon />
      <CanonicalIcon />
      {/* Unchecked */}
      <CheckIcon />
      {/* Checked */}
      <CheckIcon className="stroke-black dark:stroke-white" />
      <CircleQuestionMark />
      <CodeIcon />
      <DocumentIcon />
      <EmptyStateIcon />
      <ExternalIcon />
      <FinanceIcon />
      <GlobeIcon />
      <HeartIcon />
      <InfoIcon />
      <Layer3sIcon />
      <MenuCloseIcon />
      <MenuOpenIcon />
      <MilestoneIcon />
      <MoonIcon />
      <NativeIcon />
      <OutLinkIcon />
      <RoundedWarningIcon />
      <SearchIcon />
      <ShieldIcon />
      <SunIcon />
      <TriangleWarningIcon />
      <UnverifiedIcon />
      <UpcomingIcon />
      <UserIcon />
      <VerifiedIcon />
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
