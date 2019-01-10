const assetFilterKeys = ['type', 'event_at', 'checkpoint', 'action']
const entryFilterKeys = ['type', 'event_at', 'checkpoint', 'action']
const contentTypeFilterKeys = ['type', 'event_at', 'checkpoint', 'action']

export const filterAssetKeys = (asset) => {
  assetFilterKeys.forEach((key) => {
    delete asset[key]
  })
}

export const filterEntryKeys = (entry) => {
  entryFilterKeys.forEach((key) => {
    delete entry[key]
  })
}

export const filterContentTypeKeys = (contentType) => {
  contentTypeFilterKeys.forEach((key) => {
    delete contentType[key]
  })
}
