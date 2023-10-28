const { getFormatDateTime } = require("../utils/utility");
const {
  isUserExist,
  selectFirstData,
  updateData,
  selectAllDataJoin,
} = require("./dbService");
const moment = require("moment");

module.exports = {
  getAppointmentPatients,
  updateAppointmentDetailsPatient,
};

// Function to get appointments
async function getAppointmentPatients(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const where = {
          patientId: payload.patientId,
        };
        const data = await selectAllDataJoin(
          practiceLink,
          "staff",
          "appointments.staffId",
          "=",
          "staff.id",
          "appointments.*",
          "staff.name as practitionerName",
          "appointments",
          where
        );
        if (data) {
          const appendDateTimeKey = data.map((item) => ({
            ...item,
            scheduleDateTime: moment(getFormatDateTime(item)),
          }));
          const sortedData = appendDateTimeKey.sort(
            (x, y) => x.scheduleDateTime - y.scheduleDateTime
          );
          return resolve(sortedData);
        } else {
          return reject("No Appointment found!");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update appointment details
async function updateAppointmentDetailsPatient(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const where = {
          id: payload.id,
        };
        const appointmentExist = await selectFirstData(
          practiceLink,
          "*",
          "appointments",
          where
        );

        if (appointmentExist && appointmentExist.isDeleted !== true) {
          const updatedData = {
            updated_at: new Date(),
          };
          if (payload.isVitalSigns === true) {
            updatedData.weight = payload.weight;
            updatedData.bp = payload.bp;
            updatedData.hr = payload.hr;
            updatedData.spo2 = payload.spo2;
            updatedData.rr = payload.rr;
            updatedData.temp = payload.temp;
            updatedData.isVitalSigns = payload.isVitalSigns;
          }
          if (payload.isClinicalNotes === true) {
            updatedData.presentation = payload.presentation;
            updatedData.observation = payload.observation;
            updatedData.diagnoses = payload.diagnoses;
            updatedData.notes = payload.notes;
            updatedData.isClinicalNotes = payload.isClinicalNotes;
          }

          const result = await updateData(
            practiceLink,
            updatedData,
            ["*"],
            "appointments",
            where
          );
          if (result.length > 0) {
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("Appointment not found");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
