import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import type { OwnerDefinition } from './types'

export interface AiDetectedPermission {
  functionName: string
  isPermissioned: boolean
  ownerDefinitions?: OwnerDefinition[]
  sourceFile?: string // Which source file this function was found in
}

export interface AiDetectionResult {
  functions: AiDetectedPermission[]
}

const AI_DETECTION_PROMPT = `You are a smart contract security analyzer. Analyze the provided Solidity source code and identify all PERMISSIONED state-changing functions.

ANALYSIS PROCEDURE (follow in order):

STEP 1: Identify all external/public non-view/non-pure functions. These are the ONLY functions to report.

STEP 2: For each function from Step 1, check for DIRECT access control:
- Modifiers that check msg.sender (onlyOwner, onlyAdmin, onlyRole, etc.)
- Direct require/if statements comparing msg.sender to a storage variable
- If found, the function is permissioned. Identify the storage fields msg.sender is compared against.

STEP 3: If NO direct access control was found in Step 2, check if the function calls any INTERNAL or PRIVATE functions that perform msg.sender checks:
- Look at every internal/private function the external function calls
- Check if those internal functions contain require/if statements comparing msg.sender to storage variables
- If found, the external function is permissioned. The ownerDefinitions come from the STORAGE FIELDS that msg.sender is compared against inside those internal functions.
- IMPORTANT: Do NOT infer fields from function names. You MUST read the actual function body to find what msg.sender is compared against.

STEP 3 EXAMPLE:
  // This internal function restricts callers:
  function _requireCallerIsBOorTroveMorSP() internal view {
      require(
          msg.sender == borrowerOperationsAddress ||
          msg.sender == troveManagerAddress ||
          msg.sender == stabilityPoolAddress,
          "...");
  }
  // This external function calls it, so it IS permissioned:
  function sendETH(address _account, uint _amount) external {
      _requireCallerIsBOorTroveMorSP();
      // ...
  }
  // Result: sendETH is permissioned with ownerDefinitions from the storage fields
  // in _requireCallerIsBOorTroveMorSP: borrowerOperationsAddress, troveManagerAddress, stabilityPoolAddress

MULTIPLE CALLER CHECKS:
When a msg.sender check uses OR logic (msg.sender == A || msg.sender == B), include ALL allowed callers as separate ownerDefinitions.

OWNER DEFINITION PATH FORMAT:
- Owner definitions use a unified PATH format: "<contractRef>.<valuePath>"
  - Use "$self" when accessing fields in the CURRENT contract being analyzed
  - Use "@fieldName" ONLY when you need to FOLLOW an address field to ANOTHER contract and access that other contract's fields
  - <valuePath>: JSONPath-like navigation (e.g., owner, accessControl.ROLE_NAME.members)
  - Add ".members" when referencing AccessControl role members specifically
- Multiple ownerDefinitions can be provided for functions with multiple access control mechanisms

PATH EXAMPLES:
- Owner field in current contract: "$self.owner"
- Admin field in current contract: "$self.admin"
- Proxy admin (for proxy__ functions like upgradeTo, changeAdmin): "$self.$admin"
- Any field in current contract: "$self.MODULE" or "$self.STRIKES" or "$self.governor"
- Role-based (OpenZeppelin AccessControl): "$self.accessControl.MINTER_ROLE.members"
- Following address field to access ANOTHER contract's field: "@governanceContract.owner"
- Array element in current contract: "$self.signers[0]"
- Current contract itself is owner: "$self"

SPECIAL PROXY RULES:
- For proxy admin functions (proxy__upgradeTo, proxy__changeAdmin, proxy__upgradeToAndCall, proxy__ossify), ALWAYS use "$self.$admin" (note the $ prefix on admin)
- Do NOT use accessControl.ADMIN_SLOT or other internal storage patterns for proxies
- The system automatically discovers proxy admins and exposes them as the "$admin" field

CRITICAL: Always use "$self.fieldName" for fields in the current contract. Only use "@fieldName" when you need to access a field in a DIFFERENT contract that the fieldName points to.

Response MUST be valid JSON matching this schema:
{
  "functions": [
    {
      "functionName": "string",
      "isPermissioned": boolean,
      "sourceFile": "string (the exact filename where this function is defined)",
      "ownerDefinitions": [
        {
          "path": "string (unified path expression)"
        }
      ]
    }
  ]
}

Examples:
1. Function with onlyOwner modifier in MyContract.p.sol:
   {
     "functionName": "pause",
     "isPermissioned": true,
     "sourceFile": "MyContract.p.sol",
     "ownerDefinitions": [{"path": "$self.owner"}]
   }

2. Function with AccessControl role in the same contract (MyContract.sol):
   {
     "functionName": "mint",
     "isPermissioned": true,
     "sourceFile": "MyContract.sol",
     "ownerDefinitions": [{"path": "$self.accessControl.MINTER_ROLE"}]
   }

3. Function calling internal helper that checks msg.sender against multiple fields:
   {
     "functionName": "sendETH",
     "isPermissioned": true,
     "sourceFile": "ActivePool.sol",
     "ownerDefinitions": [
       {"path": "$self.borrowerOperationsAddress"},
       {"path": "$self.troveManagerAddress"},
       {"path": "$self.stabilityPoolAddress"}
     ]
   }

4. Function accessible by admin role OR specific governor:
   {
     "functionName": "setParameter",
     "isPermissioned": true,
     "sourceFile": "MyContract.sol",
     "ownerDefinitions": [
       {"path": "$self.accessControl.DEFAULT_ADMIN_ROLE"},
       {"path": "@governor.owner"}
     ]
   }

Now analyze the following contract source code:`

