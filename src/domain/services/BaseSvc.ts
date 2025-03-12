import { AxiosRequestConfig } from "axios";
import { ISvcOptions } from "./ISvcOptions";

export class BaseSvc {

    // private userContext;
    private options?: ISvcOptions;
    private static defaultOptions: ISvcOptions = {
        headers: {
            Accept: "application/json",
        }
    };

    constructor(/* user context here */ options?: ISvcOptions) {
        this.options = options || BaseSvc.defaultOptions;
    }

    private initAxiosConfig = (): AxiosRequestConfig => {
        const config: AxiosRequestConfig = this.options ?? BaseSvc.defaultOptions;
        return config;
    }

    protected axiosGetConfig = (url: string): AxiosRequestConfig => {
        const config: AxiosRequestConfig = this.initAxiosConfig();
        config.method = "get";
        config.url = url;
        return config;
    }

    protected axiosPutConfig = <TPutData>(url: string, data: TPutData): AxiosRequestConfig => {
        const config: AxiosRequestConfig = this.initAxiosConfig();
        config.method = "put";
        config.url = url;
        config.data = data;
        return config;
    }


    protected axiosDeleteConfig = (url: string): AxiosRequestConfig => {
        const config: AxiosRequestConfig = this.initAxiosConfig();
        config.method = "delete";
        config.url = url;
        return config;
    }

    protected axiosPatchConfig = <TPutData>(url: string, data: TPutData): AxiosRequestConfig => {
        const config: AxiosRequestConfig = this.initAxiosConfig();
        config.method = "patch";
        config.url = url;
        config.data = data;
        return config;
    }
}