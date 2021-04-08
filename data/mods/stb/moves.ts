import {getName} from './conditions';
import {Pokemon} from '../../../sim/pokemon';

export function changeLevel(context: Battle, pokemon: Pokemon, levelDiff: number) {
	const species = pokemon.species;
	const level = pokemon.level + levelDiff;
	(pokemon as any).level = level;
	pokemon.set.level = level;
	pokemon.formeChange(species);

	pokemon.details = species.name + (level === 100 ? '' : ', L' + level) +
		(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
	context.add('detailschange', pokemon, pokemon.details);

	const newHP = Math.floor(Math.floor(
		2 * species.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100
	) * level / 100 + 10);
	pokemon.hp = newHP - (pokemon.maxhp - pokemon.hp);
	pokemon.maxhp = newHP;
	context.add('-heal', pokemon, pokemon.getHealth, '[silent]');
}

export const Moves: {[k: string]: ModdedMoveData} = {
	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Move Name",
		isNonstandard: "Custom",
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
	// Please keep sets organized alphabetically based on staff member name!
	// ATcheron
	buffice: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Buff Ice",
		desc: "When calculating type effectiveness, this move is supereffective against Water-type Pokémon, regardless of the move's typing. If the target is Water-type, it no longer resists Ice-type attacks until it switches out.",
		shortDesc: "Freeze Dry + makes Water types not resist Ice",
		gen: 8,
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Water' && !target!.volatiles['buffice']) return 1;
		},
		onHit(target) {
			if (target.hasType('Water')) {
				target.addVolatile('buffice');
			}
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Ice Beam', target);
			this.add('-anim', target, 'Blizzard', target);
		},
		condition: {
			onSourceBasePowerPriority: 18,
			onSourceBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Ice') {
					return this.chainModify(2);
				}
			},
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		isNonstandard: "Custom",
		target: "normal",
		type: "Ice",
	},
	// AWood
	headshot: {
		accuracy: 100,
		basePower: 250,
		category: "Physical",
		name: "Headshot",
		desc: "The user faints after using this move, unless this move has no target. The target's Defense is halved during damage calculation. This move is prevented from executing if any active Pokemon has the Damp Ability. Summons Hail.",
		shortDesc: "Gen IV Explosion + Hail",
		gen: 8,
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(target, source) {
			this.add('-anim', source, 'Bullet Punch', target);
		},
		self: {
			onHit(source) {
				this.field.setWeather('hail');
			},
		},
		selfdestruct: "always",
		secondary: null,
		isNonstandard: "Custom",
		target: "allAdjacent",
		type: "Normal",
	},
	// bad_wolf42
	rollaround: {
		accuracy: 100,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			return 20 * move.hit;
		},
		category: "Physical",
		desc: "This move hits three times. Has base power 20, 40, and 60 for respect hits 1, 2, and 3. Each time the move hits, the user's speed is increased by one stage, removes entry hazards from the user's side of the field, and the user sets a layer of spikes.",
		shortDesc: "Triple Axel but 100 accuracy and Rapid Spin + Spikes",
		name: "Roll Around",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		multihit: 3,
		multiaccuracy: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(target, source) {
			this.add('-anim', source, 'Mud Sport', target);
			this.add('-anim', source, 'Spikes', target);
		},
		onAfterHit(target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		onAfterSubDamage(damage, target, pokemon) {
			if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
				this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
			}
			const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const condition of sideConditions) {
				if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
			}
			if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
				pokemon.removeVolatile('partiallytrapped');
			}
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		sideCondition: 'spikes',
		isNonstandard: "Custom",
		target: "normal",
		type: "Ground",
		zMove: {basePower: 120},
		maxMove: {basePower: 140},
	},
	// Banded Bonks
	bonk: {
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "bonk.",
		desc: "Has a 30% chance to make the target flinch.",
		shortDesc: "30% chance to flinch",
		gen: 8,
		pp: 15,
		priority: 0,
		flags: {contact: 1, mirror: 1, protect: 1},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		// No move animation needed
		isNonstandard: "Custom",
		target: "normal",
		type: "Steel",
	},
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
			if (move.volatileStatus && (target.volatiles['curse'] || target.volatiles['pharaohscurse'] || target.volatiles['haunting'])) {
				return false;
			}
		},
		gen: 8,
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
		flags: {authentic: 1, protect: 1},
		isNonstandard: "Custom",
		target: 'randomNormal',
		type: "Ghost",
		zMove: {effect: 'curse'},
		contestType: "Tough",
	},
	// Creeperman129Poke
	haunting: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Gives the target the curse effect which causes the target to lose 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected.",
		shortDesc: "Afflicts the target with curse",
		name: "Haunting",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dark Void', target);
		},
		secondary: {
			chance: 100,
			volatileStatus: 'haunting',
		},
		condition: {
			onStart(pokemon, source) {
				if (pokemon.volatiles['curse'] || pokemon.volatiles['pharaohscurse'] || pokemon.volatiles['hauntingcurse']) {
					return null;
				}
				this.add('-start', pokemon, 'Haunting', '[silent]');
				this.add('-message', `${pokemon.name} became Haunted!`);
			},
			onResidualOrder: 10,
			onResidual(pokemon) {
				// todo: silence the -damage that battle.damage calls.
				this.damage(pokemon.baseMaxhp / 4);
				// this.add('-message', `${pokemon.name} is afflicted by the Haunting!`);
			},
		},
		pp: 5,
		priority: 0,
		isNonstandard: "Custom",
		target: "normal",
		flags: {protect: 1},
		type: "Ghost",
		contestType: "Tough",
		gen: 8,
	},
	// crimsonKangaroo
	stareater: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Restores HP equal to the average of the target's Atk and SpAtk stats, and lowers whichever one is higher by one stage.",
		shortDesc: "Heals by target's (Atk+SpA)/2, -1 to opponent's higher stat.",
		name: "Star Eater",
		gen: 8,
		flags: {protect: 1, mirror: 1, heal: 1},
		onHit(target, source) {
			const stat = (target.getStat('atk', false, true) + target.getStat('spa', false, true)) / 2;
			const success = this.boost(target.getStat('atk', false, true) > target.getStat('spa', false, true) ?
				{atk: -1} : {spa: -1}, target, source, null, false, true);
			return !!(this.heal(stat, source, target) || success);
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Giga Drain', target);
			this.add('-anim', source, 'Sunsteel Strike', target);
		},
		secondary: null,
		pp: 10,
		priority: 0,
		isNonstandard: "Custom",
		target: "normal",
		type: "Steel",
	},
	// gigigecko26
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
		gen: 8,
	},
	// Ignoritus
	spectralterrain: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Summons Spectral Terrain. While Spectral Terrain is active, all Pokémon on the field gain the Ghost typing in addition to their normal typings, and removes type-based immunities to Ghost-type attacks.",
		shortDesc: "Terrain that removes type immunity to ghost moves and gives Pokémon extra ghost type",
		name: "Spectral Terrain",
		pp: 10,
		priority: 0,
		gen: 8,
		flags: {nonsky: 1},
		terrain: 'spectralterrain',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Never-Ending Nightmare', source);
			this.add('-anim', target, 'Never-Ending Nightmare', target);
		},
		condition: { // TODO: Make the adding ghost type part less cursed
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onStart(battle, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Spectral Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Spectral Terrain');
				}
			},
			onModifyMovePriority: -5,
			onTryHit(source, target, move) {
				if (!target.isSemiInvulnerable() && target.isGrounded()) {
					if (!move.ignoreImmunity) move.ignoreImmunity = {};
					if (move.ignoreImmunity !== true) {
						move.ignoreImmunity['Ghost'] = true;
					}
				}
			},
			onBeforeMove(source, target, move) {
				this.eachEvent('Terrain');
			},
			onTerrain(pokemon) {
				if (pokemon.hasType('Ghost') || !pokemon.isGrounded()) return;
				if (!pokemon.addType('Ghost')) return;
				this.add('-start', pokemon, 'typeadd', 'Ghost', '[from] terrain: Spectral Terrain');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasType('Ghost') || !pokemon.isGrounded()) return;
				if (!pokemon.addType('Ghost')) return;
				this.add('-start', pokemon, 'typeadd', 'Ghost', '[from] terrain: Spectral Terrain');
			},
			onEnd(field) {
				let side;
				let mon;
				for (side of field.battle.sides) {
					for (mon of side.pokemon) {
						if (mon.addedType === 'Ghost') {
							mon.addedType = '';
						}
					}
				}
				this.add('-fieldend', 'move: Spectral Terrain');
			},
		},
		secondary: null,
		target: "all",
		type: "Ghost",
		isNonstandard: "Custom",
		zMove: {boost: {spd: 1}},
		contestType: "Beautiful",
	},
	// Jerrytkrot
	frogeblessings: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Froge Blessings",
		desc: "The target is forced to switch out and be replaced with a random unfainted ally. Then boosts the new ally’s stats by +1 stage and replaces its ability with Normalize. Fails if the target is the last unfainted Pokemon in its party, or if the target used Ingrain previously or has the Suction Cups Ability.",
		shortDesc: "Whirlwind + omniboosts & Normalizes target",
		gen: 8,
		pp: 5,
		priority: -6,
		flags: {reflectable: 1, mirror: 1, authentic: 1, mystery: 1},
		forceSwitch: true,
		sideCondition: 'frogeblessings',
		condition: {
			onSwitchIn(pokemon) {
				this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, pokemon);
				if (!(pokemon.getAbility().isPermanent || pokemon.ability === 'simple' || pokemon.ability === 'truant')) {
					const oldAbility = pokemon.setAbility('normalize');
					if (oldAbility) {
						this.add('-ability', pokemon, 'Normalize', '[from] move: Froge Blessings');
					}
				}
				pokemon.side.removeSideCondition('frogeblessings');
			},
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onHit(target, source) {
			this.add('-anim', source, 'Celebrate', target);
		},
		secondary: null,
		isNonstandard: "Custom",
		target: "normal",
		type: "Water",
	},
	// MeepingtonThe3rd
	mentalbrick: {
		accuracy: true,
		basePower: 80,
		category: "Special",
		name: "Mental Brick",
		desc: "This move deals neutral damage to Dark- and Steel-types. This move cannot miss.",
		shortDesc: "Neutral dmg to Dark/Steel. Can't miss.",
		gen: 8,
		pp: 20,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Dark' || type === 'Steel') return 0;
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', target, 'Brick Break', target);
		},
		secondary: null,
		isNonstandard: "Custom",
		target: "normal",
		type: "Psychic",
	},
	// MightySharkVGC
	toomanyswords: {
		accuracy: 90,
		basePower: 25,
		category: "Physical",
		name: "Too Many Swords",
		desc: "Hits two to five times. Raises the user's Attack and Speed by 1 stage after the last hit. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times. Applies the Steelspike effect to the opponent’s side of the field.",
		shortDesc: "Scale Shot w/ dd boosts + Steelspike",
		gen: 8,
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Scale Shot', target);
			this.add('-anim', source, 'Sacred Sword', target);
		},
		multihit: [2, 5],
		sideCondition: 'gmaxsteelsurge',
		selfBoost: {
			boosts: {
				atk: 1,
				spe: 1,
			},
		},
		isNonstandard: "Custom",
		target: "normal",
		type: "Dragon",
		zMove: {boost: {accuracy: 1}},
		contestType: "Clever",
	},
	// njjoltiks
	burnout: {
		accuracy: 100,
		basePower: 250,
		category: "Physical",
		desc: "The user faints after using this move, even if this move fails for having no target. This move is prevented from executing if any active Pokémon has the Damp Ability.",
		shortDesc: "User faints after use",
		name: "Burn Out",
		gen: 8,
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Sacred Fire', source);
			this.add('-anim', source, 'Inferno Overdrive', target);
		},
		selfdestruct: "always",
		secondary: null,
		isNonstandard: "Custom",
		target: "allAdjacent",
		type: "Fire",
		contestType: "Beautiful",
	},
	// Peekz1025
	verdantblade: {
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Verdant Blade",
		desc: "This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities.",
		shortDesc: "Always crits*",
		gen: 8,
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
	// Planetaeus
	prestigitation: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Prestigitation",
		desc: "The user swaps its held item with the target's held item. Fails if either the user or the target is holding a Mail or Z-Crystal, if neither is holding an item, if the user is trying to give or take a Mega Stone to or from the species that can Mega Evolve with it, or if the user is trying to give or take a Blue Orb, a Red Orb, a Griseous Orb, a Plate, a Drive, or a Memory to or from a Kyogre, a Groudon, a Giratina, an Arceus, a Genesect, or a Silvally, respectively. The target is immune to this move if it has the Sticky Hold Ability.",
		shortDesc: "Psychic move that tricks",
		gen: 8,
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Psychic', target);
			this.add('-anim', source, 'Trick', target);
		},
		onTryImmunity(target) {
			return !target.hasAbility('stickyhold');
		},
		onHit(target, source, move) {
			const yourItem = target.takeItem(source);
			const myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, source.itemData, target, source, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem))
			) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			this.add('-activate', source, 'move: Trick', '[of] ' + target);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] move: Trick');
			} else {
				this.add('-enditem', target, yourItem, '[silent]', '[from] move: Trick');
			}
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] move: Trick');
			} else {
				this.add('-enditem', source, myItem, '[silent]', '[from] move: Trick');
			}
		},
		secondary: null,
		isNonstandard: "Custom",
		target: "normal",
		type: "Psychic",
	},
	// PseudoPhysics
	therest: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "User uses the moves Charm, Amnesia, Safeguard, Splash, Tickle, and Destiny Bond, in that order.",
		shortDesc: "charm>amnesia>safeguard>splash>tickle>d.bond",
		name: "{the rest}",
		isNonstandard: "Custom",
		gen: 8,
		pp: 5,
		priority: 0,
		flags: {authentic: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Extreme Evoboost', source);
		},
		onHit(target) {
			this.actions.useMove("Charm", target);
			this.actions.useMove("Amnesia", target);
			this.actions.useMove("Safeguard", target);
			this.actions.useMove("Splash", target);
			this.actions.useMove("Tickle", target);
			this.actions.useMove("Destiny Bond", target);
		},
		secondary: null,
		target: "self",
		type: "Psychic",
	},
	// QuantumTangler
	stalemeta: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "All Pokémon immediately lose up to 12 stages of all non-defensive stats and lose five levels. Sticky Webs is applied to the opponent's field. Each Pokémon that has not yet moved has their selected action replaced with a random known attack. Usually goes first.",
		shortDesc: "debuffs both sides, webs, target uses random move",
		name: "Stale Meta",
		pp: 5,
		isNonstandard: "Custom",
		gen: 8,
		priority: 3,
		flags: {protect: 1, mirror: 1, reflectable: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Mind Reader', target);
			this.add('-anim', source, 'Yawn', target);
			this.add('-anim', source, 'Flash', target);
		},
		onHit(target, source) {
			const pokelist = [target, source];
			for (const poke of pokelist) {
				this.boost({atk: -12, spa: -12, spe: -12}, poke);
				// level down opponent
				const species = poke.species;
				const level = poke.level - 5;
				(poke as any).level = level;
				poke.set.level = level;
				poke.formeChange(species);

				poke.details = species.name + (level === 100 ? '' : ', L' + level) +
					(poke.gender === '' ? '' : ', ' + poke.gender) + (poke.set.shiny ? ', shiny' : '');
				this.add('detailschange', poke, (poke.illusion || poke).details);

				const newHP = Math.floor(Math.floor(
					2 * species.baseStats['hp'] + poke.set.ivs['hp'] + Math.floor(poke.set.evs['hp'] / 4) + 100
				) * level / 100 + 10);
				poke.hp = newHP - (poke.maxhp - poke.hp);
				poke.maxhp = newHP;
				this.add('-heal', poke, poke.getHealth, '[silent]');
			}

			source.side.foe.addSideCondition('stickyweb');
		},
		volatileStatus: 'stalemeta',
		condition: {
			duration: 1,
			noCopy: true,
			onOverrideAction(pokemon, target, move) {
				if (!move || pokemon.volatiles['mustrecharge']) {
					return;
				}
				const moves = [];
				for (const moveSlot of pokemon.moveSlots) {
					const moveid = moveSlot.id;
					moves.push(moveid);
				}
				let randomMove = '';
				if (moves.length) randomMove = this.sample(moves);
				if (!randomMove) {
					return;
				}
				this.add('-singleturn', pokemon, 'Stale Meta', '[silent]');
				this.add('-message', `${pokemon.name}'s next move was randomized!`);
				return randomMove;
			},
		},
		secondary: null,
		target: "normal",
		type: "CoolTrainer",
	},
	// RibbonNymph
	ribbonsurge: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "For 5 turns, the terrain becomes Ribbon Terrain. During the effect, the power of Fairy type moves is multiplied by 1.3, the power of Dragon type moves is halved, and grounded Pokémon are protected from non-volatile status afflictions.",
		shortDesc: "Misty Terrain + Fairy 1.3x dmg",
		name: "Ribbon Surge",
		pp: 10,
		isNonstandard: "Custom",
		gen: 8,
		priority: 0,
		flags: {nonsky: 1, protect: 1, mirror: 1},
		onHit(target, pokemon) {
			this.field.setTerrain('ribbonterrain');
		},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Extreme Evoboost', target);
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		zMove: {boost: {spd: 1}},
		contestType: "Beautiful",
	},
	// RubyDragonQueen
	dragonforce: {
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		name: 'Dragonforce',
		gen: 8,
		pp: 5,
		priority: 0,
		desc: "A powerful Dragon-type attack that ignores screens and substitute and hits through Protect and type immunities.",
		shortDesc: "Ignores all screens, substitute and immunities.",
		flags: {contact: 1, mirror: 1, authentic: 1},
		infiltrates: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Outrage', source);
			this.add('-anim', source, 'Dragon Claw', target);
		},
		ignoreImmunity: {'Dragon': true},
		secondary: null,
		isNonstandard: "Custom",
		target: "normal",
		type: "Dragon",
	},
	// ScarTheColossus
	balance: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: 'Balance',
		gen: 8,
		pp: 10,
		priority: 0,
		desc: "Raises the user’s physical attack and defense by +1 stage and lower its speed by -1 stage. The user regains the item it last used. Fails if the user is holding an item, if the user has not held an item, if the item was a popped Air Balloon, if the item was picked up by a Pokémon with the Pickup Ability, or if the item was lost to Bug Bite, Covet, Incinerate, Knock Off, Pluck, or Thief. Items thrown with Fling can be regained. Burns the user.",
		shortDesc: "Curse + Recycle + self burn",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Extreme Evoboost', source);
		},
		flags: {snatch: 1},
		boosts: {atk: 1, def: 1, spe: -1},
		onHit(pokemon) {
			if (pokemon.item || !pokemon.lastItem) return false;
			const item = pokemon.lastItem;
			pokemon.lastItem = '';
			this.add('-item', pokemon, this.dex.items.get(item), '[from] move: Balance');
			pokemon.setItem(item);
		},
		secondary: {
			chance: 100,
			status: 'brn',
		},
		isNonstandard: "Custom",
		target: "self",
		type: "Normal",
		zMove: {boost: {atk: 1}},
		contestType: "Clever",
	},
	// Steeevo34
	retroincabulate: {
		accuracy: 80,
		basePower: 90,
		category: "Physical",
		name: 'Retroincabulate',
		gen: 8,
		pp: 5,
		priority: 0,
		desc: "If this move hits, for 5 turns, the evasiveness of all active Pokémon is multiplied by 0.6. At the time of use, Bounce, Fly, Magnet Rise, Sky Drop, and Telekinesis end immediately for all active Pokémon. During the effect, Bounce, Fly, Flying Press, High Jump Kick, Jump Kick, Magnet Rise, Sky Drop, Splash, and Telekinesis are prevented from being used by all active Pokémon. Ground-type attacks, Spikes, Toxic Spikes, Sticky Web, and the Arena Trap Ability can affect Flying types or Pokémon with the Levitate Ability. Fails if gravity is always in effect.",
		shortDesc: "Rock Move into Gravity",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Stone Edge', target);
			this.add('-anim', source, 'Rock Slide', target);
		},
		flags: {protect: 1, mirror: 1},
		pseudoWeather: 'gravity',
		secondary: null,
		isNonstandard: "Custom",
		target: "normal",
		type: "Rock",
	},
	// SteelOsprei
	stoneedgebutitdoesntmiss: {
		accuracy: true,
		basePower: 100,
		category: "Physical",
		name: 'Stone edge but it doesn\'t miss',
		gen: 8,
		pp: 5,
		priority: 0,
		desc: "Has a higher chance for a critical hit. Doesn't miss.",
		shortDesc: "Stone Edge but it doesn't miss.",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Stone Edge', target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: null,
		isNonstandard: "Custom",
		target: "normal",
		type: "Rock",
	},
	// TacocaT_2595
	kaboom: {
		accuracy: 100,
		basePower: 250,
		category: "Physical",
		name: 'Kaboom!',
		gen: 8,
		pp: 5,
		priority: 0,
		desc: "The user faints after using this move, even if this move fails for having no target. This move is prevented from executing if any active Pokémon has the Damp Ability. Sets 1 layer of Spikes and Stealth Rocks on the opponent's side if the move succeeds.",
		shortDesc: "Explosion + Spikes + Stealth Rocks",
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Explosion', target);
			this.add('-anim', source, 'Stealth Rock', target);
			this.add('-anim', source, 'Spikes', target);
		},
		onHit() {
			this.add(`c|${getName('TacocaT_2595')}|Oh. Well at least I went out with a bang.`);
		},
		self: {
			onHit(source) {
				source.side.foe.addSideCondition('stealthrock');
				source.side.foe.addSideCondition('spikes');
			},
		},
		selfdestruct: "always",
		secondary: null,
		isNonstandard: "Custom",
		target: "normal",
		type: "Steel",
	},
	// ThinkingSceptile
	haread: {
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: 'Ha! Read!',
		gen: 8,
		pp: 20,
		priority: 0,
		desc: "Power doubles if the user hits an opponent switching in. If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities.",
		shortDesc: "Volt Switch + Stakeout",
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Volt Switch', target);
			this.add('-anim', source, 'Taunt', target);
		},
		basePowerCallback(pokemon, target, move) {
			if (!target.activeTurns) {
				this.debug('Ha! Read! boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		selfSwitch: true,
		secondary: null,
		isNonstandard: "Custom",
		target: "normal",
		type: "Electric",
	},
	// torwildheart
	psionicslice: {
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		gen: 8,
		pp: 10,
		priority: 0,
		name: "Psionic Slice",
		isNonstandard: "Custom",
		desc: "This move’s base power increases by +2 for each stage the user’s stats have been raised or lowered. Resets the user’s stats after use.",
		shortDesc: "+2 BP for each stage of stat change",
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Secret Sword', target);
		},
		basePowerCallback(pokemon, target, move) {
			let boosts = 0;
			let boost: BoostID;
			for (boost in pokemon.boosts) {
				boosts += Math.abs(pokemon.boosts[boost]);
			}
			return move.basePower + 2 * boosts;
		},
		self: {
			onHit(pokemon) {
				pokemon.clearBoosts();
				this.add('-clearboost', pokemon);
			},
		},
		target: "normal",
		type: "Psychic",
	},
	// touketsu_ningen
	haxdance: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user takes 1/4 of its maximum HP, rounded down, and puts it into a substitute to take its place in battle. The substitute is removed once enough damage is inflicted on it, or if the user switches out or faints. Baton Pass can be used to transfer the substitute to an ally, and the substitute will keep its remaining HP. Until the substitute is broken, it receives damage from all attacks made by other Pokemon and shields the user from status effects and stat stage changes caused by other Pokemon. Sound-based moves and Pokemon with the Infiltrator Ability ignore substitutes. The user still takes normal damage from weather and status effects while behind its substitute. If the substitute breaks during a multi-hit attack, the user will take damage from any remaining hits. If a substitute is created while the user is trapped by a binding move, the binding effect ends immediately. Fails if the user does not have enough HP remaining to create a substitute without fainting, or if it already has a substitute. Also raises the user's Attack and Speed by 1 stage. Nearly always goes first.",
		shortDesc: "+2 priority DD & Sub",
		name: "Hax Dance",
		gen: 8,
		pp: 15,
		priority: 2,
		flags: {snatch: 1, dance: 1, nonsky: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Substitute', source);
		},
		boosts: {
			atk: 1,
			spe: 1,
		},
		onTryHit(target) {
			if (target.volatiles['substitute']) {
				this.add('-fail', target, 'move: Hax Dance');
				return null;
			}
			if (target.hp <= target.maxhp / 4 || target.maxhp === 1) { // Shedinja clause
				this.add('-fail', target, 'move: Hax Dance', '[weak]');
				return null;
			}
		},
		onHit(target) {
			this.directDamage(target.maxhp / 4);
		},
		volatileStatus: 'substitute',
		secondary: null,
		isNonstandard: "Custom",
		target: "self",
		type: "Dragon",
		zMove: {effect: 'clearnegativeboost'},
		contestType: "Cool",
	},
	// VolticHalberd
	halburst: {
		accuracy: 100,
		basePower: 100,
		category: "Special",
		defensiveCategory: "Physical",
		name: "Halburst",
		pp: 5,
		isNonstandard: "Custom",
		desc: "Deals damage to the target based on its Defense instead of Special Defense.",
		shortDesc: "Uses def instead of spd",
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Thousand Arrows', target);
			this.add('-anim', target, 'Thousand Waves', target);
		},
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Beautiful", // just copied this from psyshock but contest type really doesn't matter so *shrug*
	},
	// Modified moves for ATcheron's Arctic Gales
	auroraveil: {
		inherit: true,
		onTry() {
			return (this.field.isWeather('hail') || this.field.isWeather('arcticgales'));
		},
	},
	blizzard: {
		inherit: true,
		onModifyMove(move) {
			if (this.field.isWeather('hail') || this.field.isWeather('arcticgales')) move.accuracy = true;
		},
	},
	dig: {
		inherit: true,
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail' || type === 'arcticgales') return false;
			},
			onInvulnerability(target, source, move) {
				if (['earthquake', 'magnitude'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
			},
		},
	},
	dive: {
		inherit: true,
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail' || type === 'arcticgales') return false;
			},
			onInvulnerability(target, source, move) {
				if (['surf', 'whirlpool'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'surf' || move.id === 'whirlpool') {
					return this.chainModify(2);
				}
			},
		},
	},
	moonlight: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'arcticgales':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	morningsun: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'arcticgales':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	solarbeam: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			if (['raindance', 'primordialsea', 'sandstorm', 'hail', 'arcticgales'].includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	solarblade: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			if (['raindance', 'primordialsea', 'sandstorm', 'hail', 'arcticgales'].includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	synthesis: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'arcticgales':
				factor = 0.25;
				break;
			}
			return !!this.heal(this.modify(pokemon.maxhp, factor));
		},
	},
	weatherball: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
			case 'arcticgales':
				move.type = 'Ice';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.basePower *= 2;
				break;
			case 'raindance':
			case 'primordialsea':
				move.basePower *= 2;
				break;
			case 'sandstorm':
				move.basePower *= 2;
				break;
			case 'hail':
			case 'arcticgales':
				move.basePower *= 2;
				break;
			}
		},
	},
	// Modified Curse to be mutually exclusive with broil's and Creeperman129Poke's Curse-like moves
	curse: {
		inherit: true,
		onTryHit(target, source, move) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = {boosts: {spe: -1, atk: 1, def: 1}};
			} else if (move.volatileStatus && (target.volatiles['curse'] || target.volatiles['pharaohscurse'] || target.volatiles['haunting'])) {
				return false;
			}
		},
	},
	// Modified Attract condition to affect pokemon regardless of gender when afflicted by MightySharkVGC's Cool Sword
	attract: {
		inherit: true,
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon, source, effect) {
				if (!source.hasAbility('coolsword') && !(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
					this.debug('incompatible gender');
					return false;
				}
				if (!this.runEvent('Attract', pokemon, source)) {
					this.debug('Attract event failed');
					return false;
				}

				if (effect.id === 'cutecharm') {
					this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', '[of] ' + source);
				} else if (effect.id === 'destinyknot') {
					this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] ' + source);
				} else {
					this.add('-start', pokemon, 'Attract');
				}
			},
			onUpdate(pokemon) {
				if (this.effectData.source && !this.effectData.source.isActive && pokemon.volatiles['attract']) {
					this.debug('Removing Attract volatile on ' + pokemon);
					pokemon.removeVolatile('attract');
				}
			},
			onBeforeMovePriority: 2,
			onBeforeMove(pokemon, target, move) {
				this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectData.source);
				if (this.randomChance(1, 2)) {
					this.add('cant', pokemon, 'Attract');
					return false;
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Attract', '[silent]');
			},
		},
	},
	// used for RibbonNymph's move
	ribbonterrain: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the terrain becomes Ribbon Terrain. During the effect, the power of Fairy type moves is multiplied by 1.3, the power of Dragon type moves is halved, and grounded Pokémon are protected from non-volatile status afflictions.",
		shortDesc: "5 turns. Fairy 1.3x dmg, Dragon 0.5x dmg. Blocks status afflictions.",
		name: "Ribbon Terrain",
		pp: 10,
		isNonstandard: "Custom",
		gen: 8,
		priority: 0,
		flags: {nonsky: 1},
		secondary: null,
		terrain: 'ribbonterrain',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (effect && ((effect as Move).status || effect.id === 'yawn')) {
					this.add('-activate', target, 'move: Ribbon Terrain');
				}
				return false;
			},
			onTryAddVolatile(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'confusion') {
					if (effect.effectType === 'Move' && !effect.secondaries) {
						this.add('-activate', target, 'move: Ribbon Terrain', '[silent]');
						this.add('-message', `${target.name} surrounds itself with protective ribbons!`);
					}
					return null;
				}
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('ribbon terrain weaken');
					return this.chainModify(0.5);
				}
				if (move.type === 'Fairy' && attacker.isGrounded()) {
					this.debug('ribbon terrain boost');
					return this.chainModify(1.3);
				}
			},
			onStart(battle, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Ribbon Terrain', '[from] ability: ' + effect, '[of] ' + source, '[silent]');
					this.add('-message', "  Ribbons swirl around the battlefield!");
				} else {
					this.add('-fieldstart', 'move: Ribbon Terrain', '[silent]');
					this.add('-message', "  Ribbons swirl around the battlefield!");
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd(side) {
				this.add('-fieldend', 'Ribbon Terrain', '[silent]');
				this.add('-message', "  The ribbons disappeared from the battlefield.");
			},
		},
		target: "all",
		type: "Fairy",
		zMove: {boost: {spd: 1}},
		contestType: "Beautiful",
	},
	// Support for RibbonNymph's Ribbon Surge
	camouflage: {
		inherit: true,
		onHit(target) {
			let newType = 'Normal';
			if (this.field.isTerrain('electricterrain')) {
				newType = 'Electric';
			} else if (this.field.isTerrain('grassyterrain')) {
				newType = 'Grass';
			} else if (this.field.isTerrain('mistyterrain') || this.field.isTerrain('ribbonterrain')) {
				newType = 'Fairy';
			} else if (this.field.isTerrain('psychicterrain')) {
				newType = 'Psychic';
			}

			if (target.getTypes().join() === newType || !target.setType(newType)) return false;
			this.add('-start', target, 'typechange', newType);
		},
	},
	mistyexplosion: {
		inherit: true,
		onBasePower(basePower, source) {
			if ((this.field.isTerrain('mistyterrain') || this.field.isTerrain('ribbonterrain')) && source.isGrounded()) {
				this.debug('misty terrain boost');
				return this.chainModify(1.5);
			}
		},
	},
	naturepower: {
		inherit: true,
		onTryHit(target, pokemon) {
			let move = 'triattack';
			if (this.field.isTerrain('electricterrain')) {
				move = 'thunderbolt';
			} else if (this.field.isTerrain('grassyterrain')) {
				move = 'energyball';
			} else if (this.field.isTerrain('mistyterrain') || this.field.isTerrain('ribbonterrain')) {
				move = 'moonblast';
			} else if (this.field.isTerrain('psychicterrain')) {
				move = 'psychic';
			}
			this.actions.useMove(move, pokemon, target);
			return null;
		},
	},
	secretpower: {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (this.field.isTerrain('')) return;
			move.secondaries = [];
			if (this.field.isTerrain('electricterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'par',
				});
			} else if (this.field.isTerrain('grassyterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'slp',
				});
			} else if (this.field.isTerrain('mistyterrain') || this.field.isTerrain('ribbonterrain')) {
				move.secondaries.push({
					chance: 30,
					boosts: {
						spa: -1,
					},
				});
			} else if (this.field.isTerrain('psychicterrain')) {
				move.secondaries.push({
					chance: 30,
					boosts: {
						spe: -1,
					},
				});
			}
		},
	},
	terrainpulse: {
		inherit: true,
		onModifyType(move, pokemon) {
			if (!pokemon.isGrounded()) return;
			switch (this.field.terrain) {
			case 'electricterrain':
				move.type = 'Electric';
				break;
			case 'grassyterrain':
				move.type = 'Grass';
				break;
			case 'mistyterrain':
			case 'ribbonterrain':
				move.type = 'Fairy';
				break;
			case 'psychicterrain':
				move.type = 'Psychic';
				break;
			}
		},
	},
	// Utility for torwildheart's ability
	doublesspreadreduction: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the terrain becomes Ribbon Terrain. During the effect, the power of Fairy type moves is multiplied by 1.3, the power of Dragon type moves is halved, and grounded Pokémon are protected from non-volatile status afflictions.",
		shortDesc: "5 turns. Fairy 1.3x dmg, Dragon 0.5x dmg. Blocks status afflictions.",
		name: "Doubles Spread Reduction",
		pp: 10,
		isNonstandard: "Custom",
		gen: 8,
		priority: 0,
		flags: {nonsky: 1},
		secondary: null,
		pseudoWeather: "doublesspreadreduction",
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', effect);
					return 7;
				}
				return 5;
			},
			onStart(target, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Doubles Spread Reduction', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Doubles Spread Reduction');
				}
			},
			onBasePowerPriority: 7,
			onBasePower(basePower, attacker, defender, move) {
				if (move.target === 'allAdjacent' || move.target === 'allAdjacentFoes') {
					this.debug('doubles spread reduction weaken');
					return this.chainModify(0.75);
				}
			},
			onResidualOrder: 25,
			onEnd() {
				this.add('-fieldend', 'move: Doubles Spread Reduction', '[of] ' + this.effectData.source);
			},
		},
		target: "all",
		type: "Psychic",
		zMove: {boost: {spa: 1}},
		contestType: "Clever",
	},
	// TestMon
	tacklex: {
		num: 33,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Tackle X",
		pp: 35,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
};
