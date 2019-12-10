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
                <div  className="app-register-layout__row header">
                    <h3>Register</h3>
                </div>
                <div  className="app-register-layout__row">
                <FormControl
                    isRequired
                    onChangeHandler={this.onInputChangeHandler}
                    name="email"
                    type="email"
                    value={email}
                    labelText="Email"
                />
                </div>
                <div className="app-register-layout__row">
                    <FormControl
                        isRequired
                        onChangeHandler={this.onInputChangeHandler}
                        name="name"
                        type="text"
                        value={name}
                        labelText="Name"
                    />
                    <FormControl
                        onChangeHandler={this.onInputChangeHandler}
                        name="middleName"
                        type="text"
                        value={middleName}
                        labelText="Middle Name"
                    />
                </div>
                <div className="app-register-layout__row">
                    <FormControl
                        onChangeHandler={this.onInputChangeHandler}
                        name="lastName"
                        type="text"
                        value={lastName}
                        labelText="Last Name"
                        isRequired
                    />
                    <FormControl
                        onChangeHandler={this.onInputChangeHandler}
                        name="secondLastName"
                        type="text"
                        value={secondLastName}
                        labelText="Second Last Name"
                    />
                </div>
                <div className="app-register-layout__row">
                    <FormControl
                        onChangeHandler={this.onInputChangeHandler}
                        name="password"
                        type="password"
                        value={password}
                        labelText="Password"
                        isRequired
                    />
                    <FormControl
                        onChangeHandler={this.onInputChangeHandler}
                        name="password2"
                        type="password"
                        value={password2}
                        labelText="Confirm Password"
                        isRequired
                    />
                </div>
                <div className="app-register-layout__buttons">
                    <Button
                        text="Cancel"
                        kind="default"
                        onClick={this.onSubmitHandler}
                    />
                    <Button
                        text="Register"
                        kind="primary"
                        onClick={this.onSubmitHandler}
                    />
                </div>
            </div>
        );
    }
}
