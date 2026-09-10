import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
extension = root / 'extension'
manifest = json.loads((extension / 'manifest.json').read_text())

allowed = {'storage', 'activeTab', 'scripting'}
permissions = set(manifest.get('permissions', []))
unexpected = permissions - allowed
if unexpected:
    raise SystemExit(f'unexpected permissions: {sorted(unexpected)}')
if manifest.get('host_permissions') or '<all_urls>' in json.dumps(manifest):
    raise SystemExit('broad host permissions are not allowed')
if not (extension / 'privacy.html').exists():
    raise SystemExit('extension/privacy.html is required')

for path in extension.rglob('*'):
    if not path.is_file() or path.suffix not in {'.js', '.html'}:
        continue
    text = path.read_text()
    if re.search(r'<script[^>]+src=["\']https?://|\beval\s*\(|\bnew\s+Function\s*\(|\bfetch\s*\(|\bXMLHttpRequest\b', text):
        raise SystemExit(f'remote code or network execution found in {path}')

popup = (extension / 'popup.html').read_text()
options = (extension / 'options.html').read_text()
content = (extension / 'content.js').read_text()
for marker, text in [('popup consent', popup), ('options consent', options), ('content safety', content)]:
    if marker == 'content safety':
        required = ['password', 'file', 'submit', 'button']
    else:
        required = ['consent', 'privacy.html']
    if not all(item in text for item in required):
        raise SystemExit(f'{marker} check failed')

print('extension policy checks passed')
