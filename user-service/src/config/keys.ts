
import dotenv from 'dotenv';
dotenv.config();



export const keys = {
    mongoURI: process.env.MONGO_URI || 'error',
    jwtSecret: process.env.JWT_SECRET || 'error',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || 'error',
    bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS || 'error'
};
