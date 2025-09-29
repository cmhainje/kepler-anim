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
  let plotR    = $derived(plotPhi.map((phi) => ell.r(phi)));
  let plotVr   = $derived(plotPhi.map((phi) => ell.rDot(phi)));
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

  function defaultSetting() {
    mass1 = 0.5;
    ecc = 0.7;
  }

  function moonSetting() {
    mass1 = 0.01215;
    ecc = 0.0554;
  }

  function jupiterSetting() {
    mass1 = 0.000954;
    ecc = 0.0484;
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
    <details class="inputs" open>
      <summary>controls</summary>
      <div class="slider">
        <input
          type="range"
          id="period"
          name="period"
          min="0.5"
          max="5"
          step="0.1"
          bind:value={period}
        />
        <label for="period">duration = {period} seconds</label>
      </div>
      <div class="slider">
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
      </div>
      {#if numbody === "twobody"}
        <div class="slider">
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
        </div>
        <div class="slider">
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
        <div class="buttons">
          <button type="button" onclick={defaultSetting}>defaults   </button>
          <button type="button" onclick={moonSetting}   >Moon+Earth </button>
          <button type="button" onclick={jupiterSetting}>Jupiter+Sun</button>
        </div>
      {/if}
    </details>
    <div class="slider">
      <button
        type="button"
        class="playpause"
        onclick={() => {
          if (!playing) {
            startPlaying();
          } else {
            stopPlaying();
          }
        }}>{playing ? "pause" : "play"}</button
      >
      <label for="time">time = <span class="time">{Math.round(time * 1000) / 1000}</span></label>
      <input
        type="range"
        id="time"
        name="time"
        min="0"
        max="1"
        step="0.001"
        bind:value={time}
      />
    </div>
  </div>

  {#if numbody === "onebody"}
    <div class="plotarea">
      <div class="orbit">
        <div class="orbit-square">
          <Orbit {ecc} {phi}></Orbit>
        </div>
      </div>
      <div class="lines">
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
    </div>
  {:else}
    <div class="plotarea">
      <div class="orbit">
        <div class="orbit-square">
          <TwoBodyOrbit {ecc} {phi} m1={mass1} m2={mass2}></TwoBodyOrbit>
        </div>
      </div>
      <div class="lines">
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

  .inputs {
    border: 1px solid #aaa;
    border-radius: 6px;
    margin-bottom: 0.5em; 
    padding: 0.5em 1em ;

    display: flex;
    flex-direction: column;
    width: 30ch;
  }

  .inputs[open] {
    padding: 0.5em 1em;
  }

  .inputs summary {
    user-select: none;
    font-weight: 600;
  }

  .inputs[open] summary {
    border-bottom: 1px solid #aaa;
    margin-left: -1em;
    margin-right: -1em;
    padding-left: 1em;
    padding-bottom: 0.5em;
    margin-bottom: 0.5em;
  }

  .inputs input {
    color: #888;
  }

  div.plotarea {
    max-width: 750px;
    gap: 1px;
    background-color: #888;
    border: 1px solid #888;
    margin: 20px;
    display: flex;
    flex-direction: row;
  }

  div.lines {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  @media (max-width: 640px) {
    .inputs {
      grid-template-columns: 1fr;
    }

    div.plotarea {
      flex-direction: column;
    }

    div.lines {
      flex-direction: row;
      overflow-x: auto;
    }
  }

  div.orbit {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 0px;
    background-color: white;

    flex-shrink: 0;
    flex-grow: 1;
  }

  div.orbit-square {
    width: 100%;
    aspect-ratio: 1 / 1;
  }

  div.line {
    background-color: white;
  }

  span.time {
    display: inline-block;
    width: 4ch;
  }

  div.slider {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
  }

  div.buttons {
    margin: 0.25em 0;
  }

  button.playpause {
    width: 8ch;
  }

</style>
