import qs from "qs";

export const config = {
    timeout: 10000,
    baseUrl: "http://localhost:3000/",
    headers: {
        common: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        post: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        get: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    },
    paramsSerializer: (params: string) =>
        qs.stringify(params, { indices: false }),
};
