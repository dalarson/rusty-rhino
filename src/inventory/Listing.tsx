import { ActionIcon, Badge, Button, Card, Group, Image, Text } from "@mantine/core";
import { InventoryItem } from "../domain/types/InventoryItem";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useAuth } from "../auth/useAuth";
import { useDisclosure } from "@mantine/hooks";
import { ConfirmDeleteListingDialog } from "./ConfirmDeleteListingDialog";
import { ListingPanel } from "./ListingPanel";
import { formatPrice } from "../utils/formatPrice";

export interface IListingProps {
    item: InventoryItem,
}

export const Listing = ({ item }: IListingProps): JSX.Element => {

    const { isAdmin } = useAuth();
    const [deleteDialogOpened, { toggle: toggleDeleteDialog }] = useDisclosure(false);
    const [editPanelOpened, { toggle: toggleEditPanel }] = useDisclosure(false);

    return (
        <>
            <Card shadow={'xs'} padding={'md'} radius={'md'} withBorder >
                <Card.Section>
                    {isAdmin &&
                        <Group justify="left" style={{ padding: "4px" }}>
                            <ActionIcon onClick={toggleDeleteDialog} color="red">
                                <IconX></IconX>
                            </ActionIcon>
                            <ActionIcon onClick={toggleEditPanel} color="yellow">
                                <IconPencil></IconPencil>
                            </ActionIcon>
                        </Group>}
                    <Image
                        src={item.imgUrl}
                        fallbackSrc={"resources/images/fallback.png"}
                        width={"auto"}
                        style={isAdmin ? { marginTop: "-36px" } : undefined}
                        fit={"contain"}
                    />
                </Card.Section>
                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>{item.name}</Text>
                    {item.price && <Badge color="green">{formatPrice(item.price)}</Badge>}
                </Group>

                <Text size="sm" c="dimmed">
                    {item.description}
                </Text>

                <Button color="blue" fullWidth mt="md" radius="md">
                    I want this!
                </Button>
            </Card>
            <ConfirmDeleteListingDialog opened={deleteDialogOpened} item={item} onClose={toggleDeleteDialog}></ConfirmDeleteListingDialog>
            <ListingPanel item={item} isOpen={editPanelOpened} onDismiss={toggleEditPanel} ></ListingPanel>
        </>
    )
}