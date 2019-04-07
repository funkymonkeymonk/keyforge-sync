require("dotenv").config();
import { Deck } from "./deck";
const MasterVault = require("./master-vault");

// temporary for rapid debugging
const dok = true;
const crucible = true;
const dryRun = false;

import { read } from "./credentials";
const creds = read("creds.dat");

MasterVault.getMyDecks(creds.mv).then((mvDecks: Deck[]) => {
  if (dok) {
    const DoK = require("./dok");
    DoK.sync(creds.dok, mvDecks, dryRun);
  }

  if (crucible) {
    const Crucible = require("./crucible");
    Crucible.sync(creds.crucible, mvDecks, dryRun);
  }
});
