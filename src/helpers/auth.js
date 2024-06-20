const generateRandomString = (length, possible) => {
  try {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return result;
  } catch (error) {
    return null;
  }
};

const generateServerToken = (length) => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return generateRandomString(length, possible);
};

const generateReferralCode = (length) => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return generateRandomString(length, possible);
};

export { generateServerToken, generateReferralCode };
