const kvif = require("./index")

const {
  check_hash_default,
  get,
} = kvif || {}

test("type tests", () => {
  expect(typeof(kvif)).toBe("object")
  expect(typeof(check_hash_default)).toBe("function")
  expect(typeof(get)).toBe("function")
})
