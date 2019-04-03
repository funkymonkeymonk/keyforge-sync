require("dotenv").config();
const MasterVault = require("./master-vault");
const delta = require("./utils").delta;

// temporary for rapid debugging
const dok = true;
const crucible = true;

MasterVault.getMyDecks()
  .then(mvDecks => {
    if (dok) {
      const DoK = require("./dok");
      DoK.sync(mvDecks);
    }

    if (crucible) {
      const Crucible = require("./crucible");
      Crucible.sync(mvDecks);
    }
  })
  .catch(err => {
    console.log("Error connecting to Master Vault");
    console.log(err.message);
  });
