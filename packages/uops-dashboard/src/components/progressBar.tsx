export function ProgressBar({ count, of }: { count: number; of: number }) {
  const widthStyle = {
    width: `${(count / of) * 100}%`,
  }

  return (
    <div className="mt-5 w-full bg-gray-200 rounded-full dark:bg-gray-700">
      <div
        className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
        style={widthStyle}
      >
        {' '}
        {count}/{of}
      </div>
    </div>
  )
}
