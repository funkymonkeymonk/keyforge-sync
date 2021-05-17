import * as request from "request-promise-native";

export interface HttpClientRequestParameters<T> {
  url: string
  requiresToken: boolean
  payload?: T
}

//TODO: fix the any
//TODO: Let's get some default error handling/logging and pass the error up.
//TODO: Real nice to have but I should set up logging levels as well
export interface HttpClient {
  post<T>(parameters: HttpClientRequestParameters<T>): Promise<any>
}

const post = <T>(parameters: HttpClientRequestParameters<T>): Promise<any> =>
  Promise.resolve(request({
    method: "POST",
    url: parameters.url,
    body: parameters.payload,
    json: true,
    resolveWithFullResponse: true
  }))

export {
  post
}
