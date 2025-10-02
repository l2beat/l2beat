import type { OwnerDefinition } from './types'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export interface AiDetectedPermission {
  functionName: string
  aiClassification: 'permissioned' | 'non-permissioned'
  ownerDefinitions?: OwnerDefinition[]
  sourceFile?: string  // Which source file this function was found in
}

export interface AiDetectionResult {
  functions: AiDetectedPermission[]
}

const AI_DETECTION_PROMPT = `You are a smart contract security analyzer. Analyze the provided Solidity source code and identify all state-changing (write) functions.

For each write function, determine:
1. Whether it is PERMISSIONED (has access control like onlyOwner, onlyAdmin, onlyRole, etc.) or NON-PERMISSIONED (anyone can call it)
2. If permissioned, identify the owner/admin address fields that control access

IMPORTANT RULES:
- Only include EXTERNAL functions that change state (exclude view/pure/internal functions)
- For ownerDefinitions, there are 4 main cases:
  - the permission owner is a field in the current contract: provide sourceField = field name ("owner", "admin"), and dataPath = "$self"
  - the permission owner is a role in the current contract: provide sourceField = "accessControl", dataPath = name of the role (eg. "PAUSER_ROLE", "DEFAULT_ADMIN_ROLE")
  - the permission owner is a role in an external access control contract: provide sourceField = field containing the address of the access control contract, datapath = name of the role
  - the permission owner is a field in an external contract: provide sourceField = field containing the address of the external contract, datapath= field name in that contract containing the permission owner.
- Multiple ownerDefinitions can be provided for functions with multiple access control mechanisms

Response MUST be valid JSON matching this schema:
{
  "functions": [
    {
      "functionName": "string",
      "aiClassification": "permissioned" | "non-permissioned",
      "sourceFile": "string (the exact filename where this function is defined)",
      "ownerDefinitions": [
        {
          "sourceField": "string",
          "dataPath": "string"
        }
      ]
    }
  ]
}

Examples:
1. Function with onlyOwner modifier in source file MyContract.p.sol:
   {
     "functionName": "pause",
     "aiClassification": "permissioned",
     "sourceFile": "MyContract.p.sol",
     "ownerDefinitions": [{"sourceField": "owner", "dataPath": "$self"}]
   }

2. Function with AccessControl in the SAME contract implementing access control (MyContract.sol):
   {
     "functionName": "mint",
     "aiClassification": "permissioned",
     "sourceFile": "MyContract.sol",
     "ownerDefinitions": [{"sourceField": "accessControl", "dataPath": "MINTER_ROLE"}]
   }

3. Function with AccessControl using an external access control contract:
   {
     "functionName": "mint",
     "aiClassification": "permissioned",
     "sourceFile": "MyContract.sol",
     "ownerDefinitions": [{"sourceField": "ACLContract", "dataPath": "DEFAULT_ADMIN_ROLE"}]
   }

4. Unprotected function in MyContract.sol:
   {
     "functionName": "deposit",
     "aiClassification": "non-permissioned",
     "sourceFile": "MyContract.sol"
   }

Now analyze the following contract source code:`

/**
 * Calls AI API to detect permissioned functions in contract source code
 */
export async function detectPermissionsWithAI(
  sourceCode: string,
  apiKey: string,
  provider: 'openai' | 'claude' = 'openai'
): Promise<AiDetectionResult> {
  if (provider === 'openai') {
    return detectWithOpenAI(sourceCode, apiKey)
  } else {
    return detectWithClaude(sourceCode, apiKey)
  }
}

/**
 * Detect permissions using OpenAI API
 */
async function detectWithOpenAI(
  sourceCode: string,
  apiKey: string
): Promise<AiDetectionResult> {
  const openai = new OpenAI({ apiKey })

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: AI_DETECTION_PROMPT
      },
      {
        role: 'user',
        content: sourceCode
      }
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
  apiKey: string
): Promise<AiDetectionResult> {
  const anthropic = new Anthropic({ apiKey })

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `${AI_DETECTION_PROMPT}\n\n${sourceCode}`
      }
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
      jsonText = jsonMatch[1]!.trim()
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
      if (!func.aiClassification ||
          (func.aiClassification !== 'permissioned' && func.aiClassification !== 'non-permissioned')) {
        throw new Error(`Invalid aiClassification for ${func.functionName}`)
      }

      // Validate ownerDefinitions if present
      if (func.ownerDefinitions) {
        if (!Array.isArray(func.ownerDefinitions)) {
          throw new Error(`ownerDefinitions must be an array for ${func.functionName}`)
        }
        for (const def of func.ownerDefinitions) {
          if (!def.sourceField || !def.dataPath) {
            throw new Error(`Invalid ownerDefinition for ${func.functionName}`)
          }
        }
      }
    }

    return parsed as AiDetectionResult
  } catch (error) {
    console.error('Failed to parse AI response:', responseText)
    throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Combine source code files into a single string for AI analysis
 */
export function combineSourceFiles(files: Record<string, string>): string {
  const combined: string[] = []

  for (const [filename, content] of Object.entries(files)) {
    combined.push(`// File: ${filename}`)
    combined.push(content)
    combined.push('\n')
  }

  return combined.join('\n')
}
