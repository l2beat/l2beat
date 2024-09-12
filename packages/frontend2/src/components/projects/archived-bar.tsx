import { ArchivedIcon } from '~/icons/archived'

export function ArchivedBar() {
  return (
    <div className="flex w-full justify-center rounded-lg bg-gray-200 py-2.5 dark:bg-zinc-700">
      <span className="flex flex-row">
        <span className="flex items-center">
          <ArchivedIcon />
        </span>
        <span className="ml-2 text-base font-medium">
          <span className="md:hidden">This project is archived.</span>
          <span className="hidden md:block">
            This project is archived and no longer maintained.
          </span>
        </span>
      </span>
    </div>
  )
}
