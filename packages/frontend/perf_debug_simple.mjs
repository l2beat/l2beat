import { chromium } from 'playwright';

(async () => {
  console.log('Starting performance diagnostic...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console messages
  page.on('console', msg => console.log('[PAGE LOG]', msg.type().toUpperCase(), msg.text()));
  
  // Measure load time
  const startTime = Date.now();
  const response = await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  const loadTime = Date.now() - startTime;
  
  console.log(`\n=== INITIAL LOAD ===`);
  console.log(`Page load time: ${loadTime}ms`);
  console.log(`Status: ${response?.status()}`);
  
  // Get performance metrics
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    if (!nav) return { error: 'No navigation entry' };
    
    return {
      navigationTiming: {
        domInteractive: nav.domInteractive.toFixed(0),
        domComplete: nav.domComplete.toFixed(0),
        loadEventEnd: nav.loadEventEnd.toFixed(0),
      },
      memoryInfo: performance.memory ? {
        usedJSHeapSize: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
        jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + 'MB',
      } : null,
    };
  });
  
  console.log(JSON.stringify(metrics, null, 2));
  
  // Count DOM nodes
  const domInfo = await page.evaluate(() => ({
    elementCount: document.querySelectorAll('*').length,
    iframeCount: document.querySelectorAll('iframe').length,
    scriptCount: document.querySelectorAll('script').length,
  }));
  
  console.log(`\n=== DOM ANALYSIS ===`);
  console.log(`Total elements: ${domInfo.elementCount}`);
  console.log(`iframes: ${domInfo.iframeCount}`);
  console.log(`scripts: ${domInfo.scriptCount}`);
  
  // Measure resource sizes
  const resources = await page.evaluate(() => {
    return performance.getEntriesByType('resource')
      .filter(r => r.transferSize > 50000)
      .sort((a, b) => b.transferSize - a.transferSize)
      .slice(0, 10)
      .map(r => ({
        name: r.name.split('/').pop() || r.name.split('/').slice(-2).join('/'),
        transferSize: (r.transferSize / 1024).toFixed(0) + 'KB',
        decodedSize: (r.decodedBodySize / 1024).toFixed(0) + 'KB',
        duration: r.duration.toFixed(0) + 'ms',
      }));
  });
  
  console.log(`\n=== TOP 10 LARGEST RESOURCES ===`);
  resources.forEach((r, i) => {
    console.log(`${i + 1}. ${r.name}`);
    console.log(`   Transfer: ${r.transferSize}, Decoded: ${r.decodedSize}, Duration: ${r.duration}`);
  });
  
  // Get rendering metrics
  const paintEntries = await page.evaluate(() => {
    return performance.getEntriesByType('paint');
  });
  
  console.log(`\n=== PAINT TIMING ===`);
  paintEntries.forEach(entry => {
    console.log(`${entry.name}: ${entry.startTime.toFixed(0)}ms`);
  });
  
  // Check for large DOM subtrees
  const largeContainers = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const large = Array.from(allElements)
      .filter(el => {
        const children = el.querySelectorAll(':scope > *').length;
        return children > 500;
      })
      .map(el => ({
        tag: el.tagName,
        childCount: el.querySelectorAll(':scope > *').length,
        className: el.className.substring(0, 100),
      }));
    
    return large.slice(0, 5);
  });
  
  if (largeContainers.length > 0) {
    console.log(`\n=== LARGE DOM CONTAINERS ===`);
    largeContainers.forEach((container, i) => {
      console.log(`${i + 1}. <${container.tag} class="${container.className}"> (${container.childCount} children)`);
    });
  }
  
  // Test actual DevTools opening behavior
  console.log(`\n=== TESTING DEVTOOLS IMPACT ===`);
  
  // Measure before DevTools
  const beforeDevToolsTime = Date.now();
  
  // Open DevTools
  await page.keyboard.press('F12');
  await page.waitForTimeout(3000);
  
  // Try some interactions
  await page.evaluate(() => {
    window.resizeCounter = 0;
    window.addEventListener('resize', () => {
      window.resizeCounter++;
    });
    window.dispatchEvent(new Event('resize'));
  });
  
  const resizeCounter = await page.evaluate(() => window.resizeCounter);
  console.log(`Resize events fired: ${resizeCounter}`);
  
  const afterDevToolsTime = Date.now() - beforeDevToolsTime;
  console.log(`Time to open DevTools and dispatch resize: ${afterDevToolsTime}ms`);
  
  await browser.close();
  console.log('\n=== DIAGNOSTIC COMPLETE ===');
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
