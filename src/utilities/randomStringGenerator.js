const generateRandomString = (len = 100) => {
  const chars =
    "0987654321abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const charslen = chars.length;
  let random = "";

  for (let i = 0; i < len; i++) {
    const posn = Math.floor(Math.random() * charslen);
    random += chars[posn];
  }

  return random;
};

module.exports = generateRandomString;
