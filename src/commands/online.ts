import * as _ from 'lodash';
import {CommandAbstract} from './command-abstract';
import {ChessCom} from '../utilities/chess-com';

const config = global.botConfig;

export class OnlineCommand extends CommandAbstract {

    public handler(): Promise<string> {
        return new Promise((resolve, reject) => {
            const messageParts = _.split(this.message, /\s/);
            const chesscomUsername = _.get(messageParts, '1');
            if (!chesscomUsername) {
                return resolve(`@${this.user['display-name']} Please provide a chess.com username. `
                    + `The command syntax is ${config.commandPrefix}online <user>`);
            }

            // Fetch the user online status
            // Tells if an user has been online in the last five minutes.
            return ChessCom.fetch(`player/${encodeURIComponent(chesscomUsername)}/is-online`)
                .then((response) => {
                    const isOnline = _.get(response, 'online');

                    // Handle the case when the response does not contain online status for the requested user
                    if (!_.isBoolean(isOnline)) {
                        let responseMessage = `@${this.user['display-name']} Cannot get the `
                            + `online status for ${chesscomUsername} on chess.com right now.`;
                        if (_.get(response, 'message')) {
                            responseMessage += ` ${response.message}`
                        }
                        return resolve(responseMessage);
                    }

                    // Build the response message when valid online/offline status is received
                    let responseMessage = `${chesscomUsername}`;
                    if (isOnline) {
                        responseMessage += ` has been online in the last 5 minutes.`;
                    } else {
                        responseMessage += ` is offline.`;
                    }

                    resolve(responseMessage);

                })
                .catch(reject);

        });
    }

}