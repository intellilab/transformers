# Project Rules

## Tech Stack

- **Framework**: Nuxt 4 SPA with Vue 3 and TypeScript
- **Styling**: Tailwind CSS via `@nuxt/ui` components
- **Icons**: Material Design Icons (`@iconify-json/mdi`) — use `i-mdi-*` prefix
- **Editor**: CodeMirror 6 with language extensions (YAML, JSON, HTML)
- **Testing**: Vitest

## Conventions

- Component files use kebab-case (`tool-rail.vue`, `snapshot-panel.vue`)
- Components are used in PascalCase in templates (`<ToolRail>`, `<SnapshotPanel>`)
- Use `UTooltip` for tooltips on icon-only buttons
- Never add `:delay` to tooltips unless explicitly requested
