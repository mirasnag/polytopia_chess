import { randomBigInt, serializeBigIntData } from "@/utils/bigint.util";

describe("randomBigInt()", () => {
  it("returns a BigInt within [0, 2^64)", () => {
    const val = randomBigInt();
    expect(typeof val).toBe("bigint");
    expect(val).toBeGreaterThanOrEqual(BigInt(0));
    const maxExclusive = BigInt("18446744073709551616");
    expect(val).toBeLessThan(maxExclusive);
  });

  it("produces different values on subsequent calls", () => {
    for (let i = 0; i < 10; i++) {
      expect(randomBigInt()).not.toBe(randomBigInt());
    }
  });
});

describe("serializeBigIntData()", () => {
  it("converts BigInt values to strings in JSON", () => {
    const data = {
      small: BigInt(42),
      nested: { x: BigInt(1), y: [BigInt(2), "foo", 3] },
      normal: "bar",
    };
    const json = serializeBigIntData(data);
    const parsed = JSON.parse(json);
    expect(parsed.small).toBe("42");
    expect(typeof parsed.small).toBe("string");
    expect(parsed.nested.x).toBe("1");
    expect(parsed.nested.y[0]).toBe("2");
    expect(parsed.nested.y[1]).toBe("foo");
    expect(parsed.nested.y[2]).toBe(3);
    expect(parsed.normal).toBe("bar");
  });

  it("handles arrays of BigInt correctly", () => {
    const arr = [BigInt(10), BigInt(20), BigInt(30)];
    const json = serializeBigIntData(arr);
    const parsed = JSON.parse(json);
    expect(parsed).toEqual(["10", "20", "30"]);
  });
});
