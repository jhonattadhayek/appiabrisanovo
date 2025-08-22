const translate = (slug, lang = "pt_br") => {
  try {
    const messages = loadMessages(lang);
    const adjustedKeys = normalizeSlug(slug);
    return resolveTranslation(messages, adjustedKeys, slug);
  } catch (error) {
    return error.message;
  }
};

const loadMessages = lang => {
  try {
    const { messages } = require(`./languages/${lang}`);
    return messages;
  } catch (error) {
    throw new Error("Oops! Language for translation not found");
  }
};

const normalizeSlug = slug => {
  if (slug.includes("-") || slug.includes("/")) {
    slug = `firebase.${slug}`;
  }
  return slug.split(".");
};

const resolveTranslation = (messages, keys, fallback) => {
  return (
    keys.reduce((current, key) => {
      if (current && current[key]) {
        return current[key];
      }
      return null;
    }, messages) || fallback
  );
};

module.exports = translate;
