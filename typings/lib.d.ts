/// <reference types="node" />

declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly PUBLIC_URL: string;
        readonly DB_USER: string;
        readonly DB_PASSWORD: string;
        readonly DB_NAME: string;
        readonly DB_HOST: string;
        readonly DB_PORT: string;
        readonly PORT: string;
        readonly DIALET: "mysql" | "postgres" | "sqlite" | "mariadb" | "mssql" | undefined;
    }
  }
