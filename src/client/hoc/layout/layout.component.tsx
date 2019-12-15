import React, { ReactElement } from "react";

export interface LayoutProps {
    children: ReactElement;
}
export function Layout (props: LayoutProps): ReactElement<LayoutProps> {
    const { children } = props;

    return <div className="app-resume-layout">{children}</div>;
}
