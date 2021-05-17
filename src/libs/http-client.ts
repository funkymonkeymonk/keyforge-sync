import * as request from "request-promise-native";

export interface HttpClientRequestParameters<T> {
  url: string
  payload?: T
  headers?: any
}

//TODO: fix the any
//TODO: Let's get some default error handling/logging and pass the error up.
//TODO: Real nice to have but I should set up logging levels as well
export interface HttpClient {
  post<T>(parameters: HttpClientRequestParameters<T>): Promise<any>
}

const post = <T>(params: HttpClientRequestParameters<T>): any =>
  request({
    method: "POST",
    url: params.url,
    body: params.payload,
    json: true,
    resolveWithFullResponse: true,
    headers: params.headers
  })

export {
  post
}
