import { IMOVELWEB_DOMAIN } from '../../../constants/Pages.js'
import convertToNumber from '../../../utils/number-utils.js'

class ResultCard {
  constructor(resultDiv) {
    this.resultDiv = resultDiv
  }

  async extractAttributes() {
    // retrieve link
    const href = await this.resultDiv.$eval('a', (a) => a.getAttribute('href'))

    // retrieve img
    const img = await this.resultDiv.$eval('img:first-of-type', (element) =>
      element.getAttribute('src'),
    )

    // retrieve size in m2
    const sizeInM2 = convertToNumber(
      await this.resultDiv.$eval(
        '[data-qa="POSTING_CARD_FEATURES"] span:first-of-type',
        (element) => element.innerText,
      ),
    )

    // retrieve location
    const location = await this.resultDiv.$eval(
      '[data-qa="POSTING_CARD_DESCRIPTION"] a',
      (element) => element.innerText,
    )

    // retrieve price
    const price = convertToNumber(
      await this.resultDiv.$eval(
        '[data-qa="POSTING_CARD_PRICE"]',
        (h5) => h5.innerText,
      ),
    )

    return {
      id: href,
      img,
      url: IMOVELWEB_DOMAIN + href,
      price,
      location,
      size: sizeInM2,
    }
  }
}

export default ResultCard
