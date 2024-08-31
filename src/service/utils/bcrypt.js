import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 11);
}

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}