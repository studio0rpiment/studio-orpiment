import * as THREE from 'three'
import { CardKind, Project } from '../projects/types'

/**
 * Face cards — project information drawn onto canvas textures that live on
 * the cuboids' faces, so the information physically rotates into view.
 * Each piece is assigned one card kind by the project's spread map; the
 * cards are sized to the piece's DOM rect so the set fits together.
 */

const INK = '#2B1810'
const PAPER = '#F5F4ED'
const ORPIMENT = '#EEBD34'

const imageCache = new Map<string, HTMLImageElement>()

function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = imageCache.get(src)
  if (hit && hit.complete) return Promise.resolve(hit)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      imageCache.set(src, img)
      resolve(img)
    }
    img.onerror = reject
    img.src = src
  })
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const probe = line ? `${line} ${w}` : w
    if (ctx.measureText(probe).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = probe
    }
  }
  if (line) lines.push(line)
  return lines
}

/** Paint one card. Returns a texture sized to the piece's rect. All drawing
    happens in RECT space (CSS px) — the context is uniformly scaled — so type
    sizes are consistent across pieces regardless of texture resolution. */
export async function drawCard(
  project: Project,
  kind: CardKind,
  rectW: number,
  rectH: number,
): Promise<THREE.CanvasTexture> {
  const scale = Math.min(2, 1600 / Math.max(rectW, rectH))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(2, Math.round(rectW * scale))
  canvas.height = Math.max(2, Math.round(rectH * scale))
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)
  const w = rectW
  const h = rectH
  ctx.fillStyle = INK
  ctx.fillRect(0, 0, w, h)
  const pad = Math.round(Math.min(w, h) * 0.12)
  const mono = (size: number, weight = 100) => `${weight} ${size}px "Rotor Overlay", monospace`

  /** largest size at which text fits maxWidth, floored */
  const fitSize = (text: string, start: number, maxWidth: number, weight = 100) => {
    let s = start
    ctx.font = mono(s, weight)
    while (s > 10 && ctx.measureText(text).width > maxWidth) {
      s -= 1
      ctx.font = mono(s, weight)
    }
    return s
  }

  if (kind.type === 'title') {
    ctx.fillStyle = ORPIMENT
    ctx.font = mono(15, 400)
    ctx.fillText(project.num, pad, pad + 12)
    const size = fitSize(project.title, Math.min(w * 0.16, 56), w - pad * 2)
    ctx.font = mono(size)
    ctx.fillStyle = PAPER
    ctx.fillText(project.title, pad, pad + 12 + size * 1.5)
    ctx.font = mono(13, 400)
    ctx.fillStyle = ORPIMENT
    ctx.fillText(`${project.category} — ${project.year}`, pad, h - pad)
  } else if (kind.type === 'intro' && project.showcase) {
    const size = 14
    ctx.font = mono(size, 400)
    ctx.fillStyle = PAPER
    const lines = wrapText(ctx, project.showcase.intro, w - pad * 2)
    lines.forEach((l, i) => ctx.fillText(l, pad, pad + 4 + (i + 1) * size * 1.4))
  } else if (kind.type === 'facts' && project.showcase) {
    const f = project.showcase.facts
    let y = pad + 10
    for (const [k, v] of [
      ['date', f.date],
      ['client', f.client],
      ['role', f.role],
    ] as const) {
      ctx.font = mono(11, 400)
      ctx.fillStyle = ORPIMENT
      ctx.fillText(k, pad, y)
      y += 16
      ctx.font = mono(14, 400)
      ctx.fillStyle = PAPER
      for (const line of wrapText(ctx, v, w - pad * 2)) {
        ctx.fillText(line, pad, y)
        y += 18
      }
      y += 10
    }
  } else if (kind.type === 'image') {
    try {
      const img = await loadImage(kind.src)
      // cover-fit
      const s = Math.max(w / img.width, h / img.height)
      const dw = img.width * s
      const dh = img.height * s
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
    } catch {
      /* leave ink */
    }
  } else if (kind.type === 'more') {
    ctx.fillStyle = PAPER
    ctx.font = mono(16)
    ctx.fillText('case study →', pad, h / 2 + 5)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}
