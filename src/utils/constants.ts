import {BigNumber} from 'ethers';
import {
  ApplicationState, BasicBooleanState, BasicNumberState,
  BasicState,
  BasicStateString,
  TransactionState
} from './interface';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const DAY = 86400;
export const DAY_IN_MS = 86400000;

export const YEAR = 365 * 86400;
export const YEAR_IN_MS = YEAR * 1000;

export const MONTH = 31 * 24 * 60 * 60;
export const MONTH_IN_MS = MONTH * 1000;

export const WEEK = 7 * 86400;
export const WEEK_IN_MS = 7 * 86400000;

export const LOADING_DEFAULT_BASIC_STATE: BasicState = {
  isLoading: true,
  value: BigNumber.from(0)
};

export const NON_LOADING_DEFAULT_BASIC_STATE: BasicState = {
  isLoading: false,
  value: BigNumber.from(0)
};

export const LOADING_DEFAULT_BOOLEAN_STATE: BasicBooleanState = {
  isLoading: true,
  value: false
};

export const NON_LOADING_DEFAULT_BOOLEAN_STATE: BasicBooleanState = {
  isLoading: false,
  value: false
};

export const LOADING_DEFAULT_NUMBER_BASIC_STATE: BasicNumberState = {
  isLoading: true,
  value: 0
};

export const NON_LOADING_DEFAULT_NUMBER_BASIC_STATE: BasicNumberState = {
  isLoading: false,
  value: 0
};

export const LOADING_DEFAULT_BASIC_STATE_STRING: BasicStateString = {
  isLoading: true,
  value: "",
};

export const NON_LOADING_DEFAULT_BASIC_STATE_STRING: BasicStateString = {
  isLoading: false,
  value: "0",
};

export const DECIMALS_18 = BigNumber.from(10).pow(18);

export const INITIAL_APP_STATE: ApplicationState = {
  blockNumber: {},
  popupList: [],
  walletModalOpen: false,
  settingsMenuOpen: false,
};

export const INITIAL_TRANSACTION_STATE: TransactionState = {};

export const BNZERO = BigNumber.from(0);

export const noOp = () => {
};

export const handleDate = (date: any) => {
  return new Date(date.setHours(0, 0, 0, 0));
}

export const addDays = (date: Date, no: number = 1) => {
  return handleDate(new Date(date.getTime() + (DAY_IN_MS) * no));
}

export const addWeeks = (date: Date, no: number = 1) => {
  return handleDate(new Date(date.getTime() + (WEEK_IN_MS) * no));
}

export const addMonths = (date: Date, no: number = 1) => {
  return handleDate(new Date(date.getTime() + MONTH_IN_MS * no));
}

export const addYears = (date: Date, no: number = 1) => {
  return handleDate(new Date(date.getTime() + YEAR_IN_MS * no));
}
