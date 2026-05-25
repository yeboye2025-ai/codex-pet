"use client";

import { useEffect, useState } from "react";
import { testArkConnection } from "@/lib/ark/client";
import {
  applyApiConfigDefaults,
  isArkConfig,
  isDeepSeekConfig,
  readApiConfig,
  saveApiConfig,
  type ApiConfig
} from "@/lib/storage/api-config";
import { testGeminiBrowserConnection } from "@/lib/gemini/browser-client";

const emptyConfig: ApiConfig = {
  apiUrl: "",
  apiKey: "",
  model: ""
};

export function ApiConfigButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ApiConfig>(emptyConfig);
  const [isSaved, setIsSaved] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [testSucceeded, setTestSucceeded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nextConfig = readApiConfig(window.localStorage);
    setConfig(nextConfig);
    setHasConfig(Boolean(nextConfig.apiUrl && nextConfig.apiKey && nextConfig.model));
  }, []);

  function handleSave() {
    const nextConfig = applyApiConfigDefaults(config);

    saveApiConfig(window.localStorage, nextConfig);
    setConfig(nextConfig);
    setHasConfig(Boolean(nextConfig.apiUrl && nextConfig.apiKey && nextConfig.model));
    setIsSaved(true);
    setIsOpen(false);
    window.setTimeout(() => setIsSaved(false), 2200);
  }

  async function handleTest() {
    setIsTesting(true);
    setTestMessage(null);
    setTestSucceeded(false);

    try {
      if (isDeepSeekConfig(config)) {
        throw new Error(
          "DeepSeek can answer text, but this app needs image analysis. Please use an image-capable model provider."
        );
      }

      if (isArkConfig(config)) {
        await testArkConnection({
          apiUrl: config.apiUrl.trim(),
          apiKey: config.apiKey.trim(),
          model: config.model.trim() || "doubao-seed-2-0-pro-260215"
        });

        setTestSucceeded(true);
        setTestMessage("Ark image analysis endpoint is reachable.");
        return;
      }

      if (config.apiKey.trim().startsWith("AIza")) {
        await testGeminiBrowserConnection({
          apiKey: config.apiKey.trim(),
          model: config.model.trim() || "gemini-2.5-flash"
        });

        setTestSucceeded(true);
        setTestMessage("Your browser can reach Gemini.");
        return;
      }

      const response = await fetch("/api/test-config", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          apiUrl: config.apiUrl.trim(),
          apiKey: config.apiKey.trim(),
          model: config.model.trim()
        })
      });

      const body = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(body?.message || "Unable to connect.");
      }

      setTestSucceeded(true);
      setTestMessage("Connection looks good.");
    } catch (error) {
      setTestSucceeded(false);
      setTestMessage(
        error instanceof Error ? error.message : "Unable to connect."
      );
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full border border-white/80 bg-white/82 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-stone-600 transition hover:-translate-y-0.5 hover:text-stone-950"
      >
        {hasConfig ? "API Ready" : "API Config"}
      </button>

      {isSaved ? (
        <div className="fixed right-5 top-20 z-[60] rounded-full border border-white/85 bg-white/88 px-4 py-2 text-sm font-medium text-stone-700 shadow-[0_18px_40px_rgba(87,63,43,0.12)] backdrop-blur-xl">
          API config saved
        </div>
      ) : null}

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,17,17,0.14)] px-4 backdrop-blur-sm">
          <div className="glass-card-strong w-full max-w-md rounded-[30px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  API Config
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-stone-950">
                  Bring your own model settings
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/84 px-3 py-1 text-sm text-stone-500 transition hover:text-stone-900"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-stone-700">
                  API URL
                </span>
                <input
                  value={config.apiUrl}
                  onChange={(event) =>
                    setConfig((current) => ({
                      ...current,
                      apiUrl: event.target.value
                    }))
                  }
                  placeholder="https://your-api.example.com/v1"
                  className="w-full rounded-[18px] border border-white/80 bg-white/82 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-stone-700">
                  API Key
                </span>
                <input
                  value={config.apiKey}
                  onChange={(event) =>
                    setConfig((current) => ({
                      ...current,
                      apiKey: event.target.value
                    }))
                  }
                  placeholder="sk-..."
                  className="w-full rounded-[18px] border border-white/80 bg-white/82 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-stone-700">
                  Model Name
                </span>
                <input
                  value={config.model}
                  onChange={(event) =>
                    setConfig((current) => ({
                      ...current,
                      model: event.target.value
                    }))
                  }
                  placeholder="gpt-4.1-mini"
                  className="w-full rounded-[18px] border border-white/80 bg-white/82 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400"
                />
              </label>
              {config.apiKey.trim().startsWith("AIza") ? (
                <div className="rounded-[18px] bg-[#f6efe9] px-4 py-3 text-sm leading-6 text-stone-600">
                  Gemini key detected. We&apos;ll auto-fill the Google
                  OpenAI-compatible endpoint and a default Gemini model if those
                  fields are left empty.
                </div>
              ) : null}
              {isDeepSeekConfig(config) ? (
                <div className="rounded-[18px] bg-[#f8f1ec] px-4 py-3 text-sm leading-6 text-stone-600">
                  DeepSeek is currently fine for text responses, but Pet Whisper
                  needs image-capable analysis for dog photos.
                </div>
              ) : null}
              {isArkConfig(config) ? (
                <div className="rounded-[18px] bg-[#f3efe8] px-4 py-3 text-sm leading-6 text-stone-600">
                  Ark / Doubao detected. We&apos;ll use the Responses API image
                  analysis flow for uploaded dog photos.
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm text-stone-500">
                  Stored only in this browser.
                </p>
                {testMessage ? (
                  <p
                    className={`text-sm ${
                      testSucceeded ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {testMessage}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={isTesting}
                  className="rounded-full border border-white/80 bg-white/82 px-4 py-3 text-sm font-medium text-stone-700 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isTesting ? "Testing..." : "Test API"}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
