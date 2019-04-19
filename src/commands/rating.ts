import * as _ from 'lodash';
import {CommandAbstract} from './command-abstract';
import {ChessCom} from '../utilities/chess-com';

const config = global.botConfig;

export class RatingCommand extends CommandAbstract {

    protected readonly gameTypesMap: { [id: string]: string } = {
        'blitz': 'chess_blitz',
        'bullet': 'chess_bullet',
        'rapid': 'chess_rapid'
    };

    public handler(): Promise<string> {
        return new Promise((resolve, reject) => {
            const messageParts = _.split(this.message, /\s/);
            console.debug(`Rating - messageParts:`, messageParts);
            const chesscomUsername = _.get(messageParts, '1');
            const gameType = _.get(messageParts, '2');

            if (!chesscomUsername) {
                console.log(`Chess username not provided.`);
                resolve(`@${this.user['display-name']} Please provide a Chess.com username. `
                    + `The command syntax is ${config.commandPrefix}rating <user> <type>`);
            }

            console.debug(`Rating - gameType:`, gameType);
            if (!gameType) {
                console.debug(`Rating - Game type not provided, will return information for all.`);
                // TODO: Return information for all game types when <type> is not provided (!rating <user>)
            }

            // Check if it's a valid game type
            const chesscomGameType = _.get(this.gameTypesMap, gameType);
            if (!chesscomGameType) {
                console.debug(`Rating - Game type is invalid: ${gameType}`);
                resolve(`@${this.user['display-name']} Please provide game type: bullet, blitz or rapid.`
                    + ` The command syntax is: ${config.commandPrefix}rating <user> <type>`);
            }

            // Fetch the rating from Chess.com's API
            return ChessCom.fetch(`player/${encodeURIComponent(chesscomUsername)}/stats`)
                .then((chesscomResponse) => {
                    const chesscomRating = _.get(chesscomResponse, `${chesscomGameType}.last.rating`);
                    if (_.isNaN(chesscomRating)) {
                        resolve(`@${this.user['display-name']} FeelsBadMan, cannot get that rating right now. :(`);
                    }

                    // Start building the response
                    let responseMessage = `[Chess.com] ${chesscomUsername}'s ${gameType} rating is ${chesscomRating}.`;

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
                        responseMessage += ` Check out more stats at `
                            + `www.chess.com/stats/live/bullet/${encodeURIComponent(chesscomUsername)}`;
                    }
                    resolve(responseMessage);

                })
                .catch(reject);

        });
    }
}