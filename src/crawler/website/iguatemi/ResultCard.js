import IGUATEMI_DOMAIN from '../../../constants/Pages.js'
import convertToNumber from '../../../utils/number-utils.js'

class ResultCard {
  constructor(resultDiv) {
    this.resultDiv = resultDiv
  }

  async extractAttributes() {
    // retrieve link
    const href = await this.resultDiv.$eval('a', (a) => a.getAttribute('href'))

    // retrieve img
    const img = await this.resultDiv.$eval(
      '.fotorama__stage__frame.fotorama__active .fotorama__html > div',
      (element) => element.getAttribute('data-img'),
    )

    // retrieve size in m2
    const sizeInM2 = convertToNumber(
      await this.resultDiv.$eval(
        '.dados .detalhe span:first-of-type',
        (element) => element.innerText,
      ),
    )

    // retrieve location
    const location = await this.resultDiv.$eval(
      '.dados .localizacao span:first-of-type',
      (element) => element.innerText,
    )

    // retrieve price
    const price = convertToNumber(
      await this.resultDiv.$eval(
        '.dados .alinha_valores .valor h5:first-of-type',
        (h5) => h5.innerText,
      ),
    )

    return {
      id: href,
      img,
      url: IGUATEMI_DOMAIN + href,
      price,
      location,
      size: sizeInM2,
    }
  }
}

export default ResultCard
