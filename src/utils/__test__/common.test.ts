import {
  createBrandedId,
  shuffleArray,
  getRandomArrayEntry,
} from "@/utils/common.util";

describe("createBrandedId()", () => {
  const mockRandomId = "1234-1234-1234-1234-1234";
  beforeAll(() => {
    // stub crypto.randomUUID
    jest.spyOn(crypto, "randomUUID").mockReturnValue(mockRandomId);
  });
  afterAll(() => {
    (crypto.randomUUID as jest.Mock).mockRestore();
  });

  it("returns a string with the given prefix", () => {
    const id = createBrandedId("unit");
    expect(id).toBe(`unit-${mockRandomId}`);
  });
});

describe("shuffleArray()", () => {
  const original = [1, 2, 3, 4, 5];

  it("returns a permutation of the original array", () => {
    // stub Math.random to a fixed sequence
    const randValues = [0.1, 0.5, 0.9, 0.2, 0.7];
    let call = 0;
    jest.spyOn(Math, "random").mockImplementation(() => {
      return randValues[call++ % randValues.length];
    });

    const arr = [...original];
    const shuffled = shuffleArray(arr);
    // same length
    expect(shuffled).toHaveLength(original.length);
    // same elements (multiset equality)
    expect(shuffled.sort()).toEqual(original.sort());
    (Math.random as jest.Mock).mockRestore();
  });
});

describe("getRandomArrayEntry()", () => {
  const arr = ["a", "b", "c", "d"];
  it("returns element at computed index", () => {
    // stub Math.random to return 0.5, index = floor(0.5 * 4) = 2
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    const entry = getRandomArrayEntry(arr);
    expect(entry).toBe("c");
    (Math.random as jest.Mock).mockRestore();
  });
});
