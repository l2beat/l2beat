import { assert } from '@l2beat/shared-pure'
import type * as AST from '@mradomski/fast-solidity-parser'
import type { TopLevelDeclaration } from './ParsedFilesManager'

// Decides whether a given base name will end up as an interface in the
// flattened output. Solidity only allows interfaces to inherit from other
// interfaces, so when the base will be emitted as a regular contract we
// must drop it from the generated `is` clause. Returns the canonical name
// of the base declaration in the output (may differ from the name used in
// the source if the base was imported under an alias like
// `import { Foo as Bar } from "..."`), or undefined to strip the base.
export type ResolveInterfaceBase = (baseName: string) => string | undefined

// Resolves a user-defined type name (`IFoo`, `Bar.Baz`, etc.) to its high
// level category. Used to decide whether a generated getter needs a memory
// data location for its return type. Returns undefined when the type is
// external and cannot be resolved.
export type ResolveTypeKind = (
  namePath: string,
) => 'struct' | 'enum' | 'typedef' | 'interface' | 'contract' | undefined

// Resolves a user-defined struct name to its top-level member typeNames.
// Used by the public-state-variable getter because Solidity's auto-generated
// getter for `MyStruct public x` returns `(field1, field2, ...)` — not the
// struct itself. Returns undefined when the struct cannot be resolved.
export type ResolveStructFields = (
  namePath: string,
) => AST.VariableDeclaration[] | undefined

// Canonicalizes a user-defined type name (e.g. an imported alias like
// `Safe`) to the name actually emitted in the flattened output (e.g.
// `GnosisSafe`). Returns the original name when no canonical mapping
// exists.
export type CanonicalizeTypeName = (namePath: string) => string

// When a base contract is stripped from the generated interface's `is`
// clause (because it will be emitted as a concrete contract in the output
// and interfaces cannot inherit from contracts), we lose the methods that
// the interface would have inherited from it. This callback returns the
// externally-visible function definitions that should be inlined into the
// interface to restore those methods.
export type InlineFunctionsForStrippedBase = (
  strippedBaseName: string,
) => AST.FunctionDefinition[]

// Returns metadata about the transitive inheritance chain of the given
// base contract, restricted to declarations that will survive in the
// flattened output. This includes:
//   - ancestorNames: short names of every contract reached by walking
//     inheritance from this base (including the base itself).
//   - functionNames: externally-visible function names declared anywhere
//     in the chain.
// Both are used together so the interface generator can compute a valid
// `override(...)` clause.
export interface KeptBaseInfo {
  ancestorNames: Set<string>
  functionNames: Set<string>
}
export type LookupKeptBaseInfo = (baseName: string) => KeptBaseInfo

