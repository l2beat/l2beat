import { Cheerio, Element,load } from 'cheerio'
import fsx from 'fs-extra'
import MarkdownIt from 'markdown-it'
import path from 'path'

import { Config } from '../../build/config'
import { getFooterProps, getNavbarProps } from '../../components'
import { Wrapped } from '../Page'
import { DefinitionsPageProps } from './DefinitionsPage'
import { renderHeading } from './renderHeading'

export function getProps(config: Config): Wrapped<DefinitionsPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'definitions'),
      title: 'Definitions',
      ratings: getHtml(),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: {
        title: 'L2BEAT - Definitions',
        description:
          'Definitions of rollup ratings used on L2BEAT. Learn more about the L2BEAT rollup ratings and how they are calculated.',
        image: 'https://l2beat.com/meta-images/overview-scaling.png',
        url: 'https://l2beat.com/faq/',
      },
    },
  }
}

function getHtml() {
  const markdown = MarkdownIt({ html: true })
  const file = fsx.readFileSync(path.join(__dirname, 'ratings.md'), 'utf-8')
  const rendered = markdown.render(file)
  const $ = load(rendered)
  $('a').each(function () {
    const $el = $(this)
    $el.attr('rel', 'noopener noreferrer')
    $el.attr('target', '_blank')
  })
  $('h1, h2, h3, h4, h5, h6').each(function () {
    const $el = $(this)
    const html = renderHeading(
      parseInt(this.tagName[1]),
      $el.html(),
      getId($el),
    )
    $el.replaceWith($(html))
  })
  return $('body').html() ?? ''
}

function getId($el: Cheerio<Element>) {
  return (
    $el.attr('id') ??
    $el
      .text()
      .toLowerCase()
      .replace(/[^a-z\d]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
}



