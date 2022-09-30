const formatErrorMessage = (message: string): string => {
  message = message.toLowerCase();

  if (message.includes('')) return message;

  return 'Error Occured, Please try again later.';
};

export default formatErrorMessage;
