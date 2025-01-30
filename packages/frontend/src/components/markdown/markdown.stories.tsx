import type { Meta, StoryObj } from '@storybook/react'

import { GlossaryContextProvider } from './glossary-context'
import { Markdown } from './markdown'

const meta = {
  title: 'Atoms/Markdown',
  component: Markdown,
  decorators: [
    (Story) => {
      return (
        <GlossaryContextProvider
          terms={[
            {
              id: 'bold-example',
              matches: ['Bold'],
            },
          ]}
        >
          <Story />
        </GlossaryContextProvider>
      )
    },
  ],
} satisfies Meta<typeof Markdown>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: `
# h1 Heading
## h2 Heading
### h3 Heading

## Horizontal Rules

___

---

***


## Typographic replacements

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text with stars**

__This is bold text with underscores__

*This is italic text with stars*

_This is italic text with underscores_

~~Strikethrough~~


## Blockquotes

> This is a blockquote
>
>
> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with \`+\`, \`-\`, or \`*\`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as \`1.\`

Start numbering with offset:

57. foo
1. bar


## Code

Inline \`code\`

Indented code

    // Some comments
    var foo = function (bar) {
      return bar++;
    };
    console.log(foo(5));

Block code "fences"

\`\`\`
Sample text here...
\`\`\`

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[link text](http://l2beat.com)

[link with title](http://l2beat.com "title text!")

Regular text https://l2beat.com doesn't autoconvert.
`,
  },
}
