# Current boundaries

The generic matcher is intentionally conservative.

- It handles native inputs, textareas, selects, and many ARIA-combobox inputs.
- It uses visible labels plus `name`, `id`, `placeholder`, `autocomplete`, and fieldset legends.
- It skips fields that already contain a value, disabled/read-only fields, passwords, files, submit buttons, and CAPTCHA controls.
- It does not submit a form or click through a multi-step application.
- A form inside a cross-origin iframe, a closed shadow root, or a highly custom widget may need a site-specific adapter.
- Ambiguous labels are left blank rather than guessed. Custom field JSON is available when a user wants an explicit mapping.

The safe workflow is: fill, review every value on the page, then submit the form yourself.
