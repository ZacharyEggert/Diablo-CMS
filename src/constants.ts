export const PORT = process.env.PORT || 4000;

export const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
export const POSTGRES_DB = process.env.POSTGRES_DB || 'postgres';
export const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
export const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || '5432');

export const REVERB_API_KEY = process.env.REVERB_API_KEY;

export const ROOTDIRNAME = __dirname;