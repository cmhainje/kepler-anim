<script>
  import { Elliptic } from "./lib/ellipticalOrbit";
  import LinePlot from "./lib/LinePlot.svelte";
  import Orbit from "./lib/Orbit.svelte";
  import TwoBodyOrbit from "./lib/TwoBodyOrbit.svelte";

  const FPS = 60;

  let ecc = $state(0.7);
  let time = $state(0);
  let numbody = $state("onebody");
  let period = $state(3);
  let mass1 = $state(0.5);
  let mass2 = $state(0.5);
  let playing = $state(false);

  let ell = $derived(new Elliptic(1, ecc));
  let phi = $derived(ell.phi(time));

  let numPlotPoints = 1000;
  let plotPhi = [
    ...Array(numPlotPoints)
      .keys()
      .map((x) => (x * 2 * Math.PI) / numPlotPoints),
  ];
  let plotTime = $derived(plotPhi.map((phi) => ell.t(phi)));
  let plotR = $derived(plotPhi.map((phi) => ell.r(phi)));
  let plotVr = $derived(plotPhi.map((phi) => ell.rDot(phi)));
  let plotVphi = $derived(plotPhi.map((phi) => ell.r(phi) * ell.phiDot(phi)));

  let playingTimer = null;

  function startPlaying() {
    playing = true;
    playingTimer = window.setInterval(() => {
      time = (time + 1 / (FPS * period)) % 1.0;
    }, 1000 / FPS);
  }

  function stopPlaying() {
    playing = false;
    window.clearInterval(playingTimer);
  }

  $effect(() => {
    mass1;
    mass2 = 1.0 - mass1;
  });
  $effect(() => {
    mass2;
    mass1 = 1.0 - mass2;
  });
</script>

<main>
  <div class="heading">
    <h1>
      <select name="numbody" id="numbody" bind:value={numbody}>
        <option value="onebody">one</option>
        <option value="twobody">two</option>
      </select>
      body problem
    </h1>
    <div class="inputs">
      <div class="onebody">
        <input
          type="range"
          id="eccentricity"
          name="eccentricity"
          min="0"
          max="0.99"
          step="0.01"
          bind:value={ecc}
        />
        <label for="eccentricity">eccentricity = {ecc}</label>
        <br />
        <input
          type="range"
          id="period"
          name="period"
          min="0.5"
          max="5"
          step="0.1"
          bind:value={period}
        />
        <label for="period">period = {period} seconds</label>
        <br />
        <input
          type="range"
          id="time"
          name="time"
          min="0"
          max="1"
          step="0.001"
          bind:value={time}
        />
        <label for="time">time = {Math.round(time * 1000) / 1000}</label>
        <br />
        <button
          type="button"
          onclick={() => {
            if (!playing) {
              startPlaying();
            } else {
              stopPlaying();
            }
          }}>{playing ? "pause" : "play"}</button
        >
      </div>
      {#if numbody === "twobody"}
        <div class="twobody">
          <input
            type="range"
            id="mass1"
            name="mass1"
            min="0.001"
            max="0.999"
            step="0.001"
            bind:value={mass1}
          />
          <label for="mass1">mass1 = {Math.round(mass1 * 1000) / 1000}</label>
          <br />
          <input
            type="range"
            id="mass2"
            name="mass2"
            min="0.001"
            max="0.999"
            step="0.001"
            bind:value={mass2}
          />
          <label for="mass2">mass2 = {Math.round(mass2 * 1000) / 1000}</label>
        </div>
      {/if}
    </div>
  </div>

  {#if numbody === "onebody"}
    <div class="plotarea">
      <div class="orbit">
        <Orbit {ecc} {phi}></Orbit>
      </div>
      <div class="line">
        <LinePlot
          data={plotTime.map((t, i) => [t, plotR[i]])}
          xlabel="t"
          ylabel="r/a"
          xMarker={time}
          yMarker={ell.r(phi)}
          yTicks={[0, 0.5, 1, 1.5, 2]}
        ></LinePlot>
      </div>
      <div class="line">
        <LinePlot
          data={plotTime.map((t, i) => [t, plotPhi[i]])}
          xlabel="t"
          ylabel="phi"
          xMarker={time}
          yMarker={phi}
          yTicks={[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI]}
        ></LinePlot>
      </div>
      <div class="line">
        <LinePlot
          data={plotTime.map((t, i) => [t, plotVr[i]])}
          xlabel="t"
          ylabel="v_r"
          xMarker={time}
          yMarker={ell.rDot(phi)}
        ></LinePlot>
      </div>
      <div class="line">
        <LinePlot
          data={plotTime.map((t, i) => [t, plotVphi[i]])}
          xlabel="t"
          ylabel="v_phi"
          xMarker={time}
          yMarker={ell.r(phi) * ell.phiDot(phi)}
        ></LinePlot>
      </div>
    </div>
  {:else}
    <div class="plotarea">
      <div class="orbit">
        <TwoBodyOrbit {ecc} {phi} m1={mass1} m2={mass2}></TwoBodyOrbit>
      </div>
      <div class="line">
        <LinePlot
          data={plotTime.map((t, i) => [t, plotR[i]])}
          xlabel="t"
          ylabel="r/a"
          xMarker={time}
          yMarker={ell.r(phi)}
          yTicks={[0, 0.5, 1, 1.5, 2]}
        ></LinePlot>
      </div>
      <div class="line">
        <LinePlot
          data={plotTime.map((t, i) => [t, plotPhi[i]])}
          xlabel="t"
          ylabel="phi"
          xMarker={time}
          yMarker={phi}
          yTicks={[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI]}
        ></LinePlot>
      </div>
      <div class="line">
        <LinePlot
          data={plotTime.map((t, i) => [t, mass2 * plotR[i]])}
          xlabel="t"
          ylabel="r1/a"
          xMarker={time}
          yMarker={mass2 * ell.r(phi)}
        ></LinePlot>
      </div>
      <div class="line">
        <LinePlot
          data={plotTime.map((t, i) => [t, mass1 * plotR[i]])}
          xlabel="t"
          ylabel="r2/a"
          xMarker={time}
          yMarker={mass1 * ell.r(phi)}
        ></LinePlot>
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
  }

  div.heading {
    margin: 20px;
  }

  h1 select {
    font: inherit;
  }

  div.inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  div.inputs input {
    color: #888;
  }

  div.plotarea {
    max-width: 750px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    row-gap: 1px;
    column-gap: 1px;
    background-color: #888;
    border: 1px solid #888;
    margin: 20px;
  }

  div.orbit {
    grid-column-start: 1;
    grid-column-end: 5;
    grid-row-start: 1;
    grid-row-end: 5;

    padding: 0px;
    background-color: white;
  }

  div.line {
    background-color: white;
  }
</style>
