const {
  isUserExist,
  selectAllData,
  selectAllDataCondition,
  selectFirstData,
  updateData,
  insertData,
} = require("./dbService");
const moment = require("moment/moment");
const API_URL = process.env.API_URL;

module.exports = {
  getPatientUser,
  getPatientByIdUser,
  createPatientUser,
  updatePatientUser,
  deletePatientUser,
  updatePatientStatusUser,
  uploadPatientImageUser,
  getRecentPatientsUser,
  createMedicalHistoryUser,
  deleteMedicalHistoryUser,
  getGenderUser,
  getGenderIdentityUser,
  getInsuranceLevelUser,
  getInsuranceFundUser,
  getIndigenousStatusUser,
  getPersonalPronounsUser,
  updatePatientThresholdsUser,
  deletePatientImageUser,
};

// Function to get patients
async function getPatientUser(userId, practiceLink) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const data = await selectAllData(practiceLink, "*", "patients");
        const filterData = data.filter((item) => item.isDeleted !== true);
        const sortedData = filterData.sort((x, y) => x.id - y.id);
        return resolve(sortedData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to get patient By Id
async function getPatientByIdUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        let lastCheckedData = { isLastChecked: false };

        const patientWhere = {
          id: payload.patientId,
        };
        const patientData = await selectFirstData(
          practiceLink,
          "*",
          "patients",
          patientWhere
        );

        const patientIdWhere = {
          patientId: payload.patientId,
        };
        const data = await selectAllData(
          practiceLink,
          "*",
          "appointments",
          patientIdWhere
        );

        const filterData = data.filter((item) => item.isDeleted !== true);
        const appointementData = [];
        const curDate = new Date().getDate();
        const curMonth = new Date().getMonth() + 1;
        const curYear = new Date().getFullYear();
        const curHours = new Date().getHours();

        for (let item of filterData) {
          const scheduleDate = item.scheduleDate.split("-");
          const scheduleTime = item.scheduleTime.split(":");
          const date = Number(scheduleDate[0]);
          const month = Number(scheduleDate[1]);
          const year = Number(scheduleDate[2]);
          const hours = Number(scheduleTime[0]);

          if (date <= curDate && month <= curMonth && year <= curYear) {
            if (date === curDate) {
              if (hours <= curHours) {
                appointementData.push(item);
              }
            } else {
              appointementData.push(item);
            }
          }
        }

        const newAppData = appointementData.sort((a, b) => {
          const aa = a.scheduleDate.split("-").reverse().join();
          const bb = b.scheduleDate.split("-").reverse().join();
          return aa < bb ? -1 : aa > bb ? 1 : 0;
        });

        if (newAppData && newAppData.length > 0) {
          let lastAppointment = newAppData[newAppData.length - 1];
          const staffWhere = {
            id: lastAppointment.staffId,
          };
          const staffData = await selectFirstData(
            practiceLink,
            "*",
            "staff",
            staffWhere
          );

          lastCheckedData = {
            practitionerName: staffData.name,
            lastCheckedDate: lastAppointment.scheduleDate,
            isLastChecked: true,
          };
        }

        if (patientData) {
          patientData.lastChecked = lastCheckedData;
          return resolve(patientData);
        } else {
          return reject("No Patient found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to create patient
async function createPatientUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const patientEmail = payload.email ? payload.email.toLowerCase() : "";
        const emailWhere = {
          email: patientEmail.trim(),
        };
        const emailExist = await selectFirstData(
          practiceLink,
          "*",
          "patients",
          emailWhere
        );
        if (emailExist) {
          return reject("Email already registered!");
        } else {
          const vitalsThresholds = {
            heartRate: {
              low: 60,
              high: 100,
            },
            BP: {
              low: 90,
              high: 120,
            },
            spo2: {
              low: 95,
              high: 100,
            },
            RR: {
              low: 12,
              high: 20,
            },
            Temp: {
              low: 35.9,
              high: 37.6,
            },
          };
          const patientData = {
            firstName: payload.firstName ? payload.firstName.trim() : "",
            lastName: payload.lastName ? payload.lastName.trim() : "",
            name: payload.preferredFirstName
              ? payload.preferredFirstName.trim()
              : "",
            title: payload.title,
            email: patientEmail ? patientEmail.trim() : "",
            mrn: payload.mrn,
            dob: payload.dob,
            sex: payload.sex,
            gender: payload.gender,
            pronouns: payload.pronouns,
            indigenousStatus: payload.indigenousStatus,
            currentStep: payload.currentStep,
            isDeleted: false,
            status: "active",
            isEmergency: payload.isEmergency,
            vitalsThresholds: vitalsThresholds,
            created_at: new Date(),
            updated_at: new Date(),
          };

          if (payload.isEmergency === true) {
            patientData.emergencyName = payload.emergencyName;
            patientData.emergencyEmail = payload.emergencyEmail;
            patientData.emergencyPhone = payload.emergencyPhone;
            patientData.emergencyRelation = payload.emergencyRelation;
            patientData.emergencyAddress = payload.emergencyAddress;
          }

          const result = await insertData(
            practiceLink,
            patientData,
            ["id", "name"],
            "patients"
          );
          if (result.length > 0) {
            resolve(result);
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

// Function to update patient
async function updatePatientUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const patientIdWhere = {
          id: payload.id,
        };

        const patientExist = await selectFirstData(
          practiceLink,
          "*",
          "patients",
          patientIdWhere
        );

        if (patientExist) {
          let updatedPatientData = {};

          if (payload.currentStep === 0) {
            updatedPatientData = {
              bloodGroup: payload.bloodGroup,
              alergies: payload.alergies ? payload.alergies.trim() : "",
              observation: payload.observation
                ? payload.observation.trim()
                : "",
              highBp: payload.highBp,
              onInsulin: payload.onInsulin,
              fracture: payload.fracture,
            };
          }
          if (payload.currentStep === 1) {
            const patientEmail = payload.email
              ? payload.email.toLowerCase()
              : "";

            if (patientExist.email !== patientEmail.trim()) {
              const emailWhere = {
                email: patientEmail.trim(),
              };
              const emailExist = await selectFirstData(
                practiceLink,
                "*",
                "patients",
                emailWhere
              );
              if (emailExist) {
                return reject("Email already registered!");
              }
            }
            updatedPatientData = {
              firstName: payload.firstName ? payload.firstName.trim() : "",
              lastName: payload.lastName ? payload.lastName.trim() : "",
              name: payload.preferredFirstName
                ? payload.preferredFirstName.trim()
                : "",
              title: payload.title,
              email: patientEmail ? patientEmail.trim() : "",
              mrn: payload.mrn,
              dob: payload.dob,
              sex: payload.sex,
              gender: payload.gender,
              pronouns: payload.pronouns,
              indigenousStatus: payload.indigenousStatus,
              isEmergency: payload.isEmergency,
            };

            if (payload.isEmergency === true) {
              updatedPatientData.emergencyName = payload.emergencyName;
              updatedPatientData.emergencyEmail = payload.emergencyEmail;
              updatedPatientData.emergencyPhone = payload.emergencyPhone;
              updatedPatientData.emergencyRelation = payload.emergencyRelation;
              updatedPatientData.emergencyAddress = payload.emergencyAddress;
            } else {
              updatedPatientData.emergencyName = null;
              updatedPatientData.emergencyEmail = null;
              updatedPatientData.emergencyPhone = null;
              updatedPatientData.emergencyRelation = null;
              updatedPatientData.emergencyAddress = null;
            }
          }
          if (payload.currentStep === 2) {
            if (payload.phone !== payload.alternatePhone) {
              updatedPatientData = {
                phone: payload.phone,
                alternatePhone: payload.alternatePhone,
                addressLine1: payload.addressLine1
                  ? payload.addressLine1.trim()
                  : "",
                addressLine2: payload.addressLine2
                  ? payload.addressLine2.trim()
                  : "",
                country: payload.country,
                timeZone: payload.timeZone,
                state: payload.state ? payload.state.trim() : "",
                city: payload.city ? payload.city.trim() : "",
                postCode: payload.postCode,
              };
            } else {
              return reject(
                "Phone Number and Alternate Phone Number can not be same!"
              );
            }
          }
          if (payload.currentStep === 3) {
            updatedPatientData = {
              medicareNumber: payload.medicareNumber,
              referenceNumber: payload.referenceNumber,
              expiryDate: payload.expiryDate,
            };
          }
          if (payload.currentStep === 4) {
            updatedPatientData = {
              isPrivateInsurance: payload.isPrivateInsurance,
              policyNumber: payload.policyNumber,
              funds: payload.funds,
              insuranceLevel: payload.insuranceLevel,
            };
            if (payload.isPrivateInsurance === false) {
              updatedPatientData.policyNumber = null;
              updatedPatientData.funds = null;
              updatedPatientData.insuranceLevel = null;
            }
          }
          if (payload.currentStep === 5) {
            updatedPatientData = {
              referralType: payload.referralType,
            };
          }
          if (payload.currentStep === 6) {
            updatedPatientData = {
              openingBalance: payload.openingBalance,
              concessionType: payload.concessionType,
              invoiceTo: payload.invoiceTo,
              emailInvoiceTo: payload.emailInvoiceTo,
              invoiceExtraInfo: payload.invoiceExtraInfo,
            };
          }

          if (payload.isEdit === true) {
            updatedPatientData.currentStep = payload.currentStep;
          }
          updatedPatientData.updated_at = new Date();

          const result = await updateData(
            practiceLink,
            updatedPatientData,
            ["id", "email"],
            "patients",
            patientIdWhere
          );
          if (result.length > 0) {
            resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("Patient not found");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to delete patient
async function deletePatientUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const patientIdWhere = {
          id: payload.patientId,
        };
        const patientExist = await selectFirstData(
          practiceLink,
          "*",
          "patients",
          patientIdWhere
        );
        if (patientExist && patientExist.isDeleted !== true) {
          const updatedPatientData = {
            isDeleted: true,
          };

          const result = await updateData(
            practiceLink,
            updatedPatientData,
            ["id", "isDeleted"],
            "patients",
            patientIdWhere
          );
          if (result.length > 0) {
            return resolve(result);
          }
        } else {
          return reject(
            "This patient cannot be deleted, Please contact Administrator"
          );
        }
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update patient status
async function updatePatientStatusUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const patientIdWhere = {
          id: payload.id,
        };
        const patientExist = await selectFirstData(
          practiceLink,
          "*",
          "patients",
          patientIdWhere
        );

        if (patientExist) {
          const patientData = {
            status: payload.active === true ? "active" : "inactive",
            updated_at: new Date(),
          };

          const result = await updateData(
            practiceLink,
            patientData,
            ["id", "status"],
            "patients",
            patientIdWhere
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No Patient found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update patient image
async function uploadPatientImageUser(userId, practiceLink, patientId, file) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const patientIdWhere = {
          id: patientId,
        };
        const patientExist = await selectFirstData(
          practiceLink,
          "*",
          "patients",
          patientIdWhere
        );
        if (patientExist && patientExist.isDeleted != true) {
          const path = file.path.replace(/\\/g, "/");
          const actualPath = path.replace("public", "");
          const patientData = {
            image: `${API_URL}/v1${actualPath}`,
            updated_at: new Date(),
          };

          const result = await updateData(
            practiceLink,
            patientData,
            ["id", "image"],
            "patients",
            patientIdWhere
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No Patient found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update patient image
async function getRecentPatientsUser(userId, practiceLink) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const sevenDaysOfCurrent = moment().subtract(7, "days");
        const where = ["created_at", ">=", sevenDaysOfCurrent];
        const data = await selectAllDataCondition(
          practiceLink,
          "*",
          "patients",
          where
        );
        if (data) {
          const sortedData = data.sort((x, y) => y.created_at - x.created_at);
          return resolve(sortedData);
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update medical history
async function createMedicalHistoryUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const patientIdWhere = {
          id: payload.id,
        };
        const patientExist = await selectFirstData(
          practiceLink,
          "*",
          "patients",
          patientIdWhere
        );

        if (patientExist) {
          let medicalHistoryData = [];

          if (
            patientExist.medicalHistory == null ||
            patientExist.medicalHistory?.length === 0
          ) {
            medicalHistoryData.push({
              name: payload.medicalHistory,
              color: payload.color,
              textColor: payload.textColor,
            });
          } else {
            if (patientExist.medicalHistory.length > 1) {
              const getMedicalHistory = patientExist.medicalHistory.map(
                (item) => {
                  const parseData = JSON.parse(item);
                  const historyName = parseData.name.toLowerCase();
                  return historyName;
                }
              );
              if (
                getMedicalHistory.indexOf(
                  payload.medicalHistory.toLowerCase()
                ) !== -1
              ) {
                return reject("Medical history already exist");
              } else {
                medicalHistoryData.push(...patientExist.medicalHistory, {
                  name: payload.medicalHistory,
                  color: payload.color,
                  textColor: payload.textColor,
                });
              }
            } else {
              const parseData = JSON.parse(patientExist.medicalHistory);
              if (
                parseData.name.toLowerCase() ===
                payload.medicalHistory.toLowerCase()
              ) {
                return reject("Medical history already exist");
              } else {
                medicalHistoryData.push(...patientExist.medicalHistory, {
                  name: payload.medicalHistory,
                  color: payload.color,
                  textColor: payload.textColor,
                });
              }
            }
          }

          const patientData = {
            medicalHistory: medicalHistoryData,
            updated_at: new Date(),
          };

          const result = await updateData(
            practiceLink,
            patientData,
            ["id", "medicalHistory"],
            "patients",
            patientIdWhere
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("Patient not found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to delete medical history
async function deleteMedicalHistoryUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const patientIdWhere = {
          id: payload.id,
        };
        const patientExist = await selectFirstData(
          practiceLink,
          "*",
          "patients",
          patientIdWhere
        );

        if (patientExist) {
          if (
            patientExist.medicalHistory === null ||
            !patientExist.medicalHistory.length > 0
          ) {
            return reject("There is no medical history!");
          } else {
            const isIssueExist = patientExist.medicalHistory.find((item) => {
              const newItem = JSON.parse(item);
              if (
                newItem.name.toLowerCase() ===
                payload.medicalHistory.toLowerCase()
              ) {
                return newItem;
              }
            });

            if (isIssueExist) {
              const dbArray = patientExist.medicalHistory;
              const findIndex = dbArray.indexOf(isIssueExist);
              dbArray.splice(findIndex, 1);

              const patientData = {
                medicalHistory: dbArray,
                updated_at: new Date(),
              };
              const result = await updateData(
                practiceLink,
                patientData,
                ["id", "medicalHistory"],
                "patients",
                patientIdWhere
              );
              if (result.length > 0) {
                return resolve(result);
              } else {
                return reject("Server error! Please try again");
              }
            } else {
              return reject("The health issue doesn't exist");
            }
          }
        } else {
          return reject("Patient not found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to get gender
async function getGenderUser(userId) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const data = await selectAllData("public", "*", "gender");
        const filterData = data.filter((item) => item.isDeleted !== true);
        return resolve(filterData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to get gender identity
async function getGenderIdentityUser(userId) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const data = await selectAllData("public", "*", "gender_identity");
        const filterData = data.filter((item) => item.isDeleted !== true);
        return resolve(filterData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to get insurance level
async function getInsuranceLevelUser(userId) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const data = await selectAllData("public", "*", "insurance_level");
        const filterData = data.filter((item) => item.isDeleted !== true);
        return resolve(filterData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to get insurance fund
async function getInsuranceFundUser(userId) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const data = await selectAllData("public", "*", "insurance_fund");
        const filterData = data.filter((item) => item.isDeleted !== true);
        return resolve(filterData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to get indigenous status
async function getIndigenousStatusUser(userId) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const data = await selectAllData("public", "*", "indigenous_status");
        const filterData = data.filter((item) => item.isDeleted !== true);
        return resolve(filterData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to get personal pronouns
async function getPersonalPronounsUser(userId) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const data = await selectAllData("public", "*", "personal_pronouns");
        const filterData = data.filter((item) => item.isDeleted !== true);
        return resolve(filterData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update vital thresholds
async function updatePatientThresholdsUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const patientIdWhere = {
          id: payload.id,
        };
        const patientExist = await selectFirstData(
          practiceLink,
          "*",
          "patients",
          patientIdWhere
        );

        if (patientExist) {
          const patientData = {
            vitalsThresholds: payload.vitalsThresholds,
            updated_at: new Date(),
          };

          const result = await updateData(
            practiceLink,
            patientData,
            ["id", "vitalsThresholds"],
            "patients",
            patientIdWhere
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No Patient found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to delete patient image
async function deletePatientImageUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const patientIdWhere = {
          id: payload.patientId,
        };
        const patientExist = await selectFirstData(
          practiceLink,
          "*",
          "patients",
          patientIdWhere
        );

        if (patientExist) {
          const patientData = {
            image: null,
            updated_at: new Date(),
          };

          const result = await updateData(
            practiceLink,
            patientData,
            ["id", "image"],
            "patients",
            patientIdWhere
          );

          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("No Patient found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
