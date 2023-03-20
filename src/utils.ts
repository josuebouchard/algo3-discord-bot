import fs from "node:fs"
import path from "node:path";

export const emailIsValid = (email: string) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const padronIsValid = (padron: number) => {
    const minimumPadronLength = 5;
    const maximumPadronLength = 6;

    const stringPadron = padron.toString();

    return (
        stringPadron.length >= minimumPadronLength &&
        stringPadron.length <= maximumPadronLength
    );
};

type LoadDynamicFilesParams = {
    fileExtension: string,
    ignoreFilesStartingWith: string,
    isExportDefault: boolean
}

export const loadDynamicFiles = <T>(
    folderPath: string,
    options?: Partial<LoadDynamicFilesParams>
) => {
    const defaultOptions = {
        fileExtension: ".js",
        ignoreFilesStartingWith: '_',
        isExportDefault: false
    };

    const { fileExtension, ignoreFilesStartingWith, isExportDefault } = options ? { ...defaultOptions, ...options } : defaultOptions;

    const resolvedFolderPath = path.resolve(__dirname, folderPath);
    const files = fs
        .readdirSync(resolvedFolderPath)
        .filter((fileName) => fileName.endsWith(fileExtension) && !fileName.startsWith(ignoreFilesStartingWith))
        .map((fileName) => {
            const filePath = path.resolve(resolvedFolderPath, fileName);
            const file = isExportDefault ? require(filePath)["default"] : require(filePath);
            return file as T;
        });

    return files;
}