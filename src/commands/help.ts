import * as _ from 'lodash';
import {BotCommand} from '../utilities/bot-command';
import {CommandAbstract} from './command-abstract';

export class HelpCommand extends CommandAbstract {

    // Don't add the message prefix to help command responses
    protected messagePrefix: boolean = false;

    // TODO: Provide help for the available commands
    public handler(): Promise<string> {
        return new Promise((resolve) => {
            // For now just list the available commands
            const commandsWithPrefix = _.map(BotCommand.commands, (command) => {
                return `${global.botConfig.commandPrefix}${command}`;
            });
            resolve(`Available commands are: ${_.join(commandsWithPrefix, ', ')}`);
        });
    }

}