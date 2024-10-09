export function ProgressBar({ count, of }: { count: number; of: number }) {
  const widthStyle = {
    width: `${(count / of) * 100}%`,
  }

  return (
    <div className="mt-5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
      <div
        className="rounded-full bg-blue-600 p-0.5 text-center font-medium text-blue-100 text-xs leading-none"
        style={widthStyle}
      >
        {' '}
        {count}/{of}
      </div>
    </div>
  )
}
