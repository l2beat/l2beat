/**
 * Example with complex formatting
 */
export const complexMarkdownExample = `
## Configuration Steps

Follow these steps to configure the handler:

1. **Select Handler Type**
   * Choose from available handlers
   * Each handler has specific requirements

2. **Configure Parameters**
   \`\`\`json
   {
     "type": "handler-name",
     "param1": "value1",
     "param2": "value2"
   }
   \`\`\`

3. **Validate**
   > The editor will highlight any schema validation errors

4. **Save**
   * Press \`Cmd+S\` (Mac) or \`Ctrl+S\` (Windows/Linux)
   * Or click the save button

## Common Patterns

### Pattern 1: Event-based handlers
Used when tracking state changes through events:
- \`arrayFromOneEvent\`: Track additions via single event
- \`arrayFromTwoEvents\`: Track additions and removals
- \`stateFromEvent\`: Track state transitions

### Pattern 2: Call-based handlers
Used for direct state queries:
- \`call\`: Simple contract call
- \`storage\`: Read storage slot directly

### Pattern 3: Access control
Special handler for permission systems:
\`\`\`json
{
  "type": "accessControl",
  "roleNames": {
    "0x00...00": "Admin",
    "0x12...34": "Operator"
  }
}
\`\`\`

---

**Note**: All handlers support the \`ignoreRelative\` flag to control discovery depth.
`
