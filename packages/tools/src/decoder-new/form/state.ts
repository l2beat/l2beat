export const SUPPORTED_CHAINS = [
  { name: 'Ethereum', chainId: 1 },
  { name: 'OP Mainnet', chainId: 10 },
  { name: 'Gnosis', chainId: 100 },
  { name: 'Metis Andromeda', chainId: 1088 },
  { name: 'Polygon zkEVM', chainId: 1101 },
  { name: 'Unichain', chainId: 130 },
  { name: 'Polygon', chainId: 137 },
  { name: 'Sonic', chainId: 146 },
  { name: 'Soneium', chainId: 1868 },
  { name: 'Abstract', chainId: 2741 },
  { name: 'zkSync Era', chainId: 324 },
  { name: 'Arbitrum One', chainId: 42161 },
  { name: 'Arbitrum Nova', chainId: 42170 },
  { name: 'Avalanche C-Chain', chainId: 43114 },
  { name: 'World Chain', chainId: 480 },
  { name: 'Mantle', chainId: 5000 },
  { name: 'Scroll', chainId: 534352 },
  { name: 'Ink', chainId: 57073 },
  { name: 'Linea', chainId: 59144 },
  { name: 'Zora', chainId: 7777777 },
  { name: 'Blast', chainId: 81457 },
  { name: 'Base', chainId: 845 },
].sort((a, b) => a.chainId - b.chainId)

export interface State {
  values: {
    hash: string
    data: string
    address: string
    chainId: number
  }
  errors: {
    hash?: string
    data?: string
    address?: string
  }
  submitting: boolean
}

export const INITIAL_STATE: State = {
  values: {
    hash: '',
    data: '',
    address: '',
    chainId: 1,
  },
  errors: {},
  submitting: false,
}

export type Action =
  | { type: 'set hash'; value: string }
  | { type: 'set data'; value: string }
  | { type: 'set address'; value: string }
  | { type: 'set chainId'; value: number }
  | { type: 'submit' }
  | { type: 'submitted' }

const HASH_REGEX = /^0x[a-f\d]{64}$/i
const DATA_REGEX = /^0x([a-f\d]{2})*$/i
const ADDRESS_REGEX = /^0x[a-f\d]{40}$/i

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'set hash': {
      const value = action.value.trim()
      return {
        ...state,
        values: {
          hash: value.toLowerCase(),
          data: '',
          address: '',
          chainId: value === '' ? 1 : 0,
        },
        errors: {
          hash:
            !value || HASH_REGEX.test(value)
              ? undefined
              : 'Invalid transaction hash',
        },
      }
    }
    case 'set data': {
      const { data, address, chainId } = parseData(action.value)
      return {
        ...state,
        values: {
          hash: '',
          data,
          address: address ?? state.values.address,
          chainId:
            chainId ?? (state.values.hash !== '' ? 1 : state.values.chainId),
        },
        errors: {
          data: !data || DATA_REGEX.test(data) ? undefined : 'Invalid data',
          address: address ? undefined : state.errors.address,
        },
      }
    }
    case 'set address': {
      const value = action.value.trim()
      return {
        ...state,
        values: {
          ...state.values,
          address: value.toLowerCase(),
          hash: '',
          chainId: state.values.hash !== '' ? 1 : state.values.chainId,
        },
        errors: {
          ...state.errors,
          hash: undefined,
          address:
            !value || ADDRESS_REGEX.test(value)
              ? undefined
              : 'Invalid transaction hash',
        },
      }
    }
    case 'set chainId':
      return {
        ...state,
        values: { ...state.values, chainId: action.value, hash: '' },
        errors: {
          ...state.errors,
          hash: undefined,
        },
      }
    case 'submit':
      return { ...state, submitting: true }
    case 'submitted':
      return { ...state, submitting: false }
  }
}

function parseData(value: string) {
  value = value.trimStart()
  if (value.startsWith('0x')) {
    return { data: value.trim().toLowerCase() }
  }
  if (!value.startsWith('{')) {
    return { data: value }
  }
  const parsed = safeJsonParse(value)
  if (!parsed || typeof parsed !== 'object' || parsed === null) {
    return { data: value }
  }

  const domain = parsed['domain'] ?? {}
  const message = parsed['message'] ?? {}

  const data = parsed['data'] ?? message['data']
  const to = parsed['to'] ?? message['to']
  const chainId = parsed['chainId'] ?? message['chainId'] ?? domain['chainId']

  if (
    typeof data === 'string' &&
    DATA_REGEX.test(data) &&
    typeof to === 'string' &&
    ADDRESS_REGEX.test(to)
  ) {
    let parsedChainId =
      typeof chainId === 'number' || typeof chainId === 'string'
        ? Number(chainId)
        : undefined
    if (!SUPPORTED_CHAINS.some((c) => c.chainId === parsedChainId)) {
      parsedChainId = 0
    }
    return {
      data: data.toLowerCase(),
      address: to.toLowerCase(),
      chainId: parsedChainId,
    }
  }

  return { data: value }
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value)
  } catch {
    return undefined
  }
}
