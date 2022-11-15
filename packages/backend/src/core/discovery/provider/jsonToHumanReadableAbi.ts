import { utils } from 'ethers';
import { FormatTypes } from 'ethers/lib/utils';

export function jsonToHumanReadableAbi(json: string) {
  try {
    return new utils.Interface(JSON.parse(json)).format(
      FormatTypes.full
    ) as string[];
  } catch {
    return [];
  }
}
