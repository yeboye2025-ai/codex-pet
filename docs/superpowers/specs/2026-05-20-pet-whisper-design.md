# Pet Whisper V1 Design Spec

## Overview

Pet Whisper is a web app for dog owners that interprets a dog's short-term emotion and behavior from a single uploaded photo. The app analyzes visible signals such as ears, tail, posture, and gaze, then returns a structured result that includes an emotion label, a science-grounded explanation, and a warm inner monologue. The first version prioritizes a polished healing visual experience and a real AI-powered photo analysis flow.

## Product Goal

Build a believable, delightful MVP that lets a user:

- Upload one dog photo
- Receive a real AI-generated interpretation
- Save favorite results
- Review past analyses
- Generate a shareable card from a result

The app should feel calm, premium, warm, and easy to use on both desktop and mobile.

## V1 Scope

### Included

- Landing page with strong hero section and immediate upload entry
- Drag-and-drop and click-to-upload support for one photo
- Real photo analysis using a multimodal model
- Structured result page with:
  - emotion status
  - short summary
  - visible behavior signals
  - scientific interpretation
  - inner monologue
  - lightweight disclaimer
- Favorites view with masonry-style card layout
- History view with timeline layout
- Share card generation from a saved analysis
- Responsive design for desktop and mobile
- Local persistence for history and favorites in the browser

### Excluded From V1

- Video analysis
- Multi-image comparison
- User login
- Cross-device sync
- Social commenting or community feed
- Advanced filtering and search
- Profile management

## Product Decisions Confirmed

- Delivery strategy: experience-first real MVP
- Analysis input: single photo only
- Analysis engine: multimodal model direct output
- Result tone: warm and balanced
- Account system: not included in V1

## Core User Journey

### Primary Flow

1. User lands on the home page
2. User immediately understands the value proposition
3. User uploads a dog photo via drag-and-drop or file picker
4. User reviews the uploaded image in the analysis workspace
5. User taps a clear "start analysis" action
6. App sends the image to the analysis API
7. User sees a calm loading state
8. App returns a structured analysis result
9. User can favorite the result, generate a share card, or revisit it later in history

### Supporting Flows

- User opens Favorites to browse saved results in a masonry layout
- User opens History to revisit all prior analyses in a timeline
- User opens a prior record to view the full result again

## Information Architecture

### Main Navigation

- Home
- Favorites
- History

Navigation should stay minimal and quiet. V1 should not expose login or account actions.

### Pages

#### Home

Purpose:

- Explain the product immediately
- Present upload as the primary action
- Preview the type of result the user will get

Sections:

- Hero with short headline, supporting copy, and upload entry
- Visible drag-and-drop area
- Sample result preview card
- Short "how it works" section
- Lightweight explanation of behavior signals the AI looks for

#### Analysis Workspace

Purpose:

- Let the user confirm the selected image before analysis
- Make the upload-to-analysis transition feel guided and calm

States:

- Empty
- Image selected
- Upload validation error
- Analyzing
- Analysis failed

#### Result Detail

Purpose:

- Present the analysis in a trustworthy and emotionally resonant format

Sections:

- Large image preview
- Emotion label
- One-line emotional summary
- Favorite action
- Share card action
- Behavior signal list
- Scientific interpretation
- Inner monologue
- Disclaimer

#### Favorites

Purpose:

- Showcase the most emotionally resonant results in a visual browsing layout

Structure:

- Masonry card grid
- Each card shows image, emotion label, short monologue excerpt, and saved time
- Card click opens result detail

#### History

Purpose:

- Help users revisit previous analyses as an emotional diary

Structure:

- Timeline layout
- Each item shows timestamp, image thumbnail, emotion label, and short summary
- Item click opens result detail

## Visual Direction

### Design Intent

The visual language should feel:

- warm
- airy
- premium
- healing
- cute without being childish

The app should avoid generic AI aesthetics and avoid cartoon-heavy pet branding.

### Color Direction

- Base: cream white
- Surface layers: oat beige and light apricot
- Accent: sage green or misty blue
- Highlight: honey gold

Avoid purple-heavy gradients and dark-mode-first styling.

### UI Style

- Large whitespace
- Rounded translucent cards
- Gentle border definition
- Soft, wide, low-contrast shadows
- Light blur for floating surfaces
- Minimal chrome and visual noise

