declare namespace NodeJS {
    export interface Global {
        botConfig: {
            commandPrefix: string,
            messagePrefix: string,
            debug: boolean,
            rating: {
                funnyReplies: boolean,
                showLinks: boolean
            },
            channels: string[],
            identity: {
                username: string,
                password: string
            },
            userAgent: string
        }
    }
}