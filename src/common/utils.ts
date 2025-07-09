export function createBrandedId<K extends string>(prefix: K): `${K}-${string}` {
  const id = crypto.randomUUID();
  return `${prefix}-${id}`;
}
