const request = require("request-promise-native");

const CrucibleUserId = process.env.CRUCIBLE_USER;

const getMyDecks = token => {
  return request({
    method: "GET",
    url: "https://www.thecrucible.online/api/decks",
    qs: { _: CrucibleUserId },
    headers: {
      authorization: "Bearer " + token
    },
    json: true
  }).then(res => {
    return res.decks.map(deck => ({
      name: deck.identity,
      id: deck.uuid
    }));
  });
};

const importDecks = (token, decks) => {
  if (decks.length === 0) console.log("No new decks to import.");

  for (let deck of decks) {
    console.log(`Importing ${deck.name} into Crucible`);
    request({
      method: "POST",
      url: "https://www.thecrucible.online/api/decks/",
      headers: {
        authorization: "Bearer " + token,
        "content-type": "application/json"
      },
      body: { uuid: deck.id },
      json: true
    })
      .then(console.log(`Imported ${deck.name} into Crucible`))
      .catch(err => console.log(`Import failed`));
  }
};

const login = (username, password) => {
  return request({
    method: "POST",
    url: "https://www.thecrucible.online/api/account/login",
    body: {
      username: username,
      password: password
    },
    json: true
  }).then(res => res.token);
};

module.exports = { getMyDecks, importDecks, login };
