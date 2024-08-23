// import {stbSets} from "./random-teams";
// import {getName} from "./scripts";

export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {

	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		shortDesc: "", // short description, shows up in /dt
		desc: "", // long description
		name: "Move Name",
		gen: 8,
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/smogon/pokemon-showdown/blob/master/data/moves.js#L1-L27
		onTryMove() {
			this.attrLastMove('[still]'); // For custom animations
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Move Name 1', source);
			this.add('-anim', source, 'Move Name 2', source);
		}, // For custom animations
		secondary: {
			status: "tox",
			chance: 20,
		}, // secondary, set to null to not use one. Exact usage varies, check data/moves.js for examples
		target: "normal", // What does this move hit?
		// normal = the targeted foe, self = the user, allySide = your side (eg light screen), foeSide = the foe's side (eg spikes), all = the field (eg raindance). More can be found in data/moves.js
		type: "Water", // The move's type
		// Other useful things
		noPPBoosts: true, // add this to not boost the PP of a move, not needed for Z moves, dont include it otherwise
		isZ: "crystalname", // marks a move as a z move, list the crystal name inside
		zMove: {effect: ''}, // for status moves, what happens when this is used as a Z move? check data/moves.js for examples
		zMove: {boost: {atk: 2}}, // for status moves, stat boost given when used as a z move
		critRatio: 2, // The higher the number (above 1) the higher the ratio, lowering it lowers the crit ratio
		drain: [1, 2], // recover first num / second num % of the damage dealt
		heal: [1, 2], // recover first num / second num % of the target's HP
	},
	*/

	// Please keep sets organized alphabetically based on username!

	// OLD STB SETS

	// broil
	pharaohscurse: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Gives the target the curse effect which causes the target to lose 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected.",
		shortDesc: "Afflicts the target with curse",
		name: "Pharaoh's Curse",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(target, source) {
			this.add('-anim', source, 'Freezing Glare', target);
		},
		onTryHit(target, source, move) {
			if (move.volatileStatus &&
				(target.volatiles['curse'] ||
					target.volatiles['pharaohscurse'] ||
					target.volatiles['haunting'])) {
				return false;
			}
		},
		gen: 9,
		volatileStatus: 'pharaohscurse',
		condition: {
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'Pharaoh\'s Curse', '[silent]');
				this.add('-message', `${pokemon.name} was afflicted with the Pharaoh's Curse!`);
			},
			onResidualOrder: 10,
			onResidual(pokemon) {
				// todo: silence the -damage that battle.damage calls.
				this.damage(pokemon.baseMaxhp / 4);
				// this.add('-message', `${pokemon.name} is afflicted by the Pharaoh's Curse!`);
			},
		},
		pp: 15,
		priority: 0,
		flags: {protect: 1},
		isNonstandard: "Custom",
		target: 'randomNormal',
		type: "Ghost",
		zMove: {effect: 'curse'},
		contestType: "Tough",
	},

	// davidts
	rubyscurse: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "This move inflicts physical damage or special damage, depending on which is more effective. For physical damage, the user’s Defense is used for damage calculation instead of Attack, and for special damage, the user’s Sp.Def is used for damage calculation instead of Sp.Atk. This attack also has a 10% chance to inflict a random status effect on the opponent.",
		shortDesc: "Body Press + SSA-esque category switch",
		flags: {protect: 1, mirror: 1},
		name: "Ruby's Curse",
		onModifyMove(move, pokemon, target) {
			if (!target) return;
			const atk = pokemon.getStat('def', false, true);
			const spa = pokemon.getStat('spd', false, true);
			const def = target.getStat('def', false, true);
			const spd = target.getStat('spd', false, true);
			const physical = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * atk) / def) / 50);
			const special = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * spa) / spd) / 50);
			if (physical > special || (physical === special && this.random(2) === 0)) {
				move.category = 'Physical';
			}
		},
		pp: 10,
		priority: 0,
		gen: 9,
		// useSourceDefensiveAsOffensive: true,
		// ^ stub that out temporarily for now.
		secondary: null,
		target: "normal",
		type: "Dark",
	},

	internettroll: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		desc: "A powerfully toxic move that has an 80/20 chance to either Poison or Burn the opponent, respectively.",
		shortDesc: "80% chance to poison, otherwise burn",
		name: "Internet Troll",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Nasty Plot', source);
			this.add('-anim', source, 'Bonemerang', target);
			this.add('-anim', source, 'Sludge Wave', target);
			this.add('-anim', source, 'V-Create', source);
			this.add('-anim', source, 'Snore', source);
		},
		secondary: {
			chance: 100,
			onHit(target, source) {
				const result = this.random(5);
				if (result === 0) {
					target.trySetStatus('brn', source);
				} else {
					target.trySetStatus('psn', source);
				}
			},
		},
		target: "normal",
		type: "Poison",
		isNonstandard: "Custom",
		gen: 9,
	},

	// Peekz1025
	verdantblade: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Verdant Blade",
		desc: "This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities.",
		shortDesc: "Always crits*",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {contact: 1, mirror: 1, protect: 1},
		willCrit: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Leaf Blade', target);
		},
		secondary: null,
		isNonstandard: "Custom",
		target: "normal",
		type: "Grass",
	},


	// NEW STB SETS

// 8biteki / ya-da-ne
};
