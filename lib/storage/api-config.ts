export const API_CONFIG_KEYS = {
  url: "petwhisper_api_url",
  key: "petwhisper_api_key",
  model: "petwhisper_model"
} as const;

export type ApiConfig = {
  apiUrl: string;
  apiKey: string;
  model: string;
};

const GEMINI_DEFAULTS = {
  apiUrl: "https://generativelanguage.googleapis.com/v1beta/openai/",
  model: "gemini-2.5-flash"
} as const;

const ARK_DEFAULTS = {
  apiUrl: "https://ark.cn-beijing.volces.com/api/v3/responses",
  model: "doubao-seed-2-0-pro-260215"
} as const;

function isGeminiKey(apiKey: string) {
  return apiKey.trim().startsWith("AIza");
}

function isArkKey(apiKey: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    apiKey.trim()
  );
}

export function isDeepSeekConfig(config: ApiConfig) {
  const apiUrl = config.apiUrl.trim().toLowerCase();
  const model = config.model.trim().toLowerCase();

  return apiUrl.includes("api.deepseek.com") || model.startsWith("deepseek-");
}

export function isArkConfig(config: ApiConfig) {
  const apiUrl = config.apiUrl.trim().toLowerCase();
  const model = config.model.trim().toLowerCase();

  return (
    apiUrl.includes("ark.cn-beijing.volces.com") || model.startsWith("doubao-")
  );
}

export function applyApiConfigDefaults(config: ApiConfig): ApiConfig {
  const apiKey = config.apiKey.trim();
  const apiUrl = config.apiUrl.trim();
  const model = config.model.trim();

  if (isGeminiKey(apiKey)) {
    return {
      apiKey,
      apiUrl: apiUrl || GEMINI_DEFAULTS.apiUrl,
      model: model || GEMINI_DEFAULTS.model
    };
  }

  if (isArkKey(apiKey) || isArkConfig({ apiUrl, apiKey, model })) {
    return {
      apiKey,
      apiUrl: apiUrl || ARK_DEFAULTS.apiUrl,
      model: model || ARK_DEFAULTS.model
    };
  }

  return {
    apiKey,
    apiUrl,
    model
  };
}

export function readApiConfig(storage: Storage): ApiConfig {
  return applyApiConfigDefaults({
    apiUrl: storage.getItem(API_CONFIG_KEYS.url) ?? "",
    apiKey: storage.getItem(API_CONFIG_KEYS.key) ?? "",
    model: storage.getItem(API_CONFIG_KEYS.model) ?? ""
  });
}

export function saveApiConfig(storage: Storage, config: ApiConfig) {
  const resolved = applyApiConfigDefaults(config);
  storage.setItem(API_CONFIG_KEYS.url, resolved.apiUrl);
  storage.setItem(API_CONFIG_KEYS.key, resolved.apiKey);
  storage.setItem(API_CONFIG_KEYS.model, resolved.model);
}
