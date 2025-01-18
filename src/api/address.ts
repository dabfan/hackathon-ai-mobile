export class AddressClient {
  static getAddressData(lat: number, long: number) {
    return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=en`, {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9,ru-RU;q=0.8,ru;q=0.7,ro;q=0.6,he;q=0.5,cs;q=0.4",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site"
      },
      "referrer": "https://www.gps-coordinates.net/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "omit"
    }).then(response => response.json());
  }
}