export function generateInterfaceSourceFromContract(
  contract: TopLevelDeclaration,
  resolveInterfaceBase: ResolveInterfaceBase = (name) => name,
  resolveTypeKind: ResolveTypeKind = () => undefined,
  lookupKeptBaseInfo: LookupKeptBaseInfo = () => ({
    ancestorNames: new Set(),
    functionNames: new Set(),
  }),
  canonicalizeTypeName: CanonicalizeTypeName = (name) => name,
  inlineFunctionsForStrippedBase: InlineFunctionsForStrippedBase = () => [],
  resolveStructFields: ResolveStructFields = () => undefined,
): string {
  assert(
    contract.type === 'contract' || contract.type === 'abstract',
    'Only contracts are supported',
  )
  const ast = contract.ast as AST.ContractDefinition

  let result =
    '// NOTE(l2beat): This is a virtual interface, generated from the contract source code.\n'

  result += `interface ${contract.name}`
  // Set of every ancestor contract name visible in the generated interface
  // (via its kept bases, transitively). Used to filter `override(...)`
  // lists so that every named base is actually an ancestor.
  const keptAncestorNames = new Set<string>()
  // Set of all externally-visible function names inherited through kept
  // bases. Used to decide whether a bare `override` actually overrides
  // anything in the flattened output.
  const keptInheritedFunctionNames = new Set<string>()
  // Function definitions inlined to replace methods inherited from bases
  // that had to be stripped from the `is` clause.
  const inlinedFunctions: AST.FunctionDefinition[] = []
  if (ast.baseContracts.length > 0) {
    const baseNames = []
    for (const base of ast.baseContracts) {
      if (base.arguments.length > 0) {
        throw new Error('Base contract with arguments are not supported')
      }

      const namePath = base.baseName.namePath
      const shortName = namePath.split('.').slice(-1)[0] ?? namePath
      const canonical = resolveInterfaceBase(shortName)
      if (canonical === undefined) {
        // Base stripped: pull its externally-visible methods inline so
        // callers that rely on the virtual-interface ABI keep working.
        for (const fn of inlineFunctionsForStrippedBase(shortName)) {
          inlinedFunctions.push(fn)
        }
        continue
      }
      // Keep any namespace prefix but swap the short name for the
      // canonical declaration name (handles `import { Foo as Bar }`).
      const canonicalNamePath = namePath.includes('.')
        ? namePath.slice(0, namePath.lastIndexOf('.') + 1) + canonical
        : canonical
      baseNames.push(canonicalNamePath)
      const info = lookupKeptBaseInfo(shortName)
      for (const a of info.ancestorNames) keptAncestorNames.add(a)
      for (const f of info.functionNames) keptInheritedFunctionNames.add(f)
    }

    if (baseNames.length > 0) {
      result += ` is ${baseNames.join(', ')}`
    }
  }

  result += ' {'

  const elements: string[][] = []
  const padding = '    '

  // Emit inlined functions first so they appear at the top of the body.
  // Deduplicate by name+parameter-signature so a function that is also
  // directly declared on `contract` doesn't get emitted twice.
  const seenFunctionSigs = new Set<string>()
  const functionSignature = (fn: AST.FunctionDefinition): string => {
    const params = fn.parameters
      .map((p) =>
        p.typeName !== null
          ? formatTypeName(p.typeName, canonicalizeTypeName)
          : '',
      )
      .join(',')
    return `${fn.name ?? ''}(${params})`
  }
  for (const fn of inlinedFunctions) {
    const sig = functionSignature(fn)
    if (seenFunctionSigs.has(sig)) continue
    seenFunctionSigs.add(sig)
    elements.push([
      'FunctionDefinition',
      padding +
        formatFunctionDefinition(
          fn,
          keptAncestorNames,
          keptInheritedFunctionNames,
          canonicalizeTypeName,
        ),
    ])
  }

  for (const childGeneric of ast.subNodes) {
    const child = childGeneric as AST.ASTNode

    switch (child.type) {
      case 'FunctionDefinition': {
        if (child.isConstructor) {
          continue
        }
        // Only public/external functions belong to the external ABI.
        // Internal and private functions must be skipped because they can
        // have storage parameters, which external functions cannot.
        if (child.visibility === 'internal' || child.visibility === 'private') {
          continue
        }
        // Interfaces cannot declare fallback / receive in older Solidity
        // versions, and they never contribute to the callable external ABI
        // either way, so we drop them from the generated interface.
        if (child.isFallback || child.isReceiveEther) continue
        const sig = functionSignature(child)
        if (seenFunctionSigs.has(sig)) continue
        seenFunctionSigs.add(sig)

        elements.push([
          child.type,
          padding +
            formatFunctionDefinition(
              child,
              keptAncestorNames,
              keptInheritedFunctionNames,
              canonicalizeTypeName,
            ),
        ])
        break
      }
      case 'EventDefinition': {
        elements.push([
          child.type,
          padding + formatEventDefinition(child, canonicalizeTypeName),
        ])
        break
      }
      case 'CustomErrorDefinition': {
        elements.push([
          child.type,
          padding + formatErrorDefinition(child, canonicalizeTypeName),
        ])
        break
      }
      case 'StructDefinition': {
        elements.push([
          child.type,
          padding +
            formatStructDefinition(child, padding, canonicalizeTypeName),
        ])
        break
      }
      case 'EnumDefinition': {
        elements.push([
          child.type,
          padding + formatEnumDefinition(child, padding),
        ])
        break
      }
      case 'UsingForDeclaration': {
        // NOTE(radomski): Using for declaration is not supported in interfaces
        break
      }
      case 'StateVariableDeclaration': {
        // Public state variables auto-generate a view getter function. We
        // must preserve this getter so callers that interact with the
        // concrete type continue to compile. Non-public vars don't have an
        // externally visible getter and can be dropped.
        for (const variable of child.variables) {
          if (variable.visibility !== 'public') continue
          const getter = formatStateVariableGetter(
            variable,
            resolveTypeKind,
            keptAncestorNames,
            keptInheritedFunctionNames,
            canonicalizeTypeName,
            resolveStructFields,
          )
          if (getter === undefined) continue
          elements.push(['StateVariableGetter', padding + getter])
        }
        break
      }
      case 'ModifierDefinition': {
        // NOTE(radomski): Modifiers are not supported in interfaces
        break
      }
      default: {
        console.log(`Skipping: ${child.type}`)
      }
    }
  }

  if (elements.length > 0) {
    result += '\n'
    let prevType: string | undefined
    for (const [type, element] of elements) {
      if (prevType !== undefined && prevType !== type) {
        result += '\n'
      }

      result += element + '\n'

      prevType = type
    }
  }

  result += '}'

  return result
}

