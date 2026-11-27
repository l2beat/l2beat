import { definePrivacyCompliance } from '../../common/privacyCompliance'

const PROTOCOL =
  'https://github.com/sunnyside-io/privacy-boost-protocol/blob/5792c139b9529ed80643262d75b5489055be11b0/'

/** @param auditorCount number of auditors the AuditGateway lists */
export function privacyBoostCompliance(auditorCount: number) {
  return definePrivacyCompliance({
    description: `Auditors appointed by the admin multisig can query the TEE's Audit API for the balance and history of any address, without the user's consent. The AuditGateway lists ${auditorCount} auditors. The TEE is meant to record each access on that contract, but with its code unpublished this is unverifiable.`,
    powers: [
      {
        ladder: 'privacy',
        rung: 5,
        text: "Auditors appointed by the admin multisig can query any address's balance and history, and the access log is unverifiable.",
        sources: [
          { contract: 'AuditGateway' },
          { section: 'permissions', title: 'Admin multisig' },
        ],
      },
      {
        ladder: 'privacy',
        rung: 3,
        text: "The operator's TEE can stop serving a user, whose forced withdrawal then publishes their account and notes.",
        sources: [
          {
            title: 'Threat T2: forced withdrawal bypasses TEE censorship',
            url: `${PROTOCOL}docs/specs/privacy-boost-protocol/12-security-model-invariants.md#L49`,
          },
          {
            title: 'Forced withdrawal publishes account and notes',
            url: `${PROTOCOL}contracts/src/interfaces/IPrivacyBoost.sol#L582-L591`,
          },
        ],
      },
      {
        ladder: 'funds',
        rung: 2,
        text: "The operator's TEE and relay can refuse a private exit, but anyone can execute a forced withdrawal after a fixed delay.",
        sources: [
          {
            contract: 'PrivacyBoost',
            title: 'requestForcedWithdrawal and executeForcedWithdrawal',
          },
          {
            title: 'Two-step forced withdrawal, permissionless after the delay',
            url: `${PROTOCOL}contracts/src/interfaces/IPrivacyBoost.sol#L1020-L1047`,
          },
        ],
      },
    ],
  })
}
