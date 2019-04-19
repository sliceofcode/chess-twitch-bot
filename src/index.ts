import * as TwitchJS from 'twitch-js';
import * as _ from 'lodash';
import './config/config';
import {BotCommand} from "./utilities/bot-command";
import {CommandAbstract} from "./commands/command-abstract";
import {Logger} from './utilities/logger';

Logger.init();

// Setup the Twitch IRC client
// See https://github.com/twitch-apis/twitch-js/blob/master/docs/Chat/Configuration.md
const clientOptions = {
    channels: global.botConfig.channels,
    identity: global.botConfig.identity
};

const client = new TwitchJS.Client(clientOptions);

// Add chat listener
client.on('chat', (channel: string, user: object, message: string, self: boolean) => {
    console.debug(`${user['display-name']} sent message to ${channel}: "${message}"`);

    // Better not talk to myself
    if (self) {
        return;
    }

    // Check if identity is set
    if (!clientOptions.identity) {
        console.error(`No identity provided`);
    }

    // Extract the command from the message
    const commandName = BotCommand.getCommandName(message);

    // No command detected, we should stop
    if (_.isEmpty(commandName)) {
        return;
    }

    // Dynamically instantiate the command class and call the handler
    const className = _.upperFirst(commandName) + 'Command';
    console.debug(`Importing file ${_.kebabCase(commandName)}, command ${commandName}, class name: ${className}`);
    import(`./commands/` + _.kebabCase(commandName))
        .then((commandClass) => {
            const command = new commandClass[className]() as CommandAbstract;
            command.setUser(user);
            command.setMessage(message);
            console.debug(`Calling the handler function now`);
            command.handler()
                .then((responseMessage) => {
                        client.say(channel, responseMessage);
                    }
                )
                .catch((error) => {
                    console.error(`Error handling the ${commandName} command.`, error);
                });
        });

});

// Connect to the Twitch IRC server
client.connect().then((response: [string, number]) => {
    console.log(`Connected to IRC server ${response[0]}:${response[1]}`);
});