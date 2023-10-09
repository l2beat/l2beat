export interface Project {
  name: string
  methods?: Method[]
  transfers?: Transfer[]
}

export interface Method {
  type: 'DA' | 'STATE'
  name: string
  address: string
  selector: string
}

export interface Transfer {
  type: 'DA' | 'STATE'
  from_address: string
  to_address: string
}

export const projects: Project[] = [
  {
    name: 'Optimism',
    methods: [
      {
        type: 'STATE',
        name: 'proposeL2Output',
        address: '0xdfe97868233d1aa22e815a266982f2cf17685a27',
        selector: '0x9aaab648',
      },
    ],
    transfers: [
      {
        type: 'DA',
        from_address: '0x6887246668a3b87F54DeB3b94Ba47a6f63F32985',
        to_address: '0xFF00000000000000000000000000000000000010',
      },
    ],
  },
  {
    name: 'ZkSyncEra',
    methods: [
      {
        type: 'STATE',
        name: 'proveBlocks',
        address: '0x3dB52cE065f728011Ac6732222270b3F2360d919',
        selector: '0x7739cbe7',
      },
    ],
  },
  {
    name: 'ArbitrumOne',
    methods: [
      {
        type: 'STATE',
        name: 'updateSendRoot',
        address: '0x0eA7372338a589e7f0b00E463a53AA464ef04e17',
        selector: '0xa04cee60',
      },
      {
        type: 'DA',
        name: 'addSequencerL2BatchFromOrigin',
        address: '0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6',
        selector: '0x8f111f3c',
      },
    ],
  },
  {
    name: 'Base',
    transfers: [
      {
        from_address: '0x5050F69a9786F081509234F1a7F4684b5E5b76C9',
        to_address: '0xFf00000000000000000000000000000000008453',
        type: 'DA',
      },
    ],
    methods: [
      {
        type: 'STATE',
        address: '0x56315b90c40730925ec5485cf004d835058518A0',
        name: 'proposeL2Output',
        selector: '0x9aaab648',
      },
    ],
  },
  {
    name: 'dYdX',
    methods: [
      {
        type: 'STATE',
        address: '0xD54f502e184B6B739d7D27a6410a67dc462D69c8',
        name: 'updateState',
        selector: '0x538f9406',
      },
    ],
  },
  {
    name: 'Starknet',
    methods: [
      {
        type: 'STATE',
        address: '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
        name: 'updateState',
        selector: '0x77552641',
      },
    ],
  },
  {
    name: 'Mantle',
    methods: [
      {
        type: 'DA',
        address: '0x291dc3819b863e19b0a9b9809F8025d2EB4aaE93',
        name: 'appendSequencerBatch',
        selector: '0xd0f89344',
      },
      {
        type: 'STATE',
        address: '0xD1328C9167e0693B689b5aa5a024379d4e437858',
        name: 'createAssertionWithStateBatch',
        selector: '0x49cd3004',
      },
    ],
  },
  {
    name: 'Loopring',
    methods: [
      {
        type: 'STATE',
        address: '0x153CdDD727e407Cb951f728F24bEB9A5FaaA8512',
        name: 'submitBlocksWithCallbacks',
        selector: '0xdcb2aa31',
      },
    ],
  },
  {
    name: 'zkSyncLite',
    methods: [
      {
        type: 'STATE',
        address: '0xaBEA9132b05A70803a4E85094fD0e1800777fBEF',
        name: 'proveBlocks',
        selector: '0x83981808',
      },
    ],
  },
  {
    name: 'ImmutableX',
    methods: [
      {
        type: 'STATE',
        address: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
        name: 'updateState',
        selector: '0x538f9406',
      },
    ],
  },
  {
    name: 'Metis',
    methods: [
      {
        type: 'DA',
        address: '0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a',
        name: 'appendSequencerBatchByChainId',
        selector: '0xa8cda37b',
      },
      {
        type: 'STATE',
        address: '0xf209815E595Cdf3ed0aAF9665b1772e608AB9380',
        name: 'appendStateBatchByChainId',
        selector: '0xd710083f',
      },
    ],
  },
  {
    name: 'Linea',
    methods: [
      {
        type: 'STATE',
        address: '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
        name: 'finalizeBlocks',
        selector: '0x4165d6dd',
      },
    ],
  },
  {
    name: 'PolygonZkEVM',
    methods: [
      {
        type: 'DA',
        address: '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
        name: 'sequenceBatches',
        selector: '0x5e9145c9',
      },
      {
        type: 'STATE',
        address: '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
        name: 'verifyBatchesTrustedAggregator',
        selector: '0x2b0006fa',
      },
    ],
  },
  {
    name: 'ApeX',
    methods: [
      {
        type: 'STATE',
        address: '0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb',
        name: 'updateState',
        selector: '0x538f9406',
      },
    ],
  },
  {
    name: 'ZKSpace',
    methods: [
      {
        type: 'STATE',
        address: '0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8',
        name: 'verifyBlocks',
        selector: '0x6898e6fc',
      },
    ],
  },
  {
    name: 'ArbitrumNova',
    methods: [
      {
        type: 'DA',
        address: '0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b',
        name: 'addSequencerL2BatchFromOrigin',
        selector: '0x8f111f3c',
      },
      // {
      //   type: 'STATE',
      //   address: '0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b',
      //   name: 'addSequencerL2BatchFromOrigin',
      //   selector: '0x8f111f3c',
      // },
    ],
  },
  {
    name: 'Sorare',
    methods: [
      {
        type: 'STATE',
        address: '0xF5C9F957705bea56a7e806943f98F7777B995826',
        name: 'updateState',
        selector: '0x538f9406',
      },
    ],
  },
  {
    name: 'rhino.fi',
    methods: [
      {
        type: 'STATE',
        address: '0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b',
        name: 'updateState',
        selector: '0x538f9406',
      },
    ],
  },
  {
    name: 'BobaNetwork',
    methods: [
      {
        type: 'DA',
        address: '0xfBd2541e316948B259264c02f370eD088E04c3Db',
        name: 'appendSequencerBatch',
        selector: '0xd0f89344',
      },
      {
        type: 'STATE',
        address: '0xdE7355C971A5B733fe2133753Abd7e5441d441Ec',
        name: 'appendStateBatch',
        selector: '0x8ca5cbb9',
      },
    ],
  },
  {
    name: 'Zora',
    methods: [
      {
        type: 'STATE',
        address: '0x9E6204F750cD866b299594e2aC9eA824E2e5f95c',
        name: 'proposeL2Output',
        selector: '0x9aaab648',
      },
    ],
    transfers: [
      {
        type: 'DA',
        from_address: '0x625726c858dBF78c0125436C943Bf4b4bE9d9033',
        to_address: '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf',
      },
    ],
  },
  {
    name: 'Aevo',
    methods: [
      {
        type: 'STATE',
        address: '0x909E51211e959339EFb14b36f5A50955a8ae3770',
        name: 'proposeL2Output',
        selector: '0x9aaab648',
      },
    ],
    transfers: [
      {
        type: 'DA',
        from_address: '0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d',
        to_address: '0x253887577420Cb7e7418cD4d50147743c8041b28',
      },
    ],
  },
  {
    name: 'AztecConnect',
    methods: [
      {
        type: 'STATE',
        address: '0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455',
        name: 'processRollup',
        selector: '0xf81cccbe',
      },
    ],
  },
  {
    name: 'Aztec',
    methods: [
      {
        type: 'STATE',
        address: '0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba',
        name: 'processRollup',
        selector: '0x06011a46',
      },
    ],
  },
  {
    name: 'Brine',
    methods: [
      {
        type: 'STATE',
        address: '0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba',
        name: 'updateState',
        selector: '0x538f9406',
      },
    ],
  },
  {
    name: 'DeGate(v1)',
    methods: [
      {
        type: 'STATE',
        address: '0x6B937A5920726e70c5bF1d4d4E18EEeEd46FaE83',
        name: 'submitBlocks',
        selector: '0x377bb770',
      },
    ],
  },
  {
    name: 'DeGate(v2)',
    methods: [
      {
        type: 'STATE',
        address: '0x2CFd271e9b4d0344Fd2Aa0cb1ffd4f6b85c0B215',
        name: 'submitBlocks',
        selector: '0x377bb770',
      },
    ],
  },
  {
    name: 'PGN',
    methods: [
      {
        type: 'STATE',
        address: '0xA38d0c4E6319F9045F20318BA5f04CDe94208608',
        name: 'proposeL2Output',
        selector: '0x9aaab648',
      },
    ],
    transfers: [
      {
        type: 'DA',
        from_address: '0x99526b0e49A95833E734EB556A6aBaFFAb0Ee167',
        to_address: '0xC1B90E1e459aBBDcEc4DCF90dA45ba077d83BFc5',
      },
    ],
  },
  {
    name: 'Myria',
    methods: [
      {
        type: 'STATE',
        address: '0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7',
        name: 'updateState',
        selector: '0x538f9406',
      },
    ],
  },
  {
    name: 'Kroma',
    methods: [
      {
        type: 'STATE',
        address: '0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6',
        name: 'submitL2Output',
        selector: '0x5a045f78',
      },
    ],
    transfers: [
      {
        type: 'DA',
        from_address: '0x41b8cD6791De4D8f9E0eaF7861aC506822AdcE12',
        to_address: '0xfF00000000000000000000000000000000000255',
      },
    ],
  },
  {
    name: 'CanvasConnect',
    methods: [
      {
        type: 'STATE',
        address: '0x7A7f9c8fe871cd50f6Ce935d7c7caD2e89987f9d',
        name: 'updateState',
        selector: '0x538f9406',
      },
    ],
  },
  {
    name: 'FuelV1',
    methods: [
      {
        type: 'STATE',
        address: '0x6880f6Fd960D1581C2730a451A22EED1081cfD72',
        name: 'commitBlock',
        selector: '0x80b39a1f',
      },
    ],
  },
]
