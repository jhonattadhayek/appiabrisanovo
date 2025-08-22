exports.cleanString = value => {
  value = value.trim();

  value = value.replace(new RegExp("[ÁÀÂÃ]", "gi"), "a");
  value = value.replace(new RegExp("[ÉÈÊ]", "gi"), "e");
  value = value.replace(new RegExp("[ÍÌÎ]", "gi"), "i");
  value = value.replace(new RegExp("[ÓÒÔÕ]", "gi"), "o");
  value = value.replace(new RegExp("[ÚÙÛ]", "gi"), "u");
  value = value.replace(new RegExp("[Ç]", "gi"), "c");
  value = value.replace(/ /gi, "-");

  return value.toLowerCase();
};

exports.extractDomain = string => {
  const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?\s]+)/g;
  const matches = domainRegex.exec(string);
  if (matches && matches.length > 1) {
    string = matches[1].toLowerCase();
  }

  return string;
};

exports.formatterBoolean = data => {
  if (data === "true") return true;
  if (data === "false") return false;
  return data;
};

exports.isCurrentTimeWithinHours = hours => {
  const now = new Date();
  now.setHours(now.getHours() - 3);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return hours.some(({ start, end }) => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  });
};

exports.phoneMask = value => {
  if (!value) return "";

  value = value.replace(/\D/g, "");
  if (value.startsWith("55")) value = value.slice(2);
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");

  return value;
};

exports.formatterBoolean = data => {
  if (typeof data === "string") {
    if (data.toLowerCase() === "true") return true;
    if (data.toLowerCase() === "false") return false;
  }

  return Boolean(data);
};
