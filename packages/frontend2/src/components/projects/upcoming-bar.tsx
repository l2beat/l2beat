import { UpcomingIcon } from '~/icons/upcoming'

export function UpcomingBar() {
  return (
    <div className="flex w-full justify-center rounded-lg bg-purple-100 py-2.5 text-white dark:bg-purple-100 md:px-0">
      <span className="flex flex-row">
        <span className="flex items-center">
          <UpcomingIcon />
        </span>
        <span className="ml-2 text-base font-medium dark:text-white">
          This is an upcoming project.{' '}
          <span className="hidden md:inline">Stay tuned!</span>
        </span>
      </span>
    </div>
  )
}
