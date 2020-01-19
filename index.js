(function(global, factory){
  const e = "object"    === typeof(exports)
  const m = "undefined" !== typeof(module)
  const c = e && m
  if(c) module.exports = factory()
  else  global.kvif    = factory()
})(this, (function(){

const kvif = {}

kvif.check_hash_default = function(map_like, cb){ cb(null) }

kvif.get = function(map_like, key, cb){
  const {
    get,
    check_hash,
  } = map_like
  const ch = check_hash || kvif.check_hash_default
  ch(map_like, function(e){
    switch(e){
      default:        return cb(e)
      case null:      return get(key, cb)
      case undefined: return get(key, cb)
    }
  })
}

return kvif

}))
