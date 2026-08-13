const generateRandomString = (len = 100) => {
  const chars =
    "0987654321abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const charslen = chars.length;
  const random = "";

  for (let i = 0; i < len; i++) {
    const posn = Math.ceil(Math.random() * charslen - 1);
    random += chars[posn];
  }

  return random;
};

module.exports = generateRandomString;
