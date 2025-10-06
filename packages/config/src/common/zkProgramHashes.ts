import { assert, ProjectId } from '@l2beat/shared-pure'
import type { ProjectScalingStateValidationZkProgramHash } from '../types'

export function ZK_PROGRAM_HASHES(
  hash: ProjectScalingStateValidationZkProgramHash['hash'],
): ProjectScalingStateValidationZkProgramHash {
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
  ProjectScalingStateValidationZkProgramHash['hash'],
  Omit<ProjectScalingStateValidationZkProgramHash, 'hash'>
> = {
  '0x003991487ea72a40a1caa7c234612c0da52fc4ccc748a07f6ebd35466654772e': {
    programUrl: 'https://github.com/l2beat/l2beat',
    title: 'Aggregation program for OP Succinct: aggregates batch STF proofs',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'successful',
    verificationSteps: `
      - Check out [sp1 repo](https://github.com/succinctlabs/sp1) at commit \`76c28bf986ba102127788ce081c21fa09cf93b18\`.
      - Set an environment variable by calling \`export SP1_ALLOW_DEPRECATED_HOOKS=true\`. It is needed for the correct execution of circuit building.
      - Make sure that you have [go lang installed](https://go.dev/doc/install).
      - From \`crates/prover\` call \`make build-circuits\`. Note that the execution could take a while.
      `,
  },
  '0x003991487ea72a40a1caa7c234b12c0da52fc4ccc748a07f6ebd354bbb54772e': {
    title: 'Aggregation program of OP Succinct',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x490685ea27adbbb83301073734f40a5656c984fe352359d54dd637e828e66872': {
    title: 'Range program of OP Succinct',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30': {
    title: 'Pessimistic program of agglayer',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x713f8a687452545141b6cd852472c67742a5c61474b97a136d0d107804affa1f': {
    title: 'Aggchain program of agglayer',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00de39c136b88dfeacb832629e21a9667935bc0e74aaa21292e4f237d79d0bef': {
    title: 'Celestia Blobstream DA bridge program',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x0057b7de6dcd8ff25e7b41089f4b5fa586067fbb107756d1f66d92fe71dd6ad1': {
    title: 'Avail VectorX DA bridge program',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00bca7947ba758bd6f539f480c6d983cca4bd4387a411a41a71fb953d5df3de7': {
    title: 'Aggregation program of OP Succinct',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x2d0dcc4f4a5e59b80239c28a3fb68ab63b8eaf6f132239e95f927da9046f4256': {
    title: 'Range program of OP Succinct',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x008adbf6e7ba087ac0b05572c938b7707400d7b41318efcbc1d7ffbbbed50452': {
    title: 'Aggregation program of OP Succinct',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x40bc0563112dcc6868037ea0445916342df200ec0152bf7b4c2cca1d640fdaa3': {
    title: 'Range program of OP Succinct',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x0083a8b50160475a7a5911c03dfdee30f6c8a83112a71c5c1125cfb96148b8c2': {
    title: 'Aggregation program of OP Succinct',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x43f01f7522e77ddc0bea30de6cb8075608a0d0c906660e4f5f430a1e5e170829': {
    title: 'Range program of OP Succinct',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00cd47e188eeeab95c3c666088b928ff8243f8dd8d6e94f49795013bcd6231f0': {
    title: 'SP1 Helios program implementing Ethereum light client',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x0040b6021bbe547fc651492bcc4eea12eaaa9b0a60086439206e27495ec6d6c3': {
    title: 'Aggregation program of Raiko (reth Taiko)',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x58a28867325f4d123d7097024be2f4b56d71f5ab14a35aed4bc3550426f2bed3': {
    title: 'Block proving program of Raiko (reth Taiko)',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x7ce98c36408e86dac21fc16af301740d07a849be0a80529debcb0797fd66f5e3': {
    title: 'Kailua fault proof program',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '0xe9aec1d30d25da1ccfc02a81c4b71f32e0a6f675dff4ce01fe4bd5f96ff320bd': {
    title: 'Aggregation program of Raiko (reth Taiko)',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '0xee950d20e2483b9b6b859272feaea2dd84cea8a9cfdf1af8834df6b75c3d715e': {
    title: 'Block proving program of Raiko (reth Taiko)',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '793595346346724189681221050719974054861327641387231526786912662354259445535':
    {
      title: 'StarkNet OS',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '2534935718742676028234156221136000178296467523045214874259117268197132196876':
    {
      title: 'Paradex L2-specific implementation of StarkNet OS',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '3485280386001712778192330279103973322645241679001461923469191557000342180556':
    {
      title: 'StarkEx Spot v3.0 program',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '3174901404014912024702042974619036870715605532092680335571201877913899936957':
    {
      title: 'StarkEx Spot v4.0 program',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '16830627573509542901909952446321116535677491650708854009406762893086223513':
    {
      title: 'StarkEx Spot v4.5 program',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '0x003ac2e012d8a7fb1495d94839fe36559b52fd6d60a532884c7558de2b88bf72': {
    title: 'Executable of the Scroll bundle program',
    proverSystemProject: ProjectId('openvm'),
    verificationStatus: 'notVerified',
  },
  '0x009305f0762291e3cdd805ff6d6e81f1d135dbfdeb3ecf30ad82c3855dde7909': {
    title: 'Config of the Scroll bundle program',
    proverSystemProject: ProjectId('openvm'),
    verificationStatus: 'notVerified',
  },
}
