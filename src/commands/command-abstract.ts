export abstract class CommandAbstract {
    protected user: object;
    protected message: string;

    constructor() {
    }

    setUser(value: object) {
        this.user = value;
    }

    setMessage(value: string) {
        this.message = value;
    }

    abstract handler(): Promise<string>;
}