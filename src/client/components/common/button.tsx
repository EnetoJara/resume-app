import React, { FormEvent, PureComponent, ReactElement } from "react";
import "./styles.scss";

export interface ButtonProps {
    onClick(evt: FormEvent): void;
    kind: "success" | "primary" | "default" | "warning" | "error";
    text: string;
    tabIndex?: number;
}

export class Button extends PureComponent<ButtonProps> {
    public constructor (props: ButtonProps) {
        super(props);
        this.onClickHandlerEvent = this.onClickHandlerEvent.bind(this);
    }

    public onClickHandlerEvent (event: FormEvent) {
        const { onClick } = this.props;
        onClick(event);
    }

    public render (): ReactElement {
        const { kind, text, tabIndex = 1 } = this.props;

        return (
            <button
                className={`btn ${kind}`}
                onClick={this.onClickHandlerEvent}
                tabIndex={tabIndex}
                type="button"
            >
                {text}
            </button>
        );
    }
}
