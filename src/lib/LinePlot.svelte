<script>
  import * as d3 from "d3";

  let {
    data,
    width = 150,
    height = 150,
    marginTop = 20,
    marginRight = 15,
    marginBottom = 20,
    marginLeft = 35,
    xlabel = "",
    ylabel = "",
    xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    yTicks = undefined,
    xMarker = undefined,
    yMarker = undefined,
  } = $props();

  let x = $derived(
    d3.scaleLinear(
      [Math.min(...xTicks), Math.max(...xTicks)],
      [marginLeft, width - marginRight]
    )
  );
  let y = $derived(
    d3.scaleLinear(
      !!yTicks
        ? [Math.min(...yTicks), Math.max(...yTicks)]
        : d3.extent(data, (d) => d[1]).map((v) => Number.parseFloat(v)),
      [height - marginBottom, marginTop]
    )
  );
  let line = $derived(
    d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))
  );

  let gx;
  let gy;
  $effect(() => {
    d3.select(gx).call(d3.axisBottom(x).tickValues(xTicks));
    if (!!yTicks) {
      if (yTicks.filter((x) => x === Math.PI).length > 0) {
        d3.select(gy).call(
          d3
            .axisLeft(y)
            .tickSizeOuter(0)
            .tickValues(yTicks)
            .tickFormat((x, i) => {
              return ["0", "π/2", "π", "3π/2", "2π"][i];
            })
        );
      } else {
        d3.select(gy).call(d3.axisLeft(y).tickValues(yTicks).tickSizeOuter(0));
      }
    } else {
      d3.select(gy).call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));
    }
  });
</script>

<svg {width} {height}>
  <g
    bind:this={gx}
    transform="translate(0, {height - marginBottom})"
    opacity="0.6"
  />
  <text x={marginLeft} y={marginTop - 5} class="label">{ylabel}</text>
  <g bind:this={gy} transform="translate({marginLeft}, 0)" opacity="0.6" />
  <text x={width - marginRight + 5} y={height - marginBottom} class="label"
    >{xlabel}</text
  >
  <path fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} />

  {#if !!xMarker && !!yMarker}
    <circle cx={x(xMarker)} cy={y(yMarker)} r="5" />
  {/if}
</svg>

<style>
  circle {
    fill: rgb(110, 135, 177);
    stroke: none;
  }
  text.label {
    opacity: 0.6;
    font-size: 12px;
  }
</style>
