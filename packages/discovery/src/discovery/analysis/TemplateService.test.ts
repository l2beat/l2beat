import { expect, mockFn } from 'earl'
import { TemplateService } from '../analysis/TemplateService'
import { ContractMeta, DiscoveryMeta } from '../config/DiscoveryMeta'

describe(TemplateService.name, () => {
  describe(TemplateService.prototype.inlineMetaTemplates.name, () => {
    it('correctly merges expanded template with overrides', () => {
      const template: ContractMeta = {
        name: 'VersionProvider',
        description: 'Contract that provides the version of the protocol',
        values: {
          version: {
            description: 'Version of the protool',
            severity: 'HIGH',
          },
        },
      }
      const meta: DiscoveryMeta = {
        contracts: [
          {
            name: 'SpecificVersionProvider',
            extends: 'mytemplate',
            values: {
              timeout: {
                description: 'Timeout of the contract',
                severity: 'LOW',
              },
              version: {
                severity: 'LOW', // Overwrite this value, but not description
                type: 'EXTERNAL',
              },
            },
          },
          {
            name: 'OtherContract',
            values: {
              number: { description: 'a number' },
            },
          },
        ],
      }
      const templateService = new TemplateService()
      templateService.readContractMetaTemplate = mockFn().returns(template)
      templateService.inlineMetaTemplates(meta)
      console.log(JSON.stringify(meta, null, 2))
      expect(meta).toEqual({
        contracts: [
          {
            name: 'SpecificVersionProvider',
            extends: 'mytemplate',
            description: 'Contract that provides the version of the protocol',
            values: {
              timeout: {
                description: 'Timeout of the contract',
                severity: 'LOW',
              },
              version: {
                description: 'Version of the protool',
                severity: 'LOW',
                type: 'EXTERNAL',
              },
            },
          },
          {
            name: 'OtherContract',
            values: {
              number: { description: 'a number' },
            },
          },
        ],
      })
    })
  })
})
