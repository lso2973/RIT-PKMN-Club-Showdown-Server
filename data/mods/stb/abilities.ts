import {SSBSet, ssbSets} from "./random-teams";
import {getName} from './conditions';

// Used in many abilities, placed here to reduce the number of updates needed and to reduce the chance of errors
const STRONG_WEATHERS = ['desolateland', 'primordialsea', 'deltastream'];

/**
 * Assigns a new set to a Pokémon
 * @param pokemon the Pokemon to assign the set to
 * @param newSet the SSBSet to assign
 */
export function changeSet(context: Battle, pokemon: Pokemon, newSet: SSBSet, changeAbility = false) {
	const evs: StatsTable = {
		hp: newSet.evs?.hp || 0,
		atk: newSet.evs?.atk || 0,
		def: newSet.evs?.def || 0,
		spa: newSet.evs?.spa || 0,
		spd: newSet.evs?.spd || 0,
		spe: newSet.evs?.spe || 0,
	};
	const ivs: StatsTable = {
		hp: newSet.ivs?.hp || 31,
		atk: newSet.ivs?.atk || 31,
		def: newSet.ivs?.def || 31,
		spa: newSet.ivs?.spa || 31,
		spd: newSet.ivs?.spd || 31,
		spe: newSet.ivs?.spe || 31,
	};
	pokemon.set.evs = evs;
	pokemon.set.ivs = ivs;
	if (newSet.nature) pokemon.set.nature = Array.isArray(newSet.nature) ? context.sample(newSet.nature) : newSet.nature;
	const oldShiny = pokemon.set.shiny;
	pokemon.set.shiny = (typeof newSet.shiny === 'number') ? context.randomChance(1, newSet.shiny) : !!newSet.shiny;
	let percent = (pokemon.hp / pokemon.baseMaxhp);
	if (newSet.species === 'Shedinja') percent = 1;
	pokemon.formeChange(newSet.species, context.effect, true);
	const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
		(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
	if (oldShiny !== pokemon.set.shiny) context.add('replace', pokemon, details);
	if (changeAbility) pokemon.setAbility(newSet.ability as string);

	pokemon.baseMaxhp = pokemon.species.name === 'Shedinja' ? 1 : Math.floor(Math.floor(
		2 * pokemon.species.baseStats.hp + pokemon.set.ivs.hp + Math.floor(pokemon.set.evs.hp / 4) + 100
	) * pokemon.level / 100 + 10);
	const newMaxHP = pokemon.baseMaxhp;
	pokemon.hp = Math.round(newMaxHP * percent);
	pokemon.maxhp = newMaxHP;
	context.add('-heal', pokemon, pokemon.getHealth, '[silent]');
	let item = newSet.item;
	if (typeof item !== 'string') item = item[context.random(item.length)];
	if (context.toID(item) !== (pokemon.item || pokemon.lastItem)) pokemon.setItem(item);
	const newMoves = changeMoves(context, pokemon, newSet.moves.concat(newSet.signatureMove));
	pokemon.moveSlots = newMoves;
	// @ts-ignore Necessary so pokemon doesn't get 8 moves
	pokemon.baseMoveSlots = newMoves;
	context.add('-ability', pokemon, `${pokemon.getAbility().name}`);
	context.add('message', `${pokemon.name} changed form!`);
}

/**
 * Assigns new moves to a Pokemon
 * @param pokemon The Pokemon whose moveset is to be modified
 * @param newSet The set whose moves should be assigned
 */
export function changeMoves(context: Battle, pokemon: Pokemon, newMoves: (string | string[])[]) {
	const carryOver = pokemon.moveSlots.slice().map(m => m.pp / m.maxpp);
	// In case there are ever less than 4 moves
	while (carryOver.length < 4) {
		carryOver.push(1);
	}
	const result = [];
	let slot = 0;
	for (const newMove of newMoves) {
		const moveName = Array.isArray(newMove) ? newMove[context.random(newMove.length)] : newMove;
		const move = context.dex.getMove(context.toID(moveName));
		if (!move.id) continue;
		const moveSlot = {
			move: move.name,
			id: move.id,
			// eslint-disable-next-line max-len
			pp: ((move.noPPBoosts || move.isZ) ? Math.floor(move.pp * carryOver[slot]) : Math.floor((move.pp * (8 / 5)) * carryOver[slot])),
			maxpp: ((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5),
			target: move.target,
			disabled: false,
			disabledSource: '',
			used: false,
		};
		result.push(moveSlot);
		slot++;
	}
	return result;
}

export const Abilities: {[k: string]: ModdedAbilityData} = {
	/*
	// Example
	"abilityid": {
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Ability Name",
		// The bulk of an ability is not easily shown in an example since it varies
		// For more examples, see https://github.com/smogon/pokemon-showdown/blob/master/data/abilities.js
	},
	*/
	// Please keep abilites organized alphabetically based on staff member name!
	// Peekz1025
	forestswrath:{
		desc: "Increases user’s critical hit ratio on entry and the user’s attack is raised by +1 stage when the user successfully lands a critical hit.",
		shortDesc: "Focus Energy on entry, +1 Atk on crit",
		name: "Forest's Wrath",
		onStart(pokemon){
			pokemon.addVolatile('focusenergy');
		},
		onAfterMoveSecondary(target, source, move){
			if(target.getMoveHitData(move).crit){
				this.boost({atk: 1});
			}
		},
		isNonstandard: "Custom",
		rating: 4.5
	},
	// PseudoPhysics
	gonnagetcha: {
		desc: "Prevents adjacent opposing Pokemon from choosing to switch out unless they are immune to trapping or also have this Ability or Shadow Tag. Also uses Magic Coat on entry.",
		shortDesc: "Shadow Tag + Magic Coat on entry",
		onFoeTrapPokemon(pokemon) {
			if (!(pokemon.hasAbility('shadowtag') || pokemon.hasAbility('gonnagetcha')) && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!source || !this.isAdjacent(pokemon, source)) return;
			if (!(pokemon.hasAbility('shadowtag') || pokemon.hasAbility('gonnagetcha'))) {
				pokemon.maybeTrapped = true;
			}
		},
		onStart(pokemon) {
			this.useMove("Magic Coat", pokemon);
		},
		name: "gonna getcha",
		isNonstandard: "Custom",
		rating: 5,
	},
	// RibbonNymph
	pixilatex: {
		desc: "When this Pokémon uses an attack that would be either 'not very effective' or does not affect the target due to typing, the attack will become fairy type and the power of the move will be boosted by 1.2x",
		shortDesc: "User's not-very-effective and no-effect moves become fairy type; 1.2x power",
		name: "Pixilate X",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon, target) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (target.runEffectiveness(move) < 0 && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Fairy';
				move.pixilateBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.pixilateBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		isNonstandard: "Custom",
		rating: 4,
	},
	// ScarTheColossus
	pancake: {
		desc: "When this Pokémon has 1/2 or less of its maximum HP, it uses certain Berries early. Additionally, when this Pokémon eats a berry, restore ⅓ of its max HP (rounded down) in addition to the berry’s effects.",
		shortDesc: "Gluttony + Cheek Pouch",
		name: "Pancake",
		onEatItem(item, pokemon) { // Gluttony is implemented in items
			this.heal(pokemon.baseMaxhp / 3);
		},
		isNonstandard: "Custom",
		rating: 4,
	},
	// torwildheart
	superiorformatsurge: {
		desc: "On switch-in, this Pokémon sets a 5-turn field effect that reduces the power of spread moves by 25%, like doubles",
		shortDesc: "Causes doubles spread reduction for 5 turns.",
		onStart(pokemon, source){
			this.field.addPseudoWeather('doublesspreadreduction'); //implemented in moves.ts
		},
		name: "Superior Format Surge",
		isNonstandard: "Custom",
		rating: 3,
	},
	// VolticHalberd
	outsideisfrightful: {
		desc: "On switch-in, this Pokémon randomly summons one of Rain, Sun, Sand, or Hail, and its secondary typing changes to Water, Fire, Rock, or Ice, respectively.",
		shortDesc: "Sets random weather on entry, changes type to match",
		name: "Outside is Frightful",
		onStart(pokemon, source) {
			const r = this.random(4);
			switch (r) {
			case 0:
				this.field.setWeather('raindance');
				break;
			case 1:
				this.field.setWeather('sunnyday');
				break;
			case 2:
				this.field.setWeather('sandstorm');
				break;
			case 3:
				this.field.setWeather('hail');
				break;
			}
			// Yes I know this next part works weird if the ability is not on a dual-type Electric type
			let newType = "Normal";
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				newType = "Fire";
				break;
			case 'raindance':
			case 'primordialsea':
				newType = "Water";
				break;
			case 'sandstorm':
				newType = "Rock";
				break;
			case 'hail':
				newType = "Ice";
				break;
			}
			pokemon.setType(pokemon.getTypes(true).map(type => type === "Electric" ? type : newType));
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[from] ability: Outside is Frightful');
		},
		isNonstandard: "Custom",
		rating: 4,
	},
	// Modified Shadow Tag for gonna getcha
	shadowtag: {
		inherit: true,
		desc: "Prevents adjacent opposing Pokemon from choosing to switch out unless they are immune to trapping or also have this Ability or gonna getcha.",
		onFoeTrapPokemon(pokemon) {
			if (!(pokemon.hasAbility('shadowtag') || pokemon.hasAbility('gonnagetcha')) && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!source || !this.isAdjacent(pokemon, source)) return;
			if (!(pokemon.hasAbility('shadowtag') || pokemon.hasAbility('gonnagetcha'))) {
				pokemon.maybeTrapped = true;
			}
		},
	},
	// Support for RibbonNymph's ribbonterrain
	mimicry: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				let newType;
				switch (this.field.terrain) {
				case 'electricterrain':
					newType = 'Electric';
					break;
				case 'grassyterrain':
					newType = 'Grass';
					break;
				case 'mistyterrain':
				case 'ribbonterrain':
					newType = 'Fairy';
					break;
				case 'psychicterrain':
					newType = 'Psychic';
					break;
				}
				if (!newType || pokemon.getTypes().join() === newType || !pokemon.setType(newType)) return;
				this.add('-start', pokemon, 'typechange', newType, '[from] ability: Mimicry');
			},
			onUpdate(pokemon) {
				if (!this.field.terrain) {
					const types = pokemon.species.types;
					if (pokemon.getTypes().join() === types.join() || !pokemon.setType(types)) return;
					this.add('-activate', pokemon, 'ability: Mimicry');
					this.add('-end', pokemon, 'typechange', '[silent]');
					pokemon.removeVolatile('mimicry');
				}
			},
		},
	},
};
