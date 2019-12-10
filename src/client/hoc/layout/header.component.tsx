import React, { ReactElement } from "react";
import "./layout.styles.scss";

export interface HeaderProps {
    children: ReactElement;
}
export function Header (props: HeaderProps): ReactElement<HeaderProps> {
    const { children } = props;

    return <header className="app-resume-header">{children}</header>;
}