export interface ParsedAiError {
  userMessage: string
  technicalDetails: string
  suggestedAction?: string
}

/**
 * Parse AI API errors into user-friendly messages
 */
export function parseAiError(error: any): ParsedAiError {
  const technicalDetails =
    error instanceof Error ? error.message : String(error)

  // Check for rate limit errors (429)
  if (
    technicalDetails.includes('429') ||
    technicalDetails.toLowerCase().includes('rate limit')
  ) {
    return {
      userMessage: 'Rate limit exceeded. Too many requests to the AI provider.',
      technicalDetails,
      suggestedAction:
        'Wait a few minutes before trying again, or switch to a different model.',
    }
  }

  // Check for overload errors (529 or 'overloaded')
  if (
    technicalDetails.includes('529') ||
    technicalDetails.toLowerCase().includes('overload')
  ) {
    return {
      userMessage: 'AI provider is currently overloaded with requests.',
      technicalDetails,
      suggestedAction:
        'Try again in a few moments, or switch to a different model.',
    }
  }

  // Check for authentication errors (401, 403, or 'api key')
  if (
    technicalDetails.includes('401') ||
    technicalDetails.includes('403') ||
    technicalDetails.toLowerCase().includes('api key') ||
    technicalDetails.toLowerCase().includes('authentication')
  ) {
    return {
      userMessage:
        'Authentication failed. Please check your API key configuration.',
      technicalDetails,
      suggestedAction:
        'Verify that your API key is correctly set in the .env file.',
    }
  }

  // Generic error
  return {
    userMessage: 'An error occurred while detecting permissions.',
    technicalDetails,
    suggestedAction: 'Check the terminal logs for more details.',
  }
}

/**
 * Calls AI API to detect permissioned functions in contract source code
 */
export async function detectPermissionsWithAI(
  sourceCode: string,
  apiKey: string,
  provider: 'openai' | 'claude',
  modelId: string,
): Promise<AiDetectionResult> {
  try {
    if (provider === 'openai') {
      return await detectWithOpenAI(sourceCode, apiKey, modelId)
    }
    return await detectWithClaude(sourceCode, apiKey, modelId)
  } catch (error) {
    // Re-throw with parsed error information
    const parsedError = parseAiError(error)
    const enhancedError = new Error(parsedError.userMessage) as any
    enhancedError.technicalDetails = parsedError.technicalDetails
    enhancedError.suggestedAction = parsedError.suggestedAction
    enhancedError.originalError = error
    throw enhancedError
  }
}

/**
 * Detect permissions using OpenAI API
 */
