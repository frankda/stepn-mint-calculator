import type { NextPage } from 'next'
import useSWR from 'swr'
import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { CalculatorContainer, LivePrice, LivePriceContainer, Selector, Unit, UnitContainer } from '../styles/index.styles'
import styles from '../styles/Home.module.css'

const levelUpGst  = (lv: number) => {
  let lvGst = 20
  if (lv == 1) {
    lvGst -= 1 
  } else if (lv == 2) {
    lvGst -= 3
  } else if (lv == 3) {
    lvGst -= 6
  } else if (lv == 4) {
    lvGst -= 10
  } else if (lv == 5) {
    lvGst -= 20
  }

  return lvGst
}

const calcExtraMintCost = (mint: number, factor: number) => mint > 1 ? (mint - 1) * factor : 0

const Home: NextPage = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const parseDate = Date.parse(new Date().toISOString().slice(0, 10))

  const [chain, setChain] = useState('solana')

  const [bnbPrice, setBnbPrice] = useState<number>(0)
  const [gstPrice, setGstPrice] = useState<number>(0)
  const [gstBscPrice, setGstBscPrice] = useState<number>(0)
  const [gstSolPrice, setGstSolPrice] = useState<number>(0)
  const [gmtPrice, setGmtPrice] = useState<number>(0)
  const [solPrice, setSolPrice] = useState<number>(0)

  const [gstCost, setGstCost] = useState<number>(0)
  const [gmtCost, setGmtCost] = useState<number>(0)
  
  const [extraGstMintFactorCommon, setExtraGstMintFactorCommon] = useState<number>(0)
  const [extraGmtMintFactorCommon, setExtraGmtMintFactorCommon] = useState<number>(0)

  const [shoe1Type, setShoe1Type] = useState('common')
  const [shoe2Type, setShoe2Type] = useState('uncommon')

  const [shoe1Mint, setShoe1Mint] = useState(0)
  const [shoe2Mint, setShoe2Mint] = useState(0)

  const [shoe1Level, setShoe1Level] = useState(5)
  const [shoe2Level, setShoe2Level] = useState(5)

  const { data, error } = useSWR('https://3rdparty-apis.coinmarketcap.com/v1/cryptocurrency/widget?id=1839,5426,16352,18069,20236', fetcher)
  
  useEffect(() => {
    setBnbPrice(data?.data[1839]?.quote?.USD.price)
    setGstSolPrice(data?.data[16352]?.quote?.USD.price)
    setGstBscPrice(data?.data[20236]?.quote?.USD.price)
    setGmtPrice(data?.data[18069]?.quote?.USD.price)
    setSolPrice(data?.data[5426]?.quote?.USD.price)
  }, [data])

  useEffect(() => {
    if (chain === 'solana') {
      setGstPrice(gstSolPrice)
    } else if (chain === 'bsc') {
      setGstPrice(gstBscPrice)
    }
  }, [chain, gstSolPrice, gstBscPrice])

  // check gst and gmt cost according to minting rule
  // update regularly
  useEffect(() => {
    if (gstPrice < 2) {
      setGstCost(100)
      setGmtCost(0)
      setExtraGstMintFactorCommon(50)
    } else if (2 <= gstPrice && gstPrice < 3) {
      setGstCost(80)
      setGmtCost(20)
      setExtraGstMintFactorCommon(40)
      setExtraGmtMintFactorCommon(10)
    } else if (3 <= gstPrice && gstPrice < 4) {
      setGstCost(50)
      setGmtCost(50)
      setExtraGstMintFactorCommon(30)
      setExtraGmtMintFactorCommon(20)
    } else if (4 <= gstPrice && gstPrice < 8) {
      setGstCost(50)
      setGmtCost(50)
      setExtraGstMintFactorCommon(25)
      setExtraGmtMintFactorCommon(25)
    } else if (8 <= gstPrice && gstPrice < 10) {
      setGstCost(40)
      setGmtCost(60)
      setExtraGstMintFactorCommon(20)
      setExtraGmtMintFactorCommon(30)
    } else if (10 <= gstPrice) {
      setGstCost(20)
      setGmtCost(80)
      setExtraGstMintFactorCommon(10)
      setExtraGmtMintFactorCommon(40)
    }
  }, [gstPrice])

  const calculateRequiredGst = useCallback(() => {
    let typeGst = 0

    const shoe1Gst = levelUpGst(shoe1Level) + gstCost + calcExtraMintCost(shoe1Mint, extraGstMintFactorCommon) + typeGst 
    const shoe2Gst = levelUpGst(shoe2Level) + gstCost + calcExtraMintCost(shoe2Mint, extraGstMintFactorCommon) + typeGst
    return (shoe1Gst + shoe2Gst)
  }, [shoe1Level, shoe2Level, shoe1Mint, shoe2Mint, gstCost, extraGstMintFactorCommon])
  
  const calculateRequiredGmt = useCallback(() => {
    let typeGmt = 0

    const shoe1LevelUpGmt = shoe1Level === 5 ? 0 : 10
    const shoe2LevelUpGmt = shoe2Level === 5 ? 0 : 10
    
    const shoe1ExtraMintGmt = calcExtraMintCost(shoe1Mint, extraGmtMintFactorCommon)
    const shoe2ExtraMintGmt = calcExtraMintCost(shoe2Mint, extraGmtMintFactorCommon)

    const shoe1Gmt = gmtCost + shoe1LevelUpGmt + shoe1ExtraMintGmt + typeGmt
    const shoe2Gmt = gmtCost + shoe2LevelUpGmt + shoe2ExtraMintGmt + typeGmt

    return (shoe1Gmt + shoe2Gmt)
  }, [shoe1Level, shoe2Level, shoe1Mint, shoe2Mint, extraGmtMintFactorCommon, gmtCost])

  const calculateTotalCost = () => {
    return (calculateRequiredGst() * gstPrice  + calculateRequiredGmt() * gmtPrice)
  }

  const renderChainTokenPrice = () => {
    if (chain === 'solana') {
      return <>SOL:${solPrice && solPrice.toFixed(2)}</>
      }
      
    if (chain === 'bsc') {
      return <>BNB:${bnbPrice && bnbPrice.toFixed(2)}</>
    }
  }

  const renderChainTokenTotalPrice = () => {
    if (chain === 'solana') {
      return <>SOL: {(calculateTotalCost() / solPrice).toFixed(2)}</>
      }
      
    if (chain === 'bsc') {
      return <>BNB: {(calculateTotalCost() / bnbPrice).toFixed(2)}</>
    }
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>STEPN Mint Calculator</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          STEPN Mint Calculator
        </h1>

        <LivePriceContainer>
          <LivePrice>GST:${gstPrice && gstPrice.toFixed(2)}|</LivePrice>
          <LivePrice>GMT:${gmtPrice && gmtPrice.toFixed(2)}|</LivePrice>
          <LivePrice>{renderChainTokenPrice()}</LivePrice>
        </LivePriceContainer>

        <CalculatorContainer>
          <strong>Chain: </strong>
          <Selector name="chain" id="chain" value={chain} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChain(e.target.value)}>
            <option value="solana">Solana</option>
            <option value="bsc">BSC</option>
          </Selector>

          <br />
          
          <strong>ENTER SHOE DETAILS:</strong>
          <UnitContainer>
            <Unit>Mint</Unit>
            <Unit>lv</Unit>
          </UnitContainer>
          <div className='shoe-row'>
            <span>SHOE 1(common): </span>
            {/* <Selector name="shoe1-type" id="shoe1-type" value={shoe1Type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShoe1Type(e.target.value)}>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
            </Selector> */}
            <Selector name="shoe1-mint" id="shoe1-mint" value={shoe1Mint} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShoe1Mint(parseInt(e.target.value))}>
              <option value="0">0/7</option>
              <option value="1">1/7</option>
              <option value="2">2/7</option>
              <option value="3">3/7</option>
              <option value="4">4/7</option>
              <option value="5">5/7</option>
              <option value="6">6/7</option>
            </Selector>
            <Selector name="shoe1-level" id="shoe1-level" value={shoe1Level} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShoe1Level(parseInt(e.target.value))}>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Selector>
          </div>
          <div className='shoe-row'>
            <span>SHOE 2(common): </span>
            {/* <Selector name="shoe2-type" id="shoe2-type" value={shoe2Type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShoe2Type(e.target.value)}>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
            </Selector> */}
            <Selector name="shoe2-mint" id="shoe2-mint" value={shoe2Mint} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShoe2Mint(parseInt(e.target.value))}>
              <option value="0">0/7</option>
              <option value="1">1/7</option>
              <option value="2">2/7</option>
              <option value="3">3/7</option>
              <option value="4">4/7</option>
              <option value="5">5/7</option>
              <option value="6">6/7</option>
            </Selector>
            <Selector name="shoe2-level" id="shoe2-level" value={shoe2Level} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShoe2Level(parseInt(e.target.value))}>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Selector>
          </div>

          <br />

          <strong>Required Token:</strong>
          <div>
            <span>GST: {calculateRequiredGst()}</span>
          </div>
          <div>
            <span>GMT: {calculateRequiredGmt()}</span>
          </div>

          <br />

          <strong>Total Mint Cost:</strong>
          <div className='result'>
            <span>${calculateTotalCost().toFixed(2)}</span>
            <br />
            <span>{renderChainTokenTotalPrice()}</span>
          </div>
        </CalculatorContainer>
      </main>
    </div>
  )
}

export default Home
