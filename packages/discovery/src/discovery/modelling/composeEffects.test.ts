import { expect } from 'earl'
import {
  composeEffects,
  type EffectKey,
  type EffectModel,
} from './composeEffects'

const effect = (address: string, name: string): EffectKey => ({
  address,
  effect: name,
})

describe(composeEffects.name, () => {
  it('composes local fragments from a source to a terminal', () => {
    const input = effect('oracle', 'wrong answer')
    const output = effect('price-feed', 'wrong price')

    const result = composeEffects({
      sources: [
        {
          id: 'oracle-owner',
          effect: input,
          principals: ['safe'],
          fragment: { description: 'Can replace the oracle answer.' },
        },
      ],
      rules: [
        {
          id: 'scale-answer',
          inputs: [input],
          output,
          fragment: {
            impact: 'The returned collateral price is scaled incorrectly.',
            limitation: 'Non-positive answers are rejected.',
          },
        },
      ],
      terminals: [
        {
          id: 'borrowing-impact',
          effect: output,
          fragment: {
            impact: 'Borrowing checks use the wrong price.',
            categories: ['funds-can-be-stolen'],
          },
        },
      ],
    })

    expect(result.terminals).toHaveLength(1)
    expect(result.terminals[0]?.principals).toEqual(['safe'])
    expect(result.terminals[0]?.fragments).toEqual([
      {
        type: 'source',
        id: 'oracle-owner',
        effect: input,
        description: 'Can replace the oracle answer.',
      },
      {
        type: 'rule',
        id: 'scale-answer',
        effect: output,
        impact: 'The returned collateral price is scaled incorrectly.',
        limitation: 'Non-positive answers are rejected.',
      },
      {
        type: 'terminal',
        id: 'borrowing-impact',
        effect: output,
        impact: 'Borrowing checks use the wrong price.',
        categories: ['funds-can-be-stolen'],
      },
    ])
  })

  it('requires every conjunctive input and unions their principals', () => {
    const signed = effect('aggregator', 'authorized report')
    const relayed = effect('aggregator', 'relayed report')
    const answer = effect('aggregator', 'fresh attacker answer')

    const result = composeEffects({
      sources: [
        { id: 'safe-signs', effect: signed, principals: ['safe'] },
        { id: 'safe-relays', effect: relayed, principals: ['safe'] },
        {
          id: 'signer-quorum',
          effect: signed,
          principals: ['signers'],
        },
        {
          id: 'transmitter',
          effect: relayed,
          principals: ['transmitters'],
        },
      ],
      rules: [
        {
          id: 'accept-report',
          inputs: [signed, relayed],
          output: answer,
        },
      ],
      terminals: [{ id: 'answer', effect: answer }],
    })

    expect(result.terminals).toHaveLength(4)
    expect(result.terminals.map((x) => x.principals)).toEqual([
      ['safe'],
      ['safe', 'transmitters'],
      ['safe', 'signers'],
      ['signers', 'transmitters'],
    ])
  })

  it('keeps combined limitations attached to their individual path nodes', () => {
    const sourceEffect = effect('oracle', 'bounded wrong answer')
    const intermediateEffect = effect('price-feed', 'bounded wrong price')
    const terminalEffect = effect('borrower-operations', 'unsafe borrowing')

    const result = composeEffects({
      sources: [
        {
          id: 'oracle-controller',
          effect: sourceEffect,
          principals: ['controller'],
          fragment: {
            limitation: 'The oracle enforces fixed min/max answer bounds.',
          },
        },
      ],
      rules: [
        {
          id: 'price-feed-check',
          inputs: [sourceEffect],
          output: intermediateEffect,
          fragment: {
            limitation: 'The price feed rejects non-positive answers.',
          },
        },
        {
          id: 'borrowing-impact',
          inputs: [intermediateEffect],
          output: terminalEffect,
          fragment: { impact: 'Borrowing checks use the wrong price.' },
        },
      ],
      terminals: [{ id: 'unsafe-borrowing', effect: terminalEffect }],
    })

    expect(
      result.terminals[0]?.fragments
        .map((fragment) => fragment.limitation)
        .filter((limitation) => limitation !== undefined),
    ).toEqual([
      'The oracle enforces fixed min/max answer bounds.',
      'The price feed rejects non-positive answers.',
    ])
  })

  it('does not produce a conjunctive output while an input is missing', () => {
    const signed = effect('aggregator', 'authorized report')
    const relayed = effect('aggregator', 'relayed report')
    const answer = effect('aggregator', 'fresh attacker answer')

    const result = composeEffects({
      sources: [{ id: 'signers', effect: signed, principals: ['signers'] }],
      rules: [
        {
          id: 'accept-report',
          inputs: [signed, relayed],
          output: answer,
        },
      ],
      terminals: [{ id: 'answer', effect: answer }],
    })

    expect(result.terminals).toEqual([])
  })

  it('preserves distinct proofs even when they have the same principal', () => {
    const proxyControl = effect('proxy', 'control')
    const wrongAnswer = effect('proxy', 'wrong answer')

    const result = composeEffects({
      sources: [
        {
          id: 'proxy-owner-path',
          effect: proxyControl,
          principals: ['safe'],
          fragment: { description: 'Replace the proxy aggregator.' },
        },
        {
          id: 'aggregator-owner-path',
          effect: proxyControl,
          principals: ['safe'],
          fragment: { description: 'Reconfigure the current aggregator.' },
        },
      ],
      rules: [
        {
          id: 'control-answer',
          inputs: [proxyControl],
          output: wrongAnswer,
        },
      ],
      terminals: [{ id: 'wrong-answer', effect: wrongAnswer }],
    })

    expect(result.terminals).toHaveLength(2)
    expect(result.terminals[0]?.principals).toEqual(['safe'])
    expect(result.terminals[1]?.principals).toEqual(['safe'])
    expect(result.terminals[0]?.id).not.toEqual(result.terminals[1]?.id)
    expect(result.terminals.map((x) => x.fragments[0]?.description)).toEqual([
      'Replace the proxy aggregator.',
      'Reconfigure the current aggregator.',
    ])
  })

  it('rejects cyclic derivations while keeping acyclic paths', () => {
    const a = effect('a', 'effect')
    const b = effect('b', 'effect')
    const c = effect('c', 'effect')

    const result = composeEffects({
      sources: [{ id: 'source-a', effect: a, principals: ['actor'] }],
      rules: [
        { id: 'a-to-b', inputs: [a], output: b },
        { id: 'b-to-a', inputs: [b], output: a },
        { id: 'b-to-c', inputs: [b], output: c },
      ],
      terminals: [
        { id: 'a', effect: a },
        { id: 'b', effect: b },
        { id: 'c', effect: c },
      ],
    })

    expect(result.terminals.map((x) => x.terminalId)).toEqual(['a', 'b', 'c'])
    expect(result.effects.map((x) => x.derivations.length)).toEqual([1, 1, 1])
  })

  it('preserves the branch shape of a conjunctive proof', () => {
    const left = effect('left', 'ready')
    const right = effect('right', 'ready')
    const joined = effect('join', 'ready')

    const result = composeEffects({
      sources: [
        { id: 'left-source', effect: left, principals: ['actor'] },
        { id: 'right-source', effect: right, principals: ['actor'] },
      ],
      rules: [{ id: 'join', inputs: [left, right], output: joined }],
      terminals: [{ id: 'joined', effect: joined }],
    })

    expect(result.terminals[0]?.trace).toEqual({
      type: 'rule',
      ruleId: 'join',
      effect: joined,
      inputs: [
        {
          type: 'source',
          sourceId: 'left-source',
          effect: left,
          principals: ['actor'],
        },
        {
          type: 'source',
          sourceId: 'right-source',
          effect: right,
          principals: ['actor'],
        },
      ],
    })
  })

  it('validates ambiguous rule definitions', () => {
    const input = effect('input', 'effect')
    const model: EffectModel = {
      sources: [],
      rules: [
        {
          id: 'duplicate-input',
          inputs: [input, input],
          output: effect('output', 'effect'),
        },
      ],
      terminals: [],
    }

    expect(() => composeEffects(model)).toThrow(
      'Rule "duplicate-input" has duplicate input ["input","effect"]',
    )
  })
})
