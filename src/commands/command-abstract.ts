export abstract class CommandAbstract {
    protected user: object;
    protected message: string;
    protected messagePrefix: boolean = true;

    constructor() {
    }

    setUser(value: object) {
        this.user = value;
    }

    setMessage(value: string) {
        this.message = value;
    }

    useMessagePrefix() {
        return this.messagePrefix;
    }

    abstract handler(): Promise<string>;
}