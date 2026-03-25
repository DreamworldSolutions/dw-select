# `<dw-select>` / `<dw-multi-select>` [![Published on npm](https://img.shields.io/npm/v/@dreamworld/dw-select.svg)](https://www.npmjs.com/package/@dreamworld/dw-select)

A mobile-first, single and multiple select / auto-complete solution in Material Design style, built with LitElement. Supports grouping, virtualization for large lists, keyboard navigation, form validation, and adaptive dialog types (popover, modal, fit, bottom-sheet).

---

## 1. User Guide

### Installation & Setup

```sh
npm install @dreamworld/dw-select
```

```javascript
// Single select
import '@dreamworld/dw-select';

// Multi-select
import '@dreamworld/dw-multi-select';
```

---

### Basic Usage

#### Single Select (Default)

```html
<dw-select
  label="Country"
  .items="${this.items}"
  valueExpression="_id"
  .valueTextProvider="${(item) => item.name}"
></dw-select>
```

#### Single Select (Outlined, Pre-selected)

```html
<dw-select
  outlined
  label="Country"
  .items="${this.items}"
  .value="${this.selectedItem}"
  .valueProvider="${(item) => item.id}"
  .valueTextProvider="${(item) => item.name}"
></dw-select>
```

#### Single Select (Searchable)

```html
<dw-select
  outlined
  searchable
  label="Bank"
  .items="${this.items}"
  .valueTextProvider="${(item) => item.name}"
></dw-select>
```

#### Multi-Select

```html
<dw-multi-select
  outlined
  label="Tags"
  .items="${this.items}"
  .value="${this.selectedValues}"
  .valueTextProvider="${(item) => item.label}"
  @change="${(e) => this.selectedValues = e.target.value}"
></dw-multi-select>
```

---

### API Reference — `<dw-select>`

