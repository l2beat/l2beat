import { expect } from 'earl'
import { parseJsonc } from './parseJsonc.js'

function expectJsonParseParity(input: string) {
  expect(parseJsonc(input)).toEqual(JSON.parse(input))
}

describe(parseJsonc.name, () => {
  describe('JSON.parse parity', () => {
    const cases: Array<[string, string]> = [
      ['null', 'null'],
      ['true', 'true'],
      ['false', 'false'],
      ['integer', '123'],
      ['negative number', '-123.45'],
      ['positive exponent', '6.022e23'],
      ['negative exponent', '1E-9'],
      ['empty string', '""'],
      ['escaped string', String.raw`"quote: \" backslash: \\ slash: \/"`],
      ['control escapes', String.raw`"\b\f\n\r\t"`],
      ['unicode escapes', String.raw`"\u0041\uD834\uDD1E"`],
      ['empty array', '[]'],
      ['empty object', '{}'],
      ['nested values', '{"a":[1,true,null,{"b":"c"}],"d":{}}'],
      ['duplicate keys', '{"a":1,"a":2}'],
      ['whitespace around root', ' \n\t\r { "a": 1 } \r\t\n '],
      ['string containing comment markers', String.raw`"http://a/b//c/*d*/"`],
    ]

    cases.forEach(([name, input]) => {
      it(`matches JSON.parse for ${name}`, () => {
        expectJsonParseParity(input)
      })
    })

    it('preserves negative zero', () => {
      expect(Object.is(parseJsonc('-0'), -0)).toEqual(true)
    })
  })

  describe('comments', () => {
    it('ignores line comments around and between object entries', () => {
      const input = String.raw`
        // leading comment
        {
          // before first property
          "a": 1, // after value
          "b": true // before object close
        }
        // trailing comment
      `

      expect(parseJsonc(input)).toEqual({ a: 1, b: true })
    })

    it('ignores block comments around and between array items', () => {
      const input = String.raw`
        /* leading comment */
        [
          /* before first */ 1,
          2 /* after second */,
          /* comment with // and JSON-ish text: { "x": [1, 2] } */
          3
        ]
        /* trailing comment */
      `

      expect(parseJsonc(input)).toEqual([1, 2, 3])
    })

    it('supports comments in nested structures', () => {
      const input = String.raw`
        {
          "outer": {
            "array": [
              true,
              /* between items */ false,
              null
            ],
            // comment before object property
            "inner": { "value": 42 }
          } // comment after nested object
        }
      `

      expect(parseJsonc(input)).toEqual({
        outer: {
          array: [true, false, null],
          inner: { value: 42 },
        },
      })
    })

    it('supports line comments ending with CRLF', () => {
      const input = '{\r\n  "a": 1, // comment\r\n  "b": 2\r\n}'

      expect(parseJsonc(input)).toEqual({ a: 1, b: 2 })
    })

    it('supports a line comment at end of file', () => {
      expect(parseJsonc('{"a":1}// eof comment')).toEqual({ a: 1 })
    })

    it('supports a block comment after a top-level primitive', () => {
      expect(parseJsonc('true /* trailing comment */')).toEqual(true)
    })

    it('does not treat comment markers inside strings as comments', () => {
      const input = String.raw`
        {
          "url": "https://example.com/path//segment",
          "glob": "/* not a block comment */",
          "quote": "she said \"// still string\"",
          "path": "C:\\Users\\name\\",
          "mixed": "text /* still string */ then // still string"
        }
      `

      expect(parseJsonc(input)).toEqual({
        url: 'https://example.com/path//segment',
        glob: '/* not a block comment */',
        quote: 'she said "// still string"',
        path: 'C:\\Users\\name\\',
        mixed: 'text /* still string */ then // still string',
      })
    })
  })

  describe('trailing commas', () => {
    it('allows trailing commas in arrays', () => {
      expect(parseJsonc('[1, 2, 3,]')).toEqual([1, 2, 3])
    })

    it('allows trailing commas in objects', () => {
      expect(parseJsonc('{"a":1,"b":2,}')).toEqual({ a: 1, b: 2 })
    })

    it('allows trailing commas in nested values with comments', () => {
      const input = String.raw`
        {
          "array": [
            1,
            2, // trailing array entry
          ],
          "object": {
            "enabled": true,
          },
        }
      `

      expect(parseJsonc(input)).toEqual({
        array: [1, 2],
        object: { enabled: true },
      })
    })

    it('allows a trailing comma after a block comment', () => {
      expect(parseJsonc('[1 /* one */, 2 /* two */,]')).toEqual([1, 2])
    })

    it('allows a trailing comma after a line comment', () => {
      const input = String.raw`
        [
          "https://example.com/path//segment" // comment after value
          ,
        ]
      `

      expect(parseJsonc(input)).toEqual(['https://example.com/path//segment'])
    })
  })

  describe('invalid inputs', () => {
    const invalidInputs: Array<[string, string]> = [
      ['empty input', ''],
      ['line comment only', '// only a comment'],
      ['block comment only', '/* only a comment */'],
      ['comment splitting true', 'tr/* comment */ue'],
      ['comment splitting null', 'nu// comment\nll'],
      ['comment splitting a number', '1/* comment */2'],
      ['comment splitting a negative number', '-/* comment */1'],
      ['unterminated string', '"unterminated // not a comment'],
      ['unterminated block comment', '{"a":1 /* missing end'],
      ['unterminated block comment after complete object', '{"a":1} /*'],
      ['unterminated block comment after complete primitive', 'true /*'],
      ['missing comma hidden by line comment', '{"a":1 // comment\n "b":2}'],
      ['missing comma hidden by block comment', '[1 /* comment */ 2]'],
      ['leading comma in array', '[,1]'],
      ['double comma in array', '[1,,2]'],
      ['only trailing comma in array', '[,]'],
      ['only trailing comma after block comment in array', '[/* comment */,]'],
      ['only trailing comma after line comment in array', '[// comment\n,]'],
      ['leading comma in object', '{,"a":1}'],
      ['double comma in object', '{"a":1,,}'],
      ['only trailing comma after block comment in object', '{/* comment */,}'],
      ['only trailing comma after line comment in object', '{// comment\n,}'],
      ['extra token after root', '{"a":1}, {"b":2}'],
      ['trailing comma after root primitive', 'true,'],
      ['unquoted object key', '{a:1}'],
      ['single quoted string', "{'a':1}"],
      ['hex number', '[0x10]'],
      ['leading plus number', '[+1]'],
      ['leading zero number', '[01]'],
      ['NaN', '[NaN]'],
      ['Infinity', '[Infinity]'],
      ['undefined', '{"a":undefined}'],
    ]

    invalidInputs.forEach(([name, input]) => {
      it(`throws for ${name}`, () => {
        expect(() => parseJsonc(input)).toThrow()
      })
    })
  })
})
