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

kvif.content2hash = function(content=Buffer.allocUnsafe(0), algorithm="sha512", encoding="hex"){
  const hash = require("crypto").createHash(algorithm || "sha512")
  hash.update(content || Buffer.allocUnsafe(0))
  return hash.digest(encoding || "hex")
}

kvif.factory = {
  new_db_from_map_like: map_like => {
    return {
      get: (key, cb) => cb(null, map_like.get(key))
    }
  },
  new_checked_db_from_map_like: (map_like, new_content_name, new_hash_name, content2hash) => {
    const d_ncn = name => name + ".content"
    const d_nhn = name => name + ".sha512"
    const ncn = new_content_name || d_ncn
    const nhn = new_hash_name    || d_nhn
    const c2h = content2hash     || kvif.content2hash
    return {
      set: (key, value, cb) => {
        const kc = ncn(key)
        const kh = nhn(key)
        map_like.set(kc, value)
        map_like.set(kh, c2h(value))
        cb(null)
      },
      get: (key, cb) => {
        const kc = ncn(key)
        const kh = nhn(key)
        const c  = map_like.get(kc)
        const h  = map_like.get(kh)
        switch(h === c2h(c)){
          case false: return cb(new Error("data corruption."), undefined)
          case  true: return cb(null                         ,         c)
        }
      },
    }
  },
}

return kvif

}))
