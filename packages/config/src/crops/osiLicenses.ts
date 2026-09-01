// GENERATED FILE - DO NOT EDIT BY HAND.
// Regenerate with: pnpm --filter @l2beat/config crops:generate-licenses
// Source: https://opensource.org/wp-json/wp/v2/license - the list behind https://opensource.org/licenses

// Deliberately dependency-free: this module is deep-imported by the frontend
// and by the l2b CLI. Keep it pure.

/** An open source license, as approved and published by the OSI. */
export interface OsiLicense {
  /** SPDX identifier, spelled the way the OSI records it. */
  spdxId: string
  name: string
  /** The license page on opensource.org. */
  url: string
  /**
   * How the OSI itself files the license: 'popular-strong-community' for the
   * dozen in wide use, 'superseded' and 'voluntarily-retired' for the ones it
   * no longer recommends, and so on. Approval is what the crop turns on - the
   * category is context for the reader, not a second bar.
   */
  categories: readonly string[]
}

/**
 * Every license the OSI has approved, keyed by SPDX id. This is the whole
 * definition of "open source" a CROPS review uses: a project's `license` must
 * name a key here, and the Open source crop may only be green when it does - a
 * license we cannot find on this list is not open source for our purposes,
 * however permissive it looks.
 */
export const OSI_LICENSES = {
  '0BSD': {
    spdxId: '0BSD',
    name: 'Zero-Clause BSD',
    url: 'https://opensource.org/license/0bsd',
    categories: ['other-miscellaneous'],
  },
  AAL: {
    spdxId: 'AAL',
    name: 'Attribution Assurance License',
    url: 'https://opensource.org/license/aal',
    categories: ['redundant-with-more-popular'],
  },
  'AFL-3.0': {
    spdxId: 'AFL-3.0',
    name: 'Academic Free License v. 3.0',
    url: 'https://opensource.org/license/afl-3-0',
    categories: ['redundant-with-more-popular'],
  },
  'AGPL-3.0': {
    spdxId: 'AGPL-3.0',
    name: 'GNU Affero General Public License version 3',
    url: 'https://opensource.org/license/agpl-3-0',
    categories: ['uncategorized'],
  },
  'Apache-1.1': {
    spdxId: 'Apache-1.1',
    name: 'Apache Software License, version 1.1',
    url: 'https://opensource.org/license/apache-1-1',
    categories: ['superseded'],
  },
  'Apache-2.0': {
    spdxId: 'Apache-2.0',
    name: 'Apache License, Version 2.0',
    url: 'https://opensource.org/license/apache-2-0',
    categories: ['popular-strong-community'],
  },
  'APL-1.0': {
    spdxId: 'APL-1.0',
    name: 'Adaptive Public License 1.0',
    url: 'https://opensource.org/license/apl-1-0',
    categories: ['other-miscellaneous'],
  },
  'APSL-2.0': {
    spdxId: 'APSL-2.0',
    name: 'Apple Public Source License 2.0',
    url: 'https://opensource.org/license/apsl-2-0',
    categories: ['non-reusable'],
  },
  'Artistic-1.0': {
    spdxId: 'Artistic-1.0',
    name: 'Artistic License 1.0',
    url: 'https://opensource.org/license/artistic-1-0',
    categories: ['superseded'],
  },
  'Artistic-1.0-Perl': {
    spdxId: 'Artistic-1.0-Perl',
    name: 'Artistic License (Perl) 1.0',
    url: 'https://opensource.org/license/artistic-1-0-perl',
    categories: ['superseded'],
  },
  'Artistic-2.0': {
    spdxId: 'Artistic-2.0',
    name: 'Artistic License 2.0',
    url: 'https://opensource.org/license/artistic-2-0',
    categories: ['other-miscellaneous'],
  },
  'BlueOak-1.0.0': {
    spdxId: 'BlueOak-1.0.0',
    name: 'Blue Oak Model License',
    url: 'https://opensource.org/license/blueoak-1-0-0',
    categories: ['redundant-with-more-popular'],
  },
  'BSD-1-Clause': {
    spdxId: 'BSD-1-Clause',
    name: '1-clause BSD License',
    url: 'https://opensource.org/license/bsd-1-clause',
    categories: ['other-miscellaneous'],
  },
  'BSD-2-Clause': {
    spdxId: 'BSD-2-Clause',
    name: 'The 2-Clause BSD License',
    url: 'https://opensource.org/license/bsd-2-clause',
    categories: ['popular-strong-community'],
  },
  'BSD-2-Clause-Patent': {
    spdxId: 'BSD-2-Clause-Patent',
    name: 'BSD+Patent',
    url: 'https://opensource.org/license/bsd-2-clause-patent',
    categories: ['special-purpose'],
  },
  'BSD-3-Clause': {
    spdxId: 'BSD-3-Clause',
    name: 'The 3-Clause BSD License',
    url: 'https://opensource.org/license/bsd-3-clause',
    categories: ['popular-strong-community'],
  },
  'BSD-3-Clause-LBNL': {
    spdxId: 'BSD-3-Clause-LBNL',
    name: 'Lawrence Berkeley National Labs BSD Variant License',
    url: 'https://opensource.org/license/bsd-3-clause-lbnl',
    categories: ['special-purpose'],
  },
  'BSD-3-Clause-Open-MPI': {
    spdxId: 'BSD-3-Clause-Open-MPI',
    name: 'BSD-3-Clause-Open-MPI',
    url: 'https://opensource.org/license/bsd-3-clause-open-mpi',
    categories: ['other-miscellaneous'],
  },
  'BSL-1.0': {
    spdxId: 'BSL-1.0',
    name: 'Boost Software License 1.0',
    url: 'https://opensource.org/license/bsl-1-0',
    categories: ['uncategorized'],
  },
  'CAL-1.0': {
    spdxId: 'CAL-1.0',
    name: 'Cryptographic Autonomy License',
    url: 'https://opensource.org/license/cal-1-0',
    categories: ['uncategorized'],
  },
  'CATOSL-1.1': {
    spdxId: 'CATOSL-1.1',
    name: 'Computer Associates Trusted Open Source License 1.1',
    url: 'https://opensource.org/license/catosl-1-1',
    categories: ['non-reusable'],
  },
  'CDDL-1.0': {
    spdxId: 'CDDL-1.0',
    name: 'Common Development and Distribution License 1.0',
    url: 'https://opensource.org/license/cddl-1-0',
    categories: ['popular-strong-community'],
  },
  'CDDL-1.1': {
    spdxId: 'CDDL-1.1',
    name: 'COMMON DEVELOPMENT AND DISTRIBUTION LICENSE (CDDL)',
    url: 'https://opensource.org/license/cddl-1-1',
    categories: ['uncategorized'],
  },
  'CECILL-2.1': {
    spdxId: 'CECILL-2.1',
    name: 'Cea Cnrs Inria Logiciel Libre License, version 2.1',
    url: 'https://opensource.org/license/cecill-2-1',
    categories: ['international'],
  },
  'CERN-OHL-P-2.0': {
    spdxId: 'CERN-OHL-P-2.0',
    name: 'CERN Open Hardware Licence Version 2 – Permissive',
    url: 'https://opensource.org/license/cern-ohl-p-2-0',
    categories: ['special-purpose'],
  },
  'CERN-OHL-S-2.0': {
    spdxId: 'CERN-OHL-S-2.0',
    name: 'CERN Open Hardware Licence Version 2 – Strongly Reciprocal',
    url: 'https://opensource.org/license/cern-ohl-s-2-0',
    categories: ['special-purpose'],
  },
  'CERN-OHL-W-2.0': {
    spdxId: 'CERN-OHL-W-2.0',
    name: 'CERN Open Hardware Licence Version 2 – Weakly Reciprocal',
    url: 'https://opensource.org/license/cern-ohl-w-2-0',
    categories: ['special-purpose'],
  },
  'CNRI-Python': {
    spdxId: 'CNRI-Python',
    name: 'The CNRI portion of the multi-part Python License',
    url: 'https://opensource.org/license/cnri-python',
    categories: ['non-reusable'],
  },
  'CPAL-1.0': {
    spdxId: 'CPAL-1.0',
    name: 'Common Public Attribution License Version 1.0',
    url: 'https://opensource.org/license/cpal-1-0',
    categories: ['uncategorized'],
  },
  'CPL-1.0': {
    spdxId: 'CPL-1.0',
    name: 'Common Public License Version 1.0',
    url: 'https://opensource.org/license/cpl-1-0',
    categories: ['superseded'],
  },
  'CUA-OPL-1.0': {
    spdxId: 'CUA-OPL-1.0',
    name: 'CUA Office Public License',
    url: 'https://opensource.org/license/cua-opl-1-0',
    categories: ['voluntarily-retired'],
  },
  curl: {
    spdxId: 'curl',
    name: 'curl License',
    url: 'https://opensource.org/license/curl',
    categories: ['legacy'],
  },
  'ECL-1.0': {
    spdxId: 'ECL-1.0',
    name: 'Educational Community License, Version 1.0',
    url: 'https://opensource.org/license/ecl-1-0',
    categories: ['superseded'],
  },
  'ECL-2.0': {
    spdxId: 'ECL-2.0',
    name: 'Educational Community License, Version 2.0',
    url: 'https://opensource.org/license/ecl-2-0',
    categories: ['special-purpose'],
  },
  'eCos-2.0': {
    spdxId: 'eCos-2.0',
    name: 'eCos License version 2.0',
    url: 'https://opensource.org/license/ecos-2-0',
    categories: ['non-reusable'],
  },
  'EFL-1.0': {
    spdxId: 'EFL-1.0',
    name: 'Eiffel Forum License, version 1',
    url: 'https://opensource.org/license/efl-1-0',
    categories: ['superseded'],
  },
  'EFL-2.0': {
    spdxId: 'EFL-2.0',
    name: 'Eiffel Forum License, Version 2',
    url: 'https://opensource.org/license/efl-2-0',
    categories: ['redundant-with-more-popular'],
  },
  Entessa: {
    spdxId: 'Entessa',
    name: 'Entessa Public License Version. 1.0',
    url: 'https://opensource.org/license/entessa',
    categories: ['non-reusable'],
  },
  'EPL-1.0': {
    spdxId: 'EPL-1.0',
    name: 'Eclipse Public License -v 1.0',
    url: 'https://opensource.org/license/epl-1-0',
    categories: ['superseded'],
  },
  'EPL-2.0': {
    spdxId: 'EPL-2.0',
    name: 'Eclipse Public License version 2.0',
    url: 'https://opensource.org/license/epl-2-0',
    categories: ['popular-strong-community'],
  },
  EUDatagrid: {
    spdxId: 'EUDatagrid',
    name: 'EU DataGrid Software License',
    url: 'https://opensource.org/license/eudatagrid',
    categories: ['non-reusable'],
  },
  'EUPL-1.1': {
    spdxId: 'EUPL-1.1',
    name: 'The European Union Public License, version 1.1',
    url: 'https://opensource.org/license/eupl-1-1',
    categories: ['superseded'],
  },
  'EUPL-1.2': {
    spdxId: 'EUPL-1.2',
    name: 'European Union Public Licence, version 1.2',
    url: 'https://opensource.org/license/eupl-1-2',
    categories: ['international'],
  },
  Fair: {
    spdxId: 'Fair',
    name: 'Fair License',
    url: 'https://opensource.org/license/fair',
    categories: ['redundant-with-more-popular'],
  },
  'Frameworx-1.0': {
    spdxId: 'Frameworx-1.0',
    name: 'Frameworx License 1.0',
    url: 'https://opensource.org/license/frameworx-1-0',
    categories: ['non-reusable'],
  },
  'GPL-1.0': {
    spdxId: 'GPL-1.0',
    name: 'GNU General Public License, version 1',
    url: 'https://opensource.org/license/gpl-1-0',
    categories: ['superseded'],
  },
  'GPL-2.0': {
    spdxId: 'GPL-2.0',
    name: 'GNU General Public License version 2',
    url: 'https://opensource.org/license/gpl-2-0',
    categories: ['popular-strong-community'],
  },
  'GPL-3.0': {
    spdxId: 'GPL-3.0',
    name: 'GNU General Public License version 3',
    url: 'https://opensource.org/license/gpl-3-0',
    categories: ['popular-strong-community'],
  },
  HPND: {
    spdxId: 'HPND',
    name: 'Historical Permission Notice and Disclaimer',
    url: 'https://opensource.org/license/hpnd',
    categories: ['redundant-with-more-popular'],
  },
  ICU: {
    spdxId: 'ICU',
    name: 'ICU License',
    url: 'https://opensource.org/license/icu',
    categories: [],
  },
  Intel: {
    spdxId: 'Intel',
    name: 'Intel Open Source License',
    url: 'https://opensource.org/license/intel',
    categories: ['voluntarily-retired'],
  },
  IPA: {
    spdxId: 'IPA',
    name: 'IPA Font License',
    url: 'https://opensource.org/license/ipa',
    categories: ['special-purpose'],
  },
  'IPL-1.0': {
    spdxId: 'IPL-1.0',
    name: 'IBM Public License Version 1.0',
    url: 'https://opensource.org/license/ipl-1-0',
    categories: ['non-reusable'],
  },
  ISC: {
    spdxId: 'ISC',
    name: 'ISC License',
    url: 'https://opensource.org/license/isc',
    categories: ['uncategorized'],
  },
  Jam: {
    spdxId: 'Jam',
    name: 'JAM License',
    url: 'https://opensource.org/license/jam',
    categories: ['other-miscellaneous'],
  },
  'LGPL-2.0': {
    spdxId: 'LGPL-2.0',
    name: 'GNU Library General Public License version 2',
    url: 'https://opensource.org/license/lgpl-2-0',
    categories: ['popular-strong-community'],
  },
  'LGPL-2.1': {
    spdxId: 'LGPL-2.1',
    name: 'GNU Lesser General Public License version 2.1',
    url: 'https://opensource.org/license/lgpl-2-1',
    categories: ['popular-strong-community'],
  },
  'LGPL-3.0': {
    spdxId: 'LGPL-3.0',
    name: 'GNU Lesser General Public License version 3',
    url: 'https://opensource.org/license/lgpl-3-0',
    categories: ['popular-strong-community'],
  },
  'LiLiQ-P-1.1': {
    spdxId: 'LiLiQ-P-1.1',
    name: 'Licence Libre du Québec – Permissive  version 1.1',
    url: 'https://opensource.org/license/liliq-p-1-1',
    categories: ['international'],
  },
  'LiLiQ-R-1.1': {
    spdxId: 'LiLiQ-R-1.1',
    name: 'Licence Libre du Québec – Réciprocité version 1.1',
    url: 'https://opensource.org/license/liliq-r-1-1',
    categories: ['international'],
  },
  'LiLiQ-Rplus-1.1': {
    spdxId: 'LiLiQ-Rplus-1.1',
    name: 'Licence Libre du Québec – Réciprocité forte version 1.1',
    url: 'https://opensource.org/license/liliq-rplus-1-1',
    categories: ['international'],
  },
  'LPL-1.0': {
    spdxId: 'LPL-1.0',
    name: 'Lucent Public License, Plan 9, version 1.0',
    url: 'https://opensource.org/license/lpl-1-0',
    categories: ['superseded'],
  },
  'LPL-1.02': {
    spdxId: 'LPL-1.02',
    name: 'Lucent Public License Version 1.02',
    url: 'https://opensource.org/license/lpl-1-02',
    categories: ['redundant-with-more-popular'],
  },
  'LPPL-1.3c': {
    spdxId: 'LPPL-1.3c',
    name: 'LaTeX Project Public License, Version 1.3c',
    url: 'https://opensource.org/license/lppl-1-3c',
    categories: ['non-reusable'],
  },
  MirOS: {
    spdxId: 'MirOS',
    name: 'MirOS Licence',
    url: 'https://opensource.org/license/miros',
    categories: ['uncategorized'],
  },
  MIT: {
    spdxId: 'MIT',
    name: 'The MIT License',
    url: 'https://opensource.org/license/mit',
    categories: ['popular-strong-community'],
  },
  'MIT-0': {
    spdxId: 'MIT-0',
    name: 'MIT No Attribution License',
    url: 'https://opensource.org/license/mit-0',
    categories: ['other-miscellaneous'],
  },
  'MIT-CMU': {
    spdxId: 'MIT-CMU',
    name: 'CMU License',
    url: 'https://opensource.org/license/mit-cmu',
    categories: [],
  },
  Motosoto: {
    spdxId: 'Motosoto',
    name: 'Motosoto Open Source License',
    url: 'https://opensource.org/license/motosoto',
    categories: ['non-reusable'],
  },
  'MPL-1.0': {
    spdxId: 'MPL-1.0',
    name: 'Mozilla Public License, version 1.0',
    url: 'https://opensource.org/license/mpl-1-0',
    categories: ['superseded'],
  },
  'MPL-1.1': {
    spdxId: 'MPL-1.1',
    name: 'Mozilla Public License 1.1',
    url: 'https://opensource.org/license/mpl-1-1',
    categories: ['superseded'],
  },
  'MPL-2.0': {
    spdxId: 'MPL-2.0',
    name: 'Mozilla Public License 2.0',
    url: 'https://opensource.org/license/mpl-2-0',
    categories: ['popular-strong-community'],
  },
  'MS-PL': {
    spdxId: 'MS-PL',
    name: 'Microsoft Public License',
    url: 'https://opensource.org/license/ms-pl',
    categories: ['uncategorized'],
  },
  'MS-RL': {
    spdxId: 'MS-RL',
    name: 'Microsoft Reciprocal License',
    url: 'https://opensource.org/license/ms-rl',
    categories: ['uncategorized'],
  },
  'MulanPSL-2.0': {
    spdxId: 'MulanPSL-2.0',
    name: 'Mulan Permissive Software License v2',
    url: 'https://opensource.org/license/mulanpsl-2-0',
    categories: ['international'],
  },
  Multics: {
    spdxId: 'Multics',
    name: 'Multics License',
    url: 'https://opensource.org/license/multics',
    categories: ['non-reusable'],
  },
  'NASA-1.3': {
    spdxId: 'NASA-1.3',
    name: 'NASA Open Source Agreement v1.3',
    url: 'https://opensource.org/license/nasa-1-3',
    categories: ['special-purpose'],
  },
  Naumen: {
    spdxId: 'Naumen',
    name: 'NAUMEN Public License',
    url: 'https://opensource.org/license/naumen',
    categories: ['non-reusable'],
  },
  NCSA: {
    spdxId: 'NCSA',
    name: 'The University of Illinois/NCSA Open Source License',
    url: 'https://opensource.org/license/ncsa',
    categories: ['redundant-with-more-popular'],
  },
  NGPL: {
    spdxId: 'NGPL',
    name: 'The Nethack General Public License',
    url: 'https://opensource.org/license/ngpl',
    categories: ['non-reusable'],
  },
  NOKIA: {
    spdxId: 'NOKIA',
    name: 'Nokia Open Source License Version 1.0a',
    url: 'https://opensource.org/license/nokia',
    categories: ['non-reusable'],
  },
  'NPOSL-3.0': {
    spdxId: 'NPOSL-3.0',
    name: 'Non-Profit Open Software License version 3.0',
    url: 'https://opensource.org/license/nposl-3-0',
    categories: ['uncategorized'],
  },
  NTP: {
    spdxId: 'NTP',
    name: 'NTP License',
    url: 'https://opensource.org/license/ntp',
    categories: ['uncategorized'],
  },
  'OCLC-2.0': {
    spdxId: 'OCLC-2.0',
    name: 'The OCLC Research Public License 2.0 License',
    url: 'https://opensource.org/license/oclc-2-0',
    categories: ['non-reusable'],
  },
  'OFL-1.1': {
    spdxId: 'OFL-1.1',
    name: 'SIL OPEN FONT LICENSE',
    url: 'https://opensource.org/license/ofl-1-1',
    categories: ['special-purpose'],
  },
  OGTSL: {
    spdxId: 'OGTSL',
    name: 'Open Group Test Suite License',
    url: 'https://opensource.org/license/ogtsl',
    categories: ['uncategorized'],
  },
  'OLDAP-2.8': {
    spdxId: 'OLDAP-2.8',
    name: 'OpenLDAP Public License Version 2.8',
    url: 'https://opensource.org/license/oldap-2-8',
    categories: ['redundant-with-more-popular'],
  },
  'OLFL-1.3': {
    spdxId: 'OLFL-1.3',
    name: 'Open Logistics Foundation License v1.3',
    url: 'https://opensource.org/license/olfl-1-3',
    categories: ['special-purpose'],
  },
  'OSC-1.0': {
    spdxId: 'OSC-1.0',
    name: 'OSC License 1.0',
    url: 'https://opensource.org/license/osc-1-0',
    categories: ['international'],
  },
  'OSET-PL-2.1': {
    spdxId: 'OSET-PL-2.1',
    name: 'OSET Public License version 2.1',
    url: 'https://opensource.org/license/oset-pl-2-1',
    categories: ['special-purpose'],
  },
  'OSL-1.0': {
    spdxId: 'OSL-1.0',
    name: 'Open Software License, version 1.0',
    url: 'https://opensource.org/license/osl-1-0',
    categories: ['superseded'],
  },
  'OSL-2.1': {
    spdxId: 'OSL-2.1',
    name: 'Open Software License 2.1',
    url: 'https://opensource.org/license/osl-2-1',
    categories: ['superseded'],
  },
  'OSL-3.0': {
    spdxId: 'OSL-3.0',
    name: 'The Open Software License 3.0',
    url: 'https://opensource.org/license/osl-3-0',
    categories: ['other-miscellaneous'],
  },
  'PHP-3.0': {
    spdxId: 'PHP-3.0',
    name: 'PHP License 3.0',
    url: 'https://opensource.org/license/php-3-0',
    categories: ['superseded'],
  },
  'PHP-3.01': {
    spdxId: 'PHP-3.01',
    name: 'PHP License 3.01',
    url: 'https://opensource.org/license/php-3-01',
    categories: ['non-reusable'],
  },
  PostgreSQL: {
    spdxId: 'PostgreSQL',
    name: 'The PostgreSQL License',
    url: 'https://opensource.org/license/postgresql',
    categories: ['redundant-with-more-popular'],
  },
  'Python-2.0': {
    spdxId: 'Python-2.0',
    name: 'Python License, Version 2',
    url: 'https://opensource.org/license/python-2-0',
    categories: ['non-reusable'],
  },
  'QPL-1.0': {
    spdxId: 'QPL-1.0',
    name: 'The Q Public License Version',
    url: 'https://opensource.org/license/qpl-1-0',
    categories: ['other-miscellaneous'],
  },
  'RPL-1.1': {
    spdxId: 'RPL-1.1',
    name: 'Reciprocal Public License, version 1.1',
    url: 'https://opensource.org/license/rpl-1-1',
    categories: ['superseded'],
  },
  'RPL-1.5': {
    spdxId: 'RPL-1.5',
    name: 'Reciprocal Public License 1.5',
    url: 'https://opensource.org/license/rpl-1-5',
    categories: ['uncategorized'],
  },
  'RPSL-1.0': {
    spdxId: 'RPSL-1.0',
    name: 'RealNetworks Public Source License Version 1.0',
    url: 'https://opensource.org/license/rpsl-1-0',
    categories: ['non-reusable'],
  },
  RSCPL: {
    spdxId: 'RSCPL',
    name: 'The Ricoh Source Code Public License',
    url: 'https://opensource.org/license/rscpl',
    categories: ['non-reusable'],
  },
  'SimPL-2.0': {
    spdxId: 'SimPL-2.0',
    name: 'Simple Public License',
    url: 'https://opensource.org/license/simpl-2-0',
    categories: ['uncategorized'],
  },
  SISSL: {
    spdxId: 'SISSL',
    name: 'Sun Industry Standards Source License',
    url: 'https://opensource.org/license/sissl',
    categories: ['voluntarily-retired'],
  },
  Sleepycat: {
    spdxId: 'Sleepycat',
    name: 'The Sleepycat License',
    url: 'https://opensource.org/license/sleepycat',
    categories: ['non-reusable'],
  },
  'SPL-1.0': {
    spdxId: 'SPL-1.0',
    name: 'Sun Public License, Version 1.0',
    url: 'https://opensource.org/license/spl-1-0',
    categories: ['non-reusable'],
  },
  'UCL-1.0': {
    spdxId: 'UCL-1.0',
    name: 'Upstream Compatibility License v1.0',
    url: 'https://opensource.org/license/ucl-1-0',
    categories: ['special-purpose'],
  },
  'Unicode-3.0': {
    spdxId: 'Unicode-3.0',
    name: 'UNICODE LICENSE V3',
    url: 'https://opensource.org/license/unicode-3-0',
    categories: ['special-purpose'],
  },
  'Unicode-DFS-2016': {
    spdxId: 'Unicode-DFS-2016',
    name: 'Unicode, Inc. License Agreement – Data Files and Software',
    url: 'https://opensource.org/license/unicode-dfs-2016',
    categories: ['special-purpose', 'superseded'],
  },
  Unlicense: {
    spdxId: 'Unlicense',
    name: 'The Unlicense',
    url: 'https://opensource.org/license/unlicense',
    categories: ['special-purpose'],
  },
  'UPL-1.0': {
    spdxId: 'UPL-1.0',
    name: 'The Universal Permissive License Version 1.0',
    url: 'https://opensource.org/license/upl-1-0',
    categories: ['other-miscellaneous'],
  },
  'VSL-1.0': {
    spdxId: 'VSL-1.0',
    name: 'The Vovida Software License v. 1.0',
    url: 'https://opensource.org/license/vsl-1-0',
    categories: ['non-reusable'],
  },
  'W3C-20150513': {
    spdxId: 'W3C-20150513',
    name: 'The W3C® Software and Document license',
    url: 'https://opensource.org/license/w3c-20150513',
    categories: ['non-reusable'],
  },
  'Watcom-1.0': {
    spdxId: 'Watcom-1.0',
    name: 'The Sybase Open Source Licence',
    url: 'https://opensource.org/license/watcom-1-0',
    categories: ['non-reusable'],
  },
  WordNet: {
    spdxId: 'WordNet',
    name: 'WordNet',
    url: 'https://opensource.org/license/wordnet',
    categories: ['non-reusable'],
  },
  wxWindows: {
    spdxId: 'wxWindows',
    name: 'The wxWindows Library Licence',
    url: 'https://opensource.org/license/wxwindows',
    categories: ['non-reusable'],
  },
  Xnet: {
    spdxId: 'Xnet',
    name: 'The X.Net, Inc. License',
    url: 'https://opensource.org/license/xnet',
    categories: ['redundant-with-more-popular'],
  },
  Zlib: {
    spdxId: 'Zlib',
    name: 'The zlib/libpng License',
    url: 'https://opensource.org/license/zlib',
    categories: ['other-miscellaneous'],
  },
  'ZPL-2.0': {
    spdxId: 'ZPL-2.0',
    name: 'Zope Public License 2.0',
    url: 'https://opensource.org/license/zpl-2-0',
    categories: ['superseded'],
  },
  'ZPL-2.1': {
    spdxId: 'ZPL-2.1',
    name: 'Zope Public License 2.1',
    url: 'https://opensource.org/license/zpl-2-1',
    categories: ['redundant-with-more-popular'],
  },
} as const satisfies Record<string, OsiLicense>

/** SPDX id of an OSI-approved license - what a project's `license` names. */
export type OsiLicenseId = keyof typeof OSI_LICENSES

/**
 * Throws on an id the OSI has not approved. Bad config fails loudly rather
 * than rendering a green Open source crop nothing backs.
 */
export function getOsiLicense(id: OsiLicenseId): OsiLicense {
  const license: OsiLicense | undefined = OSI_LICENSES[id]
  if (!license) {
    throw new Error(
      `${id} is not an OSI-approved license. Only licenses from https://opensource.org/licenses can back the Open source crop.`,
    )
  }
  return license
}
