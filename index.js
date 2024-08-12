import puppeteer from 'puppeteer-extra'
import yargs from 'yargs/yargs'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

import { hideBin } from 'yargs/helpers'
import CrawlerController from './src/crawler/CrawlerController.js'
import EmailSender from './src/notification/EmailSender.js'
import EntriesChecker from './src/EntriesChecker.js'
import Storage from './src/storage/Storage.js'

const { argv } = yargs(hideBin(process.argv))

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin())

const scrape = async () => {
  // const args = [
  //   '--no-sandbox',
  //   '--disable-setuid-sandbox',
  //   '--disable-infobars',
  //   '--window-position=0,0',
  //   '--ignore-certifcate-errors',
  //   '--ignore-certifcate-errors-spki-list',
  //   '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"',
  // ]
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    // ignoreDefaultArgs: ['--disable-extensions'],
    // args,
  })
  const crawler = new CrawlerController(browser)
  const resultList = await crawler.getRealStateList()
  browser.close()
  return resultList
}

const sendEmail = async ({ toEmail, newItems, removedItems }) => {
  const sender = new EmailSender({
    user: argv.emailUser,
    pass: argv.emailPass,
  })
  await sender.verifyConnection()
  await sender.sendRealStateUpdateEmail({
    toEmail,
    newItems,
    removedItems,
  })
  sender.close()
}

const isNonEmptyList = (list) => list && list.length > 0

scrape().then(async (resultList) => {
  const storage = new Storage('./workdir/real-states-db.json')
  const selectedItems = []
  resultList.forEach((realState) => {
    if (realState.price < 260000 && realState.size > 500) {
      selectedItems.push(realState)
    }
  })
  const entriesChecker = new EntriesChecker(storage)
  const newItems = await entriesChecker.filterNewEntries(selectedItems)
  const removedItems = await entriesChecker.filterRemovedEntries(selectedItems)
  if (isNonEmptyList(newItems)) {
    console.log('New items found, sending email', newItems)
    sendEmail({ toEmail: argv.toEmail, newItems })
  }
  if (isNonEmptyList(newItems) || isNonEmptyList(removedItems)) {
    storage.save({
      newItems,
      removedItems,
    })
  }
})
