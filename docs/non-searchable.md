# Non Searchable

searchable = false

### Basic(filled)

```html
<dw-select items=${this.items} label="Basic" valueProvider=${(item) => item.value}></dw-select>

<script type="module">
  import '@dreamworld/dw-select';
</script>
```

### Outlined

<img src="../images/non-searchable-outlined.png" width="300px"><br>
<img src="../images/non-searchable.png" width="300px">

```html
<dw-select outlined items=${this.items} label="outlined"></dw-select>
```

### Preselected

<img src="../images/non-searchable-prefilled.png" width="300px"><br>
<img src="../images/non-searchable-with-label.png" width="600px">

```html
<dw-select outlined items=${this.items} label="outlined" value=${items[0].value} valueProvider=${(item) => item.value}></dw-select>
```

### Mobile-mode

In mobile, select dialog is opened as bottom sheet dialog. If items is overflowed then dialog become fit-dialog.

<img src="../images/non-searchable-mobile.png" width="300px"><br>

```html
<dw-select outlined items=${this.items} vkb></dw-select>
```