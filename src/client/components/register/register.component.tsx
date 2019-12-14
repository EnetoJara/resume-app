import React, { Component, FormEvent, ReactElement } from "react";
import { RegisterUser } from "../../modules/user/user.actions";
import { Button } from "../common/button";
import { FormControl } from "../common/form-controll";
import "./register.styles.scss";

export interface RegisterProps {
    register: RegisterUser;
}

export interface RegisterState {
    [x: string]: any;
}

export interface InputForm {
    target: {
        name: string;
        value: string;
    };
}

export class Register extends Component<RegisterProps, RegisterState> {
    public state: RegisterState;

    public constructor (props: RegisterProps) {
        super(props);
        this.state = {
            email: "",
            name: "",
            middleName: "",
            lastName: "",
            secondLastName: "",
            password: "",
            password2: "",
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
            name: "",
            email: "",
            lastName: "",
            middleName: "",
            secondLastName: "",
            password: "",
            password2: "",
        });
    }

    public onSubmitHandler (evt: FormEvent): void {
        evt.preventDefault();

        const { register } = this.props;
        const {
            email = "",
            name = "",
            middleName = "",
            lastName = "",
            secondLastName = "",
            password = "",
            password2 = "",
        } = this.state;
        register({
            email,
            name,
            middleName,
            lastName,
            secondLastName,
            password,
            password2,
        });
    }

    public render (): ReactElement<RegisterProps> {
        const {
            email,
            name,
            middleName,
            lastName,
            secondLastName,
            password,
            password2,
        } = this.state;

        return (
            <div className="app-register-layout">
                <div className="app-register-layout__row header">
                    <h3>Register</h3>
                </div>
                <div className="app-register-layout__row">
                    <FormControl
                        isRequired
                        labelText="Email"
                        name="email"
                        onChangeHandler={this.onInputChangeHandler}
                        type="email"
                        value={email}
                    />
                </div>
                <div className="app-register-layout__row">
                    <FormControl
                        isRequired
                        labelText="Name"
                        name="name"
                        onChangeHandler={this.onInputChangeHandler}
                        type="text"
                        value={name}
                    />
                    <FormControl
                        labelText="Middle Name"
                        name="middleName"
                        onChangeHandler={this.onInputChangeHandler}
                        type="text"
                        value={middleName}
                    />
                </div>
                <div className="app-register-layout__row">
                    <FormControl
                        isRequired
                        labelText="Last Name"
                        name="lastName"
                        onChangeHandler={this.onInputChangeHandler}
                        type="text"
                        value={lastName}
                    />
                    <FormControl
                        labelText="Second Last Name"
                        name="secondLastName"
                        onChangeHandler={this.onInputChangeHandler}
                        type="text"
                        value={secondLastName}
                    />
                </div>
                <div className="app-register-layout__row">
                    <FormControl
                        isRequired
                        labelText="Password"
                        name="password"
                        onChangeHandler={this.onInputChangeHandler}
                        type="password"
                        value={password}
                    />
                    <FormControl
                        isRequired
                        labelText="Confirm Password"
                        name="password2"
                        onChangeHandler={this.onInputChangeHandler}
                        type="password"
                        value={password2}
                    />
                </div>
                <div className="app-register-layout__buttons">
                    <Button
                        kind="default"
                        onClick={this.onSubmitHandler}
                        text="Cancel"
                    />
                    <Button
                        kind="primary"
                        onClick={this.onSubmitHandler}
                        text="Register"
                    />
                </div>
            </div>
        );
    }
}
