const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  // Desktop test
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  console.log('Step 1: Opening page...');
  await page.goto('http://localhost:3000?name=H%C3%B9ng', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/q0-intro.png', fullPage: false });
  console.log('Screenshot q0-intro.png taken');

  console.log('Step 2: Clicking "Mở thiệp"...');
  // Find and click the button
  const btn = await page.locator('button').filter({ hasText: /Mở thiệp/i }).first();
  if (await btn.count() > 0) {
    await btn.click();
    console.log('Button clicked');
  } else {
    // Try any button or clickable element
    const allButtons = await page.locator('button').all();
    console.log(`Found ${allButtons.length} buttons`);
    for (const b of allButtons) {
      const text = await b.textContent();
      console.log('Button text:', text);
    }
    // Click first button anyway
    if (allButtons.length > 0) {
      await allButtons[0].click();
      console.log('Clicked first button');
    }
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/q1-hero.png', fullPage: false });
  console.log('Screenshot q1-hero.png taken');

  // Scroll steps
  const scrollSteps = [
    { y: 1000, file: '/tmp/q2.png' },
    { y: 2000, file: '/tmp/q3.png' },
    { y: 3000, file: '/tmp/q4.png' },
    { y: 4000, file: '/tmp/q5.png' },
    { y: 5000, file: '/tmp/q6.png' },
    { y: 6000, file: '/tmp/q7.png' },
    { y: 7000, file: '/tmp/q8.png' },
  ];

  for (const step of scrollSteps) {
    console.log(`Scrolling to Y=${step.y}...`);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'smooth' }), step.y);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: step.file, fullPage: false });
    console.log(`Screenshot ${step.file} taken`);
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(1000);

  // Count elements
  const scrollAppearCount = await page.locator('.scroll-appear').count();
  console.log(`Total .scroll-appear elements: ${scrollAppearCount}`);

  // Count motion elements (framer motion adds style with transform)
  const motionCount = await page.evaluate(() => {
    const allDivs = document.querySelectorAll('div[style]');
    let count = 0;
    allDivs.forEach(div => {
      if (div.style.transform || div.style.opacity !== '') count++;
    });
    return count;
  });
  console.log(`Motion elements (divs with transform/opacity styles): ${motionCount}`);

  // Page title and sections info
  const pageInfo = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    const h1s = document.querySelectorAll('h1');
    const h2s = document.querySelectorAll('h2');
    return {
      sectionsCount: sections.length,
      h1s: Array.from(h1s).map(h => h.textContent?.trim().substring(0, 50)),
      h2s: Array.from(h2s).map(h => h.textContent?.trim().substring(0, 50)),
      bodyHeight: document.body.scrollHeight,
    };
  });
  console.log('Page info:', JSON.stringify(pageInfo, null, 2));

  // Mobile test
  await context.close();
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const mobilePage = await mobileContext.newPage();
  console.log('Mobile: Opening page...');
  await mobilePage.goto('http://localhost:3000?name=H%C3%B9ng', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);
  
  // Click button on mobile too to see the invitation
  const mobileBtn = await mobilePage.locator('button').filter({ hasText: /Mở thiệp/i }).first();
  if (await mobileBtn.count() > 0) {
    await mobileBtn.click();
    await mobilePage.waitForTimeout(1500);
  }
  
  await mobilePage.screenshot({ path: '/tmp/q-mobile.png', fullPage: false });
  console.log('Screenshot q-mobile.png taken');

  await mobileContext.close();
  await browser.close();
  console.log('Done!');
}

run().catch(console.error);
