import { useMemo } from "react";
import { Listing } from "./Listing";
import { InventorySvc } from "../domain/services/InventorySvc";
import { SimpleGrid } from "@mantine/core";
import { useApiRequest } from "../domain/services/ApiRequest";

export const Inventory = (): JSX.Element => {
    const inventorySvc = useMemo(() => {
        return new InventorySvc();
    }, []);

    const { data, isLoading } = useApiRequest(inventorySvc.getInventory());

    const inventory = useMemo(() => {
        if (!data) return [];
        else return data;
    }, [data])

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {!isLoading && inventory.length == 0 && <div>"No inventory!"</div>}
            {!isLoading && inventory && <SimpleGrid cols={3}>
                {
                    inventory.map((item) => {
                        return (
                            <Listing item={item} key={item.id!.toString()} />
                        )
                    }
                    )
                }
            </SimpleGrid>}
        </>
    );
}