#!/usr/bin/env python3
"""Génère favicon et icônes PWA à partir du logo toque (PNG source)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SOURCE_REPO = ROOT / "brand" / "logo-cap-source.png"
NAVY = (7, 30, 51, 255)


def load_source() -> Image.Image:
    if not SOURCE_REPO.is_file():
        raise SystemExit(f"Source introuvable : {SOURCE_REPO}")
    return Image.open(SOURCE_REPO).convert("RGBA")


def icon_square(src: Image.Image, size: int, padding: float = 0.12) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), NAVY)
    w, h = src.size
    inner = int(size * (1 - 2 * padding))
    scale = min(inner / w, inner / h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    x, y = (size - nw) // 2, (size - nh) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    (ROOT / "brand").mkdir(exist_ok=True)
    src = load_source()

    sizes_ico = [16, 32, 48]
    ico_images = [icon_square(src, s, padding=0.1) for s in sizes_ico]
    ico_path = PUBLIC / "favicon.ico"
    ico_images[0].save(
        ico_path,
        format="ICO",
        sizes=[(s, s) for s in sizes_ico],
        append_images=ico_images[1:],
    )

    icon_square(src, 180, padding=0.14).convert("RGB").save(PUBLIC / "apple-touch-icon.png")
    icon_square(src, 192, padding=0.14).save(PUBLIC / "pwa-192x192.png")
    icon_square(src, 512, padding=0.14).save(PUBLIC / "pwa-512x512.png")
    icon_square(src, 512, padding=0.22).save(PUBLIC / "pwa-maskable-512x512.png")

    print(f"Icônes écrites dans {PUBLIC}")


if __name__ == "__main__":
    main()