async function detectWithOpenAI(
  sourceCode: string,
  apiKey: string,
  modelId: string,
): Promise<AiDetectionResult> {
  const openai = new OpenAI({ apiKey })

  const response = await openai.chat.completions.create({
    model: modelId,
    messages: [
      {
        role: 'system',
        content: AI_DETECTION_PROMPT,
      },
      {
        role: 'user',
        content: sourceCode,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from OpenAI')
  }

  return parseAiResponse(content)
}

/**
 * Detect permissions using Claude API
 */
async function detectWithClaude(
  sourceCode: string,
  apiKey: string,
  modelId: string,
): Promise<AiDetectionResult> {
  const anthropic = new Anthropic({ apiKey })

  const response = await anthropic.messages.create({
    model: modelId,
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `${AI_DETECTION_PROMPT}\n\n${sourceCode}`,
      },
    ],
    temperature: 0.1,
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return parseAiResponse(content.text)
}

/**
 * Parse and validate AI response
 */
function parseAiResponse(responseText: string): AiDetectionResult {
  try {
    // Extract JSON from markdown code blocks if present
    let jsonText = responseText.trim()
    const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      jsonText = jsonMatch[1]?.trim()
    }

    const parsed = JSON.parse(jsonText)

    // Validate structure
    if (!parsed.functions || !Array.isArray(parsed.functions)) {
      throw new Error('Invalid response: missing functions array')
    }

    // Validate each function
    for (const func of parsed.functions) {
      if (!func.functionName || typeof func.functionName !== 'string') {
        throw new Error('Invalid function: missing functionName')
      }
      if (typeof func.isPermissioned !== 'boolean') {
        throw new Error(
          `Invalid isPermissioned for ${func.functionName}: must be a boolean`,
        )
      }

      // Validate ownerDefinitions if present
      if (func.ownerDefinitions) {
        if (!Array.isArray(func.ownerDefinitions)) {
          throw new Error(
            `ownerDefinitions must be an array for ${func.functionName}`,
          )
        }
        for (const def of func.ownerDefinitions) {
          if (!def.path || typeof def.path !== 'string') {
            throw new Error(
              `Invalid ownerDefinition for ${func.functionName}: missing or invalid path`,
            )
          }
        }
      }
    }

    return parsed as AiDetectionResult
  } catch (error) {
    console.error('Failed to parse AI response:', responseText)
    throw new Error(
      `Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Filter source code to reduce tokens for AI analysis
 * Removes abstract contracts, interfaces, imports, and other non-essential content
 * Keeps comments as they help the AI understand the code
 */
export function filterSourceCodeForAI(
  sourceCode: string,
  filename: string,
): string {
  // Skip files that are just interfaces or abstract contracts
  if (filename.startsWith('I') && filename.endsWith('.sol')) {
    // Interface files typically start with 'I' (e.g., IOwnable.sol)
    return ''
  }

  const lines = sourceCode.split('\n')
  const filtered: string[] = []
  let inInterface = false
  let inLibrary = false
  let contractBraceDepth = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!

    // Skip empty lines
    if (!line.trim()) {
      continue
    }

    // Track interfaces and libraries (skip them, but keep abstract contracts
    // since they contain internal functions with msg.sender checks)
    if (line.includes('interface ') && line.includes('{')) {
      inInterface = true
      contractBraceDepth = 0
    }
    if (line.includes('library ') && line.includes('{')) {
      inLibrary = true
      contractBraceDepth = 0
    }

    // Track brace depth for interface/library
    if (inInterface || inLibrary) {
      for (const char of line) {
        if (char === '{') contractBraceDepth++
        if (char === '}') contractBraceDepth--
      }

      // End of interface/library
      if (contractBraceDepth === 0 && line.includes('}')) {
        inInterface = false
        inLibrary = false
      }
      continue
    }

    // Remove import statements (they don't help with permission detection)
    if (line.trim().startsWith('import ')) {
      continue
    }

    // Remove pragma statements (not needed)
    if (line.trim().startsWith('pragma ')) {
      continue
    }

    // Remove SPDX license identifiers
    if (line.includes('SPDX-License-Identifier')) {
      continue
    }

    filtered.push(line)
  }

  return filtered.join('\n')
}

/**
 * Combine source code files into a single string for AI analysis
 * Applies filtering to reduce token usage
 */
export function combineSourceFiles(files: Record<string, string>): string {
  const combined: string[] = []

  for (const [filename, content] of Object.entries(files)) {
    const filtered = filterSourceCodeForAI(content, filename)

    // Skip files that were completely filtered out
    if (!filtered.trim()) {
      console.log(`  Skipping ${filename} (filtered out)`)
      continue
    }

    combined.push(`// File: ${filename}`)
    combined.push(filtered)
    combined.push('\n')
  }

  return combined.join('\n')
}
