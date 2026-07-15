export interface IAgent {
  run(prompt: string): Promise<string>
}
