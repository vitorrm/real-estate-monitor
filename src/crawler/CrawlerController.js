import IguatemiPage from './website/iguatemi/IguatemiPage.js'
import ImovelWebPage from './website/imovelweb/ImovelWebPage.js'

class CrawlerController {
  constructor(browser) {
    this.browser = browser
  }

  async getRealStateList() {
    let result = []
    const iguatemi = new IguatemiPage(this.browser)
    await iguatemi.open()
    result = result.concat(await iguatemi.getRealStateList())
    const imovelweb = new ImovelWebPage(this.browser)
    await imovelweb.open()
    result = result.concat(await imovelweb.getRealStateList())
    return result
  }
}

export default CrawlerController
