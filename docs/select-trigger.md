# `<dw-select-trigger>`

Text fields let users enter or exit text. Two type of Text fiels, editable and non-editable.

## Behaviours

- Hover:
- Focus:
  - When inputAllowed=false, the host element is focusable. Otherwise, an input inside it is focusable.
  - Border is changed to primary color; Label is moved up with animation - when has no value. Otherwise it’s already there.
  - inputAllowed=true, all texts are auto-selected.
- Trailing Icon:
  - When opened = false, it’s down arrow.
  - When opened = ture, it’s an up arrow.
  - When property is changed, it’s updated through animation.
- When inputAllowed = true, Syncs value property with Input’s value as user types (on input event from it).

## API

### Properties/Attributes

| Name               | Type      | Description                                                                                              |
| ------------------ | --------- | -------------------------------------------------------------------------------------------------------- |
| `value`            | `string`  | The input control's value. Text to be shown as the value. It’s output property also when readOnly=false. |
| `label`            | `string`  | Sets floating label value.                                                                               |
| `placeholder`      | `string`  | Sets disappearing input placeholder.                                                                     |
| `helper`           | `string`  | Helper text to display below the input. Display default only when focused.                               |
| `outlined`         | `boolean` | Whether or not to show the material outlined variant.                                                    |
| `updatedHighlight` | `boolean` | Input Property. When true, shows updated highlights                                                      |
| `opened`           | `boolean` | Whether or not to show the temprory select dialog.                                                       |
| `readOnly`         | `boolean` | Whether or not to show the read-only variant.                                                            |
| `inputAllowed`     | `boolean` | When true user isn’t allowed to type anything.                                                           |
| `error`            | `boolean` | When true, helper text isn’t visible. Instead `errorMesage` is shown.                                    |
| `errorMessage`     | `string`  | Message to show in the error color at helper text when the textfield is invalid.                         |

### Events

| Event Name | Target | Detail | Description                                                                                                                          |
| ---------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `input`    |        |        | Dispatched when user updates input value. So, dispatched only when readOnly=false. value is changed before this event is dispatched. |
