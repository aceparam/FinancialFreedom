# Changelog

## [0.1.0] - 2026-05-19

### MVP Release 🚀

#### Features
- **Core Dashboard**
  - Single-screen app with portfolio verdict (On Track / Stretch / Shortfall)
  - Recharts area chart showing projected portfolio value over 5 years
  - Milestone overlays with vertical reference lines on chart
  - Three-column grid of milestone status cards (mobile: 1 column)

- **Milestone Management**
  - Add / Edit / Delete milestones via side drawer modal
  - 7 categories (Education, Healthcare, Housing, Vehicle, General, Travel, Wedding)
  - Per-category default inflation rates (5–10%)
  - Per-milestone inflation override support
  - Automatic chronological processing

- **Portfolio Control**
  - Edit current corpus, monthly SIP, annual return, inflation via modal
  - What-if slider (₹0–₹5L monthly SIP) with live chart/card updates
  - Displayed SIP value persists across sessions

- **Calculations**
  - Monthly compounding with quarterly chart resolution
  - Future value formulas (corpus + SIP) with milestone withdrawals
  - Status logic: on_track (≥110%), stretch (95–110%), shortfall (<95%)
  - Reference test case passing within ±0.5%

- **Styling & UX**
  - Dark mode by default; light/dark toggle in header
  - Tailwind CSS responsive design (mobile-first)
  - Indian currency formatting (lakhs/crores)
  - Subtle animations (chart appear, number transitions)
  - Empty state: friendly prompt to add first milestone

- **Data Persistence**
  - Zustand + localStorage (no backend)
  - Automatic load on page refresh
  - Explicit Export JSON button (scenario download)

- **Export & Feedback**
  - Download current scenario as JSON file
  - Feedback button opens Google Form (URL configurable)

#### Tech
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS + dark mode (class strategy)
- Recharts (area chart, reference lines, tooltips)
- Zustand (state + persistence middleware)
- next-themes (theme toggle)
- Vitest (unit tests, 4/4 passing)

#### Testing
- `__tests__/calculations.test.ts` validates reference case
- All portfolio projection formulas tested
- Milestone status logic verified
- Multiple milestone ordering confirmed

#### Documentation
- `README.md` with setup, deployment, formulas, test case, v2 ideas
- This `CHANGELOG.md`
- Inline code comments for key logic

#### Known Limitations (by design)
- No authentication or multi-user support
- No saved scenarios (only current state)
- No tax modeling or asset allocation
- No AI suggestions
- No retirement corpus mode (milestones only)
- No shareable links

#### Deployment
- Ready for Vercel (`pnpm build && vercel --prod`)
- Builds successfully, TypeScript strict mode
- Lighthouse Performance target: ≥90 (mobile)

---

**Next major milestone:** v0.2.0 with multi-scenario compare and AI-suggested SIP adjustments.
