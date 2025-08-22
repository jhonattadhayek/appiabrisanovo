const axios = require("axios");

exports.getTodayDate = async (daysToAdd = 0, timestamp = false) => {
  try {
    const { data } = await axios.get(
      "http://worldtimeapi.org/api/timezone/America/Sao_Paulo"
    );
    const currentDate = new Date(data.utc_datetime);

    currentDate.setDate(currentDate.getDate() + daysToAdd);

    if (timestamp) {
      return currentDate.getTime();
    }

    const day = currentDate.getUTCDate();
    const month = currentDate.getUTCMonth() + 1;
    const year = currentDate.getUTCFullYear();

    const formatedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    return formatedDate;
  } catch (error) {
    throw new Error("Failed to fetch date from the API: " + error.message);
  }
};
