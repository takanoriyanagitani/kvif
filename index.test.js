const kvif = require("./index")

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
        check_hash: (map_like, cb) => cb(undefined),
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
        check_hash: (map_like, cb) => cb(new Error("data corruption.")),
      }
      kvif.get(m, undefined, (e, value) => {
        expect(typeof(e)).toBe("object")
        expect(e.message).toBe("data corruption.")
        expect(value).toBe(undefined)
      })
    })

  })

})
