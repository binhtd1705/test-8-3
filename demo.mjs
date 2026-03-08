/**
 * 🎬 Cinematic demo — YouTube-quality 1920×1080 recording
 * Chạy: node demo.mjs
 * Sau đó bắt đầu quay màn hình khi thấy đếm ngược 3-2-1
 */
import { chromium } from "playwright";
import { exec } from "child_process";

const URL = "http://localhost:3000";

const PAUSE = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Cubic ease-in-out scroll ───────────────────────────────────────────────
async function smoothScrollTo(page, targetY, durationMs = 2400) {
  const startY = await page.evaluate(() => window.scrollY);
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  const steps = 100;
  const interval = durationMs / steps;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    // Cubic ease-in-out
    const ease = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const y = Math.round(startY + distance * ease);
    await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: "instant" }), y);
    await PAUSE(interval);
  }
}

// Scroll đến một element theo selector
async function scrollToElement(page, selector, offset = 60, durationMs = 2400) {
  const y = await page.evaluate(
    ({ sel, off }) => {
      const el = document.querySelector(sel);
      if (!el) return -1;
      return Math.max(0, window.scrollY + el.getBoundingClientRect().top - off);
    },
    { sel: selector, off: offset }
  );
  if (y >= 0) await smoothScrollTo(page, y, durationMs);
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  console.log("🎬 Khởi động Chromium 1920×1080 (app mode)...");

  const browser = await chromium.launch({
    headless: false,
    args: [
      `--app=${URL}`,          // Chrome App mode: không có tab bar, address bar
      "--window-size=1920,1080",
      "--disable-infobars",
      "--no-default-browser-check",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  // Ẩn scrollbar + tắt selection highlight
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = `
      ::-webkit-scrollbar { display: none !important; width: 0 !important; }
      * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
      ::selection { background: transparent; }
    `;
    document.head?.appendChild(style);
  });

  console.log("🌐 Đang tải trang...");
  await page.goto(URL, { waitUntil: "networkidle" });

  // Inject scrollbar CSS sau khi trang load (backup)
  await page.addStyleTag({
    content: `::-webkit-scrollbar { display: none !important; } * { scrollbar-width: none !important; }`,
  });

  // Đưa cửa sổ lên foreground
  exec(
    `osascript -e 'tell application "System Events" to set frontmost of (first application process whose name contains "Chromium") to true' 2>/dev/null || true`
  );
  await PAUSE(800);
  exec(
    `osascript -e 'tell application "Google Chrome for Testing" to activate' 2>/dev/null || true`
  );

  // ── Đếm ngược để người dùng kịp bắt đầu quay ─────────────────────────
  console.log("\n🎥 Hãy bắt đầu quay màn hình ngay bây giờ!");
  console.log("   Demo tự động sẽ bắt đầu sau:\n");
  for (let i = 5; i >= 1; i--) {
    console.log(`   ⏱  ${i}...`);
    await PAUSE(1000);
  }
  console.log("   🎬 BẮT ĐẦU!\n");

  // ── 1. Intro card — để xem đẹp ────────────────────────────────────────
  console.log("💌 [1/10] Intro card...");
  await PAUSE(3000);

  // ── 2. Click "Mở thiệp" ───────────────────────────────────────────────
  console.log("💌 [2/10] Mở thiệp...");
  await page.click("button:has-text('Mở thiệp')");
  await PAUSE(3000); // Chờ AnimatePresence transition đẹp

  // ── 3. Hero section ───────────────────────────────────────────────────
  console.log("🌸 [3/10] Hero — 8/3...");
  await PAUSE(4000); // Hero animations: 8 / 3 + tên + ảnh fade in

  // ── 4. Ảnh hoa 3 cột ─────────────────────────────────────────────────
  console.log("🌺 [4/10] Những đóa hoa tươi thắm...");
  await smoothScrollTo(page, 1100, 2600);
  await PAUSE(3000);

  // ── 5. Lịch tháng 3 ──────────────────────────────────────────────────
  console.log("📅 [5/10] Lịch tháng 3...");
  await scrollToElement(page, "#calendar", 40, 2800);
  await PAUSE(3500);

  // ── 6. Lời chúc ──────────────────────────────────────────────────────
  console.log("💝 [6/10] Những lời chúc yêu thương...");
  await scrollToElement(page, "#wishes", 40, 2600);
  await PAUSE(3500);

  // ── 7. Tôn vinh phụ nữ ───────────────────────────────────────────────
  console.log("👑 [7/10] Người phụ nữ tuyệt vời...");
  await smoothScrollTo(page, await page.evaluate(() => {
    const el = document.querySelector("#wishes");
    return el ? window.scrollY + el.getBoundingClientRect().bottom + 80 : window.scrollY + 1200;
  }), 2600);
  await PAUSE(3200);

  // ── 8. Quote ─────────────────────────────────────────────────────────
  console.log("✨ [8/10] Quote...");
  await smoothScrollTo(page, await page.evaluate(() => {
    const el = document.querySelector(".paper-texture");
    return el ? Math.max(0, window.scrollY + el.getBoundingClientRect().top - 60) : window.scrollY + 1000;
  }), 2400);
  await PAUSE(3500);

  // ── 9. Album hoa ─────────────────────────────────────────────────────
  console.log("🎞️  [9/10] Album hoa...");
  await scrollToElement(page, "#album", 40, 2600);
  await PAUSE(4000); // Chờ film frame animation

  // ── 10. Countdown ────────────────────────────────────────────────────
  console.log("⏰ [10/10] Đếm ngược 8/3...");
  await scrollToElement(page, "#countdown", 40, 2400);
  await PAUSE(3000);

  // ── 11. Gửi lời chúc ─────────────────────────────────────────────────
  console.log("📝 [11/12] Gửi lời chúc...");
  await scrollToElement(page, "#guestbook", 40, 2600);
  await PAUSE(3500);

  // ── 12. Kết — Final screen ────────────────────────────────────────────
  console.log("🌸 [12/12] Màn hình kết...");
  await smoothScrollTo(page, 999999, 2800); // Scroll hết trang
  await PAUSE(5000); // Dừng lâu ở màn hình kết

  // ── Scroll ngược lại Hero ─────────────────────────────────────────────
  console.log("🔝 Scroll về Hero...");
  await smoothScrollTo(page, 0, 3500);
  await PAUSE(4000);

  // ── Giữ mở ───────────────────────────────────────────────────────────
  console.log("\n✅ Demo hoàn tất! Trình duyệt đang mở.");
  console.log("   Dừng quay màn hình, rồi nhấn Ctrl+C để đóng.\n");
  await PAUSE(999_999_999);

  await browser.close();
})();
