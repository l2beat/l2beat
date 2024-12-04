export interface L2BEATResponse {
  success: boolean;
  data: {
    projects: Record<string, { id: string }>;
  };
}
