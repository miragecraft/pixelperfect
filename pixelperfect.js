/*  PixelPerfect v1.1
    http://www.miragecraft.com
    Licensed under MIT Open Source

Designed for use with CSS variables.

Reference
=========
// force integer pixel for --height property in :root
pixelPerfect('--height'); 

// use #target element instead of :root
pixelPerfect('--height', document.querySelector('#target')); 

// save reference
var match = pixelPerfect('--height');

// stop updating values
match.stop();

// restore original values
match.restore();

// recalculate
match.update();
*/

function pixelPerfect(props, el = document.documentElement) {
  if (typeof props === 'string') props = [props];
  if (typeof el === 'string') el = document.querySelector(el);

  let mediaQuery = null;

  const reset = () => props.forEach(prop => el.style.removeProperty(prop));

  const update = () => {
    const ratio = window.devicePixelRatio;
    reset();
    const computed = getComputedStyle(el);
    props.forEach(prop => {
      const val = parseInt(computed.getPropertyValue(prop), 10);
      if (!isNaN(val)) {
        el.style.setProperty(prop, `${Math.round(val * ratio) / ratio}px`);
      } else {
        console.warn(`Warning: The value for property "${prop}" is not a valid number.`);
      }
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

  // On resolution change, update and rebind the listener.
  const refresh = () => {
    detach();
    update();
    attach();
  };

  // Initial update and listener attachment.
  update();
  attach();

  return {
    start: refresh,
    stop: detach,
    restore: () => {
      detach();
      reset();
    },
    update
  };
}