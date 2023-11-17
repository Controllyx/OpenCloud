import React from "react";

export default function FolderSubLayout(props: {
    children: React.ReactNode;
    ViewModal: React.ReactNode;
}) {
    return (
        <>
            {props.children}
            {props.ViewModal}
        </>
    );
}
