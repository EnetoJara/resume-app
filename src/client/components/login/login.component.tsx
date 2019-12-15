import React, { Component, FormEvent, ReactElement } from "react";
import { LoginUser } from "../../modules/user/user.actions";
import { Button } from "../common/button";
import { FormControl } from "../common/form-controll";
import "./login.styles.scss";

export interface LoginProps {
    login: LoginUser;
}

export interface LoginState {
    [x: string]: any;
}

export interface InputForm {
    target: {
        name: string;
        value: string;
    };
}

export class Login extends Component<LoginProps, LoginState> {
    public state: LoginState;

    public constructor (props: LoginProps) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
        this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
        this.onCancelButtonHandler = this.onCancelButtonHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    public onInputChangeHandler (evt: InputForm): void {
        const { value = "" } = evt.target;
        const { name = "" } = evt.target;
        console.log("changing");
        if (name.includes("password")) {
            this.setState({ [name]: value });
        } else {
            this.setState({ [name]: value.toUpperCase() });
        }
    }

    public onCancelButtonHandler (evt: FormEvent): void {
        evt.preventDefault();

        console.log("canceling");
        this.setState({
            email: "",
            password: "",
        });
    }

    public onSubmitHandler (evt: FormEvent): void {
        evt.preventDefault();

        console.log("submitin");
        const { login } = this.props;
        const { email = "", password = "" } = this.state;
        login({
            email,
            password,
        });
    }

    public render (): ReactElement<LoginProps> {
        const { email, password } = this.state;

        return (
            <div className="app-login-layout">
                <div className="app-login-layout__row header">
                    <h3>Login</h3>
                </div>
                <div className="app-login-layout__row">
                    <FormControl
                        labelText="Email"
                        name="email"
                        onChangeHandler={this.onInputChangeHandler}
                        tabIndex={1}
                        value={email}
                    />
                </div>
                <div className="app-login-layout__row">
                    <FormControl
                        labelText="Password"
                        name="password"
                        onChangeHandler={this.onInputChangeHandler}
                        tabIndex={2}
                        type="password"
                        value={password}
                    />
                </div>
                <div className="app-login-layout__buttons">
                    <Button
                        kind="default"
                        onClick={this.onCancelButtonHandler}
                        tabIndex={4}
                        text="Cancel"
                    />
                    <Button
                        kind="primary"
                        onClick={this.onSubmitHandler}
                        tabIndex={3}
                        text="Login"
                    />
                </div>
            </div>
        );
    }
}
