/**
 * Shared owner resolution logic for DeFiDisco (backend version)
 *
 * This module provides unified path expression resolution for the backend.
 * Path format: <contractRef>.<valuePath>
 *
 * Note: This is duplicated in both protocolbeat and l2b packages to maintain
 * the minimal integration principle and avoid cross-package dependencies.
 *
 * Examples:
 *   "$self.owner" → owner in current contract
 *   "@governor.signers[0]" → follow governor field, get first signer
 *   "eth:0x123.accessControl.ADMIN.members" → absolute address, get role members
 *   "$self" → current contract itself is the owner
 */

// =============================================================================
// Types
// =============================================================================

export interface ResolvedOwner {
  addresses: string[];
  structuredValue: any;
  error?: string;
}

export interface PathSegment {
  type: "property" | "index";
  value: string | number;
}

/**
 * Abstract interface for contract data access
 * Allows the same resolution logic to work with different data sources
 */
export interface IContractDataAccess {
  /**
   * Find a contract by address
   */
  findContract(address: string): any;

  /**
   * Get a field value from a contract (for @ references)
   * Should return the address string if the field is an address type
   */
  getFieldValue(contract: any, fieldName: string): any;

  /**
   * Convert contract data to a plain values object for navigation
   */
  getValuesObject(contract: any): any;
}

// =============================================================================
// Core Resolution Logic (100% shareable)
// =============================================================================

/**
 * Parses a value path into segments
 * Examples:
 *   "owner" → [{type: 'property', value: 'owner'}]
 *   "signers[0]" → [{type: 'property', value: 'signers'}, {type: 'index', value: 0}]
 *   "accessControl.ADMIN.members" → [{type: 'property', value: 'accessControl'}, ...]
 */
export function parseValuePath(path: string): PathSegment[] {
  const segments: PathSegment[] = [];
  let current = "";
  let i = 0;

  while (i < path.length) {
    const char = path[i]!;

    if (char === ".") {
      // Property separator
      if (current) {
        segments.push({ type: "property", value: current });
        current = "";
      }
      i++;
    } else if (char === "[") {
      // Start of array index
      if (current) {
        segments.push({ type: "property", value: current });
        current = "";
      }

      // Find closing bracket
      const closeIndex = path.indexOf("]", i);
      if (closeIndex === -1) {
        throw new Error(`Unclosed bracket in path: ${path}`);
      }

      const indexStr = path.substring(i + 1, closeIndex);
      const index = parseInt(indexStr, 10);

      if (isNaN(index)) {
        // Not a numeric index, treat as property key (e.g., [eth:0x123] or [ROLE])
        segments.push({ type: "property", value: indexStr });
      } else {
        segments.push({ type: "index", value: index });
      }

      i = closeIndex + 1;
    } else {
      current += char;
      i++;
    }
  }

  // Add final segment
  if (current) {
    segments.push({ type: "property", value: current });
  }

  return segments;
}

/**
 * Extracts address strings from a value (can be string, array, or object)
 * Recursively extracts addresses from nested structures
 */
export function extractAddresses(value: any, path: string): string[] {
  // Single string address
  if (typeof value === "string" && value.startsWith("eth:")) {
    return [value];
  }

  // Array - recursively extract from elements
  if (Array.isArray(value)) {
    const addresses: string[] = [];
    for (const element of value) {
      if (typeof element === "string" && element.startsWith("eth:")) {
        addresses.push(element);
      } else if (typeof element === "object" && element !== null) {
        // Recursively extract from object elements
        addresses.push(...extractAddresses(element, path));
      }
    }
    if (addresses.length > 0) {
      return addresses;
    }
  }

  // Object - recursively extract addresses from all properties
  if (typeof value === "object" && value !== null) {
    const addresses: string[] = [];
    for (const key in value) {
      const prop = value[key];
      if (typeof prop === "string" && prop.startsWith("eth:")) {
        addresses.push(prop);
      } else if (typeof prop === "object" && prop !== null) {
        // Recursively extract from nested objects/arrays
        addresses.push(...extractAddresses(prop, path));
      }
    }
    if (addresses.length > 0) {
      return addresses;
    }
  }

  throw new Error(`Value at path "${path}" does not contain any addresses`);
}

/**
 * Navigates a value path in contract data and returns the resolved value
 * Supports JSONPath-like navigation:
 * - Simple fields: "owner"
 * - Nested objects: "accessControl.DEFAULT_ADMIN_ROLE.members"
 * - Array indices: "signers[0]"
 * - Dynamic keys: "permissions[eth:0x123][0xROLE].entities"
 *
 * Returns: { addresses: string[], structuredValue: any }
 */
