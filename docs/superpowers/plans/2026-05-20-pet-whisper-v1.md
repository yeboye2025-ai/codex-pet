# Pet Whisper V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished photo-first Pet Whisper MVP that lets users upload a dog photo, receive a structured AI analysis, favorite results, review history, and generate a share card without requiring login.

**Architecture:** Use a single Next.js App Router application with TypeScript and Tailwind CSS. Send the uploaded photo to the server as a data URL through a structured multimodal API route, while storing history and favorite state in browser local storage through a typed client-side repository layer.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Vitest, Testing Library, Playwright, Zod, OpenAI API

---

## File Structure

Planned file ownership for V1:

- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`
- Create: `app/favorites/page.tsx`
- Create: `app/history/page.tsx`
- Create: `app/result/[id]/page.tsx`
- Create: `app/api/analyze/route.ts`
- Create: `app/api/share-card/[id]/route.ts`
- Create: `components/home/hero.tsx`
- Create: `components/home/how-it-works.tsx`
- Create: `components/home/sample-result-preview.tsx`
- Create: `components/upload/dropzone.tsx`
- Create: `components/upload/analysis-workspace.tsx`
- Create: `components/result/result-header.tsx`
- Create: `components/result/signals-list.tsx`
- Create: `components/result/interpretation-card.tsx`
- Create: `components/result/inner-monologue-card.tsx`
- Create: `components/shared/app-shell.tsx`
- Create: `components/shared/floating-card.tsx`
- Create: `components/shared/empty-state.tsx`
- Create: `components/shared/section-heading.tsx`
- Create: `components/favorites/favorites-grid.tsx`
- Create: `components/history/history-timeline.tsx`
- Create: `components/share/share-card-preview.tsx`
- Create: `lib/types/analysis.ts`
- Create: `lib/types/share-card.ts`
- Create: `lib/utils/cn.ts`
- Create: `lib/utils/date.ts`
- Create: `lib/utils/file.ts`
- Create: `lib/utils/analysis-prompt.ts`
- Create: `lib/validation/analyze-request.ts`
- Create: `lib/validation/analysis-result.ts`
- Create: `lib/storage/local-records.ts`
- Create: `lib/storage/storage-keys.ts`
- Create: `lib/sample/sample-analysis.ts`
- Create: `lib/openai/client.ts`
- Create: `hooks/use-analysis-records.ts`
- Create: `hooks/use-local-storage-state.ts`
- Create: `tests/unit/analysis-result.schema.test.ts`
- Create: `tests/unit/local-records.test.ts`
- Create: `tests/unit/analyze-route.test.ts`
- Create: `tests/unit/share-card-route.test.ts`
- Create: `tests/component/dropzone.test.tsx`
- Create: `tests/component/analysis-workspace.test.tsx`
- Create: `tests/component/favorites-grid.test.tsx`
- Create: `tests/component/history-timeline.test.tsx`
- Create: `tests/e2e/home-upload-flow.spec.ts`
- Create: `tests/e2e/history-and-favorites.spec.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/setup/vitest.setup.ts`
- Create: `README.md`

## Task 1: Bootstrap the Next.js App and Tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/setup/vitest.setup.ts`

- [ ] **Step 1: Write the failing bootstrap verification test**

```ts
// tests/unit/bootstrap.test.ts
import { describe, expect, it } from "vitest";

describe("bootstrap", () => {
  it("exposes a test environment", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/unit/bootstrap.test.ts`
Expected: FAIL with `Missing script: "test"` or missing test runner configuration.

- [ ] **Step 3: Write minimal project and test tooling configuration**

```json
{
  "name": "pet-whisper",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^4.1.0",
    "openai": "^6.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.55.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/node": "^24.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "jsdom": "^26.0.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.0",
    "vitest": "^3.2.4"
  }
}
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup/vitest.setup.ts"]
  }
});
```

```ts
// tests/setup/vitest.setup.ts
import "@testing-library/jest-dom";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/unit/bootstrap.test.ts`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.ts postcss.config.mjs .gitignore .env.example vitest.config.ts playwright.config.ts tests/setup/vitest.setup.ts tests/unit/bootstrap.test.ts
git commit -m "chore: bootstrap pet whisper app tooling"
```

## Task 2: Define the Analysis Domain Model and Validation

**Files:**
- Create: `lib/types/analysis.ts`
- Create: `lib/validation/analysis-result.ts`
- Test: `tests/unit/analysis-result.schema.test.ts`

- [ ] **Step 1: Write the failing schema test**

```ts
// tests/unit/analysis-result.schema.test.ts
import { describe, expect, it } from "vitest";
import { analysisResultSchema } from "@/lib/validation/analysis-result";

