import { AxiosRequestConfig } from "axios";

export class BaseSvc {

    // private userContext;
    constructor(/* user context here */) {
    }

    private initAxiosConfig = (): AxiosRequestConfig => {
        const config = {}
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

    protected axiosPostConfig = <TPostData>(url: string, data: TPostData) => {
        const config: AxiosRequestConfig = this.initAxiosConfig();
        config.method = "post";
        config.url = url;
        config.data = data;
        config.headers = {
            "Content-Type": "multipart/form-data"
        }
        console.log(config);
        return config;
    }
}