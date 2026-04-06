export function Footer() {
  return (
    <footer className="bg-bg-primary border-t border-border/15 mt-16">
      <div className="mx-auto max-w-[1536px] px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2 pb-1">
            <img
              src="/defiscan-mark-blue.svg"
              alt=""
              className="size-6"
            />
            <span className="text-xl font-black text-text-primary tracking-[-1px]">
              DEFISCAN
            </span>
          </div>
          <p className="text-[11px] font-normal text-text-muted uppercase tracking-[0.55px]">
            &copy; {new Date().getFullYear()} DeFi Collective. All rights reserved.
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
      className="text-[11px] font-normal text-text-muted underline uppercase tracking-[0.55px] hover:text-text-secondary transition-colors"
    >
      {children}
    </a>
  )
}
