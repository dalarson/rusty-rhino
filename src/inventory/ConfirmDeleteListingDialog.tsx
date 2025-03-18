import { Modal, Text, Image, Center, Badge, Group, ButtonGroupSection, ButtonGroup, Button, LoadingOverlay } from "@mantine/core"
import { InventoryItem } from "../domain/types/InventoryItem";
import { formatPrice } from "./Listing";
import { InventorySvc } from "../domain/services/InventorySvc";
import { CacheKeys } from "../domain/services/CacheKeys";
import { useQueryClient } from "react-query";
import { useState } from "react";

export interface IConfirmDeleteListingDialogProps {
    opened: boolean;
    onClose: () => void;
    item: InventoryItem;
}

export const ConfirmDeleteListingDialog = (props: IConfirmDeleteListingDialogProps): JSX.Element => {
    const queryClient = useQueryClient();
    const inventorySvc = new InventorySvc();
    const deleteItemReq = inventorySvc.deleteInventoryItem(props.item.id!);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error>();

    const deleteItem = async () => {
        setIsLoading(true);
        await deleteItemReq.execute().then(() => {
            queryClient.invalidateQueries({ queryKey: CacheKeys.Inventory })
            props.onClose();
        }).catch((error: Error) => {
            console.log("failed to delete inventory item");
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
        <Modal opened={props.opened} onClose={onClose} title="Are you sure you want to delete this listing?" centered pos="relative">
            <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            {error && <Text>{error.message}</Text>}
            <Center><Image src={props.item.imgUrl} radius={'md'} h={200} w='auto' fit='contain' /></Center>
            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{props.item.name}</Text>
                {props.item.price && <Badge color="green">{formatPrice(props.item.price)}</Badge>}
            </Group>
            <ButtonGroup>
                <Button color="red" type="button" onClick={deleteItem}>Yes, delete it</Button>
                <Button type="button" onClick={props.onClose}>No, go back</Button>
            </ButtonGroup>
        </Modal>
    )
}