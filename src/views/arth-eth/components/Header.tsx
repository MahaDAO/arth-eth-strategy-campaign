import PageHeader from "../../../components/PageHeader";

const Header = () => {
  return (
    <div className={'m-b-40'}>
      <PageHeader
        title={'ETH Staking Program'}
        subTitle={'Earn a yield on your ETH by staking and providing liquidity to the MahaLend protocol.'}
      />
    </div>
  )
}

export default Header;
