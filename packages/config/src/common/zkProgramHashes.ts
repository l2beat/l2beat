import { assert, ProjectId } from '@l2beat/shared-pure'
import type { ProjectScalingContractsZkProgramHash } from '../types'

export function ZK_PROGRAM_HASHES(
  hash: ProjectScalingContractsZkProgramHash['hash'],
): ProjectScalingContractsZkProgramHash {
  const programHashData = zkProgramHashes[hash]
  assert(
    programHashData,
    `Program hash data for ${hash} not found, please configure it in zkProgramHashes.ts`,
  )

  return {
    ...programHashData,
    hash,
  }
}

const zkProgramHashes: Record<
  ProjectScalingContractsZkProgramHash['hash'],
  Omit<ProjectScalingContractsZkProgramHash, 'hash'>
> = {
  '0x003991487ea72a40a1caa7c234b12c0da52fc4ccc748a07f6ebd354bbb54772e': {
    title: 'Aggregation program of OP Succinct',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00afb45d8064ae10aa6a1793b8f39a24c27268efae2917b5c02950b2377fbf00': {
    title: 'Aggregation program of OP Succinct',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x490685ea27adbbb83301073734f40a5656c984fe352359d54dd637e828e66872': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x416d710344b6b6fa2a0b1a1445f3d6ba4fdd5ab43f0e863b1c522db20f28ad9b': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30': {
    title: 'Pessimistic program of agglayer',
    description:
      'Verifies that a chain connected to Polygon Agglayer does not bridge out more tokens that were bridged in, thus preventing stealing tokens from other Agglayer chains. Also verifies aggchain proof for this chain.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x000055f14384bdb5bb092fd7e5152ec31856321c5a30306ab95836bdf5cdb639': {
    title: 'Pessimistic program of agglayer',
    description:
      'Verifies that a chain connected to Polygon Agglayer does not bridge out more tokens that were bridged in, thus preventing stealing tokens from other Agglayer chains. Also verifies aggchain proof for this chain.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x713f8a687452545141b6cd852472c67742a5c61474b97a136d0d107804affa1f': {
    title: 'Aggchain program of agglayer',
    description:
      'Verifies state transition of an Agglayer-based chain either by checking a full validity proof or just by checking a registered sequencer signature. Also checks that L1 information on the chain aligns with the values stored on Agglayer.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x374ee73950cdb07d1b8779d90a8467df232639c13f9536b03f1ba76a2aa5dac6': {
    title: 'Aggchain program of agglayer',
    description:
      'Verifies state transition of an Agglayer-based chain either by checking a full validity proof or just by checking a registered multisig signature. Also checks that L1 information on the chain aligns with the values stored on Agglayer.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00de39c136b88dfeacb832629e21a9667935bc0e74aaa21292e4f237d79d0bef': {
    title: 'Celestia Blobstream DA bridge program',
    description:
      'ZK-friendly implementation of Celestia Blobstream DA bridge that proves that enough Celestia validators have confirmed a given data root.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x0057b7de6dcd8ff25e7b41089f4b5fa586067fbb107756d1f66d92fe71dd6ad1': {
    title: 'Avail VectorX DA bridge program',
    description:
      'ZK-friendly implementation of Avail Vector DA bridge that proves that a given data root was finalized on Avail.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00bca7947ba758bd6f539f480c6d983cca4bd4387a411a41a71fb953d5df3de7': {
    title: 'Aggregation program of OP Succinct',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x2d0dcc4f4a5e59b80239c28a3fb68ab63b8eaf6f132239e95f927da9046f4256': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x008adbf6e7ba087ac0b05572c938b7707400d7b41318efcbc1d7ffbbbed50452': {
    title: 'Aggregation program of OP Succinct',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x40bc0563112dcc6868037ea0445916342df200ec0152bf7b4c2cca1d640fdaa3': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x0083a8b50160475a7a5911c03dfdee30f6c8a83112a71c5c1125cfb96148b8c2': {
    title: 'Aggregation program of OP Succinct',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x43f01f7522e77ddc0bea30de6cb8075608a0d0c906660e4f5f430a1e5e170829': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00cd47e188eeeab95c3c666088b928ff8243f8dd8d6e94f49795013bcd6231f0': {
    title: 'SP1 Helios program',
    description:
      'Implements a light client of Ethereum, validating state data and block headers in a trust-minimized way.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x0040b6021bbe547fc651492bcc4eea12eaaa9b0a60086439206e27495ec6d6c3': {
    title: 'Aggregation program of Raiko (reth Taiko)',
    description:
      'Aggregates proofs of correct execution for several consecutive block batches of Rust-based Taiko L2 client (raiko).',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x58a28867325f4d123d7097024be2f4b56d71f5ab14a35aed4bc3550426f2bed3': {
    title: 'Batch proving program of Raiko (reth Taiko)',
    description:
      'Proves correct state transition function within Rust-based Taiko L2 client (raiko) over a batch of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x7ce98c36408e86dac21fc16af301740d07a849be0a80529debcb0797fd66f5e3': {
    title: 'Kailua fault proof program',
    description:
      'Program that executes OP Kona client to derive blocks and generate fault or validity proofs, is a part of ZK non-interactive fault proof system.',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '0xe9aec1d30d25da1ccfc02a81c4b71f32e0a6f675dff4ce01fe4bd5f96ff320bd': {
    title: 'Aggregation program of Raiko (reth Taiko)',
    description:
      'Aggregates proofs of correct execution for several consecutive block batches of Rust-based Taiko L2 client (raiko).',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '0xee950d20e2483b9b6b859272feaea2dd84cea8a9cfdf1af8834df6b75c3d715e': {
    title: 'Batch proving program of Raiko (reth Taiko)',
    description:
      'Proves correct state transition function within Rust-based Taiko L2 client (raiko) over a batch of consecutive L2 blocks.',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '0x70909b25db0db00f1d4b4016aeb876f53568a3e5a8e6397cb562d79947a02cc9': {
    title: 'Set builder program',
    description:
      'Recursively verifies a Merkle tree of zk proofs at once, identified by a Merkle Mountain Range root.',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '760308386675154762009993173725077399730170358078020153308029499928875469870':
    {
      title: 'Aggregation program for Stone prover',
      description:
        'Cairo program that squashes the state diffs of several blocks',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '793595346346724189681221050719974054861327641387231526786912662354259445535':
    {
      title: 'StarkNet OS',
      proverSystemProject: ProjectId('stone'),
      description:
        'Proves correct state transition for a range of consecutive Starknet transactions.',
      verificationStatus: 'notVerified',
    },
  '273279642033703284306509103355536170486431195329675679055627933497997642494':
    {
      title: 'Aggregation program for Stone prover',
      description:
        'Aggregates proofs of correct execution for several consecutive transaction ranges generated by StarkNet OS.',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '2534935718742676028234156221136000178296467523045214874259117268197132196876':
    {
      title: 'Paradex implementation of StarkNet OS',
      description:
        'Proves correct state transition for a range of consecutive Paradex transactions.',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '3485280386001712778192330279103973322645241679001461923469191557000342180556':
    {
      title: 'StarkEx Spot v3.0 program',
      description:
        'Cairo program that implements application-specific L2 with spot and perpetual trading functionality.',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '3174901404014912024702042974619036870715605532092680335571201877913899936957':
    {
      title: 'StarkEx Spot v4.0 program',
      description:
        'Cairo program that implements application-specific L2 with spot and perpetual trading functionality.',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '16830627573509542901909952446321116535677491650708854009406762893086223513':
    {
      title: 'StarkEx Spot v4.5 program',
      description:
        'Cairo program that implements application-specific L2 with spot and perpetual trading functionality.',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '0x003ac2e012d8a7fb1495d94839fe36559b52fd6d60a532884c7558de2b88bf72': {
    title: 'Executable of the Scroll bundle program',
    description:
      'Proves the correct execution of a bundle of Scroll L2 blocks, which is the unit of L2 state finalisation from L1’s perspective.',
    proverSystemProject: ProjectId('openvm'),
    verificationStatus: 'notVerified',
  },
  '0x009305f0762291e3cdd805ff6d6e81f1d135dbfdeb3ecf30ad82c3855dde7909': {
    title: 'Config of the Scroll bundle program',
    description:
      'This is not a ZK program, but a commitment to the config of Scroll bundle program (bundle leaf commitment). It also needs to be checked to verify the expected ZK verification.',
    proverSystemProject: ProjectId('openvm'),
    verificationStatus: 'notVerified',
  },
  '0x0100085f9382a7928dd83bfc529121827b5f29f18b9aa10d18aa68e1be7ddc35': {
    title: 'Boojum L2 Bootloader program',
    description:
      'EraVM program that proves the correct execution of a batch of ZK Stack L2 blocks.',
    proverSystemProject: ProjectId('boojum'),
    verificationStatus: 'notVerified',
  },
  '0x0100088580465d88420e6369230ee94a32ff356dbcdd407a4be49fc8009b2a81': {
    title: 'Boojum L2 Bootloader program',
    description:
      'EraVM program that proves the correct execution of a batch of ZK Stack L2 blocks.',
    proverSystemProject: ProjectId('boojum'),
    verificationStatus: 'notVerified',
  },
  // v29 upgrade, added by basti without knowing what he is doing https://www.tally.xyz/gov/zksync/proposal/40562439712311128665286075271414168289029475306445402072499591795343687723101?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f
  // Turned out to be exactly correct
  '0x01000911c4db4fe62c98e180cfa7e9b3a22fb15f505905d4bf36192f481551e6': {
    title: 'Boojum L2 Bootloader program',
    description:
      'EraVM program that proves the correct execution of a batch of ZK Stack L2 blocks.',
    proverSystemProject: ProjectId('boojum'),
    verificationStatus: 'notVerified',
  },
}
