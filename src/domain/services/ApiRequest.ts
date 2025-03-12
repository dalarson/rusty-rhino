import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { QueryKey, useQuery } from "react-query";

export class ApiRequest<T> {

    readonly cacheKey: QueryKey | undefined;
    private readonly axiosConfig: AxiosRequestConfig;

    constructor(cacheKey: QueryKey | undefined, axiosConfig: AxiosRequestConfig) {
        this.cacheKey = cacheKey;
        this.axiosConfig = axiosConfig;
    }

    execute = async (): Promise<T> => {
        const response = await axios.request<T>(this.axiosConfig);
        return (response.data);

    }
}

export const useApiRequest = <T>(apiRequest: ApiRequest<T>) => {
    return useQuery<T, AxiosError | Error>({
        queryKey: apiRequest.cacheKey,
        queryFn: () => {
            return apiRequest.execute();
        }
    })
}