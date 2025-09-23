import * as d3 from "d3";

export class Elliptic {
  constructor(a, e) {
    this.a = a;
    this.e = e;

    this.interpPhi = [
      ...Array(10001)
        .keys()
        .map((x) => (x * 2 * Math.PI) / 10000),
    ];
    this.interpTime = this.interpPhi.map((phi) => this.t(phi));
  }

  r(phi) {
    return (this.a * (1 - this.e ** 2)) / (1 + this.e * Math.cos(phi));
  }

  x(phi) {
    return this.a * this.e + this.r(phi) * Math.cos(phi);
  }

  y(phi) {
    return this.r(phi) * Math.sin(phi);
  }

  phiDot(phi) {
    return (
      (2 * Math.PI * (1 + this.e * Math.cos(phi)) ** 2) /
      Math.pow(1 - this.e ** 2, 1.5)
    );
  }

  rDot(phi) {
    if (this.e == 0) return 0;
    let r = this.r(phi);
    let phiDot = this.phiDot(phi);
    return (r * phiDot * this.e * Math.sin(phi)) / (1 + this.e * Math.cos(phi));
  }

  t(phi) {
    let term1 =
      2 *
      Math.atan(Math.sqrt((1 - this.e) / (1 + this.e)) * Math.tan(0.5 * phi));
    let term2 =
      (this.e * Math.sqrt(1 - this.e ** 2) * Math.sin(phi)) /
      (1 + this.e * Math.cos(phi));
    let t = (term1 - term2) / (2 * Math.PI);
    return t < 0 ? t + 1 : t;
  }

  phi(t) {
    let tIndex = d3.bisectLeft(this.interpTime, t);
    if (tIndex == this.interpTime.length - 1) {
      tIndex -= 1;
    }
    let tFrac =
      (t - this.interpTime[tIndex]) /
      (this.interpTime[tIndex + 1] - this.interpTime[tIndex]);
    return (
      (1 - tFrac) * this.interpPhi[tIndex] + tFrac * this.interpPhi[tIndex + 1]
    );
  }
}
