# `<dw-select-trigger>`

A Input Text Field lets user to enter or edit existing texts.
3 Variants:

1. Editable
2. Non-Editable
3. Read-Only

## Behaviours

- Hover:
  - Not applicable when `readOnly = true`.
- Focus:
  - When `inputAllowed = false`, the host element is focusable. Otherwise, an input control inside the host is focusable; and all texts are auto-selected on focus.
  - Border is changed to primary color; Label floats up with animation - when has no value; otherwise it would already be there (it's proper position).
- Trailing Icon:
  - When `opened = false`, it’s down arrow.
  - When `opened = true`, it’s an up arrow.
  - When `opened` property is changed, Trailing Icon is changed through animation.
- When inputAllowed = true, Syncs value property with Input’s value as user types (on input event from it).

## API

### Properties/Attributes

| Name               | Type      | Description                                                                                                         |
| ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------- |
| `value`            | `string`  | Text to be shown as the value (inside input control). When `inputAllowed=true`, user typed value is reflected here. |
| `label`            | `string`  | Sets floating label value.                                                                                          |
| `placeholder`      | `string`  | Sets disappearing input placeholder.                                                                                |
| `helper`           | `string`  | Helper text to display below the input. It's displayed only when this is focused.                                   |
| `outlined`         | `boolean` | Set to `true` when input should be shown in Outline variant of the Material Design Input.                           |
| `updatedHighlight` | `boolean` | Input Property. When `true`, shows updated highlights.                                                              |
| `opened`           | `boolean` | Default value: `false`. Trailing Icon is shown based on this.                                                       |
| `readOnly`         | `boolean` | Set to `true` to show in read-only variant.                                                                         |
| `inputAllowed`     | `boolean` | When `true` user is allowed to type. Ignored when `readOnly=true`                                                   |
| `error`            | `boolean` | When `true`, helper text isn’t visible. Instead, `errorMesage` is shown (in-place of helper text) in error style.   |
| `errorMessage`     | `string`  | Message to be shown in the error color in-place of helper text when the textfield is invalid.                       |

### Events

| Event Name | Target | Detail | Description                                                                                                                                 |
| ---------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`    |        |        | Dispatched when user updates input value. So, dispatched only when `inputAllowed=true`. `value` is changed before this event is dispatched. |
