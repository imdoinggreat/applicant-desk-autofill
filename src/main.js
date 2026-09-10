const fields = [...document.querySelectorAll('input, textarea, select')];
const storageKey = 'applicantDeskProfile';
const applications = [
  { id: 'columbia', name: 'Columbia MSM', system: 'CBS MS portal', deadline: '2027-01-28' },
  { id: 'usc', name: 'USC MS Marketing', system: 'USC LiaisonCAS', deadline: '2027-01-15' },
  { id: 'northwestern', name: 'Northwestern IMC', system: 'Medill portal', deadline: '2026-11-30' },
  { id: 'hec', name: 'M2M HEC–Yale', system: 'HEC Masters portal', deadline: '2026-11-26' },
  { id: 'brown', name: 'Brown PRIME', system: 'Brown application portal', deadline: '2027-02-01' }
];
const $ = (id) => document.getElementById(id);
function toast(message) { const el = $('toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1800); }
function collect() { const data = {}; fields.forEach((field) => { data[field.id] = field.value; }); data.applications = Object.fromEntries(applications.map((app) => [app.id, { status: $(`status-${app.id}`).value, notes: $(`notes-${app.id}`).value }])); return data; }
function fill(data) { fields.forEach((field) => { if (Object.prototype.hasOwnProperty.call(data, field.id)) field.value = data[field.id]; }); applications.forEach((app) => { const row = data.applications?.[app.id]; if (!row) return; $(`status-${app.id}`).value = row.status || 'Not started'; $(`notes-${app.id}`).value = row.notes || ''; }); updateProgress(); }
function save(show = true) { localStorage.setItem(storageKey, JSON.stringify(collect())); updateProgress(); if (show) toast('Profile saved on this device'); }
function updateProgress() { const optional = ['preferredName', 'currentLocation', 'exchangeSchool', 'exchangeCountry', 'exchangeDates', 'exchangeNotes', 'activities', 'experience']; const relevant = fields.filter((field) => !optional.includes(field.id)); const filled = relevant.filter((field) => field.value.trim()).length; const percent = Math.round((filled / relevant.length) * 100); $('completionNumber').textContent = `${percent}%`; $('progressBar').style.width = `${percent}%`; }
function copyValue(id) { const value = $(id).value; if (!value) return toast('Nothing to copy yet'); navigator.clipboard.writeText(value).then(() => toast('Copied to clipboard')); }
function renderApplications() { $('applicationRows').innerHTML = applications.map((app) => `<tr><td><strong>${app.name}</strong></td><td>${app.system}</td><td><time>${app.deadline}</time></td><td><select id="status-${app.id}"><option>Not started</option><option>In progress</option><option>Ready to submit</option><option>Submitted</option><option>Decision received</option></select></td><td><input id="notes-${app.id}" placeholder="Optional note"></td></tr>`).join(''); }
renderApplications();
const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
if (saved) fill(saved); else updateProgress();
document.querySelectorAll('.nav-item').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active')); document.querySelectorAll('.panel').forEach((panel) => panel.classList.remove('active-panel')); button.classList.add('active'); $(button.dataset.target).classList.add('active-panel'); }));
fields.forEach((field) => field.addEventListener('input', updateProgress));
document.querySelectorAll('.copy').forEach((button) => button.addEventListener('click', () => copyValue(button.dataset.copy)));
$('saveBtn').addEventListener('click', () => save());
document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') { event.preventDefault(); save(); } });
$('exportBtn').addEventListener('click', () => { save(false); const blob = new Blob([JSON.stringify(collect(), null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'applicant-desk-backup.json'; link.click(); URL.revokeObjectURL(link.href); toast('Backup exported'); });
$('importInput').addEventListener('change', (event) => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { fill(JSON.parse(reader.result)); save(false); toast('Backup imported'); } catch { toast('That backup could not be read'); } }; reader.readAsText(file); event.target.value = ''; });
document.querySelectorAll('#applicationRows select, #applicationRows input').forEach((field) => field.addEventListener('change', () => save(false)));
