const kvif = require("./index")

describe("content2hash", () => {

  it("undefined", () => {
    expect(kvif.content2hash(undefined, undefined, undefined)).toBe("cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e")
  })

  it("null", () => {
    expect(kvif.content2hash(null, null, null)).toBe("cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e")
  })

  it("empty", () => {
    expect(kvif.content2hash("", "", "")).toBe("cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e")
  })

  it("123", () => {
    expect(kvif.content2hash("123", "sha512", "hex")).toBe("3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2")
  })

})

describe("check_hash_default", () => {

  it("always null(no error)", () => {
    kvif.check_hash_default(null, ok => expect(ok).toBe(null))
  })

})

describe("get", () => {

  describe("default map", () => {

    it("undefined key", () => {
      const m = {
        map: new Map(),
        get: (key, cb) => cb(null, m.map.get(key)),
      }
      kvif.get(m, undefined, (e, value) => {
        expect(e).toBe(null)
        expect(value).toBe(undefined)
      })
    })

    it("null key", () => {
      const m = {
        map: new Map(),
        get: (key, cb) => cb(null, m.map.get(key)),
      }
      kvif.get(m, null, (e, value) => {
        expect(e).toBe(null)
        expect(value).toBe(undefined)
      })
    })

    it("empty key", () => {
      const m = {
        map: new Map(),
        get: (key, cb) => cb(null, m.map.get(key)),
      }
      kvif.get(m, "", (e, value) => {
        expect(e).toBe(null)
        expect(value).toBe(undefined)
      })
    })

    it("0 byte key", () => {
      const m = {
        map: new Map(),
        get: (key, cb) => cb(null, m.map.get(key)),
      }
      kvif.get(m, Buffer.from(""), (e, value) => {
        expect(e).toBe(null)
        expect(value).toBe(undefined)
      })
    })

    it("key found", () => {
      const m = {
        map: new Map(),
        get: (key, cb) => cb(null, m.map.get(key)),
      }
      m.map.set("k0", "v0")
      kvif.get(m, "k0", (e, value) => {
        expect(e).toBe(null)
        expect(value).toBe("v0")
      })
    })

  })

  describe("map with integrity check", () => {

    it("undefined error", () => {
      const m = {
        map: new Map(),
        get: (key, cb) => cb(null, m.map.get(key)),
        check_hash: (db, cb) => cb(undefined),
      }
      kvif.get(m, undefined, (e, value) => {
        expect(e).toBe(null)
        expect(value).toBe(undefined)
      })
    })

    it("integrity check error", () => {
      const m = {
        map: new Map(),
        get: (key, cb) => cb(null, m.map.get(key)),
        check_hash: (db, cb) => cb(new Error("data corruption.")),
      }
      kvif.get(m, undefined, (e, value) => {
        expect(typeof(e)).toBe("object")
        expect(e.message).toBe("data corruption.")
        expect(value).toBe(undefined)
      })
    })

  })

})

describe("factory", () => {

  describe("new_db_from_map_like", () => {

    const m = new Map()
    m.set(634, 333)

    it("undefined", () => kvif.factory.new_db_from_map_like(m).get(undefined, (e, value) => {
      expect(e).toBe(null)
      expect(value).toBe(undefined)
    }))

    it("null", () => kvif.factory.new_db_from_map_like(m).get(null, (e, value) => {
      expect(e).toBe(null)
      expect(value).toBe(undefined)
    }))

    it("empty", () => kvif.factory.new_db_from_map_like(m).get("", (e, value) => {
      expect(e).toBe(null)
      expect(value).toBe(undefined)
    }))

    it("integer", () => kvif.factory.new_db_from_map_like(m).get(634, (e, value) => {
      expect(e).toBe(null)
      expect(value).toBe(333)
    }))

  })

  describe("new_checked_db_from_map_like", () => {

    const m = new Map()

    describe("set", () => {

      const db = kvif.factory.new_checked_db_from_map_like(m)

      it("empty", () => {
        db.set("", "", e => {
          expect(e).toBe(null)
          const v = m.get(".content")
          expect(v).toBe("")
          const h = m.get(".sha512")
          expect(h).toBe("cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e")
        })
      })

      it("123", () => {
        db.set("k0", "123", e => {
          expect(e).toBe(null)
          const v = m.get("k0.content")
          expect(v).toBe("123")
          const h = m.get("k0.sha512")
          expect(h).toBe("3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2")
        })
      })

    })

  })

})
