import type { ProjectTechnologyChoice } from '../types'
import { readMarkdown } from '../utils/readMarkdown'

export const ESPRESSO: ProjectTechnologyChoice = {
  name: 'Espresso TEE sequencer',
  description: readMarkdown('common/sequencing/espresso.md'),
  references: [
    {
      url: 'https://github.com/EspressoSystems/nitro-espresso-integration/blob/7ddcc6c036fa05cc47560552c85f30b5adedf32c/arbnode/batch_poster.go#L574',
      title: 'Nitro Espresso Integration',
    },
    {
      url: 'https://gramine.readthedocs.io/en/stable/sgx-intro.html#:~:text=The%20SGX%20quote%20is%20a%20signed%20report%20that%20contains%20the%20enclave%20measurement%20and%20the%20signer%20measurement%20of%20the%20enclave%20and%20the%20signer%20of%20the%20signer%20process%20that%20created%20the%20report.',
      title: 'SGX Quote',
    },
  ],
  risks: [
    // Liveness attack, but there is forced inclusion to bypass it
    {
      category: 'Withdrawals can be delayed if',
      text: 'the owner of EspressoTEEVerifier updates the contract verification values (enclave hash, signer) and it is no longer possible to verify the TEE quote.',
    },
  ],
}
