export interface Deck {
  name: string
  id: string
}

export interface Creds {
  dok: DokCreds
  mv: MvCreds
  pushover: PushoverCreds
}

export interface DokCreds {
  password: string | undefined
  email: string | undefined
  username: string | undefined
}

export interface MvCreds {
  name: string | undefined
  id: string | undefined
  token: string | undefined
}

export interface PushoverCreds {
  apiKey: string | undefined
  userKey: string | undefined
}
