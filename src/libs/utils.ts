import { Deck } from "./deck";
import * as request from "request-promise-native";

export const delta = (source: Deck[], destination: Deck[]) => {
  console.log(
    `${source.length} decks in source -> ${
    destination.length
    } decks in destination`
  );
  return source.filter(deck => !destination.map(d => d.id).includes(deck.id));
};

class Message {
  constructor(
    public token: string,
    public user: string,
    public title: string,
    public message: string,
    public url_title: string,
    public url: string
  ) { }
}

export const notify = (creds: any, deck: Deck) => {
  console.log(`sending push for ${deck.name}`)

  const message = new Message(
    creds.pushover.apiKey,
    creds.pushover.userKey,
    `Deck added`,
    `${deck.name} imported into Decks of Keyforge`,
    'View on Decks Of Keyforge',
    `https://www.decksofkeyforge.com/decks/${deck.id}`
  )

  request({
    method: "POST",
    uri: "https://api.pushover.net/1/messages.json",
    json: message
  })
    .catch(err => console.log('Error sending notification to pushover: ' + err))
}