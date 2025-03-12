import { useMemo } from "react";
import { Listing } from "./Listing";
import { InventorySvc } from "../domain/services/InventorySvc";
import { SimpleGrid } from "@mantine/core";
import { useApiRequest } from "../domain/services/ApiRequest";
import { InventoryItem } from "../domain/types/InventoryItem";


export const Inventory = (): JSX.Element => {
    const inventorySvc = useMemo(() => {
        return new InventorySvc();
    }, []);

    const { data, isLoading } = useApiRequest(inventorySvc.getInventory());
    const inventory = useMemo(() => {
        if (!data) return [];
        return data.map((item: InventoryItem) => {
            return {
                ...item,
                imgUrl: "resources/img/fallback.png"
            }
        });
    }, [data])



    return (
        <>
            {isLoading && <div>Loading...</div>}
            {!isLoading && inventory.length == 0 && <div>"No inventory!"</div>}
            {!isLoading && inventory && <SimpleGrid cols={3}>
                {
                    inventory.map((item) => {
                        return (
                            <Listing {...item} />
                        )
                    }
                    )
                }
            </SimpleGrid>}
        </>
    );
}