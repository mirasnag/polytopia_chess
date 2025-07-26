const powerOfTwo = 2 ** 32;

export function randomBigInt(): bigint {
  const firstPart = BigInt(Math.floor(Math.random() * powerOfTwo));
  const secondPart = BigInt(Math.floor(Math.random() * powerOfTwo));
  return firstPart * BigInt(powerOfTwo) + secondPart;
}

export function serializeBigIntData(data: any): string {
  return JSON.stringify(data, (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  });
}
