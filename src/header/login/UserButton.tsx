import { UnstyledButton, Group, Menu } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { IUserButtonProps } from "./IUserButtonProps";
import { Text } from "@mantine/core"
import { useAuth } from "../../auth/useAuth";


export const UserButton = (props: IUserButtonProps): JSX.Element => {
    const authContext = useAuth();

    if (authContext.isAdmin) {
        return (
            <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                withinPortal
            >
                <Menu.Target>
                    <UnstyledButton>
                        <Group gap={7}>
                            <Text fw={500} size="sm" lh={1} mr={3}>
                                {authContext.userContext.name}
                            </Text>
                            <IconChevronDown size={12} stroke={1.5} />
                        </Group>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label onClick={props.onSignOutClick}>Sign out</Menu.Label>
                </Menu.Dropdown>
            </Menu>
        )
    } else {
        return (
            <UnstyledButton onClick={() => {
                props.onSignInClick();
            }}>
                <Text fw={500} size="sm" lh={1} mr={3}>Sign in</Text>
            </UnstyledButton>
        )
    }
}