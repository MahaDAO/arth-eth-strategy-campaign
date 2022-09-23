import {DECIMALS_18} from "../utils/constants";

export default {
  trove: 'ETH',
  depositToken: 'ETH',
  displayName: 'ETH',
  contractPrefix: 'ETH',
  crParameters: {
    mcr: 109999, // 110%
    ccr: 149999, // 150%
  },
  liquidationReserve: DECIMALS_18.mul(50),
  minDebtAmount: DECIMALS_18.mul(250),
  collateralPerc: 0.8,
  cr: DECIMALS_18.mul(220),
}
