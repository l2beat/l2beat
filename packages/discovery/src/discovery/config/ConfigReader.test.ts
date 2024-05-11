import { expect, mockObject } from 'earl'
import { TemplateService } from '../analysis/TemplateService'
import { ConfigReader } from './ConfigReader'
import { ContractMeta, DiscoveryMeta } from './DiscoveryMeta'

describe(ConfigReader.name, () => {
  describe(ConfigReader.prototype.inlineMetaTemplates.name, () => {
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
      const templateServiceMock = mockObject<TemplateService>({
        readContractMetaTemplate: () => template,
      })
      const configReader = new ConfigReader()
      configReader.templateService = templateServiceMock
      configReader.inlineMetaTemplates(meta)
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
