/**
 * Owner resolution logic for DeFiDisco permission monitoring (backend version)
 *
 * This is a lightweight copy of resolution logic adapted for backend use.
 * Maintains the minimal integration principle by keeping DeFiDisco code separate.
 */

import type { DiscoveryOutput } from "@l2beat/discovery";

export interface ResolvedOwner {
  addresses: string[];
  error?: string;
}

/**
 * Data access for discovered.json format
 */
export class DiscoveredDataAccess {
  constructor(private discovered: DiscoveryOutput) {}

  findContract(address: string): any {
    const contract = this.discovered.entries.find(
      (entry) => entry.type === "Contract" && entry.address === address
    );
    if (!contract) {
      throw new Error(`Contract ${address} not found`);
    }
    return contract;
  }

  getFieldValue(contract: any, fieldName: string): any {
    const value = contract.values?.[fieldName];
    if (value === undefined) {
      throw new Error(`Field ${fieldName} not found`);
    }
    if (typeof value === "string" && value.startsWith("eth:")) {
      return value;
    }
    if (typeof value === "object" && value.type === "address") {
      return value.address;
    }
    return value;
  }

  getValuesObject(contract: any): any {
    return contract.values || {};
  }
}

/**
 * Resolves a path expression to owner addresses
 */
export function resolvePathExpression(
  dataAccess: DiscoveredDataAccess,
  currentContractAddress: string,
  pathExpression: string
): ResolvedOwner {
  try {
    if (pathExpression === "$self") {
      return { addresses: [currentContractAddress] };
    }

    const firstDotIndex = pathExpression.indexOf(".");
    if (firstDotIndex === -1) {
      throw new Error("Invalid path: must include value path");
    }

    const contractRef = pathExpression.substring(0, firstDotIndex);
    const valuePath = pathExpression.substring(firstDotIndex + 1);

    let targetContractAddress: string;
    if (contractRef === "$self") {
      targetContractAddress = currentContractAddress;
    } else if (contractRef.startsWith("@")) {
      const fieldName = contractRef.substring(1);
      const currentContract = dataAccess.findContract(currentContractAddress);
      targetContractAddress = dataAccess.getFieldValue(
        currentContract,
        fieldName
      );
      if (!targetContractAddress?.startsWith("eth:")) {
        throw new Error(`Field "${fieldName}" is not an address`);
      }
    } else if (contractRef.startsWith("eth:")) {
      targetContractAddress = contractRef;
    } else {
      throw new Error(`Invalid contract reference: ${contractRef}`);
    }

    const targetContract = dataAccess.findContract(targetContractAddress);
    const result = navigateValuePath(dataAccess, targetContract, valuePath);
    return { addresses: result };
  } catch (error) {
    return {
      addresses: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function navigateValuePath(
  dataAccess: DiscoveredDataAccess,
  contract: any,
  valuePath: string
): string[] {
  const valuesObject = dataAccess.getValuesObject(contract);
  let currentValue: any = valuesObject;

  const segments = parseValuePath(valuePath);
  for (const segment of segments) {
    if (segment.type === "property") {
      currentValue = currentValue?.[segment.value];
      if (currentValue === undefined) {
        throw new Error(`Property "${segment.value}" not found`);
      }
    } else {
      if (!Array.isArray(currentValue)) {
        throw new Error("Cannot index non-array");
      }
      currentValue = currentValue[segment.value as number];
    }
  }

  return extractAddresses(currentValue, valuePath);
}

function parseValuePath(
  path: string
): Array<{ type: "property" | "index"; value: string | number }> {
  const segments: Array<{
    type: "property" | "index";
    value: string | number;
  }> = [];
  let current = "";
  let i = 0;

  while (i < path.length) {
    const char = path[i]!;
    if (char === ".") {
      if (current) {
        segments.push({ type: "property", value: current });
        current = "";
      }
      i++;
    } else if (char === "[") {
      if (current) {
        segments.push({ type: "property", value: current });
        current = "";
      }
      const closeIndex = path.indexOf("]", i);
      if (closeIndex === -1) throw new Error("Unclosed bracket");
      const indexStr = path.substring(i + 1, closeIndex);
      const index = parseInt(indexStr, 10);
      segments.push({
        type: isNaN(index) ? "property" : "index",
        value: isNaN(index) ? indexStr : index,
      });
      i = closeIndex + 1;
    } else {
      current += char;
      i++;
    }
  }
  if (current) {
    segments.push({ type: "property", value: current });
  }
  return segments;
}

function extractAddresses(value: any, path: string): string[] {
  if (typeof value === "string" && value.startsWith("eth:")) {
    return [value];
  }
  if (Array.isArray(value)) {
    const addresses: string[] = [];
    for (const element of value) {
      if (typeof element === "string" && element.startsWith("eth:")) {
        addresses.push(element);
      } else if (typeof element === "object" && element !== null) {
        addresses.push(...extractAddresses(element, path));
      }
    }
    if (addresses.length > 0) return addresses;
  }
  if (typeof value === "object" && value !== null) {
    const addresses: string[] = [];
    for (const key in value) {
      const prop = value[key];
      if (typeof prop === "string" && prop.startsWith("eth:")) {
        addresses.push(prop);
      } else if (typeof prop === "object" && prop !== null) {
        addresses.push(...extractAddresses(prop, path));
      }
    }
    if (addresses.length > 0) return addresses;
  }
  throw new Error(`No addresses found at path "${path}"`);
}
