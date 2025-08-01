import { expect } from 'earl'
import { glob } from './glob'

describe('glob', () => {
  const testDir = '/test'

  const mockFiles = [
    'README.md',
    'package.json',
    'tokens/config.json',
    'tokens/auth/login.xml',
    'tokens/auth/logout.xml',
    'tokens/user/profile.xml',
    'src/index.ts',
    'src/utils/helper.ts',
    'src/utils/parser.js',
    'docs/guide.txt',
  ]

  it('should find all XML files with ** pattern', async () => {
    const result = await glob(testDir, 'tokens/**/*.xml', async () => mockFiles)

    expect(result).toEqual([
      'tokens/auth/login.xml',
      'tokens/auth/logout.xml',
      'tokens/user/profile.xml',
    ])
  })

  it('should find files with single * wildcard', async () => {
    const result = await glob(testDir, 'src/*.ts', async () => mockFiles)

    expect(result).toEqual(['src/index.ts'])
  })

  it('should find files in nested directories with * pattern', async () => {
    const result = await glob(testDir, 'src/utils/*', async () => mockFiles)

    expect(result).toEqual(['src/utils/helper.ts', 'src/utils/parser.js'])
  })

  it('should find files with specific extension anywhere', async () => {
    const result = await glob(testDir, '**/*.ts', async () => mockFiles)

    expect(result).toEqual(['src/index.ts', 'src/utils/helper.ts'])
  })

  it('should find files with exact filename match', async () => {
    const result = await glob(testDir, 'package.json', async () => mockFiles)

    expect(result).toEqual(['package.json'])
  })

  it('should find files with wildcard in filename', async () => {
    const result = await glob(testDir, '*.json', async () => mockFiles)

    expect(result).toEqual(['package.json'])
  })

  it('should find files with complex pattern', async () => {
    const result = await glob(testDir, '**/config.*', async () => mockFiles)

    expect(result).toEqual(['tokens/config.json'])
  })

  it('should return empty array for non-matching pattern', async () => {
    const result = await glob(testDir, '**/*.py', async () => mockFiles)

    expect(result).toEqual([])
  })

  it('should handle pattern with multiple wildcards', async () => {
    const result = await glob(testDir, '**/utils/*.ts', async () => mockFiles)

    expect(result).toEqual(['src/utils/helper.ts'])
  })

  it('should find all files with ** alone', async () => {
    const result = await glob(testDir, '**/*', async () => mockFiles)

    expect(result).toEqual([
      'README.md',
      'docs/guide.txt',
      'package.json',
      'src/index.ts',
      'src/utils/helper.ts',
      'src/utils/parser.js',
      'tokens/auth/login.xml',
      'tokens/auth/logout.xml',
      'tokens/config.json',
      'tokens/user/profile.xml',
    ])
  })

  it('should handle patterns starting with specific directory', async () => {
    const result = await glob(testDir, 'tokens/**/*', async () => mockFiles)

    expect(result).toEqual([
      'tokens/auth/login.xml',
      'tokens/auth/logout.xml',
      'tokens/config.json',
      'tokens/user/profile.xml',
    ])
  })

  it('should handle empty file list gracefully', async () => {
    const result = await glob(testDir, '**/*', async () => [])

    expect(result).toEqual([])
  })

  it('should return results in sorted order', async () => {
    const unorderedFiles = [
      'z-file.txt',
      'a-file.txt',
      'dir/b-file.txt',
      'dir/a-file.txt',
    ]
    const result = await glob(testDir, '**/*.txt', async () => unorderedFiles)

    expect(result).toEqual([
      'a-file.txt',
      'dir/a-file.txt',
      'dir/b-file.txt',
      'z-file.txt',
    ])
  })

  it('should handle complex nested patterns', async () => {
    const complexFiles = [
      'src/components/Button/Button.tsx',
      'src/components/Input/Input.tsx',
      'src/utils/helpers.ts',
      'tests/components/Button.test.tsx',
    ]
    const result = await glob(
      testDir,
      'src/**/Button.*',
      async () => complexFiles,
    )

    expect(result).toEqual(['src/components/Button/Button.tsx'])
  })

  it('should handle patterns with dots in extensions', async () => {
    const filesWithDot = ['config.dev.json', 'config.prod.json', 'config.js']
    const result = await glob(
      testDir,
      'config.*.json',
      async () => filesWithDot,
    )

    expect(result).toEqual(['config.dev.json', 'config.prod.json'])
  })
})
