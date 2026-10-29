import type { Block } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { StarknetUopsAnalyzer } from './StarknetUopsAnalyzer'

// Calldata samples at the bottom are real mainnet INVOKEs from 2026-09-20 to
// 2026-09-24, taken from Dune's starknet.transactions or a mainnet RPC and
// looked up by hash. Each expected count is read off the decoded calldata;
// the comment on each test shows that decoding.
describe(StarknetUopsAnalyzer.name, () => {
  const analyzer = new StarknetUopsAnalyzer()
  const CAIRO_1_BLOCK = 2_000_000

  describe(StarknetUopsAnalyzer.prototype.calculateUops.name, () => {
    it('gets the operations count', () => {
      const block = mockObject<Block>({
        number: 3001,
        transactions: [
          mockTx('DEPLOY_ACCOUNT'),
          mockTx('INVOKE', ['0x1', '0x12123']),
          mockTx('INVOKE', ['0x2', '0x12123']),
          mockTx('INVOKE', ['0x3', '0x12123']),
        ],
      })
      const uops = analyzer.calculateUops(block)

      expect(uops).toEqual(7)
    })
  })

  describe(StarknetUopsAnalyzer.prototype.getOperationsCount.name, () => {
    it('should handle DEPLOY_ACCOUNT transaction', () => {
      const tx = mockTx('DEPLOY_ACCOUNT')

      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(1)
    })

    it('should handle block number lower than 3000', () => {
      const tx = mockTx('abc')
      const result = analyzer.getOperationsCount(tx, 100)
      expect(result).toEqual(1)
    })

    it('should handle tx other than INVOKE', () => {
      const tx = mockTx('abc')
      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(1)
    })

    it('should handle tx INVOKE without calldata', () => {
      const tx = mockTx('INVOKE')
      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(1)
    })

    it('should handle tx INVOKE with calldata', () => {
      const tx = mockTx('INVOKE', ['0x3', '0x12123'])
      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(3)
    })

    it('counts the call array length of Cairo 0 calldata', () => {
      // __execute__(call_array_len, [to, selector, data_offset, data_len]...,
      // calldata_len, calldata...) does not parse as Array<Call>.
      const tx = mockTx('INVOKE', [
        ...['0x2', '0xa', '0xb', '0x0', '0x1', '0xc', '0xd', '0x1', '0x1'],
        ...['0x2', '0x5', '0x6'],
      ])

      const result = analyzer.getOperationsCount(tx, CAIRO_1_BLOCK)
      expect(result).toEqual(2)
    })

    it('counts the calls inside execute_from_outside_v2', () => {
      // relayer -> account.execute_from_outside_v2
      //   USDC.approve, 0x89b3d18e9c.0x1df759bee2
      const result = analyzer.getOperationsCount(
        OUTSIDE_EXECUTION_V2,
        CAIRO_1_BLOCK,
      )
      expect(result).toEqual(2)
    })

    it('counts the calls inside execute_from_outside_v3', () => {
      // v3 turns the nonce into a (channel, nonce) pair.
      // relayer -> account.execute_from_outside_v3
      //   0x23f86f5b47.0x7647db234d, 0x46db77f066.claim_rewards
      const result = analyzer.getOperationsCount(
        OUTSIDE_EXECUTION_V3,
        CAIRO_1_BLOCK,
      )
      expect(result).toEqual(2)
    })

    it('counts each outside execution a relayer batches, plus its own call', () => {
      // relayer -> 0x2ceed65a4b.0x1987cbd178
      // relayer -> account.execute_from_outside_v2
      //   STRK.transfer
      const result = analyzer.getOperationsCount(RELAYER_BATCH, CAIRO_1_BLOCK)
      expect(result).toEqual(2)
    })

    it('counts the calls an AVNU forwarder execute passes to an account', () => {
      // relayer -> forwarder.execute(account, execute_from_outside, ...)
      //   account.execute_from_outside
      //     STRK.transfer, ETH.transfer
      const result = analyzer.getOperationsCount(
        FORWARDER_EXECUTE,
        CAIRO_1_BLOCK,
      )
      expect(result).toEqual(2)
    })

    it('counts the calls an AVNU forwarder execute_sponsored passes to an account', () => {
      // relayer -> forwarder.execute_sponsored(account, execute_from_outside_v2, ...)
      //   account.execute_from_outside_v2
      //     0x791670c0e8.claim_rewards, 0x6df788cbbd.claim_rewards
      const result = analyzer.getOperationsCount(
        FORWARDER_EXECUTE_SPONSORED,
        CAIRO_1_BLOCK,
      )
      expect(result).toEqual(2)
    })

    it('counts the calls of an AVNU forwarder execute_private', () => {
      // relayer -> STRK.transfer
      // relayer -> forwarder.execute_private
      //   0x40337b1af3.0x246333a752
      const result = analyzer.getOperationsCount(
        FORWARDER_EXECUTE_PRIVATE,
        CAIRO_1_BLOCK,
      )
      expect(result).toEqual(2)
    })

    it('counts the calls of an AVNU forwarder execute_private_sponsored', () => {
      // relayer -> STRK.transfer
      // relayer -> forwarder.execute_private_sponsored
      //   account.execute_from_outside_v2
      //     STRK.approve
      //   0x40337b1af3.0x246333a752
      const result = analyzer.getOperationsCount(
        FORWARDER_EXECUTE_PRIVATE_SPONSORED,
        CAIRO_1_BLOCK,
      )
      expect(result).toEqual(3)
    })

    it('counts repeats of one entrypoint inside an outside execution once', () => {
      // relayer -> forwarder.execute_sponsored(account, execute_from_outside_v2, ...)
      //   account.execute_from_outside_v2
      //     FocusTree.0x41b033f4a3 x3, moving three tokens to one recipient
      const result = analyzer.getOperationsCount(
        FOCUSTREE_REPEATED_CALLS,
        CAIRO_1_BLOCK,
      )
      expect(result).toEqual(1)
    })

    it('counts a reverted tx as one operation', () => {
      // The same calldata counts 2 when it succeeds, but a revert undoes both.
      const result = analyzer.getOperationsCount(
        { ...RELAYER_BATCH, reverted: true },
        CAIRO_1_BLOCK,
      )
      expect(result).toEqual(1)
    })

    it('counts as one a contract that only borrows the outside execution selector', () => {
      // 0x179b07d455 copies Argent's ABI but has no __execute__. Its
      // execute_from_outside_v2 takes (token_in, token_out, amount_in, ...,
      // route) and performs a single swap, so there are no calls to unwrap.
      const result = analyzer.getOperationsCount(SWAP_BOT, CAIRO_1_BLOCK)
      expect(result).toEqual(1)
    })
  })
})

