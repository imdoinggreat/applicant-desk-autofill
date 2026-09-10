from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

out = Path(__file__).resolve().parents[1] / 'extension' / 'icons'
out.mkdir(parents=True, exist_ok=True)
for size in (16, 32, 48, 128):
    image = Image.new('RGBA', (size, size), '#12233b')
    draw = ImageDraw.Draw(image)
    radius = max(2, size // 5)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill='#12233b')
    accent = '#ef765d'
    draw.rounded_rectangle((size * .12, size * .12, size * .88, size * .88), radius=max(1, size // 6), fill=accent)
    font = None
    for font_path in ('/System/Library/Fonts/Geneva.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'):
        try:
            font = ImageFont.truetype(font_path, max(6, size // 3))
            break
        except OSError:
            pass
    if font:
        bbox = draw.textbbox((0, 0), 'AD', font=font)
        x = (size - (bbox[2] - bbox[0])) / 2 - bbox[0]
        y = (size - (bbox[3] - bbox[1])) / 2 - bbox[1]
        draw.text((x, y), 'AD', font=font, fill='white')
    else:
        draw.rectangle((size * .34, size * .30, size * .40, size * .70), fill='white')
        draw.rectangle((size * .60, size * .30, size * .66, size * .70), fill='white')
        draw.rectangle((size * .40, size * .47, size * .60, size * .53), fill='white')
    image.save(out / f'icon{size}.png')
