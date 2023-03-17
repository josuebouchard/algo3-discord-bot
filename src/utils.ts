export const emailIsValid = (email: string) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const padronIsValid = (padron: string) => {
    const minimumPadronLength = 5;
    const maximumPadronLength = 6;
    return (
        padron.length >= minimumPadronLength &&
        padron.length <= maximumPadronLength &&
        isFinite(parseInt(padron))
    );
};
