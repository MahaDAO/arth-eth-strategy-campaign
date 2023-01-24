import React, {useCallback, useEffect, useState} from "react";
import DataField from "../../../components/DataField";
import theme from "../../../theme";

interface IAprInternal {
  min: number;
  max: number;
  boostEffectiveness: number;
}

interface IApr {
  tvlUSD: number;
  current: IAprInternal;
  upcoming: IAprInternal;
}

const AprInfo = () => {
  const [mahaAPR, setMahaApr] = useState<{
    data: number;
    isLoading: false;
  }>({
    isLoading: false,
    data: 0,
  });

  const fetchAPY = useCallback(async () => {
    const url = `https://api.arthcoin.com/apr/vaults`;
    /*const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers':
        'access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type',
    };*/

    fetch(url)
      .then((res) => res.json())
      .then((res: { [key: string]: IApr }) => {
        if (res['arth-eth-strategy']) {
          setMahaApr({isLoading: false, data: res['arth-eth-strategy'].current.min});
        }
      })
      .catch((err) => {
        setMahaApr({
          isLoading: false,
          data: 0,
        });
      });
  }, []);

  useEffect(() => {
    fetchAPY().then(() => {
    })
  }, [fetchAPY])


  return (
    <div className={'m-b-12'}>
      <DataField
        label={'APR'}
        labelFontWeight={600}
        labelFontColor={'white'}
        labelFontSize={14}
        value={`${Number(mahaAPR.data).toLocaleString("en-US", {maximumFractionDigits: 3})} %`}
        isValueLoading={mahaAPR.isLoading}
        valueFontColor={theme.color.primary[300]}
        valueFontWeight={600}
        valueFontSize={16}
      />
    </div>
  )
}

export default AprInfo;
