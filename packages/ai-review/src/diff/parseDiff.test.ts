import { expect } from 'earl'
import { isInDiff, parseDiffLines } from './parseDiff.js'

const diff = `diff --git a/src/a.ts b/src/a.ts
index 1..2 100644
--- a/src/a.ts
+++ b/src/a.ts
@@ -1,4 +1,5 @@
 const a = 1
-const b = 2
+const b = 3
+const c = 4
 export { a, b }
@@ -20,3 +21,4 @@ function x() {
   return 1
+  // added
 }
\\ No newline at end of file
diff --git a/gone.ts b/gone.ts
deleted file mode 100644
--- a/gone.ts
+++ /dev/null
@@ -1,2 +0,0 @@
-x
-y
diff --git a/new.ts b/new.ts
new file mode 100644
--- /dev/null
+++ b/new.ts
@@ -0,0 +1,2 @@
+n1
+n2
`

describe(parseDiffLines.name, () => {
  it('collects added lines per file with correct right-side numbering', () => {
    const lines = parseDiffLines(diff)
    expect([...(lines.get('src/a.ts') ?? [])]).toEqual([2, 3, 22])
    expect([...(lines.get('new.ts') ?? [])]).toEqual([1, 2])
    expect(lines.has('gone.ts')).toEqual(false)
  })
})

describe('parseDiffLines edge cases', () => {
  it('does not treat an added "++ " line as a file header', () => {
    const lines = parseDiffLines(`diff --git a/c.ts b/c.ts
--- a/c.ts
+++ b/c.ts
@@ -1,1 +1,3 @@
 a
+++ weird
+b
`)
    expect([...lines.keys()]).toEqual(['c.ts'])
    expect([...(lines.get('c.ts') ?? [])]).toEqual([2, 3])
  })
})

describe(isInDiff.name, () => {
  const lines = parseDiffLines(diff)
  it('true only when the whole range is added', () => {
    expect(isInDiff(lines, 'src/a.ts', 2)).toEqual(true)
    expect(isInDiff(lines, 'src/a.ts', 2, 3)).toEqual(true)
    expect(isInDiff(lines, 'src/a.ts', 1)).toEqual(false)
    expect(isInDiff(lines, 'src/a.ts', 3, 4)).toEqual(false)
    expect(isInDiff(lines, 'missing.ts', 1)).toEqual(false)
    expect(isInDiff(lines, 'src/a.ts', 3, 2)).toEqual(false)
    expect(isInDiff(lines, 'src/a.ts', 0)).toEqual(false)
  })
})
