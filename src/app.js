require("dotenv").config();
const MasterVault = require("./master-vault");

// temporary for rapid debugging
const dok = true;
const crucible = true;
const dryRun = false;

MasterVault.getMyDecks()
  .then(mvDecks => {
    if (dok) {
      const DoK = require("./dok");
      DoK.sync(mvDecks, dryRun);
    }

    if (crucible) {
      const Crucible = require("./crucible");
      Crucible.sync(mvDecks, dryRun);
    }
  })
  .catch(err => {
    console.log("Error connecting to Master Vault");
    console.log(err.message);
  });
