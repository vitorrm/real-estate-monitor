/* eslint-disable no-await-in-loop */
import { setTimeout } from 'node:timers/promises'
import { IMOVELWEB_DOMAIN } from '../../../constants/Pages.js'
import RealState from '../../entity/RealState.js'
import ResultCard from './ResultCard.js'

const INITIAL_PAGE = `${IMOVELWEB_DOMAIN}/terrenos-loteamento-condominio-venda-leme-sp-ordem-precio-menor.html`
const NEXT_BTN = 'a[data-qa="PAGING_NEXT"]'

class ImovelWebPage {
  constructor(browser) {
    this.browser = browser
  }

  async open() {
    this.page = await this.browser.newPage()
    await this.page.goto(INITIAL_PAGE, { waitUntil: 'load', timeout: 0 })
    try {
      await this.page.waitForSelector(
        'button[data-qa="cookies-policy-banner"]',
        { timeout: 3000 },
      )
      await this.page.click('button[data-qa="cookies-policy-banner"]')
    } catch (err) {
      console.log('Failed to close cookie banner', err)
    }
  }

  async nextPage() {
    await this.page.click(NEXT_BTN)
    await setTimeout(4000)
  }

  async hasNext() {
    return (await this.page.$(NEXT_BTN)) !== null
  }

  async getRealStateList() {
    let result = []
    result = result.concat(await parseContent(this.page))
    while (await this.hasNext()) {
      await this.nextPage()
      result = result.concat(await parseContent(this.page))
    }
    return result
  }
}

async function parseContent(page) {
  //  await page.screenshot({
  //    path: `screenshot${Math.floor(Math.random() * 1000)}.jpg`,
  //  })
  const cards = await page.$$(
    '.postings-container [data-posting-type="PROPERTY"]',
  )
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

export default ImovelWebPage
