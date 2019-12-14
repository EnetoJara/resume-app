import cx from "classnames";
import React, { FormEvent, ReactElement } from "react";
import "./styles.scss";

export interface FormControlProps<T = any> {
    name: string;
    isRequired?: boolean;
    type?: "email" | "text" | "password" | "number";
    value: T;
    labelText: string;
    placeholder?: string;
    onChangeHandler(evt: any): void;
    hasError?: string;
    tabIndex?: number;
}
export function FormControl (props: FormControlProps): ReactElement {
    const {
        name,
        value,
        onChangeHandler,
        placeholder = `Please insert ${name}`,
        labelText,
        type = "text",
        isRequired = false,
        hasError = "",
        tabIndex = 1,
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
                className="app-form-control__input"
                name={name}
                onChange={change}
                placeholder={placeholder}
                required={isRequired}
                tabIndex={tabIndex}
                type={type}
                value={value}
            />
            <span className="app-form-control__feedback">{hasError}</span>
        </div>
    );
}
