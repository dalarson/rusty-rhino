import { ILoginDialogProps } from "./ILoginDialogProps"
import { Button, Group, Loader, Modal, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useState } from "react";
import { ICredentials } from "./ICredentials";

export const LoginDialog = (props: ILoginDialogProps): JSX.Element => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onLoginClick = () => {
        setLoading(true);
        setError("");
        const creds: ICredentials = {
            username,
            password
        }
        props.onSubmit(creds).then(() => {
            setLoading(false);
        }).catch(() => {
            setError("Invalid username or password");
            setLoading(false);
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
                    value={username}
                    onChange={(event) => setUsername(event.currentTarget.value)}
                />
                <PasswordInput
                    value={password}
                    label="Password"
                    onChange={(event) => setPassword(event.currentTarget.value)}
                />
                {error && <Text c="red" size="sm">{error}</Text>}
                <Group justify="left">
                    <Button leftSection={isLoading ? <Loader type="dots" color="white" /> : undefined} title="Login" onClick={onLoginClick} >{isLoading ? "Logging in..." : "Login"}</Button>
                    <Button title="Cancel" onClick={props.onClose} variant="default">Cancel</Button>
                </Group>
            </Stack>
        </Modal>
    );
}