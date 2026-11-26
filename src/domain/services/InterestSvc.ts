import { InterestEntry } from "../types/InterestEntry";
import { BaseSvc } from "./BaseSvc";
import { ApiRequest } from "./ApiRequest";
import { CacheKeys } from "./CacheKeys";

const interestUrl = `${import.meta.env.VITE_RUSTY_API_BASE_URL}/interest`;

export class InterestSvc extends BaseSvc {
    constructor() {
        super();
    }

    getInterest(): ApiRequest<InterestEntry[]> {
        const axiosConfig = this.axiosGetConfig(interestUrl);
        return new ApiRequest<InterestEntry[]>([CacheKeys.Interest], axiosConfig);
    }

    getInterestById(id: string): ApiRequest<InterestEntry> {
        const axiosConfig = this.axiosGetConfig(`${interestUrl}/${id}`);
        return new ApiRequest<InterestEntry>([CacheKeys.Interest, id], axiosConfig);
    }

    setAddressed(id: string, addressed: boolean): ApiRequest<void> {
        const axiosConfig = this.axiosPatchConfig(`${interestUrl}/${id}/addressed`, { addressed });
        return new ApiRequest<void>([CacheKeys.Interest, id], axiosConfig);
    }

    postInterest(inquiry: InterestEntry): ApiRequest<void> {
        const axiosConfig = this.axiosPostConfig(interestUrl, inquiry, "application/json");
        return new ApiRequest<void>([CacheKeys.Interest], axiosConfig);
    }

    deleteInterest(id: string): ApiRequest<void> {
        const axiosConfig = this.axiosDeleteConfig(`${interestUrl}/${id}`);
        return new ApiRequest<void>([CacheKeys.Interest], axiosConfig);
    }
}
