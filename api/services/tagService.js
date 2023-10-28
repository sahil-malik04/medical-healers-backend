const knex = require("../config/db");
const {
  isUserExist,
  selectAllData,
  insertData,
  selectFirstData,
  updateData,
} = require("./dbService");

module.exports = {
  getTagsUser,
  addTagUser,
  updateTagUser,
  deleteTagUser,
  updateTagStatusUser,
};

// Function to get tags
async function getTagsUser(practiceLink, userId) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const data = await selectAllData(practiceLink, "*", "tags");
        const filterData = data.filter((item) => item.isDeleted !== true);
        const sortedData = filterData.sort(
          (x, y) => y.created_at - x.created_at
        );
        return resolve(sortedData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to add tag
async function addTagUser(practiceLink, userId, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const tagName = payload.name ? payload.name.trim() : "";
        const tagWhere = {
          name: tagName,
          isDeleted: false,
        };
        const isTagExist = await selectFirstData(
          practiceLink,
          "*",
          "tags",
          tagWhere
        );

        if (isTagExist) {
          return reject("Tag already exist!");
        } else {
          const tagsData = {
            name: tagName,
            type: payload.type,
            color: payload.color,
            textColor: payload.textColor,
            created_at: new Date(),
            updated_at: new Date(),
          };
          const result = await insertData(
            practiceLink,
            tagsData,
            ["id", "name"],
            "tags"
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update tag
async function updateTagUser(practiceLink, userId, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const nameToCheck = payload.name ? payload.name.trim() : "";
        const tagId = payload.id;
        const tagsData = await selectAllData(practiceLink, "*", "tags");
        const isTagExist = tagsData.find((item) => item.id === tagId);

        const nameExistsExceptId = tagsData
          .filter((obj) => obj.id !== tagId)
          .some((obj) => obj.name === nameToCheck);

        if (isTagExist) {
          if (nameExistsExceptId) {
            return reject("Tag already exist!");
          } else {
            const updatedTagsData = {
              name: nameToCheck,
              type: payload.type,
              color: payload.color,
              textColor: payload.textColor,
              updated_at: new Date(),
            };
            const idWhere = {
              id: payload.id,
            };
            const result = await updateData(
              practiceLink,
              updatedTagsData,
              ["id", "name"],
              "tags",
              idWhere
            );

            if (result.length > 0) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          }
        } else {
          return reject("No tag found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to delete tag
async function deleteTagUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const idWhere = {
          id: payload.tagId,
        };
        const isTagExist = await selectFirstData(
          practiceLink,
          "*",
          "tags",
          idWhere
        );

        if (isTagExist && isTagExist.isDeleted !== true) {
          const updatedTagsData = {
            isDeleted: true,
            updated_at: new Date(),
          };

          const result = await updateData(
            practiceLink,
            updatedTagsData,
            ["id", "isDeleted"],
            "tags",
            idWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject(
            "This tag cannot be deleted, Please contact Administrator"
          );
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update tag status
async function updateTagStatusUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const idWhere = {
          id: payload.id,
        };
        const isTagExist = await selectFirstData(
          practiceLink,
          "*",
          "tags",
          idWhere
        );

        if (isTagExist && isTagExist.isDeleted !== true) {
          const updatedTagsData = {
            isActive: payload.status,
            updated_at: new Date(),
          };

          const result = await updateData(
            practiceLink,
            updatedTagsData,
            ["id", "isActive"],
            "tags",
            idWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject(
            "This tag cannot be updated, Please contact Administrator"
          );
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
