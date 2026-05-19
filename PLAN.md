# Capex Compass MVP — Implementation Plan

## File Structure

```
capex-compass/
├── app/
│   ├── layout.tsx                 # Root layout with theme provider
│   ├── page.tsx                   # Main dashboard
│   └── api/
│       └── (empty for MVP)
├── components/
│   ├── dashboard/
│   │   ├── VerdictHero.tsx        # Top status display (on track / stretch / shortfall)
│   │   ├── ProjectionChart.tsx    # Recharts area chart with milestone overlays
│   │   ├── MilestoneCards.tsx     # Grid of milestone status cards
│   │   └── SIPSlider.tsx          # What-if monthly SIP slider with live updates
│   ├── onboarding/
│   │   ├── OnboardingFlow.tsx     # First-time user 4-field form + sample milestone
│   │   └── OnboardingCard.tsx     # Single input card component
│   ├── common/
│   │   ├── Header.tsx             # Logo, dark/light toggle, Export JSON, Feedback button
│   │   ├── MilestoneDrawer.tsx    # Side drawer for add/edit/delete milestones
│   │   └── EmptyState.tsx         # "Add your first goal" placeholder
│   └── ui/                        # shadcn/ui components (auto-generated)
├── lib/
│   ├── config.ts                  # Constants, category defaults, FEEDBACK_FORM_URL
│   ├── calculations.ts            # Portfolio projection engine
│   ├── currency.ts                # formatINR helper
│   ├── store.ts                   # Zustand store with localStorage persistence
│   └── types.ts                   # TypeScript interfaces (Portfolio, Milestone, etc.)
├── styles/
│   └── globals.css                # Tailwind + custom animations
├── __tests__/
│   └── calculations.test.ts       # Vitest: reference case validation
├── public/
│   └── favicon.ico
├── .env.local                     # (empty for MVP, but tracked in .gitignore)
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── package.json
├── pnpm-lock.yaml
├── README.md
├── CHANGELOG.md
└── vercel.json                    # (optional, for Vercel config)
```

## Build Order (as specified in brief)

1. ✅ **Scaffold Next.js + Tailwind + shadcn/ui**
   - Create Next.js 14 project with TypeScript
   - Install Tailwind CSS
   - Set up shadcn/ui with a few base components (Button, Card, Input, Slider, Dialog)
   - Configure dark mode (class strategy)

2. **Data model + Zustand store + localStorage persistence**
   - Define types in `lib/types.ts`
   - Create Zustand store in `lib/store.ts` with actions:
     - `setPortfolio(portfolio)`
     - `addMilestone(milestone)`
     - `updateMilestone(id, milestone)`
     - `deleteMilestone(id)`
     - `setOnboardingComplete(bool)`
     - `setMonthly SIP(amount)` — for what-if slider
   - Persist to localStorage via Zustand middleware
   - Load initial state on app mount

3. **Calculation engine + Vitest test**
   - Implement `lib/calculations.ts`:
     - `projectPortfolio(portfolio, milestones, months)` — returns `ProjectionPoint[]`
     - For each month, compute `FV_corpus` and `FV_sip`, subtract milestone withdrawals
     - `getMilestoneStatus(projected, required)` — returns 'on_track' | 'stretch' | 'shortfall'
     - `getVerdictStatus(milestones)` — returns overall verdict for hero
   - Write `__tests__/calculations.test.ts` with the reference case:
     - corpus = ₹10,00,000; SIP = ₹50,000; return = 12%; inflation = 6%; milestone Car at 5y with ₹15,00,000 cost and 5% inflation override
     - Assert required ≈ ₹19,14,422 and projected ≈ ₹58,40,000–59,00,000 (±0.5%)

4. **Projection chart with milestone overlays**
   - Build `components/dashboard/ProjectionChart.tsx` using Recharts
   - X-axis: months, but render quarterly (every 3 months) for smoothness
   - Y-axis: portfolio value (₹, formatted)
   - Area chart: projected portfolio curve
   - Vertical dotted lines + labeled chips for milestones
   - Responsive: auto-stagger milestone labels on mobile (390px)
   - Tooltip on hover showing date, value, milestone if any

5. **Milestone cards + status logic**
   - Build `components/dashboard/MilestoneCards.tsx`
   - Grid: 3 columns on desktop, 1 on mobile (Tailwind `grid-cols-1 md:grid-cols-3`)
   - Each card shows:
     - Status pill (on_track = green, stretch = amber, shortfall = red)
     - Milestone name
     - Required amount (inflated, INR format)
     - Projected portfolio value at date
     - Gap (negative if shortfall)
   - Click to edit via drawer

6. **What-if SIP slider with live updates**
   - Build `components/dashboard/SIPSlider.tsx`
   - Input: monthly SIP from 0 to ₹5,00,000
   - On change: update store, recalculate projections, re-render chart and cards
   - Display current SIP value in header
   - Smooth transitions (CSS or Framer Motion)

