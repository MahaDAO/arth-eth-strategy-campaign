import PageHeader from "../../components/PageHeader";
import useGetNativeTokenBalance from "../../hooks/state/useGetNativeTokenBalance";
import {getDisplayBalance} from "../../utils/formatBalance";

const Home = () => {
  const balance = useGetNativeTokenBalance();
  return (
    <div className={'custom-container'}>
      <PageHeader title={'Hello'}
                  subTitle={`My Balance: 
                  ${Number(getDisplayBalance(balance.value)).toLocaleString('en-US', {maximumFractionDigits: 3})}`}
      />
    </div>
  )
}

export default Home;
