/* eslint-disable no-await-in-loop */

import IGUATEMI_DOMAIN from '../../../constants/Pages.js'
import RealState from '../../entity/RealState.js'
import ResultCard from './ResultCard.js'

const INITIAL_PAGE = `${IGUATEMI_DOMAIN}/comprar/undefined/leme/terreno-condominio/ordem-valor/resultado-crescente/quantidade-48/`

class IguatemiPage {
  constructor(browser) {
    this.browser = browser
  }

  async open() {
    this.page = await this.browser.newPage()
    await this.page.goto(INITIAL_PAGE, { waitUntil: 'load', timeout: 0 })
  }

  async getRealStateList() {
    let result = []
    result = result.concat(await parseContent(this.page))
    return result
  }
}

async function parseContent(page) {
  const cards = await page.$$('.todos_imoveis .resultado')
  const list = []

  for (let i = 0; i < cards.length; i += 1) {
    const realStateDiv = cards[i]
    list.push(await new ResultCard(realStateDiv).extractAttributes())
  }

  return list.map(
    (obj) =>
      new RealState({
        id: obj.id,
        img: obj.img,
        url: obj.url,
        price: obj.price,
        location: obj.location,
        size: obj.size,
      }),
  )
}

export default IguatemiPage