function mockTx(type: string, data?: string[]) {
  return {
    type,
    data,
    hash: '0x0',
  }
}

function tx(hash: string, data: string[]) {
  return { type: 'INVOKE', data, hash }
}

const OUTSIDE_EXECUTION_V2 = tx(
  '0x01b0dbc3fe6b41dd3db738c345142791ebd3bc2a43d405a283da8d52f6c08d04',
  [
    '0x1',
    '0x19875b734e846d6e85f4860277297c57714c45922c4f14a1b6f151e1acb07b6',
    '0x34cc13b274446654ca3233ed2c1620d4c5d1d32fd20b47146a3371064bdc57d',
    '0x1b',
    '0xa08bfbad08afc29d28d81178e46f1a1353f3a4888410673b4e3677f9be87bd',
    '0xbf22637178ef9cf6d44d4e077abecbc8ac9e26e9e7b96edf07a22002679101',
    '0x6ab00133',
    '0x6ab0029b',
    '0x2',
    '0x33068f6539f8e6e6b131e6b2b814e6c34a5224bc66947c47dab9dfee93b35fb',
    '0x219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c',
    '0x3',
    '0x89b3d18e9c0b1616ff334106707434224a00ed84567d0d05b1e25a76b36b02',
    '0x1b33f48',
    '0x0',
    '0x89b3d18e9c0b1616ff334106707434224a00ed84567d0d05b1e25a76b36b02',
    '0x1df759bee2be6f9278efb668b6c8ec3b9faf20a5dc5d14c2a6a6ac60d9bb4ac',
    '0x6',
    '0x2',
    '0x0',
    '0x28',
    '0x0',
    '0xae195',
    '0x0',
    '0x6',
    '0x59b9f408ee2137c406603eda5b578ac4',
    '0x2d6dda8dc786520b215b6d615b448941',
    '0x6718b69b03180d292e09e98b8ccc346b',
    '0x76c2376dffbb49327173ca3274990649',
    '0x1b',
    '0x1',
  ],
)

