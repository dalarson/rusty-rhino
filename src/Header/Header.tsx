import { Group } from "@mantine/core";
import { IHeaderProps } from "./IHeaderProps"
import { UserButton } from "./UserButton";
import Rhino from '../assets/Rhino.svg';
import { useAuth } from "../auth/AuthProvider";

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
            <UserButton isAdmin={authContext.isAdmin} name={authContext.name} onSignIn={authContext.login} onSignOut={authContext.logout} />
        </Group >
    )
}