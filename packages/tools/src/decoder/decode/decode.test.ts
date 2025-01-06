import { expect } from 'earl'
import {
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiItem,
  parseAbiParameters,
} from 'viem'
import { decode } from './decode'

describe(decode.name, () => {
  it('simple function', () => {
    const abi = 'function foo(address, uint, bool)'
    const encoded = encodeFunctionData({
      abi: [parseAbiItem(abi)],
      functionName: 'foo',
      args: ['0xABaBaBaBABabABabAbAbABAbABabababaBaBABaB', 2n, true],
    })

    const decoded = decode(encoded, [abi])
    if (decoded?.type !== 'function') {
      throw new Error('Decoding returned unexpected result')
    }
    expect(decoded.values).toEqual([
      {
        stack: ['0'],
        type: 'address',
        value: '0xABaBaBaBABabABabAbAbABAbABabababaBaBABaB',
      },
      { stack: ['1'], type: 'uint256', value: 2n },
      { stack: ['2'], type: 'bool', value: true },
    ])
  })

  it('dynamic types', () => {
    const abi = 'function foo(string, bytes)'
    const encoded = encodeFunctionData({
      abi: [parseAbiItem(abi)],
      functionName: 'foo',
      args: ['Hello', '0x12ab'],
    })

    const decoded = decode(encoded, [abi])
    if (decoded?.type !== 'function') {
      throw new Error('Decoding returned unexpected result')
    }
    expect(decoded.values).toEqual([
      { stack: ['0'], type: 'string', value: 'Hello' },
      { stack: ['1'], type: 'bytes', value: '0x12ab' },
    ])
  })

  it('fixed 1d array', () => {
    const abi = 'function foo(uint[2])'
    const encoded = encodeFunctionData({
      abi: [parseAbiItem(abi)],
      functionName: 'foo',
      args: [[1n, 2n]],
    })

    const decoded = decode(encoded, [abi])
    if (decoded?.type !== 'function') {
      throw new Error('Decoding returned unexpected result')
    }
    expect(decoded.values).toEqual([
      {
        stack: ['0'],
        type: 'array(2)',
        value: [
          { stack: ['0', '0'], type: 'uint256', value: 1n },
          { stack: ['0', '1'], type: 'uint256', value: 2n },
        ],
      },
    ])
  })

  it('dynamic 1d array', () => {
    const abi = 'function foo(uint[])'
    const encoded = encodeFunctionData({
      abi: [parseAbiItem(abi)],
      functionName: 'foo',
      args: [[1n, 2n]],
    })

    const decoded = decode(encoded, [abi])
    if (decoded?.type !== 'function') {
      throw new Error('Decoding returned unexpected result')
    }
    expect(decoded.values).toEqual([
      {
        stack: ['0'],
        type: 'array(2)',
        value: [
          { stack: ['0', '0'], type: 'uint256', value: 1n },
          { stack: ['0', '1'], type: 'uint256', value: 2n },
        ],
      },
    ])
  })

  it('mixed 2d array', () => {
    const abi = 'function foo(uint[2][])'
    const encoded = encodeFunctionData({
      abi: [parseAbiItem(abi)],
      functionName: 'foo',
      args: [
        [
          [1n, 2n],
          [3n, 4n],
        ],
      ],
    })

    const decoded = decode(encoded, [abi])
    if (decoded?.type !== 'function') {
      throw new Error('Decoding returned unexpected result')
    }
    expect(decoded.values).toEqual([
      {
        stack: ['0'],
        type: 'array(2)',
        value: [
          {
            stack: ['0', '0'],
            type: 'array(2)',
            value: [
              { stack: ['0', '0', '0'], type: 'uint256', value: 1n },
              { stack: ['0', '0', '1'], type: 'uint256', value: 2n },
            ],
          },
          {
            stack: ['0', '1'],
            type: 'array(2)',
            value: [
              { stack: ['0', '1', '0'], type: 'uint256', value: 3n },
              { stack: ['0', '1', '1'], type: 'uint256', value: 4n },
            ],
          },
        ],
      },
    ])
  })

  it('tuple', () => {
    const abi = 'function foo((uint, uint))'
    const encoded = encodeFunctionData({
      abi: [parseAbiItem(abi)],
      functionName: 'foo',
      args: [[1n, 2n]],
    })

    const decoded = decode(encoded, [abi])
    if (decoded?.type !== 'function') {
      throw new Error('Decoding returned unexpected result')
    }
    expect(decoded.values).toEqual([
      {
        stack: ['0'],
        type: 'tuple',
        value: [
          { stack: ['0', '0'], type: 'uint256', value: 1n },
          { stack: ['0', '1'], type: 'uint256', value: 2n },
        ],
      },
    ])
  })

  it('tuple 1d array', () => {
    const abi = 'function foo((uint, uint)[])'
    const encoded = encodeFunctionData({
      abi: [parseAbiItem(abi)],
      functionName: 'foo',
      args: [
        [
          [1n, 2n],
          [3n, 4n],
        ],
      ],
    })

    const decoded = decode(encoded, [abi])
    if (decoded?.type !== 'function') {
      throw new Error('Decoding returned unexpected result')
    }
    expect(decoded.values).toEqual([
      {
        stack: ['0'],
        type: 'array(2)',
        value: [
          {
            stack: ['0', '0'],
            type: 'tuple',
            value: [
              { stack: ['0', '0', '0'], type: 'uint256', value: 1n },
              { stack: ['0', '0', '1'], type: 'uint256', value: 2n },
            ],
          },
          {
            stack: ['0', '1'],
            type: 'tuple',
            value: [
              { stack: ['0', '1', '0'], type: 'uint256', value: 3n },
              { stack: ['0', '1', '1'], type: 'uint256', value: 4n },
            ],
          },
        ],
      },
    ])
  })

  it('tuple 2d array', () => {
    const abi = 'function foo((uint, uint)[][])'
    const encoded = encodeFunctionData({
      abi: [parseAbiItem(abi)],
      functionName: 'foo',
      args: [
        // @ts-ignore viem is wrong here
        [
          [
            [1n, 2n],
            [3n, 4n],
          ],
        ],
      ],
    })

    const decoded = decode(encoded, [abi])
    if (decoded?.type !== 'function') {
      throw new Error('Decoding returned unexpected result')
    }
    expect(decoded.values).toEqual([
      {
        stack: ['0'],
        type: 'array(1)',
        value: [
          {
            stack: ['0', '0'],
            type: 'array(2)',
            value: [
              {
                stack: ['0', '0', '0'],
                type: 'tuple',
                value: [
                  { stack: ['0', '0', '0', '0'], type: 'uint256', value: 1n },
                  { stack: ['0', '0', '0', '1'], type: 'uint256', value: 2n },
                ],
              },
              {
                stack: ['0', '0', '1'],
                type: 'tuple',
                value: [
                  { stack: ['0', '0', '1', '0'], type: 'uint256', value: 3n },
                  { stack: ['0', '0', '1', '1'], type: 'uint256', value: 4n },
                ],
              },
            ],
          },
        ],
      },
    ])
  })

  it('can decode parameters', () => {
    const abi = '(address, uint, bool)'
    const encoded = encodeAbiParameters(parseAbiParameters(abi.slice(1, -1)), [
      '0xABaBaBaBABabABabAbAbABAbABabababaBaBABaB',
      2n,
      true,
    ])

    const decoded = decode(encoded, [abi])
    if (decoded?.type !== 'parameters') {
      throw new Error('Decoding returned unexpected result')
    }
    expect(decoded.values).toEqual([
      {
        stack: ['0'],
        type: 'address',
        value: '0xABaBaBaBABabABabAbAbABAbABabababaBaBABaB',
      },
      { stack: ['1'], type: 'uint256', value: 2n },
      { stack: ['2'], type: 'bool', value: true },
    ])
  })
})
