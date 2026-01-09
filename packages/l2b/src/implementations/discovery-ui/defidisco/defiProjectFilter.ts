import { readFileSync } from "fs";
import { join } from "path";

interface DeFiDiscoConfig {
  version: string;
  description: string;
  defiProjects: string[];
  lastUpdated: string;
}

let cachedConfig: DeFiDiscoConfig | null = null;

function loadDeFiDiscoConfig(): DeFiDiscoConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const configPath = join(
      __dirname,
      "../../../../../config/src/defidisco-config.json"
    );
    const configContent = readFileSync(configPath, "utf-8");
    cachedConfig = JSON.parse(configContent);
    return cachedConfig!;
  } catch (error) {
    console.warn(
      "Failed to load DeFiDisco config, falling back to all projects:",
      error
    );
    // Fallback to allow all projects if config fails to load
    return {
      version: "1.0",
      description: "Fallback config",
      defiProjects: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

export function getDefiProjects(): string[] {
  const config = loadDeFiDiscoConfig();
  return config.defiProjects;
}

export function isDefiProject(projectId: string): boolean {
  const defiProjects = getDefiProjects();
  return defiProjects.length === 0 || defiProjects.includes(projectId);
}

export function filterDefiProjects<T extends { id?: string; name?: string }>(
  projects: T[],
  projectKey: keyof T = "id" as keyof T
): T[] {
  const defiProjects = getDefiProjects();

  // If no DeFi projects configured, return all projects (fallback behavior)
  if (defiProjects.length === 0) {
    return projects;
  }

  return projects.filter((project) => {
    const projectId = project[projectKey] as string;
    return projectId && defiProjects.includes(projectId);
  });
}
