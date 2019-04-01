require("dotenv").config();
const MasterVault = require("./master-vault");
const DoK = require("./dok");
const Crucible = require("./crucible");

const delta = (source, destination) => {
  console.log(
    `${source.length} decks in source -> ${
      destination.length
    } decks in destination`
  );
  return source.filter(deck => !destination.map(d => d.id).includes(deck.id));
};

Promise.all([MasterVault.getMyDecks(), DoK.getMyDecks()])
  .then(([mv, kof]) => delta(mv, kof))
  .then(DoK.importDecks)
  .catch(err => console.log(err.message));

Promise.all([MasterVault.getMyDecks(), Crucible.getMyDecks()])
  .then(([mv, crucible]) => delta(mv, crucible))
  .then(Crucible.importDecks)
  .catch(err => console.log(err.message));
