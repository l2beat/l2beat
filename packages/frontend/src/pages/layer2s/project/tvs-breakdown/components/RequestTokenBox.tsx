import { externalLinks } from '~/consts/externalLinks'
import { HOME_BUTTON_CLASS } from '~/pages/home/homeStyles'

export function RequestTokenBox() {
  return (
    <div className="mt-4 mb-4 flex flex-col items-start gap-3 bg-surface-primary px-4 py-5 md:mt-6 md:mb-20 md:flex-row md:items-center md:justify-between md:rounded-xl md:px-6">
      <p className="font-medium text-label-value-15">
        Can&apos;t find a token you&apos;re looking for?
      </p>
      <a
        className={HOME_BUTTON_CLASS}
        href={externalLinks.tokenRequest}
        target="_blank"
        rel="noreferrer"
      >
        Request it here
      </a>
    </div>
  )
}
