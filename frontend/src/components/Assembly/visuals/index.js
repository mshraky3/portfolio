import { Engine, Money, Screen, Search, Vault } from "./sqb";
import { Face, Hand, Physician, Protocol, Webcam } from "./neurolink";
import { Blueprint, Gate, Pulse, Sorter, Wireframe } from "./general";
import { Expiry, Globe, Payroll, Reports } from "./hr";
import { Quota, Sources, Suppress, Tests } from "./email";

// `cy` is the height of the visual's centre above its tray: where the camera looks.
export const VISUALS = {
  // how any system gets built (the hero)
  blueprint: { Component: Blueprint, cy: 0.6 },
  vault: { Component: Vault, cy: 0.85 },
  sorter: { Component: Sorter, cy: 0.8 },
  gate: { Component: Gate, cy: 0.85 },
  wireframe: { Component: Wireframe, cy: 1.15 },
  pulse: { Component: Pulse, cy: 0.8 },
  // SQB
  engine: { Component: Engine, cy: 0.85 },
  money: { Component: Money, cy: 0.8 },
  search: { Component: Search, cy: 0.35 },
  screen: { Component: Screen, cy: 1.5 },
  // HR
  globe: { Component: Globe, cy: 2.7 },
  expiry: { Component: Expiry, cy: 0.8 },
  payroll: { Component: Payroll, cy: 1.1 },
  reports: { Component: Reports, cy: 0.55 },
  // NeuroLink
  webcam: { Component: Webcam, cy: 0.9 },
  hand: { Component: Hand, cy: 1.0 },
  face: { Component: Face, cy: 1.1 },
  protocol: { Component: Protocol, cy: 0.7 },
  physician: { Component: Physician, cy: 1.0 },
  // Email gateway
  sources: { Component: Sources, cy: 0.8 },
  quota: { Component: Quota, cy: 0.95 },
  suppress: { Component: Suppress, cy: 0.9 },
  tests: { Component: Tests, cy: 1.2 },
};
