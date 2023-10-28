const knex = require("../config/db");
const { PRACTICE_DETAILS, COLOR_DATA } = require("../constants/constant");
const { verifyToken } = require("../helpers/common");
const { readInviteStaffTemplate } = require("../services/emailService");
const {
  isUserExist,
  selectAllData,
  insertData,
  selectFirstData,
  deleteData,
  updateData,
} = require("./dbService");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const { getRandomNumber } = require("./commonService");
const API_URL = process.env.API_URL;

module.exports = {
  getPracticeUserDetail,
  updatePracticeUser,
  addPracticeStaffUser,
  getPracticeStaffUser,
  updatePracticeStaffUser,
  deletePracticeStaffUser,
  verifyStaffUser,
  setPasswordStaffUser,
  updatePracticeStaffStatusUser,
  changePasswordLoginUser,
  getPracticeStaffSchedulerUser,
  getTimeoutUser,
  updateTimeoutUser,
  resendEmailUser,
  uploadImageLoginUser,
  getImageLoginUser,
  deleteImageLoginUser,
};

// Function to get practice details
async function getPracticeUserDetail(userId) {
  return new Promise(async function (resolve, reject) {
    try {
      const userData = await knex("tenants")
        .where({
          id: userId,
        })
        .select(PRACTICE_DETAILS)
        .first();
      if (userData) {
        return resolve(userData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update practice details
async function updatePracticeUser(userId, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const data = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        practiceName: payload.practiceName,
        specialization: payload.specialization,
        addressLine1: payload.addressLine1,
        addressLine2: payload.addressLine2,
        city: payload.city,
        state: payload.state,
        country: payload.country,
        pincode: payload.pincode,
        licenseNumber: payload.licenseNumber,
        timeout: payload.timeout,
        updatedAt: new Date(),
      };

      if (await isUserExist(userId)) {
        const phoneExist = await knex("tenants")
          .where({
            phone: payload.phone,
          })
          .select("*")
          .first();

        if (phoneExist && phoneExist.id !== userId) {
          return reject("Phone Number already registered!");
        } else {
          const updateRes = await knex("tenants")
            .where({ id: userId })
            .update(data);
          if (updateRes) {
            return resolve(updateRes);
          } else {
            return reject("Something went wrong!");
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

// Function to get Practice Staff
async function getPracticeStaffUser(userId, practiceLink) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const data = await selectAllData(practiceLink, "*", "staff");
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

// Function to get Practice Staff Scheduler
async function getPracticeStaffSchedulerUser(userId, practiceLink) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const data = await selectAllData(practiceLink, "*", "staff");
        const filterData = data.filter(
          (item) =>
            item.isDeleted !== true &&
            item.status === "active" &&
            item.type === "practitioner"
        );
        return resolve(filterData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to add Practice Staff
async function addPracticeStaffUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const emailWhere = {
          email: payload.email.toLowerCase(),
        };
        const emailExistTenants = await selectFirstData(
          "public",
          "*",
          "tenants",
          emailWhere
        );

        const phoneWhere = {
          phone: payload.phone,
        };
        const phoneExistTenants = await selectFirstData(
          "public",
          "*",
          "tenants",
          phoneWhere
        );

        if (
          emailExistTenants &&
          emailExistTenants.practiceLink === practiceLink
        ) {
          return reject("Email already registered!");
        } else if (
          phoneExistTenants &&
          phoneExistTenants.practiceLink === practiceLink
        ) {
          return reject("Phone Number already registered!");
        } else {
          const emailExistStaff = await selectFirstData(
            practiceLink,
            "*",
            "staff",
            emailWhere
          );

          const phoneExistStaff = await selectFirstData(
            practiceLink,
            "*",
            "staff",
            phoneWhere
          );

          if (emailExistStaff || phoneExistStaff) {
            if (emailExistStaff) {
              return reject("Email already registered!");
            }
            if (phoneExistStaff) {
              return reject("Phone Number already registered!");
            }
          } else {
            if (payload.type === "practitioner") {
              const providerWhere = {
                providerNumber: payload.providerNumber,
              };
              const providerExist = await selectFirstData(
                practiceLink,
                "*",
                "staff",
                providerWhere
              );
              if (providerExist) {
                return reject("Provider Number already used!");
              }
            }

            const randomNumber = await getRandomNumber(1, 10);
            const colorData = COLOR_DATA.find(
              (item) => item.id === randomNumber
            );

            const staffData = {
              name: payload.name,
              email: payload.email.toLowerCase(),
              phone: payload.phone,
              treoAccess: payload.treoAccess,
              dailyScheduleSms: payload.dailyScheduleSms,
              dailyScheduleEmail: payload.dailyScheduleEmail,
              userId: userId,
              created_at: new Date(),
              updated_at: new Date(),
              type: payload.type,
              status: "pending",
              color: colorData.color,
              colorClass: colorData.class,
              timeout: 1800,
            };
            if (payload.type === "practitioner") {
              staffData.providerNumber = payload.providerNumber;
              staffData.appointmentsConfirmationSms =
                payload.appointmentsConfirmationSms;
              staffData.appointmentsConfirmationEmail =
                payload.appointmentsConfirmationEmail;
            }

            const result = await insertData(
              practiceLink,
              staffData,
              ["id", "email"],
              "staff"
            );
            if (result.length > 0) {
              const data = result[0];
              const userName = payload.name;
              const subject = "Welcome to Treo!";
              const emailRes = await readInviteStaffTemplate(
                data.id,
                userName,
                data.email,
                practiceLink,
                subject
              );
              if (emailRes) {
                return resolve(emailRes);
              } else {
                return reject("Server error!");
              }
            } else {
              return reject("Server error! Please try again");
            }
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

// Function to update Practice Staff
async function updatePracticeStaffUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const staffWhere = {
          id: payload.id,
        };
        const staffExist = await selectFirstData(
          practiceLink,
          "*",
          "staff",
          staffWhere
        );
        if (staffExist && staffExist.isDeleted !== true) {
          const emailWhere = {
            email: payload.email.toLowerCase(),
          };
          const emailExist = await selectFirstData(
            practiceLink,
            "*",
            "staff",
            emailWhere
          );

          const phoneWhere = {
            phone: payload.phone,
          };
          const phoneExist = await selectFirstData(
            practiceLink,
            "*",
            "staff",
            phoneWhere
          );

          if (emailExist && emailExist.id !== Number(payload.id)) {
            return reject("Email already registered!");
          } else if (phoneExist && phoneExist.id !== Number(payload.id)) {
            return reject("Phone Number already registered!");
          } else {
            if (payload.type === "practitioner") {
              const providerWhere = {
                providerNumber: payload.providerNumber,
              };
              const providerExist = await selectFirstData(
                practiceLink,
                "*",
                "staff",
                providerWhere
              );
              if (providerExist && providerExist.id !== Number(payload.id)) {
                return reject("Provider Number already used!");
              }
            }

            const staffData = {
              name: payload.name,
              email: payload.email.toLowerCase(),
              phone: payload.phone,
              treoAccess: payload.treoAccess,
              dailyScheduleSms: payload.dailyScheduleSms,
              dailyScheduleEmail: payload.dailyScheduleEmail,
              updated_at: new Date(),
            };
            if (payload.type === "practitioner") {
              staffData.providerNumber = payload.providerNumber;
              staffData.appointmentsConfirmationSms =
                payload.appointmentsConfirmationSms;
              staffData.appointmentsConfirmationEmail =
                payload.appointmentsConfirmationEmail;
            }

            const result = await updateData(
              practiceLink,
              staffData,
              ["id", "email"],
              "staff",
              staffWhere
            );
            if (result.length > 0) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          }
        } else {
          return reject("No staff found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to delete Practice Staff
async function deletePracticeStaffUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const staffWhere = {
          id: payload.staffId,
        };
        const result = await deleteData(practiceLink, "staff", staffWhere);
        if (result) {
          return resolve(result);
        } else {
          return reject("Something went wrong!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to Verify Practice Staff
async function verifyStaffUser(payload, origin) {
  return new Promise(async function (resolve, reject) {
    try {
      // For local login
      let originName = origin;
      if (originName.includes("localhost")) {
        originName = "http://testpractice.treo.cloud";
      }

      const originData = originName ? originName.split(".") : [];
      if (originData.length === 3) {
        const practiceLinkOrigin = originData[0];
        const practiceLinkData = practiceLinkOrigin
          ? practiceLinkOrigin.split("//")
          : [];
        const practiceLink = practiceLinkData[1];
        const idWhere = {
          id: payload.id,
        };
        const staffData = await selectFirstData(
          practiceLink,
          "*",
          "staff",
          idWhere
        );

        if (staffData) {
          if (staffData.isVerified === true) {
            return reject("Link already used!");
          } else {
            const result = await verifyToken(payload.token);
            if (result) {
              return resolve(result);
            } else {
              return reject("Token is invalid!");
            }
          }
        } else {
          return reject("Staff not found!");
        }
      } else {
        return reject("Unauthorized! Please contact with Administrator");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to Verify Practice Staff
async function setPasswordStaffUser(payload, origin) {
  return new Promise(async function (resolve, reject) {
    try {
      // For local login
      let originName = origin;
      if (originName.includes("localhost")) {
        originName = "http://testpractice.treo.cloud";
      }

      const originData = originName ? originName.split(".") : [];
      if (originData.length === 3) {
        const practiceLinkOrigin = originData[0];
        const practiceLinkData = practiceLinkOrigin
          ? practiceLinkOrigin.split("//")
          : [];
        const practiceLink = practiceLinkData[1];
        const idWhere = {
          id: payload.id,
        };
        const staffData = await selectFirstData(
          practiceLink,
          "*",
          "staff",
          idWhere
        );

        if (staffData) {
          const encryptedPassword = await bcrypt.hash(payload.password, salt);
          const passwordData = {
            isVerified: true,
            status: "active",
            password: encryptedPassword,
          };
          const result = await updateData(
            practiceLink,
            passwordData,
            ["id", "email"],
            "staff",
            idWhere
          );
          if (result.length > 0) {
            result[0].practiceLink = practiceLink;
            return resolve(result[0]);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("Staff not found!");
        }
      } else {
        return reject("Unauthorized! Please contact with Administrator");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update practitioner status
async function updatePracticeStaffStatusUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const staffWhere = {
          id: payload.id,
        };

        const staffExist = await selectFirstData(
          practiceLink,
          "*",
          "staff",
          staffWhere
        );

        if (staffExist) {
          const staffData = {
            status: payload.active === true ? "active" : "inactive",
            updated_at: new Date(),
          };

          const result = await updateData(
            practiceLink,
            staffData,
            ["id", "status", "type"],
            "staff",
            staffWhere
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No staff found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to change tenant password
async function changePasswordLoginUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const where = {
          id: payload.id,
        };
        const encryptedPassword = await bcrypt.hash(payload.newPassword, salt);

        if (payload.userType === "admin") {
          const tenantExist = await selectFirstData(
            "public",
            "*",
            "tenants",
            where
          );
          if (tenantExist && tenantExist.isDeleted != true) {
            const oldPasswordMatch = await bcrypt.compare(
              payload.oldPassword,
              tenantExist.password
            );

            if (oldPasswordMatch) {
              const newPasswordMatch = await bcrypt.compare(
                payload.newPassword,
                tenantExist.password
              );
              if (!newPasswordMatch) {
                if (
                  payload.newPassword.length >= 8 &&
                  payload.newPassword.length <= 20
                ) {
                  const tenantData = {
                    password: encryptedPassword,
                    updatedAt: new Date(),
                  };
                  const result = await updateData(
                    "public",
                    tenantData,
                    ["id", "email"],
                    "tenants",
                    where
                  );
                  if (result.length > 0) {
                    return resolve(result);
                  }
                } else {
                  return reject("Password must be 8 characters");
                }
              } else {
                return reject("New password cannot be same as old password");
              }
            } else {
              return reject("Old password is incorrect");
            }
          } else {
            return reject("Invalid user");
          }
        } else {
          const staffExist = await selectFirstData(
            practiceLink,
            "*",
            "staff",
            where
          );
          if (staffExist && staffExist.isDeleted != true) {
            const oldPasswordMatch = await bcrypt.compare(
              payload.oldPassword,
              staffExist.password
            );

            if (oldPasswordMatch) {
              const newPasswordMatch = await bcrypt.compare(
                payload.newPassword,
                staffExist.password
              );
              if (!newPasswordMatch) {
                if (
                  payload.newPassword.length >= 8 &&
                  payload.newPassword.length <= 20
                ) {
                  const staffData = {
                    password: encryptedPassword,
                    updated_at: new Date(),
                  };
                  const result = await updateData(
                    practiceLink,
                    staffData,
                    ["id", "email"],
                    "staff",
                    where
                  );
                  if (result.length > 0) {
                    return resolve(result);
                  }
                } else {
                  return reject("Password must be 8 characters");
                }
              } else {
                return reject("New password cannot be same as old password");
              }
            } else {
              return reject("Old password is incorrect");
            }
          } else {
            return reject("Invalid user");
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

// Function to get tenant timeout
async function getTimeoutUser(authData, type, access) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(authData.userId)) {
        let userData;
        if (type === "admin" || (type === "other" && access === "front-desk")) {
          userData = await knex("tenants")
            .where({
              id: authData.userId,
            })
            .first("timeout");
        } else {
          const where = {
            id: authData.loginUserId,
          };
          userData = await selectFirstData(
            authData.practiceLink,
            "timeout",
            "staff",
            where
          );
        }
        if (userData) {
          return resolve(userData);
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update staff timeout
async function updateTimeoutUser(authData, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(authData.userId)) {
        const data = {
          timeout: payload.timeout,
        };
        const where = {
          id: authData.loginUserId,
        };
        const result = await updateData(
          authData.practiceLink,
          data,
          ["id", "timeout"],
          "staff",
          where
        );
        if (result.length > 0) {
          return resolve(result);
        } else {
          return reject("Server error! Please try again");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to resend email
async function resendEmailUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const staffWhere = {
          id: payload.staffId,
        };
        const staffExist = await selectFirstData(
          practiceLink,
          "*",
          "staff",
          staffWhere
        );

        if (staffExist) {
          const subject = "Welcome to Treo!";
          const emailRes = await readInviteStaffTemplate(
            staffExist.id,
            staffExist.name,
            staffExist.email,
            practiceLink,
            subject
          );
          if (emailRes) {
            return resolve(emailRes);
          } else {
            return reject("Server error!");
          }
        } else {
          return reject("Server error! Please try again");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to upload login user image
async function uploadImageLoginUser(
  userId,
  practiceLink,
  loginUserId,
  file,
  userType
) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const where = {
          id: loginUserId,
        };

        if (userType === "admin") {
          const tenantExist = await selectFirstData(
            "public",
            "*",
            "tenants",
            where
          );
          if (tenantExist && tenantExist.isDeleted != true) {
            const tenantImagePath = file.path.replace(/\\/g, "/");
            const tenantImageActualPath = tenantImagePath.replace("public", "");

            const tenantData = {
              image: `${API_URL}/v1${tenantImageActualPath}`,
              updatedAt: new Date(),
            };

            const result = await updateData(
              "public",
              tenantData,
              ["id", "image"],
              "tenants",
              where
            );
            if (result.length > 0) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          } else {
            return reject("Invalid user");
          }
        } else {
          const staffExist = await selectFirstData(
            practiceLink,
            "*",
            "staff",
            where
          );
          if (staffExist && staffExist.isDeleted != true) {
            const staffImagePath = file.path.replace(/\\/g, "/");
            const staffImageActualPath = staffImagePath.replace("public", "");

            const staffData = {
              image: `${API_URL}/v1${staffImageActualPath}`,
              updated_at: new Date(),
            };

            const result = await updateData(
              practiceLink,
              staffData,
              ["id", "image"],
              "staff",
              where
            );
            if (result.length > 0) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          } else {
            return reject("Invalid user");
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

// Function to get user image
async function getImageLoginUser(practiceLink, loginUserId, userType) {
  return new Promise(async function (resolve, reject) {
    try {
      const where = {
        id: loginUserId,
      };
      if (userType === "admin") {
        const tenantExist = await selectFirstData(
          "public",
          ["id", "image"],
          "tenants",
          where
        );
        if (tenantExist && tenantExist.isDeleted != true) {
          return resolve(tenantExist);
        } else {
          return reject("No user found!");
        }
      } else {
        const staffExist = await selectFirstData(
          practiceLink,
          ["id", "image"],
          "staff",
          where
        );
        if (staffExist && staffExist.isDeleted != true) {
          return resolve(staffExist);
        } else {
          return reject("Invalid user");
        }
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to delete user image
async function deleteImageLoginUser(practiceLink, loginUserId, userType) {
  return new Promise(async function (resolve, reject) {
    try {
      const where = {
        id: loginUserId,
      };

      if (userType === "admin") {
        const tenantExist = await selectFirstData(
          "public",
          "*",
          "tenants",
          where
        );
        if (tenantExist && tenantExist.isDeleted != true) {
          const tenantData = {
            image: null,
            updatedAt: new Date(),
          };
          const result = await updateData(
            "public",
            tenantData,
            ["id", "image"],
            "tenants",
            where
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No user found!");
        }
      } else {
        const staffExist = await selectFirstData(
          practiceLink,
          "*",
          "staff",
          where
        );
        if (staffExist && staffExist.isDeleted != true) {
          const staffData = {
            image: null,
            updated_at: new Date(),
          };
          const result = await updateData(
            practiceLink,
            staffData,
            ["id", "image"],
            "staff",
            where
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("Invalid user");
        }
      }
    } catch (error) {
      return reject(error);
    }
  });
}
