export const formatTime = date => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const formatSeconds = seconds => {
  if (seconds < 60) {
    return `S${seconds}`;
  }

  const minutes = seconds / 60;

  if (minutes < 60) {
    return `M${minutes}`;
  }

  const hours = minutes / 60;
  return `H${hours}`;
};
