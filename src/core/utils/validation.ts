import mongoose from "mongoose";

export const checkValidUrl = (url: string) => {
    const urlPattern = /^(http:\/\/|https:\/\/)/i;
    return urlPattern.test(url);
};

export const isValidObjectId = (id: string) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// export const checkValidUrl = (url: string | undefined): boolean => {
//     if (!url) return false;

//     try {
//         const parsedUrl = new URL(url);

//         // check for valid protocols
//         const validProtocols = ['http:', 'https:'];
//         if (!validProtocols.includes(parsedUrl.protocol)) {
//             return false;
//         }

//         // checking for non-empty hostname
//         return parsedUrl.hostname.length > 0;
//     } catch (error) {
//         return false;
//     }
// };