const OUTSIDE_EXECUTION_V3 = tx(
  '0x03d06db25b531cb0a8ac127dbf1b0409907dd712ec9cc16f5b07797ceaf9f0b6',
  [
    '0x1',
    '0x53654a610be9950fd73f72833ded20b049a1da30f42c732a076e55c27024381',
    '0x3dbc508ba4afd040c8dc4ff8a61113a7bcaf5eae88a6ba27b3c50578b3587e3',
    '0x28',
    '0x414e595f43414c4c4552',
    '0x5b4d9c2dc34d5ce4919b6e07ce27612afa2d186460f8051be5db53044945092',
    '0x80',
    '0x0',
    '0x6aafd4ae',
    '0x2',
    '0x23f86f5b4702f6ba114b82fb73448c58aad8f37a28b508b80bf129ee1edc405',
    '0x7647db234d6e5c5db278611b6fd444f721d91d516ebe86a63f5bb9c183f0eb',
    '0x1',
    '0x174000000001fa4006aafcf7300000000000000400000000240000001',
    '0x46db77f066f1bec5ae53d2cf3686a262f308eb904e6b426251bcdf3a6bf34f0',
    '0x89c7b1cc4866e9e58d867cb66844bcc9c17cfdabb8ab640b05d2bc53efc556',
    '0x1',
    '0x174000000001fa4006aafcf7300000000000000400000000240000001',
    '0x19',
    '0x73657373696f6e2d746f6b656e',
    '0x6ab9064b',
    '0x77696c64636172642d706f6c696379',
    '0x0',
    '0x5faceaf67ef3ecfcfb8e469cba6d391a01afa6c2d1c9aff1f58f6d8d6f8f549',
    '0x0',
    '0x1',
    '0x8',
    '0x1',
    '0x3',
    '0xf711332865fb48ea2cbadcbdbcf93d5e21e71301',
    '0xf6752a869af687b6c691cabfbb85d9e5',
    '0x730ba59475ced27a05621785d35a6e7f',
    '0xa8e6c1b1335765c6a8a414d9c0148347',
    '0x3090d6a739721f8b62dd993d9a1e7fce',
    '0x0',
    '0x0',
    '0x3beed0ae64f0d84fbe689bf110ed0b9093ff0ebf32a16efa4fb4490ad8f9b66',
    '0xa97f0262739936eca7828c18a0ff47d1a02205726874f1e7f76e8e1d0a8f22',
    '0x55ceecc7258a84be09f78238fac7e64badb266a4eb0203466a3f4d6107ebf5e',
    '0x0',
    '0x1e6a6f52e47fe42e024287b729bc47e58019fcc7e1cc8b141bb8d669b779b49',
    '0x458913ace0ec8665313b898d1b3694fa03727a3998da40a29f80fba202272c',
    '0xc745486bbb8adfc87902383b2ea2bbbeafc159b23cd3b12be013f979a2cbec',
    '0x0',
  ],
)

const RELAYER_BATCH = tx(
  '0x06235550a91d444b7d99b9e11331e797c31870f11127e8c3513e6305d0ce1473',
  [
    '0x2',
    '0x2ceed65a4bd731034c01113685c831b01c15d7d432f71afb1cf1634b53a2125',
    '0x1987cbd17808b9a23693d4de7e246a443cfe37e6e7fbaeabd7d7e6532b07c3d',
    '0x5',
    '0x540d7f5ec7ecf317e68d48564934cb99259781b1ee3cedbbc37ec5337f8e688',
    '0x4f77ba1dfdb0bb994c9218546e2dac13e890353c3a923e44569f3deba992e79',
    '0x0',
    '0x1',
    '0x4f77ba1dfdb0bb994c9218546e2dac13e890353c3a923e44569f3deba992e79',
    '0x76118a99cae206888f4820729a3b08abdd58ef3fc3ff777e0306118260d4829',
    '0x34cc13b274446654ca3233ed2c1620d4c5d1d32fd20b47146a3371064bdc57d',
    '0xe',
    '0x31cab620e781d468304b6b6c743a8afced9330678e60744d2dca2dcf0c8e1a9',
    '0x0',
    '0x6ab1bbe1',
    '0x6ab1d801',
    '0x1',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e',
    '0x3',
    '0x31cab620e781d468304b6b6c743a8afced9330678e60744d2dca2dcf0c8e1a9',
    '0xbed1d0263d9f00000',
    '0x0',
    '0x2',
    '0x55456aeb923acf4135a575d60ef32d84e53320f2e95198b9c9b45e46e637d85',
    '0x37da0a14386e91d4b020bddcef29edda060e25aecbd48c71f0a235200042827',
  ],
)

