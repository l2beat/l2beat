import type { Chain } from '@/chains'
import type { CountedOperation, Transaction } from '@/types'
import { useState } from 'react'

export function TransactionDetails({
  tx,
  chain,
}: { tx: Transaction; chain: Chain }) {
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
              <a
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                href={chain.getContractLink(op.contractAddress)}
                target="_blank"
                rel="noreferrer"
              >
                {op.contractName ?? op.contractAddress}
              </a>
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
        className="ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <svg
          className="w-2 h-2"
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
          className="fixed inset-0 flex items-center justify-center"
        >
          <div className="relative p-4 w-full max-w-3xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {tx.type}
                </h3>
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="default-modal"
                >
                  <svg
                    className="w-3 h-3"
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

              <div className="p-4 md:p-5">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-4">
                  Hash:
                  <a
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    href={chain.getTxLink(tx.hash)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tx.hash}
                  </a>
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
