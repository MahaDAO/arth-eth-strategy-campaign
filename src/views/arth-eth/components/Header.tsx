import PageHeader from "../../../components/PageHeader";
import React, {useCallback, useEffect, useState} from "react";

const Header = () => {
  const [mahaAPR, setMahaApr] = useState<{
    data: string;
    isLoading: false;
  }>({
    isLoading: false,
    data: '0',
  });

  const fetchAPY = useCallback(async () => {
    const url = `https://api.arthcoin.com/apy/campaign`;
    /*const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers':
        'access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type',
    };*/

    fetch(url)
      .then((res) => res.json())
      .then((res: { [key: string]: string }) => {
        if (res['arth-eth-loans']) {
          setMahaApr({isLoading: false, data: res['arth-eth-loans']});
        }
      })
      .catch((err) => {
        setMahaApr({
          isLoading: false,
          data: '0',
        });
      });
  }, []);

  useEffect(() => {
    fetchAPY().then(() => {
    })
  }, [fetchAPY])
  return (
    <div className={'m-b-40'}>
      <PageHeader
        title={'ETH Staking Program '}
        subTitle={<div>
          Stake your ETH and earn up
          to {mahaAPR.data === '0' || mahaAPR.isLoading
          ? 'XX%' :
          <span className={'links'}>{Number(mahaAPR.data).toLocaleString("en-US", {maximumFractionDigits: 3})}% </span>}
          APR in
          <a className={'links'} href={'https://www.coingecko.com/en/coins/mahadao'}> $MAHA</a>. Your ETH is used to
          provide
          liquidity to the <a className={'links'} href={'https://app.mahalend.com'}>MahaLend protocol</a>.
        </div>}
      />
    </div>
  )
}

export default Header;
