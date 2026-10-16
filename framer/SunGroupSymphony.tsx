// @ts-nocheck
/*
 * Sun Group – Section "Viết nên bản giao hưởng cho mỗi vùng đất" (Framer Code Component)
 * Chuyển từ trang test sgtest.vercel.app (HTML/CSS/JS thuần) sang 1 file cho Framer.
 *
 * - Desktop: section được ghim, cuộn dọc → dải cục chạy ngang; lướt hết dải thì cuộn tiếp sang section sau.
 * - Bấm 1 cục: chữ và hình tách ra, hình vòm nở thành ảnh toàn màn hình. Mỗi lần cuộn/vuốt = 1 ảnh;
 *   hết ảnh của chủ đề → màn đỏ mang tên chủ đề kế trượt vào. Hết chủ đề cuối → ảnh thu về hình vòm, rơi xuống,
 *   trở lại cuối dải. Esc / nút X để đóng; phím mũi tên, PageUp/PageDown cũng điều khiển được.
 * - Rê chuột lên cục: con trỏ tròn đỏ viền vàng "Khám phá thêm" bám theo chuột (chỉ máy có chuột).
 * - Tablet / điện thoại (< 1024px): dải cục vuốt ngang tự nhiên, không ghim.
 * - Trống đồng chìm góc dưới-trái xoay theo chiều kim đồng hồ.
 * - Màn chi tiết + con trỏ được gắn thẳng vào <body> để luôn phủ toàn màn hình, nằm trên mọi lớp khác.
 * - Trên canvas của Framer: dải đứng yên như ảnh tĩnh; bấm Preview để xem cuộn, mở chi tiết và con trỏ.
 *
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 900
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

const ROOT = "sgf-sym"

// ---------- CSS (đã gói gọn dưới .sgf-sym để không đụng phần còn lại của trang) ----------
const CSS = `.sgf-sym { --font: "CDA Independence", "Be Vietnam Pro", "Segoe UI", Arial, sans-serif; --fw-regular: 420; --fw-medium: 500; --fw-semibold: 600; --bg-center: #750d1b; --bg-edge: #4b0d18; --gold-1: #ffe284; --gold-2: #d9b137; --pink: #f6d5d4; --label: #e8c495; --body: #f8f2e9; --deep: #3e0502; --ease: cubic-bezier(0.22, 0.61, 0.36, 1); --spin-drum: 60s; --spin-lines-outer: 90s; --spin-lines-inner: 90s; }
.sgf-sym *, .sgf-sym *::before, .sgf-sym *::after { box-sizing: border-box; }
.sgf-sym { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
.sgf-sym { margin: 0; background: var(--bg-edge); color: #fff; font-family: var(--font); font-weight: var(--fw-regular); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.sgf-sym img { display: block; max-width: 100%; }
.sgf-sym .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.sgf-sym .text-gold { background: linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 100%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-box-decoration-break: clone; box-decoration-break: clone; padding-block: 0.32em 0.12em; }
.sgf-sym .trim { text-box: trim-both cap alphabetic; }
.sgf-sym .sg-about { position: relative; overflow: hidden; background: radial-gradient(70.71% 70.71% at 50% 50%, var(--bg-center) 0%, var(--bg-edge) 100%); isolation: isolate; }
@keyframes sg-spin { to { transform: rotate(360deg); } }
.sgf-sym { --sym-gold: linear-gradient(180deg, #fbe3a6 0%, #e8c495 48%, #c9984a 100%); }
html.sym-lock { overflow: hidden; scrollbar-gutter: stable; }
.sgf-sym [data-tam-an] { display: none !important; }
.sgf-sym .sym { --u: min(calc(100vw / 1440), calc(100vh / 900)); --oy: calc((100vh - 900 * var(--u)) / 2); position: relative; background: radial-gradient(70.71% 70.71% at 50% 50%, #750d1b 0%, #4b0d18 100%); color: #fff; }
.sgf-sym .sym__stage { position: sticky; top: 0; height: 100vh; overflow: hidden; }
.sgf-sym .sym__compass { position: absolute; display: block; left: calc(-175 * var(--u)); top: calc(var(--oy) + 394 * var(--u)); width: calc(805 * var(--u)); height: auto; aspect-ratio: 1 / 1; max-width: none; border-radius: 50%; background: linear-gradient(180deg, #4d0e18 0%, #6a0d1a 100%); pointer-events: none; user-select: none; }
.sgf-sym .sym__drum { display: block; width: 100%; height: 100%; max-width: none; transform-origin: 49.85% 49.85%; animation: sg-spin var(--spin-drum) linear infinite; }
.sgf-sym .sym__intro { position: absolute; z-index: 2; left: calc(64 * var(--u)); top: calc(var(--oy) + 105 * var(--u)); width: calc(437 * var(--u)); }
.sgf-sym .sym__title { margin: 0; max-width: calc(366 * var(--u)); font-size: max(22px, calc(36 * var(--u))); font-weight: var(--fw-regular); line-height: 1.35; letter-spacing: -0.01em; text-transform: uppercase; }
.sgf-sym .sym__title > span { display: block; }
.sgf-sym .sym__title-a { color: #f6d5d4; font-weight: var(--fw-medium); }
.sgf-sym .sym__desc { margin: calc(24 * var(--u)) 0 0; width: calc(366 * var(--u)); color: #f8f2e9; font-size: max(13px, calc(14 * var(--u))); line-height: 1.5; }
.sgf-sym .sym__hint { position: absolute; z-index: 2; left: calc(64 * var(--u)); top: calc(var(--oy) + 806 * var(--u)); width: 22px; height: 16px; color: #fff; transition: opacity 0.4s var(--ease); animation: sym-nudge 2.2s var(--ease) infinite; }
.sgf-sym .sym__stage.is-end .sym__hint { opacity: 0; }
@keyframes sym-nudge { 50% { transform: translateX(6px); } }
.sgf-sym .sym__viewport { position: absolute; z-index: 1; top: 0; bottom: 0; left: calc(556 * var(--u)); right: 0; overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 calc(40 * var(--u))); mask-image: linear-gradient(90deg, transparent 0, #000 calc(40 * var(--u))); }
.sgf-sym .sym__track { position: absolute; top: calc(var(--oy) + 67 * var(--u)); left: 0; display: flex; gap: calc(46 * var(--u)); width: max-content; margin: 0; padding: 0 calc(65 * var(--u)) 0 calc(48 * var(--u)); list-style: none; will-change: transform; }
.sgf-sym .sym:not(.sym--scrub) { --sym-fade: calc(168 * var(--u)); }
.sgf-sym .sym:not(.sym--scrub) .sym__viewport { left: calc(436 * var(--u)); -webkit-mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.013) calc(var(--sym-fade) * 0.081), rgba(0, 0, 0, 0.049) calc(var(--sym-fade) * 0.155), rgba(0, 0, 0, 0.104) calc(var(--sym-fade) * 0.225), rgba(0, 0, 0, 0.175) calc(var(--sym-fade) * 0.29), rgba(0, 0, 0, 0.259) calc(var(--sym-fade) * 0.352), rgba(0, 0, 0, 0.352) calc(var(--sym-fade) * 0.41), rgba(0, 0, 0, 0.45) calc(var(--sym-fade) * 0.471), rgba(0, 0, 0, 0.55) calc(var(--sym-fade) * 0.529), rgba(0, 0, 0, 0.648) calc(var(--sym-fade) * 0.59), rgba(0, 0, 0, 0.741) calc(var(--sym-fade) * 0.648), rgba(0, 0, 0, 0.825) calc(var(--sym-fade) * 0.71), rgba(0, 0, 0, 0.896) calc(var(--sym-fade) * 0.775), rgba(0, 0, 0, 0.951) calc(var(--sym-fade) * 0.845), rgba(0, 0, 0, 0.987) calc(var(--sym-fade) * 0.919), rgba(0, 0, 0, 1) var(--sym-fade)); mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.013) calc(var(--sym-fade) * 0.081), rgba(0, 0, 0, 0.049) calc(var(--sym-fade) * 0.155), rgba(0, 0, 0, 0.104) calc(var(--sym-fade) * 0.225), rgba(0, 0, 0, 0.175) calc(var(--sym-fade) * 0.29), rgba(0, 0, 0, 0.259) calc(var(--sym-fade) * 0.352), rgba(0, 0, 0, 0.352) calc(var(--sym-fade) * 0.41), rgba(0, 0, 0, 0.45) calc(var(--sym-fade) * 0.471), rgba(0, 0, 0, 0.55) calc(var(--sym-fade) * 0.529), rgba(0, 0, 0, 0.648) calc(var(--sym-fade) * 0.59), rgba(0, 0, 0, 0.741) calc(var(--sym-fade) * 0.648), rgba(0, 0, 0, 0.825) calc(var(--sym-fade) * 0.71), rgba(0, 0, 0, 0.896) calc(var(--sym-fade) * 0.775), rgba(0, 0, 0, 0.951) calc(var(--sym-fade) * 0.845), rgba(0, 0, 0, 0.987) calc(var(--sym-fade) * 0.919), rgba(0, 0, 0, 1) var(--sym-fade)); }
.sgf-sym .sym:not(.sym--scrub) .sym__track { padding-left: calc(168 * var(--u)); }
.sgf-sym .sym:not(.sym--scrub) .sym-card__btn { transform-origin: 100% 52%; will-change: transform, opacity; }
.sgf-sym .sym:not(.sym--scrub) .sym-card__label { will-change: opacity; }
.sgf-sym .sym-card { position: relative; flex: none; width: calc(624.1 * var(--u)); height: calc(739 * var(--u)); container-type: inline-size; }
.sgf-sym .sym-card__btn { position: absolute; inset: 0; display: block; padding: 0; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.sgf-sym .sym-card__btn:focus-visible { outline: 2px solid #ffe284; outline-offset: 6px; }
.sgf-sym .sym-card__frame { position: absolute; top: -0.27%; left: -0.32%; width: 100.64%; height: 100.54%; max-width: none; pointer-events: none; }
.sgf-sym .sym-card__media { position: absolute; left: 1.447%; top: 1.222%; width: 97.106%; height: 97.556%; overflow: hidden; clip-path: url(#sgf-sym-arch); }
.sgf-sym .sym-card__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--ease); }
.sgf-sym .sym-card__shade { position: absolute; left: 1.44%; width: 97.1%; top: 62.25%; height: 36.54%; background: linear-gradient(180deg, rgba(88, 7, 23, 0) 20.6%, #4d000f 100%); pointer-events: none; }
.sgf-sym .sym-card__label { position: absolute; left: 50%; bottom: 3.92%; width: 88.6%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 3.2cqw; padding-bottom: 6.41cqw; transition: transform 0.8s var(--ease); }
.sgf-sym .sym-card__label::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: linear-gradient(90deg, rgba(246, 215, 114, 0) 0%, rgba(246, 215, 114, 0.9) 22%, rgba(246, 215, 114, 0.9) 78%, rgba(246, 215, 114, 0) 100%); }
.sgf-sym .sym-card__star { width: 5.45cqw; height: 2.72cqw; display: block; }
.sgf-sym .sym-card__title { font-size: 5.13cqw; font-weight: var(--fw-medium); line-height: 1.35; letter-spacing: -0.01em; text-transform: uppercase; white-space: nowrap; background: var(--sym-gold); -webkit-background-clip: text; background-clip: text; color: transparent; padding-block: 0.3em 0.12em; margin-block: -0.3em -0.12em; }
@media (hover: hover) {
.sgf-sym .sym-card__btn:hover .sym-card__media img { transform: scale(1.05); }
.sgf-sym .sym-card__btn:hover .sym-card__label { transform: translate(-50%, -6px); }
}
.sgf-sym .sym-card.is-lifted .sym-card__media, .sgf-sym .sym-card.is-lifted .sym-card__shade, .sgf-sym .sym-card.is-lifted .sym-card__label { visibility: hidden; }
.sgf-sym .sym__stage.is-return .sym-card { animation: sym-card-in 1.1s var(--ease) both; animation-delay: calc(var(--i) * 90ms + 120ms); }
.sgf-sym .sym__stage.is-return .sym__intro { animation: sym-fade-in 0.9s var(--ease) both; }
@keyframes sym-card-in { from { opacity: 0; transform: translateY(80px); } }
@keyframes sym-fade-in { from { opacity: 0; } }
.sgf-sym .sym-detail { --s: 1; position: fixed; inset: 0; z-index: 1000; overflow: hidden; contain: strict; color: #fff; overscroll-behavior: contain; touch-action: none; }
.sgf-sym .sym-detail[hidden] { display: none; }
.sgf-sym .sym-detail__bg, .sgf-sym .sym-detail__panel { position: absolute; inset: 0; background: radial-gradient(70.71% 70.71% at 50% 50%, #750d1b 0%, #4b0d18 100%); }
.sgf-sym .sym-detail__bg { opacity: 0; }
.sgf-sym .sym-detail__full { position: absolute; inset: 0; z-index: 1; }
.sgf-sym .sym-slide { position: absolute; inset: 0; overflow: hidden; }
.sgf-sym .sym-slide img { width: 100%; height: 100%; object-fit: cover; display: block; will-change: transform; }
.sgf-sym .sym-edge { position: absolute; z-index: 2; top: 0; bottom: 0; left: -1px; width: 2px; background: linear-gradient(180deg, rgba(255, 231, 166, 0) 0%, #ffe7a6 18%, #fff6dc 50%, #ffe7a6 82%, rgba(255, 231, 166, 0) 100%); box-shadow: 0 0 14px 3px rgba(255, 210, 110, 0.7), 0 0 44px 10px rgba(255, 170, 60, 0.35); mix-blend-mode: screen; opacity: 0; pointer-events: none; }
.sgf-sym .sym-detail__panel { z-index: 3; background: radial-gradient(70.71% 70.71% at 50% 50%, #6c0d1a 0%, #4b0d18 100%); transform: translateX(100%); visibility: hidden; }
.sgf-sym .sym-head { --hs: 1; position: absolute; z-index: 6; left: 0; top: 0; display: flex; flex-direction: column; align-items: center; gap: calc(20px * var(--hs)); padding-bottom: calc(40px * var(--hs)); transform-origin: 0 0; visibility: hidden; will-change: transform, opacity; }
.sgf-sym .sym-head__line { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: linear-gradient(90deg, rgba(246, 215, 114, 0) 0%, rgba(246, 215, 114, 0.85) 26%, rgba(246, 215, 114, 0.85) 74%, rgba(246, 215, 114, 0) 100%); }
.sgf-sym .sym-head__star { width: calc(34px * var(--hs)); height: calc(17px * var(--hs)); display: block; }
.sgf-sym .sym-head__title { margin: 0; font-size: calc(32px * var(--hs)); font-weight: var(--fw-medium); line-height: 1.35; letter-spacing: -0.01em; text-transform: uppercase; text-align: center; white-space: nowrap; background: var(--sym-gold); -webkit-background-clip: text; background-clip: text; color: transparent; padding-block: 0.3em 0.12em; margin-block: -0.3em -0.12em; filter: drop-shadow(0 1px 10px rgba(38, 4, 8, 0.55)); }
.sgf-sym .sym-head__bird { position: absolute; left: 50%; top: calc(81.6px * var(--hs)); width: calc(64px * var(--hs)); height: calc(32px * var(--hs)); transform: translateX(-50%); }
.sgf-sym .sym-detail__win { position: absolute; z-index: 5; left: 0; top: 0; overflow: hidden; clip-path: url(#sgf-sym-arch); transform-origin: 0 0; visibility: hidden; will-change: transform; }
.sgf-sym .sym-detail__win img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; max-width: none; object-fit: cover; }
.sgf-sym .sym-caption { position: absolute; z-index: 7; inset: 0; opacity: 0; pointer-events: none; }
.sgf-sym .sym-caption__shade { position: absolute; left: 0; right: 0; bottom: 0; height: 51.3%; background: linear-gradient(180deg, rgba(14, 14, 14, 0) 0%, #212121 100%); mix-blend-mode: luminosity; }
.sgf-sym .sym-caption__inner { position: absolute; left: calc(67px * var(--s)); right: calc(54px * var(--s)); bottom: calc(101px * var(--s)); display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; }
.sgf-sym .sym-caption__title { margin: 0; max-width: calc(488px * var(--s)); font-size: max(22px, calc(36px * var(--s))); font-weight: var(--fw-regular); line-height: 1.35; letter-spacing: -0.01em; text-transform: uppercase; color: #f6d5d4; }
.sgf-sym .sym-caption__title .text-gold { font-weight: var(--fw-regular); }
.sgf-sym .sym-caption__title span:not(.text-gold) { font-weight: var(--fw-medium); }
.sgf-sym .sym-caption__desc { margin: 0; width: calc(372px * var(--s)); max-width: 42%; color: #f8f2e9; font-size: max(13px, calc(14px * var(--s))); line-height: 1.5; }
.sgf-sym .sym-caption__line { position: absolute; left: calc(66.5px * var(--s)); bottom: calc(56px * var(--s)); width: calc(477px * var(--s)); height: 2px; background: linear-gradient(90deg, rgba(246, 215, 114, 0) 0%, #f6d772 100%); transform-origin: 0 50%; }
.sgf-sym .sym-close { position: absolute; z-index: 8; top: 24px; right: 24px; width: 44px; height: 44px; padding: 0; border: 1px solid rgba(232, 196, 149, 0.55); border-radius: 50%; background: rgba(40, 6, 10, 0.25); color: #f6dc9a; cursor: pointer; backdrop-filter: blur(4px); transition: background-color 0.3s, border-color 0.3s; }
.sgf-sym .sym-close:hover { background: rgba(40, 6, 10, 0.55); border-color: #f6dc9a; }
.sgf-sym .sym-close:focus-visible { outline: 2px solid #ffe284; outline-offset: 3px; }
.sgf-sym .sym-close svg { width: 16px; height: 16px; display: block; margin: auto; }
@media (max-width: 1023px) {
.sgf-sym .sym:not(.sym--scrub) { height: auto !important; --u: 1px; --oy: 0px; }
.sgf-sym .sym:not(.sym--scrub) .sym__stage { position: relative; height: auto; padding: 72px 0 88px; overflow: hidden; }
.sgf-sym .sym:not(.sym--scrub) .sym__compass { left: -45%; top: auto; bottom: -25%; width: 110%; opacity: 0.9; }
.sgf-sym .sym:not(.sym--scrub) .sym__intro { position: relative; left: auto; top: auto; width: auto; padding: 0 20px; }
.sgf-sym .sym:not(.sym--scrub) .sym__title { max-width: 360px; font-size: clamp(24px, 6.6vw, 32px); }
.sgf-sym .sym:not(.sym--scrub) .sym__desc { width: auto; max-width: 440px; margin-top: 18px; font-size: 14px; }
.sgf-sym .sym:not(.sym--scrub) .sym__hint { position: relative; left: 20px; top: auto; display: block; margin-top: 24px; }
.sgf-sym .sym:not(.sym--scrub) .sym__viewport { position: relative; left: auto; margin-top: 32px; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; scrollbar-width: none; -webkit-mask-image: none; mask-image: none; }
.sgf-sym .sym:not(.sym--scrub) .sym__viewport::-webkit-scrollbar { display: none; }
.sgf-sym .sym:not(.sym--scrub) .sym__track { position: relative; top: auto; transform: none !important; gap: 16px; padding: 0 20px; }
.sgf-sym .sym:not(.sym--scrub) .sym-card { width: min(78vw, 380px); height: auto; aspect-ratio: 624.1 / 739; scroll-snap-align: center; }
.sgf-sym .sym:not(.sym--scrub) .sym-card__btn, .sgf-sym .sym:not(.sym--scrub) .sym-card__label { will-change: auto; }
.sgf-sym .sym-caption__inner { left: 20px; right: 20px; bottom: 56px; flex-direction: column; align-items: flex-start; gap: 14px; }
.sgf-sym .sym-caption__title { max-width: 100%; font-size: clamp(22px, 6.4vw, 30px); }
.sgf-sym .sym-caption__desc { width: auto; max-width: 100%; }
.sgf-sym .sym-caption__line { left: 20px; bottom: 32px; width: min(60vw, 280px); }
.sgf-sym .sym-close { top: 16px; right: 16px; }
}
@media (prefers-reduced-motion: reduce) {
.sgf-sym .sym__hint, .sgf-sym .sym__drum { animation: none; }
.sgf-sym .sym-card__media img, .sgf-sym .sym-card__label { transition: none; }
.sgf-sym .sym__stage.is-return .sym-card, .sgf-sym .sym__stage.is-return .sym__intro { animation: none; }
}
.sgf-sym .sym.has-cursor .sym-card__btn { cursor: none; }
.sgf-sym .sym-cursor { position: fixed; z-index: 999; left: 0; top: 0; width: 0; height: 0; pointer-events: none; will-change: transform; }
.sgf-sym .sym-cursor__in { position: absolute; left: -60px; top: -60px; width: 120px; height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; border: 1px solid rgba(225, 204, 152, 0.85); border-radius: 50%; background: radial-gradient(circle at 50% 38%, #b3332e 0%, #6e0f0c 62%, #360301 100%); box-shadow: inset 0 3px 2px rgba(255, 255, 255, 0.22), 0 14px 34px rgba(25, 0, 3, 0.45); color: #f7e6b8; font-family: var(--font); font-size: 15px; font-weight: var(--fw-medium); line-height: 1.15; letter-spacing: -0.01em; text-align: center; opacity: 0; transform: scale(0.35); transition: opacity 0.22s cubic-bezier(0.4, 0, 1, 1), transform 0.26s cubic-bezier(0.4, 0, 1, 1); }
.sgf-sym .sym-cursor__star { width: 22px; height: 11px; display: block; }
.sgf-sym .sym-cursor.is-on .sym-cursor__in { opacity: 1; transform: scale(1); transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.34, 1.45, 0.5, 1); }
.sgf-sym .sym-cursor.is-on.is-press .sym-cursor__in { transform: scale(0.9); transition-duration: 0.15s; }
.sgf-sym .sym-cursor.is-instant .sym-cursor__in { transition: none; }
@media (prefers-reduced-motion: reduce) {
.sgf-sym .sym-cursor__in, .sgf-sym .sym-cursor.is-on .sym-cursor__in { transition: opacity 0.15s linear; transform: none; }
}
`
const EXTRA_CSS = `.sgf-sym :where(h1, h2, h3, h4, p, figure, ul, ol) { margin: revert; padding: revert; }
.sgf-sym :where(h1, h2, h3, h4) { font-size: revert; font-weight: revert; }
.sgf-sym :where(button) { font: revert; }
.sgf-sym.sg-nodrum .sym__drum { animation: none; }
.sgf-sym .sym.is-canvas { height: auto !important; }
.sgf-sym .sym.is-canvas .sym__stage { position: relative; height: calc(900 * var(--u)); }
`

// ---------- Hình vẽ SVG nhúng sẵn ----------
const SVG_DRUM = svgUri(`<svg width="805" height="805" viewBox="0 0 805 805" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="d"><path d="M422.723 51.0908C422.653 51.4078 419.849 53.4436 419.457 53.7459C417.489 55.2407 415.582 56.8145 413.74 58.4635C411.262 60.7085 407.353 64.8637 407.163 68.4457C403.823 66.1867 404.892 63.4876 406.753 60.7213C407.373 59.7995 407.991 58.5607 408.466 57.5722C410.55 53.2378 410.076 48.6775 408.358 44.3129C407.585 42.223 405.761 38.9629 403.643 38.0077C403.719 40.2353 403.651 42.8499 403.649 45.0962L403.652 58.3137C403.654 60.467 403.579 63.0198 403.696 65.1363L402.3 65.1503C402.288 66.2287 402.304 67.3376 402.309 68.4186L394.488 68.4173C394.427 62.5795 386.811 57.067 382.609 54.0029C382.116 53.6436 379.254 51.5349 378.984 51.1914L379.064 51.0514C384.007 47.1533 390.436 42.4738 393.482 36.851C394.046 35.8103 394.362 34.6523 394.614 33.5011C396.163 34.5232 397.101 36.1909 396.543 38.151C396.181 39.4239 395.067 40.8491 394.43 42.0214C393.75 43.2752 393.06 44.5117 392.598 45.8802C391.653 48.7463 391.622 51.4172 392.358 54.3316C393.254 57.8791 394.864 61.9745 398.104 63.9685C398.202 61.0166 398.121 57.5154 398.12 54.5374L398.119 36.8423C398.559 36.8359 398.998 36.8393 399.437 36.8525C399.512 35.9622 399.473 34.4127 399.472 33.4741C402.02 33.4356 404.672 33.4657 407.226 33.4767C407.515 40.6025 417.709 47.0173 422.723 51.0908Z" fill="#5C1721"/></g><use href="#d" xlink:href="#d" transform="translate(78.0176 -65.1332) rotate(10.2857)"/><use href="#d" xlink:href="#d" transform="translate(166.411 -115.289) rotate(20.5714)"/><use href="#d" xlink:href="#d" transform="translate(262.34 -148.856) rotate(30.8571)"/><use href="#d" xlink:href="#d" transform="translate(362.721 -164.754) rotate(41.1429)"/><use href="#d" xlink:href="#d" transform="translate(464.328 -162.473) rotate(51.4286)"/><use href="#d" xlink:href="#d" transform="translate(563.894 -142.087) rotate(61.7143)"/><use href="#d" xlink:href="#d" transform="translate(658.22 -104.249) rotate(72)"/><use href="#d" xlink:href="#d" transform="translate(744.274 -50.1776) rotate(82.2857)"/><use href="#d" xlink:href="#d" transform="translate(819.29 18.3909) rotate(92.5714)"/><use href="#d" xlink:href="#d" transform="translate(880.858 99.2521) rotate(102.857)"/><use href="#d" xlink:href="#d" transform="translate(926.998 189.807) rotate(113.143)"/><use href="#d" xlink:href="#d" transform="translate(956.226 287.145) rotate(123.429)"/><use href="#d" xlink:href="#d" transform="translate(967.605 388.138) rotate(133.714)"/><use href="#d" xlink:href="#d" transform="translate(960.768 489.54) rotate(144)"/><use href="#d" xlink:href="#d" transform="translate(935.935 588.092) rotate(154.286)"/><use href="#d" xlink:href="#d" transform="translate(893.904 680.625) rotate(164.571)"/><use href="#d" xlink:href="#d" transform="translate(836.026 764.167) rotate(174.857)"/><use href="#d" xlink:href="#d" transform="translate(764.161 836.031) rotate(-174.857)"/><use href="#d" xlink:href="#d" transform="translate(680.619 893.909) rotate(-164.571)"/><use href="#d" xlink:href="#d" transform="translate(588.085 935.939) rotate(-154.286)"/><use href="#d" xlink:href="#d" transform="translate(489.533 960.772) rotate(-144)"/><use href="#d" xlink:href="#d" transform="translate(388.131 967.608) rotate(-133.714)"/><use href="#d" xlink:href="#d" transform="translate(287.139 956.229) rotate(-123.429)"/><use href="#d" xlink:href="#d" transform="translate(189.8 926.999) rotate(-113.143)"/><use href="#d" xlink:href="#d" transform="translate(99.2457 880.859) rotate(-102.857)"/><use href="#d" xlink:href="#d" transform="translate(18.385 819.291) rotate(-92.5714)"/><use href="#d" xlink:href="#d" transform="translate(-50.1829 744.274) rotate(-82.2857)"/><use href="#d" xlink:href="#d" transform="translate(-104.254 658.219) rotate(-72)"/><use href="#d" xlink:href="#d" transform="translate(-142.091 563.893) rotate(-61.7143)"/><use href="#d" xlink:href="#d" transform="translate(-162.477 464.327) rotate(-51.4286)"/><use href="#d" xlink:href="#d" transform="translate(-164.757 362.72) rotate(-41.1429)"/><use href="#d" xlink:href="#d" transform="translate(-148.858 262.339) rotate(-30.8571)"/><use href="#d" xlink:href="#d" transform="translate(-115.29 166.41) rotate(-20.5714)"/><use href="#d" xlink:href="#d" transform="translate(-65.1338 78.017) rotate(-10.2857)"/><circle cx="401.668" cy="401.657" r="283.678" stroke="#5C1721" stroke-width="2.5039"/><circle cx="401.662" cy="401.658" r="297.357" stroke="#5C1721" stroke-width="9.30636"/><circle cx="401.661" cy="401.66" r="307.226" stroke="#5C1721" stroke-width="2.5039"/><circle cx="401.666" cy="401.662" r="387.289" stroke="#530D18" stroke-width="2.5039"/><path d="M425.85 309.577L425.948 310.329L426.408 309.728L541.755 159.031L468.922 334.272L468.631 334.973L469.331 334.682L644.569 261.849L493.876 377.194L493.274 377.655L494.026 377.754L682.203 402.299L494.026 426.844L493.274 426.942L493.876 427.402L644.571 542.749L469.331 469.916L468.631 469.625L468.922 470.325L541.755 645.565L426.408 494.87L425.948 494.269L425.85 495.021L401.305 683.197L376.76 495.021L376.661 494.269L376.2 494.87L260.854 645.563L333.688 470.325L333.979 469.625L333.278 469.916L158.034 542.75L308.733 427.402L309.335 426.942L308.583 426.844L120.405 402.299L308.583 377.754L309.335 377.655L308.733 377.194L158.034 261.847L333.278 334.682L333.979 334.973L333.688 334.272L260.853 159.028L376.2 309.728L376.661 310.329L376.76 309.577L401.305 121.399L425.85 309.577Z" fill="#5C1721" stroke="#530D18" stroke-width="0.625975"/></svg>`)
const SVG_FRAME = svgUri(`<svg width="629" height="743" viewBox="0 0 629 743" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M311.549 1.00378C380.992 1.00378 437.868 15.1247 487.21 29.0145H487.211C490.253 29.8712 493.265 30.7253 496.242 31.5741L505.418 34.1952C547.186 46.1451 582.62 56.2753 617.078 56.2753H627.111V741.998H1.00391V55.243L2.10449 55.3514L12.0166 56.3231C51.699 60.2162 91.8689 47.8861 139.43 33.2684L142.745 32.2489L142.746 32.2479C191.172 17.3714 246.072 1.00383 311.549 1.00378Z" fill="#580717" stroke="url(#g)" stroke-width="2.00676" vector-effect="non-scaling-stroke"/><defs><linearGradient id="g" x1="314.058" y1="2.00671" x2="314.058" y2="631.02" gradientUnits="userSpaceOnUse"><stop stop-color="#E5C04F"/><stop offset="1" stop-color="#9C545F"/></linearGradient></defs></svg>`)
const SVG_DEFS = `<svg class="sr-only" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute"><defs><clipPath id="sgf-sym-arch" clipPathUnits="objectBoundingBox"><path d="M0,0.076668 L0,1 L1,1 L1,0.076668 C0.864238,0.076668 0.720408,0 0.495861,0 C0.28524,0 0.14197,0.088379 0,0.076668 Z"/></clipPath><radialGradient id="sgf-sym-star-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17 17) rotate(-90) scale(17)"><stop stop-color="#FFF2B0"/><stop offset="1" stop-color="#F5DE6D"/></radialGradient></defs><symbol id="sgf-sym-star" viewBox="0 0 34 17"><path d="M11.434 15.5086L0 17H34L22.566 15.5086L31.7224 8.5L21.0746 12.9254L25.5 2.27757L18.4914 11.434L17 0L15.5086 11.434L8.5 2.27757L12.9254 12.9254L2.27757 8.5L11.434 15.5086Z" fill="url(#sgf-sym-star-grad)"/></symbol><symbol id="sgf-sym-bird" viewBox="0 0 64 32" fill="#DCB43C"><path d="M24.7665 11.5565C25.6606 11.5833 26.5319 11.5996 27.4033 11.616L27.4345 12.2058C26.53 12.2017 25.636 12.1749 24.7419 12.1481L24.6956 13.0861C25.5897 13.1128 26.5168 13.1274 27.4212 13.1315L27.4278 13.6553C26.5234 13.6511 25.5963 13.6366 24.6795 13.5994L24.6455 14.5704C25.5726 14.5849 26.4894 14.6221 27.4269 14.614L27.4212 15.1047C26.4941 15.0902 25.567 15.0756 24.6398 15.0611L24.6039 15.9764C25.5537 16.0014 26.4808 16.0159 27.4306 16.0409L27.425 16.5316C26.4648 16.5292 25.5253 16.4816 24.5878 16.4897L24.5434 17.4833C25.4932 17.5083 26.4657 17.5437 27.4032 17.5356L27.4183 17.981C26.4581 17.9787 25.4856 17.9433 24.5254 17.941L24.5028 18.5883C24.5028 18.5883 27.3682 18.8076 28.7169 18.7416L28.5913 10.7637C28.0289 9.65594 27.4336 8.56043 26.8817 7.43007L26.033 7.42413C26.5726 8.52145 27.1018 9.6414 27.6641 10.7491L27.0942 10.7342C26.5319 9.62642 25.9696 8.51869 25.4177 7.38832L24.4906 7.37377C25.0425 8.50413 25.6048 9.61187 26.1567 10.7422L25.5869 10.7273C25.0576 9.6073 24.5284 8.48735 23.9992 7.3674L23.0267 7.33201C23.5786 8.46238 24.1305 9.59275 24.7051 10.7335L24.7315 11.513L24.7665 11.5565Z"/><path d="M29.4211 18.7052C29.9909 18.7202 30.334 18.631 30.334 18.631C30.3114 15.9897 30.2556 13.3606 30.1999 10.7314C29.6272 9.64632 29.0318 8.5508 28.4591 7.4657L27.4989 7.46336C28.0612 8.5711 28.6339 9.65621 29.2293 10.7517C29.3077 13.3913 29.3531 16.043 29.3984 18.6948L29.4211 18.7052Z"/><path d="M29.4551 23.1323C26.8089 23.4522 24.3252 23.2985 23.5796 23.3673L24.122 24.2193C25.5614 24.1949 27.0215 24.1253 28.459 24.0453L28.4949 24.4455C27.1132 24.5237 25.7419 24.5793 24.3583 24.6018L24.8762 25.3877C26.1029 25.3479 27.3627 25.296 28.5998 25.2336L28.6707 25.6772C27.512 25.7482 26.3411 25.7861 25.1928 25.8345L25.7683 26.6742C26.772 26.6417 27.7757 26.6092 28.7671 26.5436L28.8275 27.0099C27.9023 27.051 26.9998 27.1026 26.0849 27.1211L26.6009 27.8513C27.3816 27.826 28.1622 27.8007 28.9428 27.7754L29.0156 28.2747C28.3134 28.3086 27.6216 28.3198 26.9298 28.3311L26.462 29.3496L27.0413 29.643L27.3012 29.0771L27.8257 29.0713L27.4723 29.8408L27.9958 30.136L28.5402 29.0704L29.009 29.0664L28.3379 30.3479L29.0638 30.6811L30.0561 28.999L29.4343 23.1776L29.4551 23.1323Z"/><path d="M31.3303 22.8702C31.076 22.9453 29.9646 23.0928 29.9646 23.0928L30.6875 28.9333C30.3076 29.581 29.9277 30.2288 29.5478 30.8765L30.387 31.2618C30.8851 30.4765 31.3604 29.6807 31.8358 28.8849L31.3303 22.8702Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M43.4741 11.7576L43.4835 11.7519L43.512 11.7344L43.5478 11.7123L43.5768 11.6943C44.3196 11.2132 45.8771 10.3935 45.8771 10.3935C45.8771 10.3935 49.4628 8.80577 53.1817 6.86817C56.9233 4.94089 60.765 2.67599 61.7999 1.91782C62.8348 1.15965 63.4973 0.614246 63.7544 0.293762L63.6882 0.318176C63.6618 0.196461 63.5323 0 63.5323 0C63.5323 0 63.5256 0.00411092 63.5087 0.015248L63.4728 0.038743C63.3069 0.147088 62.8023 0.473082 62.0049 0.938405C59.1709 2.59219 52.6386 6.00587 44.4671 7.66331C44.3838 7.63154 44.2934 7.59357 44.1964 7.55263C43.4764 7.24942 42.3756 6.7858 40.8559 7.51275C39.0848 8.36494 38.9143 10.168 38.7837 11.5492C38.7531 11.8726 38.7247 12.1732 38.6784 12.4327C38.6274 12.9026 38.2569 15.1441 36.9394 16.4578C35.3838 17.9908 33.608 19.2858 28.6576 19.4797C23.9861 19.6645 18.1294 18.4831 13.2879 16.9454C8.82791 15.5797 5.2106 13.9028 3.71191 13.2079L3.66548 13.1864C3.55688 13.1361 3.46017 13.0913 3.37588 13.0526L2.73226 14.1548C4.31212 14.8537 5.89019 15.5013 7.50854 16.1653L7.70433 16.2456L7.53799 16.6077C6.40765 16.1985 3.84841 15.1331 2.53288 14.5291L2.13214 15.2222C2.37497 15.3241 2.65326 15.4421 2.95108 15.5685C4.34765 16.1609 6.21281 16.9521 7.28186 17.2849L7.11552 17.647C5.92945 17.2395 3.31443 16.176 1.93276 15.5965L1.46773 16.3697C2.95055 16.9682 5.52873 17.9326 6.83861 18.3695L6.67227 18.7316C5.53348 18.4006 2.79654 17.3633 1.26833 16.744L0.792938 17.5397C2.7256 18.2352 5.44837 19.1837 6.40762 19.4871L6.26206 19.804C5.38317 19.5649 1.53386 18.3184 0.56045 17.9263L0 18.8475C4.9144 20.8844 11.0517 22.1125 16.5284 22.6262C22.0052 23.14 26.8006 22.9845 29.0148 22.768C32.1421 22.4771 35.4272 21.2447 37.0934 20.009C38.7596 18.7733 40.1631 17.0333 40.923 15.0801C41.8391 12.7526 42.9083 12.1019 43.459 11.7667L43.4667 11.7621L43.4741 11.7576ZM43.1968 9.2361C43.1787 9.31149 43.1531 9.38634 43.1195 9.4595C42.8416 10.0643 42.125 10.3291 41.5189 10.0508C40.9127 9.77251 40.6466 9.05655 40.9244 8.45174C41.2022 7.84693 41.9188 7.58215 42.525 7.86044C43.0578 8.10507 43.3279 8.6879 43.1968 9.2361Z"/><path d="M39.4078 7.86133C37.6324 8.7894 34.4399 8.82916 32.7769 8.30336C33.0831 9.0057 33.4527 9.65445 34.2232 10.3471L35.4665 9.30045L35.7961 9.58063L34.5507 10.6298C34.6732 10.7314 34.7986 10.8309 34.9263 10.9278L36.1812 9.86752L36.5108 10.1477L35.2768 11.1835C35.4088 11.2759 35.5425 11.3653 35.6774 11.4512L36.8955 10.4341L37.2252 10.7143L36.0518 11.6788C36.6603 12.0313 37.5342 12.422 38.1149 12.5764C38.0035 10.2275 38.5036 8.79319 39.4078 7.86133Z"/></symbol></svg>`

// ---------- Nội dung mặc định (ảnh lấy theo "Thư mục ảnh") ----------
const DEFAULT_TOPICS = [
    {
        "name": "Thiên nhiên khởi nguồn",
        "alt1": "Hai người trên cây cầu vươn ra biển lúc hoàng hôn",
        "alt2": "Nhà hát mái vòm giữa hàng cọ lúc chiều tà"
    },
    {
        "name": "Di sản tiếp nối",
        "alt1": "Đoàn múa dân tộc biểu diễn trước những ngôi nhà mái tranh",
        "alt2": "Biển mây và mặt trời mọc trên dãy núi"
    },
    {
        "name": "Kỷ lục kiến tạo",
        "alt1": "Cabin cáp treo bay trên đồi hoa cam",
        "alt2": "Trụ cáp treo in bóng trên mặt trời đỏ rực"
    },
    {
        "name": "Tinh hoa giao hòa",
        "alt1": "Pháo hoa rực rỡ trên sân khấu ven biển về đêm",
        "alt2": "Công trình mái vòm bên bến du thuyền lúc hoàng hôn"
    },
    {
        "name": "Trải nghiệm trọn vẹn",
        "alt1": "Biệt thự nghỉ dưỡng giữa rừng nhiệt đới nhìn từ trên cao",
        "alt2": "Hồ bơi vô cực bên bờ biển và hàng cọ"
    }
]
const DEFAULT_SLUGS = ["thien-nhien", "di-san", "ky-luc", "tinh-hoa", "trai-nghiem"]
const DEFAULT_DESC = "Sun Group không xây dựng những công trình đơn lẻ. Chúng tôi viết nên bản giao hưởng cho mỗi vùng đất, nơi thiên nhiên, văn hóa và con người hòa quyện, thăng hoa trong những trải nghiệm trọn vẹn."

function cardsHtml(topics: any[]): string {
    return topics.map((tp: any, i: number) => `<li class="sym-card" style="--i:${i}" data-sym-card>
            <button class="sym-card__btn" type="button" aria-label="${esc(tp.name)} – xem chi tiết">
              <img class="sym-card__frame" src="${SVG_FRAME}" alt="" width="629" height="743">
              <span class="sym-card__media" data-card-media><img src="${esc(tp.src)}" alt="" width="1920" height="1200"${i < 2 ? "" : ' loading="lazy"'}></span>
              <span class="sym-card__shade"></span>
              <span class="sym-card__label" data-card-label>
                <svg class="sym-card__star" viewBox="0 0 34 17" aria-hidden="true"><use href="#sgf-sym-star"/></svg>
                <span class="sym-card__title">${esc(tp.name)}</span>
              </span>
            </button>
          </li>`).join("\n          ")
}

function buildMarkup(d: any, uid: string): string {
    const cards = cardsHtml(d.topics)
    return SVG_DEFS + `  <section class="sym" aria-labelledby="sym-title-${uid}" data-sym>
    <div class="sym__stage" data-sym-stage>
      <span class="sym__compass" aria-hidden="true"><img class="sym__drum" src="${SVG_DRUM}" alt="" width="805" height="805"></span>

      <div class="sym__intro">
        <h2 class="sym__title trim" id="sym-title-${uid}">
          <span class="sym__title-a">${esc(d.titleA)}</span>
          <span><span class="text-gold">${esc(d.titleGold)}</span></span>
          <span class="sym__title-a">${esc(d.titleB)}</span>
        </h2>
        <p class="sym__desc">${esc(d.description)}</p>
      </div>
      <span class="sym__hint" aria-hidden="true">
          <svg viewBox="0 0 24 18" fill="none" aria-hidden="true">
            <path d="M1 17L6.1 10.2C6.63 9.49 6.63 8.51 6.1 7.8L1 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path opacity=".5" d="M9 17L14.1 10.2C14.63 9.49 14.63 8.51 14.1 7.8L9 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path opacity=".3" d="M17 17L22.1 10.2C22.63 9.49 22.63 8.51 22.1 7.8L17 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
      </span>

      <div class="sym__viewport" data-sym-viewport>
        <ul class="sym__track" data-sym-track>
          ${cards}
        </ul>
      </div>
    </div>
  </section>`
}

function buildDetail(d: any): string {
    return `<div class="sym-detail" data-sym-detail data-lenis-prevent role="dialog" aria-modal="true" aria-label="${esc(d.titleGold)} – xem chi tiết" tabindex="-1" hidden>
  <div class="sym-detail__bg" data-bg></div>
  <div class="sym-detail__full" data-full></div>
  <span class="sym-edge" data-edge aria-hidden="true"></span>
  <div class="sym-detail__panel" data-panel aria-hidden="true"></div>
  <div class="sym-head" data-head aria-hidden="true">
    <svg class="sym-head__star" viewBox="0 0 34 17" data-head-deco><use href="#sgf-sym-star"/></svg>
    <p class="sym-head__title trim" data-head-title></p>
    <span class="sym-head__line" data-head-deco></span>
    <svg class="sym-head__bird" viewBox="0 0 64 32" data-head-deco><use href="#sgf-sym-bird"/></svg>
  </div>
  <div class="sym-detail__win" data-win aria-hidden="true"><img alt=""></div>
  <div class="sym-caption" data-caption>
    <div class="sym-caption__shade" data-cap-shade></div>
    <div class="sym-caption__inner">
      <p class="sym-caption__title trim" data-cap><span>${esc(d.titleA)} </span><span class="text-gold">${esc(d.titleGold)}</span><span> ${esc(d.titleB)}</span></p>
      <p class="sym-caption__desc" data-cap>${esc(d.description)}</p>
    </div>
    <span class="sym-caption__line" data-cap-line></span>
  </div>
  <button class="sym-close" type="button" data-close aria-label="${esc(d.closeLabel)}">
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
  </button>
  <p class="sr-only" aria-live="polite" data-live></p>
</div>`
}

// ---------- Tương tác + hiệu ứng (giữ nguyên logic của trang test) ----------
function initSymphony(host, portal, opts) {


  var TOPICS = opts.topics;

  // --- dọn dẹp khi component bị gỡ / đổi props ---
  var dead = false, offs = [], timers = [];
  function on(t, type, fn, opt) { t.addEventListener(type, fn, opt); offs.push(function () { t.removeEventListener(type, fn, opt); }); }

  var root = host.querySelector('[data-sym]');
  var detail = portal.querySelector('[data-sym-detail]');
  if (!root || !detail) return function () {};

  var stage = root.querySelector('[data-sym-stage]');
  var viewport = root.querySelector('[data-sym-viewport]');
  var track = root.querySelector('[data-sym-track]');
  var cards = [].slice.call(root.querySelectorAll('[data-sym-card]'));

  var mqMobile = window.matchMedia('(max-width: 1023px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnimate = typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
  var A = 606.0407 / 720.9274;              // tỉ lệ khung vòm (rộng / cao)
  var noop = function () {};
  function LN() { var l = window.sgLenis || window.lenis; return l && typeof l.stop === 'function' && typeof l.start === 'function' ? l : null; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  // ===================================================================
  //  1. DẢI NGANG – cuộn dọc điều khiển dải chạy ngang (desktop)
  // ===================================================================
  var pinned = false, travel = 0, cur = 0, target = 0, raf = 0;
  var isOpen = false;

  function measure() {
    if (dead) return;
    if (opts.isCanvas) { canvasLayout(); return; }
    if (mqMobile.matches) {
      pinned = false;
      root.style.height = '';
      track.style.transform = '';
      cur = target = 0;
      stage.classList.remove('is-end');
      clearFade();
      return;
    }
    pinned = true;
    measureCards();
    var H = window.innerHeight;
    travel = Math.max(0, track.offsetWidth - viewport.clientWidth);
    root.style.height = (H + travel) + 'px';
    update(true);
  }

  function canvasLayout() {
    pinned = false;
    root.style.height = '';
    track.style.transform = '';
    cur = target = 0;
    stage.classList.remove('is-end');
    clearFade();
    if (mqMobile.matches) { root.classList.remove('is-canvas'); root.style.removeProperty('--u'); root.style.removeProperty('--oy'); return; }
    var w = root.clientWidth || 1440;
    root.classList.add('is-canvas');
    root.style.setProperty('--u', (w / 1440).toFixed(5) + 'px');
    root.style.setProperty('--oy', '0px');
  }
  var ro = null;
  if (opts.isCanvas && 'ResizeObserver' in window) { ro = new ResizeObserver(function () { measure(); }); ro.observe(root); }

  function scrolled() { return -root.getBoundingClientRect().top; }

  function update(jump) {
    if (!pinned || isOpen) return;
    var y = scrolled();
    target = -clamp(y / (travel || 1), 0, 1) * travel;
    stage.classList.toggle('is-end', y > travel - 4);
    // có smooth scroll (Lenis) thì cuộn đã mượt sẵn – bám thẳng, không làm mượt chồng thêm
    if (jump || reduce || LN()) { cur = target; paint(); return; }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    raf = 0;
    if (dead) return;
    var d = target - cur;
    if (Math.abs(d) < 0.25) cur = target;
    else { cur += d * 0.14; raf = requestAnimationFrame(tick); }
    paint();
  }
  function paint() {
    track.style.transform = 'translate3d(' + cur.toFixed(2) + 'px,0,0)';
    fadeCards();
  }

  // ---------- Cục rời mép trái: tan dần theo cuộn (kiểu scrub của ScrollTrigger / useTransform) ----------
  // Tiến độ rời e của mỗi cục = quãng mép trái cục đã đi qua vị trí đứng của cục 1, chia cho 1 bề rộng cục.
  // e: 0 → 1 ánh xạ (đường cong smoothstep, bám thẳng theo cuộn) sang:
  //   độ mờ cả cục 1 → 0, thu nhỏ 1 → 0.9 về phía mép phải (cục như lùi ra xa),
  //   tên chủ đề mờ trước (xong ở e ≈ 0.45) để chữ không bao giờ bị cắt ngang.
  // Chỉ dùng opacity + transform → chạy trên compositor, không gây reflow.
  var cardX = [], cardW = 1, restX = 0, fadeE = [];
  var btns = cards.map(function (c) { return c.querySelector('.sym-card__btn'); });
  var labels = cards.map(function (c) { return c.querySelector('[data-card-label]'); });
  function smooth(t) { return t * t * (3 - 2 * t); }
  function measureCards() {
    cardX = cards.map(function (c) { return c.offsetLeft; });
    cardW = cards[0] ? cards[0].offsetWidth || 1 : 1;
    restX = cardX[0] || 0;
    fadeE = [];
  }
  function fadeCards() {
    if (!pinned) return;
    for (var i = 0; i < cards.length; i++) {
      var e = clamp((restX - (cardX[i] + cur)) / cardW, 0, 1);
      e = Math.round(e * 1000) / 1000;
      if (e === fadeE[i]) continue;
      fadeE[i] = e;
      var k = smooth(e), kl = smooth(clamp(e / 0.45, 0, 1));
      var b = btns[i], l = labels[i];
      if (e === 0) {
        b.style.opacity = ''; b.style.transform = ''; b.style.pointerEvents = ''; l.style.opacity = '';
        continue;
      }
      b.style.opacity = (1 - k).toFixed(3);
      b.style.transform = reduce ? '' : 'scale(' + (1 - 0.1 * k).toFixed(4) + ')';
      b.style.pointerEvents = e > 0.6 ? 'none' : '';
      l.style.opacity = (1 - kl).toFixed(3);
    }
  }
  function clearFade() {
    fadeE = [];
    btns.forEach(function (b) { b.style.opacity = ''; b.style.transform = ''; b.style.pointerEvents = ''; });
    labels.forEach(function (l) { l.style.opacity = ''; });
  }

  on(window, 'scroll', function () { update(false); }, { passive: true });
  on(window, 'resize', measure);
  if (mqMobile.addEventListener) on(mqMobile, 'change', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  measure();


  // ===================================================================
  //  2. MÀN CHI TIẾT
  // ===================================================================
  var bg = detail.querySelector('[data-bg]');
  var full = detail.querySelector('[data-full]');
  var edge = detail.querySelector('[data-edge]');
  var panel = detail.querySelector('[data-panel]');
  var head = detail.querySelector('[data-head]');
  var headTitle = head.querySelector('[data-head-title]');
  var headDeco = [].slice.call(head.querySelectorAll('[data-head-deco]'));
  var win = detail.querySelector('[data-win]');
  var winImg = win.querySelector('img');
  var caption = detail.querySelector('[data-caption]');
  var capShade = caption.querySelector('[data-cap-shade]');
  var capParts = [].slice.call(caption.querySelectorAll('[data-cap]'));
  var capLine = caption.querySelector('[data-cap-line]');
  var closeBtn = detail.querySelector('[data-close]');
  var live = detail.querySelector('[data-live]');

  var ESLIDE = 'cubic-bezier(0.77, 0, 0.175, 1)';
  var EOUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

  var G = null;               // hình học theo viewport hiện tại
  var T = 0, K = 0;           // chủ đề / ảnh đang xem
  var slide = null;           // lớp ảnh toàn màn hình hiện tại
  var busy = false, openedFrom = -1, returnFocus = null;
  var anims = [], capAnims = [];

  function play(el, frames, opts, bucket) {
    var a = el.animate(frames, opts);
    (bucket || anims).push(a);
    return a;
  }
  function done(a) { return a ? a.finished.then(noop, noop) : Promise.resolve(); }
  function cancelAll(list) { list.forEach(function (a) { try { a.cancel(); } catch (e) { /* bỏ qua */ } }); list.length = 0; }

  // ---------- Hình học ----------
  function geo() {
    var W = window.innerWidth, H = window.innerHeight;
    var mob = mqMobile.matches || W < 1024;
    var g = { W: W, H: H, mob: mob };
    var s, ox, oy;
    if (!mob) { s = Math.min(W / 1440, H / 900); ox = (W - 1440 * s) / 2; oy = (H - 900 * s) / 2; }
    else { s = Math.min(W / 390, H / 844); ox = (W - 390 * s) / 2; oy = (H - 844 * s) / 2; }
    function R(x, y, w) { return { x: ox + x * s, y: oy + y * s, w: w * s }; }
    function P(x, y) { return { x: ox + x * s, y: oy + y * s }; }
    g.s = s;
    if (!mob) {
      // Toạ độ lấy từ storyboard Figma (khung 1440 × 900)
      g.headW = 553 * s;
      g.head1 = P(444, 357); g.head2 = P(444, 66); g.headA = P(444, 332);
      g.win1 = R(474.74, 569, 492.55); g.win2 = R(418, 220, 606.04); g.win3 = R(327.9, 109, 786);
      g.rise1 = R(418, 577, 606.04);
      g.exit = [R(163.14, -215, 1116), R(263.59, 24, 915), R(354.04, 239, 734), R(484.48, 514, 473)];
    } else {
      g.headW = Math.min(W - 40, 553 * s);
      var hx = (W - g.headW) / 2;
      g.head1 = { x: hx, y: oy + 380 * s }; g.head2 = { x: hx, y: oy + 110 * s }; g.headA = { x: hx, y: oy + 330 * s };
      g.win1 = R(75, 540, 240); g.win2 = R(35, 250, 320); g.win3 = R(-20, 150, 430);
      g.rise1 = R(35, 600, 320);
      g.exit = [R(-110, -60, 610), R(-20, 170, 430), R(55, 400, 280), R(105, 620, 180)];
    }
    g.rise0 = { x: g.rise1.x, y: H + 24, w: g.rise1.w };
    var last = g.exit[g.exit.length - 1];
    g.exit.push({ x: last.x, y: H + 24, w: last.w });
    var wh = Math.max(W / A, H * 1.2) + 2, ww = wh * A;   // vòm đủ lớn để phủ kín màn hình
    g.full = { x: (W - ww) / 2, y: -0.1616 * wh, w: ww };
    g.bw = g.win2.w; g.bh = g.bw / A;
    return g;
  }

  function applyGeo() {
    detail.style.setProperty('--s', G.mob ? 1 : G.s);
    head.style.width = G.headW + 'px';
    head.style.setProperty('--hs', (G.headW / 553).toFixed(4));
    win.style.width = G.bw + 'px';
    win.style.height = G.bh + 'px';
  }

  // ---------- Chuyển động liền mạch qua nhiều điểm mốc ----------
  // Mỗi chuỗi là MỘT đường cong: các điểm mốc (lấy từ storyboard) được nối bằng nội suy
  // bậc 3 đơn điệu (PCHIP) – vận tốc liên tục, không dừng ở điểm giữa, không vọt quá –
  // rồi cả chuỗi chạy theo một easing chung. Kết quả được lấy mẫu dày (~70 khung/giây)
  // thành keyframe cho Web Animations, nên vẫn chạy trên compositor.
  function bezier(x1, y1, x2, y2) {
    function bx(t) { return 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t; }
    function by(t) { return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t; }
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 32; i++) { t = (lo + hi) / 2; if (bx(t) < x) lo = t; else hi = t; }
      return by(t);
    };
  }
  function endSlope(h0, h1, d0, d1) {
    var m = ((2 * h0 + h1) * d0 - h0 * d1) / (h0 + h1);
    if (m * d0 <= 0) return 0;
    if (d0 * d1 <= 0 && Math.abs(m) > Math.abs(3 * d0)) return 3 * d0;
    return m;
  }
  function pchip(us, vs) {
    var n = us.length, h = [], d = [], m = [], i;
    for (i = 0; i < n - 1; i++) { h[i] = us[i + 1] - us[i]; d[i] = (vs[i + 1] - vs[i]) / h[i]; }
    if (n === 2) { m[0] = m[1] = d[0]; }
    else {
      for (i = 1; i < n - 1; i++) {
        if (d[i - 1] * d[i] <= 0) m[i] = 0;
        else {
          var w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
          m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
        }
      }
      m[0] = endSlope(h[0], h[1], d[0], d[1]);
      m[n - 1] = endSlope(h[n - 2], h[n - 3], d[n - 2], d[n - 3]);
    }
    return function (u) {
      if (u <= us[0]) return vs[0];
      if (u >= us[n - 1]) return vs[n - 1];
      var k = 0;
      while (k < n - 2 && u > us[k + 1]) k++;
      var t = (u - us[k]) / h[k], t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * vs[k] + (t3 - 2 * t2 + t) * h[k] * m[k] +
        (-2 * t3 + 3 * t2) * vs[k + 1] + (t3 - t2) * h[k] * m[k + 1];
    };
  }
  // keys: [{ u, kênh1, kênh2, ... }] → hàm trả về giá trị mọi kênh tại tiến độ u
  function curve(keys) {
    var us = keys.map(function (k) { return k.u; });
    var names = Object.keys(keys[0]).filter(function (n) { return n !== 'u'; });
    var fns = {};
    names.forEach(function (n) { fns[n] = pchip(us, keys.map(function (k) { return k[n]; })); });
    return function (u) {
      var o = { u: u };
      names.forEach(function (n) { o[n] = fns[n](u); });
      return o;
    };
  }
  // Chạy nhiều phần tử theo cùng một track → luôn khớp nhau từng khung hình
  function run(tr, D, ease, parts) {
    var N = Math.max(30, Math.round(D / 14)), samples = [];
    for (var i = 0; i <= N; i++) { var x = i / N, smp = tr(ease(x)); smp.t = x; samples.push(smp); }
    var first = null;
    parts.forEach(function (p) {
      if (!p.el) return;
      var frames = samples.map(function (smp) { var f = p.frame(smp); f.offset = smp.t; return f; });
      var a = play(p.el, frames, { duration: D, fill: 'both' });
      if (!first) first = a;
    });
    return first;
  }
  function rk(r) { return { wx: r.x, wy: r.y, ww: r.w }; }
  function merge(a, b) { for (var k in b) a[k] = b[k]; return a; }
  // Cửa sổ vòm: chỉ dùng transform
  function winFrame(s) {
    return { transform: 'translate(' + s.wx.toFixed(2) + 'px,' + s.wy.toFixed(2) + 'px) scale(' + (s.ww / G.bw).toFixed(5) + ')' };
  }
  // Ảnh trong cửa sổ: m = 0 phủ khung vòm, m = 1 neo theo màn hình (mặt nạ), ở giữa thì pha trộn
  function imgFrame(s) {
    var k = s.ww / G.bw, m = clamp(s.m, 0, 1);
    var l = (-s.wx / k) * m, t = (-s.wy / k) * m;
    var w = G.bw + (G.W / k - G.bw) * m, h = G.bh + (G.H / k - G.bh) * m;
    return { left: l.toFixed(2) + 'px', top: t.toFixed(2) + 'px', width: w.toFixed(2) + 'px', height: h.toFixed(2) + 'px' };
  }
  // Khối tiêu đề: nằm trên ảnh lúc hai bên còn chồng nhau, rồi chui xuống dưới để vòm nở ra phủ lên
  function headFrame(zU, reverse) {
    return function (s) {
      var above = reverse ? s.u > zU : s.u < zU;
      return {
        transform: 'translate(' + s.hx.toFixed(2) + 'px,' + s.hy.toFixed(2) + 'px) scale(' + s.hk.toFixed(5) + ')',
        zIndex: above ? 7 : 4
      };
    };
  }
  function decoFrame(s) { return { opacity: clamp(s.deco, 0, 1).toFixed(3) }; }

  // ---------- Nội dung ----------
  function cur_img(t, k) { return TOPICS[t].images[k]; }
  function ready(img) { return img.decode ? img.decode().then(noop, noop) : Promise.resolve(); }
  function setWin(im) { winImg.src = im.src; winImg.alt = ''; return ready(winImg); }
  function setHead(t) { headTitle.textContent = TOPICS[t].name; }
  function makeSlide(im) {
    var s = document.createElement('div');
    s.className = 'sym-slide';
    var i = document.createElement('img');
    i.src = im.src;
    i.alt = im.alt;
    i.decoding = 'async';
    s.appendChild(i);
    return s;
  }
  function announce() {
    live.textContent = TOPICS[T].name + ' – ảnh ' + (K + 1) + ' trên ' + TOPICS[T].images.length;
  }
  function preload(t, k) {
    var list = [];
    TOPICS.forEach(function (tp) { tp.images.forEach(function (im) { list.push(im.src); }); });
    var start = 0;
    for (var a = 0; a < t; a++) start += TOPICS[a].images.length;
    start += k;
    // ưu tiên các ảnh kế tiếp
    list.slice(start).concat(list.slice(0, start)).forEach(function (src) { var i = new Image(); i.src = src; });
  }

  // ---------- Chữ trên ảnh ----------
  function captionIn() {
    cancelAll(capAnims);
    caption.style.opacity = '1';
    if (reduce || !canAnimate) return Promise.resolve();
    play(capShade, [{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: 'ease-out', fill: 'backwards' }, capAnims);
    capParts.forEach(function (el, i) {
      play(el, [
        { opacity: 0, transform: 'translateY(22px)', filter: 'blur(6px)' },
        { opacity: 1, transform: 'none', filter: 'blur(0px)' }
      ], { duration: 900, delay: 120 + i * 110, easing: EOUT, fill: 'backwards' }, capAnims);
    });
    var l = play(capLine, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: 1100, delay: 420, easing: EOUT, fill: 'backwards' }, capAnims);
    return done(l);
  }
  function captionOut() {
    if (caption.style.opacity !== '1') return Promise.resolve();
    if (reduce || !canAnimate) { caption.style.opacity = '0'; return Promise.resolve(); }
    var a = play(caption, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'forwards' }, capAnims);
    return done(a).then(function () { caption.style.opacity = '0'; cancelAll(capAnims); });
  }

  // ---------- Chốt trạng thái: ảnh đã phủ kín màn hình ----------
  function commit(t, k) {
    var s = makeSlide(cur_img(t, k));
    return ready(s.firstChild).then(function () {
      full.appendChild(s);
      [].slice.call(full.children).forEach(function (c) { if (c !== s) full.removeChild(c); });
      slide = s;
      return settleCommit(t, k);
    });
  }
  function settleCommit(t, k) {
    bg.style.opacity = '1';
    win.style.visibility = 'hidden';
    head.style.visibility = 'hidden';
    panel.style.visibility = 'hidden';
    cancelAll(anims);
    T = t; K = k;
    announce();
    captionIn();          // không chờ chữ hiện xong – người xem có thể cuộn tiếp ngay
  }

  // ---------- Mở: từ 1 cục trên dải ----------
  // Chữ và hình tách nhau: chữ bay lên giữa rồi lên trên, hình hạ xuống – vòng lên – nở toàn màn hình.
  function entryKeys(C, HC, kc) {
    return [
      merge(rk(C), { u: 0, m: 0, hx: HC.x, hy: HC.y, hk: kc, deco: 0 }),
      merge(rk(G.win1), { u: 0.3, m: 0, hx: G.head1.x, hy: G.head1.y, hk: 1, deco: 1 }),
      merge(rk(G.win2), { u: 0.56, m: 0, hx: G.head2.x, hy: G.head2.y, hk: 1, deco: 1 }),
      merge(rk(G.win3), { u: 0.77, m: 0.45, hx: G.head2.x, hy: G.head2.y, hk: 1, deco: 1 }),
      merge(rk(G.full), { u: 1, m: 1, hx: G.head2.x, hy: G.head2.y, hk: 1, deco: 1 })
    ];
  }
  function cardRects(i) {
    var card = cards[i];
    var mr = card.querySelector('[data-card-media]').getBoundingClientRect();
    var lr = card.querySelector('[data-card-label]').getBoundingClientRect();
    return { C: { x: mr.left, y: mr.top, w: mr.width }, HC: { x: lr.left, y: lr.top }, kc: lr.width / G.headW };
  }

  function enterFromCard(i) {
    var r = cardRects(i);
    var D = 2600;
    setHead(i);
    openedFrom = i;
    return setWin(cur_img(i, 0)).then(function () {
      cards[i].classList.add('is-lifted');
      win.style.visibility = 'visible';
      head.style.visibility = 'visible';
      play(bg, [{ opacity: 0 }, { opacity: 1 }], { duration: 800, easing: 'ease-out', fill: 'forwards' });
      var tr = curve(entryKeys(r.C, r.HC, r.kc));
      var parts = [
        { el: win, frame: winFrame },
        { el: winImg, frame: imgFrame },
        { el: head, frame: headFrame(0.6, false) }
      ].concat(headDeco.map(function (el) { return { el: el, frame: decoFrame }; }));
      return done(run(tr, D, bezier(0.45, 0, 0.25, 1), parts));
    }).then(function () { return commit(i, 0); });
  }

  // ---------- Sang chủ đề khác: màn đỏ trượt vào, vòm mọc lên rồi nở ra (một mạch) ----------
  function arrive(t, k, dir, fromStrip) {
    var D = 2900;
    return captionOut().then(function () {
      setHead(t);
      return setWin(cur_img(t, k));
    }).then(function () {
      var W = G.W, lift = G.mob ? 16 : 14 * G.s;
      var oldImg = slide ? slide.firstChild : null;
      head.style.visibility = 'visible';
      panel.style.visibility = 'visible';
      win.style.visibility = 'visible';
      headDeco.forEach(function (el) { el.style.opacity = ''; });
      if (fromStrip) bg.style.opacity = '0';
      function key(u, px, eo, ox, r, m, hx, hy) {
        return merge(rk(r), { u: u, px: px, eo: eo, ox: ox, m: m, hx: hx, hy: hy, hk: 1 });
      }
      var A0 = G.headA, H2 = G.head2;
      var tr = curve([
        key(0, dir * W, 1, 0, G.rise0, 0, A0.x + dir * W, A0.y),
        key(0.3, dir * W * 0.05, 1, -5.7 * dir, G.rise0, 0, A0.x + dir * W * 0.05, A0.y),
        key(0.44, 0, 0, -6 * dir, G.rise1, 0, A0.x, A0.y - lift),
        key(0.65, 0, 0, -6 * dir, G.win2, 0, H2.x, H2.y),
        key(0.83, 0, 0, -6 * dir, G.win3, 0.45, H2.x, H2.y),
        key(1, 0, 0, -6 * dir, G.full, 1, H2.x, H2.y)
      ]);
      var parts = [
        { el: panel, frame: function (s) { return { transform: 'translateX(' + s.px.toFixed(2) + 'px)' }; } },
        { el: edge, frame: function (s) {
          return { transform: 'translateX(' + (dir > 0 ? s.px : W + s.px).toFixed(2) + 'px)', opacity: clamp(s.eo, 0, 1).toFixed(3) };
        } },
        { el: oldImg, frame: function (s) {
          return { transform: 'translateX(' + s.ox.toFixed(3) + '%)', filter: 'brightness(' + (1 - 0.45 * Math.abs(s.ox) / 6).toFixed(3) + ')' };
        } },
        { el: win, frame: winFrame },
        { el: winImg, frame: imgFrame },
        { el: head, frame: headFrame(0.67, false) }
      ];
      return done(run(tr, D, bezier(0.55, 0, 0.3, 1), parts));
    }).then(function () { return commit(t, k); });
  }

  // ---------- Đổi ảnh trong cùng chủ đề: phủ lớp mới + parallax ----------
  function slideTo(k, dir) {
    var old = slide;
    var neu = makeSlide(cur_img(T, k));
    var D = 1050;
    return ready(neu.firstChild).then(function () {
      full.appendChild(neu);
      slide = neu;
      var a = play(neu, [{ clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
        { duration: D, easing: ESLIDE });
      neu.firstChild.animate([{ transform: 'translateX(' + 5 * dir + '%) scale(1.05)' }, { transform: 'none' }],
        { duration: D + 300, easing: EOUT });
      if (old) {
        play(old.firstChild, [{ transform: 'none', filter: 'brightness(1)' }, { transform: 'translateX(' + (-5 * dir) + '%)', filter: 'brightness(0.55)' }],
          { duration: D, easing: ESLIDE, fill: 'forwards' });
      }
      play(edge, [
        { transform: 'translateX(' + (dir > 0 ? G.W : 0) + 'px)', opacity: 1 },
        { opacity: 1, offset: 0.85 },
        { transform: 'translateX(' + (dir > 0 ? 0 : G.W) + 'px)', opacity: 0 }
      ], { duration: D, easing: ESLIDE });
      return done(a);
    }).then(function () {
      if (old && old.parentNode) old.parentNode.removeChild(old);
      cancelAll(anims);
      K = k;
      announce();
    });
  }

  // ---------- Thoát: ảnh thu về hình vòm, rơi xuống (một mạch, nhanh dần như rơi) ----------
  function exitDown(toEnd) {
    var D = 1700;
    return captionOut().then(function () { return setWin(cur_img(T, K)); }).then(function () {
      win.style.visibility = 'visible';
      var us = [0, 0.2, 0.42, 0.63, 0.82, 1];
      var rects = [G.full].concat(G.exit);
      var tr = curve(rects.map(function (r, i) { return merge(rk(r), { u: us[i], m: 1 }); }));
      run(tr, D, bezier(0.42, 0, 0.72, 0.62), [
        { el: win, frame: winFrame },
        { el: winImg, frame: imgFrame }
      ]);
      full.innerHTML = '';
      slide = null;
      // màn đỏ bắt đầu tan khi vòm sắp rơi khỏi màn hình – nối liền, không có khoảng chờ
      return new Promise(function (res) { timers.push(window.setTimeout(res, D * 0.72)); });
    }).then(function () { return finish(toEnd, true); });
  }

  // ---------- Quay về đúng cục ban đầu (ngược lại lúc mở, một mạch) ----------
  function closeToCard() {
    var D = 2200;
    return captionOut().then(function () { return setWin(cur_img(T, K)); }).then(function () {
      var r = cardRects(T);
      setHead(T);
      win.style.visibility = 'visible';
      head.style.visibility = 'visible';
      var keys = entryKeys(r.C, r.HC, r.kc).reverse().map(function (k) { k.u = 1 - k.u; return k; });
      var tr = curve(keys);
      var parts = [
        { el: win, frame: winFrame },
        { el: winImg, frame: imgFrame },
        { el: head, frame: headFrame(0.4, true) }
      ].concat(headDeco.map(function (el) { return { el: el, frame: decoFrame }; }));
      var w = run(tr, D, bezier(0.55, 0, 0.3, 1), parts);
      play(bg, [{ opacity: 1 }, { opacity: 1, offset: 0.62 }, { opacity: 0 }], { duration: D, easing: 'ease-in-out', fill: 'forwards' });
      full.innerHTML = '';
      slide = null;
      return done(w);
    }).then(function () { return finish(false, false); });
  }

  // ---------- Đóng màn chi tiết, trả lại trang ----------
  function finish(toEnd, fadeBg) {
    if (toEnd && pinned) {
      var top = root.getBoundingClientRect().top + window.scrollY;
      if (LN()) LN().scrollTo(top + travel, { immediate: true, force: true });
      else window.scrollTo({ top: top + travel, left: 0, behavior: 'instant' });
      cur = target = -travel;
      paint();
      stage.classList.add('is-end');
    }
    stage.classList.toggle('is-return', fadeBg);
    var p = fadeBg && canAnimate && !reduce
      ? done(play(bg, [{ opacity: 1 }, { opacity: 0 }], { duration: 700, easing: 'ease-out', fill: 'forwards' }))
      : Promise.resolve();
    return p.then(function () {
      cancelAll(anims);
      cancelAll(capAnims);
      detail.hidden = true;
      bg.style.opacity = '0';
      caption.style.opacity = '0';
      full.innerHTML = '';
      slide = null;
      [win, head, panel].forEach(function (el) { el.style.visibility = 'hidden'; });
      cards.forEach(function (c) { c.classList.remove('is-lifted'); });
      document.documentElement.classList.remove('sym-lock');
      if (LN()) LN().start();
      isOpen = false;
      busy = false;
      openedFrom = -1;
      update(true);
      if (returnFocus && returnFocus.focus) { try { returnFocus.focus({ preventScroll: true }); } catch (e) { /* bỏ qua */ } }
      timers.push(window.setTimeout(function () { stage.classList.remove('is-return'); }, 1800));
    });
  }

  // ---------- Bản giản lược (giảm chuyển động / trình duyệt cũ) ----------
  function showStatic(t, k) {
    var s = makeSlide(cur_img(t, k));
    return ready(s.firstChild).then(function () {
      full.innerHTML = '';
      full.appendChild(s);
      slide = s;
      bg.style.opacity = '1';
      T = t; K = k;
      announce();
      captionIn();
    });
  }

  // ===================================================================
  //  3. ĐIỀU HƯỚNG
  // ===================================================================
  function cardVisible(i) {
    if (pinned && fadeE[i] > 0.3) return false;   // cục đang tan: không "nhấc" từ cục mờ
    var r = cards[i].getBoundingClientRect();
    return r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight;
  }

  function open(i, via) {
    if (isOpen) return;
    isOpen = true;
    busy = true;
    returnFocus = document.activeElement;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    G = geo();
    applyGeo();
    document.documentElement.classList.add('sym-lock');
    if (LN()) LN().stop();   // màn chi tiết tự xử lý con lăn
    detail.hidden = false;
    detail.focus({ preventScroll: true });
    preload(i, 0);
    var run;
    if (reduce || !canAnimate) run = showStatic(i, 0);
    else if (via === 'card' && cardVisible(i)) run = enterFromCard(i);
    else run = arrive(i, 0, 1, true);
    run.then(settle, fail);
  }

  function go(dir) {
    if (!isOpen || busy) return;
    busy = true;
    G = geo();
    applyGeo();
    var tp = TOPICS[T], run;
    if (dir > 0) {
      if (K + 1 < tp.images.length) run = (reduce || !canAnimate) ? showStatic(T, K + 1) : slideTo(K + 1, 1);
      else if (T + 1 < TOPICS.length) run = (reduce || !canAnimate) ? showStatic(T + 1, 0) : arrive(T + 1, 0, 1, false);
      else run = (reduce || !canAnimate) ? finish(true, false) : exitDown(true);
    } else {
      if (K > 0) run = (reduce || !canAnimate) ? showStatic(T, K - 1) : slideTo(K - 1, -1);
      else if (T > 0) {
        var pk2 = TOPICS[T - 1].images.length - 1;
        run = (reduce || !canAnimate) ? showStatic(T - 1, pk2) : arrive(T - 1, pk2, -1, false);
      } else run = close();
    }
    run.then(settle, fail);
  }

  function close() {
    if (reduce || !canAnimate) return finish(false, false);
    if (openedFrom === T && cardVisible(T)) return closeToCard();
    return exitDown(false);
  }

  var needQuiet = false, lastWheel = 0, pendingClose = false;
  function fail(e) { if (window.console) console.error('[sym]', e); settle(); }
  function settle() {
    busy = false;
    needQuiet = true;
    if (pendingClose && isOpen) {
      pendingClose = false;
      busy = true;
      close().then(settle, fail);
    }
    pendingClose = false;
  }

  // Cuộn chuột / trackpad: mỗi cú vuốt = 1 bước, bỏ qua phần quán tính còn lại
  detail.addEventListener('wheel', function (e) {
    e.preventDefault();
    var now = performance.now(), gap = now - lastWheel;
    lastWheel = now;
    if (busy) return;
    if (needQuiet && gap < 220) return;
    needQuiet = false;
    var d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(d) < 3) return;
    go(d > 0 ? 1 : -1);
  }, { passive: false });

  // Vuốt cảm ứng
  var tx = 0, ty = 0, touching = false;
  detail.addEventListener('touchstart', function (e) {
    var p = e.touches[0];
    tx = p.clientX; ty = p.clientY; touching = true;
  }, { passive: true });
  detail.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
  detail.addEventListener('touchend', function (e) {
    if (!touching) return;
    touching = false;
    var p = e.changedTouches[0];
    var dx = p.clientX - tx, dy = p.clientY - ty;
    var d = Math.abs(dy) > Math.abs(dx) ? -dy : -dx;
    if (Math.abs(d) < 40) return;
    go(d > 0 ? 1 : -1);
  }, { passive: true });

  // Bàn phím
  on(document, 'keydown', function (e) {
    if (!isOpen) return;
    var k = e.key;
    if (k === 'Escape') { e.preventDefault(); requestClose(); return; }
    if (k === 'Tab') { e.preventDefault(); (document.activeElement === closeBtn ? detail : closeBtn).focus({ preventScroll: true }); return; }
    if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && e.target !== closeBtn)) { e.preventDefault(); go(1); }
    else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(-1); }
  });

  function requestClose() {
    if (!isOpen) return;
    if (busy) { pendingClose = true; return; }   // đóng ngay khi hiệu ứng đang chạy kết thúc
    busy = true;
    close().then(settle, fail);
  }
  closeBtn.addEventListener('click', requestClose);

  cards.forEach(function (card, i) {
    card.querySelector('button').addEventListener('click', function () { if (opts.isCanvas) return; cursorHide(true); open(i, 'card'); });
  });

  // ===================================================================
  //  4. CON TRỎ "KHÁM PHÁ THÊM" khi rê chuột lên các cục (chỉ máy có chuột)
  //  - Huy hiệu tròn đỏ viền vàng bám theo chuột, trôi nhẹ phía sau (làm mượt kiểu quickTo),
  //    nở ra khi vào cục, thu lại khi rời cục; con trỏ gốc ẩn trên cục.
  //  - Cuộn trang (dải chạy ngang) mà chuột đứng yên vẫn nhận đúng cục đang nằm dưới chuột.
  //  - Bàn phím / cảm ứng không bị ảnh hưởng (nút vẫn bấm được, viền focus giữ nguyên).
  // ===================================================================
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var cur3 = null, cx = 0, cy = 0, tx3 = 0, ty3 = 0, craf = 0, cOn = false, cSeen = false;
  function cursorBuild() {
    if (cur3) return;
    cur3 = document.createElement('div');
    cur3.className = 'sym-cursor';
    cur3.setAttribute('aria-hidden', 'true');
    cur3.innerHTML = '<span class="sym-cursor__in"><svg class="sym-cursor__star" viewBox="0 0 34 17"><use href="#sgf-sym-star"/></svg>' +
      '<span class="sym-cursor__text">' + esc(opts.cursorLabel).replace(/\n/g, '<br>') + '</span></span>';
    portal.appendChild(cur3);
    root.classList.add('has-cursor');
  }
  function cursorPlace() {
    cur3.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
  }
  function cursorTick() {
    craf = 0;
    var dx = tx3 - cx, dy = ty3 - cy;
    if (reduce || Math.abs(dx) + Math.abs(dy) < 0.3) { cx = tx3; cy = ty3; }
    else if (!dead) { cx += dx * 0.22; cy += dy * 0.22; craf = requestAnimationFrame(cursorTick); }
    cursorPlace();
  }
  function overCard(x, y) {
    var el = document.elementFromPoint(x, y);
    return !!(el && el.closest && root.contains(el) && el.closest('.sym-card__btn'));
  }
  function cursorShow() {
    if (cOn || isOpen) return;
    cOn = true;
    if (!cSeen) { cx = tx3; cy = ty3; cursorPlace(); cSeen = true; }   // lần đầu: xuất hiện ngay tại chuột
    cur3.classList.add('is-on');
  }
  function cursorHide(instant) {
    if (!cur3) return;
    cOn = false;
    cur3.classList.toggle('is-instant', !!instant);
    cur3.classList.remove('is-on');
    if (instant) { void cur3.offsetWidth; cur3.classList.remove('is-instant'); }
  }
  function cursorUpdate() {
    if (overCard(tx3, ty3)) cursorShow(); else cursorHide(false);
  }
  if (opts.cursor && !opts.isCanvas && finePointer.matches && !mqMobile.matches) {
    cursorBuild();
    on(document, 'pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      tx3 = e.clientX; ty3 = e.clientY;
      if (!cSeen && !overCard(tx3, ty3)) return;
      if (!craf) craf = requestAnimationFrame(cursorTick);
      cursorUpdate();
    }, { passive: true });
    on(document, 'pointerdown', function (e) {
      if (cOn && e.pointerType === 'mouse') { cur3.classList.add('is-press'); }
    }, { passive: true });
    on(document, 'pointerup', function () { if (cur3) cur3.classList.remove('is-press'); }, { passive: true });
    on(document.documentElement, 'mouseleave', function () { cursorHide(false); });
    // dải chạy ngang khi cuộn mà chuột đứng yên → kiểm tra lại cục dưới chuột
    on(window, 'scroll', function () { if (cSeen && !isOpen) cursorUpdate(); }, { passive: true });
  }

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  return function cleanup() {
    dead = true;
    if (raf) cancelAnimationFrame(raf);
    if (craf) cancelAnimationFrame(craf);
    timers.forEach(function (t) { clearTimeout(t); });
    cancelAll(anims);
    cancelAll(capAnims);
    offs.forEach(function (f) { f(); });
    if (ro) ro.disconnect();
    root.style.height = '';
    if (isOpen) {
      document.documentElement.classList.remove('sym-lock');
      if (LN()) LN().start();
    }
  };
}


