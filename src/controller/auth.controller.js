import { User } from "../model/user.model.js";
import { hashPassword, comparePassword } from "../service/utils/bcrypt.js";
import { generateToken } from "../service/utils/jwt.js";
import userError from "../utils/userError.js";
import httpResponse from "../utils/httpResponse.js";
import httpError from "../utils/httpError.js";

export const signUp = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) return userError(req, res, 400, 'Please fill in all fields');
        if (password.length < 6) return userError(req, res, 400, 'Password must be at least 6 characters long');

        const user = await User.findOne({ email });
        if (user) return userError(req, res, 409, 'User already exists');

        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();

        return httpResponse(req, res, 201, newUser, "User created successfully");
    } catch (err) {
        return httpError(next, req, res, err);
    }
};

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return userError(req, res, 400, 'Please fill in all fields');

        const user = await User.findOne({ email }).select('+password');
        if (!user) return userError(req, res, 401, 'Invalid credentials');

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return userError(req, res, 401, 'Invalid credentials');

        const token = generateToken({ id: user._id });
        user.password = undefined;

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        httpResponse(req, res, 200, user, `Welcome back ${user.name}`);

    } catch (err) {
        return httpError(next, req, res, err);
    }
}

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('token');
        return httpResponse(req, res, 200, null, 'User logged out successfully');
    } catch (err) {
        return httpError(next, req, res, err);
    }
}