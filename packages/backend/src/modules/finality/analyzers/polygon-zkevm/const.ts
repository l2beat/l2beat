export const constants = {
  double: 2,
  ether155V: 27,
  etherPre155V: 35,
  // MaxEffectivePercentage is the maximum value that can be used as effective percentage
  MaxEffectivePercentage: 255,
  // Decoding constants
  headerByteLength: 1,
  sLength: 32,
  rLength: 32,
  vLength: 1,
  c0: 192, // 192 is c0. This value is defined by the rlp protocol
  ff: 255, // max value of rlp header
  shortRlp: 55, // length of the short rlp codification
  f7: 247, // 192 + 55 = c0 + shortRlp
  // EfficiencyPercentageByteLength is the length of the effective percentage in bytes
  EfficiencyPercentageByteLength: 1,
}
