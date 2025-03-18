import { InventoryItem } from "../types/InventoryItem";
import { AxiosRequestConfig } from "axios";
import { BaseSvc } from "./BaseSvc";
import { ApiRequest } from "./ApiRequest";
import { CacheKeys } from "./CacheKeys";

/**
 * API Class to interact with the rusty-api inventory svc.
 */
const inventoryUrl = `${import.meta.env.VITE_RUSTY_API_BASE_URL}/inventory`;
const imgUrl = `${import.meta.env.VITE_RUSTY_API_BASE_URL}/img`;
export class InventorySvc extends BaseSvc {
    constructor() {
        super();
    }

    addInventoryItem(item: InventoryItem): ApiRequest<string> {
        const axiosConfig: AxiosRequestConfig<string> = this.axiosPutConfig(inventoryUrl, item);
        return new ApiRequest<string>(undefined, axiosConfig);
    }
    patchInventoryItoryItem(item: InventoryItem): ApiRequest<string> {
        const axiosConfig = this.axiosPatchConfig(`${inventoryUrl}/${item.id!.toString()}`, item);
        return new ApiRequest<string>(undefined, axiosConfig);
    }
    deleteInventoryItem(id: string): ApiRequest<void> {
        const axiosConfig = this.axiosDeleteConfig(`${inventoryUrl}/${id}`);
        return new ApiRequest<void>(undefined, axiosConfig);
    }

    getInventory(): ApiRequest<InventoryItem[]> {
        const axiosConfig = this.axiosGetConfig(inventoryUrl);
        return new ApiRequest<InventoryItem[]>([CacheKeys.Inventory], axiosConfig);
    }

    uploadImage(file: File): ApiRequest<string> {
        const formData: FormData = new FormData();
        formData.append("file", file);
        const axiosConfig = this.axiosPostConfig(imgUrl, formData);
        return new ApiRequest<string>(undefined, axiosConfig);
    }
}