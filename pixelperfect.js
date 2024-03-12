/*  PixelPerfect
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
match.recalc();
*/

function pixelPerfect(props, el=document.documentElement) {

  if (typeof props === 'string') props = [props];

  props = new Map(props.map((p)=>[p,getComputedStyle(el).getPropertyValue(p)]));

  let mql;

  matchMedia();

  function matchMedia() {

    let ratio = window.devicePixelRatio;

    props.forEach((val,prop)=>{
      el.style.setProperty(prop, Math.round(parseInt(val)*ratio)/ratio + 'px'); 
    })

    mql = window.matchMedia('not screen and (resolution: '+ratio+'dppx)');
    mql.addEventListener('change', matchMedia, {once:true});
  }

  return {
    stop: ()=>{
      mql.removeEventListener('change', matchMedia, {once:true});
    },
    restore: function () {
      this.stop;
      props.forEach((val,prop)=>{
        el.style.removeProperty(prop)
      })
    },
    recalc: function () {
      this.restore();
      matchMedia();    
    }
  }

}