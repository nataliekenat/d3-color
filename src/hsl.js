import color from "./color";
import {default as rgb, Rgb, brighter, darker} from "./rgb";

export function Hsl(h, s, l) {
  this.h = (h %= 360) < 0 ? h + 360 : h;
  this.s = Math.max(0, Math.min(1, +s));
  this.l = Math.max(0, Math.min(1, +l));
};

function hsl(h, s, l) {
  if (arguments.length === 1) {
    if (h instanceof hsl) {
      l = h.l;
      s = h.s;
      h = h.h;
    } else {
      if (!(h instanceof rgb)) h = rgb(h);
      var r = h.r / 255,
          g = h.g / 255,
          b = h.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          d = max - min;
      l = (max + min) / 2;
      if (d) {
        s = l < .5 ? d / (max + min) : d / (2 - max - min);
        if (r == max) h = (g - b) / d + (g < b ? 6 : 0);
        else if (g == max) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
      } else {
        h = NaN;
        s = l > 0 && l < 1 ? 0 : h;
      }
    }
  }
  return new Hsl(h, s, l);
}

var prototype = Hsl.prototype = hsl.prototype = Object.create(color.prototype);

prototype.brighter = function(k) {
  k = k == null ? brighter : Math.pow(brighter, k);
  return new Hsl(this.h, this.s, this.l * k);
};

prototype.darker = function(k) {
  k = k == null ? darker : Math.pow(darker, k);
  return new Hsl(this.h, this.s, this.l * k);
};

prototype.rgb = function() {
  var h = isNaN(this.h) ? 0 : this.h,
      s = isNaN(this.s) ? 0 : this.s,
      l = this.l,
      m2 = l <= .5 ? l * (1 + s) : l + s - l * s,
      m1 = 2 * l - m2;
  return new Rgb(
    hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
    hsl2rgb(h, m1, m2),
    hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2)
  );
};

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

export default hsl;
