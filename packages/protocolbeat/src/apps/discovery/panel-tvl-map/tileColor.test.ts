import { expect } from 'earl'
import { toIntensity, toTileColor } from './tileColor'

// Methodology: the contrast decision is checked against colors whose blend is
// unambiguous to the eye, and the intensity ramp through its endpoints, so the
// tests stay readable if the alpha range is retuned.
describe('tileColor', () => {
  describe(toTileColor.name, () => {
    it('scales opacity with intensity', () => {
      const dim = toTileColor('#8B8BE8', 0)
      const bright = toTileColor('#8B8BE8', 1)

      expect(dim.background).toEqual('rgba(139, 139, 232, 0.180)')
      expect(bright.background).toEqual('rgba(139, 139, 232, 0.920)')
    })

    it('asks for dark text once the fill turns bright', () => {
      expect(toTileColor('#FABD30', 1).prefersDarkText).toEqual(true)
      expect(toTileColor('#9DDE6C', 1).prefersDarkText).toEqual(true)
      expect(toTileColor('#8B8BE8', 1).prefersDarkText).toEqual(true)
    })

    it('asks for light text while the fill stays dark', () => {
      expect(toTileColor('#FABD30', 0).prefersDarkText).toEqual(false)
      expect(toTileColor('#8B8BE8', 0.5).prefersDarkText).toEqual(false)
    })

    it('rejects a value that is not a hex color', () => {
      expect(() => toTileColor('8B8BE8', 1)).toThrow()
      expect(() => toTileColor('#8B8BE', 1)).toThrow()
    })
  })

  describe(toIntensity.name, () => {
    it('runs from the top rank down to the last one', () => {
      expect(toIntensity(0, 5)).toEqual(1)
      expect(toIntensity(2, 5)).toEqual(0.5)
      expect(toIntensity(4, 5)).toEqual(0)
    })

    it('gives a lone entry the full intensity', () => {
      expect(toIntensity(0, 1)).toEqual(1)
    })

    it('rejects a rank outside of the ranking', () => {
      expect(() => toIntensity(5, 5)).toThrow()
      expect(() => toIntensity(-1, 5)).toThrow()
    })
  })
})
