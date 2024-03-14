/*
                      ====== IMPORTANT NOTICE ======

DO NOT EDIT OR RENAME THIS FILE

This is a migration file. Once created the file should not be renamed or edited,
because migrations are only run once on the production server.

If you find that something was incorrectly set up in the `up` function you
should create a new migration file that fixes the issue.

*/

import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

export async function up(knex: Knex) {
  const transfersToUpdate = [
    {
      formula: 'transfer',
      from: '0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d',
      to: '0x253887577420Cb7e7418cD4d50147743c8041b28',
      sinceTimestamp: new UnixTime(1679202395),
      projectId: 'aevo',
      type: 'DA',
      identifier:
        '0xadc9200d1e893cc076f189a504a06b8f46271c9175c1c579f2cd343274f04992',
    },
    {
      formula: 'transfer',
      from: '0x5050F69a9786F081509234F1a7F4684b5E5b76C9',
      to: '0xFf00000000000000000000000000000000008453',
      sinceTimestamp: new UnixTime(1686796655),
      projectId: 'base',
      type: 'DA',
      identifier:
        '0x7bd55ef41a5a1a373df7da81d002d6be288e6e4656870ec1c628231b8aaae31c',
    },
    {
      formula: 'transfer',
      from: '0x41b8cD6791De4D8f9E0eaF7861aC506822AdcE12',
      to: '0xfF00000000000000000000000000000000000255',
      sinceTimestamp: new UnixTime(1693883663),
      projectId: 'kroma',
      type: 'DA',
      identifier:
        '0x0e64045f8d4071bb728d1a78a7975241ee8031f45526d6d5e23f541f6b0ed423',
    },
    {
      formula: 'transfer',
      from: '0x6887246668a3b87F54DeB3b94Ba47a6f63F32985',
      to: '0xFF00000000000000000000000000000000000010',
      sinceTimestamp: new UnixTime(1686074603),
      projectId: 'optimism',
      type: 'DA',
      identifier:
        '0x3ccde45b2fa447110a65f795ea085ebb5ff52dc532b57d8b88cd3f45dc82f95f',
    },
    {
      formula: 'transfer',
      from: '0x99526b0e49A95833E734EB556A6aBaFFAb0Ee167',
      to: '0xC1B90E1e459aBBDcEc4DCF90dA45ba077d83BFc5',
      sinceTimestamp: new UnixTime(1689108083),
      projectId: 'publicgoodsnetwork',
      type: 'DA',
      identifier:
        '0x0b7d35e1559b763c8679f976ee47b6c0744f6606baee68e79e058ba3491c9174',
    },
    {
      formula: 'transfer',
      from: '0x625726c858dBF78c0125436C943Bf4b4bE9d9033',
      to: '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf',
      sinceTimestamp: new UnixTime(1686695915),
      projectId: 'zora',
      type: 'DA',
      identifier:
        '0xd891920978e1039e8b2855b6b03874c7218a5860f5880a9975eaa153d276ee3a',
    },
  ]

  for (const config of transfersToUpdate) {
    await knex('liveness_configuration')
      .update({
        params: JSON.stringify({
          from: config.from.toString(),
          to: config.to.toString(),
        }),
      })
      .where('identifier', '=', config.identifier)
  }
}

export async function down(knex: Knex) {
  const transfersToUpdate = [
    {
      formula: 'transfer',
      from: '0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d',
      to: '0x253887577420Cb7e7418cD4d50147743c8041b28',
      sinceTimestamp: new UnixTime(1679202395),
      projectId: 'aevo',
      type: 'DA',
      identifier:
        '0xadc9200d1e893cc076f189a504a06b8f46271c9175c1c579f2cd343274f04992',
    },
    {
      formula: 'transfer',
      from: '0x5050F69a9786F081509234F1a7F4684b5E5b76C9',
      to: '0xFf00000000000000000000000000000000008453',
      sinceTimestamp: new UnixTime(1686796655),
      projectId: 'base',
      type: 'DA',
      identifier:
        '0x7bd55ef41a5a1a373df7da81d002d6be288e6e4656870ec1c628231b8aaae31c',
    },
    {
      formula: 'transfer',
      from: '0x41b8cD6791De4D8f9E0eaF7861aC506822AdcE12',
      to: '0xfF00000000000000000000000000000000000255',
      sinceTimestamp: new UnixTime(1693883663),
      projectId: 'kroma',
      type: 'DA',
      identifier:
        '0x0e64045f8d4071bb728d1a78a7975241ee8031f45526d6d5e23f541f6b0ed423',
    },
    {
      formula: 'transfer',
      from: '0x6887246668a3b87F54DeB3b94Ba47a6f63F32985',
      to: '0xFF00000000000000000000000000000000000010',
      sinceTimestamp: new UnixTime(1686074603),
      projectId: 'optimism',
      type: 'DA',
      identifier:
        '0x3ccde45b2fa447110a65f795ea085ebb5ff52dc532b57d8b88cd3f45dc82f95f',
    },
    {
      formula: 'transfer',
      from: '0x99526b0e49A95833E734EB556A6aBaFFAb0Ee167',
      to: '0xC1B90E1e459aBBDcEc4DCF90dA45ba077d83BFc5',
      sinceTimestamp: new UnixTime(1689108083),
      projectId: 'publicgoodsnetwork',
      type: 'DA',
      identifier:
        '0x0b7d35e1559b763c8679f976ee47b6c0744f6606baee68e79e058ba3491c9174',
    },
    {
      formula: 'transfer',
      from: '0x625726c858dBF78c0125436C943Bf4b4bE9d9033',
      to: '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf',
      sinceTimestamp: new UnixTime(1686695915),
      projectId: 'zora',
      type: 'DA',
      identifier:
        '0xd891920978e1039e8b2855b6b03874c7218a5860f5880a9975eaa153d276ee3a',
    },
  ]

  for (const config of transfersToUpdate) {
    await knex('liveness_configuration')
      .update({
        params: JSON.stringify({
          from: config.from.toString(),
          to: config.from.toString(),
        }),
      })
      .where('identifier', '=', config.identifier)
  }
}
