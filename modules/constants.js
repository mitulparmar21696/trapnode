const BASE_URL = "http://localhost:3000/";
const VERSION = Date.now();

const MAIL_FROM = 'HappyMeter <happymeterdevs@gmail.com>';
const MAIL_FROM_AUTH = 'happymeterdevs@gmail.com';
const MAIL_PASSWORD = 'Happy@123*';
const MAIL_HOST = 'smtp.gmail.com';
const MAIL_PORT = '465';
const MAIL_METHOD = 'SMTP';
const MAIL_SECURE = true;


module.exports = {
    BASE_URL: BASE_URL,
    VERSION: VERSION,
    MAIL_FROM: MAIL_FROM,
    MAIL_FROM_AUTH: MAIL_FROM_AUTH,
    MAIL_PASSWORD: MAIL_PASSWORD,
    MAIL_HOST: MAIL_HOST,
    MAIL_PORT: MAIL_PORT,
    MAIL_METHOD: MAIL_METHOD,
    MAIL_SECURE: MAIL_SECURE,
};