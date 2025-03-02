import { Group } from "@mantine/core";
import { IHeaderProps } from "./IHeaderProps"
import { UserButton } from "./Login/UserButton";
import Rhino from '../assets/Rhino.svg';
import { useAuth } from "../auth/useAuth";
import { LoginDialog } from "./Login/LoginDialog";
import { ICredentials } from "./Login/ICredentials";
import { useState } from "react";

export const Header = (props: IHeaderProps): JSX.Element => {
    // set doc title
    document.title = props.title;

    const authContext = useAuth();

    const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);

    const onSubmit = async (credentials: ICredentials) => {
        await authContext.login(credentials).then(() => {
            setLoginDialogOpen(false);
        }).catch(() => {
            // render error message
        })
    }


    return (
        <Group h="100%" px="md" justify="space-between">
            <Group>
                <img src={Rhino} alt='' width={"45px"} height={"30px"} />
                <div>
                    {props.title}
                </div>
            </Group>
            <UserButton onSignInClick={() => setLoginDialogOpen(true)} onSignOutClick={authContext.logout} />
            {isLoginDialogOpen && <LoginDialog isOpen={isLoginDialogOpen} onClose={() => setLoginDialogOpen(false)} onSubmit={onSubmit} />}
        </Group >
    )
}