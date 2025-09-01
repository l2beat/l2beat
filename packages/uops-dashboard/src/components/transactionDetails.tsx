import { type JSX, useState } from 'react'
import type { Chain } from '@/chains'
import type { CountedOperation, CountedTransaction } from '@/types'

export function TransactionDetails({
  tx,
  chain,
}: {
  tx: CountedTransaction
  chain: Chain
}) {
  const [modal, setModal] = useState(false)

  function printOperation(op: CountedOperation): JSX.Element {
    let padding = 'pl-0'
    switch (op.level) {
      case 1:
        padding = 'pl-4'
        break
      case 2:
        padding = 'pl-8'
        break
      case 3:
        padding = 'pl-12'
        break
      default:
        padding = 'pl-0'
        break
    }
    return (
      <>
        <p
          key={op.id}
          className={`${padding} mt-0 text-gray-500 dark:text-gray-400`}
        >
          {!op.contractAddress && `${op.methodName} (${op.count})`}

          {op.contractAddress && (
            <>
              {chain.explorerUrl ? (
                <a
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  href={`${chain.explorerUrl}/address/${op.contractAddress}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {op.contractName ?? op.contractAddress}
                </a>
              ) : (
                (op.contractName ?? op.contractAddress)
              )}
              .{op.methodName ?? op.methodSelector} ({op.count})
            </>
          )}
        </p>

        {op.children.map((child) => printOperation(child))}
      </>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModal(true)}
        className="me-2 ml-2 inline-flex items-center rounded-full bg-blue-700 p-2 text-center font-medium text-sm text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:focus:ring-blue-800 dark:hover:bg-blue-700"
      >
        <svg
          className="h-2 w-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </button>

      {modal && (
        <div
          id="default-modal"
          tabIndex={-1}
          className="fixed inset-0 flex items-center justify-center bg-black/50"
        >
          <div className="relative max-h-full w-full max-w-3xl p-4">
            <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
              <div className="flex items-center justify-between rounded-t border-b p-4 md:p-5 dark:border-gray-600">
                <h3 className="font-semibold text-gray-900 text-xl dark:text-white">
                  {tx.type}
                </h3>
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-gray-400 text-sm hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="default-modal"
                >
                  <svg
                    className="h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>

              <div className="overflow-x-auto p-4 md:p-5">
                <p className="mb-4 text-base text-gray-500 leading-relaxed dark:text-gray-400">
                  Hash:
                  {chain.explorerUrl ? (
                    <a
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      href={`${chain.explorerUrl}/tx/${tx.hash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {tx.hash}
                    </a>
                  ) : (
                    tx.hash
                  )}
                </p>
                {tx.details && printOperation(tx.details)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
