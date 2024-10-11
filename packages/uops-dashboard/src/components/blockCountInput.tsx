export type InputMode = 'edit' | 'plus' | 'minus'

export function BlockCountInput({
  value,
  handleSetBlockCount,
}: {
  value: number
  handleSetBlockCount: (mode: InputMode, count?: number) => void
}) {
  const handlePlus = () => {
    handleSetBlockCount('plus')
  }

  const handleMinus = () => {
    handleSetBlockCount('minus')
  }

  const handleSet = (input: string) => {
    const newCount = Number.parseInt(input.replace(/\D/g, ''))
    handleSetBlockCount('edit', newCount)
  }

  return (
    <div className="mb-5 flex w-full items-center">
      <button
        onClick={handleMinus}
        type="button"
        id="decrement-button"
        data-input-counter-decrement="quantity-input"
        className="h-11 rounded-s-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-gray-700 dark:hover:bg-gray-600"
      >
        <svg
          className="h-3 w-3 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h16"
          />
        </svg>
      </button>
      <input
        onChange={(e) => handleSet(e.target.value)}
        value={value}
        type="text"
        id="quantity-input"
        data-input-counter
        aria-describedby="helper-text-explanation"
        className="block h-11 w-full border-gray-300 border-x-0 bg-gray-50 py-2.5 text-center text-gray-900 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        required
      />
      <button
        onClick={handlePlus}
        type="button"
        id="increment-button"
        data-input-counter-increment="quantity-input"
        className="h-11 rounded-e-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-gray-700 dark:hover:bg-gray-600"
      >
        <svg
          className="h-3 w-3 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>
    </div>
  )
}
