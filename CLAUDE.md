# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
yarn start        # dev server at http://localhost:8005 (opens demo/index.html)
```

No test suite is configured (`yarn test` exits with an error). There is no build step — the package ships as ES modules directly.

Releases are managed by `semantic-release` on the `master` branch. Feature branches (prefixed `feature/`) publish as prereleases automatically via CI.

## Code Style

Prettier config (in `package.json`): `singleQuote: true`, `arrowParens: "avoid"`, `printWidth: 140`.

## Architecture

This is a LitElement web component library providing `<dw-select>` (single) and `<dw-multi-select>` (multiple) dropdown components in Material Design style.

### Component structure

Each select variant is split into three layers:

```
<dw-select> / <dw-multi-select>          ← orchestrator
  ├── <dw-select-trigger>                ← visible input field (extends DwInput)
  │     dispatches: expand-toggle, clear-selection
  └── <dw-select-base-dialog>            ← dropdown dialog
        ├── <dw-select-dialog-input>     ← search input inside dialog
        ├── <dw-select-group-item>       ← collapsible group header rows
        └── @lit-labs/virtualizer        ← activated when items > 500
```

The orchestrator coordinates state between trigger and dialog — it owns `value`, `items`, layout detection, and validation.

### Key modules

| File | Role |
|------|------|
| `dw-select.js` | Single-select orchestrator: validation, dialog type selection, value resolution |
| `dw-multi-select.js` | Multi-select orchestrator: array value, Select All, apply/cancel flow |
| `dw-select-base-dialog.js` | Item filtering, keyboard nav, group collapse, virtualization, scroll-to-selected |
| `dw-multi-select-base-dialog.js` | Adds checkbox toggle, Select All (≥10 items), apply button |
| `utils.js` | `KeyCode`, `Direction`, `filter()`, `queryFilterGenerator()`, `NEW_VALUE_STATUS` |
| `sort-items.js` | `sortItems()` — relevance scoring (prefix match > word match > exact word) |

### Adaptive dialog types

Dialog type is selected at runtime based on `@dreamworld/device-info` layout:

| Type | When |
|------|------|
| `popover` | Default on desktop; also forced by `popover` property |
| `fit` | Full-height with integrated search when list overflows |
| `modal` | Centered overlay |
| `bottom-sheet` | Mobile (`small` layout / virtual keyboard visible) |

### Form integration

Both components apply `DwFormElement(LitElement)` mixin (from `@dreamworld/dw-form`) which injects `checkValidity()`, `reportValidity()`, `validate()`, and the `name` attribute for standard form participation.

### Pluggable strategy properties

Behavior is customized through function properties rather than subclassing: `valueProvider`, `queryFilter`, `renderItem`, `renderGroupItem`, `newItemProvider`, `groupSelector`, `valueEquator`, `helperTextProvider`. The dialog passes these through from the orchestrator to child components.

### Dependencies of note

- `@dreamworld/dw-dialog` — base `DwCompositeDialog` that all dialogs extend
- `@dreamworld/dw-input` — base class extended by both trigger components
- `@dreamworld/pwa-helpers` — re-exports `html`, `css`, `LitElement`, `nothing` from Lit
- `lodash-es` — used for `find`, `debounce`, `isEmpty`, `sortBy`
- `@lit-labs/virtualizer` — virtual scroll, enabled automatically above 500 items (`VIRTUAL_LIST_MIN_LENGTH`)
