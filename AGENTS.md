AGENTS — linkuparena quick reference

Build / Run
- Dev (www): cd packages/www && bun run dev
- Start (preview): cd packages/www && bun run serve
- Build: cd packages/www && bun run build  # runs `vite build && tsc`
- Test (all): cd packages/www && bun test      # uses vitest
- Test single file: cd packages/www && bunx vitest src/test/index.ts
- Test by name: cd packages/www && bunx vitest -t "<name pattern>"
- Type-check: cd packages/www && bunx tsc --noEmit
- Format check: bunx prettier --check . (see .prettierrc)

Code style & conventions
- Formatting: Prettier is configured (tabWidth=4, printWidth=120)
- Modules: use ESM imports (import ... from ...). Prefer package-local absolute imports, relative for siblings.
- Types: prefer explicit public API types, use `unknown` for external inputs and narrow with guards/zod.
- Naming: camelCase for vars/functions, PascalCase for components/types/classes, UPPER_SNAKE for constants.
- Error handling: validate inputs, throw Errors or custom subclasses; do not silently swallow errors; log context for workers.
- Tests: use vitest; write isolated, descriptive tests; mock network/worker APIs when needed.
- Commits: avoid secrets, add .env placeholders if adding env requirements.

Cursor / Copilot rules
- No .cursor rules (/.cursor) or .github/copilot-instructions.md detected in repo.

Agent workflow notes
- Keep edits small; run tsc and vitest after changes; prefer running the exact package folder (packages/www).
