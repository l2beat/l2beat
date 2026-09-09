import { useQuery } from '@tanstack/react-query'
import { useId, useMemo, useState } from 'react'
import { type Hex, isAddress } from 'viem'
import { getSafeState } from './api'
import { useRegisterKnownHash } from './HashReferences'
import { calculateSafeHashes } from './safe'

export function SafeHashes(props: {
  calldata: Hex
  address?: Hex
  chainId?: number
  path: string
  anchor: string
}) {
  const id = useId()
  const [address, setAddress] = useState<string>(props.address ?? '')
  const [nonceOverride, setNonceOverride] = useState<string>()
  const chainId = props.chainId ?? 0
  const validAddress = isAddress(address, { strict: false })
  const query = useQuery({
    queryKey: ['safe-state', chainId, address.toLowerCase()],
    queryFn: () => getSafeState(chainId, address as Hex),
    enabled: validAddress && chainId > 0,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
  })
  const nonce = nonceOverride ?? query.data?.nonce ?? ''
  let hashes: ReturnType<typeof calculateSafeHashes> | undefined
  let error: string | undefined
  if (query.data && validAddress && !query.isFetching && !query.isError) {
    try {
      hashes = calculateSafeHashes({
        calldata: props.calldata,
        safe: address as Hex,
        chainId,
        version: query.data.version,
        nonce,
      })
    } catch (e) {
      error = e instanceof Error ? e.message : 'Cannot calculate Safe hashes.'
    }
  }

  const knownHash = useMemo(
    () =>
      hashes
        ? {
            id,
            hash: hashes.safeTxHash,
            address: address as Hex,
            chainId,
            nonce,
            path: props.path,
            anchor: props.anchor,
          }
        : undefined,
    [id, hashes?.safeTxHash, address, chainId, nonce, props.path, props.anchor],
  )
  useRegisterKnownHash(knownHash)

  return (
    <section
      aria-label="Safe transaction hashes"
      className="my-3 max-w-[900px] rounded border border-zinc-700 bg-zinc-900 p-4 text-sm"
    >
      <h3 className="mb-2 font-semibold text-zinc-200">
        Safe transaction hashes
      </h3>
      <label htmlFor={`${id}-safe`} className="mb-1 block text-zinc-400">
        Safe address · chain {chainId || 'unknown'}
      </label>
      <input
        id={`${id}-safe`}
        className="w-full rounded bg-zinc-800 px-2 py-1 font-mono"
        value={address}
        spellCheck={false}
        onChange={(e) => {
          setAddress(e.target.value.trim())
          setNonceOverride(undefined)
        }}
      />
      {!validAddress && (
        <p className="mt-2 text-amber-400">
          Enter the Safe address that receives this execTransaction call.
        </p>
      )}
      {chainId <= 0 && (
        <p className="mt-2 text-amber-400">
          Select a known chain in the decoder input.
        </p>
      )}
      {query.isFetching && (
        <p role="status" className="mt-2 text-zinc-400">
          Reading Safe version and nonce from RPC…
        </p>
      )}
      {query.isError && (
        <p role="alert" className="mt-2 text-red-400">
          Could not read Safe version and nonce from RPC. Check the address and
          chain, then retry.
        </p>
      )}
      {validAddress && chainId > 0 && (
        <button
          type="button"
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
          className="mt-2 min-h-8 text-blue-400 disabled:opacity-50"
        >
          {query.isFetching ? 'Reading RPC…' : 'Refresh RPC state'}
        </button>
      )}
      {query.data && (
        <>
          <p className="mt-2 text-zinc-400">
            Safe {query.data.version} · RPC block {query.data.blockNumber} ·
            current nonce {query.data.nonce}
          </p>
          <div className="my-2 flex items-center gap-3">
            <label htmlFor={`${id}-nonce`}>Transaction nonce</label>
            <input
              id={`${id}-nonce`}
              className="w-40 rounded bg-zinc-800 px-2 py-1 font-mono"
              inputMode="numeric"
              value={nonce}
              onChange={(e) => setNonceOverride(e.target.value)}
            />
            {nonceOverride !== undefined && (
              <button
                type="button"
                className="min-h-8 text-blue-400"
                onClick={() => setNonceOverride(undefined)}
              >
                Use current nonce
              </button>
            )}
          </div>
          <p className="mb-3 text-zinc-400">
            The nonce is absent from calldata. For queued, historical, or
            repeated Safe calls, set the nonce for this call.
          </p>
        </>
      )}
      {error && (
        <p role="alert" className="text-red-400">
          {error}
        </p>
      )}
      {hashes && (
        <>
          <p className="mb-2 text-zinc-400">
            Calculated locally from this call’s bytes. Compare the domain and
            message hashes with your Ledger.
          </p>
          <HashValue label="Domain hash" value={hashes.domainHash} />
          <HashValue label="Message hash" value={hashes.messageHash} />
          <HashValue label="Safe transaction hash" value={hashes.safeTxHash} />
          <details className="mt-2">
            <summary className="cursor-pointer text-zinc-400">
              Signing data (0x1901 + domain + message)
            </summary>
            <HashValue label="Signing data" value={hashes.signingData} />
          </details>
        </>
      )}
    </section>
  )
}

function HashValue({ label, value }: { label: string; value: Hex }) {
  const [copied, setCopied] = useState<string>()
  return (
    <div className="mt-2">
      <div className="flex items-center gap-3 text-zinc-400">
        <span>{label}</span>
        <button
          type="button"
          aria-label={`Copy ${label.toLowerCase()}`}
          className="min-h-8 text-blue-400"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value)
              setCopied(value)
            } catch {
              setCopied('failed')
            }
          }}
        >
          {copied === value
            ? 'Copied'
            : copied === 'failed'
              ? 'Copy failed'
              : 'Copy'}
        </button>
      </div>
      <code className="block break-all text-zinc-200">{value}</code>
    </div>
  )
}
