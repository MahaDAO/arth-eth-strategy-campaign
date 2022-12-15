import React, {useCallback, useState} from "react";
import DataField from "../../../components/DataField";
import theme from "../../../theme";

const AprInfo = () => {
  const [mahaAPR, setMahaApr] = useState<{
    data: string;
    isLoading: false;
  }>({
    isLoading: false,
    data: '- MAHA',
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
          data: '- MAHA',
        });
      });
  }, []);

  return (
    <div className={'m-b-12'}>
      <DataField
        label={'APR'}
        labelFontWeight={600}
        labelFontColor={'white'}
        labelFontSize={14}
        value={mahaAPR.data.toString()}
        isValueLoading={mahaAPR.isLoading}
        valueFontColor={theme.color.primary[300]}
        valueFontWeight={600}
      />
    </div>
  )
}

export default AprInfo;
