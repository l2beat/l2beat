import type * as AST from '@mradomski/fast-solidity-parser'

// A rule rewrites a node in place before it is hashed. Two programs are equal
// under a set of rules when their rewritten trees are equal.
export type Rule = (node: AST.ASTNode) => void
