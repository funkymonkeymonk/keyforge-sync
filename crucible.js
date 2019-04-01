const request = require("request-promise-native");

const CrucibleToken = process.env.CRUCIBLE_TOKEN;
const CrucibleUserId = process.env.CRUCIBLE_USER;

const getMyDecks = () => {
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

const importDecks = decks => {
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

module.exports = { getMyDecks, importDecks };
