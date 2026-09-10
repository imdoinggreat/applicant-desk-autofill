const storageKey = 'applicantDeskExtensionProfile';
const consentKey = 'applicantDeskConsentAccepted';
const fieldIds = [
  'firstName', 'lastName', 'preferredName', 'birthDate', 'birthCountry', 'nationality',
  'email', 'phoneCode', 'phone', 'currentLocation', 'visaStatus',
  'currentAddress', 'currentCity', 'currentRegion', 'currentPostalCode', 'currentCountry',
  'mailingAddress', 'permanentAddress', 'ugSchool', 'ugCity', 'ugCountry', 'ugDegree',
  'ugMajor', 'ugGpa', 'employer', 'jobTitle', 'gradTest', 'gradScore', 'englishTest',
  'englishScore', 'ref1Name', 'ref1Email'
];
const $ = (id) => document.getElementById(id);
const setStatus = (message, error = false) => {
  $('status').textContent = message;
  $('status').style.color = error ? '#a33b35' : '#2f6f57';
};
const readProfile = async () => (await chrome.storage.local.get(storageKey))[storageKey] || {};
const putProfileInForm = (profile) => {
  fieldIds.forEach((id) => { $(id).value = profile[id] || ''; });
  $('customFields').value = profile.customFields ? JSON.stringify(profile.customFields, null, 2) : '';
};
const readForm = () => {
  let customFields = {};
  if ($('customFields').value.trim()) {
    customFields = JSON.parse($('customFields').value);
    if (!customFields || Array.isArray(customFields) || typeof customFields !== 'object') throw new Error('Custom fields must be an object');
  }
  return { ...Object.fromEntries(fieldIds.map((id) => [id, $(id).value.trim()])), customFields };
};
const saveProfile = async () => {
  try {
    const existing = await readProfile();
    await chrome.storage.local.set({ [storageKey]: { ...existing, ...readForm() } });
    setStatus('Profile saved in this browser.');
  } catch {
    setStatus('Custom field values must be valid JSON.', true);
  }
};
const exportProfile = async () => {
  try {
    const profile = { ...(await readProfile()), ...readForm() };
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' }));
    link.download = 'applicant-desk-profile.json';
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus('Profile exported.');
  } catch {
    setStatus('Custom field values must be valid JSON.', true);
  }
};
const importProfile = async (file) => {
  try {
    const parsed = JSON.parse(await file.text());
    const existing = await readProfile();
    const profile = { ...existing, ...parsed };
    await chrome.storage.local.set({ [storageKey]: profile });
    putProfileInForm(profile);
    setStatus('Profile imported.');
  } catch {
    setStatus('That JSON file could not be read.', true);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const { [consentKey]: consentAccepted } = await chrome.storage.local.get(consentKey);
  const enableForm = async () => {
    $('consentGate').hidden = true;
    $('profileForm').hidden = false;
    putProfileInForm(await readProfile());
  };
  if (consentAccepted) await enableForm();
  $('consent').addEventListener('change', async (event) => {
    if (!event.target.checked) return;
    await chrome.storage.local.set({ [consentKey]: true });
    await enableForm();
  });
  $('profileForm').addEventListener('submit', (event) => { event.preventDefault(); saveProfile(); });
  $('export').addEventListener('click', exportProfile);
  $('backup').addEventListener('change', (event) => {
    const [file] = event.target.files;
    if (file) importProfile(file);
    event.target.value = '';
  });
});
