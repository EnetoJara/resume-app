import qs from "qs";

export const config = {
    returnRejectedPromiseOnError: true,
    withCredentials: true,
    timeout: 10000,
    baseURL: "http://localhost:3001",
    headers: {
        "Cache-control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json; charset=utf-8",
        "X-Powered-By": "Express"
    },
    paramsSerializer: (params: string) =>
        qs.stringify(params, { indices: false })
};
