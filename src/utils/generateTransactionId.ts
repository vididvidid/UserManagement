export const generateTransactionId = (): string => {
  const prefix = 'MT';
  const randomNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
  return `${prefix}${randomNumber}`;
};