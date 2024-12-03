import { UnstyledButton, Group, Menu } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { IUserButtonProps } from "./IUserButtonProps";
import { Text } from "@mantine/core"
import { useState } from "react";


export const UserButton = (props: IUserButtonProps): JSX.Element => {
    const [isUserMenuOpened, setUserMenuOpened] = useState(false);

    if (props.isAdmin) {
        return (
            <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
            >
                <Menu.Target>
                    <UnstyledButton>
                        <Group gap={7}>
                            <Text fw={500} size="sm" lh={1} mr={3}>
                                {props.name}
                            </Text>
                            <IconChevronDown size={12} stroke={1.5} />
                        </Group>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label onClick={props.onSignOut}>Sign out</Menu.Label>
                </Menu.Dropdown>
            </Menu>
        )
    } else {
        return (
            <UnstyledButton onClick={() => {
                console.log("click!");
                props.onSignIn();
            }}>
                <Text fw={500} size="sm" lh={1} mr={3}>Sign in</Text>
            </UnstyledButton>
        )
    }
}