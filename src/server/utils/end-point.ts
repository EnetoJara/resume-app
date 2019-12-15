/**
 * This class specifies the end response that the client will receive.
 * @class
 * @public
 * @author Ernesto Jara Olveda
 */
export class EndPointResponse {
    /**
     * Creates an instance of end point response.
     * @author Ernesto Jara Olveda
     * @param {number} code - http status code.
     * @param {string} message - small text explaining the overall result.
     * @param {any} [data] - any sort of payload.
     */
    public constructor (
        public code: number,
        public message: string,
        public data?: any
    ) {}
}
