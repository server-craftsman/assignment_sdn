export const formatResponse = <T>(data: T, success: boolean = true) => {
    return {
        success,
        data,
    };
};

export const isEmptyObject = (obj: any): boolean => {
    return !Object.keys(obj).length;
};