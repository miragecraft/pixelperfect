/*  PixelPerfect v1.1
    http://www.miragecraft.com
    Licensed under MIT Open Source

Preserve pixel alignment when zooming/resizing the webpage.

How
===

Monitor devicePixelRatio changes, adjusting CSS variable values so the rendered size rounds to the nearest integer.

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
  pixelPerfect('--height', {target: '#target'}); // by selector
  pixelPerfect('--height', {target: document.querySelector('#target')}); // by element
*/

function pixelPerfect(props, options = {}) {
  if (typeof props === 'string') props = [props];

  // Default options
  let {
    target = document.documentElement,
    autoStart = true,
  } = options;

  if (typeof target === 'string') {
    target = document.querySelector(target);
  }

  if (!target) {
    throw new Error('pixelPerfect: Invalid target element.');
  }

  let mediaQuery = null;

  const reset = () => {
    props.forEach(prop => target.style.removeProperty(prop));
  };

  const update = () => {
    reset();

    const ratio = window.devicePixelRatio;
    const computed = getComputedStyle(target);

    props.forEach(prop => {
      const raw = computed.getPropertyValue(prop);
      const val = parseFloat(raw);

      if (!Number.isInteger(val)) {
        throw new Error(`pixelPerfect: The value for "${prop}" must be an integer (got "${raw}").`);
      }
 
      const adjusted = Math.round(val * ratio) / ratio;
      target.style.setProperty(prop, `${adjusted}px`);
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

  if (autoStart) start();

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