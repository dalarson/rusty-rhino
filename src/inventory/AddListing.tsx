import { ActionIcon, Card, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from '@mantine/hooks';
import { ListingPanel } from "./ListingPanel";

export const AddListing = (): JSX.Element => {

    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Card shadow={'xs'} padding={'md'} radius={'md'} withBorder >
                <Group justify="center" style={{
                    height: "100%"
                }}>
                    < ActionIcon variant="filled" aria-label="Add" size={"input-xl"} onClick={open}>
                        <IconPlus style={{ width: '100%', height: '100%' }} stroke={1.5} />
                    </ActionIcon>
                </Group >
            </Card >
            <ListingPanel isOpen={opened} onDismiss={close}></ListingPanel>
        </>
    )
}