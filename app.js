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
      const dokEmail = process.env.DOK_EMAIL;
      const dokPassword = process.env.DOK_PASSWORD;
      const dokUserName = process.env.DOK_USER_NAME;

      DoK.login(dokEmail, dokPassword)
        .then(token => {
          DoK.getMyDecks(dokUserName, token)
            .then(dokDecks => delta(mvDecks, dokDecks))
            .then(decks => DoK.importDecks(token, decks))
            .catch(err => {
              console.log("Error connecting to Decks Of Keyforge");
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

      Crucible.getMyDecks()
        .then(crucibleDecks => delta(mvDecks, crucibleDecks))
        .then(Crucible.importDecks)
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
