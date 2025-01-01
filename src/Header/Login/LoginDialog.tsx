import { ILoginDialogProps } from "./ILoginDialogProps"
import { Button, Group, Modal, PasswordInput, Stack, TextInput } from '@mantine/core';
import { temporaryCredentials } from "./TemporaryCredentials";
import { useState } from "react";

export const LoginDialog = (props: ILoginDialogProps): JSX.Element => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Modal
            opened={props.isOpen}
            onClose={props.onClose}
            centered
            title={"Admin login"}
        >
            <Stack>
                <TextInput
                    label="Username"
                    placeholder={temporaryCredentials.username}
                    value={username}
                    onChange={(event) => setUsername(event.currentTarget.value)}
                />
                <PasswordInput
                    value={password}
                    label="Password"
                    placeholder={temporaryCredentials.password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                />
            </Stack>
            <Group justify="left">
                <Button title="Cancel" onClick={props.onClose} variant="default"></Button>
                <Button title="Login" onClick={() => props.onSubmit} ></Button>
            </Group>
        </Modal>
    );
}