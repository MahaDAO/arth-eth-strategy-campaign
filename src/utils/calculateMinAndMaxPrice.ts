export const calculateMinAndMaxPrice = async (
  x: number,
  y: number,
  currentPrice: number,
  token1V2: number,
  token2V2: number,
  multiplier: number,
  steps?: number
): Promise<{priceMin: number, priceMax: number}> => {
  const L = Math.sqrt((token1V2 * token2V2));
  const from = 0;
  const step = steps ? steps / 100 : currentPrice / 100;
  const price: number = from + 199 * step;
  const priceMaxNumerator = (multiplier ** 2) * (L ** 2) * price;
  const priceMaxDenominator = ((multiplier ** 2) * (L ** 2)) - (2 * multiplier * L * x * Math.sqrt(price)) + ((x ** 2) * price);
  const priceMax = priceMaxNumerator/ priceMaxDenominator;
  const priceMin = price - ( 2 * Math.sqrt(price) * y / multiplier / L) + ((y ** 2) / ((multiplier ** 2) * (L ** 2)))
  
  return {
    priceMin,
    priceMax
  }
}
