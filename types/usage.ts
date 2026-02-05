export interface UsageData {
  credits_total: number;
  credits_used: number;
  requests_count: number;
  models_usage: ModelUsage[];
}

export interface ModelUsage {
  model: string;
  requests: number;
  cost: number;
}

export interface OpenRouterUsageResponse {
  data: {
    label: string;
    usage: number;
  }[];
}
