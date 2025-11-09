# AI Agent Workflow Log

## Agents Used
- **ChatGPT (GPT-5 Mini)** – used for debugging help.
- **GitHub Copilot** – used inline in VS Code for boilerplate code, loops, and type annotations.
- **Claude Code** – used for reviewing and refactoring complex TypeScript functions.

## Prompts & Outputs

- **Example 1:** Prisma Seed Script
  - **Prompt:** "Generate a Prisma seed file for 5 FuelEU routes with routeId, vesselType, fuelType, year, ghgIntensity, fuelConsumption, distance, totalEmissions, and isBaseline flag"
  - **Output Generated:** A full `seed.ts` with `prisma.route.upsert` for all 5 routes, ready to run.
  - **Refinement:** Changed `update` to match only necessary fields and fixed TypeScript types for numeric fields.

- **Example 2:** Pooling Page API Call Optimization
  - **Prompt:** "React page to fetch compliance balance for selected ships on button click only, not on every input change"
  - **Output Generated:** Initial code triggered API calls on input change.
  - **Correction:** Modified `useEffect` and moved API call inside `createPool` button handler to prevent unnecessary requests.

## Validation / Corrections
- Seed script was verified by running `npx prisma db seed` and confirming the data in PostgreSQL.
- Banking and Pooling use-cases were manually tested using Postman and frontend dashboard to ensure correct CB calculations.
- Refactored comparison logic to handle edge cases where baseline is missing or deficit exceeds banked surplus.

## Observations
- **Saved Time:** Generating boilerplate, TypeScript interfaces, and repetitive Prisma CRUD code.
- **Failures / Hallucinations:** Initially AI suggested per-input API calls in React which caused multiple requests; had to adjust manually.
- **Effective Combination:** Used ChatGPT for logic and explanations, Copilot for inline completions, and Claude Code to review complex functions for type safety and correctness.

## Best Practices Followed
- Always verify AI-generated code with local testing.
- Keep AI suggestions modular; do not copy blindly.
- Combine AI agents: ChatGPT for guidance, Copilot for scaffolding, Claude Code for refactoring and reviewing.
- Maintain TypeScript strict mode and proper type definitions to catch errors early.
