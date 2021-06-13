const fs = require("fs/promises");

const isAccesible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccesible(folder))) {
    await fs.mkdir(folder);
  }
};

module.exports = createFolderIsNotExist;
