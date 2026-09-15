// A small tokenizer for Solidity, enough for faithful syntax colouring of the flattened sources.
// It runs over the whole text so block comments and strings that span lines keep their colour.

export type SolClass =
  | 'comment'
  | 'str'
  | 'num'
  | 'kw'
  | 'mod'
  | 'type'
  | 'builtin'
  | 'name'
  | 'op'
  | 'plain'

export interface SolToken {
  text: string
  cls: SolClass
}

const KEYWORDS = new Set([
  'pragma',
  'solidity',
  'abicoder',
  'experimental',
  'import',
  'as',
  'from',
  'contract',
  'interface',
  'library',
  'abstract',
  'is',
  'function',
  'modifier',
  'event',
  'error',
  'struct',
  'enum',
  'mapping',
  'constructor',
  'fallback',
  'receive',
  'returns',
  'return',
  'if',
  'else',
  'for',
  'while',
  'do',
  'break',
  'continue',
  'emit',
  'new',
  'delete',
  'try',
  'catch',
  'assembly',
  'using',
  'unchecked',
  'let',
  'switch',
  'case',
  'default',
  'leave',
  'throw',
])
const MODIFIERS = new Set([
  'public',
  'private',
  'internal',
  'external',
  'view',
  'pure',
  'payable',
  'constant',
  'immutable',
  'override',
  'virtual',
  'indexed',
  'anonymous',
  'storage',
  'memory',
  'calldata',
])
const BUILTINS = new Set([
  'msg',
  'block',
  'tx',
  'this',
  'super',
  'abi',
  'require',
  'assert',
  'revert',
  'keccak256',
  'sha256',
  'ripemd160',
  'ecrecover',
  'addmod',
  'mulmod',
  'selfdestruct',
  'blockhash',
  'gasleft',
  'type',
])
const LITERALS = new Set([
  'true',
  'false',
  'wei',
  'gwei',
  'ether',
  'seconds',
  'minutes',
  'hours',
  'days',
  'weeks',
])
const TYPE_RE =
  /^(?:u?int(?:8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?|address|bool|string|bytes(?:[1-9]|[12]\d|3[0-2])?|byte|u?fixed(?:\d+x\d+)?|var)$/
/** Keywords after which the next identifier names a declaration. */
const DECLARES = new Set([
  'contract',
  'interface',
  'library',
  'function',
  'modifier',
  'event',
  'error',
  'struct',
  'enum',
  'emit',
])

/** Tokens per line; a token never contains a newline. */
export function tokenizeSolidity(text: string): SolToken[][] {
  const lines: SolToken[][] = [[]]
  let line = lines[0] as SolToken[]
  const push = (raw: string, cls: SolClass) => {
    const parts = raw.split('\n')
    parts.forEach((part, k) => {
      if (k > 0) {
        line = []
        lines.push(line)
      }
      if (part) line.push({ text: part, cls })
    })
  }
  let i = 0
  let previousWord = ''
  while (i < text.length) {
    const rest = text.slice(i)
    let m: RegExpExecArray | null
    if (rest.startsWith('/*')) {
      const end = rest.indexOf('*/', 2)
      const s = end === -1 ? rest : rest.slice(0, end + 2)
      push(s, 'comment')
      i += s.length
      continue
    }
    if (rest.startsWith('//')) {
      const end = rest.indexOf('\n')
      const s = end === -1 ? rest : rest.slice(0, end)
      push(s, 'comment')
      i += s.length
      continue
    }
    if (
      (m =
        /^(?:hex|unicode)?(?:"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?)/.exec(
          rest,
        ))
    ) {
      push(m[0], 'str')
      i += m[0].length
      continue
    }
    if (
      (m = /^(?:0x[0-9a-fA-F_]+|\d[\d_]*(?:\.\d+)*(?:e[+-]?\d+)?)/.exec(rest))
    ) {
      push(m[0], 'num')
      i += m[0].length
      previousWord = ''
      continue
    }
    if ((m = /^[A-Za-z_$][\w$]*/.exec(rest))) {
      const word = m[0]
      let cls: SolClass = 'plain'
      if (DECLARES.has(previousWord)) cls = 'name'
      else if (KEYWORDS.has(word)) cls = 'kw'
      else if (MODIFIERS.has(word)) cls = 'mod'
      else if (TYPE_RE.test(word)) cls = 'type'
      else if (BUILTINS.has(word) && previousWord !== '.') cls = 'builtin'
      else if (LITERALS.has(word)) cls = 'num'
      else if (/^[A-Z]/.test(word) && previousWord !== '.') cls = 'type'
      push(word, cls)
      i += word.length
      previousWord = word
      continue
    }
    if ((m = /^\s+/.exec(rest))) {
      push(m[0], 'plain')
      i += m[0].length
      continue
    }
    if (
      (m =
        /^(?:=>|->|\*\*|<<|>>|&&|\|\||[-+*/%&|^<>!=]=|\+\+|--|[-+*/%&|^~<>!=?:;,.(){}[\]])/.exec(
          rest,
        ))
    ) {
      push(m[0], 'op')
      i += m[0].length
      previousWord = m[0] === '.' ? '.' : ''
      continue
    }
    push(rest[0] ?? '', 'plain')
    previousWord = ''
    i++
  }
  return lines
}
