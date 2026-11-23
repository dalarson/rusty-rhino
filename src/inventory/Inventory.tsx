import { useMemo } from "react";
import { Listing } from "./Listing";
import { InventorySvc } from "../domain/services/InventorySvc";
import { SimpleGrid, Skeleton, Text, Title, Stack } from "@mantine/core";
import { useApiRequest } from "../domain/services/ApiRequest";
import { AddListing } from "./AddListing";
import { useAuth } from "../auth/useAuth";

export const Inventory = (): JSX.Element => {
    const { isAdmin } = useAuth();
    const inventorySvc = useMemo(() => {
        return new InventorySvc();
    }, []);

    const { data, isLoading, isError } = useApiRequest(inventorySvc.getInventory());

    const inventory = useMemo(() => {
        if (!data) return [];
        else return data;
    }, [data])

    return (
        <>
            <Title order={1} mb="xl">The Shop</Title>
            {isLoading && <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>{[0, 1, 2].map((i) => <Skeleton key={i} height={360} radius="lg" />)}</SimpleGrid>}
            {!isLoading && !isError && inventory.length == 0 && <Stack align="center" py={60}><Text c="dimmed">Nothing in the shop right now. Check back soon!</Text></Stack>}
            {!isLoading && isError && <Stack align="center" py={60}><Text c="red">Something went wrong loading the shop. Please try again.</Text></Stack>}
            {!isLoading && !isError && <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                {
                    inventory.map((item) => {
                        return (
                            <Listing item={item} key={item.id!.toString()} />
                        )
                    }
                    )
                }
                {isAdmin && <AddListing></AddListing>}
            </SimpleGrid>}
        </>
    );
}