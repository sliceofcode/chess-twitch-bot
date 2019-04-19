declare namespace NodeJS {
    export interface Global {
        botConfig: {
            commandPrefix: string,
            debug: boolean,
            rating: {
                funnyReplies: boolean,
                showLinks: boolean
            },
            channels: string[],
            identity: {
                username: string,
                password: string
            }

        }
    }
}