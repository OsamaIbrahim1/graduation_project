const generateOTP = () => {
  const otpLength = 6;
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .slice(0, otpLength);
};

export default generateOTP;
