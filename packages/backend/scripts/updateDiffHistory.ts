/*
  This file is a quick prototype and will be refactored if it's proven useful.

  Do not INCLUDE this file - it immediately runs `updateDiffHistoryFile()`
*/

import { execSync, exec } from 'child_process';
import { existsSync, readFileSync, statSync, writeFileSync, promises as fs } from 'fs';
import {
  ConfigReader,
  type DiscoveryDiff,
  diffDiscovery,
  discover,
  discoveryDiffToMarkdown,
  getChainConfig,
} from '@l2beat/discovery';
import type { DiscoveryOutput } from '@l2beat/discovery-types';
import { assert } from '@l2beat/shared-pure';
import { rimraf } from 'rimraf';

import { updateDiffHistoryHash } from '../src/modules/update-monitor/utils/hashing';

const FIRST_SECTION_PREFIX = '# Diff at';

async function readFileSafe(path: string): Promise<string> {
  try {
    return await fs.readFile(path, 'utf-8');
  } catch {
    return '';
  }
}

async function execGitCommand(command: string): Promise<string> {
  try {
    const { stdout } = await exec(command, { stdio: 'pipe' });
    return stdout.toString().trim();
  } catch {
    return '';
  }
}

function fileExists(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

async function getDiscoveryData(projectName: string, chain: string): Promise<DiscoveryOutput> {
  const configReader = new ConfigReader();
  return configReader.readDiscovery(projectName, chain);
}

async function compareDiscoveries(
  discoveryFromMainBranch: DiscoveryOutput | undefined,
  curDiscovery: DiscoveryOutput,
): Promise<{ diff: DiscoveryDiff[]; configRelatedDiff: DiscoveryDiff[] }> {
  let diff: DiscoveryDiff[] = [];
  let configRelatedDiff: DiscoveryDiff[] = [];

  if ((discoveryFromMainBranch?.blockNumber ?? 0) < curDiscovery.blockNumber) {
    const rerun = await performDiscoveryOnPreviousBlock(
      discoveryFromMainBranch,
      curDiscovery.projectName,
      curDiscovery.chain,
      process.argv.includes('--save-sources'),
      false,
    );
    diff = diffDiscovery(rerun.prevDiscovery?.contracts ?? [], curDiscovery.contracts);
    configRelatedDiff = diffDiscovery(discoveryFromMainBranch?.contracts ?? [], rerun.prevDiscovery?.contracts ?? []);
  } else {
    configRelatedDiff = diffDiscovery(discoveryFromMainBranch?.contracts ?? [], curDiscovery.contracts);
  }

  return { diff, configRelatedDiff };
}

async function generateDiffHistory(
  discoveryFromMainBranch: DiscoveryOutput | undefined,
  curDiscovery: DiscoveryOutput,
  diff: DiscoveryDiff[],
  configRelatedDiff: DiscoveryDiff[],
  mainBranchHash: string,
  codeDiff?: string,
  description?: string,
): Promise<string> {
  const result = [];
  const mainBranch = await getMainBranchName();

  const now = new Date().toUTCString();
  result.push(`${FIRST_SECTION_PREFIX} ${now}:`);
  result.push('');
  const { name, email } = await getGitUser();
  result.push(`- author: ${name} (<${email}>)`);
  if (discoveryFromMainBranch?.blockNumber !== undefined) {
    result.push(
      `- comparing to: ${mainBranch}@${mainBranchHash} block: ${discoveryFromMainBranch.blockNumber}`,
    );
  }
  result.push(`- current block number: ${curDiscovery.blockNumber}`);
  result.push('');
  result.push('## Description');
  if (description) {
    result.push('');
    result.push(description.trim());
    result.push('');
  } else {
    result.push('');
    if ((discoveryFromMainBranch?.blockNumber ?? 0) !== curDiscovery.blockNumber) {
      result.push(
        'Provide description of changes. This section will be preserved.',
      );
    } else {
      result.push(
        'Discovery rerun on the same block number with only config-related changes.',
      );
    }
    result.push('');
  }

  if (diff.length > 0) {
    if (discoveryFromMainBranch?.blockNumber === undefined) {
      result.push('## Initial discovery');
    } else {
      result.push('## Watched changes');
    }
    result.push('');
    result.push(discoveryDiffToMarkdown(diff));
    result.push('');
  }

  if (codeDiff !== undefined) {
    result.push('## Source code changes');
    result.push('');
    result.push('```diff');
    result.push(codeDiff);
    result.push('```');
    result.push('');
  }

  if (configRelatedDiff.length > 0) {
    assert(discoveryFromMainBranch?.blockNumber !== undefined);
    result.push('## Config/verification related changes');
    result.push('');
    result.push(
      `Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block ${discoveryFromMainBranch.blockNumber} (main branch discovery), not current.`,
    );
    result.push('');
    result.push(discoveryDiffToMarkdown(configRelatedDiff));
    result.push('');
  }

  return result.join('\n');
}

async function updateDiffHistory(
  projectName: string,
  chain: string,
  description?: string,
  overwriteCache: boolean = false,
) {
  console.log(`Project: ${projectName}`);
  const curDiscovery = await getDiscoveryData(projectName, chain);
  const discoveryFolder = `./discovery/${projectName}/${chain}`;
  const { content: discoveryJsonFromMainBranch, mainBranchHash } = await getFileVersionOnMainBranch(`${discoveryFolder}/discovered.json`);
  const discoveryFromMainBranch = discoveryJsonFromMainBranch === '' ? undefined : (JSON.parse(discoveryJsonFromMainBranch) as DiscoveryOutput);

  const { diff, configRelatedDiff } = await compareDiscoveries(discoveryFromMainBranch, curDiscovery);

  const diffHistoryPath = `${discoveryFolder}/diffHistory.md`;
  const { content: historyFileFromMainBranch } = await getFileVersionOnMainBranch(diffHistoryPath);

  let previousDescription = undefined;
  if (fileExists(diffHistoryPath)) {
    const diskDiffHistory = await readFileSafe(diffHistoryPath);
    previousDescription = findDescription(diskDiffHistory, historyFileFromMainBranch);
  }

  const anyDiffs = diff.length > 0 || configRelatedDiff.length > 0;
  if (!fileExists(diffHistoryPath) || anyDiffs) {
    const newHistoryEntry = await generateDiffHistory(
      discoveryFromMainBranch,
      curDiscovery,
      diff,
      configRelatedDiff,
      mainBranchHash,
      undefined,
      description ?? previousDescription,
    );

    const diffHistory = historyFileFromMainBranch === '' ? newHistoryEntry : newHistoryEntry.concat('\n' + historyFileFromMainBranch);
    await fs.writeFile(diffHistoryPath, diffHistory);
  } else {
    console.log('No changes found.');
    await revertDiffHistory(diffHistoryPath, historyFileFromMainBranch);
  }

  await updateDiffHistoryHash(diffHistoryPath, projectName, chain);
}
