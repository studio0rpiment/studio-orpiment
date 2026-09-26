#!/usr/bin/env python3
"""Convert wayside .ply point clouds into compact under-layer frames.

Output format v2 (little-endian), for N points:
  N * 3 float32  positions — centered on the cloud's bbox center, scaled so
                 the largest bbox dimension == 1
  N * 3 uint8    vertex colors (sRGB, straight from the scan)

Every frame is resampled to exactly N points (deterministic seed) so the
Underlayer can lerp position and color buffers directly (Direct Interpolation).

Usage: convert-underlayer-ply.py N out_dir in1.ply [in2.ply ...]
"""
import struct, sys, os, random

def read_ply(path):
    with open(path, 'rb') as f:
        data = f.read()
    end = data.index(b'end_header\n') + len(b'end_header\n')
    header = data[:end].decode('ascii', 'replace')
    n = 0; props = []
    for line in header.splitlines():
        if line.startswith('element vertex'):
            n = int(line.split()[-1])
        elif line.startswith('property'):
            _, typ, name = line.split()
            props.append((typ, name))
    sizes = {'float': 4, 'uchar': 1, 'double': 8, 'int': 4, 'uint': 4, 'short': 2, 'ushort': 2}
    stride = sum(sizes[t] for t, _ in props)
    offs = {}
    o = 0
    for t, name in props:
        offs[name] = o; o += sizes[t]
    has_rgb = all(k in offs for k in ('red', 'green', 'blue'))
    pts = []
    for i in range(n):
        rec = end + i * stride
        x = struct.unpack_from('<f', data, rec + offs['x'])[0]
        y = struct.unpack_from('<f', data, rec + offs['y'])[0]
        z = struct.unpack_from('<f', data, rec + offs['z'])[0]
        if has_rgb:
            r, g, b = data[rec + offs['red']], data[rec + offs['green']], data[rec + offs['blue']]
        else:
            r = g = b = 255
        pts.append((x, y, z, r, g, b))
    return pts

def main():
    N = int(sys.argv[1]); out_dir = sys.argv[2]
    random.seed(1234)  # deterministic resampling
    for src in sys.argv[3:]:
        pts = read_ply(src)
        pts = random.sample(pts, N) if len(pts) >= N else [pts[random.randrange(len(pts))] for _ in range(N)]
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; zs = [p[2] for p in pts]
        cx, cy, cz = (min(xs)+max(xs))/2, (min(ys)+max(ys))/2, (min(zs)+max(zs))/2
        span = max(max(xs)-min(xs), max(ys)-min(ys), max(zs)-min(zs)) or 1.0
        pos = bytearray(); col = bytearray()
        for x, y, z, r, g, b in pts:
            pos += struct.pack('<3f', (x-cx)/span, (y-cy)/span, (z-cz)/span)
            col += bytes((r, g, b))
        name = os.path.splitext(os.path.basename(src))[0] + '.bin'
        with open(os.path.join(out_dir, name), 'wb') as f:
            f.write(pos); f.write(col)
        print(name, len(pts), 'points, rgb')

main()