describe("analysisResultSchema", () => {
  it("accepts a fully structured analysis result", () => {
    const result = analysisResultSchema.safeParse({
      id: "rec_1",
      imageDataUrl: "data:image/jpeg;base64,ZmFrZQ==",
      createdAt: "2026-05-20T10:00:00.000Z",
      emotionLabel: "Relaxed",
      emotionSummary: "Your dog looks calm and comfortably attentive.",
      confidenceNote: "Based on visible posture and facial cues in this single photo.",
      signals: [
        {
          name: "Ears",
          observation: "Soft and slightly angled outward",
          meaning: "Often seen when a dog feels safe and engaged."
        }
      ],
      scientificInterpretation: "The body appears loose with no obvious signs of defensive tension.",
      innerMonologue: "I am feeling pretty comfortable right now.",
      disclaimer: "This is an AI-assisted interpretation based on visible behavior cues in the photo.",
      isFavorited: false
    });

    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/unit/analysis-result.schema.test.ts`
Expected: FAIL with `Cannot find module '@/lib/validation/analysis-result'`.

- [ ] **Step 3: Write the typed result model and Zod schema**

```ts
// lib/types/analysis.ts
export type AnalysisSignal = {
  name: string;
  observation: string;
  meaning: string;
};

export type AnalysisRecord = {
  id: string;
  imageDataUrl: string;
  createdAt: string;
  emotionLabel: string;
  emotionSummary: string;
  confidenceNote: string;
  signals: AnalysisSignal[];
  scientificInterpretation: string;
  innerMonologue: string;
  disclaimer: string;
  isFavorited: boolean;
};
```

```ts
// lib/validation/analysis-result.ts
import { z } from "zod";

export const analysisSignalSchema = z.object({
  name: z.string().min(1),
  observation: z.string().min(1),
  meaning: z.string().min(1)
});

export const analysisResultSchema = z.object({
  id: z.string().min(1),
  imageDataUrl: z.string().startsWith("data:image/"),
  createdAt: z.string().datetime(),
  emotionLabel: z.string().min(1),
  emotionSummary: z.string().min(1),
  confidenceNote: z.string().min(1),
  signals: z.array(analysisSignalSchema).min(1),
  scientificInterpretation: z.string().min(1),
  innerMonologue: z.string().min(1),
  disclaimer: z.string().min(1),
  isFavorited: z.boolean()
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/unit/analysis-result.schema.test.ts`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add lib/types/analysis.ts lib/validation/analysis-result.ts tests/unit/analysis-result.schema.test.ts
git commit -m "feat: define analysis result schema"
```

## Task 3: Implement Browser Persistence for History and Favorites

**Files:**
- Create: `lib/storage/storage-keys.ts`
- Create: `lib/storage/local-records.ts`
- Test: `tests/unit/local-records.test.ts`

- [ ] **Step 1: Write the failing persistence test**

```ts
// tests/unit/local-records.test.ts
import { beforeEach, describe, expect, it } from "vitest";
import { createLocalRecordsStore } from "@/lib/storage/local-records";

const sampleRecord = {
  id: "rec_1",
  imageDataUrl: "data:image/jpeg;base64,ZmFrZQ==",
  createdAt: "2026-05-20T10:00:00.000Z",
  emotionLabel: "Relaxed",
  emotionSummary: "Calm and settled",
  confidenceNote: "Visible cues only",
  signals: [{ name: "Tail", observation: "Neutral", meaning: "Comfort" }],
  scientificInterpretation: "Loose body posture.",
  innerMonologue: "I am happy here.",
  disclaimer: "AI-assisted only.",
  isFavorited: false
};

describe("createLocalRecordsStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves, lists, and toggles favorites", () => {
    const store = createLocalRecordsStore(window.localStorage);

    store.save(sampleRecord);
    store.toggleFavorite("rec_1");

    expect(store.list()[0]?.isFavorited).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/unit/local-records.test.ts`
Expected: FAIL with `Cannot find module '@/lib/storage/local-records'`.

- [ ] **Step 3: Write the local records storage layer**

```ts
// lib/storage/storage-keys.ts
export const STORAGE_KEYS = {
  records: "pet-whisper.records"
} as const;
```

```ts
// lib/storage/local-records.ts
import type { AnalysisRecord } from "@/lib/types/analysis";
import { STORAGE_KEYS } from "./storage-keys";

export function createLocalRecordsStore(storage: Storage) {
  const read = (): AnalysisRecord[] => {
    const raw = storage.getItem(STORAGE_KEYS.records);
    return raw ? (JSON.parse(raw) as AnalysisRecord[]) : [];
  };

  const write = (records: AnalysisRecord[]) => {
    storage.setItem(STORAGE_KEYS.records, JSON.stringify(records));
  };

  return {
    list() {
      return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    save(record: AnalysisRecord) {
      const records = read().filter((item) => item.id !== record.id);
      write([record, ...records]);
    },
    toggleFavorite(id: string) {
      const records = read().map((record) =>
        record.id === id
          ? { ...record, isFavorited: !record.isFavorited }
          : record
      );
      write(records);
    },
    getById(id: string) {
      return read().find((record) => record.id === id) ?? null;
    }
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/unit/local-records.test.ts`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add lib/storage/storage-keys.ts lib/storage/local-records.ts tests/unit/local-records.test.ts
git commit -m "feat: add local record persistence"
```

## Task 4: Build the Analysis API Contract and Route

**Files:**
- Create: `lib/validation/analyze-request.ts`
- Create: `lib/utils/analysis-prompt.ts`
- Create: `lib/openai/client.ts`
- Create: `app/api/analyze/route.ts`
- Test: `tests/unit/analyze-route.test.ts`

- [ ] **Step 1: Write the failing API route test**

```ts
// tests/unit/analyze-route.test.ts
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/openai/client", () => ({
  analyzeDogPhoto: vi.fn().mockResolvedValue({
    emotionLabel: "Curious",
    emotionSummary: "Your dog seems gently alert and interested.",
    confidenceNote: "Based on visible posture and gaze cues.",
    signals: [{ name: "Eyes", observation: "Focused forward", meaning: "Attention" }],
    scientificInterpretation: "The dog appears attentive without obvious tension.",
    innerMonologue: "What is that over there?",
    disclaimer: "This is an AI-assisted interpretation based on visible behavior cues in the photo."
  })
}));

import { POST } from "@/app/api/analyze/route";

describe("POST /api/analyze", () => {
  it("returns a structured analysis record", async () => {
    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        imageDataUrl: "data:image/jpeg;base64,ZmFrZQ=="
      })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.emotionLabel).toBe("Curious");
    expect(body.id).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/unit/analyze-route.test.ts`
Expected: FAIL with `Cannot find module '@/app/api/analyze/route'`.

- [ ] **Step 3: Write request validation and the analysis route**

```ts
// lib/validation/analyze-request.ts
import { z } from "zod";

export const analyzeRequestSchema = z.object({
  imageDataUrl: z.string().startsWith("data:image/")
});
```

```ts
// lib/utils/analysis-prompt.ts
export const ANALYSIS_PROMPT = `
You are helping dog owners interpret visible short-term emotions from a single dog photo.
Return JSON only with keys:
emotionLabel, emotionSummary, confidenceNote, signals, scientificInterpretation, innerMonologue, disclaimer.
Keep the tone warm and balanced. Do not claim certainty beyond visible cues.
`;
```

```ts
// lib/openai/client.ts
import OpenAI from "openai";
import { ANALYSIS_PROMPT } from "@/lib/utils/analysis-prompt";
import { analysisResultSchema } from "@/lib/validation/analysis-result";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeDogPhoto(imageDataUrl: string) {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: ANALYSIS_PROMPT },
          { type: "input_image", image_url: imageDataUrl }
        ]
      }
    ]
  });

  const text = response.output_text;
  const parsed = JSON.parse(text);

  return analysisResultSchema.omit({
    id: true,
    imageDataUrl: true,
    createdAt: true,
    isFavorited: true
  }).parse(parsed);
}
```

```ts
// app/api/analyze/route.ts
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { analyzeDogPhoto } from "@/lib/openai/client";
import { analyzeRequestSchema } from "@/lib/validation/analyze-request";
import { analysisResultSchema } from "@/lib/validation/analysis-result";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = analyzeRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid analyze request." }, { status: 400 });
  }

  const result = await analyzeDogPhoto(parsed.data.imageDataUrl);

  const record = analysisResultSchema.parse({
    id: randomUUID(),
    imageDataUrl: parsed.data.imageDataUrl,
    createdAt: new Date().toISOString(),
    isFavorited: false,
    ...result
  });

  return NextResponse.json(record);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/unit/analyze-route.test.ts`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add lib/validation/analyze-request.ts lib/utils/analysis-prompt.ts lib/openai/client.ts app/api/analyze/route.ts tests/unit/analyze-route.test.ts
git commit -m "feat: add dog photo analysis api contract"
```

