export { constants }

const constants = {
  // Markers
  changeL2Block: 0x0b, // 11, marks block start

  // Sig/Chain ID - EIP155
  ether155V: 27,
  etherPre155V: 35,

  // Encoding/Decoding
  headerByteLength: 1,
  sLength: 32,
  rLength: 32,
  vLength: 1,
  c0: 192, // 192 is c0. This value is defined by the rlp protocol
  ff: 255, // max value of rlp header
  shortRlp: 55, // length of the short rlp codification
  f7: 247, // 192 + 55 = c0 + shortRlp
  efficiencyPercentageByteLength: 1, // length of the effective percentage in bytes
}
