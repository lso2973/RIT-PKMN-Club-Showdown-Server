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

	// Anonymous Pulsar
	upload: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Upload",
		shortDesc: "Reset positive stat boosts + Taunt",
		desc: "Resets all of the target's positive stat boosts before dealing damage, and applies Taunt.",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile('upload');
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Techno Blast', target);
			this.add('-anim', target, 'Hyper Beam', target);
		},
		condition: {
			duration: 1,
			noCopy: true,
			onBeforeMovePriority: 7,
			onBeforeMove(pokemon, target, move) {
				let boostName: BoostID;
				for (boostName in target.boosts) {
					if (target.boosts[boostName] > 0) {
						switch (boostName) {
						case 'atk':
							this.boost({atk: -1 * target.boosts[boostName]}, target);
							break;
						case 'def':
							this.boost({def: -1 * target.boosts[boostName]}, target);
							break;
						case 'spa':
							this.boost({spa: -1 * target.boosts[boostName]}, target);
							break;
						case 'spd':
							this.boost({spd: -1 * target.boosts[boostName]}, target);
							break;
						case 'spe':
							this.boost({spe: -1 * target.boosts[boostName]}, target);
							break;
						case 'accuracy':
							this.boost({accuracy: -1 * target.boosts[boostName]}, target);
							break;
						case 'evasion':
							this.boost({evasion: -1 * target.boosts[boostName]}, target);
							break;
						}
					}
				}
				this.add('message', `${target.name}'s positive stat boosts were reset by ${pokemon.name}'s ${move.name}!`);
			},
		},
		secondary: {
			chance: 100,
			volatileStatus: 'taunt',
		},
		target: "normal",
		type: "Steel",
	},

	// Psych Up clone for Analysis (UNUSED, see ../abilities.ts)
	analyzing: {
		inherit: true, // again not sure why this is here -- probably so Analysis can use it...
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDesc: "Copy polar opposite of enemy stat boosts",
		desc: "Copies the opponent's stat boosts, but in their polar opposite.",
		name: "Analyzing...",
		gen: 9,
		pp: 10,
		priority: 0,
		onTryHit(pokemon, target, move) {
			this.add('message', `${target.name} flipped the polarity of ${pokemon.name}'s stat boosts, and tried to copy them!`);
			let boostName: BoostID;
			for (boostName in target.boosts) {
				// only for "boosts", so don't copy negative stat changes
				if (target.boosts[boostName] > 0) {
					switch (boostName) {
					case 'atk':
						this.boost({def: target.boosts[boostName]});
						break;
					case 'def':
						this.boost({atk: target.boosts[boostName]});
						break;
					case 'spa':
						this.boost({spd: target.boosts[boostName]});
						break;
					case 'spd':
						this.boost({spa: target.boosts[boostName]});
						break;
						// speed has no counterpart
					case 'accuracy':
						this.boost({evasion: pokemon.boosts[boostName]});
						break;
					case 'evasion':
						this.boost({accuracy: pokemon.boosts[boostName]});
						break;
					}
				}
			}
		},
		target: "normal",
		type: "Steel",
	},

	// broil
	pharaohscurse: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		shortDesc: "Afflicts the target with curse.",
		desc: "Gives the target the curse effect which causes the target to lose 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected.",
		name: "Pharaoh's Curse",
		gen: 9,
		pp: 15,
		priority: 0,
		flags: {protect: 1},
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
		secondary: null,
		target: 'randomNormal',
		type: "Ghost",
	},

	// davidts
	rubyscurse: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		shortDesc: "Body Press + SSA-esque category switch.",
		desc: "This move inflicts physical damage or special damage, depending on which is more effective. For physical damage, the user’s Defense is used for damage calculation instead of Attack, and for special damage, the user’s Sp.Def is used for damage calculation instead of Sp.Atk. This attack also has a 10% chance to inflict a random status effect on the opponent.",
		name: "Ruby's Curse",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		// use Defense for Offensive stat
		overrideOffensiveStat: 'def',
		// TODO: Add animation?
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
		secondary: null,
		target: "normal",
		type: "Dark",
	},

	internettroll: {
		accuracy: 100,
		basePower: 120,
		category: "Special",
		shortDesc: "80% chance to poison, burns otherwise.",
		desc: "A powerfully toxic move that has an 80/20 chance to either Poison or Burn the opponent, respectively.",
		name: "Internet Troll",
		gen: 9,
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
	},

	// Peekz1025
	verdantblade: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		shortDesc: "Always crits, unless target cannot be crit.",
		desc: "This move is always a critical hit, unless the target is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities.",
		name: "Verdant Blade",
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
		target: "normal",
		type: "Grass",
	},


	// NEW STB SETS

	// 8biteki / ya-da-ne
	rngmanipulation: {
		accuracy: true, // bypass accuracy checks
		basePower: 60,
		category: "Special",
		shortDesc: "Always crits. Can't miss. Set Lucky Chant on hit.",
		desc: "This move will always result in a critical hit, and cannot miss. If this move hits, it applies Lucky Chant on the user for 5 turns.",
		name: "RNG Manipulation",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		willCrit: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hypnosis', source);
			this.add('-anim', source, 'Stored Power', target);
			this.add('-anim', source, 'Luster Purge', target);
		},
		self: {
			sideCondition: 'luckychant',
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Psychic",
	},

	// Banded Bonks
	firsterimpression: {
		accuracy: true,
		basePower: 100,
		category: "Physical",
		shortDesc: "First Impression + Pursuit; no BP/accuracy boost on switch",
		desc: "This move will fail unless it is the user's first turn on the field. If the target switches out this turn, this move hits the target before it can leave the field. If the opponent faints from this move, the replacement does not become active until the end of the turn. Unlike Pursuit, there is no boost to power on a switching target.",
		name: "Firster Impression",
		gen: 9,
		pp: 1,
		noPPBoosts: true, // so Firster Impression doesn't get 1.6 PP
		priority: 9001,
		flags: {contact: 1, protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onTry(source) {
			if (source.activeMoveActions > 1) {
				this.hint("Firster Impression only works on your first turn out.");
				return false;
			}
		},
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side.hasAlly(pokemon)) continue;
				side.addSideCondition('firsterimpression', pokemon);
				const data = side.getSideConditionData('firsterimpression');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onTryHit(target, pokemon) {
			target.side.removeSideCondition('firsterimpression');
		},
		condition: {
			// Make it so that the target is still hit if they try to switch,
			// but don't apply the Pursuit power/accuracy boosts
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Firster Impression start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Pursuit');
						alreadyAdded = true;
						// Check if we should be changing form before using Firster Impresison
						if (source.canMegaEvo || source.canUltraBurst) {
							for (const [actionIndex, action] of this.queue.entries()) {
								if (action.pokemon === source && action.choice === 'megaEvo') {
									this.actions.runMegaEvo(source);
									this.queue.list.splice(actionIndex, 1);
									break;
								}
							}
						}
						this.actions.runMove('firsterimpression', source, source.getLocOf(pokemon));
					}
				}
			},
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, "Nasty Plot", source);
			this.add('-anim', source, "Stomping Tantrum", target);
			this.add('-anim', source, "Behemoth Blade", target);
		},
		secondary: null,
		target: "normal",
		type: "Bug",
	},

	// Hustle Room for Banded Bonks's Hustle Surge
	hustleroom: {
		inherit: true, // why is this necessary??? maybe so Hustle Surge can use it?
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Hustle Room",
		shortDesc: "All moves have 80% accuracy.",
		desc: "For 5 turns, Hustle Room is set. In Hustle Room, all moves have their accuracy set to 80%, regardless of their original accuracy.",
		gen: 9,
		pp: 10,
		priority: 0,
		pseudoWeather: 'hustleroom',
		onPrepareHit(target, source) {
			this.add('-anim', source, "Wonder Room", source);
		},
		condition: {
			duration: 5,
			onFieldStart(battle, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Hustle Room', '[from] ability: ' + effect, '[of] ' + source, '[silent]');
					this.add('-message', "Dimensions became warped! Everyone feels Hustled!");
					this.hint("In Hustle Room, all moves have 80% accuracy.");
				} else {
					this.add('-fieldstart', 'move: Hustle Room', '[silent]');
					this.add('-message', "Dimensions became warped! Everyone feels Hustled!");
					this.hint("In Hustle Room, all moves have 80% accuracy.");
				}
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('hustleroom');
			},
			// make all moves have 80% of their original accuracy
			onAccuracy(accuracy, target, source, move) {
				// Currently does not affect Poison-types
				// using Toxic (which gives it perfect accuracy),
				// and might also not affect other accuracy-bypassing
				// effects (ex: using Stomp on a target who has used
				// Minimize beforehand).
				// But, since no STB sets are Poison-types with Toxic,
				// this interaction is safe to ignore (for now)
				return 80;
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 1,
			onFieldEnd() {
				this.add('-fieldend', 'move: Hustle Room');
			},
		},
		secondary: null,
		target: "all",
		type: "Bug",
	},
};