function formatEnumDefinition(
  enumDef: AST.EnumDefinition,
  padding: string,
): string {
  let result = `enum ${enumDef.name} {`
  if (enumDef.members.length > 0) {
    result += '\n'
    for (const [index, member] of enumDef.members.entries()) {
      const isLast = index === enumDef.members.length - 1
      const comma = isLast ? '' : ','

      result += `${padding.repeat(2)}${member.name}${comma}\n`
    }
  }
  result += `${padding}}`
  return result
}

function formatStructDefinition(
  struct: AST.StructDefinition,
  padding: string,
  canonicalize: CanonicalizeTypeName = (name) => name,
): string {
  let result = `struct ${struct.name} {`
  if (struct.members.length > 0) {
    result += '\n'
    for (const member of struct.members) {
      result += `${padding.repeat(2)}${formatParameter(member, canonicalize)};\n`
    }
  }
  result += `${padding}}`
  return result
}

function formatErrorDefinition(
  error: AST.CustomErrorDefinition,
  canonicalize: CanonicalizeTypeName = (name) => name,
): string {
  let result = `error ${error.name}(`

  if (error.parameters.length > 0) {
    const params = []
    for (const param of error.parameters) {
      params.push(formatParameter(param, canonicalize))
    }
    result += params.join(', ')
  }

  result += ');'
  return result
}

function formatEventDefinition(
  event: AST.EventDefinition,
  canonicalize: CanonicalizeTypeName = (name) => name,
): string {
  let result = `event ${event.name}(`
  if (event.parameters.length > 0) {
    const params = []
    for (const param of event.parameters) {
      params.push(formatParameter(param, canonicalize))
    }
    result += params.join(', ')
  }
  result += ');'
  return result
}

