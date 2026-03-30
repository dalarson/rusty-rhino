import { Group } from "@mantine/core";
import { IHeaderProps } from "./IHeaderProps"
import { UserButton } from "./login/UserButton";
import Rhino from '../../resources/logo/Rhino.svg';
import { useAuth } from "../auth/useAuth";
import { LoginDialog } from "./login/LoginDialog";
import { ICredentials } from "./login/ICredentials";
import { useState } from "react";

export const Header = (props: IHeaderProps): JSX.Element => {
    document.title = props.title;

    const authContext = useAuth();
<<<<<<< Updated upstream

    const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);

    const onSubmit = async (credentials: ICredentials) => {
        await authContext.login(credentials).then(() => {
            setLoginDialogOpen(false);
        }).catch(() => {
            // render error message
        })
    }

=======
    const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);

    const onSubmit = async (creds: ICredentials) => {
        await authContext.login(creds);
        setLoginDialogOpen(false);
    };
>>>>>>> Stashed changes

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