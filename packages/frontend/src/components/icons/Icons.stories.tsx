import React from 'react'

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
import { FinanceIcon } from './symbols/FinanceIcon'
import { GlobeIcon } from './symbols/GlobeIcon'
import { InfoIcon } from './symbols/InfoIcon'
import { LinkIcon } from './symbols/LinkIcon'
import { MenuCloseIcon } from './symbols/MenuCloseIcon'
import { MenuOpenIcon } from './symbols/MenuOpenIcon'
import { MoonIcon } from './symbols/MoonIcon'
import { ShieldIcon } from './symbols/ShieldIcon'
import { SunIcon } from './symbols/SunIcon'
import { WarningIcon } from './symbols/WarningIcon'

export default {
  title: 'Components/Icons',
}

export function ProductIcons() {
  return (
    <div className="mx-auto max-w-lg p-4 flex justify-center gap-2">
      <DiscordIcon />
      <GithubIcon />
      <InstagramIcon />
      <LinkedInIcon />
      <MediumIcon />
      <RedditIcon />
      <TelegramIcon />
      <TwitterIcon />
      <YouTubeIcon />
    </div>
  )
}

export function ProviderIcons() {
  return (
    <div className="mx-auto max-w-lg p-4 flex justify-center gap-2">
      <OptimismIcon />
      <StarkWareIcon />
      <ZkSyncIcon />
    </div>
  )
}

export function SymbolIcons() {
  return (
    <div className="mx-auto max-w-lg p-4 flex justify-center gap-2">
      <FinanceIcon />
      <GlobeIcon />
      <InfoIcon />
      <LinkIcon />
      <MenuCloseIcon />
      <MenuOpenIcon />
      <MoonIcon />
      <ShieldIcon />
      <SunIcon />
      <WarningIcon />
    </div>
  )
}

export function PageIcons() {
  return (
    <div className="mx-auto max-w-lg p-4 flex justify-center gap-2">
      <TvlIcon />
      <RiskIcon />
      <ActivityIcon />
    </div>
  )
}
