export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {

	/*
	// Example:
	id: {
		inherit: true, // Always use this, makes the Pokemon inherit its default values from the parent mod
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100}, // the base stats for the Pokemon
	},
	*/

	// For convenience, include alterations based on alphapetical order
	// and include what changes were made

	// OLD STB SETS

	// broil
	//	Changes: Type change
	furfrou: {
		inherit: true,
		types: ["Normal", "Ghost"],
	},

	// davidts
	//	Changes: Ability change (Magic Guard => Goblin Power)
	sableyemega: {
		inherit: true,
		abilities: {0: "Goblin Power"},
	},

	// Peekz1025
	// 	Changes: BST change, Ability change (Lightningrod => Forest's Wrath)
	sceptile: {
		inherit: true,
		baseStats: {hp: 70, atk: 105, def: 65, spa: 85, spd: 85, spe: 120},
	},
	sceptilemega: {
		inherit: true,
		baseStats: {hp: 70, atk: 145, def: 75, spa: 110, spd: 85, spe: 145},
		abilities: {0: "Forest's Wrath"},
	},

	// gigigecko26
	//	Changes: BST change
	zigzagoon: {
		inherit: true,
		baseStats: {hp: 80, atk: 100, def: 100, spa: 120, spd: 80, spe: 110},
	},

	// NEW STB SETS

	// These two are the same person
	// 8biteki
	//	Changes: Type change, BST change
	necrozmadawnwings: {
		inherit: true,
		types: ["Ice", "Psychic"],
		baseStats: {hp: 70, atk: 30, def: 55, spa: 125, spd: 125, spe: 95},
	},
	// ya-da-ne
	tapulele: {
		inherit: true,
		types: ["Ice", "Psychic"],
		baseStats: {hp: 70, atk: 30, def: 55, spa: 125, spd: 125, spe: 95},
	},
	// These two are the same person

};
