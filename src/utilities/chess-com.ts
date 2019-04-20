import * as request from 'request';

export class ChessCom {

    // Chess.com Published-Data API
    protected static readonly apiBaseUrl: string = 'https://api.chess.com/pub';

    // Valid title abbreviations are: GM, WGM, IM, WIM, FM, WFM, NM, WNM, CM, WCM
    public static readonly chessTitleMap: { [id: string]: string } = {
        'GM': 'Grandmaster',
        'WGM': 'Woman Grandmaster',
        'IM': 'International Master',
        'WIM': 'Woman International Master',
        'FM': 'FIDE Master',
        'WFM': 'Woman FIDE Master',
        'NM': 'National Master',
        'WNM': 'Woman National Master',
        'CM': 'Candidate Master',
        'WCM': 'Woman Candidate Master'
    };

    // Fetch data from the Chess.com's Published-Data API
    public static fetch(endpoint: string): Promise<any> {
        const url = `${this.apiBaseUrl}/${endpoint}`;

        console.debug(`Making HTTP request to chess.com: ${url}`);

        const requestOptions: request.OptionsWithUrl = {
            url,
            method: 'GET',
            timeout: 1000 * 10, // Wait 10 seconds for response
            headers: {
                'user-agent': `${global.botConfig.userAgent} - Twitch username: ${global.botConfig.identity.username}`,
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

    // Returns the error message if the response object has message and code set
    public static getErrorMessage(response: { message: string, code: number }): any {
        if (response.code === 0 && response.message) {
            return response.message;
        }
        return null;
    }
}