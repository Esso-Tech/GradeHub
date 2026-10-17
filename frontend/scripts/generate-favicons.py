#!/usr/bin/env python3
"""Génère le favicon et les icônes PWA à partir du logo GRADE HUB (brand/logo.svg).

Le logo est dessiné ici en vectoriel (mêmes coordonnées que le SVG), avec suréchantillonnage
pour des bords nets. Usage : python3 scripts/generate-favicons.py   (nécessite Pillow)
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
GREEN = (47, 111, 31, 255)
WHITE = (255, 255, 255, 255)
CAP_BASE = (220, 239, 213, 255)
ORANGE = (242, 140, 40, 255)
SS = 4  # suréchantillonnage


def draw_logo(size: int, padding: float) -> Image.Image:
    """Fond vert plein cadre (icône carrée) + toque centrée dans la zone sûre."""
    big = size * SS
    img = Image.new("RGBA", (big, big), GREEN)
    d = ImageDraw.Draw(img)
    # Le dessin occupe la zone 5..35 du repère 40x40 ; on l'étire dans (1 - 2*padding) du carré.
    scale = big * (1 - 2 * padding) / 30.0
    off = big * padding

    def p(x: float, y: float) -> tuple[float, float]:
        return (off + (x - 5) * scale, off + (y - 5) * scale)

    d.polygon([p(20, 9), p(35, 16), p(20, 23), p(5, 16)], fill=WHITE)
    base = [p(11, 20.5), p(11, 27), p(12, 28.6), p(15, 30.2), p(20, 31), p(25, 30.2),
            p(28, 28.6), p(29, 27), p(29, 20.5), p(20, 25)]
    d.polygon(base, fill=CAP_BASE)
    w = max(2, int(2 * scale))
    d.line([p(33, 17.5), p(33, 27)], fill=ORANGE, width=w)
    cx, cy = p(33, 29)
    r = 2 * scale
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=ORANGE)
    return img.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    ico = [draw_logo(s, 0.12) for s in (16, 32, 48)]
    ico[0].save(PUBLIC / "favicon.ico", format="ICO", sizes=[(s, s) for s in (16, 32, 48)], append_images=ico[1:])
    draw_logo(180, 0.14).convert("RGB").save(PUBLIC / "apple-touch-icon.png")
    draw_logo(192, 0.14).save(PUBLIC / "pwa-192x192.png")
    draw_logo(512, 0.14).save(PUBLIC / "pwa-512x512.png")
    draw_logo(512, 0.24).save(PUBLIC / "pwa-maskable-512x512.png")  # zone sûre élargie
    print(f"Icônes écrites dans {PUBLIC}")


if __name__ == "__main__":
    main()
