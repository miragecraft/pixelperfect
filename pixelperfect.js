/*  PixelPerfect v1.1
    http://www.miragecraft.com
    Licensed under MIT Open Source

Ensures pixel-perfect rendering of elements by adjusting CSS variable values
so the rendered size rounds to a whole integer based on devicePixelRatio.

Usage
=====

  // Force integer pixel value for --height on :root (auto-starts by default)
  pixelPerfect('--height');

  // Disable auto-start and control manually
  const match = pixelPerfect('--height', { autoStart: false });
  match.start();     // start listening and update immediately
  match.stop();      // stop listening
  match.update();    // force recalculation
  match.restore();   // reset property to original value

  // Use a specific element instead of :root
  pixelPerfect('--height', '#target'); // by selector
  pixelPerfect('--height', document.querySelector('#target')); // by element
*/

function pixelPerfect(props, el = document.documentElement, options = {}) {
  if (typeof props === 'string') props = [props];
  if (typeof el === 'string') el = document.querySelector(el);

  if (!el) {
    throw new Error('pixelPerfect: Invalid target element.');
  }

  let mediaQuery = null;

  const reset = () => {
    props.forEach(prop => el.style.removeProperty(prop));
  };

  const update = () => {
    reset();

    const ratio = window.devicePixelRatio;
    const computed = getComputedStyle(el);

    props.forEach(prop => {
      const raw = computed.getPropertyValue(prop);
      const val = parseFloat(raw);

      if (!Number.isInteger(val)) {
        throw new Error(`pixelPerfect: The value for "${prop}" must be an integer (got "${raw}").`);
      }
 
      const adjusted = Math.round(val * ratio) / ratio;
      el.style.setProperty(prop, `${adjusted}px`);
    });
  };

  const detach = () => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', refresh);
      mediaQuery = null;
    }
  };

  const attach = () => {
    const ratio = window.devicePixelRatio;
    mediaQuery = window.matchMedia(`not screen and (resolution: ${ratio}dppx)`);
    mediaQuery.addEventListener('change', refresh);
  };

  const refresh = () => {
    detach();
    update();
    attach();
  };

  const start = () => {
    update();
    attach();
  };

  // Auto-start unless disabled
  if (options.autoStart !== false) {
    start();
  }

  return {
    start,
    stop: detach,
    restore: () => {
      detach();
      reset();
    },
    update
  };
}