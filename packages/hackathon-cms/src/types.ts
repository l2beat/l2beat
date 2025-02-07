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
    url: string;
  }
  
  export type Section = BasicInfoSection | BadgesSection | DiscoverySection;
  
  export interface ProjectJSON {
    sections: Section[];
  }
  