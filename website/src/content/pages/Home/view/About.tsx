import { Heading } from '../../../common'
import { config } from '../../../config'

export function About() {
  if (!config.__DEV__showRiskView) {
    return null
  }
  return (
    <section className="About">
      <Heading level={2} id="about" title="About L2BEAT" />
      <p>
        L2BEAT is a analytics and research website about Ethereum layer two (L2)
        scaling. We provide a comparison of the various Ethereum L2 systems
        available today.
      </p>
      <p>
        An important differentiator between L2BEAT and similar sites is that
        L2BEAT is committed to educating users and lists only projects that
        match our narrow definition of L2. We define layer two as a chain that
        fully or partially derives its security from layer one Ethereum so that
        users do not have to rely on the honesty of L2 validators for the
        security of their funds.
      </p>
      <p>
        Because of our commitment to education we present various non-trivial
        metrics aside from Total Value Locked (TVL). We have carefully examined
        each L2 project to determine the inner workings of their technology as
        well as the associated risks. To learn about any of our listed projects
        visit their respective page on L2BEAT.
      </p>
      <p>
        We have also compiled a list of{' '}
        <a href="/faq">Frequently Asked Questions</a> that will help explain
        some of the decisions we made for our site. We hope you find L2BEAT a
        valuable resource.
      </p>
    </section>
  )
}