### Motion Principles

Use only subtle motion:

- fade and slight upward reveal on page entry
- soft hover lift on cards
- breathing animation during analysis
- staggered section reveal where useful

Avoid flashy transitions, hard bounces, strong parallax, or noisy particle effects.

## Result Content Structure

Each analysis result should be stored as one structured record.

### Result Record Fields

- `id`
- `imageUrl`
- `createdAt`
- `emotionLabel`
- `emotionSummary`
- `confidenceNote`
- `signals`
- `scientificInterpretation`
- `innerMonologue`
- `disclaimer`
- `isFavorited`

### Signal Item Structure

Each entry in `signals` should include:

- `name`
- `observation`
- `meaning`

Example categories:

- ears
- tail
- gaze
- mouth tension
- body posture

### Model Output Contract

The analysis API should require structured output rather than freeform prose. The model response should map to:

- `emotionLabel`
- `emotionSummary`
- `confidenceNote`
- `signals`
- `scientificInterpretation`
- `innerMonologue`
- `disclaimer`

This preserves a clean UI and reduces rendering instability.

## Technical Direction

### Recommended Stack

- Next.js
- TypeScript
- Tailwind CSS
- Server-side analysis route
- Local browser persistence for history and favorites
- Multimodal model API for image interpretation

### Architectural Approach

Use a single Next.js application for V1 so the product can ship as one cohesive web app with one deployment surface. The server side handles image analysis requests. The client handles upload interactions, page presentation, and browser persistence.

This keeps V1 fast to build while leaving room to add a real database and authentication later without redesigning the front end.

## Data Persistence Strategy

V1 should work without login. History and favorites should be stored locally in the browser.

Guidelines:

- Store all analysis records in one local collection
- Do not duplicate favorites as a separate record copy
- Mark favorite state on existing records or track favorite IDs against the shared record set
- Design data shapes so they can later migrate to a backend-backed user model

## Error Handling

### Upload Errors

Cases:

- unsupported file type
- file too large
- invalid image

UX response:

- show direct, warm feedback
- explain what kinds of dog photos work best
- allow immediate retry

### Analysis Failure

Cases:

- API timeout
- provider error
- malformed response

UX response:

- clear retry action
- avoid technical jargon
- preserve the selected image if possible

### Low Certainty Analysis

Cases:

- dog body language not sufficiently visible
- important signals hidden or cropped

UX response:

- do not force a strong conclusion
- present a conservative confidence note
- still provide a partial interpretation when reasonable

### Local Persistence Issues

Cases:

- browser storage unavailable
- saved records removed externally

UX response:

- do not block fresh analysis
- gracefully degrade favorites/history features

## Trust and Safety Boundaries

The product should explicitly frame results as supportive interpretation, not authoritative diagnosis.

Recommended disclaimer:

"This is an AI-assisted interpretation based on visible behavior cues in the photo and should not replace guidance from a veterinarian or qualified behavior professional."

## Approach Options Considered

### Option A: Experience-First Real MVP

One integrated app with strong visual design, real photo analysis, local persistence, and complete user-facing flow.

Pros:

- strongest first impression
- most aligned with the product vision
- fastest path to a usable and lovable MVP

Cons:

- model reliability depends heavily on prompt design and response validation

### Option B: Backend-First MVP

Prioritize infrastructure and analysis plumbing, keep the interface visually simple.

Pros:

- technically steady foundation
- easier future expansion

Cons:

- weaker emotional product impact
- underdelivers on the intended visual experience

### Option C: Full Platform Foundation

Build authentication, cloud sync, and broader architecture from day one.

Pros:

- strongest long-term platform posture

Cons:

- too heavy for this phase
- slows time to first lovable release

## Recommended Approach

Choose Option A.

Pet Whisper V1 should ship as a beautifully designed, photo-first web app with real AI analysis, local browser persistence, and a fully polished loop from upload to result to revisit.

## Success Criteria

V1 is successful if a first-time user can:

- understand the product within the first screen
- upload a dog photo without confusion
- receive a structured result that feels both credible and delightful
- save and revisit results easily
- use the app comfortably on mobile

## Future Upgrade Path

V1 should leave room for:

- magic-link login
- cloud sync for history and favorites
- short video analysis
- richer confidence handling
- personalized dog profiles
- shareable public result pages
