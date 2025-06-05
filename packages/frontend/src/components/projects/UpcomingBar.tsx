import { UpcomingIcon } from '~/icons/Upcoming'

export function UpcomingBar() {
  return (
    <div className="flex w-full justify-center rounded-lg bg-purple-100 py-2.5 text-white md:px-0 dark:bg-purple-100">
      <span className="flex flex-row">
        <span className="flex items-center">
          <UpcomingIcon />
        </span>
        <span className="ml-2 font-medium text-base dark:text-white">
          This is an upcoming project.{' '}
          <span className="hidden md:inline">Stay tuned!</span>
        </span>
      </span>
    </div>
  )
}
