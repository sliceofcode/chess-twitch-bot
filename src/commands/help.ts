import {CommandAbstract} from './command-abstract';

export class HelpCommand extends CommandAbstract {

    // TODO: Provide help for the available commands
    public handler(): Promise<string> {
        return new Promise((resolve, reject) => {
            reject(`Help is currently not available`);
        });
    }

}