const { verifyToken } = require("../helpers/common");
const { formatTime, getFormatDateTime } = require("../utils/utility");
const { selectAllData } = require("./dbService");
const { readNotifyStaffTemplate } = require("./emailService");
const { notifyStaffViaSms } = require("./twillioService");
const moment = require("moment");

module.exports = {
  getRandomNumber,
  verifyAuthToken,
  dailyScheduleSmsEmail,
};

// Function to get random number
async function getRandomNumber(start, end) {
  return new Promise(async function (resolve, reject) {
    try {
      const randomNumber = Math.floor(start + Math.random() * end);
      return resolve(randomNumber);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to verify auth token
async function verifyAuthToken(headerToken) {
  return new Promise(async function (resolve, reject) {
    try {
      const authToken = headerToken;
      const tokenData = authToken.split(" ");
      const token = tokenData[1];
      if (token) {
        const result = await verifyToken(token);
        if (result) {
          const userId = Number(result.userId);
          const loginUserId = Number(result.loginUserId);
          const link = result.practiceLink;
          return resolve({
            userId: userId,
            loginUserId: loginUserId,
            practiceLink: link,
          });
        } else {
          return reject("Unauthorizd!");
        }
      } else {
        return reject("Unauthorizd!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to daily schedule sms & email
async function dailyScheduleSmsEmail() {
  const data = await selectAllData(
    "public",
    ["practiceLink", "practiceName", "isDeleted"],
    "tenants"
  );
  const filterData = data.filter((item) => item.isDeleted !== true);

  for (item of filterData) {
    const staffData = await selectAllData(item.practiceLink, "*", "staff");
    const checkedStaffData = staffData.filter(
      (staff) => staff.isDeleted !== true
    );

    for (innerStaffData of checkedStaffData) {
      if (
        innerStaffData.dailyScheduleSms === true ||
        innerStaffData.dailyScheduleEmail === true
      ) {
        const idWhere = {
          staffId: innerStaffData.id,
        };
        const scheduleData = await selectAllData(
          item.practiceLink,
          "*",
          "schedule",
          idWhere
        );

        for (dailyScheduledData of scheduleData) {
          const dbDateTime = getFormatDateTime(dailyScheduledData);
          const dbStartDateTime = moment(dbDateTime);
          const currentDateTime = moment();
          if (dbStartDateTime > currentDateTime) {
            if (innerStaffData.dailyScheduleSms === true) {
              await notifyStaffViaSms(
                innerStaffData.name,
                dailyScheduledData.scheduleDate,
                formatTime(dailyScheduledData.scheduleTime),
                innerStaffData.phone,
                null,
                item.practiceLink,
                innerStaffData.type,
                "create",
                dailyScheduledData.meetingLink,
                dailyScheduledData.roomId
              );
            }

            if (innerStaffData.dailyScheduleEmail === true) {
              const subject = "Appointment";

              await readNotifyStaffTemplate(
                innerStaffData.name,
                dailyScheduledData.scheduleDate,
                formatTime(dailyScheduledData.scheduleTime),
                subject,
                innerStaffData.email,
                item.practiceLink,
                dailyScheduledData.type,
                "create",
                dailyScheduledData.meetingLink,
                dailyScheduledData.roomId
              );
            }
          }
        }
      }
    }
  }
}
