
const generateServerToken = (length) => {
  try {
    let ReferralCode = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklumnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++)
      ReferralCode += possible.charAt(
        Math.floor(Math.random() * possible.length)
      );
    return ReferralCode;
  } catch (error) {
    return null;
  }
};

const generateReferralCode = (length) => {
  try {
    let ReferralCode = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < length; i++)
      ReferralCode += possible.charAt(
        Math.floor(Math.random() * possible.length)
      );
    return ReferralCode;
  } catch (error) {
    return null;
  }
};

export { generateServerToken, generateReferralCode };
