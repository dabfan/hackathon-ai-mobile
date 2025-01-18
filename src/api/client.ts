export enum RequestType {
  "GET",
  "POST",
  "PATCH",
  "PUT",
  "DELETE",
}

export class ApiClient {
  private _apiEndpoint: string = 'http://localhost:3001/api';
  private headers: any = {
    Accept: "application/json",
    "Content-Type": "application/json;charset=utf-8",
  };

  public async makeRequest(method, url, data): Promise<any> {

    const params = {
      credentials: 'include',
      method,
      data: null,
      [this.dataSendType(method)]: this.serialize(data),
    };
    const response = await fetch(`${this._apiEndpoint}${url}`, params);

    return response.json();
  }

  public async post(url, data) {
    return this.makeRequest(RequestType.POST, url, data);
  }

  /**
   *  Find the parameter key for body
   * @param method
   * @returns
   */
  dataSendType(method: string) {
    return method.toUpperCase() === "GET" ? "params" : "body";
  }

  /**
   * Stringify data properly
   *
   * @param data
   * @returns
   */
  serialize(data: any) {
    if (typeof data === "object" && data instanceof FormData) {
      return data;
    }
    return data && JSON.stringify(data);
  }
}