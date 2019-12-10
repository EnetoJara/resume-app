import cx from "classnames";
import React, { FormEvent, ReactElement } from "react";
import "./styles.scss";

export interface FormControlProps<T = any> {
    name: string;
    isRequired?: boolean;
    type: "email" | "text" | "password" | "number";
    value: T;
    labelText: string;
    placeholder?: string;
    onChangeHandler (evt: any): void;
    hasError?: string;
}
export function FormControl (props: FormControlProps): ReactElement {
    const {
        name,
        value,
        onChangeHandler,
        placeholder = `Please insert ${name}`,
        labelText,
        type,
        isRequired = false,
        hasError = "",
    } = props;
    const change = (evt: FormEvent) => onChangeHandler(evt);
    const error = typeof hasError === "string" && hasError.trim().length > 0;

    return (
        <div
            className={cx({
                "app-form-control": true,
                "has-error": error,
            })}
        >
            <span className="app-form-control__label">
                {labelText}
                {isRequired ? (
                    <span className="app-form-control__isRequired">*</span>
                ) : (
                    ""
                )}
            </span>
            <input
                required={isRequired}
                className="app-form-control__input"
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={change}
            />
            <span className="app-form-control__feedback">{hasError}</span>
        </div>
    );
}
