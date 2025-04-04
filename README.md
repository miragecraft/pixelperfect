# PixelPerfect

Preserve pixel alignment when zooming/resizing the webpage.

## How

Monitor devicePixelRatio changes, adjusting CSS variable values so the rendered size rounds to the nearest integer.

## Usage

```js
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
```
[More information](https://miragecraft.com/projects/pixelperfect)
