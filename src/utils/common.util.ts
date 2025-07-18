export function createBrandedId<K extends string>(prefix: K): `${K}-${string}` {
  const id = crypto.randomUUID();
  return `${prefix}-${id}`;
}

// Fisher-Yates Shuffle
export function shuffleArray(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function getRandomArrayEntry<T extends any>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);

  return array[randomIndex];
}