7. **Onboarding flow + empty states**
   - Build `components/onboarding/OnboardingFlow.tsx`
   - Show on first load (check `store.onboardingComplete`)
   - Form fields:
     - Current Corpus (INR)
     - Monthly SIP (INR)
     - Expected Annual Return (%, convert to decimal)
     - Default Inflation Rate (%, convert to decimal)
     - + 1 pre-filled example milestone (e.g., Child's college, 2040, ₹25,00,000)
   - On save, set `onboardingComplete: true` and redirect to dashboard
   - Build `components/common/EmptyState.tsx` for dashboard when no milestones

8. **INR formatting + dark mode + mobile polish**
   - Implement `lib/currency.ts`:
     - `formatINR(amount, mode)` where mode = 'full' (₹12,45,000) or 'short' (₹1.24 Cr)
     - Handle lakhs/crores logic
   - Dark mode: set default in `tailwind.config.ts` as `darkMode: 'class'`
   - Add theme toggle in `components/common/Header.tsx`
   - Mobile polish:
     - Test on 390px viewport
     - Ensure chart is readable (may need horizontal scroll or auto-scale)
     - Font sizes, padding scale down appropriately

9. **Export JSON + Feedback button**
   - `components/common/Header.tsx`:
     - Export button: download current portfolio + milestones as JSON file
     - Feedback button: open Google Form in new tab (URL from `lib/config.ts`)

10. **README + tests + deploy**
    - Write `README.md` with: setup, deployment, formulas, reference test case, v2 feature ideas
    - Ensure `__tests__/calculations.test.ts` passes with `pnpm test`
    - Set up Vercel deployment (single command)
    - Write `CHANGELOG.md` with v0.1.0 entry

---

## Key Decisions (awaiting your input)

### 1. **Onboarding UX: Modal vs. Full Page?**
   - **Option A (Modal)**: Lightweight, overlay on dashboard, user can see dashboard behind
   - **Option B (Full Page)**: Dedicated `/onboarding` route, cleaner first-time experience
   - **Recommendation**: Option A (modal) — simpler, keeps all logic on single page, faster iteration

### 2. **Milestone Withdrawal Logic**
   - When a milestone date is reached, the `required` amount is withdrawn from the portfolio
   - **Question**: Should withdrawals happen on the exact date, or at month-end?
   - **Recommendation**: Month-end (end of the month containing the milestone date) for simplicity

### 3. **Chart Resolution for Mobile**
   - On a 390px phone, rendering 60 months of data might feel crowded
   - **Option A**: Always render quarterly (every 3 months), even on mobile
   - **Option B**: Render daily/monthly on mobile, quarterly on desktop
   - **Recommendation**: Option A — quarterly on all devices, with horizontal scroll if needed, keeps math simple

### 4. **What-If Slider Range**
   - Upper bound for SIP slider?
   - **Recommendation**: ₹5,00,000/month (₹60L annually) — covers most use cases without being absurd

### 5. **Error Handling**
   - For MVP, assume all inputs are valid (no negative numbers, dates in the future, etc.)
   - **Should we add validation?** (e.g., warn if target date is in the past)
   - **Recommendation**: Add soft warnings but don't block saving (MVP priority is velocity)

### 6. **Framer Motion vs. CSS Transitions**
   - The brief mentions "subtle animations on slider updates"
   - **Recommendation**: CSS transitions only for MVP (faster, lighter). Add Framer Motion in v2 if testers ask for it

### 7. **Test Framework**
   - Brief specifies Vitest
   - **Install as devDependency?** Yes
   - **Run on CI/CD?** For MVP, just local (`pnpm test`)

---

## Tech Stack Confirmation

- ✅ Next.js 14 (App Router)
- ✅ TypeScript
- ✅ Tailwind CSS + shadcn/ui
- ✅ Recharts
- ✅ Zustand + localStorage
- ✅ Vitest for tests
- ✅ pnpm
- ✅ Vercel deployment
- ❓ Framer Motion: **Not in MVP, add in v2 if needed**
- ❓ dotenv: Not needed for MVP (no backend/secrets)

---

## Success Criteria Checklist

- [ ] Mobile-responsive at 390px
- [ ] Lighthouse Performance ≥ 90 (mobile)
- [ ] All calculations within ±0.5% of reference
- [ ] No console errors
- [ ] Loads in < 1s on 4G
- [ ] `pnpm install && pnpm dev` works
- [ ] `vercel --prod` deploys to live URL
- [ ] All localStorage persistence works
- [ ] Dark/light toggle works
- [ ] Export JSON downloads correctly
- [ ] Feedback button opens form

---

## Next Steps

1. Wait for your input on the 7 decisions above (or I'll proceed with recommendations)
2. Scaffold Next.js project
3. Set up Tailwind + shadcn/ui
4. Start with data model + store

Ready to proceed? 🚀
