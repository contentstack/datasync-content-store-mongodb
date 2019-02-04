export const connector = {
  delete: () => {
    return Promise.resolve()
  },
  download: (asset) => {
    return Promise.resolve(asset)
  },
  setLogger: () => {
    return
  },
  start: () => {
    return Promise.resolve(connector)
  },
  unpublish: () => {
    return Promise.resolve()
  },
}