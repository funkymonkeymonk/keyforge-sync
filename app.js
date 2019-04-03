require("dotenv").config();
const MasterVault = require("./master-vault");

const delta = (source, destination) => {
  console.log(
    `${source.length} decks in source -> ${
      destination.length
    } decks in destination`
  );
  return source.filter(deck => !destination.map(d => d.id).includes(deck.id));
};

// temporary for rapid debugging
const dok = true;
const crucible = true;

MasterVault.getMyDecks()
  .then(mvDecks => {
    if (dok) {
      const DoK = require("./dok");
      const email = process.env.DOK_EMAIL;
      const password = process.env.DOK_PASSWORD;
      const username = process.env.DOK_USERNAME;

      DoK.login(email, password)
        .then(token => {
          DoK.getMyDecks(username, token)
            .then(dokDecks => delta(mvDecks, dokDecks))
            .then(decks => DoK.importDecks(token, decks))
            .catch(err => {
              console.log("Error syncing Decks Of Keyforge");
              console.log(err.message);
            });
        })
        .catch(err => {
          console.log("Error connecting to Decks Of Keyforge");
          console.log(err.message);
        });
    }

    if (crucible) {
      const Crucible = require("./crucible");
      const username = process.env.CRUCIBLE_USERNAME;
      const password = process.env.CRUCIBLE_PASSWORD;

      Crucible.login(username, password)
        .then(token => {
          Crucible.getMyDecks(token)
            .then(crucibleDecks => delta(mvDecks, crucibleDecks))
            .then(decks => Crucible.importDecks(token, decks))
            .catch(err => {
              console.log("Error syncing Crucible");
              console.log(err.message);
            });
        })
        .catch(err => {
          console.log("Error connecting to Crucible");
          console.log(err.message);
        });
    }
  })
  .catch(err => {
    console.log("Error connecting to Master Vault");
    console.log(err.message);
  });
