require("dotenv").config();
const request = require("request-promise-native");
const MasterVault = require("./master-vault");
const DoK = require("./dok");

const CrucibleToken = process.env.CRUCIBLE_TOKEN;
const CrucibleUserId = process.env.CRUCIBLE_USER;

const getMyDecksFromCrucible = () => {
  return request({
    method: "GET",
    url: "https://www.thecrucible.online/api/decks",
    qs: { _: CrucibleUserId },
    headers: {
      authorization: CrucibleToken
    },
    json: true
  }).then(res => {
    return res.decks.map(deck => ({
      name: deck.identity,
      id: deck.uuid
    }));
  });
};

const importDecksIntoCrucible = decks => {
  if (decks.length === 0) console.log("No new decks to import.");

  for (let deck of decks) {
    console.log(`Importing ${deck.name} into Crucible`);
    request({
      method: "POST",
      url: "https://www.thecrucible.online/api/decks/",
      headers: {
        authorization: CrucibleToken,
        "content-type": "application/json"
      },
      body: { uuid: deck.id },
      json: true
    })
      .then(console.log(`Imported ${deck.name} into Crucible`))
      .catch(err => console.log(`Import failed`));
  }
};

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

// Promise.all([mv.getMyDecks(), getMyDecksFromCrucible()])
//   .then(([mv, crucible]) => delta(mv, crucible))
//   .then(importDecksIntoCrucible)
//   .catch(err => console.log(err.message));
