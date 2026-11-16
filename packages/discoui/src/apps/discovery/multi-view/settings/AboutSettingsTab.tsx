import { IS_READONLY } from '../../../../config/readonly'
import { IconLink } from '../../../../icons/IconLink'
import { SettingsSection } from './SettingRow'

const ABOUT_LINKS: { title: string; description: string; href: string }[] = [
  {
    title: 'Source code',
    description: 'DiscoUI lives in the l2beat monorepo on GitHub.',
    href: 'https://github.com/l2beat/l2beat/tree/main/packages/discoui',
  },
  {
    title: 'Report an issue',
    description: 'Found a bug or miss a feature? Open an issue.',
    href: 'https://github.com/l2beat/l2beat/issues/new',
  },
  {
    title: 'ethbeat.org',
    description: 'The research these discoveries feed into.',
    href: 'https://ethbeat.org',
  },
]

export function AboutSettingsTab() {
  return (
    <>
      <AboutHeader />
      <SettingsSection title="Links">
        {ABOUT_LINKS.map((link) => (
          <AboutLink key={link.href} {...link} />
        ))}
      </SettingsSection>
      <p className="px-1 text-coffee-400 text-xs">
        © {new Date().getUTCFullYear()} ETHBEAT
      </p>
    </>
  )
}

function AboutHeader() {
  return (
    <div className="flex items-center gap-4 px-1">
      <img className="h-6" src="/logo.svg" alt="Disco" />
      <div className="min-w-0">
        <div className="font-semibold text-coffee-100 text-sm">DiscoUI</div>
        <div className="mt-0.5 text-coffee-300 text-xs leading-4">
          {IS_READONLY
            ? 'Read-only snapshot of the latest state reviewed by ETHBEAT.'
            : 'Local mode. Edits are written to your discovery config files.'}
        </div>
      </div>
    </div>
  )
}

function AboutLink(props: {
  title: string
  description: string
  href: string
}) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-6 px-4 py-3 hover:bg-coffee-700/40 max-sm:gap-3 max-sm:px-3"
    >
      <div className="min-w-0">
        <div className="font-medium text-coffee-100 text-sm group-hover:text-autumn-300">
          {props.title}
        </div>
        <div className="mt-1 text-coffee-300 text-xs leading-4">
          {props.description}
        </div>
      </div>
      <IconLink className="size-3.5 shrink-0 text-coffee-400 group-hover:text-autumn-300" />
    </a>
  )
}