/**
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 900
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function SunGroupSymphony(props: any) {
    const {
        titleA = "Viết nên",
        titleGold = "bản giao hưởng",
        titleB = "cho mỗi vùng đất",
        description = DEFAULT_DESC,
        topics = DEFAULT_TOPICS,
        cursor = true,
        cursorLabel = "Khám phá\nthêm",
        closeLabel = "Đóng, quay lại danh sách",
        drumSeconds = 60,
        assetBase = "https://sgtest.vercel.app/assets/",
        fontFamily = "CDA Independence",
        fontUrl = "https://sgtest.vercel.app/assets/fonts/CDAIndependenceText-VF.woff2",
        fontFile = "",
        style,
    } = props

    const uid = useId().replace(/[^a-zA-Z0-9]/g, "")
    const A = withSlash(assetBase)
    const list = Array.isArray(topics) ? topics : []
    // mỗi chủ đề: tên + 1–3 ảnh; 5 chủ đề đầu có ảnh mặc định nếu chưa chọn ảnh
    const items = list.map((t: any, i: number) => {
        const def = DEFAULT_TOPICS[i] || {}
        const slug = DEFAULT_SLUGS[i]
        const name = (t && t.name) || def.name || `Chủ đề ${i + 1}`
        const imgs = [
            { src: pickImage(t && t.image1, slug ? `${A}img/sym/${slug}-1.webp` : ""), alt: (t && t.alt1) ?? def.alt1 ?? name },
            { src: pickImage(t && t.image2, slug ? `${A}img/sym/${slug}-2.webp` : ""), alt: (t && t.alt2) ?? def.alt2 ?? name },
            { src: pickImage(t && t.image3, ""), alt: (t && t.alt3) ?? name },
        ].filter((im) => !!im.src)
        return { name, images: imgs, src: imgs.length ? imgs[0].src : "" }
    }).filter((t: any) => t.images.length > 0)

    const data = { titleA, titleGold, titleB, description, closeLabel, topics: items }
    const key = JSON.stringify(data)
    const markup = useMemo(() => buildMarkup(data, uid), [key, uid])
    const hostRef = useRef<HTMLDivElement>(null)
    const fontVar = `"${String(fontFamily).replace(/"/g, "")}", ${FONT_STACK}`
    const spin = drumSeconds > 0 ? `${drumSeconds}s` : "0s"

    useEffect(() => {
        const host = hostRef.current
        if (!host || typeof document === "undefined" || !items.length) return
        const isCanvas = isCanvasNow()
        // màn chi tiết + con trỏ: gắn vào <body> (trên canvas thì không gắn – chỉ xem tĩnh)
        const portal = document.createElement("div")
        portal.className = ROOT
        portal.setAttribute("data-sgf-portal", "")
        portal.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;overflow:visible;z-index:2147483000;background:transparent;"
        portal.style.setProperty("--font", fontVar)
        portal.innerHTML = buildDetail(data)
        if (!isCanvas) document.body.appendChild(portal)
        let cleanup = () => {}
        try {
            cleanup = initSymphony(host, portal, {
                topics: items.map((t: any) => ({ name: t.name, images: t.images })),
                isCanvas,
                cursor: !!cursor,
                cursorLabel: cursorLabel || "",
            })
        } catch (e) {
            console.error("[SunGroupSymphony]", e)
        }
        return () => {
            cleanup()
            if (portal.parentNode) portal.parentNode.removeChild(portal)
        }
    }, [key, uid, cursor, cursorLabel, fontVar])

    const rootStyle: any = {
        ...style,
        position: "relative",
        "--font": fontVar,
        "--spin-drum": spin,
    }
    return (
        <div ref={hostRef} className={ROOT + (drumSeconds > 0 ? "" : " sg-nodrum")} style={rootStyle}>
            <style>{fontFaceCss(fontFamily, fontFile || fontUrl) + CSS + EXTRA_CSS}</style>
            <div key={key} dangerouslySetInnerHTML={{ __html: markup }} />
        </div>
    )
}

SunGroupSymphony.displayName = "Sun Group – Bản giao hưởng"

addPropertyControls(SunGroupSymphony, {
    titleA: { type: ControlType.String, title: "Tiêu đề dòng 1", defaultValue: "Viết nên" },
    titleGold: { type: ControlType.String, title: "Tiêu đề vàng", defaultValue: "bản giao hưởng" },
    titleB: { type: ControlType.String, title: "Tiêu đề dòng 3", defaultValue: "cho mỗi vùng đất" },
    description: { type: ControlType.String, title: "Mô tả", displayTextArea: true, defaultValue: DEFAULT_DESC },
    topics: {
        type: ControlType.Array,
        title: "Chủ đề (cục)",
        maxCount: 8,
        description: "Mỗi chủ đề 1–3 ảnh, ảnh 1 là ảnh trên cục. 5 chủ đề đầu có ảnh mặc định nếu để trống.",
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Tên" },
                image1: { type: ControlType.ResponsiveImage, title: "Ảnh 1" },
                alt1: { type: ControlType.String, title: "Mô tả ảnh 1" },
                image2: { type: ControlType.ResponsiveImage, title: "Ảnh 2" },
                alt2: { type: ControlType.String, title: "Mô tả ảnh 2" },
                image3: { type: ControlType.ResponsiveImage, title: "Ảnh 3" },
                alt3: { type: ControlType.String, title: "Mô tả ảnh 3" },
            },
        },
        defaultValue: DEFAULT_TOPICS,
    },
    cursor: { type: ControlType.Boolean, title: "Con trỏ khám phá", defaultValue: true, enabledTitle: "Bật", disabledTitle: "Tắt" },
    cursorLabel: { type: ControlType.String, title: "Chữ con trỏ", defaultValue: "Khám phá\nthêm", displayTextArea: true, hidden: (p: any) => !p.cursor },
    closeLabel: { type: ControlType.String, title: "Mô tả nút đóng", defaultValue: "Đóng, quay lại danh sách" },
    drumSeconds: { type: ControlType.Number, title: "Trống xoay (giây/vòng)", min: 0, max: 300, step: 5, defaultValue: 60, unit: "s", description: "0 = đứng yên" },
    assetBase: { type: ControlType.String, title: "Thư mục ảnh", defaultValue: "https://sgtest.vercel.app/assets/", description: "Nơi chứa ảnh mặc định img/sym/*.webp." },
    fontFamily: { type: ControlType.String, title: "Tên font", defaultValue: "CDA Independence" },
    fontFile: { type: ControlType.File, title: "File font (woff2)", allowedFileTypes: ["woff2"], description: "Tải file .woff2 lên đây (Framer tự lưu trữ) – ưu tiên hơn link bên dưới." },
    fontUrl: { type: ControlType.String, title: "Link font (woff2)", defaultValue: "https://sgtest.vercel.app/assets/fonts/CDAIndependenceText-VF.woff2", description: "Dùng khi chưa tải file font. Để trống cả 2 nếu font đã cài sẵn trong Framer." },
})
