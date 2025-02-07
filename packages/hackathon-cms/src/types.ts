export interface BasicInfoSection {
  type: 'BASIC_INFO';
  name: string;
  slug: string;
}

export interface BadgesSection {
  type: 'BADGES';
  badges: string[];
}

export interface DiscoverySection {
  type: 'DISCOVERY';
}

export interface LinksSection {
  type: 'LINKS';
  links: ProjectLinks;
}

export interface MilestonesSection {
  type: 'MILESTONES';
  milestones: Milestone[];
}

export interface TechnologySection {
  type: 'TECHNOLOGY';
  content: string;
}

export type Section =
  | BasicInfoSection
  | BadgesSection
  | DiscoverySection
  | LinksSection
  | MilestonesSection
  | TechnologySection;

export interface ProjectJSON {
  sections: Section[];
}
// Define the Milestone type.
export interface Milestone {
  title: string;
  url: string;
  date: string;
  type: string;
  description?: string;
}

// Define the keys used in a LINKS section.
export type LinkCategory = 'websites' |
  'apps' |
  'documentation' |
  'explorers' |
  'repositories' |
  'socialMedia' |
  'rollupCodes';

