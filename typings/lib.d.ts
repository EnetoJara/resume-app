/// <reference types="node" />
/// <reference types="express" />

declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly PUBLIC_URL: string;
        readonly SERVER_DB_USER: string;
        readonly SERVER_DB_PASSWORD: string;
        readonly SERVER_DB_NAME: string;
        readonly SERVER_DB_HOST: string;
        readonly SERVER_DB_PORT: string;
        readonly SERVER_PORT: string;
        readonly CLIENT_HOME_ROUTE: string;
        readonly CLIENT_LOGIN_ROUTE: string;
        readonly CLIENT_REGISTER_ROUTE: string;
        readonly ROUTE_REGISTER: PathParams;
        readonly ROUTE_LOGIN: PathParams;
        readonly ROUTE_GET_ALL_USERS: PathParams;
        readonly ROUTE_GET_SKILLS: PathParams;
        readonly ROUTE_GET_SKILL_TYPE_BY_ID: PathParams;
        readonly SERVER_DIALET: "mysql" | "postgres" | "sqlite" | "mariadb" | "mssql" | undefined;
    }
  }
