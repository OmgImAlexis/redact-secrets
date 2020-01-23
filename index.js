const traverse = require('traverse')
const isSecret = require('is-secret')

module.exports = function (redacted, options = {}) {
  const { keys = [], values = [] } = options

  const isRedactable = (key, value) => {
    const isGenericSecret = isSecret.key(key) || isSecret.value(value)
    const isUserSecret = keys.some(regex => regex.test(key)) || values.some(regex => regex.test(value))
    return isGenericSecret || isUserSecret
  }

  const map = obj => traverse(obj).map(function (val) {
    if (isRedactable(this.key, val)) {
      this.update(redacted)
    }
  })

  const forEach = obj => {
    traverse(obj).forEach(function (val) {
      if (isRedactable(this.key, val)) {
        this.update(redacted)
      }
    })
  }

  return {
    map,
    forEach
  }
}