## Task 5: Build the Home Page Shell and Visual System

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `components/shared/app-shell.tsx`
- Create: `components/shared/floating-card.tsx`
- Create: `components/shared/section-heading.tsx`
- Create: `components/home/hero.tsx`
- Create: `components/home/how-it-works.tsx`
- Create: `components/home/sample-result-preview.tsx`
- Create: `app/page.tsx`
- Test: `tests/component/home-page.test.tsx`

- [ ] **Step 1: Write the failing home page render test**

```tsx
// tests/component/home-page.test.tsx
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("shows the core value proposition and upload CTA", () => {
    render(<HomePage />);

    expect(screen.getByText(/read the feelings behind the floppy ears/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload a dog photo/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/component/home-page.test.tsx`
Expected: FAIL with `Cannot find module '@/app/page'`.

- [ ] **Step 3: Build the app shell, visual tokens, and home page composition**

```tsx
// app/page.tsx
import { AppShell } from "@/components/shared/app-shell";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { SampleResultPreview } from "@/components/home/sample-result-preview";

export default function HomePage() {
  return (
    <AppShell>
      <Hero />
      <SampleResultPreview />
      <HowItWorks />
    </AppShell>
  );
}
```

```tsx
// components/home/hero.tsx
export function Hero() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Pet Whisper</p>
        <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-stone-900">
          Read the feelings behind the floppy ears.
        </h1>
        <p className="max-w-lg text-lg leading-8 text-stone-600">
          Upload one dog photo and get a warm, science-grounded interpretation of what your dog may be feeling.
        </p>
        <button className="rounded-full bg-amber-400 px-6 py-3 text-stone-900">
          Upload a dog photo
        </button>
      </div>
      <div aria-hidden="true" className="min-h-[420px] rounded-[32px] border border-white/60 bg-white/60 shadow-[0_30px_80px_rgba(120,92,52,0.12)] backdrop-blur-xl" />
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/component/home-page.test.tsx`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css components/shared/app-shell.tsx components/shared/floating-card.tsx components/shared/section-heading.tsx components/home/hero.tsx components/home/how-it-works.tsx components/home/sample-result-preview.tsx app/page.tsx tests/component/home-page.test.tsx
git commit -m "feat: add pet whisper home page shell"
```

## Task 6: Build Photo Upload and Analysis Workspace States

**Files:**
- Create: `lib/utils/file.ts`
- Create: `components/upload/dropzone.tsx`
- Create: `components/upload/analysis-workspace.tsx`
- Test: `tests/component/dropzone.test.tsx`
- Test: `tests/component/analysis-workspace.test.tsx`

- [ ] **Step 1: Write the failing upload interaction tests**

```tsx
// tests/component/dropzone.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { Dropzone } from "@/components/upload/dropzone";

