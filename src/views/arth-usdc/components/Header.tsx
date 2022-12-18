import PageHeader from "../../../components/PageHeader";

const Header = () => {
  return (
    <div className={'m-b-40'}>
      <PageHeader
        title={'USDC Passive Yield Program'}
        subTitle={'Earn a passive yield on your USDC by providing liquidity to the MahaLend protocol and curve finance pool.'}
      />
    </div>
  )
}

export default Header;
