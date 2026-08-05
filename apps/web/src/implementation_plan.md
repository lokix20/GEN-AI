# Redesign AI Assistant & Crop Diagnosis Pages

The goal is to exactly match the provided layout screenshots for the AI Assistant and Crop Diagnosis pages.

## Layout Analysis

1. **Global AppShell**:
   - The dark green main sidebar (`SidebarNav`) remains on the far left across all pages.
   - The standard `Topbar` is HIDDEN for these specific pages (`/chat`, `/disease-detection`). Instead, each page renders its own custom header at the top of its viewport to maximize space and provide contextual controls.

2. **AI Assistant (`ChatPage.tsx`)**:
   - **Header**: "AI Assistant" text, Language pills (Telugu, Hindi, English), "+ New chat" white button, "RF" avatar.
   - **Inner Left Pane (History & Context)**: Light beige background. Contains "THIS WEEK" (active item has white pill background), "SAVED ANSWERS", and "FARM CONTEXT" at the bottom.
   - **Inner Right Pane (Chat Area)**: White/beige background. Welcome screen has "Namaskaram, Ramesh", 4 suggestion cards, and a green "Or just send a photo" banner.
   - **Composer**: Floating pill at the bottom with attachment, input, mic, and green send button.

3. **Crop Diagnosis (`DiseaseDetectionPage.tsx`)**:
   - **Header**: "Crop Diagnosis" text, Tabs ("Diagnose", "History", "Compare"), "English" dropdown, "RF" avatar.
   - **Inner Left Pane (Capture Panel)**: White background card. "Photograph the problem", Dropzone, Camera/Browse buttons, Add angles, "WHICH PLOT?" selection pills, and a large green "Detect disease" button.
   - **Inner Right Pane (Result Panel)**: White background card. Active result header, Disease identification card (Bacterial leaf blight, 88% confidence, Severity, Spread, Act within, Yield at risk). Treatment plan numbered list, Other possibilities, Nearby inputs, and a dark green "Want a human check?" box at the bottom.

## Proposed Changes

### 1. `apps/web/src/components/layout/AppShell.tsx`
- [MODIFY] Update to hide `Topbar` when the route is `/chat` or `/disease-detection`, but keep the main `SidebarNav` visible. Remove padding from `main` on these routes so the pages can render edge-to-edge inside the content area.

### 2. `apps/web/src/pages/chat/ChatPage.tsx`
- [MODIFY] Completely rewrite to implement the split-pane layout with light beige inner sidebar (`THIS WEEK`, `FARM CONTEXT`) and the custom header spanning the full width of the content area.

### 3. `apps/web/src/pages/disease-detection/DiseaseDetectionPage.tsx` (and related components)
- [MODIFY] Completely rewrite to implement the dual-pane diagnosis view:
  - Left capture pane (file upload, plot selection).
  - Right live result pane (disease card, treatment plan, nearby inputs).
  - Custom header with Diagnose/History/Compare tabs.

## Verification Plan
- Build the web app (`npm run build`).
- Verify visual layout matches the provided screenshots perfectly.
