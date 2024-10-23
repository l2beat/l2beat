import { CustomLink } from '~/components/link/custom-link'

export function OthersComingSoonNotice() {
  return (
    <div className="mx-auto my-8 max-w-[640px] space-y-4 text-center">
      <p className="text-2xl font-bold">Coming soon</p>
      <p className="text-balance text-xs font-medium leading-[1.15] text-secondary">
        <i>
          <strong>Others</strong>
        </i>{' '}
        are projects that don’t have a proof system. We decided to give time all
        of the projects to introduce proof systems until the end of the year
        – after that all not eligible project will be listed here.
      </p>
      {/* TODO: add article link */}
      <CustomLink className="block text-sm font-bold" href="article-link">
        Read an article to learn more
      </CustomLink>
    </div>
  )
}
