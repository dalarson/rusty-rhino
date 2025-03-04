import { useEffect, useState } from "react";
import { InventoryItem } from "../domain/types/InventoryItem";
import { Listing } from "./Listing";
import { TempInventorySvc } from "../domain/services/TempInventorySvc";
import { SimpleGrid } from "@mantine/core";


export const Inventory = (): JSX.Element => {
    const tempContentSvc = new TempInventorySvc();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    useEffect(() => {
        // call getInventory from TempContentSvc
        tempContentSvc.getInventory().then((data: InventoryItem[]) => {
            setInventory(data);
        }).catch((error: Error) => {
            console.log(error);
            // TODO: render error message
        })
    }, []);

    return (
        <SimpleGrid cols={3}>
            {
                inventory.map((item) => {
                    return (
                        <Listing {...item} />
                    )
                }
                )
            }
        </SimpleGrid>
    );
}