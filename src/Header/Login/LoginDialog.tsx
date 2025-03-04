import { ILoginDialogProps } from "./ILoginDialogProps"
import { Button, Group, Loader, Modal, PasswordInput, Stack, TextInput } from '@mantine/core';
import { temporaryCredentials } from "./TemporaryCredentials";
import { useState } from "react";
import { ICredentials } from "./ICredentials";

export const LoginDialog = (props: ILoginDialogProps): JSX.Element => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setLoading] = useState(false);

    const onLoginClick = () => {
        setLoading(true);
        const creds: ICredentials = {
            username,
            password
        }
        props.onSubmit(creds).then(() => {
            setLoading(false);
        }).catch((e: Error) => {
            console.log(e);
            // TODO: create logging solution
        });
    }

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
                <Group justify="left">
                    <Button leftSection={isLoading ? <Loader type="dots" color="white" /> : undefined} title="Login" onClick={onLoginClick} >{isLoading ? "Logging in..." : "Login"}</Button>
                    <Button title="Cancel" onClick={props.onClose} variant="default">Cancel</Button>
                </Group>
            </Stack>
        </Modal>
    );
}