const FORWARDER_EXECUTE = tx(
  '0x0055395aa07f48df9f8b81152f0a11c915369b1b9448262b43fe56fd167d220a',
  [
    '0x1',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x240060cdb34fcc260f41eac7474ee1d7c80b7e3607daff9ac67c7ea2ebb1c44',
    '0x1a',
    '0x2a08115325a9c8b4ed81f9062b269c1b1866762d7d30df065a44eb2f7a155d2',
    '0x7ec457cd7ed1630225a8328f826a29a327b19486f6b2882b4176545ebdbe3d',
    '0x14',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0xaccd842439be2d89c14e3009f704edd1',
    '0x1',
    '0x6ab020c9',
    '0x2',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e',
    '0x3',
    '0x7e8c6c01c9bc9a3df1a474cd7f8460b8be70cb29733a6033dbcc5c377dd83dc',
    '0x214e8348c4f0000',
    '0x0',
    '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    '0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e',
    '0x3',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x28aa4a52b17',
    '0x0',
    '0x2',
    '0x207f4476b6ec25f2e7f31e4f7dd2107690785a7231f76427a046b7837460a3',
    '0x6f7193148ee49462ceb2c1bc73363b77d8053b05d1a2ac2f576c1bf3ff122ab',
    '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    '0x1d029731dca',
    '0x0',
  ],
)

const FORWARDER_EXECUTE_SPONSORED = tx(
  '0x05950bbc63dfe202fe9581f6c591d6d4f0ad4d3d286433b7c0227353d2cfc607',
  [
    '0x1',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x3d82f059acd7c22528fe93d2cd7c941d47411bf7c5525efe7f71eedebd62647',
    '0x15',
    '0x4deb905a94d0df6331fe8b449a4857f5e890b997155cf12bc110f2e29fd7018',
    '0x34cc13b274446654ca3233ed2c1620d4c5d1d32fd20b47146a3371064bdc57d',
    '0x10',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x51e91abaeeecd9aef046ef213a98e714',
    '0x1',
    '0x6aaf8ab7',
    '0x2',
    '0x791670c0e853c7c0d05007fea72d5f5b49e13557cff5740f22067a7de799634',
    '0x89c7b1cc4866e9e58d867cb66844bcc9c17cfdabb8ab640b05d2bc53efc556',
    '0x1',
    '0x4deb905a94d0df6331fe8b449a4857f5e890b997155cf12bc110f2e29fd7018',
    '0x6df788cbbdebdcaf603a6e3ef8a8ea631dbf8bb9afe9f6bdf199c12a74e506b',
    '0x89c7b1cc4866e9e58d867cb66844bcc9c17cfdabb8ab640b05d2bc53efc556',
    '0x1',
    '0x4deb905a94d0df6331fe8b449a4857f5e890b997155cf12bc110f2e29fd7018',
    '0x2',
    '0x6b17a60837ef95a9145d9adeb2d6b143d33f2361c0f4190504c31e3a6ee1785',
    '0xec3309532ad1f407c807efe35ada8cc6f6c5755eba32ed95797e5dd9651d06',
    '0x1',
    '0x4bddeca3cb19a084045df0e68e333dd9431dbf1997c278ad571ef0c4faeb92c',
  ],
)

const FORWARDER_EXECUTE_PRIVATE = tx(
  '0x04dd5fc85880da951f7526e161004d8f410c9ec93ac0e19ca3eb14857a1d6481',
  [
    '0x2',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e',
    '0x3',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x53444835ec580000',
    '0x0',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x3d12429a99cf929b6c8fb32754218a978555693fe4cd3ce030ff1106b0fe1ee',
    '0x25',
    '0x1',
    '0x40337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a',
    '0x246333a752c1ac637ff1591c5c885e27d56060d241a29aad8475072da0777db',
    '0x1e',
    '0x6',
    '0x0',
    '0x1615bdc5eaf38fce32ce191481d296c225e119abe421c1872a33b6bdeb45bcb',
    '0x1',
    '0x1',
    '0x9',
    '0x3fb38e295aff057e190949e3c5fbc555c29376fa136aaf6e8b7a54de6fced48',
    '0x3',
    '0x5957d3ceeff0ed3277103e72f79756287c77177703fe20189b0bb2c26f74460',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x32c6d2856067b7c00',
    '0x5',
    '0x1eed60b8d483b3bede62d1cc0f32874aea30747e6943437c858359b41801bf7',
    '0x1307ca86d67d0e6459e9605f0c21c503a2360b393d429943debb623316d2d6b',
    '0x444e6728f441ea2ea48c1975401e5b888017dd2723c9a74cfbbe6178f17e157',
    '0x5957d3ceeff0ed3277103e72f79756287c77177703fe20189b0bb2c26f74460',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x32c6d2856067b7c00',
    '0x3',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x9751c5b203d7b400',
    '0x5',
    '0x1eed60b8d483b3bede62d1cc0f32874aea30747e6943437c858359b41801bf7',
    '0x359e445510577948ff9cfe61602539a8dd0eb61a88779fbc638918eb498ba0a',
    '0x215425107fbf1a6dfccfc5d8befb82cfda80cd5d0bb20e92a05a5fdc0952dff',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x9751c5b203d7b400',
    '0x1',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x6e3334694b64af10',
    '0x0',
  ],
)

