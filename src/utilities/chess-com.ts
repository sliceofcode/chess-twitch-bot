import * as request from 'request';

export class ChessCom {

    // Chess.com Published-Data API
    protected static readonly apiBaseUrl: string = 'https://api.chess.com/pub';

    // Fetch data from the Chess.com's Published-Data API
    public static fetch(endpoint: string): Promise<any> {
        const url = `${this.apiBaseUrl}/${endpoint}`;

        console.debug(`Making HTTP request to chess.com: ${url}`);

        const requestOptions: request.OptionsWithUrl = {
            url,
            method: 'GET',
            timeout: 1000 * 10, // Wait 10 seconds for response
            headers: {
                'content-type': 'application/json'
            },
            json: true
        };

        return new Promise((resolve, reject) => {
            request(
                requestOptions,
                (error: any, response: request.Response, body: any) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(body);
                }
            )
        });
    }
}