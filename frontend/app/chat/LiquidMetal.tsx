"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Fragment Shader ─── */
const liquidFragSource = `#version 300 es
#ifdef GL_ES
precision highp float;
#else
precision mediump float;
#endif

#define PI 3.14159265359

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_patternScale;
uniform float u_refraction;
uniform float u_edge;
uniform float u_patternBlur;
uniform float u_liquid;

vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
    m = m*m;
    m = m*m;
    vec3 x = 2. * fract(p * C.www) - 1.;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130. * dot(m, g);
}

vec2 get_img_uv() {
    vec2 img_uv = vUv;
    img_uv -= .5;
    if (u_ratio > u_img_ratio) {
        img_uv.x = img_uv.x * u_ratio / u_img_ratio;
    } else {
        img_uv.y = img_uv.y * u_img_ratio / u_ratio;
    }
    float scale_factor = 1.;
    img_uv *= scale_factor;
    img_uv += .5;
    img_uv.y = 1. - img_uv.y;
    return img_uv;
}

vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float get_color_channel(float c1, float c2, float stripe_p, vec3 w, float extra_blur, float b) {
    float ch = c2;
    float border = 0.;
    float blur = u_patternBlur + extra_blur;
    ch = mix(ch, c1, smoothstep(.0, blur, stripe_p));
    border = w[0];
    ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));
    b = smoothstep(.2, .8, b);
    border = w[0] + .4 * (1. - b) * w[1];
    ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));
    border = w[0] + .5 * (1. - b) * w[1];
    ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));
    border = w[0] + w[1];
    ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));
    float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
    float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
    ch = mix(ch, gradient, smoothstep(border - blur, border + blur, stripe_p));
    return ch;
}

float get_img_frame_alpha(vec2 uv, float img_frame_width) {
    float img_frame_alpha = smoothstep(0., img_frame_width, uv.x) * smoothstep(1., 1. - img_frame_width, uv.x);
    img_frame_alpha *= smoothstep(0., img_frame_width, uv.y) * smoothstep(1., 1. - img_frame_width, uv.y);
    return img_frame_alpha;
}

void main() {
    vec2 uv = vUv;
    uv.y = 1. - uv.y;
    uv.x *= u_ratio;
    float diagonal = uv.x - uv.y;
    float t = .001 * mod(u_time, 10000.0);
    vec2 img_uv = get_img_uv();
    vec4 img = texture(u_image_texture, img_uv);
    vec3 color = vec3(0.);
    float opacity = 1.;
    vec3 color1 = vec3(.98, 0.98, 1.);
    vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, uv.x + uv.y));
    float edge = img.r;
    vec2 grad_uv = uv;
    grad_uv -= .5;
    float dist = length(grad_uv + vec2(0., .2 * diagonal));
    grad_uv = rotate(grad_uv, (.25 - .2 * diagonal) * PI);
    float bulge = pow(1.8 * dist, 1.2);
    bulge = 1. - bulge;
    bulge *= pow(uv.y, .3);
    float cycle_width = u_patternScale;
    float thin_strip_1_ratio = .12 / cycle_width * (1. - .4 * bulge);
    float thin_strip_2_ratio = .07 / cycle_width * (1. + .4 * bulge);
    float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);
    float thin_strip_1_width = cycle_width * thin_strip_1_ratio;
    float thin_strip_2_width = cycle_width * thin_strip_2_ratio;
    opacity = 1. - smoothstep(.9 - .5 * u_edge, 1. - .5 * u_edge, edge);
    opacity *= get_img_frame_alpha(img_uv, 0.01);
    float noise = snoise(uv - t);
    edge += (1. - edge) * u_liquid * noise;
    float refr = 0.;
    refr += (1. - bulge);
    refr = clamp(refr, 0., 1.);
    float dir = grad_uv.x;
    dir += diagonal;
    dir -= 2. * noise * diagonal * (smoothstep(0., 1., edge) * smoothstep(1., 0., edge));
    bulge *= clamp(pow(uv.y, .1), .3, 1.);
    dir *= (.1 + (1.1 - edge) * bulge);
    dir *= smoothstep(1., .7, edge);
    dir += .18 * (smoothstep(.1, .2, uv.y) * smoothstep(.4, .2, uv.y));
    dir += .03 * (smoothstep(.1, .2, 1. - uv.y) * smoothstep(.4, .2, 1. - uv.y));
    dir *= (.5 + .5 * pow(uv.y, 2.));
    dir *= cycle_width;
    dir -= t;
    float refr_r = refr;
    refr_r += .03 * bulge * noise;
    float refr_b = 1.3 * refr;
    refr_r += 5. * (smoothstep(-.1, .2, uv.y) * smoothstep(.5, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(1., .4, bulge));
    refr_r -= diagonal;
    refr_b += (smoothstep(0., .4, uv.y) * smoothstep(.8, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(.8, .4, bulge));
    refr_b -= .2 * edge;
    refr_r *= u_refraction;
    refr_b *= u_refraction;
    vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
    w[1] -= .02 * smoothstep(.0, 1., edge + bulge);
    float stripe_r = mod(dir + refr_r, 1.);
    float r = get_color_channel(color1.r, color2.r, stripe_r, w, 0.02 + .03 * u_refraction * bulge, bulge);
    float stripe_g = mod(dir, 1.);
    float g = get_color_channel(color1.g, color2.g, stripe_g, w, 0.01 / (1. - diagonal), bulge);
    float stripe_b = mod(dir - refr_b, 1.);
    float b = get_color_channel(color1.b, color2.b, stripe_b, w, .01, bulge);
    color = vec3(r, g, b);
    color *= opacity;
    fragColor = vec4(color, opacity);
}
`;