const FORWARDER_EXECUTE_PRIVATE_SPONSORED = tx(
  '0x00a073166d84c4791c18b81fae8a71795c5353b3d4f9c60a2f2bed42db4d3067',
  [
    '0x2',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e',
    '0x3',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x53444835ec580000',
    '0x0',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x3bd4b5033e788e9cc450fefa99ea20e3bed0fa358c8b280c0488f0c4647472e',
    '0x3c',
    '0x2',
    '0x4cc33e5062aac056c3bae6802a1fbde37fc76947f4e2aea03e791651ae364e6',
    '0x34cc13b274446654ca3233ed2c1620d4c5d1d32fd20b47146a3371064bdc57d',
    '0x11',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x35d5010bb9a2e903b43a27e945ae657',
    '0x1',
    '0x6ab24846',
    '0x1',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c',
    '0x3',
    '0x40337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a',
    '0x12f939c99edab80000',
    '0x0',
    '0x5',
    '0x1',
    '0x0',
    '0x28a39838c4c4832256b066ad3d28084e875813dd6a8a0091f434d101b242b97',
    '0x2b59e56c6d76c805f627597c3628a8fd550690f055785de076476e51e2537d',
    '0x1a57803627c560538461c0474d1289184153f08a2067a582018c32f1889ca4',
    '0x40337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a',
    '0x246333a752c1ac637ff1591c5c885e27d56060d241a29aad8475072da0777db',
    '0x1f',
    '0x6',
    '0x2',
    '0x4cc33e5062aac056c3bae6802a1fbde37fc76947f4e2aea03e791651ae364e6',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x12f939c99edab80000',
    '0x6',
    '0x4cc33e5062aac056c3bae6802a1fbde37fc76947f4e2aea03e791651ae364e6',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x12f939c99edab80000',
    '0x0',
    '0x20b060959f731693c9b9fa71e2042477c7523eff832de0b9aac0b173efe0c7e',
    '0x1',
    '0xd9455255261f816a6fd5736ea7f5611c54aa24bcccda623fb3f52468c1c925',
    '0x8',
    '0x76655ff7d0bb57c19a12e05b2587d76c9aa9f83c50ad4ec5ec79871136fcf1b',
    '0xd9455255261f816a6fd5736ea7f5611c54aa24bcccda623fb3f52468c1c925',
    '0x3',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x53444835ec580000',
    '0x5',
    '0x1eed60b8d483b3bede62d1cc0f32874aea30747e6943437c858359b41801bf7',
    '0x6f5b2651bcb3e28af646aef531bfc7840e62e284a915d1d1438bdffcfda3e2d',
    '0x406a628f8997200f6aaa9b9e322b2bcf5fa3550a3b4e6edbaffd96dcadbf127',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x53444835ec580000',
    '0x0',
    '0x6ab23a41',
    '0x6a696d2554c609ace14c0ca94c69ab4f814586820276570d41a3e54027cb21e',
    '0x639d3c1aa44b4dc98d00e49fe54ab4e756005c21500643912aefa76e25e2c69',
    '0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x53444835ec580000',
    '0x0',
    '0x1',
    '0x3b3986cb9722cdedd9126319e77394ef5f6a09d29952176c24160e8dfcb3ec7',
  ],
)

