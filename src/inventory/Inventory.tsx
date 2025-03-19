import { useMemo } from "react";
import { Listing } from "./Listing";
import { InventorySvc } from "../domain/services/InventorySvc";
import { SimpleGrid } from "@mantine/core";
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
            {isLoading && <div>Loading...</div>}
            {!isLoading && !isError && inventory.length == 0 && <div>"No inventory!"</div>}
            {!isLoading && isError && <div>Network error!</div>}
            {!isLoading && !isError && <SimpleGrid cols={3}>
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