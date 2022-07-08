# `<dw-select-dialog>`

renders the list of choices using `dw-list-item` or custom templete provider `renderItem`

## Behaviours

- When opened, Auto-scrolls such that the selected item is in the viewport.

### Type of dialog

- vkb = true & searchable = true then "fit"
- layout = small then "bottom sheet"
- otherwise "popover"

### Initial rendering

- When `items` is `undefined`, rendered loading view
- When `items` is an empty array:
  - If a query is not specified, renders “No Records”
  - If a query is specified, renders “No matching records found”
- Header:
  - When vkb=true & searchable=true then renders input in the header.
  - Otherwise, // TODO

### Items & Groups rendering

- When groups aren’t specified renders all items, without any group.
- When groups are specified renders items in their groups:
  - Groups are rendered as per their array position.
  - Items relative orders are still preserved within a group.
- When a Group is collapsed, its items aren’t rendered.
- When an item doesn’t fall under any group, it’s dropped with a WARN log.

### Mouse Interaction

- When an item is clicked, select it (value is changed); the selected event is dispatched for it.
- When a collapsible Group Item is clicked, its collapsed property is toggled. And as a result list of items of that group becomes visible/hidden.

### Keyboard Interaction

#### Navigation

- On the up/down arrow key:
  - If the activated item is there, its previous or next item is activated.
  - If value, Previous/Next Item of the Item represented by value is activated.
  - The first item is activated.

#### Selection or Collapse/Expand

- On Enter:
  - If activate item is Group Item, Group is collapsed/expanded.
  - If activate item is Regular Item, it gets selected. (value is changed); the selected event is dispatched for it.
- Search
  - On input from dialog-input, a query is updated in debounced manner, 100ms.
  - When a query is changed, filters & highlights items.

## API

### Properties/Attributes

| Name              | Type                | Default     | Description                                                                                                                                                                                                                                                          |
| ----------------- | ------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`           | `object\|object[]`  | `undefined` | Selected list item object. `object` in case of single selection, `object[]` in case of multiple selections.                                                                                                                                                          |
| `elInput`         | `HTMLElement\|null` | `null`      | Input Property **NOTE:** When specified, it binds keyboard event on this; Otherwise, it renders its own input in the header. The integrator will set this value only for non-touch devices.                                                                          |
| `_query`          | `string`            | `""`        | a search query in string. used to filter items and highlight query keywords                                                                                                                                                                                          |
| `searchable`      | `boolean`           | `false`     | Whether or not to show the `searchable` variant.                                                                                                                                                                                                                     |
| `layout`          | `string`            | `""`        | Represents current layout in String. Possible values: `small`, `medium`, `large`, `hd`, and `fullhd`.                                                                                                                                                                |
| `vkb`             | `boolean`           | `false`     | `vkb` stands for Virtual Keyboard. Whether the Device has a Virtual keyboard or not.                                                                                                                                                                                 |
| `groups`          | `Group[]`           | `undefined` | Input Property. A Group has properties: name, label, collapsible, collapsed.                                                                                                                                                                                         |
| `_groups`         | `object`            | `undefined` | When groups are changed it’s updated (through the cloned array). When the user interacts, this property is changed but `groups` isn’t.                                                                                                                               |
| `groupSelector`   | `fn()`              |             | returns GroupName. Group selector provides a path of groupName in Items                                                                                                                                                                                              |
| `groupExpression` | `string`            | `""`        |
| `items`           | `object[]`          | `undefined` | List of selectable items.                                                                                                                                                                                                                                            |
| `_items`          | `object[]`          | `undefined` | Represents items to be rendered by lit-virtualizer. It’s computed from `_groups`, items & query. { type: GROUP or ITEM, value: Group or Item object }                                                                                                                |
| `_activatedItem`  | `object`            | `null`      | Activated item. One of the Item from `_items`, by reference.                                                                                                                                                                                                         |
| `valueProvider`   | `fn()`              |             | Provides Value                                                                                                                                                                                                                                                       |
| `valueExpression` | `string`            | `_id`       |
| `messages`        | `object`            | `{}`        | Messages of for noRecords and noMatchingRecords. Example: {noRecords: "", noMatchingRecords: ""}.                                                                                                                                                                    |
| `renderItem`      | `HTMLTemplate`      | `undefined` | Provides any Block element to represent list items. Should show its hover effect, and ripple on click. Highlight text based on `query`. Integrator listens to the ‘click’ event to know whether the selection is changed or not. **Note:** It must not be focusable. |
| `renderGroupItem` | `HTMLTemplate`      | `undefined` | Provides any Block elements to represent group items. name property should be set to input name. Should show hover & ripple effects only if it’s collapsible. Integrator listens on ‘click’ event to toggle collapsed status.                                        |

### Events

| Event Name | Target         | Detail | Description                                                                                                      |
| ---------- | -------------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| `selected` | `dw-list-item` |        | Fired when the user changed selection. It’s dispatched even when the user selects the same value as the current. |
