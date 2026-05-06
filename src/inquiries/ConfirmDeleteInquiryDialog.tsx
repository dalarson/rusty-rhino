import { Modal, Text, Group, ButtonGroup, Button, LoadingOverlay, Stack } from "@mantine/core"
import { InterestEntry } from "../domain/types/InterestEntry";
import { InterestSvc } from "../domain/services/InterestSvc";
import { CacheKeys } from "../domain/services/CacheKeys";
import { useQueryClient } from "react-query";
import { useState } from "react";

export interface IConfirmDeleteInquiryDialogProps {
    opened: boolean;
    onClose: () => void;
    entry: InterestEntry;
}

export const ConfirmDeleteInquiryDialog = (props: IConfirmDeleteInquiryDialogProps): JSX.Element => {
    const queryClient = useQueryClient();
    const interestSvc = new InterestSvc();
    const deleteEntryReq = interestSvc.deleteInterest(props.entry.id!);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error>();

    const deleteEntry = async () => {
        setIsLoading(true);
        await deleteEntryReq.execute().then(() => {
            queryClient.invalidateQueries({ queryKey: CacheKeys.Interest })
            props.onClose();
        }).catch((error: Error) => {
            console.log("failed to delete inquiry");
            console.log(error);
            setError(error);
            setIsLoading(false);
        })
    }

    const onClose = () => {
        setError(undefined);
        setIsLoading(false);
        props.onClose();
    }

    return (
        <Modal opened={props.opened} onClose={onClose} title="Are you sure you want to delete this inquiry?" centered pos="relative">
            <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            {error && <Text color="red">{error.message}</Text>}
            <Stack gap="xs">
                <Group justify="space-between">
                    <Text fw={700}>From:</Text>
                    <Text>{props.entry.name} ({props.entry.email})</Text>
                </Group>
                {props.entry.phone && (
                    <Group justify="space-between">
                        <Text fw={700}>Phone:</Text>
                        <Text>{props.entry.phone}</Text>
                    </Group>
                )}
                {props.entry.message && (
                    <Stack gap={0}>
                        <Text fw={700}>Message:</Text>
                        <Text style={{ whiteSpace: 'pre-wrap' }}>{props.entry.message}</Text>
                    </Stack>
                )}
            </Stack>
            <Group justify="flex-end" mt="xl">
                <ButtonGroup>
                    <Button color="red" type="button" onClick={deleteEntry}>Yes, delete it</Button>
                    <Button variant="outline" type="button" onClick={props.onClose}>No, go back</Button>
                </ButtonGroup>
            </Group>
        </Modal>
    )
}
