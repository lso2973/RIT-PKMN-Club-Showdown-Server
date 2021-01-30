export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	/*
	// Example
	id: {
		inherit: true, // Always use this, makes the pokemon inherit its default values from the parent mod (gen7)
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100}, // the base stats for the pokemon
	},
	*/
	// type change for broil
	furfrou: {
		inherit: true,
		types: ["Normal", "Ghost"],
	},
	// stat changes for Peekz1025
	sceptile: {
		inherit: true,
		baseStats: {hp: 70, atk: 105, def: 65, spa: 85, spd: 85, spe: 120},
	},
	sceptilemega: {
		inherit: true,
		baseStats: {hp: 70, atk: 145, def: 75, spa: 110, spd: 85, spe: 145},
		abilities: {0: "Forest's Wrath"},
	},
	// stat changes for gigigecko26
	zigzagoon: {
		inherit: true,
		baseStats: {hp: 80, atk: 100, def: 100, spa: 120, spd: 80, spe: 110},
	},
};
