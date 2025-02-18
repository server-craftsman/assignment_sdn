import bcryptjs from 'bcryptjs';

export const encodePasswordUserNormal = async (password: string) => {
    const salt = await bcryptjs.genSalt(10); // generate salt with 10 rounds
    const hashedPassword = await bcryptjs.hash(password!, salt); // hash password with salt to decode password
    return hashedPassword;
};
