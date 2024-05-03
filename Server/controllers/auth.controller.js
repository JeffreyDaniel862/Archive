import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

export const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    try {
        const user = await User.create({ username, email, password: hashedPassword });
        res.json({message: "SignUp Successfull"});
    } catch (error) {
        res.send(error.errors[0].message);
    }
}