/* ─── Vertex Shader ─── */
const vertexShaderSource = `#version 300 es
precision mediump float;
in vec2 a_position;
out vec2 vUv;
void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

/* ─── Default props ─── */
interface LiquidMetalProps {
  imageSource?: string;
  speed?: number;
  dispersion?: number;
  edge?: number;
  patternBlur?: number;
  liquify?: number;
  patternScale?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function LiquidMetal({
  imageSource = "",
  speed = 0.3,
  dispersion = 0.015,
  edge = 0.4,
  patternBlur = 0.005,
  liquify = 0.07,
  patternScale = 2,
  style,
  className,
}: LiquidMetalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gl, setGl] = useState<WebGL2RenderingContext | null>(null);
  const [uniforms, setUniforms] = useState<Record<string, WebGLUniformLocation>>({});
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [processing, setProcessing] = useState(false);
  const totalAnimationTime = useRef(0);
  const lastRenderTime = useRef(0);

  /* ── Image parse (Poisson solve) ── */
  const parseLogoImage = useCallback((file: File): Promise<ImageData> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    return new Promise((resolve, reject) => {
      if (!file || !ctx) { reject(new Error("Invalid")); return; }
      const img = new Image();
      img.onload = function () {
        if (file.type === "image/svg+xml") { img.width = 1000; img.height = 1000; }
        const MAX_SIZE = 1000; const MIN_SIZE = 500;
        let width = img.naturalWidth; let height = img.naturalHeight;
        if (width > MAX_SIZE || height > MAX_SIZE || width < MIN_SIZE || height < MIN_SIZE) {
          if (width > height) {
            if (width > MAX_SIZE) { height = Math.round(height * MAX_SIZE / width); width = MAX_SIZE; }
            else if (width < MIN_SIZE) { height = Math.round(height * MIN_SIZE / width); width = MIN_SIZE; }
          } else {
            if (height > MAX_SIZE) { width = Math.round(width * MAX_SIZE / height); height = MAX_SIZE; }
            else if (height < MIN_SIZE) { width = Math.round(width * MIN_SIZE / height); height = MIN_SIZE; }
          }
        }
        canvas.width = width; canvas.height = height;
        const shapeCanvas = document.createElement("canvas");
        shapeCanvas.width = width; shapeCanvas.height = height;
        const shapeCtx = shapeCanvas.getContext("2d")!;
        shapeCtx.drawImage(img, 0, 0, width, height);
        const shapeImageData = shapeCtx.getImageData(0, 0, width, height);
        const data = shapeImageData.data;
        const shapeMask = new Array(width * height).fill(false);
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx4 = (y * width + x) * 4;
            const r = data[idx4], g = data[idx4 + 1], b = data[idx4 + 2], a = data[idx4 + 3];
            shapeMask[y * width + x] = !(r === 255 && g === 255 && b === 255 && a === 255 || a === 0);
          }
        }
        const inside = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height && shapeMask[y * width + x];
        const boundaryMask = new Array(width * height).fill(false);
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            if (!shapeMask[idx]) continue;
            let isBoundary = false;
            for (let ny = y - 1; ny <= y + 1 && !isBoundary; ny++) {
              for (let nx = x - 1; nx <= x + 1 && !isBoundary; nx++) {
                if (!inside(nx, ny)) isBoundary = true;
              }
            }
            if (isBoundary) boundaryMask[idx] = true;
          }
        }
        const u = new Float32Array(width * height).fill(0);
        const newU = new Float32Array(width * height).fill(0);
        const C = 0.01; const ITERATIONS = 300;
        const getU = (x: number, y: number, arr: Float32Array) => {
          if (x < 0 || x >= width || y < 0 || y >= height) return 0;
          if (!shapeMask[y * width + x]) return 0;
          return arr[y * width + x];
        };
        for (let iter = 0; iter < ITERATIONS; iter++) {
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const idx = y * width + x;
              if (!shapeMask[idx] || boundaryMask[idx]) { newU[idx] = 0; continue; }
              const sumN = getU(x + 1, y, u) + getU(x - 1, y, u) + getU(x, y + 1, u) + getU(x, y - 1, u);
              newU[idx] = (C + sumN) / 4;
            }
          }
          for (let i = 0; i < width * height; i++) u[i] = newU[i];
        }
        let maxVal = 0;
        for (let i = 0; i < width * height; i++) { if (u[i] > maxVal) maxVal = u[i]; }
        const alpha = 2;
        const outImg = ctx!.createImageData(width, height);
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x; const px = idx * 4;
            if (!shapeMask[idx]) {
              outImg.data[px] = 255; outImg.data[px + 1] = 255; outImg.data[px + 2] = 255; outImg.data[px + 3] = 255;
            } else {
              const raw = u[idx] / maxVal; const remapped = Math.pow(raw, alpha); const gray = 255 * (1 - remapped);
              outImg.data[px] = gray; outImg.data[px + 1] = gray; outImg.data[px + 2] = gray; outImg.data[px + 3] = 255;
            }
          }
        }
        resolve(outImg);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  /* ── Default SVG ── */
  const createDefaultSVGImage = useCallback(() => {
    return new Promise<ImageData>((resolve, reject) => {
      const svgString = `<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M127.571 97.1191H272.428V169.545H200L127.571 97.1191ZM127.571 169.545H200L272.428 241.973H127.571V169.545ZM127.571 241.973H200V314.402L127.571 241.973Z" fill="black"/>
      </svg>`;
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const file = new File([blob], "default.svg", { type: "image/svg+xml" });
      parseLogoImage(file).then(resolve).catch(reject);
    });
  }, [parseLogoImage]);

  /* ── Process image ── */
  useEffect(() => {
    if (!imageSource) {
      setProcessing(true);
      createDefaultSVGImage()
        .then((d) => { setImageData(d); setProcessing(false); })
        .catch((e) => { console.error(e); setProcessing(false); });
      return;
    }
    setProcessing(true);
    // Handle relative URLs by prepending origin
    const url = imageSource.startsWith('http') ? imageSource : `${window.location.origin}${imageSource}`;
    fetch(url)
      .then((r) => r.blob())
      .then((blob) => { const file = new File([blob], "image", { type: blob.type }); return parseLogoImage(file); })
      .then((d) => { setImageData(d); setProcessing(false); })
      .catch((e) => { console.error("LiquidMetal image error:", e); setProcessing(false); });
  }, [imageSource, parseLogoImage, createDefaultSVGImage]);

  /* ── Init WebGL ── */
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("webgl2", { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!context) { console.error("WebGL2 not supported"); return; }

    function createShader(gl: WebGL2RenderingContext, sourceCode: string, type: number) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, sourceCode);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }
    const vertexShader = createShader(context, vertexShaderSource, context.VERTEX_SHADER);
    const fragmentShader = createShader(context, liquidFragSource, context.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = context.createProgram();
    if (!program) return;
    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);
    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      console.error("Link error:", context.getProgramInfoLog(program));
      return;
    }

    const uniformLocations: Record<string, WebGLUniformLocation> = {};
    const uniformCount = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const info = context.getActiveUniform(program, i);
      if (info) {
        const loc = context.getUniformLocation(program, info.name);
        if (loc) uniformLocations[info.name] = loc;
      }
    }

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
    context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);
    context.useProgram(program);
    const positionLocation = context.getAttribLocation(program, "a_position");
    context.enableVertexAttribArray(positionLocation);
    context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
    context.vertexAttribPointer(positionLocation, 2, context.FLOAT, false, 0, 0);
    context.enable(context.BLEND);
    context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);

    setGl(context);
    setUniforms(uniformLocations);

    return () => {
      context.deleteProgram(program);
      context.deleteShader(vertexShader);
      context.deleteShader(fragmentShader);
      context.deleteBuffer(vertexBuffer);
    };
  }, []);

  /* ── Update uniforms ── */
  useEffect(() => {
    if (!gl || !uniforms || Object.keys(uniforms).length === 0) return;
    gl.uniform1f(uniforms.u_patternScale, patternScale);
    gl.uniform1f(uniforms.u_refraction, dispersion);
    gl.uniform1f(uniforms.u_edge, edge);
    gl.uniform1f(uniforms.u_patternBlur, patternBlur);
    gl.uniform1f(uniforms.u_liquid, liquify);
  }, [gl, uniforms, patternScale, dispersion, edge, patternBlur, liquify]);

  /* ── Canvas resize + texture upload ── */
  useEffect(() => {
    if (!gl || !uniforms || !canvasRef.current || !imageData) return;
    const canvas = canvasRef.current;
    const imgRatio = imageData.width / imageData.height;
    const rect = canvas.getBoundingClientRect();
    // Use a minimum fallback size if rect is 0 (element not painted yet)
    const w = rect.width || 300;
    const h = rect.height || 300;
    const size = Math.min(w, h) * devicePixelRatio;
    canvas.width = size;
    canvas.height = size;
    gl.viewport(0, 0, size, size);
    gl.uniform1f(uniforms.u_ratio, 1);
    gl.uniform1f(uniforms.u_img_ratio, imgRatio);

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, imageData.width, imageData.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData.data);
    gl.uniform1i(uniforms.u_image_texture, 0);

    return () => { if (texture) gl.deleteTexture(texture); };
  }, [gl, uniforms, imageData]);

  /* ── Animation loop ── */
  useEffect(() => {
    if (!gl || !uniforms || !imageData) return;
    let animationId: number;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastRenderTime.current;
      lastRenderTime.current = currentTime;
      totalAnimationTime.current += deltaTime * speed;
      const normalizedTime = totalAnimationTime.current % 10000;
      gl.uniform1f(uniforms.u_time, normalizedTime);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(animate);
    };
    lastRenderTime.current = performance.now();
    animationId = requestAnimationFrame(animate);
    return () => { if (animationId) cancelAnimationFrame(animationId); };
  }, [gl, uniforms, imageData, speed]);

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        ...style,
      }}
    >
      {processing && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              border: "3px solid rgba(168,85,247,0.2)",
              borderTop: "3px solid #a855f7",
              borderRadius: "50%",
              animation: "lm-spin 1s linear infinite",
            }}
          />
          <style>{`@keyframes lm-spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
