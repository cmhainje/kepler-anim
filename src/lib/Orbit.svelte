<script>
  let { ecc, phi = 0 } = $props();

  const width = 100, height = 100;

  // ellipse
  let cx = $derived(0.5 * width);
  let cy = $derived(0.5 * height);
  let a = 0.425 * width;
  let b = $derived(a * Math.sqrt(1 - ecc ** 2));

  // Sun position
  let fx = $derived(cx + a * ecc);
  let fy = $derived(cy);

  // Planet
  let r = $derived((a * (1 - ecc ** 2)) / (1 + ecc * Math.cos(phi)));
  let x = $derived(a * ecc + r * Math.cos(phi));
  let y = $derived(r * Math.sin(phi));
  let px = $derived(cx + x);
  let py = $derived(cy - y);
</script>

<svg width="100%" height="100%">
  <ellipse cx="{cx}%" cy="{cy}%" rx="{a}%" ry="{b}%"></ellipse>
  <circle class="Sun" cx="{fx}%" cy="{fy}%" r="3%"></circle>
  <circle class="Planet" cx="{px}%" cy="{py}%" r="1%"></circle>
</svg>

<style>
  ellipse {
    stroke: #888;
    fill: none;
  }
  circle.Sun {
    fill: orange;
    stroke: none;
  }
  circle.Planet {
    fill: rgb(110, 135, 177);
    stroke: none;
  }
</style>
