import { externalLinks } from '~/consts/externalLinks'

export function RequestTokenBox() {
  return (
    <div className="mt-4 mb-4 flex flex-col items-start gap-3 bg-surface-primary px-4 py-5 md:mt-6 md:mb-20 md:flex-row md:items-center md:justify-between md:rounded-xl md:px-6">
      <p className="font-medium text-label-value-15">
        Can&apos;t find a token you&apos;re looking for?
      </p>
      <a
        className="flex items-center gap-1.5 rounded-md border border-divider px-3 py-1.5 font-medium text-label-value-13 leading-4 transition-colors hover:bg-surface-secondary"
        href={externalLinks.tokenRequest}
        target="_blank"
        rel="noreferrer"
      >
        Request it here
      </a>
    </div>
  )
}
