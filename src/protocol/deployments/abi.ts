import {IABIS} from "../../utils/interface";
import IERC20 from './abi/IERC20.json';
import MockERC20 from './abi/MockERC20.json';
import PriceFeed from './abi/PriceFeed.json';
import SortedTroves from './abi/SortedTroves.json';
import TroveManager from './abi/TroveManager.json';

const abis: IABIS = {
  IERC20,
  MockERC20,
  PriceFeed,
  SortedTroves,
  TroveManager,
};

export default abis;
