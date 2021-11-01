import cheerio, { Cheerio, Element } from 'cheerio'
import fsx from 'fs-extra'
import MarkdownIt from 'markdown-it'
import path from 'path'

import { PageMetadata } from '../../PageMetadata'
import { renderHeading } from './renderHeading'

export interface FaqPageProps {
  title: string
  metadata: PageMetadata
  content: string
}

export function getProps(): FaqPageProps {
  return {
    title: 'Frequently Asked Questions',
    metadata: {
      title: 'L2BEAT – Frequently Asked Questions',
      description:
        'Frequently Asked Questions about L2BEAT – an analytics and research website about Ethereum layer 2 scaling.',
      image: 'https://l2beat.com/meta-images/overview.png',
      url: 'https://l2beat.com/faq/',
    },
    content: getHtml(),
  }
}

function getHtml() {
  const markdown = MarkdownIt({ html: true })
  const file = fsx.readFileSync(path.join(__dirname, 'faq.md'), 'utf-8')
  const rendered = markdown.render(file)
  const $ = cheerio.load(rendered)
  $('a').each(function () {
    const $el = $(this)
    $el.attr('rel', 'noopener noreferrer')
    $el.attr('target', '_blank')
  })
  $('h1, h2, h3, h4, h5, h6').each(function () {
    const $el = $(this)
    const html = renderHeading(
      parseInt(this.tagName[1]),
      $el.text(),
      getId($el)
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