function formatFunctionDefinition(
  fn: AST.FunctionDefinition,
  keptAncestorNames: Set<string>,
  keptInheritedFunctionNames: Set<string>,
  canonicalize: CanonicalizeTypeName = (name) => name,
): string {
  let prefix = `function ${fn.name}`
  prefix = fn.isReceiveEther ? 'receive' : prefix
  prefix = fn.isFallback ? 'fallback' : prefix

  let declaration = `${prefix}(`
  if (fn.parameters.length > 0) {
    const params = []
    for (const param of fn.parameters) {
      params.push(formatParameter(param, canonicalize))
    }
    declaration += params.join(', ')
  }
  declaration += ')'

  const addons = ['external']
  if (fn.stateMutability !== null) {
    addons.push(fn.stateMutability)
  }
  // The original source had an override clause. We preserve it, but only
  // keep bases that still exist as ancestors of the generated interface.
  // For bare `override` (empty list), we only keep it if at least one
  // kept base transitively declares the function.
  if (fn.override !== null && fn.name !== null && fn.name !== undefined) {
    if (fn.override.length === 0) {
      if (keptInheritedFunctionNames.has(fn.name)) {
        addons.push('override')
      }
    } else {
      const kept = fn.override
        .map((x) => x.namePath)
        .filter((p) => {
          const short = p.split('.').slice(-1)[0] ?? p
          return keptAncestorNames.has(short)
        })
      if (kept.length > 0) {
        addons.push(`override(${kept.join(', ')})`)
      }
    }
  }
  if (addons.length > 0) {
    declaration += ` ${addons.join(' ')}`
  }

  if (fn.returnParameters !== null) {
    const returns = []
    for (const param of fn.returnParameters) {
      returns.push(formatParameter(param, canonicalize))
    }
    declaration += ` returns (${returns.join(', ')})`
  }

  declaration += ';'
  return declaration
}

// Generates the external view getter signature that Solidity auto-generates
// for a public state variable. Returns undefined for types that don't have a
// readable public getter (e.g. struct types where a return type is needed
// but we don't know it, functions, etc.). For our use-case we only need
// elementary/mapping/array types, which cover the common cases.
function formatStateVariableGetter(
  variable: AST.VariableDeclaration,
  resolveTypeKind: ResolveTypeKind,
  keptAncestorNames: Set<string>,
  keptInheritedFunctionNames: Set<string>,
  canonicalize: CanonicalizeTypeName = (name) => name,
  resolveStructFields: ResolveStructFields = () => undefined,
): string | undefined {
  const name = variable.identifier?.name
  if (name === undefined) return undefined
  if (variable.typeName === null) return undefined

  const params: string[] = []
  let typeName: AST.TypeName = variable.typeName

  // Unwind mappings/arrays to collect parameter types.
  while (typeName.type === 'Mapping' || typeName.type === 'ArrayTypeName') {
    if (typeName.type === 'Mapping') {
      params.push(formatTypeName(typeName.keyType, canonicalize))
      typeName = typeName.valueType
    } else {
      params.push('uint256')
      typeName = typeName.baseTypeName
    }
  }

  // Special case: for a struct-typed public state variable, Solidity's
  // auto-generated getter expands the struct into a tuple of its
  // top-level non-mapping / non-array fields (and drops those that don't
  // serialize). Render that expansion.
  let returnPart: string
  let topLevelIsStruct = false
  if (typeName.type === 'UserDefinedTypeName') {
    const kind = resolveTypeKind(typeName.namePath)
    if (kind === 'struct') {
      topLevelIsStruct = true
      const fields = resolveStructFields(typeName.namePath)
      if (fields === undefined) {
        // Cannot expand: fall back to returning the struct in memory.
        const canonicalName = formatTypeName(typeName, canonicalize)
        returnPart = `${canonicalName} memory`
      } else {
        const fieldPieces: string[] = []
        for (const f of fields) {
          if (f.typeName === null) continue
          // Skip fields that are not directly returnable (mappings / arrays).
          if (
            f.typeName.type === 'Mapping' ||
            f.typeName.type === 'ArrayTypeName'
          ) {
            continue
          }
          const t = formatTypeName(f.typeName, canonicalize)
          let mem = ''
          if (f.typeName.type === 'UserDefinedTypeName') {
            const innerKind = resolveTypeKind(f.typeName.namePath)
            if (innerKind === 'struct') mem = ' memory'
          } else if (f.typeName.type === 'ElementaryTypeName') {
            const n = f.typeName.name
            if (n === 'bytes' || n === 'string') mem = ' memory'
          }
          fieldPieces.push(`${t}${mem}`)
        }
        returnPart = fieldPieces.join(', ')
      }
    } else {
      returnPart = formatTypeName(typeName, canonicalize)
    }
  } else if (typeName.type === 'ElementaryTypeName') {
    const n = typeName.name
    const mem = n === 'bytes' || n === 'string' ? ' memory' : ''
    returnPart = `${formatTypeName(typeName, canonicalize)}${mem}`
  } else {
    returnPart = formatTypeName(typeName, canonicalize)
  }
  void topLevelIsStruct

  // Public state variables can override a function from a base. Preserve
  // the original override clause, filtering by whether each name is still
  // a valid ancestor of the generated interface.
  const override = (
    variable as unknown as {
      override?: Array<{ namePath: string }> | null
    }
  ).override
  let overrideClause = ''
  if (override !== null && override !== undefined) {
    if (override.length === 0) {
      if (keptInheritedFunctionNames.has(name)) overrideClause = ' override'
    } else {
      const kept = override
        .map((x) => x.namePath)
        .filter((p) => {
          const short = p.split('.').slice(-1)[0] ?? p
          return keptAncestorNames.has(short)
        })
      if (kept.length > 0) {
        overrideClause = ` override(${kept.join(', ')})`
      }
    }
  }

  return `function ${name}(${params.join(', ')}) external view${overrideClause} returns (${returnPart});`
}

