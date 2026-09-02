// Command demos registry

import adapt from "./adapt.js";
import animate from "./animate.js";
import audit from "./audit.js";
import bolder from "./bolder.js";
import clarify from "./clarify.js";
import colorize from "./colorize.js";
import critique from "./critique.js";
import delight from "./delight.js";
import distill from "./distill.js";
import harden from "./harden.js";
import layout from "./layout.js";
import optimize from "./optimize.js";
import overdrive from "./overdrive.js";
import polish from "./polish.js";
import quieter from "./quieter.js";
import typeset from "./typeset.js";

export const commandDemos = {
  bolder,
  animate,
  audit,
  critique,
  polish,
  optimize,
  harden,
  clarify,
  quieter,
  distill,
  colorize,
  delight,
  adapt,
  typeset,
  layout,
  overdrive,
};

export function getCommandDemo(commandId) {
  return commandDemos[commandId] || null;
}
