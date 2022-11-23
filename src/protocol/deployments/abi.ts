import {IABIS} from "../../utils/interface";
import IERC20 from './abi/IERC20.json';
import MockERC20 from './abi/MockERC20.json';
import PriceFeed from './abi/PriceFeed.json';
import SortedTroves from './abi/SortedTroves.json';
import TroveManager from './abi/TroveManager.json';
import ARTHETHTroveLp from './abi/ARTHETHTroveLp.json';
import UniV3PositionManager from "./abi/UniV3PositionManager.json";
import HintHelpers from "./abi/HintHelpers.json";
import ARGENT_WALLET_CONTRACT_ABI from './abi/Argent-Wallet-Contract.json';

const abis: IABIS = {
  IERC20,
  MockERC20,
  PriceFeed,
  SortedTroves,
  TroveManager,
  ARTHETHTroveLp,
  UniV3PositionManager,
  HintHelpers,
  ARGENT_WALLET_CONTRACT_ABI
};

export default abis;
