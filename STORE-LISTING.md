# Chrome Web Store draft listing

## Name

Applicant Desk Autofill

## Short description

Fill common web-form fields from a private local profile.

## Single purpose

Applicant Desk Autofill lets users reuse profile information in compatible web forms when they explicitly invoke the extension. It keeps profile data in Chrome local storage and does not send it to a server.

## Full description

Keep one profile and reuse it across application, education, recruiting, housing, and other trusted forms. The extension recognizes common labels, autocomplete values, field names, and placeholders for names, contact information, addresses, nationality, education, scores, and recommendation contacts. Users can also add custom field aliases and values as JSON.

The full profile is available from the extension's options page, so the extension can be used without the separate Applicant Desk dashboard.

The extension fills only after the user clicks **Fill this page**, skips fields that already contain a value, never fills passwords or CAPTCHA fields, and does not submit forms. No backend, analytics, advertising, or remote code is used.

## Permission justifications

- storage: save the profile locally in Chrome so it can be reused.
- activeTab: temporarily access the page the user explicitly chooses to fill.
- scripting: run the packaged field-matching code on that active page.

## Data disclosure

The extension handles profile data supplied by the user and form-field labels on the active page. It uses this data only to provide the autofill feature, stores profile data locally, and does not sell or transfer data to third parties. Privacy policy: link to the published privacy.html page.

## Remote code

No remote code.
