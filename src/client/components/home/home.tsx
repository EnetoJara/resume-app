import React, { Component, ReactElement } from "react";

export interface HomeProps {}
export type HomeState = any;

export class Home extends Component {
    public state: HomeState;
    public constructor (props: HomeProps) {
        super(props);
    }

    public componentDidMount () {
        console.log("Home mounted");
    }

    public render (): ReactElement<HomeProps> {
        return <div> component </div>;
    }
}
