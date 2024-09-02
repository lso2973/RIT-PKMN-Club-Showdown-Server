// Implement Magical Coat, Goblin Power, Forest's Wrath, Rabies, and Heir of Light
// import {stbSets} from "./random-teams";
import {getName} from "./scripts";
export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {

	// broil (Magical Coat)
	magicalcoat: {
		shortDesc: "Fur Coat + Harvest",
		desc: "This Pokémon's Defense is doubled and if the last item this Pokémon used is a Berry, there is a 50% chance it gets restored at the end of each turn. If Sunny Day is active, this chance is 100%.",
		name: "Magical Coat",
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(2);
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland']) || this.randomChance(1, 2)) {
				if (pokemon.hp && !pokemon.item && this.dex.items.get(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					pokemon.lastItem = '';
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				}
			}
		},
		gen: 9,
		// rating: 4,
	},

	// davidts (Goblin Power)
	goblinpower: {
		shortDesc: "Random Status + Prankster",
		desc: "Upon entry into battle, inflict a random non-volatile status on the opponent (poison, paralysis, or burn). Gives all status moves a priority of +1.",
		name: "Goblin Power",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				this.add('message', `The priority of ${pokemon.name}'s ${move.name} was increased by Goblin Power!`);
				return priority + 1;
			}
		},
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				let statusName = "Poison";
				if (!activated) {
					this.add('-ability', pokemon, 'Goblin Power');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					const r = this.random(3);
					switch (r) {
					case 0: {
						target.setStatus('brn', pokemon);
						statusName = "Burn";
						break;
					} case 1: {
						target.setStatus('par', pokemon);
						statusName = "Paralysis";
						break;
					} default: {
						target.setStatus('psn', pokemon);
						statusName = "Poison";
						break;
					}
					}
					this.add('message', `${pokemon.name}'s Goblin Power inflicted the enemy with ${statusName}!`);
				}
			}
		},
		gen: 9,
	},

	// gigigecko26 (Rabies)
	rabies: {
		shortDesc: "Poison Point x Perish Body",
		desc: "Making contact with this Pokémon starts the Rabies effect for the attacker. Rabies - The Pokémon will gain a Rabies Count of 4 if it doesn't already have a rabies count. At the end of each turn including the turn used, the Pokémon will take 1/16 max hp in damage, and the rabies of all active Pokémon lowers by 1 and Pokémon faint if the number reaches 0. The rabies count is 4 for all Pokémon that switch out.",
		name: "Rabies",
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				source.trySetStatus('rabies', target);
			}
		},
		gen: 9,
	},

	// Peekz1025 (Forest's Wrath)
	forestswrath: {
		shortDesc: "Focus Energy on entry, +1 Atk on crit",
		desc: "Increases user's critical hit ratio on entry and the user's attack is raised by +1 stage when the user successfully lands a critical hit.",
		name: "Forest's Wrath",
		onStart(pokemon) {
			pokemon.addVolatile('focusenergy');
			// explain the crit boost
			this.add('message', `${pokemon.name} inherited the wrath of the forest!`);
		},
		onAfterMoveSecondarySelf(target, source, move) {
			if (source.getMoveHitData(move).crit) {
				this.add(`c:|${getName('Peekz1025')}|IT'S A CRIT!`);
				this.boost({atk: 1});
				// explain the attack boost
				this.add('message', `${source.name}'s Attack rose by landing a Critical Hit!`);
			}
		},
		gen: 9,
	},


	// NEW STB SETS

	// 8biteki/ya-da-ne (Heir of Light)
	heiroflight: {
		shortDesc: "Psychic Surge + Drought + Chlorophyll",
		desc: "On switch-in, this Pokémon sets Psychic Terrain and Harsh Sunlight for 5 turns. Additionally, this Pokémon's Speed doubles in Harsh Sunlight.",
		name: "Heir of Light",
		onStart(pokemon) {
			if (this.field.setTerrain('psychicterrain')) {
				this.add('-activate', pokemon, 'Heir of Light', '[source]');
				this.add('message', `${pokemon.name} began to glow!`);
			}
			if (this.field.setWeather('sunnyday')) {
				// this.add('-activate', pokemon, "Heir of Light", '[source]');
				this.add('message', `Blinding light emitted from ${pokemon.name} surrounds the area!`);
			} else if (this.field.isWeather(['sunnyday', 'desolateland'])) {
				this.add('-activate', pokemon, 'ability: Heir of Light');
				this.add('message', `${pokemon.name} became faster-than-light!`);
			}
		},
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		gen: 9,
	},

	// Banded Bonks
	hustlesurge: {
		// Hustle Room implementation in `/stb/moves.ts`
		shortDesc: "Hustle Room on entry.",
		desc: "Summons Hustle Room on entry. (Hustle Room causes all moves, without exception, to have 80% of their regular accuracy. Moves that do not miss are considered to have 100% accuracy. All Accuracy state changes are ignored.",
		name: "Hustle Surge",
		onStart(source) {
			this.field.addPseudoWeather('hustleroom');
		},
		gen: 9,
	},
};
