import * as FileSystem from "fs";

export const write = (filePath: string, data: any) => {
  try {
    FileSystem.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return {message: "Encrypted!"};
  } catch (exception) {
    throw new Error(exception.message);
  }
};

export const read = (filePath: string) => {
  try {
    const data = FileSystem.readFileSync(filePath);
    return JSON.parse(data.toString());
  } catch (exception) {
    throw new Error(exception.message);
  }
};