function formatParameter(
  param: AST.VariableDeclaration,
  canonicalize: CanonicalizeTypeName = (name) => name,
): string {
  assert(param.typeName !== null, 'Parameter must have a type')
  let result = `${formatTypeName(param.typeName, canonicalize)}`
  if (param.storageLocation !== null) {
    result += ` ${param.storageLocation}`
  }
  if (param.identifier !== null) {
    result += ` ${param.identifier.name}`
  }

  return result
}

function formatTypeName(
  typeName: AST.TypeName,
  canonicalize: CanonicalizeTypeName = (name) => name,
): string {
  switch (typeName.type) {
    case 'ElementaryTypeName': {
      const mutability = (
        typeName as unknown as { stateMutability?: string | null }
      ).stateMutability
      if (mutability === 'payable') return `${typeName.name} payable`
      return typeName.name
    }
    case 'UserDefinedTypeName': {
      const namePath = typeName.namePath
      const parts = namePath.split('.')
      const short = parts.at(-1) ?? namePath
      const canonical = canonicalize(short)
      if (parts.length === 1) return canonical
      return parts.slice(0, -1).concat(canonical).join('.')
    }
    case 'Mapping': {
      return `mapping(${formatTypeName(
        typeName.keyType,
        canonicalize,
      )} => ${formatTypeName(typeName.valueType, canonicalize)})`
    }
    case 'ArrayTypeName': {
      const baseType = formatTypeName(typeName.baseTypeName, canonicalize)
      if (typeName.length === null) {
        return `${baseType}[]`
      }
      return `${baseType}[${formatExpression(typeName.length)}]`
    }
    case 'FunctionTypeName': {
      let declaration = 'function('
      const params = []
      for (const param of typeName.parameterTypes) {
        assert(param.typeName !== null, 'Function parameter must have a type')
        params.push(formatTypeName(param.typeName, canonicalize))
      }

      declaration += params.join(', ')
      declaration += ')'

      if (typeName.returnTypes !== null) {
        const returns = []
        for (const returnType of typeName.returnTypes) {
          assert(
            returnType.typeName !== null,
            'Function return type must have a type',
          )
          returns.push(formatTypeName(returnType.typeName, canonicalize))
        }
        declaration += ` returns (${returns.join(', ')})`
      }

      return declaration
    }
  }
}

function formatExpression(expression: AST.Expression): string {
  switch (expression.type) {
    case 'NumberLiteral':
      return expression.number
    case 'Identifier':
      return expression.name
    case 'StringLiteral':
      return `"${expression.value}"`
    default: {
      console.log('Unsupported expression type: ', expression.type)
    }
  }

  return ''
}
