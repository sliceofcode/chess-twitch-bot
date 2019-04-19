import * as _ from 'lodash';

export class BotCommand {

    // List of supported bot commands
    protected static readonly commands: Array<string> = [
        'help',
        'rating'
    ];

    // Extract the command from the message
    public static getCommandName(message: string): string {
        // Get rid of any leading/trailing whitespace chars
        message = _.trim(message);

        console.debug(`Checking if message starts with the command prefix`);

        // Check if the message starts with the bot command prefix
        if (_.startsWith(message, global.botConfig.commandPrefix)) {
            // Extract the command (take the string after the command prefix and before the space)
            const stringParts = _.split(message.substr(global.botConfig.commandPrefix.length, message.length), /\s/);
            const command = _.get(stringParts, '0', '');

            console.debug(`Command is ${command}`);

            // Check if the command is supported
            if (_.indexOf(this.commands, command) >= 0) {
                return command;
            }
        }
        return '';
    };
}