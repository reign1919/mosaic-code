import { useEffect, useRef } from "react";

const COLORS = [
  "#ff3a5c", "#ffb224", "#00d4aa", "#3b82f6", 
  "#7B61FF", "#22c55e", "#ff8f3a"
];

const LIGHTEN = (color) => color; // simplifying for now
const DARKEN = (color) => `color-mix(in srgb, ${color} 70%, #000)`;
const REALLY_DARKEN = (color) => `color-mix(in srgb, ${color} 40%, #000)`;

export default function StopMotionMosaic({ size = 400 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // Build a 3D grid of mosaic "tiles/cubes"
    const cubes = [];
    const gridSize = 4;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          // Leave some holes for a mosaic look
          if (Math.random() > 0.45) continue;
          cubes.push({
            origX: x - gridSize/2 + 0.5,
            origY: y - gridSize/2 + 0.5,
            origZ: z - gridSize/2 + 0.5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            // Add a small permanent random offset for "hand-crafted" jitter
            jitterX: (Math.random() - 0.5) * 0.15,
            jitterY: (Math.random() - 0.5) * 0.15,
            jitterZ: (Math.random() - 0.5) * 0.15,
          });
        }
      }
    }

    const cubeSize = size / 12;

    // 3D rotation math
    function rotate3D(cx, cy, cz, rotX, rotY) {
      // Rotate around Y
      let x1 = cx * Math.cos(rotY) - cz * Math.sin(rotY);
      let z1 = cz * Math.cos(rotY) + cx * Math.sin(rotY);
      // Rotate around X
      let y1 = cy * Math.cos(rotX) - z1 * Math.sin(rotX);
      let z2 = z1 * Math.cos(rotX) + cy * Math.sin(rotX);
      return { x: x1, y: y1, z: z2 };
    }

    function drawPolygon(points, color, strokeColor) {
      ctx.fillStyle = color;
      ctx.strokeStyle = strokeColor || "rgba(0,0,0,0.8)";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Add "zine" style hand-drawn inner scribbles occasionally
      if (Math.random() > 0.8) {
        ctx.beginPath();
        const p1 = points[Math.floor(Math.random() * points.length)];
        const p2 = points[Math.floor(Math.random() * points.length)];
        ctx.moveTo(p1.x * 0.9 + p2.x * 0.1, p1.y * 0.9 + p2.y * 0.1);
        ctx.lineTo(p2.x * 0.9 + p1.x * 0.1, p2.y * 0.9 + p1.y * 0.1);
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    const FPS = 8; // Stop-motion low framerate
    const frameInterval = 1000 / FPS;
    let lastDrawTime = 0;
    let globalAngle = 0;

    function render(time) {
      if (time - lastDrawTime < frameInterval) {
        animRef.current = requestAnimationFrame(render);
        return;
      }
      lastDrawTime = time;
      globalAngle += 0.08; // choppy step rotation

      ctx.clearRect(0, 0, size, size);

      // Throttling the jittering for stop-motion effect
      const currentJitter = Math.random() * 0.08;

      // Calculate projected positions and Z-depth for sorting
      const renderCubes = cubes.map(c => {
        // Add random frame-by-frame jitter to the persistent jitter
        const nx = c.origX + c.jitterX + (Math.random() - 0.5) * currentJitter;
        const ny = c.origY + c.jitterY + (Math.random() - 0.5) * currentJitter;
        const nz = c.origZ + c.jitterZ + (Math.random() - 0.5) * currentJitter;

        // View angles (Isometric tilt + continuous rotation)
        const rotX = 0.5; // slight tilt down
        const rotY = globalAngle;

        const center = rotate3D(nx, ny, nz, rotX, rotY);
        
        // Perspective projection (slight)
        const scale = size / 3; 
        
        // Define the 8 vertices of a cube relative to its center
        const s = 0.45; // half-size
        const verts = [
          {x: -s, y: -s, z: -s}, {x: s, y: -s, z: -s}, {x: s, y: s, z: -s}, {x: -s, y: s, z: -s},
          {x: -s, y: -s, z: s},  {x: s, y: -s, z: s},  {x: s, y: s, z: s},  {x: -s, y: s, z: s}
        ].map(v => rotate3D(nx + v.x, ny + v.y, nz + v.z, rotX, rotY));

        return {
          zDist: center.z,
          color: c.color,
          verts: verts.map(v => ({ x: size/2 + v.x * scale, y: size/2 + v.y * scale }))
        };
      });

      // Painter's algorithm
      renderCubes.sort((a, b) => b.zDist - a.zDist);

      renderCubes.forEach(rc => {
        const v = rc.verts;
        // Faces: (0,1,2,3) back, (4,5,6,7) front, (0,1,5,4) top, (2,3,7,6) bottom, (1,2,6,5) right, (0,3,7,4) left
        // Note: With our rotation, Top is (0,1,5,4), Left is (0,3,7,4), Right is (1,2,6,5) depending on orientation.
        // We can just use hardcoded faces and check normal Z to see which are visible.
        
        // Standard faces for a cube
        const faces = [
          { p: [v[4], v[5], v[6], v[7]], fill: rc.color,                       n: 'front' }, // Front
          { p: [v[0], v[1], v[5], v[4]], fill: LIGHTEN(rc.color),              n: 'top' },   // Top
          { p: [v[3], v[2], v[6], v[7]], fill: REALLY_DARKEN(rc.color),        n: 'bottom'}, // Bottom
          { p: [v[0], v[3], v[7], v[4]], fill: DARKEN(rc.color),               n: 'left'},   // Left
          { p: [v[1], v[2], v[6], v[5]], fill: DARKEN(rc.color),               n: 'right'},  // Right
          { p: [v[0], v[1], v[2], v[3]], fill: REALLY_DARKEN(rc.color),        n: 'back'}    // Back
        ];

        // Custom hand-drawn 3D aesthetic:
        // We calculate normal Z to draw only front-facing polygons
        faces.forEach(face => {
          const p = face.p;
          const vec1 = { x: p[1].x - p[0].x, y: p[1].y - p[0].y };
          const vec2 = { x: p[2].x - p[1].x, y: p[2].y - p[1].y };
          const cross = vec1.x * vec2.y - vec1.y * vec2.x;
          if (cross > 0) {
            drawPolygon(p, face.fill, "rgba(0,0,0,0.85)");
          }
        });
      });

      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  return (
    <canvas 
      ref={canvasRef} 
      aria-label="3D Stop-motion mosaic art"
      style={{
        width: size,
        height: size,
        display: "block",
        margin: "0 auto",
        filter: "drop-shadow(4px 6px 0px rgba(0,0,0,0.15))" // Zine cutout shadow
      }}
    />
  );
}
