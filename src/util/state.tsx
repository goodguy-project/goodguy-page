export enum Status {
    NotStarted,
    Running,
    OK,
    Failed,
}

export default class State<T> {
    status: Status
    value: T | undefined | null

    // const [state, setState] = useState<State<T>>(new State<T>());
    constructor(status?: Status, value?: T | null) {
        this.status = status ? status : Status.NotStarted;
        this.value = value;
    }

    // state.gao(promise, setState);
    gao(promise: Promise<T>, setState: (_: State<T>) => void) {
        if (this.status === Status.NotStarted) {
            setState(new State<T>(Status.Running));
            promise.then((response) => {
                this.status = Status.OK;
                this.value = response;
                setState(new State<T>(Status.OK, response));
            }).catch((err) => {
                console.log(err);
                this.status = Status.Failed;
                this.value = null;
                setState(new State<T>(Status.Failed, null));
            });
        }
    }

    runnable(): boolean {
        return this.status === Status.NotStarted;
    }
}