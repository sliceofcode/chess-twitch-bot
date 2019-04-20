import * as _ from 'lodash';
import {CommandAbstract} from './command-abstract';
import {ChessCom} from '../utilities/chess-com';

const config = global.botConfig;

export class ProfileCommand extends CommandAbstract {

    public handler(): Promise<string> {
        return new Promise((resolve, reject) => {
            const messageParts = _.split(this.message, /\s/);
            const chesscomUsername = _.get(messageParts, '1');
            if (!chesscomUsername) {
                 return resolve(`@${this.user['display-name']} Please provide a chess.com username. `
                    + `The command syntax is ${config.commandPrefix}profile <user>`);
            }

            // Fetch the user profile data
            // Get additional details about a player in a game.
            return ChessCom.fetch(`player/${encodeURIComponent(chesscomUsername)}`)
                .then((response) => {

                    const errorMessage = ChessCom.getErrorMessage(response);
                    if (errorMessage) {
                        return resolve(`No profile data for ${chesscomUsername}. ${errorMessage}`);
                    }

                    let responseMessage = `${chesscomUsername}`;

                    const name = _.get(response, 'name');
                    if (name) {
                        responseMessage += ` (${name})`;
                    }

                    // title (optional) - abbreviation of chess title, if any
                    const title = _.get(response, 'title');
                    if (title) {
                        responseMessage += ` is a ${title}`;

                        // Convert the chess title abbreviation to the full name (example: "GM" to "Grandmaster", etc)
                        const titleLong = _.get(ChessCom.chessTitleMap, title);
                        if (titleLong) {
                            responseMessage += ` (${titleLong})`;
                        }
                    }

                    // location (optional) - the city or location
                    const location = _.get(response, 'location');
                    if (location) {
                        if (!title) {
                            responseMessage += ` is`;
                        }
                        responseMessage += ` from ${location}`;
                    }

                    if (title || location) {
                        responseMessage += `,`;
                    }

                    // Parse the joined timestamp and display date string
                    const joinedDate = new Date(_.toNumber(response.joined) * 1000);
                    responseMessage += ` joined chess.com on `
                        + `${(joinedDate.getMonth() + 1)}/${joinedDate.getDate()}/${joinedDate.getFullYear()}.`;

                    // Account status: closed, closed:fair_play_violations, basic, premium, mod, staff
                    responseMessage += ` The player has a ${response.status} account.`;

                    const twitchUrl = _.get(response, 'twitch_url');
                    if (_.get(response, 'is_streamer') && twitchUrl) {
                        responseMessage += ` This player is a streamer: ${twitchUrl}`
                    }

                    resolve(responseMessage);

                })
                .catch(reject);

        });
    }

}