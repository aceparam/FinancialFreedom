# Capex Compass — MVP

**Plan your life milestones with confidence.** A web app that shows whether your current investments will fund your future big costs, with inflation automatically baked in.

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
# Build
pnpm build

# Start production server
pnpm start
```

### Deploy to Vercel

```bash
# One-click deploy
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Features

- **Single-screen dashboard** with portfolio verdict (On Track / Stretch / Shortfall)
- **Interactive projection chart** showing portfolio growth over time with milestone overlays
- **Milestone cards** displaying status, required amount, projected value, and gap
- **What-if SIP slider** to see real-time impact of changing monthly investments
- **Full milestone CRUD** — add, edit, delete milestones via side drawer
- **Dark/light mode toggle** (defaults to dark)
- **Export scenario as JSON** for sharing with others
- **Mobile-responsive** design that works on phones (390px+)
- **localStorage persistence** — all data saved automatically

## Calculations

All projections use these formulas (monthly compounding):

### Future Value of Current Corpus
```
FV_corpus = P × (1 + r)^n
```
Where:
- `P` = current portfolio value
- `r` = monthly return (annual return / 12)
- `n` = number of months

### Future Value of Monthly SIP
```
FV_sip = PMT × [((1 + r)^n − 1) / r] × (1 + r)
```
Where:
- `PMT` = monthly SIP amount
- `r` = monthly return
- `n` = number of months

### Total Projected Portfolio at Year n
```
projected(n) = FV_corpus + FV_sip - (sum of milestone withdrawals up to month n)
```

### Inflated Cost of a Milestone
```
required(n) = cost_today × (1 + inflation)^n
```
Where:
- `n` = number of years until milestone
- `inflation` = category inflation rate (or override)

### Milestone Status
- **On Track**: projected ≥ required × 1.10
- **Stretch**: required × 0.95 ≤ projected < required × 1.10
- **Shortfall**: projected < required × 0.95

## Test Reference Case

The following test case validates all calculations:

**Inputs:**
- Current Corpus: ₹10,00,000
- Monthly SIP: ₹50,000
- Expected Annual Return: 12%
- Default Inflation: 6%
- Milestone: "Car" at ₹15,00,000, 5 years from today (Vehicle category, 5% inflation)

**Expected Results:**
- Milestone required amount: ≈ ₹19,14,422
- Projected portfolio at 5 years (after withdrawal): ≈ ₹40,26,593
- Status: **On Track** (comfortable surplus)

Run tests:
```bash
pnpm test
```

## Category Default Inflation Rates

| Category    | Inflation |
|-------------|-----------|
| Education   | 10%       |
| Healthcare  | 8%        |
| Housing     | 7%        |
| Vehicle     | 5%        |
| General     | 6%        |
| Travel      | 6%        |
| Wedding     | 8%        |

Per-milestone inflation overrides are supported via the milestone editor.

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Recharts** for projections chart
- **Zustand** for state management + localStorage
- **next-themes** for dark/light mode
- **Vitest** for unit tests

## File Structure

```
capex-compass/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Main dashboard
│   └── globals.css              # Global styles
├── components/
│   ├── dashboard/               # Dashboard components
│   │   ├── VerdictHero.tsx     # Status hero display
│   │   ├── ProjectionChart.tsx # Recharts area chart
│   │   ├── MilestoneCards.tsx  # Milestone grid
│   │   └── SIPSlider.tsx       # What-if slider
│   ├── onboarding/             # Onboarding flow
│   └── common/                  # Shared components
│       ├── Header.tsx          # Top navigation
│       ├── MilestoneDrawer.tsx # Milestone CRUD modal
│       └── EmptyState.tsx      # Empty state card
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── store.ts                # Zustand store
│   ├── calculations.ts         # Projection engine
│   ├── currency.ts             # INR formatting
│   ├── config.ts               # Constants
│   └── uuid.ts                 # ID generator
├── __tests__/
│   └── calculations.test.ts    # Unit tests (Vitest)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── vitest.config.ts
├── next.config.js
├── README.md                   # This file
├── CHANGELOG.md                # Version history
└── vercel.json                 # Vercel config (optional)
```

## Troubleshooting

### Port 3000 in use
```bash
# Find and kill the process
lsof -ti :3000 | xargs kill -9

# Or run on a different port
PORT=3001 pnpm dev
```

### Dark mode not applying
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors

### Calculations seem off
- Verify portfolio values don't have commas in inputs
- Ensure milestone dates are in the future
- Run `pnpm test` to check reference case

## What to Build Next (v2 Features)

Based on MVP tester feedback, here are the 5 highest-leverage v2 features:

1. **Multi-Scenario Compare**
   - Save multiple "what-if" scenarios (e.g., "Conservative SIP", "Aggressive SIP")
   - Side-by-side milestone comparison
   - Quick "Apply this scenario" button

2. **AI-Suggested SIP Adjustments**
   - Claude API integration to suggest optimal SIP for each milestone
   - "Reverse calculator": "I want ₹X by date Y — what SIP do I need?"
   - Smart re-optimization when a milestone status changes

3. **Asset Allocation Modeling**
   - Split portfolio across debt/equity/gold with category-specific returns
   - Rebalancing reminders
   - Tax-loss harvesting suggestions (India-specific)

4. **Retirement Corpus Mode**
   - Switch from milestone-based to corpus-based ("I need ₹1 Cr by age 60")
   - Withdrawal rate visualization
   - Life expectancy-aware horizon

5. **Shareable Scenario Links**
   - Generate short URL: `capexcompass.app/s/abc123xyz`
   - Read-only view for friends/advisors
   - Comment threads for feedback

## Configuration

### Feedback Form URL
Update `lib/config.ts` to set your Google Form link:

```typescript
export const FEEDBACK_FORM_URL = 'https://forms.gle/your-form-id'
```

### Default Portfolio
Users can edit portfolio values in the dashboard. Defaults are in `lib/config.ts`:

```typescript
export const DEFAULT_PORTFOLIO = {
  currentCorpus: 1000000,
  monthlySIP: 50000,
  expectedAnnualReturn: 0.12,
  defaultInflation: 0.06,
}
```

## License

MIT

---

**Built with ❤️ for financial clarity.**
