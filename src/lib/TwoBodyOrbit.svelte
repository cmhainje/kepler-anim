<script>
  let {
    ecc,
    phi = 0,
    m1 = 0.5,
    m2 = 0.5,
  } = $props();

  const width = 100, height = 100;

  // ellipse
  let cx = $derived(0.5 * width);
  let cy = $derived(0.5 * height);

  let a = 0.275 * width;
  let b = $derived(a * Math.sqrt(1 - ecc ** 2));

  let a1 = $derived(a * m2);
  let a2 = $derived(a * m1);
  let b1 = $derived(b * m2);
  let b2 = $derived(b * m1);

  let r = $derived((a * (1 - ecc ** 2)) / (1 + ecc * Math.cos(phi)));
  let r1 = $derived(-r * m2);
  let r2 = $derived(+r * m1);

  let x1 = $derived(r1 * Math.cos(phi));
  let y1 = $derived(r1 * Math.sin(phi));
  let px1 = $derived(cx + x1);
  let py1 = $derived(cy - y1);

  let x2 = $derived(r2 * Math.cos(phi));
  let y2 = $derived(r2 * Math.sin(phi));
  let px2 = $derived(cx + x2);
  let py2 = $derived(cy - y2);

  let fx1 = $derived(cx + 2 * a1 * ecc);
  let fx2 = $derived(cx - 2 * a2 * ecc);
</script>

<svg width="100%" height="100%">
  <g class="Focus">
    <line x1="{cx-0.3}%" y1="{cy-0.3}%" x2="{cx+0.3}%" y2="{cy+0.3}%"></line>
    <line x1="{cx-0.3}%" y1="{cy+0.3}%" x2="{cx+0.3}%" y2="{cy-0.3}%"></line>
  </g>
  <g class="Focus">
    <line x1="{fx1-0.3}%" y1="{cy-0.3}%" x2="{fx1+0.3}%" y2="{cy+0.3}%"></line>
    <line x1="{fx1-0.3}%" y1="{cy+0.3}%" x2="{fx1+0.3}%" y2="{cy-0.3}%"></line>
  </g>
  <g class="Focus">
    <line x1="{fx2-0.3}%" y1="{cy-0.3}%" x2="{fx2+0.3}%" y2="{cy+0.3}%"></line>
    <line x1="{fx2-0.3}%" y1="{cy+0.3}%" x2="{fx2+0.3}%" y2="{cy-0.3}%"></line>
  </g>
  <ellipse cx="{cx + a1 * ecc}%" cy="{cy}%" rx="{a1}%" ry="{b1}%"></ellipse>
  <ellipse cx="{cx - a2 * ecc}%" cy="{cy}%" rx="{a2}%" ry="{b2}%"></ellipse>
  <circle class="Planet" cx="{px1}%" cy="{py1}%" r="2%"></circle>
  <circle class="Planet" cx="{px2}%" cy="{py2}%" r="2%"></circle>
  <text class="Planet" x="{px1}%" y="{py1}%" font-size="12">1</text>
  <text class="Planet" x="{px2}%" y="{py2}%" font-size="12">2</text>
</svg>

<style>
  ellipse {
    stroke: #888;
    fill: none;
  }
  /* circle.Sun {
    fill: orange;
    stroke: none;
  } */
  circle.Planet {
    fill: rgb(110, 135, 177);
    stroke: none;
  }
  text.Planet {
    text-anchor: middle;
    dominant-baseline: central;
    fill: white;
    font-weight: 700;
  }
  g.Focus {
    stroke: black;
    fill: none;
  }
</style>
