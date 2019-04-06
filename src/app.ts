require("dotenv").config();
import { Deck } from "./deck";
const MasterVault = require("./master-vault");

// temporary for rapid debugging
const dok = true;
const crucible = true;
const dryRun = false;

MasterVault.getMyDecks().then((mvDecks: Deck[]) => {
  if (dok) {
    const DoK = require("./dok");
    DoK.sync(mvDecks, dryRun);
  }

  if (crucible) {
    const Crucible = require("./crucible");
    Crucible.sync(mvDecks, dryRun);
  }
});
