import * as React from 'react';

class Observable {
    listeners: Function[] = [];

    addListener(fn: Function) {
        this.listeners = [fn, ...this.listeners];
    }

    removeListener(fn: Function) {
        this.listeners = this.listeners.filter((listener) => listener !== fn);
    }

    trigger() {
        this.listeners.forEach(fn => fn(this));
    }
}

class Store extends Observable {
    public value: any;

    constructor(value = undefined) {
        super();
        this.value = value;
    }

    setValue: Function = (value: any) => {
        if (value !== this.value) {
            this.value = value;
            this.trigger();
        }
    };
};


export default (): [any, any, Store] => {
    const globalStore = new Store();
    const StateCtx = React.createContext(globalStore);

    class Provider extends React.Component<any, any, Store> {

        public static contextType = StateCtx;

        componentDidMount() {
            const store = this.context;

            store.addListener(this.update)
        }

        componentWillUnmount() {
            const store: Store = this.context;

            store.removeListener(this.update)
        }

        render() {
            const store = this.context;

            return (
                this.props.render(
                    store.value,
                    store.setValue
                )
            )
        }

        update = () => this.forceUpdate();
    }

    class Scope extends React.Component<any, any> {
        private readonly store: Store;

        constructor(props: any) {
            super(props);
            this.store = new Store();
        }

        render() {
            return (
                <StateCtx.Provider value={this.store}>
                    {this.props.children}
                </StateCtx.Provider>
            )
        }
    }

    return [Provider, Scope, globalStore];
}
