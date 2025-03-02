import { useEffect, useState } from "react";
import { InventoryItem } from "../domain/types/InventoryItem";
import { TempContentSvc } from "../domain/services/TempContentSvc";
import { Listing } from "./Listing";
import { useAuth } from "../auth/useAuth";

export const Inventory = (): JSX.Element => {
    const { isAdmin } = useAuth();
    const tempContentSvc = new TempContentSvc();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    useEffect(() => {
        // call getInventory from TempContentSvc
        tempContentSvc.getInventory().then((data) => {
            console.log(inventory);
            setInventory(data);
        }).catch((error: Error) => {
            console.log(error);
            // TODO: render error message
        })
    }, []);

    return (
        <>
            {
                inventory.map((item) => {
                    return (
                        <Listing {...item} />
                    )
                }
                )
            }
        </>
    );
}