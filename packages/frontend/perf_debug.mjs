import { chromium } from 'playwright';

(async () => {
  console.log('Starting performance diagnostic...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideo: { dir: '/tmp/video' },
  });
  const page = await context.newPage();
  
  // Listen for console messages
  page.on('console', msg => console.log('[PAGE LOG]', msg.text()));
  
  // Measure load time
  const startTime = Date.now();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const loadTime = Date.now() - startTime;
  
  console.log(`\n=== INITIAL LOAD ===`);
  console.log(`Page load time: ${loadTime}ms`);
  
  // Get performance metrics
  const metrics = await page.evaluate(() => {
    const perf = performance.getEntriesByType('navigation')[0];
    const layout = performance.getEntriesByType('layout');
    const style = performance.getEntriesByType('style');
    
    return {
      navigationTiming: {
        domInteractive: perf.domInteractive.toFixed(0),
        domComplete: perf.domComplete.toFixed(0),
        loadEventEnd: perf.loadEventEnd.toFixed(0),
      },
      layoutCount: layout.length,
      styleCount: style.length,
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
    eventListenerCount: (getEventListeners ? Object.keys(getEventListeners(window)).length : 'N/A'),
  }));
  
  console.log(`\n=== DOM ANALYSIS ===`);
  console.log(`Total elements: ${domInfo.elementCount}`);
  console.log(`iframes: ${domInfo.iframeCount}`);
  
  // Measure resource sizes
  const resources = await page.evaluate(() => {
    return performance.getEntriesByType('resource')
      .filter(r => r.transferSize > 100000) // Only large resources
      .sort((a, b) => b.transferSize - a.transferSize)
      .slice(0, 10)
      .map(r => ({
        name: r.name.split('/').pop() || r.name.split('/')[r.name.split('/').length - 2],
        transferSize: (r.transferSize / 1024 / 1024).toFixed(2) + 'MB',
        decodedSize: (r.decodedBodySize / 1024 / 1024).toFixed(2) + 'MB',
        duration: r.duration.toFixed(0) + 'ms',
      }));
  });
  
  console.log(`\n=== TOP 10 LARGEST RESOURCES ===`);
  resources.forEach((r, i) => {
    console.log(`${i + 1}. ${r.name} - Transfer: ${r.transferSize}, Decoded: ${r.decodedSize}, Duration: ${r.duration}`);
  });
  
  // Now test resize performance with DevTools
  console.log(`\n=== RESIZE PERFORMANCE TEST ===`);
  
  // Start timing
  const resizeStartTime = Date.now();
  
  // Simulate multiple resizes
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => {
      window.dispatchEvent(new Event('resize'));
    });
    await page.waitForTimeout(500);
  }
  
  const resizeDuration = Date.now() - resizeStartTime;
  console.log(`Time for 3 resize events: ${resizeDuration}ms (avg: ${(resizeDuration / 3).toFixed(0)}ms per resize)`);
  
  // Check for expensive listeners
  const listeners = await page.evaluate(() => {
    // Try to detect commonly expensive operations
    const scripts = Array.from(document.querySelectorAll('script'));
    return {
      scriptCount: scripts.length,
      inlineScriptCount: scripts.filter(s => !s.src).length,
      externalScriptCount: scripts.filter(s => s.src).length,
    };
  });
  
  console.log(`\n=== SCRIPT ANALYSIS ===`);
  console.log(JSON.stringify(listeners, null, 2));
  
  // Check for potential performance issues
  const perfIssues = await page.evaluate(() => {
    const issues = [];
    
    // Check for synchronous XHR
    const originalFetch = window.fetch;
    
    // Check for large DOM mutations
    const allElements = document.querySelectorAll('*');
    const largeContainers = Array.from(allElements)
      .filter(el => {
        const children = el.querySelectorAll(':scope > *').length;
        return children > 100;
      })
      .slice(0, 5)
      .map(el => ({
        tag: el.tagName,
        childCount: el.querySelectorAll(':scope > *').length,
        className: el.className,
      }));
    
    if (largeContainers.length > 0) {
      issues.push({ type: 'Large DOM Containers', details: largeContainers });
    }
    
    return issues;
  });
  
  if (perfIssues.length > 0) {
    console.log(`\n=== POTENTIAL PERFORMANCE ISSUES ===`);
    console.log(JSON.stringify(perfIssues, null, 2));
  }
  
  // Get a heap snapshot indication
  console.log(`\n=== DEVTOOLS SIMULATION ===`);
  console.log('Opening DevTools and taking screenshots...');
  
  // Take a screenshot with DevTools visible
  await page.keyboard.press('F12');
  await page.waitForTimeout(2000);
  
  // Try to take screenshot
  try {
    await page.screenshot({ path: '/tmp/screenshot_with_devtools.png', fullPage: true });
    console.log('Screenshot saved to /tmp/screenshot_with_devtools.png');
  } catch (e) {
    console.log('Could not take screenshot with DevTools');
  }
  
  await browser.close();
  console.log('\n=== DIAGNOSTIC COMPLETE ===');
})().catch(console.error);
