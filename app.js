require("dotenv").config();
const request = require("request-promise-native");

const MasterVaultToken = process.env.MV_TOKEN;
const MasterVaultUserId = process.env.MV_USER;
const DoKBearerToken = process.env.DOK_TOKEN;
const CrucibleToken = process.env.CRUCIBLE_TOKEN;
const CrucibleUserId = process.env.CRUCIBLE_USER;

const getMyDecksFromMV = (page = 1, prev = []) => {
  return request({
    method: "GET",
    url: `https://www.keyforgegame.com/api/users/${MasterVaultUserId}/decks/`,
    qs: {
      page: page,
      page_size: "30",
      ordering: "-date"
    },
    headers: { authorization: MasterVaultToken },
    json: true
  }).then(res => {
    const decks = prev.concat(
      res.data.map(deck => ({
        name: deck.name,
        id: deck.id
      }))
    );

    // Return all results if complete
    if (decks.length >= res.count) return decks;
    else return getMyDecksFromMV(page + 1, decks);
  });
};

const getMyDecksFromDoK = (page = 0, prev = []) => {
  return request({
    method: "POST",
    url: "https://decksofkeyforge.com/api/decks/filter",
    headers: {
      authorization:
        "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3aWxsaWFtZHdlYXZlckBnbWFpbC5jb20iLCJpYXQiOjE1NTQwNjkyNjAsImV4cCI6MTU1NDY3NDA2MCwiUm9sZSI6IlVTRVIifQ.vk4mkrxlxpDLWtQUmr4Kp8J1lrb7Ssl9PlCX6f7-r73AetJz3ohpQrTZzo9qCzvGxUSamAM_J6S1ReBPJbqjoQ",
      "content-type": "application/json"
    },
    body: {
      page: page,
      sortDirection: "DESC",
      owner: "funkymonkeymonk"
    },
    json: true
  }).then(res => {
    // Return all results if complete
    if (res.decks.length === 0) return prev;

    const decks = prev.concat(
      res.decks.map(deck => ({
        name: deck.name,
        id: deck.keyforgeId
      }))
    );

    return getMyDecksFromDoK(page + 1, decks);
  });
};

const importDecksIntoDoK = decks => {
  if (decks.length === 0) console.log("No new decks to import.");
  for (let deck of decks) {
    console.log(`Importing ${deck.name} into DoK`);
    request({
      method: "POST",
      url: `https://decksofkeyforge.com/api/decks/${deck.id}/import-and-add`,
      headers: { authorization: DoKBearerToken }
    })
      .then(console.log(`Imported ${deck.name} into DoK`))
      .catch(err => console.log(`Import failed`));
  }
};

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

Promise.all([getMyDecksFromMV(), getMyDecksFromDoK()])
  .then(([mv, kof]) => delta(mv, kof))
  .then(importDecksIntoDoK)
  .catch(err => console.log(err.message));

Promise.all([getMyDecksFromMV(), getMyDecksFromCrucible()])
  .then(([mv, crucible]) => delta(mv, crucible))
  .then(importDecksIntoCrucible)
  .catch(err => console.log(err.message));
