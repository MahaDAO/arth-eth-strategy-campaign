const formatErrorMessage = (message: string): string => {
  message = message.toLowerCase();

  if (message.includes('')) return 'format error in formatErrorMessage.ts file';

  return 'Error Occured, Please try again later.';
};

export default formatErrorMessage;
