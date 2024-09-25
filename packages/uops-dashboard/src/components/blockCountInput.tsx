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
    <div className="mb-5 flex items-center w-full">
      <button
        onClick={handleMinus}
        type="button"
        id="decrement-button"
        data-input-counter-decrement="quantity-input"
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
      >
        <svg
          className="w-3 h-3 text-gray-900 dark:text-white"
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
        className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
      <button
        onClick={handlePlus}
        type="button"
        id="increment-button"
        data-input-counter-increment="quantity-input"
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
      >
        <svg
          className="w-3 h-3 text-gray-900 dark:text-white"
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
