import * as _ from 'lodash';
import {CommandAbstract} from './command-abstract';
import {ChessCom} from '../utilities/chess-com';

const config = global.botConfig;

export class RatingCommand extends CommandAbstract {

    protected readonly gameTypesMap: { [id: string]: string } = {
        'blitz': 'chess_blitz',
        'bullet': 'chess_bullet',
        'rapid': 'chess_rapid',
        'daily': 'chess_daily'
    };

    public handler(): Promise<string> {
        return new Promise((resolve, reject) => {
            const messageParts = _.split(this.message, /\s/);
            const chesscomUsername = _.get(messageParts, '1');
            const gameType = _.get(messageParts, '2');

            if (!chesscomUsername) {
                return resolve(`@${this.user['display-name']} Please provide a chess.com username. `
                    + `The command syntax is ${config.commandPrefix}rating <user> [type]`
                );
            }

            // Fetch the rating from Chess.com's API
            return ChessCom.fetch(`player/${encodeURIComponent(chesscomUsername)}/stats`)
                .then((response) => {

                    const errorMessage = ChessCom.getErrorMessage(response);
                    if (errorMessage) {
                        return resolve(`No rating data available for ${chesscomUsername}. ${errorMessage}`);
                    }

                    console.debug(`Rating - gameType:`, gameType);
                    if (!gameType) {
                        // Return information for all game types when <type> is not provided (!rating <user>)
                        console.debug(`Rating - Game type not provided, will return information for all.`);
                        const responseForAll = this.getResponseMessageForAllRatings(chesscomUsername, response);
                        if (!_.isEmpty(responseForAll)) {
                            return resolve(responseForAll);
                        }
                        return resolve(`No rating data available for ${chesscomUsername} for `
                            + _.join(_.keys(this.gameTypesMap), ', ')
                        );
                    }

                    // Check if it's a valid game type
                    const chesscomGameType = _.get(this.gameTypesMap, gameType);
                    if (!chesscomGameType) {
                        console.debug(`Rating - Game type is invalid: ${gameType}`);
                        return resolve(`@${this.user['display-name']} Please provide game type: `
                            + _.join(_.keys(this.gameTypesMap), ', ')
                            + `. The command syntax is: ${config.commandPrefix}rating <user> <type>`);
                    }

                    const chesscomRating = _.get(response, `${chesscomGameType}.last.rating`);
                    if (!_.isNumber(chesscomRating)) {
                        return resolve(`No rating data available for ${chesscomUsername} for ${gameType}`);
                    }

                    // Start building the response
                    let responseMessage = `${chesscomUsername}'s ${gameType} rating is ${chesscomRating}`;

                    // Randomly add the funny replies if the feature is enabled
                    // TODO: Just an initial idea, needs improvements on more interesting and randomized messages
                    if (config.rating.funnyReplies && Math.random() >= 0.5) {
                        // Having some fun here :)
                        if (chesscomRating > 2800) {
                            responseMessage += ` Wow, must be a good chess player.`;
                        } else if (chesscomRating < 2000) {
                            responseMessage += ` Uhm, the road to 2000 is pretty hard, isn't it?`;
                        }
                    }

                    if (config.rating.showLinks) {
                        let statsUrl = `www.chess.com/stats`;
                        switch (gameType) {
                            case 'daily':
                                statsUrl += `/daily`;
                                break;
                            default:
                                statsUrl += `/live/${gameType}`;
                        }
                        responseMessage += ` Check out more stats at `
                            + `${statsUrl}/${encodeURIComponent(chesscomUsername)}`;
                    }
                    resolve(responseMessage);

                })
                .catch(reject);

        });
    }

    // Builds response message by extracting rating for all supported game types, or empty string if none is available
    private getResponseMessageForAllRatings(chesscomUsername: string, chesscomResponse: object): string {
        let ratingsStrings: string[] = [];
        _.forEach(this.gameTypesMap, (gameTypePath, gameType) => {
            const chesscomRating = _.get(chesscomResponse, `${gameTypePath}.last.rating`);
            if (_.isNumber(chesscomRating)) {
                ratingsStrings.push(`${_.upperFirst(gameType)}: ${chesscomRating}`);
            }
        });

        if (!_.isEmpty(ratingsStrings)) {
            return `${chesscomUsername}'s chess ratings are: ${_.join(ratingsStrings, ', ')}`;
        }
        return '';
    }
}