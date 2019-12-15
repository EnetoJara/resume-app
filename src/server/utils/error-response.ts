export class ErrorResponse extends Error {
    public constructor (
        public code: number,
        public message: string,
        public data?: any
    ) {
        super(message);
    }
}