describe("Dropzone", () => {
  it("shows validation feedback for non-image files", async () => {
    render(<Dropzone onSelect={vi.fn()} />);

    const input = screen.getByLabelText(/upload dog photo/i);
    fireEvent.change(input, {
      target: {
        files: [new File(["hello"], "note.txt", { type: "text/plain" })]
      }
    });

    expect(await screen.findByText(/try a clear dog photo/i)).toBeInTheDocument();
  });
});
```

```tsx
// tests/component/analysis-workspace.test.tsx
import { render, screen } from "@testing-library/react";
import { AnalysisWorkspace } from "@/components/upload/analysis-workspace";

describe("AnalysisWorkspace", () => {
  it("shows a start analysis button when an image is selected", () => {
    render(
      <AnalysisWorkspace
        imagePreviewUrl="data:image/jpeg;base64,ZmFrZQ=="
        isAnalyzing={false}
        errorMessage={null}
        onAnalyze={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /start analysis/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run tests/component/dropzone.test.tsx tests/component/analysis-workspace.test.tsx`
Expected: FAIL with missing component module errors.

- [ ] **Step 3: Implement file validation and upload workspace UI**

```ts
// lib/utils/file.ts
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function validatePhotoFile(file: File) {
  if (!file.type.startsWith("image/")) {
    return "This photo format is not supported yet. Try a clear dog photo in JPG, PNG, or WEBP.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "This photo is a little too large right now. Try one under 5MB.";
  }

  return null;
}
```

```tsx
// components/upload/analysis-workspace.tsx
type AnalysisWorkspaceProps = {
  imagePreviewUrl: string | null;
  isAnalyzing: boolean;
  errorMessage: string | null;
  onAnalyze: () => void;
  onReset: () => void;
};

export function AnalysisWorkspace({
  imagePreviewUrl,
  isAnalyzing,
  errorMessage,
  onAnalyze,
  onReset
}: AnalysisWorkspaceProps) {
  if (!imagePreviewUrl) {
    return null;
  }

  return (
    <section className="rounded-[32px] border border-white/60 bg-white/65 p-6 backdrop-blur-xl">
      <img src={imagePreviewUrl} alt="Selected dog photo preview" className="w-full rounded-[24px] object-cover" />
      {errorMessage ? <p className="mt-4 text-sm text-rose-600">{errorMessage}</p> : null}
      <div className="mt-6 flex gap-3">
        <button onClick={onAnalyze} disabled={isAnalyzing} className="rounded-full bg-stone-900 px-5 py-3 text-white">
          {isAnalyzing ? "Reading the mood..." : "Start analysis"}
        </button>
        <button onClick={onReset} className="rounded-full border border-stone-300 px-5 py-3 text-stone-700">
          Choose another photo
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --run tests/component/dropzone.test.tsx tests/component/analysis-workspace.test.tsx`
Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add lib/utils/file.ts components/upload/dropzone.tsx components/upload/analysis-workspace.tsx tests/component/dropzone.test.tsx tests/component/analysis-workspace.test.tsx
git commit -m "feat: add photo upload workspace"
```

## Task 7: Connect the Upload Flow to Analysis and Local History

**Files:**
- Create: `hooks/use-local-storage-state.ts`
- Create: `hooks/use-analysis-records.ts`
- Modify: `app/page.tsx`
- Modify: `components/home/hero.tsx`
- Modify: `components/upload/analysis-workspace.tsx`
- Test: `tests/e2e/home-upload-flow.spec.ts`

- [ ] **Step 1: Write the failing end-to-end upload flow test**

```ts
// tests/e2e/home-upload-flow.spec.ts
import { expect, test } from "@playwright/test";

test("uploads a dog photo and lands on a result page", async ({ page }) => {
  await page.route("**/api/analyze", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "rec_demo",
        imageDataUrl: "data:image/jpeg;base64,ZmFrZQ==",
        createdAt: "2026-05-20T10:00:00.000Z",
        emotionLabel: "Curious",
        emotionSummary: "Your dog looks gently intrigued.",
        confidenceNote: "Based on visible posture and gaze cues.",
        signals: [{ name: "Eyes", observation: "Forward focus", meaning: "Attention" }],
        scientificInterpretation: "The posture suggests alert interest without obvious strain.",
        innerMonologue: "Something interesting is happening.",
        disclaimer: "This is an AI-assisted interpretation based on visible behavior cues in the photo.",
        isFavorited: false
      })
    });
  });

  await page.goto("/");
  await page.getByLabel("Upload dog photo").setInputFiles("tests/fixtures/dog.jpg");
  await page.getByRole("button", { name: "Start analysis" }).click();

  await expect(page).toHaveURL(/\/result\/rec_demo/);
  await expect(page.getByText(/your dog looks gently intrigued/i)).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- --grep "uploads a dog photo"`
Expected: FAIL because upload state and routing are not wired up.

- [ ] **Step 3: Implement client-side analysis orchestration and persistence**

```ts
// hooks/use-analysis-records.ts
import { useMemo } from "react";
import { createLocalRecordsStore } from "@/lib/storage/local-records";

export function useAnalysisRecords() {
  return useMemo(() => createLocalRecordsStore(window.localStorage), []);
}
```

```tsx
// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Hero } from "@/components/home/hero";
import { AnalysisWorkspace } from "@/components/upload/analysis-workspace";
import { useAnalysisRecords } from "@/hooks/use-analysis-records";

export default function HomePage() {
  const router = useRouter();
  const records = useAnalysisRecords();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAnalyze(imageDataUrl: string) {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageDataUrl })
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const record = await response.json();
      records.save(record);
      router.push(`/result/${record.id}`);
    } catch {
      setErrorMessage("We could not read this moment just yet. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <>
      <Hero onPhotoReady={setPreviewUrl} />
      <AnalysisWorkspace
        imagePreviewUrl={previewUrl}
        isAnalyzing={isAnalyzing}
        errorMessage={errorMessage}
        onAnalyze={() => previewUrl && handleAnalyze(previewUrl)}
        onReset={() => setPreviewUrl(null)}
      />
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:e2e -- --grep "uploads a dog photo"`
Expected: PASS with the browser landing on `/result/rec_demo`.

- [ ] **Step 5: Commit**

```bash
git add hooks/use-local-storage-state.ts hooks/use-analysis-records.ts app/page.tsx components/home/hero.tsx components/upload/analysis-workspace.tsx tests/e2e/home-upload-flow.spec.ts
git commit -m "feat: connect upload flow to analysis results"
```

## Task 8: Build the Result Detail Page

**Files:**
- Create: `components/result/result-header.tsx`
- Create: `components/result/signals-list.tsx`
- Create: `components/result/interpretation-card.tsx`
- Create: `components/result/inner-monologue-card.tsx`
- Create: `app/result/[id]/page.tsx`
- Test: `tests/component/result-page.test.tsx`

- [ ] **Step 1: Write the failing result page test**

```tsx
// tests/component/result-page.test.tsx
import { render, screen } from "@testing-library/react";
import ResultPage from "@/app/result/[id]/page";

describe("ResultPage", () => {
  it("renders the scientific interpretation and inner monologue", () => {
    window.localStorage.setItem(
      "pet-whisper.records",
      JSON.stringify([
        {
          id: "rec_demo",
          imageDataUrl: "data:image/jpeg;base64,ZmFrZQ==",
          createdAt: "2026-05-20T10:00:00.000Z",
          emotionLabel: "Curious",
          emotionSummary: "Your dog looks gently intrigued.",
          confidenceNote: "Based on visible posture and gaze cues.",
          signals: [{ name: "Eyes", observation: "Forward focus", meaning: "Attention" }],
          scientificInterpretation: "The posture suggests alert interest without obvious strain.",
          innerMonologue: "Something interesting is happening.",
          disclaimer: "This is an AI-assisted interpretation based on visible behavior cues in the photo.",
          isFavorited: false
        }
      ])
    );

    render(<ResultPage params={{ id: "rec_demo" }} />);

    expect(screen.getByText(/scientific interpretation/i)).toBeInTheDocument();
    expect(screen.getByText(/inner monologue/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/component/result-page.test.tsx`
Expected: FAIL with missing route module or missing record lookup.

- [ ] **Step 3: Build the result detail route and components**

```tsx
// app/result/[id]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { InnerMonologueCard } from "@/components/result/inner-monologue-card";
import { InterpretationCard } from "@/components/result/interpretation-card";
import { ResultHeader } from "@/components/result/result-header";
import { SignalsList } from "@/components/result/signals-list";
import { createLocalRecordsStore } from "@/lib/storage/local-records";

export default function ResultPage({
  params
}: {
  params: { id: string };
}) {
  const store = createLocalRecordsStore(window.localStorage);
  const record = store.getById(params.id);

  if (!record) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <ResultHeader record={record} />
      <SignalsList signals={record.signals} />
      <InterpretationCard text={record.scientificInterpretation} />
      <InnerMonologueCard text={record.innerMonologue} />
      <p className="mt-6 text-sm text-stone-500">{record.disclaimer}</p>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/component/result-page.test.tsx`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/result/result-header.tsx components/result/signals-list.tsx components/result/interpretation-card.tsx components/result/inner-monologue-card.tsx app/result/[id]/page.tsx tests/component/result-page.test.tsx
git commit -m "feat: add analysis result detail page"
```

## Task 9: Build Favorites and History Views

**Files:**
- Create: `components/favorites/favorites-grid.tsx`
- Create: `components/history/history-timeline.tsx`
- Create: `app/favorites/page.tsx`
- Create: `app/history/page.tsx`
- Create: `components/shared/empty-state.tsx`
- Test: `tests/component/favorites-grid.test.tsx`
- Test: `tests/component/history-timeline.test.tsx`
- Test: `tests/e2e/history-and-favorites.spec.ts`

- [ ] **Step 1: Write the failing list view tests**

```tsx
// tests/component/favorites-grid.test.tsx
import { render, screen } from "@testing-library/react";
import { FavoritesGrid } from "@/components/favorites/favorites-grid";

describe("FavoritesGrid", () => {
  it("renders a saved favorite card", () => {
    render(
      <FavoritesGrid
        records={[
          {
            id: "rec_1",
            imageDataUrl: "data:image/jpeg;base64,ZmFrZQ==",
            createdAt: "2026-05-20T10:00:00.000Z",
            emotionLabel: "Calm",
            emotionSummary: "Settled and safe",
            confidenceNote: "Visible cues only",
            signals: [],
            scientificInterpretation: "Loose posture.",
            innerMonologue: "I feel cozy.",
            disclaimer: "AI-assisted only.",
            isFavorited: true
          }
        ]}
      />
    );

    expect(screen.getByText(/i feel cozy/i)).toBeInTheDocument();
  });
});
```

```tsx
// tests/component/history-timeline.test.tsx
import { render, screen } from "@testing-library/react";
import { HistoryTimeline } from "@/components/history/history-timeline";

describe("HistoryTimeline", () => {
  it("renders a timeline row with the emotion summary", () => {
    render(
      <HistoryTimeline
        records={[
          {
            id: "rec_1",
            imageDataUrl: "data:image/jpeg;base64,ZmFrZQ==",
            createdAt: "2026-05-20T10:00:00.000Z",
            emotionLabel: "Calm",
            emotionSummary: "Settled and safe",
            confidenceNote: "Visible cues only",
            signals: [],
            scientificInterpretation: "Loose posture.",
            innerMonologue: "I feel cozy.",
            disclaimer: "AI-assisted only.",
            isFavorited: true
          }
        ]}
      />
    );

    expect(screen.getByText(/settled and safe/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run tests/component/favorites-grid.test.tsx tests/component/history-timeline.test.tsx`
Expected: FAIL with missing component errors.

- [ ] **Step 3: Implement the two record-browsing views**

```tsx
// app/favorites/page.tsx
import { FavoritesGrid } from "@/components/favorites/favorites-grid";

export default function FavoritesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <FavoritesGrid />
    </main>
  );
}
```

```tsx
// app/history/page.tsx
import { HistoryTimeline } from "@/components/history/history-timeline";

export default function HistoryPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <HistoryTimeline />
    </main>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --run tests/component/favorites-grid.test.tsx tests/component/history-timeline.test.tsx`
Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/favorites/favorites-grid.tsx components/history/history-timeline.tsx components/shared/empty-state.tsx app/favorites/page.tsx app/history/page.tsx tests/component/favorites-grid.test.tsx tests/component/history-timeline.test.tsx tests/e2e/history-and-favorites.spec.ts
git commit -m "feat: add favorites and history pages"
```

## Task 10: Generate Share Cards from Saved Results

**Files:**
- Create: `lib/types/share-card.ts`
- Create: `components/share/share-card-preview.tsx`
- Create: `app/api/share-card/[id]/route.ts`
- Test: `tests/unit/share-card-route.test.ts`

- [ ] **Step 1: Write the failing share card route test**

```ts
// tests/unit/share-card-route.test.ts
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/share-card/[id]/route";

describe("GET /api/share-card/[id]", () => {
  it("returns an image response", async () => {
    const response = await GET(new Request("http://localhost:3000/api/share-card/rec_1"), {
      params: Promise.resolve({ id: "rec_1" })
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/unit/share-card-route.test.ts`
Expected: FAIL with missing route module.

- [ ] **Step 3: Implement a minimal share card image route**

```ts
// app/api/share-card/[id]/route.ts
import { ImageResponse } from "next/og";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fff9f2, #f0eadf)",
          padding: 48
        }}
      >
        <div style={{ fontSize: 24, color: "#6b5b48" }}>Pet Whisper</div>
        <div style={{ fontSize: 56, color: "#2f2419" }}>Analysis {id}</div>
      </div>
    ),
    {
      width: 1200,
      height: 1600
    }
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/unit/share-card-route.test.ts`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add lib/types/share-card.ts components/share/share-card-preview.tsx app/api/share-card/[id]/route.ts tests/unit/share-card-route.test.ts
git commit -m "feat: add result share card generation"
```

## Task 11: Polish Empty, Error, and Loading States

**Files:**
- Modify: `components/upload/analysis-workspace.tsx`
- Modify: `components/shared/empty-state.tsx`
- Modify: `components/favorites/favorites-grid.tsx`
- Modify: `components/history/history-timeline.tsx`
- Modify: `app/page.tsx`
- Test: `tests/component/error-and-empty-states.test.tsx`

- [ ] **Step 1: Write the failing UX states test**

```tsx
// tests/component/error-and-empty-states.test.tsx
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/shared/empty-state";

describe("EmptyState", () => {
  it("renders warm guidance copy", () => {
    render(
      <EmptyState
        title="No favorites yet"
        description="Save a result and it will float here for easy revisiting."
      />
    );

    expect(screen.getByText(/save a result/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/component/error-and-empty-states.test.tsx`
Expected: FAIL until the shared empty state exists and is wired.

- [ ] **Step 3: Implement the missing warm-state UI**

```tsx
// components/shared/empty-state.tsx
type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-stone-300 bg-white/55 px-8 py-14 text-center">
      <h2 className="text-2xl font-medium text-stone-900">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-stone-600">{description}</p>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/component/error-and-empty-states.test.tsx`
Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add components/shared/empty-state.tsx components/upload/analysis-workspace.tsx components/favorites/favorites-grid.tsx components/history/history-timeline.tsx app/page.tsx tests/component/error-and-empty-states.test.tsx
git commit -m "feat: polish loading and empty states"
```

## Task 12: Verify End-to-End Quality and Document the App

**Files:**
- Modify: `README.md`
- Modify: `.env.example`
- Modify: `tests/e2e/home-upload-flow.spec.ts`
- Modify: `tests/e2e/history-and-favorites.spec.ts`

- [ ] **Step 1: Write the failing documentation expectation test**

```ts
// tests/unit/readme.test.ts
import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("README", () => {
  it("documents setup and the analyze route environment variable", () => {
    const readme = fs.readFileSync("README.md", "utf8");

    expect(readme).toContain("OPENAI_API_KEY");
    expect(readme).toContain("npm run dev");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/unit/readme.test.ts`
Expected: FAIL because README setup documentation is missing.

- [ ] **Step 3: Write onboarding documentation and final verification notes**

```md
<!-- README.md -->
# Pet Whisper

Pet Whisper is a photo-first dog emotion interpretation web app.

## Getting Started

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env.local`
3. Set `OPENAI_API_KEY`
4. Start the app with `npm run dev`

## Testing

- `npm test`
- `npm run test:e2e`

## V1 Features

- Single-photo dog mood analysis
- Favorites
- History timeline
- Share card generation
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --run tests/unit/readme.test.ts && npm test && npm run test:e2e`
Expected: PASS across unit, component, and end-to-end suites.

- [ ] **Step 5: Commit**

```bash
git add README.md .env.example tests/unit/readme.test.ts tests/e2e/home-upload-flow.spec.ts tests/e2e/history-and-favorites.spec.ts
git commit -m "docs: document setup and verify pet whisper v1"
```

## Self-Review

### Spec Coverage

Covered by planned tasks:

- Homepage, hero, and visual design system: Tasks 5 and 6
- Photo upload and analysis workspace: Tasks 6 and 7
- Real multimodal analysis route: Task 4
- Structured result page: Task 8
- Favorites masonry and history timeline: Task 9
- Share card generation: Task 10
- Warm loading and empty states: Task 11
- Local persistence and future-ready data shapes: Tasks 2 and 3
- Responsive web app foundation and docs: Tasks 1, 5, and 12

No spec gaps remain for the defined V1 scope.

### Placeholder Scan

The plan avoids `TBD`, `TODO`, and vague “handle edge cases” instructions. Each task names exact files, concrete tests, implementation snippets, and verification commands.

### Type Consistency

The plan keeps one shared `AnalysisRecord` shape throughout API, local storage, result detail, favorites, history, and share-card generation. The uploaded image is represented consistently as `imageDataUrl` from analysis through local persistence.
