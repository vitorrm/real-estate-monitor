import { JSONFileSyncPreset } from 'lowdb/node'

class Storage {
  constructor(fileName) {
    this.fileName = fileName
    this.db = JSONFileSyncPreset(fileName, { realStateList: [] })
  }

  read() {
    return this.db.data.realStateList
  }

  save({ newItems = [], removedItems = [] }) {
    const removedIds = removedItems.map((item) => item.id)
    let json = this.read()
    json = json.concat(newItems)
    json = json.filter((el) => !removedIds.includes(el.id))
    this.db.data.realStateList = json
    this.db.write()
  }
}

export default Storage
