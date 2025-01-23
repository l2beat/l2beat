import { expect, formatCompact } from 'earl'

import { type ParsedLogArguments, parseLogArguments } from './parseLogArguments'

describe(parseLogArguments.name, () => {
  const patterns: [unknown[], ParsedLogArguments][] = [
    [
      [],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: undefined,
      },
    ],
    [
      ['message'],
      {
        message: 'message',
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: undefined,
      },
    ],
    [
      // passing another string causes it to be treated as a regular value
      ['foo', 'bar'],
      {
        message: 'foo',
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { value: 'bar' },
      },
    ],
    [
      // without a message, we extract it from parameters.message
      [{ message: 'message' }],
      {
        message: 'message',
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: undefined,
      },
    ],
    [
      // only parameters.message works
      [{ notMessage: 'message' }],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { notMessage: 'message' },
      },
    ],
    [
      // in case we have a string value, message in parameters is ignored
      ['foo', { message: 'bar' }],
      {
        message: 'foo',
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { message: 'bar' },
      },
    ],
    [
      // in case we have a string value, message in parameters is ignored
      [{ message: 'foo' }, 'bar'],
      {
        message: 'bar',

        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { message: 'foo' },
      },
    ],
    [
      ['foo', 'bar', 'baz'],
      {
        message: 'foo',
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { values: ['bar', 'baz'] },
      },
    ],
    [
      [new Error('error')],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: new Error('error'),
        parameters: undefined,
      },
    ],
    [
      [new Error('foo'), new Error('bar')],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: new Error('foo'),
        parameters: { value: new Error('bar') },
      },
    ],
    [
      [new Error('foo'), new Error('bar'), new Error('baz')],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: new Error('foo'),
        parameters: { values: [new Error('bar'), new Error('baz')] },
      },
    ],
    [
      ['message', new Error('error')],
      {
        message: 'message',
        chain: undefined,
        project: undefined,
        error: new Error('error'),
        parameters: undefined,
      },
    ],
    [
      [new Error('error'), 'message'],
      {
        message: 'message',
        chain: undefined,
        project: undefined,
        error: new Error('error'),
        parameters: undefined,
      },
    ],
    [
      // without an error, we extract it from parameters.error
      [{ error: new Error('error') }],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: new Error('error'),
        parameters: undefined,
      },
    ],
    [
      // only parameters.error works
      [{ notError: new Error('error') }],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { notError: new Error('error') },
      },
    ],
    [
      ['message', new Error('error'), { foo: 'bar' }],
      {
        message: 'message',
        chain: undefined,
        project: undefined,
        error: new Error('error'),
        parameters: { foo: 'bar' },
      },
    ],
    [
      [123],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { value: 123 },
      },
    ],
    [
      [123, 45],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { values: [123, 45] },
      },
    ],
    [
      [[123, 45]],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { value: [123, 45] },
      },
    ],
    [
      // we allow parameters to override the value field
      [123, { value: 45 }],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { value: 45 },
      },
    ],
    [
      // we allow parameters to override the values field
      [1, 2, 3, { values: 42 }],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { values: 42 },
      },
    ],
    [
      [{}],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: undefined,
      },
    ],
    [
      [{ foo: 'bar', baz: true }],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { foo: 'bar', baz: true },
      },
    ],
    [
      [
        { foo: 'bar', baz: true },
        { x: 1, y: 2 },
      ],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { foo: 'bar', baz: true, x: 1, y: 2 },
      },
    ],
    [
      [
        { foo: 'bar', baz: true },
        { x: 1, y: 2, baz: false },
      ],
      {
        message: undefined,
        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { foo: 'bar', baz: false, x: 1, y: 2 },
      },
    ],
    [
      [123, { foo: 'bar', baz: true }, { x: 4, y: 5 }],
      {
        message: undefined,

        chain: undefined,
        project: undefined,
        error: undefined,
        parameters: { foo: 'bar', baz: true, x: 4, y: 5, value: 123 },
      },
    ],
    [
      ['message', { chain: 'chain', project: 'project', x: 4, y: 5 }],
      {
        message: 'message',

        chain: 'chain',
        project: 'project',
        error: undefined,
        parameters: { x: 4, y: 5 },
      },
    ],
    [
      ['message', { chain: 'chain', project: 'project' }, { x: 4, y: 5 }],
      {
        message: 'message',

        chain: 'chain',
        project: 'project',
        error: undefined,
        parameters: { x: 4, y: 5 },
      },
    ],
  ]

  for (const [args, expected] of patterns) {
    it(`parses ${formatCompact(args, 60)}`, () => {
      expect(parseLogArguments(args)).toEqual(expected)
    })
  }
})
