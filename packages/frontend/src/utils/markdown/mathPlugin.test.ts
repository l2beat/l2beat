import { expect } from 'earl'
import { createMarkdown } from './createMarkdown'
import { mathPlugin } from './mathPlugin'

describe(mathPlugin.name, () => {
  const md = createMarkdown().use(mathPlugin)

  it('renders inline math with KaTeX', () => {
    const html = md.render('Compute $f(x) = y$ here.')
    expect(html).toInclude('class="katex"')
    expect(html).not.toInclude('$f(x) = y$')
  })

  it('keeps trailing punctuation attached to inline math without wrapping', () => {
    const html = md.render(
      "Given $v_1$, invert $f(x)$. Check $m^*$'s bit and **never recovers $v_0$**.",
    )
    expect(html).toInclude('class="math-nowrap"')
    expect(html).toInclude('</span>,</span>')
    expect(html).toInclude('</span>.</span>')
    expect(html).toInclude('</span>’s</span>')
    expect(html).toInclude('</strong>.</span>')
  })

  it('renders single-line and multi-line block math', () => {
    const single = md.render('$$C = \\sum_{i=1}^{k} (w - 1 - d_i)$$')
    expect(single).toInclude('class="math-block"')
    expect(single).toInclude('class="katex-display"')

    const multi = md.render(
      '$$\nf(x) = \\begin{cases}\n1 & x = 0 \\\\\n0 & x \\neq 0\n\\end{cases}\n$$',
    )
    expect(multi).toInclude('class="math-block"')
    expect(multi).toInclude('class="katex-display"')
  })

  it('renders block math inside blockquotes', () => {
    const html = md.render(
      '> Intro\n>\n> $$\\begin{aligned}\n> A &\\Rightarrow B\n> \\end{aligned}$$',
    )
    expect(html).toInclude('<blockquote>')
    expect(html).toInclude('class="math-block"')
    expect(html).toInclude('class="katex-display"')
  })

  it('does not treat currency amounts as math', () => {
    const single = md.render('A loss of >$1k targeted younger code.')
    expect(single).not.toInclude('katex')
    expect(single).toInclude('$1k')

    const pair = md.render('Costs between $5 and $10 per day.')
    expect(pair).not.toInclude('katex')
    expect(pair).toInclude('$5 and $10')
  })
})
