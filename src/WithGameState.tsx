import * as React from 'react';
import {game} from "./Game";

export default class extends React.Component<any, any> {
    componentDidMount() {
        game?.addListener(this.update);
    }

    componentWillUnmount() {
        game?.removeListener(this.update);
    }

    update = () => {
        this.forceUpdate();
    }

    render() {
        return this.props.render({
            ...(game?.serialize() || {})
        });
    }
}
