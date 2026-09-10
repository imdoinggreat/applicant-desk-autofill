const storageKey = 'applicantDeskExtensionProfile';
const consentKey = 'applicantDeskConsentAccepted';
const fields = ['firstName', 'lastName', 'email', 'phone', 'nationality', 'currentLocation'];

const $ = (id) => document.getElementById(id);
const status = (message, isError = false) => {
  $('status').textContent = message;
  $('status').style.color = isError ? '#a33b35' : '#2f6f57';
};

const readProfile = async () => (await chrome.storage.local.get(storageKey))[storageKey] || {};

const putProfileInForm = (profile) => {
  fields.forEach((key) => { $(key).value = profile[key] || ''; });
  $('customFields').value = profile.customFields ? JSON.stringify(profile.customFields, null, 2) : '';
};

const readForm = () => {
  let customFields = {};
  if ($('customFields').value.trim()) customFields = JSON.parse($('customFields').value);
  return { ...Object.fromEntries(fields.map((key) => [key, $(key).value.trim()])), customFields };
};

const saveProfile = async () => {
  try {
    const existing = await readProfile();
    await chrome.storage.local.set({ [storageKey]: { ...existing, ...readForm() } });
    status('Profile saved in this browser.');
  } catch {
    status('Custom field values must be valid JSON.', true);
  }
};

const importBackup = async (file) => {
  try {
    const parsed = JSON.parse(await file.text());
    const existing = await readProfile();
    await chrome.storage.local.set({ [storageKey]: { ...existing, ...parsed } });
    putProfileInForm({ ...existing, ...parsed });
    status('Applicant Desk backup imported.');
  } catch {
    status('That JSON backup could not be read.', true);
  }
};

const fillPage = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return status('No active page found.', true);
  const profile = await readProfile();
  if (!Object.values(profile).some(Boolean)) return status('Import or save a profile first.', true);
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
    const result = await chrome.tabs.sendMessage(tab.id, { type: 'fill', profile });
    status('Filled ' + (result?.filled || 0) + ' field(s); skipped ' + (result?.skipped || 0) + '.');
  } catch {
    status('This page does not allow extensions. Try the school form itself.', true);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const { [consentKey]: consentAccepted } = await chrome.storage.local.get(consentKey);
  const enableTool = async () => {
    $('consentGate').hidden = true;
    $('tool').hidden = false;
    putProfileInForm(await readProfile());
  };
  if (consentAccepted) await enableTool();
  $('consent').addEventListener('change', async (event) => {
    if (!event.target.checked) return;
    await chrome.storage.local.set({ [consentKey]: true });
    await enableTool();
  });
  $('save').addEventListener('click', saveProfile);
  $('fill').addEventListener('click', fillPage);
  $('backup').addEventListener('change', (event) => {
    const [file] = event.target.files;
    if (file) importBackup(file);
    event.target.value = '';
  });
});
