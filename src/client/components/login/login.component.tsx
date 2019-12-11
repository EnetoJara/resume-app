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

        if (name.includes("password")) {
            this.setState({ [name]: value });
        } else {
            this.setState({ [name]: value.toUpperCase() });
        }
    }

    public onCancelButtonHandler (evt: FormEvent): void {
        evt.preventDefault();

        this.setState({
            email: "",
            password: "",
        });
    }

    public onSubmitHandler (evt: FormEvent): void {
        evt.preventDefault();

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
                        isRequired
                        onChangeHandler={this.onInputChangeHandler}
                        name="email"
                        type="email"
                        value={email}
                        labelText="Email"
                    />
                </div>
                <div className="app-login-layout__row">
                    <FormControl
                        onChangeHandler={this.onInputChangeHandler}
                        name="password"
                        type="password"
                        value={password}
                        labelText="Password"
                        isRequired
                    />
                </div>
                <div className="app-login-layout__buttons">
                    <Button
                        text="Cancel"
                        kind="default"
                        onClick={this.onSubmitHandler}
                    />
                    <Button
                        text="Login"
                        kind="primary"
                        onClick={this.onSubmitHandler}
                    />
                </div>
            </div>
        );
    }
}
