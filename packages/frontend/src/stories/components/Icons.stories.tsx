import React from 'react'

import * as Icons from '../../components/icons'

export default {
  title: 'Components/Icons',
}

export function ProductIcons() {
  return (
    <div className="mx-auto max-w-lg p-4 flex justify-center gap-2">
      <Icons.DiscordIcon />
      <Icons.GithubIcon />
      <Icons.InstagramIcon />
      <Icons.LinkedInIcon />
      <Icons.MediumIcon />
      <Icons.OptimismIcon />
      <Icons.RedditIcon />
      <Icons.StarkWareIcon />
      <Icons.TelegramIcon />
      <Icons.TwitterIcon />
      <Icons.YouTubeIcon />
    </div>
  )
}

export function SymbolIcons() {
  return (
    <div className="mx-auto max-w-lg p-4 flex justify-center gap-2">
      <Icons.FinanceIcon />
      <Icons.GlobeIcon />
      <Icons.InfoIcon />
      <Icons.LinkIcon />
      <Icons.MenuCloseIcon />
      <Icons.MenuOpenIcon />
      <Icons.MoonIcon />
      <Icons.ShieldBadIcon />
      <Icons.ShieldGoodIcon />
      <Icons.ShieldWarnIcon />
      <Icons.SunIcon />
      <Icons.WarningIcon />
    </div>
  )
}