const FOCUSTREE_REPEATED_CALLS = tx(
  '0x04afae27440ff233507a4471744de92912dc5b5e91a74bc26fb7166c7b01ced7',
  [
    '0x1',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x3d82f059acd7c22528fe93d2cd7c941d47411bf7c5525efe7f71eedebd62647',
    '0x29',
    '0x4bd9c0e9532ab2ffbd2df8b4a2340b4485124df88aa3f1dafff1231eca60d51',
    '0x34cc13b274446654ca3233ed2c1620d4c5d1d32fd20b47146a3371064bdc57d',
    '0x24',
    '0x127021a1b5a52d3174c2ab077c2b043c80369250d29428cee956d76ee51584f',
    '0x1a280e2a3255d937f8952e4fa8ac90c567befe468a8a8759d6021a8e9d4d7f0',
    '0x1',
    '0x6ab4b544',
    '0x3',
    '0x377c2d65debb3978ea81904e7d59740da1f07412e30d01c5ded1c5d6f1ddc43',
    '0x41b033f4a31df8067c24d1e9b550a2ce75fd4a29e1147af9752174f0e6cb20',
    '0x4',
    '0x4bd9c0e9532ab2ffbd2df8b4a2340b4485124df88aa3f1dafff1231eca60d51',
    '0x579ed214135f8ed807110d417e47171bdbf9f2c82823361e85428e05f00498',
    '0xfedd2b49e07e4300bbb50a44966419d5',
    '0x0',
    '0x377c2d65debb3978ea81904e7d59740da1f07412e30d01c5ded1c5d6f1ddc43',
    '0x41b033f4a31df8067c24d1e9b550a2ce75fd4a29e1147af9752174f0e6cb20',
    '0x4',
    '0x4bd9c0e9532ab2ffbd2df8b4a2340b4485124df88aa3f1dafff1231eca60d51',
    '0x579ed214135f8ed807110d417e47171bdbf9f2c82823361e85428e05f00498',
    '0xffe5c077de3c4639953fc7417d7999b4',
    '0x0',
    '0x377c2d65debb3978ea81904e7d59740da1f07412e30d01c5ded1c5d6f1ddc43',
    '0x41b033f4a31df8067c24d1e9b550a2ce75fd4a29e1147af9752174f0e6cb20',
    '0x4',
    '0x4bd9c0e9532ab2ffbd2df8b4a2340b4485124df88aa3f1dafff1231eca60d51',
    '0x579ed214135f8ed807110d417e47171bdbf9f2c82823361e85428e05f00498',
    '0xd6a9ae9880df4481b46808f039b6edec',
    '0x0',
    '0x9',
    '0x2',
    '0x0',
    '0x439c668437c13b44302514417c2d0aec6cea3696d1f0a13e8a838a50516512e',
    '0x30d86ae847ba443b12614469cf031e3d948144875f63279280b20b874eed4f2',
    '0x6056826e72663bae111a3c4a75df353bdaae81c9794a8dece8a89c34f615feb',
    '0x0',
    '0x301994122fc2009500a0292a0a1e70bef2a95ee10fd88778a9b568162d1cdf2',
    '0x7deb399ea510f973b9b62a95a0d0a59ccefdf67d4ffb2da075ab647acca6a57',
    '0x11187bd7ef8109802ea258acf333ce8694e9e6eb7d5bc8ae9a639908688f52f',
    '0x1',
    '0x1e8ad5efb5efdbd97f9f5ce49e5efb6279b5e05bb79b488edd836ce614e2ef4',
  ],
)

const SWAP_BOT = tx(
  '0x045af9cfea3205c80da462da958c1466182f974e49b58d7d9c752e9e0fb4e598',
  [
    '0x1',
    '0x179b07d45592284c5f08ed7ce0da4c3fd8232d5c8f7cec7e938880cee461528',
    '0x34cc13b274446654ca3233ed2c1620d4c5d1d32fd20b47146a3371064bdc57d',
    '0x13',
    '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    '0x33068f6539f8e6e6b131e6b2b814e6c34a5224bc66947c47dab9dfee93b35fb',
    '0x97bafbe384d5000',
    '0x0',
    '0x6ae3fa15',
    '0x0',
    '0xc',
    '0x1',
    '0x33068f6539f8e6e6b131e6b2b814e6c34a5224bc66947c47dab9dfee93b35fb',
    '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    '0x20c49ba5e353f80000000000000000',
    '0x3e8',
    '0x0',
    '0xb42bdd3a6a55bf9de21e781b4e4fa8c2',
    '0x4da8',
    '0x0',
    '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    '0x97bafbe384d5000',
    '0x0',
  ],
)
