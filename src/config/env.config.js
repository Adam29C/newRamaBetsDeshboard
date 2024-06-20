import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const {
  PORT = 3009,
  DB = '',
  JWT_SECRET = '',
  JWT_EXPIRES_IN = 43200000
} = process.env;

export { PORT, DB, JWT_SECRET, JWT_EXPIRES_IN };
