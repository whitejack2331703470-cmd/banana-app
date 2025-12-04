export const getAnalysis = async (countryName) => {
  // 模拟异步请求
  return new Promise((resolve) => {
    setTimeout(() => {
      const phrases = [
        `Prices in ${countryName} are peeling away from reality!`,
        `Don't slip up! ${countryName} is showing volatile curves.`,
        `Potassium overload detected in ${countryName}'s market sector.`,
        `A bunch of reasons to invest in ${countryName} right now.`,
        `Yellow alert! ${countryName} costs are ripening fast.`
      ];
      const random = phrases[Math.floor(Math.random() * phrases.length)];
      resolve(random);
    }, 800); // 0.8秒延迟
  });
};
