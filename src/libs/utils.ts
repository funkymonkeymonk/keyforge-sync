import {Deck, PushoverCreds} from "../types";
import * as request from "request-promise-native";

export const delta = (source: Deck[], destination: Deck[]) => {
  console.info(
    `${source.length} decks in source -> ${
      destination.length
    } decks in destination`
  );
  return source.filter(deck => !destination.map(d => d.id).includes(deck.id));
};

class Message {
  constructor(
    public token: string | undefined,
    public user: string | undefined,
    public title: string,
    public message: string,
    public url_title: string,
    public url: string
  ) {
  }
}

export const notify = async (user: PushoverCreds, deck: Deck) => {
  console.info(`sending push for ${deck.name}`)
  if ( user.apiKey === undefined || user.userKey === undefined) {
    console.error('No pushover credentials supplied')
    return
  }

  const message = new Message(
    user.apiKey,
    user.userKey,
    `Deck added`,
    `${deck.name} imported into Decks of Keyforge`,
    'View on Decks Of Keyforge',
    `https://www.decksofkeyforge.com/decks/${deck.id}`
  )
  try {
    await request({
      method: "POST",
      uri: "https://api.pushover.net/1/messages.json",
      json: message
    })
    console.info(`Push for ${deck.name} sent successfully`)
  } catch(err) {
    console.error('Error sending notification to pushover: ' + err)
  }
}
