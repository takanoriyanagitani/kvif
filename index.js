(function(global, factory){
  const e = "object"    === typeof(exports)
  const m = "undefined" !== typeof(module)
  const c = e && m
  if(c) module.exports = factory()
  else  global.kvif    = factory()
})(this, (function(){

const kvif = {}

kvif.check_hash_default = function(db, cb){ cb(null) }

kvif.get = function(db, key, cb){
  const {
    get,
    check_hash,
  } = db
  const ch = check_hash || kvif.check_hash_default
  ch(db, function(e){
    switch(e){
      default:        return cb(e)
      case null:      return get(key, cb)
      case undefined: return get(key, cb)
    }
  })
}

return kvif

}))
