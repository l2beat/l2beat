
import { Config } from "../../../build/config";
import { getFooterProps, getNavbarProps } from "../../../components";
import { Wrapped } from "../../Page";
import { GovernancePageProps } from "../view/GovernancePage";

export function getProps(
  config: Config
): Wrapped<GovernancePageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'governance'),
      footer: getFooterProps(config)
    },
    wrapper: {
      metadata: {
        title: 'Governance - L2BEAT',
        description: 'Governance - L2BEAT',
        // TODO: (governance) some image?
        image: '',
        url: 'https://l2beat.com/gov/',
      },
      banner: false,
    },
  }
}
