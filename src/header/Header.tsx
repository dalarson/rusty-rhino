import { Group, Title } from "@mantine/core";
import { IHeaderProps } from "./IHeaderProps"
import { UserButton } from "./login/UserButton";
import Rhino from '../../resources/logo/Logo.png';
import { useAuth } from "../auth/useAuth";
import { LoginDialog } from "./login/LoginDialog";
import { ICredentials } from "./login/ICredentials";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Header = (props: IHeaderProps): JSX.Element => {
    document.title = props.title;

    const authContext = useAuth();
    const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);

    const onSubmit = async (creds: ICredentials) => {
        await authContext.login(creds);
        setLoginDialogOpen(false);
    };

    return (
        <Group h="100%" px="md" justify="space-between">
            <Group>
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
                    <img src={Rhino} alt='' height={"40px"} />
                    <Title order={3} size="h3">{props.title}</Title>
                </Link>
            </Group>
            {props.tabs}
            <UserButton onSignInClick={() => setLoginDialogOpen(true)} onSignOutClick={authContext.logout} />
            {isLoginDialogOpen && <LoginDialog isOpen={isLoginDialogOpen} onClose={() => setLoginDialogOpen(false)} onSubmit={onSubmit} />}
        </Group >
    )
}