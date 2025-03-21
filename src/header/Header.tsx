import { Group } from "@mantine/core";
import { IHeaderProps } from "./IHeaderProps"
import { UserButton } from "./login/UserButton";
import Rhino from '../../resources/logo/Rhino.svg';
import { useAuth } from "../auth/useAuth";
import { LoginDialog } from "./login/LoginDialog";
import { ICredentials } from "./login/ICredentials";
import { useState } from "react";

export const Header = (props: IHeaderProps): JSX.Element => {
    // set doc title
    document.title = props.title;
    const authContext = useAuth();
    return (
        <Group h="100%" px="md" justify="space-between">
            <Group>
                <img src={Rhino} alt='' width={"45px"} height={"30px"} />
                <div>
                    {props.title}
                </div>
            </Group>
            <UserButton onSignInClick={() => authContext.login()} onSignOutClick={authContext.logout} />
            {/* {isLoginDialogOpen && <LoginDialog isOpen={isLoginDialogOpen} onClose={() => setLoginDialogOpen(false)} onSubmit={onSubmit} />} */}
        </Group >
    )
}