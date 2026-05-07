export function Footer() {
  return (
    <footer
      id="site-footer"
      className="border-border/15 border-t bg-white"
    >
      <div className="mx-auto flex max-w-[1536px] flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row md:px-12">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <div className="flex items-center pb-1">
            <img src="/defiscan-logo-blue.svg" alt="DEFISCAN" className="h-7" />
          </div>
          <p className="font-normal text-[11px] text-text-muted uppercase tracking-[0.55px]">
            &copy; {new Date().getFullYear()} DeFi Collective. All rights
            reserved.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-4 md:gap-8">
          <FooterLink href="https://deficollective.org/terms/">
            Terms of Service
          </FooterLink>
          <FooterLink href="https://deficollective.org/privacy-policy/">
            Privacy Policy
          </FooterLink>
          <FooterLink href="https://docs.defiscan.info">
            Documentation
          </FooterLink>
          <div className="flex items-center gap-3 md:ml-0 md:border-border/15 md:border-l md:pl-2">
            <FooterIconLink
              href="https://x.com/deficollective"
              label="X (Twitter)"
            >
              <XIcon className="h-4 w-4" />
            </FooterIconLink>
            <FooterIconLink
              href="https://discord.gg/deficollective"
              label="Discord"
            >
              <DiscordIcon className="h-4 w-4" />
            </FooterIconLink>
            <FooterIconLink
              href="https://t.me/+_FwWfNxKo8tmZjA0"
              label="Telegram"
            >
              <TelegramIcon className="h-4 w-4" />
            </FooterIconLink>
            <FooterIconLink
              href="https://github.com/deficollective"
              label="GitHub"
            >
              <GitHubIcon className="h-4 w-4" />
            </FooterIconLink>
          </div>
        </nav>
      </div>
    </footer>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-normal text-[11px] text-text-muted uppercase tracking-[0.55px] underline transition-colors hover:text-text-secondary"
    >
      {children}
    </a>
  )
}

function FooterIconLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="text-text-muted transition-colors hover:text-text-secondary"
    >
      {children}
    </a>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3.2a.074.074 0 0 0-.079.037c-.34.607-.719 1.397-.984 2.02a18.27 18.27 0 0 0-5.487 0 12.683 12.683 0 0 0-.996-2.02.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 5.174 4.369a.07.07 0 0 0-.032.027C1.533 9.79.451 15.042.995 20.227a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.042-.106 13.121 13.121 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.645-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-10.425-4.144-15.83a.061.061 0 0 0-.031-.028ZM8.02 17.067c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419Zm7.974 0c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419Z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  )
}