#### Properties / Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | `""` | Sets the `name` attribute on the internal input. Used for browser autofill only. |
| `value` | `object` | `null` | The currently selected item object. Set programmatically to change selection. |
| `originalValue` | `object` | `undefined` | When specified and different from `value` (by reference), a highlight is shown. Requires `highlightChanged=true`. |
| `highlightChanged` | `boolean` | `false` | When `true`, highlights the field when `value !== originalValue` (by reference). |
| `outlined` | `boolean` | `false` | Shows the outlined Material variant. |
| `label` | `string` | `""` | Floating label text. |
| `placeholder` | `string` | `""` | Disappearing input placeholder. |
| `helper` | `string` | `""` | Helper text displayed below the input (visible on focus by default). |
| `helperPersistent` | `boolean` | `false` | Always shows helper text regardless of focus state. |
| `readOnly` | `boolean` | `false` | Read-only display state. Reflects as `read-only` attribute. |
| `required` | `boolean` | `false` | Applies required validation; shows error on blur if empty. |
| `error` | `string \| Function` | `undefined` | Custom error message. Can be a string or a function returning a string. |
| `errorMessages` | `object` | `undefined` | Error state messages object. |
| `autoValidate` | `boolean` | `false` | Reports validity on value change rather than only on blur. |
| `disabled` | `boolean` | `false` | Disables the component. |
| `searchable` | `boolean` | `false` | Enables search/filter input in the dialog. |
| `extraSearchFields` | `string[]` | `undefined` | Additional item fields to include in search filtering. |
| `groups` | [`Group[]`](#group) | `null` | List of group definitions for grouping items. |
| `groupSelector` | `Function` | `undefined` | `(item) => groupName`. Identifies the group of an item. Takes precedence over `groupExpression`. |
| `groupExpression` | `string` | `""` | Dot-separated property path on item to find its group name. Ignored if `groupSelector` is set. |
| `items` | `object[]` | `undefined` | Array of selectable items. When `undefined`, shows a loading state. |
| `prependItems` | `object[]` | `[]` | Items always shown at the top of the list (e.g., "All", "None"). |
| `valueProvider` | `Function` | `undefined` | `(item) => value`. Extracts the value from an item. Takes precedence over `valueExpression`. |
| `valueExpression` | `string` | `"_id"` | Dot-separated property path on item to extract its value. Used when `valueProvider` is not set. |
| `valueTextProvider` | `Function` | `(item) => item` | `(item) => string`. Returns the display text for an item. |
| `valueEquator` | `Function` | `(v1, v2) => v1 === v2` | Custom equality check for value comparison. |
| `dialogWidth` | `number` | `undefined` | Override width (px) for popover and fit dialogs. Bottom-sheet is always full-width. |
| `renderItem` | `Function` | `undefined` | `(item, selected, activated, query) => HTMLTemplate`. Custom item template. Must not be focusable. |
| `renderGroupItem` | `Function` | `undefined` | `(name, label, collapsible, collapsed, activated) => HTMLTemplate`. Custom group item template. |
| `heading` | `string` | `""` | Heading shown on the bottom-sheet dialog. |
| `showClose` | `boolean` | `false` | Shows a close icon-button in the top-right corner of the bottom-sheet dialog. |
| `selectedTrailingIcon` | `string` | `undefined` | Material icon name shown as trailing icon on the selected item in the list. |
| `messages` | [`Messages`](#messages) | See [Messages](#messages) | Override dialog state messages. |
| `searchPlaceholder` | `string` | `""` | Placeholder for the fit dialog's search input. |
| `helperTextProvider` | `Function` | `undefined` | `(item) => string`. Provides helper text based on the selected item. Overrides `helper` when set. |
| `queryFilter` | `Function` | `undefined` | `(item, query) => boolean`. Custom search filter function. |
| `highlightQuery` | `boolean` | `true` | When `false`, disables highlighting of matched words in the list. |
| `allowNewValue` | `boolean` | `false` | Allows creating a new value from the search query. Only works when `searchable=true`. |
| `newItemProvider` | `Function` | `undefined` | `(query) => {item, hint} \| Promise`. Builds a new item from the typed query. Return `undefined` or `{item: undefined}` when query is incomplete. |
| `newItems` | `object` | `undefined` | Hash of item IDs to treat as new: `{id1: true, id2: true}`. Works independently of `allowNewValue`. |
| `warning` | `string` | `undefined` | Warning message text. |
| `dense` | `boolean` | `false` | Uses dense styling on the trigger element. |
| `popover` | `boolean` | `false` | Forces the popover dialog type. |
| `popoverStyles` | `object` | `undefined` | External styles applied to the popover dialog. |
| `autoComplete` | `boolean` | `false` | Enables auto-complete mode. |
| `readOnlyTrigger` | `boolean` | `false` | Shows read-only mode with a trigger icon instead of an input. |
| `highlightedValue` | `boolean` | `false` | When `true`, shows the value in highlighted (headline6) style. Reflects as `highlighted-value`. |
| `interactiveDialog` | `boolean` | `false` | Makes the dialog interactive (delegates pointer events). |
| `iconButtonSize` | `number` | `undefined` | Size (px) for the trailing icon button in the trigger. |
| `hintInTooltip` | `boolean` | `false` | Shows hint text in a tooltip triggered by an info icon. |
| `errorInTooltip` | `boolean` | `false` | Shows error text in a tooltip triggered by an error icon. |
| `warningInTooltip` | `boolean` | `false` | Shows warning text in a tooltip triggered by a warning icon. |
| `hintTooltipActions` | [`Action[]`](#action) | `undefined` | Actions shown inside the hint tooltip. Dispatches `action` event on click. |
| `errorTooltipActions` | [`Action[]`](#action) | `undefined` | Actions shown inside the error tooltip. |
| `warningTooltipActions` | [`Action[]`](#action) | `undefined` | Actions shown inside the warning tooltip. |
| `tipPlacement` | `string` | `""` | Tooltip placement. See [Tippy.js placement docs](https://atomiks.github.io/tippyjs/v6/all-props/#placement). |

#### Methods

| Name | Signature | Returns | Description |
|------|-----------|---------|-------------|
| `checkValidity` | `checkValidity()` | `boolean` | Returns `true` if valid; fires `valid` event. Returns `false` and fires `invalid` event otherwise. |
| `reportValidity` | `reportValidity()` | `boolean` | Runs `checkValidity()` and reports validation state to the user. |
| `validate` | `validate()` | `boolean` | Validates input. Returns `false` if value is invalid. |
| `focus` | `focus()` | `void` | Focuses the trigger element. |

**Getter:**

| Name | Returns | Description |
|------|---------|-------------|
| `item` | `object` | The full item object corresponding to the current `value`. |

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | none | Fired when the user changes selection. Not fired when the same value is re-selected. |
| `selected` | none | **Deprecated.** Use `change` instead. |
| `valid` | `ValidityState` | Fired when `checkValidity()` passes. |
| `invalid` | `ValidityState` | Fired when `checkValidity()` fails (also on blur). |
| `clear-selection` | none | Fired when the user explicitly clears the selection by removing all input text (searchable only). |
| `dw-dialog-opened` | none | Fired when the dropdown dialog opens. |
| `dw-dialog-closed` | none | Fired when the dropdown dialog closes. |

#### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--dw-select-item-selected-bg-color` | `#6200ee` | Background color of the selected item in the list. |
| `--dw-select-selected-item-bg-opacity` | `0` | Opacity of the selected item background. |
| `--dw-select-highlight-bg-color` | `#fde293` | Background color for query-match highlights. |
| `--dw-select-highlight-text-color` | — | Text color for query-match highlights. |
| `--dw-select-highlight-font-weight` | — | Font weight for query-match highlights. |
| `--dw-select-shimmer-gradient` | `linear-gradient(to right, #f1efef, #f9f8f8, #e7e5e5)` | Shimmer gradient shown while `items` is loading. |
| `--dw-select-content-padding` | — | Padding inside the dialog content area. |
| `--dw-select-read-only-trigger-value-color` | — | Text color for the value in `readOnlyTrigger` mode. |
| `--dw-select-trigger-label-padding` | `0px 38px 0px 0px` | Padding of the trigger's label. |
| `--dw-select-trigger-trailing-icon-margin-right` | `4px` | Right margin of the trailing icon in the trigger. |
| `--dw-popover-min-width` | `0px` | Minimum width of the popover dialog. |
| `--modal-dialog-header-max-height` | `56px` | Maximum height of the modal dialog header. |
| `--mdc-theme-primary` | `#6200ee` | Primary color (used for selected item, focus ring). |
| `--mdc-theme-error` | `#b00020` | Error color. |

---

### API Reference — `<dw-multi-select>`

#### Properties / Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | `""` | Sets the `name` attribute on the internal input. |
| `value` | `object[]` | `[]` | Array of selected item values. |
| `outlined` | `boolean` | `false` | Shows the outlined Material variant. |
| `label` | `string` | `""` | Floating label text. |
| `placeholder` | `string` | `""` | Disappearing input placeholder. |
| `error` | `string \| Function` | `undefined` | Custom error message. |
| `errorMessages` | `object` | `undefined` | Error state messages object. |
| `autoValidate` | `boolean` | `false` | Reports validity on value change rather than only on blur. |
| `disabled` | `boolean` | `false` | Disables the component. |
| `searchable` | `boolean` | `false` | Enables search/filter input in the dialog. Shown automatically when items > 10. |
| `extraSearchFields` | `string[]` | `undefined` | Additional item fields to include in search filtering. |
| `groups` | [`Group[]`](#group) | `null` | List of group definitions. |
| `groupSelector` | `Function` | `undefined` | `(item) => groupName`. Takes precedence over `groupExpression`. |
| `groupExpression` | `string` | `""` | Dot-separated property path to find item's group. |
| `items` | `object[]` | `undefined` | Array of selectable items. |
| `valueProvider` | `Function` | `undefined` | `(item) => value`. Extracts value from an item. |
| `valueExpression` | `string` | `"_id"` | Dot-separated path to extract item value. |
| `valueTextProvider` | `Function` | `(item) => item` | `(item) => string`. Returns display text for an item. |
| `valueEquator` | `Function` | `(v1, v2) => v1 === v2` | Custom equality check for value comparison. |
| `dialogWidth` | `number` | `undefined` | Override width (px) for popover and fit dialogs. |
| `renderItem` | `Function` | `undefined` | `(item, selected, activated, query) => HTMLTemplate`. Custom item template. |
| `renderGroupItem` | `Function` | `undefined` | `(name, label, collapsible, collapsed, activated) => HTMLTemplate`. Custom group item template. |
| `heading` | `string` | `""` | Heading shown on the bottom-sheet dialog. |
| `showClose` | `boolean` | `false` | Shows a close icon-button on the bottom-sheet dialog. |
| `selectedTrailingIcon` | `string` | `undefined` | Material icon name on selected item in the list. |
| `messages` | [`Messages`](#messages-multi) | See [Messages (multi)](#messages-multi) | Override dialog state messages. |
| `queryFilter` | `Function` | `undefined` | `(item, query) => boolean`. Custom search filter. |
| `highlightQuery` | `boolean` | `true` | When `false`, disables match highlighting. |
| `warning` | `string` | `undefined` | Warning message text. |
| `dense` | `boolean` | `false` | Uses dense styling on the trigger element. |
| `popover` | `boolean` | `false` | Forces the popover dialog type. |
| `popoverStyles` | `object` | `undefined` | External styles applied to the popover dialog. |
| `hasItemLeadingIcon` | `boolean` | `false` | When `true`, moves the checkbox to the right side of items (leading icon is on the left). |
| `iconButtonSize` | `number` | `undefined` | Size (px) for the trailing icon button in the trigger. |

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | none | Fired when the applied selection changes. |
| `dw-multi-select-opened` | none | Fired when the dropdown dialog opens. |
| `dw-multi-select-closed` | none | Fired when the dropdown dialog closes. |

#### CSS Custom Properties

Inherits all CSS custom properties from `<dw-select>`, plus:

| Property | Default | Description |
|----------|---------|-------------|
| `--dw-multi-select-trigger-trailing-icon-margin-right` | `4px` | Right margin of the trailing icon in the multi-select trigger. |

---

### Type Reference

#### Group

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `name` | `string` | Yes | Unique identifier for the group. |
| `title` | `string` | Yes | Display name shown as the group header. |
| `collapsible` | `boolean` | Yes | Whether the group can be collapsed by the user. |
| `collapsed` | `boolean` | Yes | Initial collapse state. |
| `icon` | `string` | No | Material icon name shown alongside the group title. |

```javascript
// Example
const group = {
  name: 'BANKS',
  title: 'Banks',
  collapsible: true,
  collapsed: false,
  icon: 'account_balance'
};
```

#### Action

| Key | Type | Description |
|-----|------|-------------|
| `name` | `string` | Action identifier (available in the `action` event). |
| `label` | `string` | Display label for the action button. |
| `danger` | `boolean` | When `true`, renders the action in a danger/red style. |

#### Messages (single select) {#messages}

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `noRecords` | `string` | `"No Records"` | Shown when `items` is an empty array. |
| `noMatching` | `string` | `"No matching records found!"` | Shown when the search query yields no results. |
| `loading` | `string` | `"Loading..."` | Shown when `items` is `undefined`. |

#### Messages (multi-select) {#messages-multi}

Same keys as single-select, plus:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `selectAll` | `string` | `"Select All"` | Label for the Select All option. |
| `searchPlaceholder` | `string` | `"Search..."` | Placeholder for the search input inside the dialog. |

#### ValueProvider and ValueExpression

- If **neither** is provided, the entire item object is used as the value.
- If only `valueExpression` is provided, the value is extracted from that dot-separated path.
- If only `valueProvider` is provided, the function is called with the item.
- If **both** are provided, `valueExpression` takes precedence and `valueProvider` is ignored.

---

### Configuration Options

These constants are defined internally in `dw-select-base-dialog.js` and `dw-multi-select-base-dialog.js` and control virtualization and scroll behavior:

| Constant | Value | Description |
|----------|-------|-------------|
| `VIRTUAL_LIST_MIN_LENGTH` | `500` | Item count threshold above which `@lit-labs/virtualizer` is enabled. |
| `VIRTUAL_LIST_AUTO_SCROLL_DELAY` | `500` ms | Delay before auto-scrolling to the selected item when the virtualizer is active. |
| `REGULAR_LIST_SCROLL_DELAY` | `300` ms | Delay before auto-scrolling to the selected item in a regular (non-virtualized) list. |

---

### Advanced Usage

#### Groups with Collapsible Sections

```javascript
// In your LitElement component
get groups() {
  return [
    { name: 'PUBLIC', title: 'Public Banks', collapsible: true, collapsed: false },
    { name: 'PRIVATE', title: 'Private Banks', collapsible: true, collapsed: true }
  ];
}

get items() {
  return [
    { _id: 1, name: 'SBI', group: 'PUBLIC' },
    { _id: 2, name: 'HDFC', group: 'PRIVATE' }
  ];
}
```

```html
<dw-select
  .groups="${this.groups}"
  .items="${this.items}"
  groupExpression="group"
  .valueTextProvider="${(item) => item.name}"
></dw-select>
```

#### Allow New Value (Searchable Only)

When `allowNewValue=true` and the query does not match any item, a new item can be created via `newItemProvider`.

```html
<dw-select
  searchable
  allowNewValue
  .items="${this.items}"
  .newItemProvider="${this._newItemProvider}"
  .valueTextProvider="${(item) => item.name}"
></dw-select>
```

```javascript
// newItemProvider: returns {item, hint} or undefined, or a Promise resolving to either
_newItemProvider(query) {
  if (query.length < 2) return undefined;
  return { item: { _id: query, name: query }, hint: 'Press Enter to add' };
}
```

The `newItemProvider` function receives the current search query and must return:
- `{item: Item, hint: string}` — a new item and optional hint text shown on the input
- `undefined` or `{item: undefined}` — when the query is not yet complete
- A `Promise` resolving to either of the above

#### Custom Item Rendering

```javascript
// renderItem: (item, selected, activated, query) => HTMLTemplate
renderItem(item, selected, activated, query) {
  return html`
    <dw-list-item
      .selected="${selected}"
      .activated="${activated}"
      title1="${item.name}"
      title2="${item.code}"
    ></dw-list-item>
  `;
}
```

```html
<dw-select .renderItem="${this.renderItem}"></dw-select>
```

#### Custom Search Filter

```javascript
import { queryFilterGenerator } from '@dreamworld/dw-select/utils.js';

// Search across multiple fields
const filter = queryFilterGenerator(['name', 'code', 'alias']);

// Or provide a fully custom filter
const customFilter = (item, query) => item.name.toLowerCase().startsWith(query.toLowerCase());
```

```html
<dw-select searchable .queryFilter="${filter}"></dw-select>
```

#### Prepend Items

```javascript
get prependItems() {
  return [{ _id: null, name: '— None —' }];
}
```

```html
<dw-select .prependItems="${this.prependItems}" .items="${this.items}"></dw-select>
```

#### Tooltip Variants

```html
<!-- Show helper text in tooltip on info icon -->
<dw-select
  hintInTooltip
  helper="Start typing to filter results"
></dw-select>

<!-- Show error in tooltip with an action -->
<dw-select
  errorInTooltip
  .errorTooltipActions="${[{ name: 'fix', label: 'Fix Now', danger: false }]}"
  @action="${(e) => console.log(e.detail.name)}"
></dw-select>
```

#### Form Validation Integration

```javascript
// Programmatic validation
const select = document.querySelector('dw-select');

// Check validity without showing UI
const isValid = select.checkValidity();

// Check validity and show error to user
const isValid = select.reportValidity();

// Custom validate call
const isValid = select.validate();
```

```html
<dw-select required autoValidate label="Required Field"></dw-select>
```

---

## 2. Developer Guide / Architecture

### Architecture Overview

```
<dw-select>                          <dw-multi-select>
├── DwFormElement(LitElement) mixin  ├── DwFormElement(LitElement) mixin
├── <dw-select-trigger>              ├── <dw-multi-select-trigger>
│   └── extends DwInput              │   └── extends DwInput
└── <dw-select-base-dialog>          └── <dw-multi-select-base-dialog>
    ├── extends DwCompositeDialog        ├── extends DwCompositeDialog
    ├── <dw-select-dialog-input>         ├── <dw-multi-select-dialog-input>
    ├── <dw-select-group-item>           └── <dw-multi-select-group-item>
    └── @lit-labs/virtualizer
```

### Design Patterns

| Pattern | Implementation |
|---------|---------------|
| **Mixin** | `DwFormElement(LitElement)` injects standard form validation API (`checkValidity`, `reportValidity`, `validate`, `name`) into both components. |
| **Composite / Delegation** | Each select component is split into a trigger (display) and a dialog (selection logic). The orchestrator (`dw-select.js`) coordinates state between the two. |
| **Observer (Reactive Properties)** | LitElement's `@property` decorator pattern drives all UI updates declaratively. |
| **Strategy** | `valueProvider`, `queryFilter`, `renderItem`, and `renderGroupItem` are pluggable function properties, allowing integrators to override behavior without subclassing. |
| **Virtualizer** | `@lit-labs/virtualizer` is activated automatically when the rendered item count exceeds `VIRTUAL_LIST_MIN_LENGTH` (500), ensuring smooth performance with large datasets. |
| **Responsive / Adaptive** | `@dreamworld/device-info` provides the current layout (`small`, `medium`, `large`, `hd`, `fullhd`). The dialog type is chosen accordingly — bottom-sheet on mobile, popover/fit on desktop. |

### Module Responsibilities

| Module | Responsibility |
|--------|---------------|
| `dw-select.js` | Orchestrator for single select. Manages validation, layout detection, value resolution, and delegates rendering to trigger + dialog. |
| `dw-multi-select.js` | Orchestrator for multi-select. Adds array-value management, "Select All" logic, and apply/cancel flow. |
| `dw-select-trigger.js` | The visible input field. Extends `DwInput`. Renders the trailing expand/clear icon and dispatches `expand-toggle` and `clear-selection` events. |
| `dw-multi-select-trigger.js` | Same as above for multi-select. Extends `DwInput`. |
| `dw-select-base-dialog.js` | Dialog for single select. Handles item filtering, keyboard navigation, group collapse, highlight, virtualization, and scroll-to-selected. |
| `dw-multi-select-base-dialog.js` | Dialog for multi-select. Adds checkbox toggle, "Select All" when ≥10 items, and an apply/done button. |
| `dw-select-dialog-input.js` | Search input component rendered inside the single-select dialog. Dispatches `input-change`, `cancel`, and `clear-selection`. |
| `dw-multi-select-dialog-input.js` | Search input for the multi-select dialog. |
| `dw-select-group-item.js` | Renders collapsible group header rows. Shows expand/collapse icon and ripple only when `collapsible=true`. |
| `dw-multi-select-group-item.js` | Renders non-collapsible group header rows for multi-select. |
| `utils.js` | Exports `KeyCode`, `Direction`, `Position`, `NEW_VALUE_STATUS`, `filter()`, and `queryFilterGenerator()`. |
| `sort-items.js` | Exports `sortItems()`. Scores items by relevance to the query (prefix match, word match, exact word match) and returns them sorted. |

### Dialog Types & Adaptive Layout

The dialog type is selected automatically based on device layout and item count:

| Dialog Type | When Used |
|-------------|-----------|
| `popover` | Default on desktop. Anchored to the trigger element. |
| `fit` | Full-height dialog with integrated search input. Used when item list overflows. |
| `modal` | Centered modal overlay. |
| `bottom-sheet` | On mobile (`small` layout / virtual keyboard present). |

The `popover` property on both components can force popover mode regardless of layout.

### Utility Functions

#### `filter(value, query)` — `utils.js`

```javascript
import { filter } from '@dreamworld/dw-select/utils.js';
filter('HDFC Bank', 'hdfc bank'); // true
filter('State Bank of India', 'bank india'); // true
filter('HDFC Bank', 'icici'); // false
```

Returns `true` if every word in `query` appears (as a substring) in at least one word of `value`. Case-insensitive.

#### `queryFilterGenerator(keys)` — `utils.js`

```javascript
import { queryFilterGenerator } from '@dreamworld/dw-select/utils.js';

const filter = queryFilterGenerator(['name', 'shortCode', 'alias']);
// Returns: (item, query) => boolean
```

Generates a filter function that concatenates the specified `keys` from an item and runs `filter()` against the query.

#### `sortItems(items, valueTextProvider, extraSearchFields, query)` — `sort-items.js`

```javascript
import { sortItems } from '@dreamworld/dw-select/sort-items.js';

const sorted = sortItems(items, (item) => item.name, ['code'], 'hdfc');
```

Sorts `items` by relevance to `query`. Scoring (lower = better):
- `-1` if item text starts with the query
- `-1` for each query word found anywhere in item text
- `-1` for each exact word match

#### `NEW_VALUE_STATUS` — `utils.js`

```javascript
import { NEW_VALUE_STATUS } from '@dreamworld/dw-select/utils.js';

// NEW_VALUE_STATUS.IN_PROGRESS — item is being created (spinner shown)
// NEW_VALUE_STATUS.NEW_VALUE   — item was created (shows "new" tag)
// NEW_VALUE_STATUS.ERROR       — creation failed (error shown)
```

### Dependencies

| Package | Purpose |
|---------|---------|
| `@dreamworld/device-info` | Detects device layout for adaptive dialog selection |
| `@dreamworld/dw-button` | Button component used in dialog footers |
| `@dreamworld/dw-dialog` | Base composite dialog implementation |
| `@dreamworld/dw-form` | `DwFormElement` mixin for form participation |
| `@dreamworld/dw-icon` | Icon rendering |
| `@dreamworld/dw-icon-button` | Trailing icon buttons in triggers |
| `@dreamworld/dw-input` | Base input element extended by triggers |
| `@dreamworld/dw-list-item` | Default item renderer inside dialogs |
| `@dreamworld/dw-ripple` | Ripple interaction effect |
| `@dreamworld/dw-tooltip` | Hint / error / warning tooltips |
| `@dreamworld/material-styles` | Material typography and theme tokens |
| `@lit-labs/virtualizer` | Virtual scroll for large item lists |
| `@material/mwc-circular-progress` | Loading spinner |
| `lodash-es` | Utility functions (`find`, `debounce`, `isEmpty`, `sortBy`, etc.) |
