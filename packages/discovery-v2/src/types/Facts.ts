/**
 * `facts.json`: what static analysis says about the prepared contract's
 * state, for the model to read instead of the whole source.
 *
 * One record per mutable state variable in the contract's inheritance
 * chain: who can write it from outside, under which modifiers, emitting
 * which events; who reads it. Plus the events nobody in scope emits, so a
 * plan never folds over them. Produced by the `facts` tool from the
 * compiler AST and the Datalog rules in `facts/rules`, consumed by the
 * authoring prompt under the `facts` strategy.
 */
import { v } from '@l2beat/validate'

export const FactsWriter = v.object({
  /** `name(type,...)` of the entry point, as the ABI spells it when it is external. */
  function: v.string(),
  modifiers: v.array(v.string()),
  events: v.array(v.string()),
})

export const FactsVariable = v.object({
  name: v.string(),
  type: v.string(),
  declaredIn: v.string(),
  visibility: v.string(),
  writers: v.array(FactsWriter),
  writtenInConstructor: v.boolean(),
  /** Entry points that read the variable, external view functions included. */
  readers: v.array(v.string()),
})

export const FactsSource = v.object({
  name: v.string(),
  address: v.string(),
  compilerVersion: v.string(),
  evmVersion: v.string().optional(),
  variables: v.array(FactsVariable),
  /** Events declared in scope that no entry point can emit. */
  neverEmitted: v.array(v.string()),
  /** Why analysis of this source produced nothing, when it did not. */
  error: v.string().optional(),
})

export const Facts = v.object({
  version: v.literal(1),
  sources: v.array(FactsSource),
})

export type Facts = v.infer<typeof Facts>
export type FactsSource = v.infer<typeof FactsSource>
export type FactsVariable = v.infer<typeof FactsVariable>
export type FactsWriter = v.infer<typeof FactsWriter>
