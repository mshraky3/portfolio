import { Engine, Money, Screen, Search, Vault } from "./sqb";
import { Face, Hand, Physician, Protocol, Webcam } from "./neurolink";

// `cy` is the height of the visual's centre above its tray: where the camera looks.
export const VISUALS = {
  vault: { Component: Vault, cy: 0.85 },
  engine: { Component: Engine, cy: 0.85 },
  money: { Component: Money, cy: 0.8 },
  search: { Component: Search, cy: 0.35 },
  screen: { Component: Screen, cy: 1.5 },
  webcam: { Component: Webcam, cy: 0.9 },
  hand: { Component: Hand, cy: 1.0 },
  face: { Component: Face, cy: 1.1 },
  protocol: { Component: Protocol, cy: 0.7 },
  physician: { Component: Physician, cy: 1.0 },
};
