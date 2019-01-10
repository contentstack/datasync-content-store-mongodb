const log = console.log

// Build mock asset connector
module.exports = {
  download: function (asset) {
    log('Asset connector update called')
    asset.key = 'new key added'
    return Promise.resolve(asset)
  },
  delete: function () {
    log('Asset connector delete called')
    return Promise.resolve()
  },
  unpublish: function () {
    log('Asset connector soft-delete called')
    return Promise.resolve()
  },
  start: function () {
    log('Asset connector started')
    return Promise.resolve(this)
  }
}