import { Story } from '@storybook/react'
import React from 'react'

import {
  DiscordIcon,
  FinanceIcon,
  GithubIcon,
  GlobeIcon,
  InfoIcon,
  InstagramIcon,
  LinkedInIcon,
  LinkIcon,
  MediumIcon,
  MoonIcon,
  OptimismIcon,
  RedditIcon,
  ShieldBadIcon,
  ShieldGoodIcon,
  ShieldWarnIcon,
  StarkWareIcon,
  SunIcon,
  TelegramIcon,
  TwitterIcon,
  WarningIcon,
  YouTubeIcon,
} from '../../components/icons'

export default {
  title: 'Components/Icons',
  controls: { hideNoControlsWarning: true },
}

const ProductIconsTemplate = () => (
  <div className="mx-auto max-w-lg p-4 flex justify-center gap-2">
    <DiscordIcon />
    <GithubIcon />
    <InstagramIcon />
    <LinkedInIcon />
    <MediumIcon />
    <OptimismIcon />
    <RedditIcon />
    <StarkWareIcon />
    <TelegramIcon />
    <TwitterIcon />
    <YouTubeIcon />
  </div>
)

export const ProductIcons: Story = ProductIconsTemplate.bind({})

const SymbolIconsTemplate = () => (
  <div className="mx-auto max-w-lg p-4 flex justify-center gap-2">
    <FinanceIcon />
    <GlobeIcon />
    <InfoIcon />
    <LinkIcon />
    <MoonIcon />
    <ShieldBadIcon />
    <ShieldGoodIcon />
    <ShieldWarnIcon />
    <SunIcon />
    <WarningIcon />
  </div>
)

export const SymbolIcons: Story = SymbolIconsTemplate.bind({})
