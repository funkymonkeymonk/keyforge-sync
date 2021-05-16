import * as request from "request-promise-native";

export interface HttpClientRequestParameters<T> {
  url: string
  requiresToken: boolean
  payload?: T
}
export interface HttpClient {
  post<T>(parameters: HttpClientRequestParameters<T>): Promise<T>
}

const post = <T>(parameters: HttpClientRequestParameters<T>): Promise<T> =>
  request({
    method: "POST",
    url: parameters.url,
    body: parameters.payload,
    json: true,
    resolveWithFullResponse: true
  })
    .then(res => res.headers.authorization)

export {
  post
}
