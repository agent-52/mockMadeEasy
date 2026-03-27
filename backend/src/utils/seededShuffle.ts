import seedrandom from "seedrandom"

export function seededShuffle<T>(array: T[], seed:string): T[]{
    const rng = seedrandom(seed)
    return [...array].sort(() => rng() - 0.5)
}