export function navigateValuePath(
  dataAccess: IContractDataAccess,
  contract: any,
  valuePath: string
): { addresses: string[]; structuredValue: any } {
  const valuesObject = dataAccess.getValuesObject(contract);

  if (!valuesObject || typeof valuesObject !== "object") {
    throw new Error("Contract has no values");
  }

  // Parse and navigate the path
  let currentValue: any = valuesObject;
  const segments = parseValuePath(valuePath);

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]!;

    if (segment.type === "property") {
      // Navigate object property
      if (typeof currentValue !== "object" || currentValue === null) {
        throw new Error(
          `Cannot access property "${segment.value}" on non-object at path segment ${i}`
        );
      }
      currentValue = currentValue[segment.value];
      if (currentValue === undefined) {
        const available = Object.keys(currentValue || {})
          .slice(0, 5)
          .join(", ");
        throw new Error(
          `Property "${segment.value}" not found. Available: ${available}`
        );
      }
    } else if (segment.type === "index") {
      // Navigate array index
      if (!Array.isArray(currentValue)) {
        throw new Error(`Cannot index non-array at path segment ${i}`);
      }
      const index = segment.value as number;
      if (index >= currentValue.length) {
        throw new Error(
          `Index ${index} out of bounds (length: ${currentValue.length})`
        );
      }
      currentValue = currentValue[index];
    }
  }

  // Validate that the value contains addresses and extract them
  const addresses = extractAddresses(currentValue, valuePath);

  // Return both the extracted addresses and the structured value
  return {
    addresses,
    structuredValue: currentValue,
  };
}

/**
 * Resolves a path expression to owner data (addresses + structured value)
 *
 * Path format: <contractRef>.<valuePath>
 * - $self: current contract
 * - @fieldName: follow address field in current contract
 * - eth:0xAddress: absolute contract address
 *
 * Returns: { addresses: string[], structuredValue: any, error?: string }
 */
export function resolvePathExpression(
  dataAccess: IContractDataAccess,
  currentContractAddress: string,
  pathExpression: string
): ResolvedOwner {
  try {
    // Special case: just "$self" means current contract is the owner
    if (pathExpression === "$self") {
      return {
        addresses: [currentContractAddress],
        structuredValue: currentContractAddress,
      };
    }

    // Split on first dot to separate contract ref from value path
    const firstDotIndex = pathExpression.indexOf(".");

    if (firstDotIndex === -1) {
      throw new Error(
        `Invalid path expression "${pathExpression}": must include contract reference and value path`
      );
    }

    const contractRef = pathExpression.substring(0, firstDotIndex);
    const valuePath = pathExpression.substring(firstDotIndex + 1);

    // Resolve contract reference to actual contract address
    let targetContractAddress: string;

    if (contractRef === "$self") {
      // Current contract
      targetContractAddress = currentContractAddress;
    } else if (contractRef.startsWith("@")) {
      // Follow an address field in current contract
      const fieldName = contractRef.substring(1); // Remove @ prefix
      const currentContract = dataAccess.findContract(currentContractAddress);

      if (!currentContract) {
        throw new Error("Current contract not found");
      }

      targetContractAddress = dataAccess.getFieldValue(
        currentContract,
        fieldName
      );

      if (
        !targetContractAddress ||
        typeof targetContractAddress !== "string" ||
        !targetContractAddress.startsWith("eth:")
      ) {
        throw new Error(
          `Field "${fieldName}" not found or is not an address in current contract`
        );
      }
    } else if (contractRef.startsWith("eth:")) {
      // Absolute contract address
      targetContractAddress = contractRef;
    } else {
      throw new Error(
        `Invalid contract reference "${contractRef}": must be $self, @fieldName, or eth:0xAddress`
      );
    }

    // Find target contract
    const targetContract = dataAccess.findContract(targetContractAddress);

    if (!targetContract) {
      throw new Error(`Contract ${targetContractAddress} not found`);
    }

    // Navigate value path in contract data
    return navigateValuePath(dataAccess, targetContract, valuePath);
  } catch (error) {
    return {
      addresses: [],
      structuredValue: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =============================================================================
// Backend Data Access Implementation (for discovered.json format)
// =============================================================================

/**
 * Data access implementation for backend (works with discovered.json format)
 */
export class DiscoveredDataAccess implements IContractDataAccess {
  constructor(private discovered: any) {}

  findContract(address: string): any {
    if (!this.discovered.entries || !Array.isArray(this.discovered.entries)) {
      throw new Error("No entries found in discovered data");
    }

    const contract = this.discovered.entries.find(
      (entry: any) => entry.type === "Contract" && entry.address === address
    );

    if (!contract) {
      const available = this.discovered.entries
        .filter((e: any) => e.type === "Contract")
        .map((e: any) => e.address)
        .slice(0, 5)
        .join(", ");
      throw new Error(
        `Contract ${address} not found. Available: ${available}...`
      );
    }

    return contract;
  }

  getFieldValue(contract: any, fieldName: string): any {
    if (!contract.values || typeof contract.values !== "object") {
      throw new Error("Contract has no values");
    }

    const value = contract.values[fieldName];

    if (value === undefined) {
      throw new Error(`Field ${fieldName} not found in contract values`);
    }

    // Handle string addresses (most common case)
    if (typeof value === "string" && value.startsWith("eth:")) {
      return value;
    }

    // Handle complex field value objects
    if (typeof value === "object" && value.type === "address") {
      return value.address;
    }

    return value;
  }

  getValuesObject(contract: any): any {
    if (!contract.values || typeof contract.values !== "object") {
      throw new Error("Contract has no values");
    }
    return contract.values;
  }
}
