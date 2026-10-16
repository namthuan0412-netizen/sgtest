// @ts-nocheck
/*
 * Sun Group – Section "Về Sun Group" + vòng tròn hệ sinh thái (Framer Code Component)
 * Chuyển từ trang test sgtest.vercel.app (HTML/CSS/JS thuần) sang 1 file cho Framer.
 *
 * - Vòng tròn 5 lĩnh vực: rê chuột sáng mảng, bấm (hoặc Tab + Enter / phím mũi tên) để đổi nội dung,
 *   hiệu ứng "Nhịp trống" (trống nảy, sóng âm vàng, ảnh mở theo hình tròn với vầng sáng hoàng kim).
 * - Trống đồng xoay theo chiều kim đồng hồ, 2 vòng line xoay ngược chiều.
 * - 2 nút mũi tên đổi lĩnh vực trước / sau, nút "Khám phá thêm" dẫn tới link của lĩnh vực đang chọn.
 * - Ảnh mảng vòng tròn (seg-*-navy, grooves-navy, ring-dim-navy) lấy theo "Thư mục ảnh"; ảnh nội dung từng lĩnh vực đổi trong bảng thuộc tính.
 * - Font CDA Independence nạp từ "Link font"; nếu đã cài font trong Framer thì để trống link và chỉ ghi tên font.
 *
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 1707
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
import { useEffect, useId, useMemo, useRef } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

const FONT_STACK = '"Be Vietnam Pro", "Segoe UI", Arial, sans-serif'

function esc(t: any): string {
    return String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as any)[c])
}
function svgUri(s: string): string {
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s)
}
function withSlash(u: string): string {
    if (!u) return ""
    return u.endsWith("/") ? u : u + "/"
}
function pickImage(img: any, fallback: string): string {
    if (img && typeof img === "object" && img.src) return img.src
    if (typeof img === "string" && img) return img
    return fallback
}
function fontFaceCss(family: string, url: string): string {
    if (!url) return ""
    return `@font-face { font-family: "${family.replace(/"/g, "")}"; src: url("${url.replace(/"/g, "")}") format("woff2-variations"), url("${url.replace(/"/g, "")}") format("woff2"); font-weight: 400 700; font-style: normal; font-display: swap; }\n`
}
function isCanvasNow(): boolean {
    try { return RenderTarget.current() === RenderTarget.canvas } catch (e) { return false }
}

const ROOT = "sgf-eco"

// ---------- CSS (đã gói gọn dưới .sgf-eco để không đụng phần còn lại của trang) ----------
const CSS = `.sgf-eco { --font: "CDA Independence", "Be Vietnam Pro", "Segoe UI", Arial, sans-serif; --fw-regular: 420; --fw-medium: 500; --fw-semibold: 600; --bg-center: #750d1b; --bg-edge: #4b0d18; --gold-1: #ffe284; --gold-2: #d9b137; --pink: #f6d5d4; --label: #e8c495; --body: #f8f2e9; --deep: #3e0502; --ease: cubic-bezier(0.22, 0.61, 0.36, 1); --spin-drum: 60s; --spin-lines-outer: 90s; --spin-lines-inner: 90s; }
.sgf-eco *, .sgf-eco *::before, .sgf-eco *::after { box-sizing: border-box; }
.sgf-eco { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
.sgf-eco { margin: 0; background: var(--bg-edge); color: #fff; font-family: var(--font); font-weight: var(--fw-regular); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.sgf-eco img { display: block; max-width: 100%; }
.sgf-eco .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.sgf-eco .text-gold { background: linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 100%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-box-decoration-break: clone; box-decoration-break: clone; padding-block: 0.32em 0.12em; }
.sgf-eco .trim { text-box: trim-both cap alphabetic; }
.sgf-eco .sg-about { --bg-center: #10306b; --bg-edge: #0a1c40; --pink: #d4e0f6; --deep: #061633; position: relative; overflow: hidden; background: radial-gradient(70.71% 70.71% at 50% 50%, var(--bg-center) 0%, var(--bg-edge) 100%); isolation: isolate; }
.sgf-eco .sg-intro { --compass: clamp(880px, 91.111vw, 1312px); position: relative; padding: 242px 16px 216px; text-align: center; }
.sgf-eco .sg-intro__compass { position: absolute; left: 50%; top: calc(var(--compass) * -0.54268); width: var(--compass); height: var(--compass); max-width: none; transform: translateX(-50%); pointer-events: none; user-select: none; z-index: -1; }
.sgf-eco .sg-intro__inner { max-width: 910px; margin: 0 auto; }
.sgf-eco .sg-intro__eyebrow { margin: 0; font-size: 18px; font-weight: var(--fw-medium); line-height: 1.1; letter-spacing: -0.01em; }
.sgf-eco .sg-intro__title { margin: 24px 0 0; font-size: clamp(20px, calc(12px + 1.389vw), 32px); font-weight: var(--fw-regular); line-height: 1.35; letter-spacing: -0.01em; text-transform: uppercase; text-wrap: balance; }
.sgf-eco .sg-intro__scroll { display: flex; width: fit-content; margin: 40px auto 0; padding: 6px; border-radius: 999px; color: #fff; animation: sg-bob 2.4s var(--ease) infinite; }
.sgf-eco .sg-intro__scroll:focus-visible { outline: 2px solid var(--gold-1); outline-offset: 4px; }
@keyframes sg-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}
.sgf-eco .sg-eco { position: relative; }
.sgf-eco .sg-eco__inner { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 808.84fr) minmax(0, 437fr); column-gap: 51px; align-items: center; padding: 122px 114px 122px 29px; }
.sgf-eco .sg-eco__visual { padding-left: 3.0909%; padding-right: 0.944%; }
.sgf-eco .sg-eco__content { position: relative; z-index: 1; align-self: center; margin-top: 19px; }
.sgf-eco .sg-eco__heading { margin: 0; font-size: clamp(24px, 2.5vw, 36px); font-weight: var(--fw-regular); line-height: 1.35; letter-spacing: -0.01em; text-transform: uppercase; }
.sgf-eco .sg-eco__heading-sub { color: var(--pink); font-weight: var(--fw-medium); }
.sgf-eco .sg-eco__panel { position: relative; margin-top: 80px; }
.sgf-eco .sg-eco__title-row { display: flex; align-items: flex-start; gap: 10px; }
.sgf-eco .sg-eco__icon { flex: none; width: 34px; height: 17px; margin-top: 3px; transform-origin: 50% 100%; overflow: visible; }
.sgf-eco .sg-eco__title { margin: 0; color: var(--gold-2); font-size: clamp(22px, 1.944vw, 28px); text-wrap: balance; font-weight: var(--fw-medium); line-height: 1.35; letter-spacing: -0.01em; text-transform: uppercase; }
.sgf-eco .sg-eco__desc { margin: 16px 0 0; color: var(--body); font-size: clamp(16px, 1.25vw, 18px); line-height: 1.5; }
.sgf-eco .sg-eco__desc .w { display: inline-block; }
.sgf-eco .sg-eco__media { position: relative; margin: 40px 0 0; aspect-ratio: 437 / 270; border-radius: 2px; overflow: hidden; }
.sgf-eco .sg-eco__media-clip { width: 100%; height: 100%; overflow: hidden; }
.sgf-eco .sg-eco__media img { width: 100%; height: 100%; object-fit: cover; }
.sgf-eco .sg-eco__actions { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 40px; }
.sgf-eco .sg-eco__more { display: inline-flex; align-items: center; min-height: 35.72px; padding: 7.11px 14.22px; border: 0.75px solid transparent; border-radius: 2.13px; background: radial-gradient(182px 151px at 50% 50%, #2e5db3 0%, #03153a 100%) padding-box, linear-gradient(10.9deg, #e1cc98 20%, #3960a7 46%, #e1cc98 76%) border-box; box-shadow: inset 0 3px 2px rgba(255, 255, 255, 0.25); color: #f7e6b8; font-size: 18px; font-weight: var(--fw-medium); line-height: 1.1; letter-spacing: -0.01em; text-decoration: none; white-space: nowrap; transition: filter 0.3s var(--ease), transform 0.3s var(--ease); }
.sgf-eco .sg-eco__more:hover { filter: brightness(1.14); }
.sgf-eco .sg-eco__more:active { transform: translateY(1px); }
.sgf-eco .sg-eco__more:focus-visible { outline: 2px solid var(--gold-1); outline-offset: 3px; }
.sgf-eco .sg-eco__nav { display: flex; gap: 10px; }
.sgf-eco .sg-eco__arrow { display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: #e2cd98; cursor: pointer; transition: background-color 0.3s var(--ease), color 0.3s var(--ease); }
.sgf-eco .sg-eco__arrow svg { display: block; width: 36px; height: 36px; }
.sgf-eco .sg-eco__arrow:hover { background: rgba(226, 205, 152, 0.14); color: #f7e6b8; }
.sgf-eco .sg-eco__arrow:focus-visible { outline: 2px solid var(--gold-1); outline-offset: 3px; }
@property --k {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}
.sgf-eco .sg-eco__ring { position: absolute; border-radius: 50%; border: 2px solid rgba(255, 246, 220, 0.98); box-shadow: 0 0 6px 1px rgba(255, 250, 232, 0.95), 0 0 18px 6px rgba(255, 216, 115, 0.9), 0 0 48px 18px rgba(255, 172, 60, 0.5), inset 0 0 14px 4px rgba(255, 228, 145, 0.8), inset 0 0 50px 16px rgba(255, 190, 80, 0.4); mix-blend-mode: screen; opacity: 0; transform: scale(var(--k)); pointer-events: none; }
.sgf-eco .sg-eco__rays { position: absolute; border-radius: 50%; background: repeating-conic-gradient(from 0deg, rgba(255, 242, 200, 0) 0deg, rgba(255, 242, 200, 0.95) 1.1deg, rgba(255, 242, 200, 0) 2.4deg, rgba(255, 242, 200, 0) 25.714deg), repeating-conic-gradient(from 7deg, rgba(255, 210, 110, 0) 0deg, rgba(255, 210, 110, 0.5) 0.8deg, rgba(255, 210, 110, 0) 1.8deg, rgba(255, 210, 110, 0) 6.43deg); -webkit-mask-image: radial-gradient(closest-side, transparent 72%, #000 90%, #000 97%, transparent 100%); mask-image: radial-gradient(closest-side, transparent 72%, #000 90%, #000 97%, transparent 100%); mix-blend-mode: screen; opacity: 0; transform: rotate(calc(16deg * var(--k) - 8deg)) scale(var(--k)); pointer-events: none; }
.sgf-eco .sg-eco__sparkles { position: absolute; inset: 0; pointer-events: none; }
.sgf-eco .sg-spark { position: absolute; left: 0; top: 0; opacity: 0; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='g'%3E%3Cstop offset='0' stop-color='%23ffffff'/%3E%3Cstop offset='.35' stop-color='%23fff3c4'/%3E%3Cstop offset='1' stop-color='%23f5c84c'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath d='M50 0C52 38 62 48 100 50C62 52 52 62 50 100C48 62 38 52 0 50C38 48 48 38 50 0Z' fill='url(%23g)'/%3E%3C/svg%3E") center / contain no-repeat; filter: drop-shadow(0 0 3px rgba(255, 238, 175, 0.95)) drop-shadow(0 0 9px rgba(255, 190, 80, 0.75)); mix-blend-mode: screen; pointer-events: none; }
.sgf-eco .sg-eco__sheen { position: absolute; inset: 0; background: linear-gradient(105deg, transparent 34%, rgba(255, 200, 90, 0) 39%, rgba(255, 222, 140, 0.45) 46%, rgba(255, 250, 228, 0.85) 50%, rgba(255, 222, 140, 0.45) 54%, rgba(255, 200, 90, 0) 61%, transparent 66%); mix-blend-mode: screen; opacity: 0; pointer-events: none; }
.sgf-eco .wheel { position: relative; width: 100%; aspect-ratio: 1 / 1; container-type: inline-size; -webkit-tap-highlight-color: transparent; }
.sgf-eco .wheel__layer { position: absolute; left: calc(var(--x) * 1%); top: calc(var(--y) * 1%); width: calc(var(--w) * 1%); height: auto; max-width: none; pointer-events: none; user-select: none; }
.sgf-eco .wheel__fill { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.sgf-eco .wheel__lines { --x: -12.5; --y: -12.5; --w: 125; animation: sg-spin-ccw var(--spin-lines-outer) linear infinite; }
.sgf-eco .wheel__lines--inner { animation-duration: var(--spin-lines-inner); }
@keyframes sg-spin-ccw { to { transform: rotate(-360deg); } }
.sgf-eco .wheel__seg { opacity: 0; transition: opacity 0.45s var(--ease); }
.sgf-eco .wheel__seg.is-active, .sgf-eco .wheel__seg.is-hover { opacity: 1; }
.sgf-eco .wheel__circles { overflow: visible; }
.sgf-eco .wheel__core { position: absolute; left: 29.128%; top: 29.128%; width: 41.744%; aspect-ratio: 1 / 1; pointer-events: none; }
.sgf-eco .wheel__burst { position: absolute; inset: -42%; border-radius: 50%; background: repeating-conic-gradient(from -90deg, rgba(255, 232, 160, 0) 0deg, rgba(255, 232, 160, 0.85) 1.6deg, rgba(255, 232, 160, 0) 3.2deg, rgba(255, 232, 160, 0) 25.714deg), repeating-conic-gradient(from -77deg, rgba(255, 200, 90, 0) 0deg, rgba(255, 200, 90, 0.35) 1deg, rgba(255, 200, 90, 0) 2deg, rgba(255, 200, 90, 0) 12.857deg); -webkit-mask-image: radial-gradient(closest-side, transparent 50%, #000 58%, rgba(0, 0, 0, 0.55) 78%, transparent 100%); mask-image: radial-gradient(closest-side, transparent 50%, #000 58%, rgba(0, 0, 0, 0.55) 78%, transparent 100%); opacity: 0; pointer-events: none; }
.sgf-eco .wheel__glow { position: absolute; inset: -16%; border-radius: 50%; background: radial-gradient(circle, rgba(255, 214, 110, 0.5) 0%, rgba(255, 180, 60, 0.22) 45%, rgba(255, 180, 60, 0) 70%); opacity: 0; pointer-events: none; }
.sgf-eco .wheel__shock { position: absolute; left: 29.085%; top: 29.085%; width: 41.83%; aspect-ratio: 1 / 1; border-radius: 50%; background: radial-gradient(closest-side, rgba(255, 214, 110, 0) 76%, rgba(255, 214, 110, 0.55) 91%, rgba(255, 214, 110, 0) 100%); opacity: 0; pointer-events: none; }
.sgf-eco .wheel__waves { position: absolute; left: -100%; top: -100%; width: 300%; height: 300%; overflow: visible; pointer-events: none; }
.sgf-eco .wave { fill: none; vector-effect: non-scaling-stroke; opacity: 0; }
.sgf-eco .wave--line { stroke: #ffe284; stroke-width: 1.4; }
.sgf-eco .wave--dots { stroke: #f0d694; stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: 0.01 11; }
.sgf-eco .wave--ticks { stroke: #d9b137; stroke-width: 1; stroke-dasharray: 12 8; }
.sgf-eco .wheel__medallion { position: relative; width: 100%; height: 100%; animation: sg-spin var(--spin-drum) linear infinite; }
.sgf-eco .wheel__core-label { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); padding-block: 0.32em; background: linear-gradient(180deg, #2b5fc4 0.32em, #0b2f7d calc(100% - 0.32em)); -webkit-background-clip: text; background-clip: text; color: transparent; font-size: max(10px, 3.182cqw); font-weight: var(--fw-semibold); line-height: 1.35; letter-spacing: -0.02em; text-transform: uppercase; white-space: nowrap; }
@keyframes sg-spin { to { transform: rotate(360deg); } }
.sgf-eco .wheel__words { overflow: visible; }
.sgf-eco .wheel__word { fill: var(--label); font-family: var(--font); font-size: 27.21px; font-weight: var(--fw-medium); letter-spacing: -0.01em; text-anchor: middle; dominant-baseline: central; transition: opacity 0.35s var(--ease); }
.sgf-eco .wheel__word.is-hidden { opacity: 0; }
.sgf-eco .wheel__hit { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.sgf-eco .wheel__hit path { fill: transparent; stroke: transparent; stroke-width: 3; cursor: pointer; outline: none; transition: stroke 0.2s; }
.sgf-eco .wheel__hit path:focus-visible { stroke: var(--gold-1); }
@media (max-width: 1099px) {
.sgf-eco .sg-eco__inner { grid-template-columns: minmax(0, 1fr); row-gap: 64px; padding: 48px 16px 88px; }
.sgf-eco .sg-eco__visual { width: 100%; max-width: 640px; margin: 0 auto; padding: 0 6%; }
.sgf-eco .sg-eco__content { width: 100%; max-width: 560px; margin: 0 auto; }
.sgf-eco .sg-eco__heading { font-size: clamp(24px, 4vw, 32px); }
.sgf-eco .sg-eco__panel { margin-top: 40px; }
.sgf-eco .sg-eco__media { margin-top: 28px; }
.sgf-eco .br-desktop { display: none; }
}
@media (max-width: 767px) {
.sgf-eco .sg-intro { padding: 136px 16px 72px; }
.sgf-eco .sg-intro__eyebrow { font-size: 16px; }
.sgf-eco .sg-intro__title { margin-top: 20px; }
.sgf-eco .sg-intro__scroll { margin-top: 32px; }
.sgf-eco .sg-eco__visual { padding: 0 4%; }
}
@media (prefers-reduced-motion: reduce) {
.sgf-eco { scroll-behavior: auto; }
.sgf-eco .wheel__medallion, .sgf-eco .wheel__lines, .sgf-eco .sg-intro__scroll { animation: none; }
.sgf-eco .wheel__seg, .sgf-eco .wheel__word, .sgf-eco .sg-eco__panel { transition: none; }
}
`

// ---------- Hình vẽ SVG nhúng sẵn ----------
const SVG_COMPASS = svgUri(`<svg width="369" height="369" viewBox="0 0 369 369" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="184.049" cy="184.049" r="184.049" fill="url(#cp-bg)"/><g id="cp-diamond"><path d="M192.994 23.498C192.869 23.6056 192.702 23.7384 192.529 23.8721C192.357 24.0055 192.179 24.1383 192.033 24.2471C191.89 24.3542 191.775 24.4397 191.729 24.4756L191.728 24.4756C190.825 25.1611 189.951 25.8834 189.106 26.6396L189.105 26.6396C188.536 27.156 187.799 27.894 187.193 28.7109C186.643 29.4535 186.19 30.276 186.08 31.0654C185.482 30.6052 185.29 30.123 185.321 29.626C185.357 29.0665 185.674 28.4662 186.099 27.835C186.388 27.405 186.673 26.8305 186.891 26.3789C187.803 24.4815 187.661 22.4963 186.986 20.5947L186.845 20.2158C186.665 19.7298 186.364 19.1097 185.984 18.5547C185.607 18.002 185.14 17.4973 184.624 17.2646L184.44 17.1816L184.447 17.3828C184.482 18.3987 184.451 19.5881 184.45 20.6201L184.451 26.6641C184.452 27.599 184.424 28.7137 184.468 29.6592L183.957 29.665L183.835 29.666L183.833 29.7891C183.828 30.2413 183.834 30.7063 183.837 31.1592L180.505 31.1592C180.44 29.8181 179.555 28.5343 178.47 27.4248C177.347 26.2772 175.987 25.2913 175.027 24.5918C174.915 24.5098 174.533 24.2278 174.163 23.9473C173.978 23.8069 173.797 23.6677 173.654 23.5537C173.583 23.4967 173.523 23.4464 173.477 23.4062C173.473 23.4032 173.47 23.3994 173.467 23.3965C174.581 22.5192 175.863 21.5492 177.039 20.4844C178.235 19.4014 179.33 18.2128 180.036 16.9092C180.272 16.474 180.413 15.9978 180.522 15.5273C181.106 15.9758 181.425 16.6422 181.206 17.4102C181.128 17.6836 180.967 17.9795 180.783 18.2812C180.603 18.5763 180.397 18.8831 180.25 19.1543C179.94 19.7249 179.619 20.3004 179.403 20.9385L179.403 20.9395C178.963 22.2744 178.949 23.5203 179.291 24.874C179.701 26.4988 180.448 28.4167 181.975 29.3564L182.157 29.4687L182.165 29.2539C182.21 27.9016 182.172 26.2946 182.172 24.9375L182.172 16.9717C182.33 16.9708 182.488 16.9708 182.646 16.9756L182.764 16.9785L182.773 16.8613C182.805 16.4852 182.794 15.857 182.791 15.4287C183.878 15.4144 185.004 15.4255 186.097 15.4307C186.217 17.0691 187.423 18.6055 188.858 19.9482C190.289 21.2862 191.986 22.4694 193.121 23.3809C193.088 23.4132 193.046 23.4534 192.994 23.498Z" fill="#0D2653"/></g><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(35.6746 -29.7833) rotate(10.2857)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(76.0939 -52.718) rotate(20.5714)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(119.959 -68.0669) rotate(30.8571)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(165.859 -75.3369) rotate(41.1429)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(212.32 -74.2941) rotate(51.4286)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(257.849 -64.9722) rotate(61.7143)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(300.981 -47.6707) rotate(72)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(340.33 -22.9457) rotate(82.2857)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(374.633 8.40814) rotate(92.5714)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(402.786 45.383) rotate(102.857)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(423.884 86.7906) rotate(113.143)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(437.249 131.3) rotate(123.429)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(442.453 177.48) rotate(133.714)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(439.326 223.848) rotate(144)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(427.971 268.912) rotate(154.286)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(408.752 311.225) rotate(164.571)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(382.286 349.425) rotate(174.857)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(349.425 382.286) rotate(-174.857)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(311.225 408.752) rotate(-164.571)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(268.912 427.971) rotate(-154.286)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(223.848 439.326) rotate(-144)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(177.48 442.453) rotate(-133.714)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(131.3 437.249) rotate(-123.429)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(86.7906 423.884) rotate(-113.143)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(45.383 402.786) rotate(-102.857)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(8.40815 374.633) rotate(-92.5714)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(-22.9457 340.33) rotate(-82.2857)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(-47.6707 300.981) rotate(-72)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(-64.9722 257.849) rotate(-61.7143)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(-74.2941 212.32) rotate(-51.4286)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(-75.3369 165.859) rotate(-41.1429)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(-68.0669 119.959) rotate(-30.8571)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(-52.718 76.0938) rotate(-20.5714)"/><use xlink:href="#cp-diamond" href="#cp-diamond" transform="translate(-29.7832 35.6746) rotate(-10.2857)"/><circle cx="183.668" cy="183.664" r="129.716" stroke="#0D2653" stroke-width="1.14495"/><circle cx="183.665" cy="183.665" r="135.971" stroke="#0D2653" stroke-width="4.25548"/><circle cx="183.666" cy="183.666" r="140.484" stroke="#0D2653" stroke-width="1.14495"/><circle cx="183.666" cy="183.666" r="177.094" stroke="#0D2653" stroke-width="1.14495"/><path d="M194.776 141.154L194.821 141.498L195.032 141.223L247.774 72.3145L214.472 152.446L214.339 152.767L214.659 152.634L294.79 119.329L225.883 172.073L225.607 172.284L225.951 172.329L312.001 183.553L225.951 194.776L225.607 194.821L225.883 195.032L294.788 247.773L214.659 214.472L214.339 214.339L214.472 214.659L247.773 294.788L195.032 225.883L194.821 225.607L194.776 225.951L183.553 312.001L172.329 225.951L172.284 225.607L172.073 225.883L119.329 294.79L152.634 214.659L152.767 214.339L152.446 214.472L72.3145 247.774L141.223 195.032L141.498 194.821L141.154 194.776L55.1035 183.553L141.154 172.329L141.498 172.284L141.223 172.073L72.3115 119.328L152.446 152.634L152.767 152.767L152.634 152.446L119.328 72.3115L172.073 141.223L172.284 141.498L172.329 141.154L183.553 55.1035L194.776 141.154Z" fill="#0D2653" stroke="#0D2653" stroke-width="0.286237"/><defs><linearGradient id="cp-bg" x1="184.049" y1="0" x2="184.049" y2="368.099" gradientUnits="userSpaceOnUse"><stop stop-color="#0E244D"/><stop offset="1" stop-color="#0D2E6A"/></linearGradient><linearGradient id="cp-diamond-fill" x1="184.493" y1="15.2969" x2="182.101" y2="31.2969" gradientUnits="userSpaceOnUse"><stop stop-color="#F6F4F0"/><stop offset="1" stop-color="#F0D694"/></linearGradient><linearGradient id="cp-diamond-stroke" x1="183.297" y1="15.2969" x2="183.297" y2="31.2969" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#E7BA46"/></linearGradient></defs></svg>`)
const SVG_MEDALLION = svgUri(`<svg width="367.3507" height="367.3507" viewBox="0 0 367.3507 367.3507" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><radialGradient id="s" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(133.1 133.1) rotate(90) scale(133.1)"><stop stop-color="#FFF6CB"/><stop offset="1" stop-color="#EDB84F"/></radialGradient></defs><circle cx="183.6757" cy="183.6718" r="134.1034" stroke="#EEDD85" stroke-width="1.1837"/><circle cx="183.6758" cy="183.6738" r="140.5698" stroke="#EEDD85" stroke-width="4.3994"/><circle cx="183.6748" cy="183.6748" r="145.2353" stroke="#EEDD85" stroke-width="1.1837"/><circle cx="183.6753" cy="183.6753" r="183.0835" stroke="#EDDC89" stroke-width="1.1837"/><g transform="translate(4.2529 2.2529)"><g id="b"><path d="M175.754 21.646L175.794 21.6469L175.805 21.6738C175.783 21.6884 175.745 21.7127 175.721 21.7218C174.543 22.1651 173.347 22.4817 172.126 22.7865C170.962 23.072 169.794 23.3393 168.622 23.5882C167.156 23.9111 165.561 24.2514 164.078 24.4518C163.256 24.5558 162.431 24.6349 161.604 24.6892C161.431 24.7019 160.585 24.7769 160.498 24.7432L160.462 24.6523C160.344 24.2185 160.247 23.8468 160.154 23.4055C164.419 23.3938 168.561 23.1798 172.748 22.3197C173.686 22.127 174.845 21.9163 175.754 21.646Z" fill="#EEDD85"/><path d="M158.863 21.1024C159.271 21.1509 159.811 21.2625 160.234 21.3289C161.07 21.4578 161.909 21.5675 162.749 21.6581C166.266 22.0201 169.812 21.9902 173.322 21.5691C173.695 21.5268 176.26 21.1408 176.404 21.1714L176.368 21.1868L176.413 21.1574L176.418 21.1669C176.268 21.2414 176.068 21.275 175.901 21.3112C175.234 21.4812 174.52 21.633 173.84 21.7452C170.468 22.3011 167.037 22.703 163.615 22.6353C162.132 22.6059 160.669 22.4914 159.194 22.3585C159.081 21.9404 158.971 21.5217 158.863 21.1024Z" fill="#EEDD85"/><path d="M174.98 22.3441L175.02 22.3542C174.903 22.4691 173.898 22.8993 173.701 22.985C170.041 24.5554 166.284 25.8902 162.454 26.9808L162.298 26.6537C162.164 26.3669 162.037 26.0772 161.918 25.784C164.268 25.309 166.604 24.7668 168.923 24.1583C170.954 23.5946 172.973 22.9898 174.98 22.3441Z" fill="#EEDD85"/><path d="M162.327 19.5269C162.593 19.5848 162.951 19.6948 163.224 19.7657C163.785 19.9113 164.35 20.0427 164.917 20.1598C167.521 20.6772 170.168 20.939 172.823 20.9415C173.803 20.9492 174.783 20.9175 175.761 20.8468C175.989 20.8305 176.875 20.708 177.008 20.7133C176.853 20.8155 176.3 20.8737 176.084 20.9063C175.214 21.0631 174.201 21.1494 173.314 21.2183C169.503 21.514 165.27 21.4521 161.51 20.6941C161.765 20.3023 162.053 19.9059 162.327 19.5269Z" fill="#EEDD85"/><path d="M166.969 18.452C169.461 19.2622 172.032 19.8036 174.639 20.0669C175.297 20.1341 175.957 20.1785 176.618 20.1999C176.922 20.2126 177.576 20.2192 177.848 20.2732C177.514 20.3535 177.089 20.3795 176.741 20.4076C173.537 20.6212 169.056 20.0426 165.943 19.301C166.219 19.0314 166.66 18.6961 166.969 18.452Z" fill="#EEDD85"/><path d="M182.763 16.9136C182.825 16.937 182.946 17.0374 183.004 17.0823C181.695 19.1269 180.252 21.0819 178.683 22.9344C178.309 22.9883 177.908 23.0246 177.531 23.0652C177.436 23.0788 177.426 23.0823 177.333 23.0671C177.347 22.9715 180.173 20.3637 180.374 19.9238C180.391 19.8852 180.876 19.2915 180.94 19.211C181.542 18.4409 182.15 17.6751 182.763 16.9136Z" fill="#EEDD85"/><path d="M200.855 8.07624C201.002 8.0593 201.119 8.06858 201.265 8.07545C200.085 8.39027 198.845 8.61068 197.639 8.9447C196.161 9.35447 194.754 9.80314 193.289 10.2616L192.926 10.3664C193.308 9.92819 193.7 9.49825 194.101 9.07694C196.328 8.59292 198.584 8.25861 200.855 8.07624Z" fill="#EEDD85"/><path d="M163.555 8.2099C163.555 8.2099 167.376 9.89868 167.724 10.0332C171.064 11.339 174.536 12.4015 178.094 13.2067C179.193 13.4612 180.372 13.6896 181.484 13.9208C181.076 13.9299 180.652 13.8508 180.248 13.785C179.07 13.5927 177.936 13.429 176.754 13.21C172.457 12.4142 168.345 11.6597 164.203 10.3961L163.555 8.2099Z" fill="#EEDD85"/><path d="M164.541 11.3077C164.541 11.3077 167.461 11.9737 167.919 12.0718C170.458 12.6105 173.028 13.0641 175.619 13.4315C176.501 13.5557 177.387 13.6665 178.274 13.7639C178.769 13.8162 181.217 13.9982 181.482 14.0908C181.351 14.1503 181.179 14.1297 181.018 14.1266C177.909 14.0843 174.947 13.8445 171.859 13.5642C169.64 13.3627 167.416 13.1749 165.211 12.8911L164.541 11.3077Z" fill="#EEDD85"/><path d="M165.697 13.8132C165.697 13.8132 169.395 14.1379 169.807 14.1576C171.639 14.2565 173.152 14.3756 174.991 14.4047C176.791 14.4288 178.607 14.4332 180.408 14.2956C180.741 14.2701 181.093 14.2435 181.426 14.2421L181.485 14.242L180.639 14.3955C179.125 14.6186 177.138 14.7534 175.613 14.8622C172.661 15.062 169.708 15.2433 166.754 15.4061L165.697 13.8132Z" fill="#EEDD85"/><path d="M162.891 5.40989C162.891 5.40989 169.745 9.27015 170.487 9.6014C172.544 10.5199 174.362 11.2963 176.512 12.062C177.337 12.3569 178.17 12.6374 179.008 12.9033C179.613 13.0924 181.003 13.4896 181.485 13.737C181.136 13.6979 180.802 13.6121 180.459 13.5321C175.149 12.0812 168.328 10.101 163.5 7.58859L162.891 5.40989Z" fill="#EEDD85"/><path d="M167.449 16.0877C168.82 16.0913 170.684 15.9829 171.79 15.8599C173.748 15.6495 175.702 15.4055 177.648 15.1281C178.298 15.035 178.918 14.9275 179.556 14.7932C180.186 14.6605 180.849 14.473 181.485 14.3816C181.201 14.5198 181.063 14.5671 180.751 14.6694C179.539 15.0917 177.486 15.5467 176.181 15.8526L168.812 17.552C168.812 17.552 167.506 16.134 167.449 16.0877Z" fill="#EEDD85"/><path d="M179.548 20.0109L179.617 20.0026L179.609 20.0467C179.137 20.5221 176.916 22.6807 176.563 22.8271C176.144 23.0008 175.153 23.1008 174.664 23.1822L174.61 23.1857L174.605 23.1569C174.865 22.9495 175.292 22.6759 175.575 22.4785C176.099 22.1095 176.62 21.7337 177.135 21.3513C177.594 21.0118 178.067 20.6046 178.52 20.2776C178.634 20.1956 179.359 20.0519 179.548 20.0109Z" fill="#EEDD85"/><path d="M183.259 17.2349C183.347 17.263 183.443 17.2867 183.482 17.3713C183.445 17.5047 183.39 17.6307 183.33 17.7548C182.619 19.2173 181.731 21.2143 180.632 22.4313C180.422 22.6642 180.808 22.2345 180.602 22.4702L179.699 22.8006C179.61 22.821 179.495 22.8497 179.495 22.8497C179.501 22.8264 180.483 21.5588 180.602 21.3957C181.584 20.0541 182.422 18.668 183.259 17.2349Z" fill="#EEDD85"/><path d="M188.673 11.3163L188.692 11.3364L188.68 11.3877C187.11 12.8253 185.603 13.832 183.632 14.6472L183.328 14.3477L182.988 13.9949C185.102 13.4612 186.862 12.4699 188.673 11.3163Z" fill="#EEDD85"/><path d="M188.639 10.8159L188.688 10.8286C188.647 10.9051 188.275 11.127 188.173 11.192C186.851 12.0358 185.441 12.7317 183.967 13.2669L183.834 13.0859L183.542 12.6435C185.471 12.1524 186.812 11.6611 188.639 10.8159Z" fill="#EEDD85"/><path d="M182.306 16.4811C182.372 16.5113 182.492 16.6461 182.549 16.7044C181.721 17.6043 180.933 18.5493 180.108 19.4598C179.776 19.5538 179.474 19.6174 179.138 19.6883C179.072 19.702 179.02 19.7072 178.954 19.7144C178.949 19.7436 181.988 16.7908 182.306 16.4811Z" fill="#EEDD85"/><path d="M188.539 12.0391L188.569 12.0619C188.555 12.1439 188.31 12.4114 188.243 12.4916C187.292 13.6202 186.309 14.4219 185.13 15.2927L184.836 15.0647L184.576 14.8466C184.662 14.781 184.978 14.6047 185.095 14.5354C185.424 14.342 185.748 14.1408 186.067 13.9318C186.957 13.3464 187.728 12.7216 188.539 12.0391Z" fill="#EEDD85"/><path d="M181.504 14.8007C181.587 14.8687 181.586 14.9613 181.619 15.0844C180.686 15.4604 179.784 15.9395 178.882 16.3809C178.786 16.4276 178.617 16.5251 178.516 16.537L178.302 15.9121C179.365 15.5136 180.413 15.1152 181.504 14.8007Z" fill="#EEDD85"/><path d="M181.656 15.4062L181.688 15.4067C181.764 15.4614 181.794 15.5731 181.84 15.6715C180.888 16.2703 179.994 16.9154 179.059 17.5336L178.791 16.9699C179.736 16.4318 180.691 15.9105 181.656 15.4062Z" fill="#EEDD85"/><path d="M183.804 17.4202C183.955 17.4632 183.918 17.4577 184.013 17.5584C183.912 18.4065 183.048 20.9207 182.707 21.6592L181.913 22.046C181.81 22.1006 181.752 22.1231 181.642 22.1629C181.654 21.9891 182.193 21.0543 182.305 20.807C182.813 19.6833 183.384 18.5785 183.804 17.4202Z" fill="#EEDD85"/><path d="M181.965 15.9622C182.012 16.0072 182.102 16.1652 182.141 16.2285C181.56 16.7285 180.987 17.2374 180.422 17.7548C180.303 17.8612 179.814 18.3185 179.709 18.3773L179.66 18.3481L179.359 17.9092C180.201 17.2742 181.109 16.5626 181.965 15.9622Z" fill="#EEDD85"/><path d="M184.353 17.5067C184.43 17.5066 184.486 17.5137 184.561 17.5229L184.593 17.5752C184.63 18.229 184.406 20.0257 184.306 20.6834L183.703 21.1222C183.608 21.1628 183.632 21.1718 183.547 21.1476C183.864 19.789 184.141 18.9245 184.353 17.5067Z" fill="#EEDD85"/><path d="M185.092 17.4326L185.138 17.4782C185.232 18.324 185.339 19.2787 185.266 20.1231L184.892 20.3601C184.826 20.3865 184.825 20.3843 184.758 20.387C184.758 20.387 184.812 20.134 184.83 19.9808C184.926 19.0949 184.892 18.0954 184.889 17.5195C184.955 17.4374 184.983 17.4554 185.092 17.4326Z" fill="#EEDD85"/><path d="M188.374 12.9535C188.294 13.3377 186.854 14.999 186.534 15.3488L186.261 15.1996L186.149 15.136L186.139 15.0877C186.205 15.0122 186.259 14.966 186.337 14.9034C186.971 14.3994 187.531 13.8052 188.091 13.222C188.186 13.1228 188.263 13.0351 188.374 12.9535Z" fill="#EEDD85"/><path d="M185.67 17.2534C185.826 17.4102 186.121 19.2396 186.153 19.5575L185.855 19.7786C185.787 19.8148 185.779 19.8247 185.703 19.8164C185.67 19.7477 185.669 19.5648 185.67 19.4769C185.68 18.795 185.49 18.0494 185.454 17.3725C185.498 17.3073 185.595 17.2828 185.67 17.2534Z" fill="#EEDD85"/><path d="M186.166 17.0125C186.317 17.0362 186.895 18.7234 186.953 18.9144L186.698 19.1638C186.617 19.213 186.624 19.2272 186.548 19.223C186.497 19.1143 186.458 18.7416 186.416 18.5879C186.288 18.1205 186.1 17.6347 185.991 17.168C186.024 17.075 186.066 17.0749 186.166 17.0125Z" fill="#EEDD85"/><path d="M186.687 16.6665C186.826 16.7518 187.549 18.1146 187.665 18.3487L187.394 18.6108L187.345 18.6441C187.328 18.6367 187.312 18.6293 187.296 18.6219C187.088 18.1344 186.676 17.3 186.498 16.8479C186.522 16.7714 186.617 16.7175 186.687 16.6665Z" fill="#EEDD85"/><path d="M187.147 16.2464C187.277 16.305 188.102 17.464 188.227 17.6364L187.997 17.9564L187.943 17.9872C187.891 17.9569 187.081 16.6376 186.955 16.4403L187.147 16.2464Z" fill="#EEDD85"/><path d="M187.569 15.7521C187.853 15.9816 188.417 16.5952 188.674 16.8695C188.621 16.9907 188.527 17.1433 188.459 17.2614L188.439 17.2657C188.334 17.1946 187.538 16.1487 187.39 15.9754L187.569 15.7521Z" fill="#EEDD85"/><path d="M187.914 15.2208C188.072 15.3064 188.9 15.96 189.076 16.1003L188.891 16.4818L188.88 16.4865C188.754 16.4647 187.907 15.6094 187.761 15.4681L187.914 15.2208Z" fill="#EEDD85"/><path d="M188.203 14.6586C188.612 14.8678 189.027 15.1031 189.431 15.325L189.264 15.7109L189.222 15.7234C188.981 15.5941 188.325 15.1088 188.07 14.9283L188.203 14.6586Z" fill="#EEDD85"/><path d="M188.443 14.047C188.865 14.2083 189.284 14.3759 189.7 14.5499C189.658 14.682 189.602 14.8258 189.555 14.9576C189.377 14.9004 188.556 14.4637 188.329 14.352L188.443 14.047Z" fill="#EEDD85"/><path d="M189.003 10.3217C189.142 10.3641 190.144 11.1128 190.347 11.2585C190.372 11.3374 190.345 11.3776 190.322 11.4687C189.823 11.2493 189.036 11.0106 188.929 10.4197L189.003 10.3217Z" fill="#EEDD85"/><path d="M188.638 13.4106C189.056 13.5327 189.476 13.6501 189.897 13.7628L189.797 14.1799C189.524 14.1102 188.843 13.8465 188.545 13.7414L188.638 13.4106Z" fill="#EEDD85"/><path d="M188.81 12.7496C189.224 12.8384 189.638 12.9237 190.054 13.0055L189.979 13.4144C189.594 13.3324 189.114 13.1937 188.725 13.0918L188.81 12.7496Z" fill="#EEDD85"/><path d="M188.952 12.0206C189.353 12.1305 189.757 12.2363 190.161 12.3379C190.143 12.4469 190.122 12.5574 190.103 12.6664C189.785 12.6225 189.185 12.478 188.87 12.4037L188.952 12.0206Z" fill="#EEDD85"/><path d="M189.066 11.2422C189.411 11.3884 189.906 11.5951 190.232 11.7658C190.272 11.8619 190.24 11.9249 190.211 12.0292C189.803 11.9168 189.398 11.7933 188.997 11.6588L189.066 11.2422Z" fill="#EEDD85"/><path d="M189.639 9.75323C189.769 9.83292 190.235 10.5292 190.393 10.6726C190.49 10.7606 190.488 10.8304 190.476 10.9495C190.414 10.9573 190.443 10.9612 190.385 10.9378C189.965 10.6349 189.732 10.4331 189.358 10.0728L189.639 9.75323Z" fill="#EEDD85"/><path d="M193.563 9.18488C193.543 9.25069 193.442 9.36347 193.392 9.4179C193.117 9.71261 192.861 10.0366 192.569 10.313C192.569 10.313 192.474 10.3211 192.464 10.3219C192.403 10.2003 192.929 9.43075 193.028 9.27009C193.216 9.25874 193.38 9.22157 193.563 9.18488Z" fill="#EEDD85"/><path d="M190.321 9.3764C190.4 9.43639 190.815 10.3551 190.696 10.5167L190.636 10.5244L190.589 10.473C190.348 10.1923 190.156 9.89267 189.982 9.56723L190.321 9.3764Z" fill="#EEDD85"/><path d="M191.1 9.18488C191.158 9.26456 191.162 9.93148 191.171 10.0822C191.177 10.192 191.137 10.2129 191.072 10.2739C191.009 10.2559 191.027 10.2568 190.978 10.1919C190.865 9.87295 190.793 9.60955 190.711 9.28253C190.837 9.24162 190.97 9.21437 191.1 9.18488Z" fill="#EEDD85"/><path d="M191.545 9.1622L191.923 9.14783C191.843 9.45577 191.769 9.76505 191.7 10.0756C191.692 10.1148 191.687 10.1112 191.663 10.1474C191.553 10.1597 191.586 10.1719 191.505 10.1241C191.42 9.94622 191.431 9.30641 191.545 9.1622Z" fill="#EEDD85"/><path d="M192.293 9.1972L192.667 9.24467C192.53 9.52665 192.336 9.86116 192.186 10.1486L192.14 10.2137C192.042 10.216 192.074 10.2287 192.001 10.1799C191.96 9.99949 192.216 9.40155 192.293 9.1972Z" fill="#EEDD85"/></g><use href="#b" xlink:href="#b" transform="translate(55.2581 -41.9035) rotate(15.6522)"/><use href="#b" xlink:href="#b" transform="translate(119.772 -67.3447) rotate(31.3043)"/><use href="#b" xlink:href="#b" transform="translate(188.758 -74.4366) rotate(46.9565)"/><use href="#b" xlink:href="#b" transform="translate(257.1 -62.6534) rotate(62.6087)"/><use href="#b" xlink:href="#b" transform="translate(319.727 -32.869) rotate(78.2609)"/><use href="#b" xlink:href="#b" transform="translate(371.997 12.7078) rotate(93.913)"/><use href="#b" xlink:href="#b" transform="translate(410.032 70.6967) rotate(109.565)"/><use href="#b" xlink:href="#b" transform="translate(431.011 136.797) rotate(125.217)"/><use href="#b" xlink:href="#b" transform="translate(433.379 206.106) rotate(140.87)"/><use href="#b" xlink:href="#b" transform="translate(416.959 273.484) rotate(156.522)"/><use href="#b" xlink:href="#b" transform="translate(382.97 333.933) rotate(172.174)"/><use href="#b" xlink:href="#b" transform="translate(333.933 382.97) rotate(-172.174)"/><use href="#b" xlink:href="#b" transform="translate(273.484 416.959) rotate(-156.522)"/><use href="#b" xlink:href="#b" transform="translate(206.106 433.379) rotate(-140.87)"/><use href="#b" xlink:href="#b" transform="translate(136.797 431.011) rotate(-125.217)"/><use href="#b" xlink:href="#b" transform="translate(70.6966 410.032) rotate(-109.565)"/><use href="#b" xlink:href="#b" transform="translate(12.7078 371.997) rotate(-93.913)"/><use href="#b" xlink:href="#b" transform="translate(-32.869 319.727) rotate(-78.2609)"/><use href="#b" xlink:href="#b" transform="translate(-62.6534 257.1) rotate(-62.6087)"/><use href="#b" xlink:href="#b" transform="translate(-74.4366 188.758) rotate(-46.9565)"/><use href="#b" xlink:href="#b" transform="translate(-67.3447 119.772) rotate(-31.3043)"/><use href="#b" xlink:href="#b" transform="translate(-41.9035 55.258) rotate(-15.6522)"/></g><path transform="translate(50.132 50.132)" d="M133.1 0L148.57 80.6667H117.63L133.1 0Z M199.65 17.832L172.714 95.4266L145.919 79.9562L199.65 17.832Z M248.368 66.55L186.244 120.281L170.773 93.4856L248.368 66.55Z M266.2 133.1L185.533 148.57V117.63L266.2 133.1Z M248.368 199.65L170.773 172.714L186.244 145.919L248.368 199.65Z M199.65 248.368L145.919 186.244L172.714 170.773L199.65 248.368Z M133.1 266.2L117.63 185.533H148.57L133.1 266.2Z M66.55 248.368L93.4856 170.773L120.281 186.244L66.55 248.368Z M17.832 199.65L79.9562 145.919L95.4266 172.714L17.832 199.65Z M0 133.1L80.6667 117.63V148.57L0 133.1Z M17.832 66.55L95.4266 93.4856L79.9562 120.281L17.832 66.55Z M66.55 17.832L120.281 79.9562L93.4857 95.4266L66.55 17.832Z M188.905 133.155C188.905 163.974 163.92 188.959 133.101 188.959C102.281 188.959 77.2973 163.974 77.2973 133.155C77.2973 102.335 102.281 77.3512 133.101 77.3512C163.92 77.3512 188.905 102.335 188.905 133.155Z" fill="url(#s)"/></svg>`)
const SVG_LINES_OUTER = svgUri(`<svg width="1100" height="1100" viewBox="-81.656 6.344 1100 1100" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="arc"><path d="M120.282 144.629C180.611 93.626 251.41 56.5037 327.672 35.888C403.933 15.2724 483.793 11.667 561.602 25.327" stroke="#4E5D79"/></g><use xlink:href="#arc" href="#arc" transform="translate(1024.74 87.9969) rotate(90)"/><use xlink:href="#arc" href="#arc" transform="translate(936.746 1112.74) rotate(-180)"/><use xlink:href="#arc" href="#arc" transform="translate(-87.9969 1024.74) rotate(-90)"/></svg>`)
const SVG_LINES_INNER = svgUri(`<svg width="1100" height="1100" viewBox="-81.656 6.344 1100 1100" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="arc"><path d="M135.561 247.546C110.926 274.093 89.5573 303.492 71.9088 335.117" stroke="#CDA01B"/></g><use xlink:href="#arc" href="#arc" transform="translate(1024.74 87.9969) rotate(90)"/><use xlink:href="#arc" href="#arc" transform="translate(936.746 1112.74) rotate(-180)"/><use xlink:href="#arc" href="#arc" transform="translate(-87.9969 1024.74) rotate(-90)"/></svg>`)

// ---------- Hình học vòng tròn (cố định theo design) ----------
const GEOM = [
    {
        "id": "hang-khong",
        "start": -90.45,
        "photo": "img/photo-hang-khong.webp",
        "seg": {
            "id": "hang-khong",
            "style": "--x:49.1181;--y:3.3967;--w:45.2841",
            "file": "seg-hang-khong-navy.webp",
            "w": 797,
            "h": 677
        }
    },
    {
        "id": "bat-dong-san",
        "start": -18.45,
        "photo": "img/photo-bat-dong-san.webp",
        "seg": {
            "id": "bat-dong-san",
            "style": "--x:65.8636;--y:34.7297;--w:30.7955",
            "file": "seg-bat-dong-san-navy.webp",
            "w": 542,
            "h": 934
        }
    },
    {
        "id": "giai-tri",
        "start": 53.55,
        "photo": "img/photo-giai-tri.webp",
        "seg": {
            "id": "giai-tri",
            "style": "--x:22.5181;--y:71.6931;--w:55.625",
            "file": "seg-giai-tri-navy.webp",
            "w": 979,
            "h": 439
        }
    },
    {
        "id": "dien-anh",
        "start": 125.55,
        "photo": "img/photo-dien-anh.webp",
        "seg": {
            "id": "dien-anh",
            "style": "--x:3.3968;--y:35.4447;--w:31.1364",
            "file": "seg-dien-anh-navy.webp",
            "w": 548,
            "h": 929
        }
    },
    {
        "id": "y-te",
        "start": 197.55,
        "photo": "img/photo-y-te.webp",
        "seg": {
            "id": "y-te",
            "style": "--x:5.4043;--y:3.3941;--w:44.8864",
            "file": "seg-y-te-navy.webp",
            "w": 790,
            "h": 684
        }
    }
]
const LABEL_PATHS = [
    "M179.23 234.38A331.13 331.13 0 0 1 700.88 642.37",
    "M356.08 759.22A331.13 331.13 0 0 0 524.44 118.73",
    "M109.53 464.00A331.13 331.13 0 0 0 769.96 414.81",
    "M340.77 135.14A320.00 320.00 0 0 0 537.18 744.25",
    "M317.62 105.95A355.14 355.14 0 0 0 559.84 773.65",
    "M179.49 643.60A331.13 331.13 0 0 1 699.20 233.15",
    "M-12.45 432.39A450.65 450.65 0 0 1 888.78 444.35",
    "M-12.28 453.22A450.65 450.65 0 0 0 888.63 426.67"
]
const DEFAULT_SECTORS = [
    {
        "name": "Hàng không",
        "description": "Du lịch là lĩnh vực mũi nhọn, giữ vai trò dẫn dắt toàn bộ hệ sinh thái Sun Group. Từ chiến lược thương hiệu đến từng trải nghiệm liền mạch, mọi kết nối đều hướng tới mục tiêu gia tăng sức hấp dẫn và giá trị cho mỗi điểm đến, góp phần nâng tầm du lịch Việt Nam.",
        "alt": "Máy bay cất cánh trên đường băng",
        "link": ""
    },
    {
        "name": "Bất động sản",
        "description": "Bất động sản được phát triển song hành cùng hạ tầng du lịch, kiến tạo những đô thị, khu nghỉ dưỡng và công trình mang dấu ấn kiến trúc riêng. Mỗi dự án đều hướng tới việc nâng cao chất lượng sống cho cư dân, đồng thời góp phần thay đổi diện mạo của từng điểm đến.",
        "alt": "Toà tháp cao tầng bên sông lúc hoàng hôn",
        "link": ""
    },
    {
        "name": "Giải trí nghỉ dưỡng",
        "description": "Hệ thống công viên chủ đề, khu vui chơi và khu nghỉ dưỡng đẳng cấp mang đến những trải nghiệm trọn vẹn cho mọi lứa tuổi. Từ không gian giải trí sôi động đến kỳ nghỉ thư thái, mỗi hành trình đều góp phần đưa các điểm đến Việt Nam vươn tầm thế giới.",
        "alt": "Pháo hoa rực rỡ trên khu nghỉ dưỡng ven biển về đêm",
        "link": ""
    },
    {
        "name": "Điện ảnh & nghệ thuật biểu diễn",
        "description": "Những chương trình nghệ thuật, lễ hội và show diễn đặc sắc được đầu tư công phu, góp phần làm giàu đời sống văn hoá tại mỗi điểm đến. Từ sân khấu thực cảnh đến các sự kiện quy mô lớn, mỗi đêm diễn đều mang đến bản sắc riêng và sức sống mới cho du lịch.",
        "alt": "Nhà hát mái vòm bên hồ lúc chiều tà",
        "link": ""
    },
    {
        "name": "Y tế",
        "description": "Lĩnh vực y tế được đầu tư với mong muốn mang đến dịch vụ chăm sóc sức khoẻ chất lượng cao, ứng dụng công nghệ hiện đại cùng đội ngũ chuyên môn tận tâm. Đây là nền tảng để nâng cao chất lượng sống của cộng đồng, đồng thời hoàn thiện trải nghiệm cho du khách.",
        "alt": "Bác sĩ làm việc trong phòng mổ hiện đại",
        "link": ""
    }
]

function upper(t: string): string {
    try { return String(t).toLocaleUpperCase("vi-VN") } catch (e) { return String(t).toUpperCase() }
}
// "Điện ảnh & nghệ thuật biểu diễn" → 2 dòng theo 2 đường tròn như design
function splitTwo(name: string): [string, string] {
    const i = name.indexOf("&")
    if (i < 0) return [name, ""]
    return [name.slice(0, i + 1).trim(), name.slice(i + 1).trim()]
}

function wordsSvg(d: any, uid: string): string {
    const n = d.sectors.map((s: any) => s.name)
    const two = splitTwo(n[3])
    // thứ tự đường chạy: 0 hàng không, 1 bất động sản, 2 giải trí, 3–4 điện ảnh (2 dòng), 5 y tế, 6 trên cùng, 7 dưới cùng
    const items: [number, string, string][] = [
        [0, GEOM[0].id, n[0]], [1, GEOM[1].id, n[1]], [2, GEOM[2].id, n[2]],
        [3, GEOM[3].id, two[1] ? two[0] : n[3]], [4, GEOM[3].id, two[1]], [5, GEOM[4].id, n[4]],
    ]
    const defs = LABEL_PATHS.map((p, i) => `<path id="wl-${uid}-${i}" d="${p}"/>`).join("")
    const txt = (i: number, label: string, cls: string, extra = "") =>
        label ? `<text class="wheel__word${cls}"${extra}><textPath href="#wl-${uid}-${i}" startOffset="50%">${esc(upper(label))}</textPath></text>` : ""
    const sector = items.map(([i, id, label]) => txt(i, label, id === GEOM[0].id ? " is-hidden" : "", ` data-label="${id}"`)).join("")
    return `<svg class="wheel__fill wheel__words" viewBox="0 0 880 880" data-words><defs>${defs}</defs><g aria-hidden="true">${sector}</g>${txt(6, d.foundationTop, "")}${txt(7, d.foundationBottom, "")}</svg>`
}

function segsHtml(A: string): string {
    return GEOM.map((g: any, i: number) =>
        `<img class="wheel__layer wheel__seg${i === 0 ? " is-active" : ""}" data-seg="${g.id}" style="${g.seg.style}" src="${A}img/${g.seg.file}" alt="" width="${g.seg.w}" height="${g.seg.h}"${i ? ' loading="lazy"' : ""}>`
    ).join("")
}

function buildMarkup(d: any, uid: string): string {
    const A = d.A
    const s0 = d.sectors[0]
    const segs = segsHtml(A)
    const words = wordsSvg(d, uid)
    return `  <section class="sg-about" aria-labelledby="sg-intro-title-${uid}">
    <div class="sg-intro">
      <img class="sg-intro__compass" src="${SVG_COMPASS}" alt="" aria-hidden="true" width="1312" height="1312">
      <div class="sg-intro__inner">
        <p class="sg-intro__eyebrow">${esc(d.eyebrow)}</p>
        <h2 class="sg-intro__title trim" id="sg-intro-title-${uid}">
          ${esc(d.introLine1)}<br>
          ${esc(d.introLead)} <span class="text-gold">${esc(d.introGold)}</span><br class="br-desktop">
          ${esc(d.introLine3)}
        </h2>
        <a class="sg-intro__scroll" href="#he-sinh-thai-${uid}" aria-label="${esc(d.scrollLabel)}">
          <svg width="18" height="24" viewBox="0 0 18 24" fill="none" aria-hidden="true">
            <path d="M1 1l6.8 5.1a2 2 0 0 0 2.4 0L17 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path opacity=".5" d="M1 9l6.8 5.1a2 2 0 0 0 2.4 0L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path opacity=".3" d="M1 17l6.8 5.1a2 2 0 0 0 2.4 0L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </a>
      </div>
    </div>
    <div class="sg-eco" id="he-sinh-thai-${uid}">
      <div class="sg-eco__inner">

        <div class="sg-eco__visual">
          <div class="wheel" data-wheel>
            <img class="wheel__layer wheel__lines wheel__lines--outer" src="${SVG_LINES_OUTER}" alt="" width="1100" height="1100">
            <img class="wheel__layer wheel__lines wheel__lines--inner" src="${SVG_LINES_INNER}" alt="" width="1100" height="1100">
            <img class="wheel__fill" src="${A}img/ring-dim-navy.webp" alt="" width="880" height="880">
            ${segs}

            <img class="wheel__layer" style="--x:12.8798;--y:12.8799;--w:74.3007" src="${A}img/grooves-navy.webp" alt="" width="850" height="850">

            <svg class="wheel__fill wheel__circles" viewBox="0 0 880 880" fill="none" aria-hidden="true">
              <circle cx="440.156" cy="440.156" r="416" stroke="#4E5D79" stroke-width="7"/>
              <circle cx="439.656" cy="439.656" r="425.378" stroke="#4E5D79" stroke-width="3.24358"/>
            </svg>
            <span class="wheel__shock" data-shock aria-hidden="true"></span>
            <svg class="wheel__waves" viewBox="-1320 -1320 2640 2640" aria-hidden="true">
              <circle class="wave wave--line" data-wave r="184"/>
              <circle class="wave wave--dots" data-wave r="184"/>
              <circle class="wave wave--ticks" data-wave r="184"/>
            </svg>

            <div class="wheel__core">
              <span class="wheel__burst" data-burst aria-hidden="true"></span>
              <span class="wheel__glow" data-glow aria-hidden="true"></span>
              <img class="wheel__medallion" src="${SVG_MEDALLION}" alt="" width="369" height="369">
              <span class="wheel__core-label trim">${esc(d.centerLabel)}</span>
            </div>
            ${words}
            <svg class="wheel__hit" viewBox="0 0 880 880" role="tablist" aria-label="${esc(d.headingGold)}" data-hit></svg>
          </div>
        </div>

        <div class="sg-eco__content">
          <h2 class="sg-eco__heading trim">
            <span class="text-gold">${esc(d.headingGold)}</span><br>
            <span class="sg-eco__heading-sub">${esc(d.headingSub)}</span>
          </h2>

          <div class="sg-eco__panel" id="eco-panel-${uid}" role="tabpanel" aria-live="polite" data-panel>
            <div class="sg-eco__text" data-text>
            <div class="sg-eco__title-row">
              <svg class="sg-eco__icon" viewBox="0 0 34 17" fill="none" aria-hidden="true">
                <defs>
                  <radialGradient id="sg-icon-grad-${uid}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17 17) rotate(-90) scale(17)">
                    <stop stop-color="#FFF2B0"/><stop offset="1" stop-color="#F5DE6D"/>
                  </radialGradient>
                  <clipPath id="sg-icon-clip-${uid}"><rect width="34" height="17"/></clipPath>
                </defs>
                <g clip-path="url(#sg-icon-clip-${uid})">
                  <path d="M11.434 15.5086L0 17L11.434 18.4914L2.27757 25.5L12.9254 21.0746L8.5 31.7224L15.5086 22.566L17 34L18.4914 22.566L25.5 31.7224L21.0746 21.0746L31.7224 25.5L22.566 18.4914L34 17L22.566 15.5086L31.7224 8.5L21.0746 12.9254L25.5 2.27757L18.4914 11.434L17 0L15.5086 11.434L8.5 2.27757L12.9254 12.9254L2.27757 8.5L11.434 15.5086Z" fill="url(#sg-icon-grad-${uid})"/>
                </g>
              </svg>
              <h3 class="sg-eco__title trim"><span class="text-gold" data-title>${esc(s0.name)}</span></h3>
            </div>
            <p class="sg-eco__desc" data-desc>${esc(s0.desc)}</p>
            </div>
            <figure class="sg-eco__media" data-media>
              <div class="sg-eco__media-clip" data-media-clip>
                <img data-image src="${esc(s0.image)}" alt="${esc(s0.alt)}" width="437" height="270">
              </div>
              <span class="sg-eco__sheen" data-sheen aria-hidden="true"></span>
              <span class="sg-eco__rays" data-rays aria-hidden="true"></span>
              <span class="sg-eco__ring" data-ring aria-hidden="true"></span>
              <span class="sg-eco__sparkles" data-sparkles aria-hidden="true"></span>
            </figure>
          </div>
          <div class="sg-eco__actions">
            <a class="sg-eco__more" href="${esc(s0.url)}" data-more aria-label="${esc(d.moreLabel)} – ${esc(s0.name)}">${esc(d.moreLabel)}</a>
            <div class="sg-eco__nav">
              <button class="sg-eco__arrow" type="button" data-prev aria-label="${esc(d.prevLabel)}" aria-controls="eco-panel-${uid}">
                <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
                  <rect x="0.5" y="0.5" width="35" height="35" rx="17.5" stroke="currentColor"/>
                  <path d="M22.6654 18.5H23.1654V17.5H22.6654V18V18.5ZM13.332 17.5C13.0559 17.5 12.832 17.7239 12.832 18C12.832 18.2761 13.0559 18.5 13.332 18.5V18V17.5ZM22.6654 18V17.5H13.332V18V18.5H22.6654V18Z" fill="currentColor"/>
                  <path d="M17.9987 22.6654L13.332 17.9987L17.9987 13.332" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="sg-eco__arrow" type="button" data-next aria-label="${esc(d.nextLabel)}" aria-controls="eco-panel-${uid}">
                <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
                  <rect x="0.5" y="0.5" width="35" height="35" rx="17.5" stroke="currentColor"/>
                  <path d="M13.3346 18.5H12.8346V17.5H13.3346V18V18.5ZM22.668 17.5C22.9441 17.5 23.168 17.7239 23.168 18C23.168 18.2761 22.9441 18.5 22.668 18.5V18V17.5ZM13.3346 18V17.5H22.668V18V18.5H13.3346V18Z" fill="currentColor"/>
                  <path d="M18.0013 22.6654L22.668 17.9987L18.0013 13.332" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>`
}

// ---------- Tương tác + hiệu ứng (giữ nguyên logic của trang test) ----------
function initEcosystem(host, opts) {


  // Thứ tự theo chiều kim đồng hồ, bắt đầu từ mảng trên-phải.
  // start: góc bắt đầu (độ, tính từ hướng 3 giờ, theo chiều kim đồng hồ), mỗi mảng 72°.
  // TODO(content): mô tả của 4 lĩnh vực sau "Hàng không" đang là nội dung tạm – thay bằng content thật.
  // TODO(content): url – link trang chi tiết của từng lĩnh vực cho nút "Khám phá thêm" (đang để '#').
  var SECTORS = opts.sectors;

  // --- dọn dẹp khi component bị gỡ / đổi props ---
  var dead = false, offs = [];
  function on(t, type, fn, opt) { t.addEventListener(type, fn, opt); offs.push(function () { t.removeEventListener(type, fn, opt); }); }

  var SPAN = 72;            // độ / mảng
  var CX = 440, CY = 440;   // tâm vòng trong hệ toạ độ 880×880
  var R_IN = 241, R_OUT = 411;

  var wheel = host.querySelector('[data-wheel]');
  if (!wheel) return function () {};

  var hit = wheel.querySelector('[data-hit]');
  var panel = host.querySelector('[data-panel]');
  var titleEl = panel.querySelector('[data-title]');
  var titleBox = titleEl.closest('.sg-eco__title') || titleEl;   // khối để chạy hiệu ứng (chữ là span gradient bên trong)
  var moreEl = host.querySelector('[data-more]');
  var prevBtn = host.querySelector('[data-prev]');
  var nextBtn = host.querySelector('[data-next]');
  var descEl = panel.querySelector('[data-desc]');
  var imgEl = panel.querySelector('[data-image]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var activeId = SECTORS[0].id;

  function pt(r, deg) {
    var a = deg * Math.PI / 180;
    return (CX + r * Math.cos(a)).toFixed(2) + ' ' + (CY + r * Math.sin(a)).toFixed(2);
  }

  function wedge(start) {
    var end = start + SPAN;
    return 'M' + pt(R_OUT, start) +
      ' A' + R_OUT + ' ' + R_OUT + ' 0 0 1 ' + pt(R_OUT, end) +
      ' L' + pt(R_IN, end) +
      ' A' + R_IN + ' ' + R_IN + ' 0 0 0 ' + pt(R_IN, start) + ' Z';
  }

  function byId(id) {
    for (var i = 0; i < SECTORS.length; i++) if (SECTORS[i].id === id) return SECTORS[i];
    return null;
  }

  function setClass(selector, attr, id, cls) {
    wheel.querySelectorAll(selector).forEach(function (el) {
      el.classList.toggle(cls, el.getAttribute(attr) === id);
    });
  }

  // ----- Tạo vùng bấm -----
  var NS = 'http://www.w3.org/2000/svg';
  var paths = SECTORS.map(function (s, i) {
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', wedge(s.start));
    p.setAttribute('role', 'tab');
    p.setAttribute('id', 'eco-tab-' + s.id);
    p.setAttribute('aria-label', s.name);
    p.setAttribute('aria-controls', 'eco-panel');
    p.setAttribute('aria-selected', s.id === activeId ? 'true' : 'false');
    p.setAttribute('tabindex', s.id === activeId ? '0' : '-1');
    p.dataset.id = s.id;

    p.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse') setClass('[data-seg]', 'data-seg', s.id, 'is-hover');
    });
    p.addEventListener('pointerleave', function () {
      setClass('[data-seg]', 'data-seg', '', 'is-hover');
    });
    p.addEventListener('click', function () { select(s.id); });
    p.addEventListener('keydown', function (e) { onKey(e, i); });

    hit.appendChild(p);
    return p;
  });
  panel.setAttribute('aria-labelledby', 'eco-tab-' + activeId);

  function onKey(e, i) {
    var n = SECTORS.length, next = null;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': next = (i + 1) % n; break;
      case 'ArrowLeft': case 'ArrowUp': next = (i - 1 + n) % n; break;
      case 'Home': next = 0; break;
      case 'End': next = n - 1; break;
      case 'Enter': case ' ': e.preventDefault(); select(SECTORS[i].id); return;
      default: return;
    }
    e.preventDefault();
    paths[next].focus();
    select(SECTORS[next].id);
  }

  // ----- Chọn mảng -----
  function select(id) {
    if (id === activeId) return;
    var s = byId(id);
    if (!s) return;
    activeId = id;

    // Trạng thái (aria, mảng sáng, nhãn) đổi ngay – animation chỉ là phần trình diễn
    setClass('[data-seg]', 'data-seg', id, 'is-active');
    setClass('[data-label]', 'data-label', id, 'is-hidden');
    paths.forEach(function (p) {
      var on = p.dataset.id === id;
      p.setAttribute('aria-selected', on ? 'true' : 'false');
      p.setAttribute('tabindex', on ? '0' : '-1');
    });
    panel.setAttribute('aria-labelledby', 'eco-tab-' + id);

    if (reduceMotion || !canAnimate) { render(s); return; }

    var busy = running.some(function (a) { return a.playState === 'running'; });
    var my = ++token;
    stopAll();
    strikeDrum();

    var pre = new Image();
    pre.src = s.image;
    var decoded = pre.decode ? pre.decode().catch(noop) : Promise.resolve();

    if (busy) {
      // Đang chuyển dở thì thay thẳng nội dung mới, không chạy pha thoát lần nữa
      decoded.then(function () { if (my === token) { render(s); enter(); } });
      return;
    }

    // Pha thoát: nhanh, gọn (thoát nhanh hơn vào)
    var exit = play(panel, [
      { opacity: 1, transform: 'none', filter: 'blur(0px)' },
      { opacity: 0, transform: 'translateY(-10px)', filter: 'blur(6px)' }
    ], { duration: EXIT_MS, easing: EASE_IN, fill: 'forwards' });

    Promise.all([exit.finished, decoded]).then(function () {
      if (my !== token) return;
      render(s);
      enter();          // các phần tử con được đặt về trạng thái ẩn ngay trong frame này…
      exit.cancel();    // …rồi mới trả panel về opacity 1, nên không bị chớp
    }, noop);
  }

  // ===================================================================
  //  "NHỊP TRỐNG" – hiệu ứng xuất hiện nội dung
  //  1. Gõ trống: trống đồng nảy nhẹ, loé sáng, 3 vòng sóng âm vàng lan ra
  //     (nét liền / chấm / vạch – gợi các vành hoa văn trên mặt trống Đông Sơn).
  //  2. Sóng chạm tới ảnh: ảnh mở ra theo hình tròn từ phía vòng tròn,
  //     viền sóng vàng quét qua, màu đồng thau "nở" thành màu thật, ánh kim lướt qua.
  //  3. Ngôi sao mặt trời xoay vào vị trí, tiêu đề lắng nét, mô tả lan theo từng chữ.
  // ===================================================================
  var EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';  // expo-out: bật mạnh, lắng chậm
  var EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
  var EXIT_MS = 200;
  var canAnimate = typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
  var noop = function () {};

  var core = wheel.querySelector('.wheel__core');
  var glowEl = wheel.querySelector('[data-glow]');
  var shockEl = wheel.querySelector('[data-shock]');
  var waveEls = wheel.querySelectorAll('[data-wave]');
  var mediaEl = panel.querySelector('[data-media]');
  var clipEl = panel.querySelector('[data-media-clip]');
  var ringEl = panel.querySelector('[data-ring]');
  var raysEl = panel.querySelector('[data-rays]');
  var sparkBox = panel.querySelector('[data-sparkles]');
  var burstEl = wheel.querySelector('[data-burst]');
  var sheenEl = panel.querySelector('[data-sheen]');

  // Hạt lấp lánh: tạo sẵn 1 lần, mỗi lần mở ảnh xếp lại vị trí ngẫu nhiên
  var SPARK_COUNT = 24;
  var sparks = [];
  for (var k = 0; sparkBox && k < SPARK_COUNT; k++) {
    var sp = document.createElement('span');
    sp.className = 'sg-spark';
    sparkBox.appendChild(sp);
    sparks.push(sp);
  }

  // Giải ngược đường cong cubic-bezier: với tiến độ p (0–1) của mép sóng, trả về thời điểm t (0–1).
  // Dùng để hạt sáng loé lên đúng lúc mép sóng đi qua vị trí của nó.
  function bezierTimeFor(p, x1, y1, x2, y2) {
    var bx = function (u) { return 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u; };
    var by = function (u) { return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u; };
    var lo = 0, hi = 1;
    for (var n = 0; n < 24; n++) { var mid = (lo + hi) / 2; if (by(mid) < p) lo = mid; else hi = mid; }
    return bx((lo + hi) / 2);
  }
  var iconEl = panel.querySelector('.sg-eco__icon');
  var running = [];
  var token = 0;

  // Mô tả: 1 bản đầy đủ cho trình đọc màn hình + 1 bản tách chữ để chạy hiệu ứng
  descEl.textContent = '';
  var descSr = document.createElement('span');
  descSr.className = 'sr-only';
  var descWords = document.createElement('span');
  descWords.setAttribute('aria-hidden', 'true');
  descEl.appendChild(descSr);
  descEl.appendChild(descWords);

  function play(el, frames, opts) {
    if (!el) return null;
    var a = el.animate(frames, opts);
    running.push(a);
    return a;
  }

  function stopAll() {
    running.forEach(function (a) { a.cancel(); });
    running = [];
  }

  function render(s) {
    titleEl.textContent = s.name;
    descSr.textContent = s.desc;
    descWords.textContent = '';
    s.desc.split(/\s+/).forEach(function (word, i) {
      if (i) descWords.appendChild(document.createTextNode(' '));
      var w = document.createElement('span');
      w.className = 'w';
      w.textContent = word;
      descWords.appendChild(w);
    });
    if (imgEl.getAttribute('src') !== s.image) imgEl.src = s.image;
    imgEl.alt = s.alt;
    if (typeof fitTitle === 'function') fitTitle();
    if (moreEl) {
      moreEl.setAttribute('href', s.url || '#');
      moreEl.setAttribute('aria-label', opts.moreLabel + ' – ' + s.name);
    }
  }

  // Độ mạnh của "tiếng vang" khi gõ trống (0 → 1). Đã hạ xuống cho nhẹ, sang hơn; tăng lên nếu muốn mạnh lại.
  var STRIKE = opts.strike;
  function strikeDrum() {
    var k = STRIKE;
    // trống chỉ nhún rất nhẹ như vừa được chạm dùi
    play(core, [
      { transform: 'scale(1)' },
      { transform: 'scale(' + (1 - 0.06 * k) + ')', offset: 0.16 },
      { transform: 'scale(' + (1 + 0.035 * k) + ')', offset: 0.5 },
      { transform: 'scale(1)' }
    ], { duration: 900, easing: 'cubic-bezier(0.3, 0, 0.2, 1)' });
    play(glowEl, [{ opacity: 0 }, { opacity: 0.9 * k, offset: 0.2 }, { opacity: 0 }],
      { duration: 1300, easing: 'ease-out' });
    play(burstEl, [
      { opacity: 0, transform: 'rotate(-6deg) scale(0.88)' },
      { opacity: 0.8 * k, transform: 'rotate(-2deg) scale(0.98)', offset: 0.18 },
      { opacity: 0, transform: 'rotate(8deg) scale(1.1)' }
    ], { duration: 1500, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' });
    play(shockEl, [
      { transform: 'scale(1)', opacity: 0.8 * k },
      { transform: 'scale(' + (1 + 2.4 * k + 0.4) + ')', opacity: 0 }
    ], { duration: 1500, easing: 'cubic-bezier(0.2, 0.75, 0.25, 1)' });
    // 3 vòng sóng âm: mờ hơn, lan ngắn hơn, chậm và thưa hơn – như dư âm thay vì tiếng nổ
    Array.prototype.forEach.call(waveEls, function (w, i) {
      play(w, [
        { transform: 'scale(1)', opacity: 0.9 * k },
        { transform: 'scale(' + (1 + 2.2 * k + 0.5) + ')', opacity: 0 }
      ], { duration: 1900, delay: i * 220, easing: 'cubic-bezier(0.22, 0.8, 0.3, 1)', fill: 'backwards' });
    });
  }

  function enter() {
    var T0 = 0;           // bắt đầu ngay khi đổi nội dung – không có khoảng chờ trống
    var REVEAL = 900;     // thời gian mép sóng quét hết ảnh
    var K0 = 0.3;         // khung hình đầu tiên đã thấy sẵn ~1/4 ảnh phía vòng tròn

    // Ảnh mở theo hình tròn, tâm nằm ngoài mép trái (phía vòng tròn) – như sóng trống lan tới
    var w = mediaEl.clientWidth, h = mediaEl.clientHeight;
    var ox = Math.round(-0.08 * w), oy = Math.round(h / 2);
    var R = Math.ceil(Math.sqrt((w - ox) * (w - ox) + (h / 2) * (h / 2))) + 2;
    [ringEl, raysEl].forEach(function (el) {
      if (!el) return;
      el.style.width = el.style.height = R * 2 + 'px';
      el.style.left = ox - R + 'px';
      el.style.top = oy - R + 'px';
    });

    var B = [0.2, 0.75, 0.3, 1];
    var SWEEP = 'cubic-bezier(' + B.join(', ') + ')';  // lao nhanh ngay từ đầu, chậm dần ở mép xa

    // Mép sóng: chạy biến --k trên khung ảnh; vùng mở ảnh (clip-path), viền sáng và tia nắng
    // đều đọc cùng biến này (xem CSS) nên luôn khớp nhau, kể cả khi trình duyệt bận.
    clipEl.style.clipPath = 'circle(calc(var(--k) * ' + R + 'px) at ' + ox + 'px ' + oy + 'px)';
    var wave = play(mediaEl, [{ '--k': K0 }, { '--k': 1 }],
      { duration: REVEAL, delay: T0, easing: SWEEP, fill: 'backwards' });
    if (wave) wave.onfinish = function () { clipEl.style.clipPath = ''; };

    // Viền sáng giữ rực lâu rồi mới tắt; tia nắng bừng lên ngay sau mép sóng
    play(ringEl, [{ opacity: 1 }, { opacity: 1, offset: 0.62 }, { opacity: 0 }],
      { duration: REVEAL, delay: T0, easing: 'linear', fill: 'both' });
    play(raysEl, [{ opacity: 0 }, { opacity: 1, offset: 0.18 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }],
      { duration: REVEAL, delay: T0, easing: 'linear', fill: 'both' });

    // Hạt lấp lánh: phần lớn loé lên đúng lúc mép sóng đi qua, vài hạt loé muộn theo vệt sáng
    sparks.forEach(function (el, i) {
      var late = i >= SPARK_COUNT - 7;
      var x = Math.random() * w, y = Math.random() * h;
      var size = 9 + Math.random() * (late ? 14 : 20);
      el.style.width = el.style.height = size + 'px';
      el.style.left = x - size / 2 + 'px';
      el.style.top = y - size / 2 + 'px';
      var d = Math.sqrt((x - ox) * (x - ox) + (y - oy) * (y - oy));
      var k = Math.min(d / R, 1);
      var delay = late
        ? T0 + 500 + Math.random() * 900
        : k <= K0
          ? T0 + Math.random() * 120
          : T0 + bezierTimeFor((k - K0) / (1 - K0), B[0], B[1], B[2], B[3]) * REVEAL - 30;
      var spin = (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 60);
      play(el, [
        { opacity: 0, transform: 'scale(0.1) rotate(0deg)' },
        { opacity: 1, transform: 'scale(1.15) rotate(' + spin * 0.45 + 'deg)', offset: 0.32 },
        { opacity: 0, transform: 'translateY(-6px) scale(0.3) rotate(' + spin + 'deg)' }
      ], { duration: 650 + Math.random() * 550, delay: Math.max(0, delay), easing: 'cubic-bezier(0.25, 0.6, 0.3, 1)', fill: 'both' });
    });
    play(imgEl, [
      { transform: 'scale(1.16)', filter: 'sepia(0.75) saturate(1.25) brightness(1.12) contrast(1.06)' },
      { transform: 'scale(1)', filter: 'sepia(0) saturate(1) brightness(1) contrast(1)' }
    ], { duration: 1700, delay: T0, easing: EASE_OUT, fill: 'both' });
    play(sheenEl, [
      { transform: 'translateX(-120%)', opacity: 0 },
      { opacity: 1, offset: 0.25 },
      { opacity: 1, offset: 0.75 },
      { transform: 'translateX(120%)', opacity: 0 }
    ], { duration: 1200, delay: T0 + 520, easing: 'cubic-bezier(0.45, 0.05, 0.25, 1)', fill: 'both' });

    // Ngôi sao mặt trời (tâm trống đồng) xoay vào vị trí, loé sáng
    play(iconEl, [
      { transform: 'rotate(-200deg) scale(0.2)', opacity: 0 },
      { transform: 'rotate(0deg) scale(1)', opacity: 1 }
    ], { duration: 1100, delay: T0 + 60, easing: EASE_OUT, fill: 'both' });
    play(iconEl, [
      { filter: 'drop-shadow(0 0 0 rgba(255, 214, 110, 0))' },
      { filter: 'drop-shadow(0 0 7px rgba(255, 214, 110, 0.95))', offset: 0.45 },
      { filter: 'drop-shadow(0 0 0 rgba(255, 214, 110, 0))' }
    ], { duration: 1300, delay: T0 + 60, easing: 'ease-out', fill: 'both' });

    // Tiêu đề: trượt nhẹ từ phía vòng tròn, từ mờ sang nét
    play(titleBox, [
      { opacity: 0, transform: 'translateX(-32px)', filter: 'blur(10px)' },
      { opacity: 1, transform: 'translateX(0)', filter: 'blur(0px)' }
    ], { duration: 1000, delay: T0 + 140, easing: EASE_OUT, fill: 'both' });

    // Mô tả: lan theo từng chữ như dư âm
    descWords.querySelectorAll('.w').forEach(function (el, i) {
      play(el, [
        { opacity: 0, transform: 'translateY(0.7em)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 800, delay: T0 + 260 + i * 11, easing: EASE_OUT, fill: 'both' });
    });
  }

  render(byId(activeId));

  // ----- 2 nút mũi tên: lĩnh vực trước / sau -----
  function step(dir) {
    var n = SECTORS.length, i = 0;
    for (; i < n; i++) if (SECTORS[i].id === activeId) break;
    select(SECTORS[(i + dir + n) % n].id);
  }
  if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });

  // ----- Giữ bố cục đứng yên giữa các lĩnh vực -----
  // - Mô tả: đo cả 5 lĩnh vực ở bề rộng hiện tại, lấy cao nhất làm min-height.
  // - Tiêu đề dài bị xuống 2 dòng (Điện ảnh & nghệ thuật biểu diễn): dòng thừa mọc lên trên
  //   (vào khoảng trống dưới tiêu đề lớn) thay vì đẩy mô tả + ảnh xuống, nên khi chuyển lĩnh vực
  //   ảnh và các nút bên dưới không bị nhảy, và với tiêu đề 1 dòng khoảng cách đúng như design.
  var textEl = panel.querySelector('[data-text]');
  var titleRow = panel.querySelector('.sg-eco__title-row');
  var oneLine = 0;
  function lockTextHeight() {
    if (!textEl || !textEl.offsetWidth) return;
    var probe = textEl.cloneNode(true);
    probe.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;left:0;top:0;min-height:0;visibility:hidden;pointer-events:none;width:' + textEl.offsetWidth + 'px';
    panel.appendChild(probe);
    var t = probe.querySelector('[data-title]');
    var d = probe.querySelector('[data-desc]');
    d.style.minHeight = '0';
    var box = t.closest('.sg-eco__title') || t;
    t.textContent = 'A';
    oneLine = box.getBoundingClientRect().height;
    var max = 0;
    SECTORS.forEach(function (s) {
      d.textContent = s.desc;
      max = Math.max(max, d.getBoundingClientRect().height);
    });
    panel.removeChild(probe);
    descEl.style.minHeight = Math.ceil(max) + 'px';
    fitTitle();
  }
  function fitTitle() {
    if (!titleRow || !oneLine) return;
    var extra = titleBox.getBoundingClientRect().height - oneLine;
    titleRow.style.marginTop = extra > 1 ? -extra.toFixed(2) + 'px' : '';
  }

  var lastWidth = 0;
  function onWidthChange() {
    var w = panel.getBoundingClientRect().width;
    if (Math.abs(w - lastWidth) < 0.5) return;
    lastWidth = w;
    lockTextHeight();
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!dead) lockTextHeight(); });
  lockTextHeight();
  var ro = null;
  if ('ResizeObserver' in window) { ro = new ResizeObserver(onWidthChange); ro.observe(panel); }
  else on(window, 'resize', onWidthChange);

  // ----- Tải trước ảnh khi rảnh -----
  var preload = function () {
    SECTORS.forEach(function (s) { var i = new Image(); i.src = s.image; });
  };
  var idle = 0, idleT = 0;
  if ('requestIdleCallback' in window) idle = window.requestIdleCallback(preload, { timeout: 2500 });
  else idleT = window.setTimeout(preload, 1500);

  return function cleanup() {
    dead = true;
    stopAll();
    offs.forEach(function (f) { f(); });
    if (ro) ro.disconnect();
    if (idle && window.cancelIdleCallback) window.cancelIdleCallback(idle);
    if (idleT) clearTimeout(idleT);
  };

}


/**
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 1707
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function SunGroupEcosystem(props: any) {
    const {
        eyebrow = "Về Sun Group",
        introLine1 = "Sun Group là tập đoàn kinh tế tư nhân",
        introLead = "lấy",
        introGold = "du lịch làm kim chỉ nam của chiến lược phát triển,",
        introLine3 = "kiên định với sứ mệnh phụng sự đất nước.",
        scrollLabel = "Xem hệ sinh thái Sun Group",
        headingGold = "05 lĩnh vực chủ chốt",
        headingSub = "02 nền tảng vững vàng",
        centerLabel = "Du lịch",
        foundationTop = "Tài chính",
        foundationBottom = "Xây dựng",
        sectors = DEFAULT_SECTORS,
        moreLabel = "Khám phá thêm",
        prevLabel = "Lĩnh vực trước",
        nextLabel = "Lĩnh vực tiếp theo",
        strike = 0.5,
        drumSeconds = 60,
        linesSeconds = 90,
        assetBase = "https://sgtest.vercel.app/assets/",
        fontFamily = "CDA Independence",
        fontUrl = "https://sgtest.vercel.app/assets/fonts/CDAIndependenceText-VF.woff2",
        fontFile = "",
        style,
    } = props

    const uid = useId().replace(/[^a-zA-Z0-9]/g, "")
    const A = withSlash(assetBase)
    const list = Array.isArray(sectors) ? sectors : []
    const data = {
        A, eyebrow, introLine1, introLead, introGold, introLine3, scrollLabel, headingGold, headingSub,
        centerLabel, foundationTop, foundationBottom, moreLabel, prevLabel, nextLabel,
        sectors: GEOM.map((g: any, i: number) => {
            const s = list[i] || {}
            const def = DEFAULT_SECTORS[i]
            return {
                id: g.id,
                start: g.start,
                name: s.name ?? def.name,
                desc: s.description ?? def.description,
                url: s.link || "#",
                image: pickImage(s.image, A + g.photo),
                alt: s.alt ?? def.alt,
            }
        }),
    }
    const key = JSON.stringify(data)
    const markup = useMemo(() => buildMarkup(data, uid), [key, uid])
    const hostRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const host = hostRef.current
        if (!host || typeof window === "undefined") return
        let cleanup = () => {}
        try {
            cleanup = initEcosystem(host, { sectors: data.sectors, strike: Math.max(0, Math.min(1, strike)), moreLabel, isCanvas: isCanvasNow() })
        } catch (e) {
            console.error("[SunGroupEcosystem]", e)
        }
        return () => cleanup()
    }, [key, uid, strike])

    const rootStyle: any = {
        ...style,
        position: "relative",
        "--font": `"${String(fontFamily).replace(/"/g, "")}", ${FONT_STACK}`,
        "--spin-drum": drumSeconds > 0 ? `${drumSeconds}s` : "0s",
        "--spin-lines-outer": linesSeconds > 0 ? `${linesSeconds}s` : "0s",
        "--spin-lines-inner": linesSeconds > 0 ? `${linesSeconds}s` : "0s",
    }
    return (
        <div ref={hostRef} className={ROOT + (drumSeconds > 0 ? "" : " sg-nodrum") + (linesSeconds > 0 ? "" : " sg-nolines")} style={rootStyle}>
            <style>{fontFaceCss(fontFamily, fontFile || fontUrl) + CSS + EXTRA_CSS}</style>
            <div key={key} dangerouslySetInnerHTML={{ __html: markup }} />
        </div>
    )
}

// tắt xoay khi đặt tốc độ = 0
const EXTRA_CSS = `.sgf-eco :where(h1, h2, h3, h4, p, figure, ul, ol) { margin: revert; padding: revert; }
.sgf-eco :where(h1, h2, h3, h4) { font-size: revert; font-weight: revert; }
.sgf-eco :where(button) { font: revert; }
.sgf-eco.sg-nodrum .wheel__medallion { animation: none; } .sgf-eco.sg-nolines .wheel__lines { animation: none; }`

SunGroupEcosystem.displayName = "Sun Group – Hệ sinh thái"

addPropertyControls(SunGroupEcosystem, {
    eyebrow: { type: ControlType.String, title: "Dòng nhỏ", defaultValue: "Về Sun Group" },
    introLine1: { type: ControlType.String, title: "Intro dòng 1", defaultValue: "Sun Group là tập đoàn kinh tế tư nhân" },
    introLead: { type: ControlType.String, title: "Intro chữ dẫn", defaultValue: "lấy" },
    introGold: { type: ControlType.String, title: "Intro chữ vàng", defaultValue: "du lịch làm kim chỉ nam của chiến lược phát triển," },
    introLine3: { type: ControlType.String, title: "Intro dòng cuối", defaultValue: "kiên định với sứ mệnh phụng sự đất nước." },
    scrollLabel: { type: ControlType.String, title: "Mô tả nút cuộn", defaultValue: "Xem hệ sinh thái Sun Group" },
    headingGold: { type: ControlType.String, title: "Tiêu đề vàng", defaultValue: "05 lĩnh vực chủ chốt" },
    headingSub: { type: ControlType.String, title: "Tiêu đề phụ", defaultValue: "02 nền tảng vững vàng" },
    centerLabel: { type: ControlType.String, title: "Chữ giữa trống", defaultValue: "Du lịch" },
    foundationTop: { type: ControlType.String, title: "Nền tảng trên", defaultValue: "Tài chính" },
    foundationBottom: { type: ControlType.String, title: "Nền tảng dưới", defaultValue: "Xây dựng" },
    sectors: {
        type: ControlType.Array,
        title: "5 lĩnh vực",
        maxCount: 5,
        description: "Thứ tự theo chiều kim đồng hồ, bắt đầu từ mảng trên-phải. Vòng tròn có đúng 5 mảng.",
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Tên" },
                description: { type: ControlType.String, title: "Mô tả", displayTextArea: true },
                image: { type: ControlType.ResponsiveImage, title: "Ảnh" },
                alt: { type: ControlType.String, title: "Mô tả ảnh" },
                link: { type: ControlType.Link, title: "Link" },
            },
        },
        defaultValue: DEFAULT_SECTORS,
    },
    moreLabel: { type: ControlType.String, title: "Nút khám phá", defaultValue: "Khám phá thêm" },
    prevLabel: { type: ControlType.String, title: "Mô tả nút trước", defaultValue: "Lĩnh vực trước" },
    nextLabel: { type: ControlType.String, title: "Mô tả nút sau", defaultValue: "Lĩnh vực tiếp theo" },
    strike: { type: ControlType.Number, title: "Độ vang trống", min: 0, max: 1, step: 0.05, defaultValue: 0.5, description: "0 = tắt, 1 = mạnh nhất" },
    drumSeconds: { type: ControlType.Number, title: "Trống xoay (giây/vòng)", min: 0, max: 300, step: 5, defaultValue: 60, unit: "s", description: "0 = đứng yên" },
    linesSeconds: { type: ControlType.Number, title: "Vòng line (giây/vòng)", min: 0, max: 300, step: 5, defaultValue: 90, unit: "s", description: "0 = đứng yên" },
    assetBase: { type: ControlType.String, title: "Thư mục ảnh", defaultValue: "https://sgtest.vercel.app/assets/", description: "Nơi chứa img/seg-*-navy.webp, img/grooves-navy.webp, img/ring-dim-navy.webp và ảnh mặc định của 5 lĩnh vực." },
    fontFamily: { type: ControlType.String, title: "Tên font", defaultValue: "CDA Independence" },
    fontFile: { type: ControlType.File, title: "File font (woff2)", allowedFileTypes: ["woff2"], description: "Tải file .woff2 lên đây (Framer tự lưu trữ) – ưu tiên hơn link bên dưới." },
    fontUrl: { type: ControlType.String, title: "Link font (woff2)", defaultValue: "https://sgtest.vercel.app/assets/fonts/CDAIndependenceText-VF.woff2", description: "Dùng khi chưa tải file font. Để trống cả 2 nếu font đã cài sẵn trong Framer." },
})
