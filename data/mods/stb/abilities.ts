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
	// ATcheron
	snowierwarning: {
		desc: "Summons Arctic Gales to the battlefield, lowering the speed of non Ice-types by 50% rounded up and damaging non Ice-types by 1/16th of their health rounded down at the end of each turn.",
		shortDesc: "Summons Arctic Gales. Non-Ice-type: 0.5x speed and 1/16 damage per turn",
		name: "Snowier Warning",
		onStart(source) {
			this.field.setWeather('arcticgales');
		},
		isNonstandard: "Custom",
	},
	// bad_wolf42
	friendshaped: {
		desc: "At the end of each turn, the opposing Pokémon's Atk and Sp.Atk are lowered by -1 stage.",
		shortDesc: "lower opponent's offenses by -1 stage",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon, target) {
			if (pokemon.activeTurns) {
				this.boost({atk: -1, spa: -1}, target);
			}
		},
		name: 'Friend Shaped',
		isNonstandard: "Custom",
		rating: 4,
	},
	// Banded Bonks
	rngtraining: {
		desc: "Raises this Pokémon's accuracy and evasion by +1 stage on entry and this Pokémon's moves have their secondary effect chance doubled.",
		shortDesc: "+1 accuracy and evasion on entry + serene grace",
		name: "RNG Training",
		onStart(pokemon) {
			this.boost({accuracy: 1, evasion: 1});
		},
		onModifyMovePriority: -2,
		onModifyMove(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
			if (move.self?.chance) move.self.chance *= 2;
		},
		isNonstandard: "Custom",
		Rating: 4,
	},
	// broil
	magicalcoat: {
		desc: "This Pokémon's Defense is doubled and if the last item this Pokémon used is a Berry, there is a 50% chance it gets restored at the end of each turn. If Sunny Day is active, this chance is 100%.",
		shortDesc: "Fur Coat + Harvest",
		name: "Magical Coat",
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(2);
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland']) || this.randomChance(1, 2)) {
				if (pokemon.hp && !pokemon.item && this.dex.getItem(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					pokemon.lastItem = '';
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				}
			}
		},
		isNonstandard: "Custom",
		Rating: 4,
	},
	// Creeperman129Poke
	spiritualabsorb: {
		desc: "This Pokémon is immune to Ghost-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Ghost-type move.",
		shortDesc: "x Absorb for Ghost",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ghost') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Spiritual Absorb');
				}
				return null;
			}
		},
		name: "Spiritual Absorb",
		rating: 3.6,
	},
	// crimsonKangaroo
	solarwind: {
		desc: "Reflects status moves and any stat-lowering effects this Pokémon receives.",
		shortDesc: "Mirror Armor + Magic Bounce",
		name: "Solar Wind",
		onBoost(boost, target, source, effect) {
			// Don't bounce self stat changes, or boosts that have already bounced
			if (target === source || !boost || effect.id === 'solarwind' || effect.id === 'mirrorarmor') return;
			let b: BoostName;
			for (b in boost) {
				if (boost[b]! < 0) {
					if (target.boosts[b] === -6) continue;
					const negativeBoost: SparseBoostsTable = {};
					negativeBoost[b] = boost[b];
					delete boost[b];
					this.add('-ability', target, 'Solar Wind');
					this.boost(negativeBoost, source, target, null, true);
				}
			}
		},
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.useMove(newMove, this.effectData.target, source);
			return null;
		},
		condition: {
			duration: 1,
		},
	},
	// MeepingtonThe3rd
	stormsurfing: {
		desc: "On switch-in, this Pokémon summons Electric Terrain, and Heavy Rain begins until this Ability is no longer active in battle. This Pokémon's speed is doubled while on Electric Terrain.",
		shortDesc: "primordial sea + electric surge + surge surfer",
		name: "Surge Surfing",
		onStart(source) {
			this.field.setWeather('primordialsea');
			this.field.setTerrain('electricterrain');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'primordialsea' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherData.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('primordialsea') || target.hasAbility('stormsurfing')) {
					this.field.weatherData.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		onModifySpe(spe) {
			if (this.field.isTerrain('electricterrain')) {
				return this.chainModify(2);
			}
		},
		isNonstandard: "Custom",
	},
	// MightySharkVGC
	beasterboost: {
		desc: "This Pokémon's Attack and Defense are raised by +1 stage and its speed is lowered by -1 stage if it attacks and knocks out another Pokémon.",
		shortDesc: "Moxie but curse rather than attack boost",
		name: "Beaster Boost",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({atk: length, def: length, spe: length*-1}, source);
			}
		},
		isNonstandard: "Custom",
		rating: 4,
	},
	// njjoltiks
	fromtheashes:{
		desc: "If this Pokémon were to faint, fully heal it and then remove this ability permanently.",
		shortDesc: "Fully heal once after fainting then lose ability",
		name: "From the Ashes",
		onDamagePriority: -100,
		onBeforeMove(source, target, move){
			if ((move['selfdestruct'] === "always" || move['selfdestruct'] === "onhit") && !this.effectData.ashes){
				this.add('-ability', source, 'From the Ashes');
				this.effectData.ashes = true;
				move['selfdestruct'] = null;
				source.heal(source.maxhp);
			}
		},
		onDamage(damage, source, target, effect){
			if (damage >= source.hp && effect && !this.effectData.ashes){
				this.add('-ability', source, 'From the Ashes');
				this.effectData.ashes = true;
				source.heal(source.maxhp);
				return 0;
			}
		},
		isNonstandard: "Custom",
		rating: 5,
	},
	// Peekz1025
	forestswrath:{
		desc: "Increases user’s critical hit ratio on entry and the user’s attack is raised by +1 stage when the user successfully lands a critical hit.",
		shortDesc: "Focus Energy on entry, +1 Atk on crit",
		name: "Forest's Wrath",
		onStart(pokemon){
			pokemon.addVolatile('focusenergy');
		},
		onAfterMoveSecondarySelf(target, source, move){
			if(source.getMoveHitData(move).crit){
				this.boost({atk: 1});
			}
		},
		isNonstandard: "Custom",
		rating: 4.5
	},
	// Planetaeus
	burningspirit: {
		desc: "100% chance a Pokémon making contact with this Pokémon will be burned.",
		shortDesc: "100% Flame Body",
		name: "Burning Spirit",
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				source.trySetStatus('brn', target);
			}
		},
		isNonstandard: "Custom",
		rating: 3
	},
	// PseudoPhysics
	gonnagetcha: {
		desc: "Prevents adjacent opposing Pokémon from choosing to switch out unless they are immune to trapping or also have this Ability or Shadow Tag. Also uses Magic Coat on entry.",
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
	// RubyDragonQueen
	dragonscale: {
		desc: "Reduces the amount of damage this Pokémon takes when its HP is full. Doubles defense when this Pokémon has a status condition.",
		shortDesc: "Marvel Scale + Multiscale",
		name: "Dragon Scale",
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify(0.5);
			}
		},
		isNonstandard: "Custom",
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
	// Steeevo34 
	awizardssecret: {
		desc: "When this Pokémon enters Trick Room or Trick Room starts with it on the field, it swaps its attack and defense stats until it is switched out.",
		shortDesc: "Power Trick upon hitting TR",
		name: "A Wizard's Secret",
		// Yes all 4 are necessary, look into making this less cursed
		onStart (pokemon) {
			if (this.field.pseudoWeather.trickroom){
				pokemon.addVolatile('powertrick');
			}
		},
		onAfterMoveSecondarySelf(source, target, move){
			if (this.field.pseudoWeather.trickroom && !source.volatiles.powertrick){
				source.addVolatile('powertrick');
			}
		},
		onBeforeMove(source, target, move){
			if (this.field.pseudoWeather.trickroom && !source.volatiles.powertrick){
				source.addVolatile('powertrick');
			}
		},
		onResidual(source) {
			if (this.field.pseudoWeather.trickroom && !source.volatiles.powertrick){
				source.addVolatile('powertrick');
			}
		},
		isNonstandard: "Custom",
		rating: 3,
	},
	// TacocaT_2595
	stainlesssteel: {
		desc: "This Pokémon takes 2/3rds damage from supereffective attacks, and raises its defense and special defense when it gets hit by a supereffective move",
		shortDesc: "When hit by supereffective move: dmg x2/3 and +1 to def and spd",
		name: "Stainless Steel",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Stainless Steel neutralize');
				return this.chainModify(0.67);
			}
		},
		onHit(target, source, move) {
			if (move?.effectType === 'Move' && target.getMoveHitData(move).typeMod > 0) {
				this.boost({def: 1, spd: 1});
			}
		},
		isNonstandard: "Custom",
	},
	// torwildheart
	toolong: {
		desc: "At the start of each turn, this Pokémon raises its attack, defense, special attack, special defense and speed by +1 stage if the turn count is greater than 25.",
		shortDesc: "+1 to basic stats if turn > 25",
		name: "Too Long",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.activeTurns && this.turn > 25) {
				this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1});
			}
		},
		isNonstandard: "Custom",
		rating: 5
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
		desc: "Prevents adjacent opposing Pokémon from choosing to switch out unless they are immune to trapping or also have this Ability or gonna getcha.",
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
	// Support for ATcheron's arctic gales
	forecast: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.species.id !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'arcticgales':
			case 'hail':
				if (pokemon.species.id !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.species.id !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme, this.effect, false, '[msg]');
			}
		},
	},
	icebody: {
		inherit: true,
		onWeather(target, source, effect) {
			if (effect.id === 'hail' || effect.id === 'arcticgales') {
				this.heal(target.baseMaxhp / 16);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail' || type === 'arcticgales') return false;
		},
	},
	iceface: {
		inherit: true,
		onStart(pokemon) {
			if ((this.field.isWeather('hail') || this.field.isWeather('arcticgales')) && pokemon.species.id === 'eiscuenoice' && !pokemon.transformed) {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectData.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		onAnyWeatherStart() {
			const pokemon = this.effectData.target;
			if (!pokemon.hp) return;
			if ((this.field.isWeather('hail') || this.field.isWeather('arcticgales')) && pokemon.species.id === 'eiscuenoice' && !pokemon.transformed) {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectData.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
	},
	overcoat: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'powder' || type === 'arcticgales') return false;
		},
	},
	slushrush: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('hail') || this.field.isWeather('arcticgales')) {
				return this.chainModify(2);
			}
		},
	},
	// Modified Mirror Armor for crimsonKangaroo's Solar Wind
	mirrorarmor: {
		inherit: true,
		onBoost(boost, target, source, effect) {
			// Don't bounce self stat changes, or boosts that have already bounced
			if (target === source || !boost || effect.id === 'solarwind' || effect.id === 'mirrorarmor') return;
			let b: BoostName;
			for (b in boost) {
				if (boost[b]! < 0) {
					if (target.boosts[b] === -6) continue;
					const negativeBoost: SparseBoostsTable = {};
					negativeBoost[b] = boost[b];
					delete boost[b];
					this.add('-ability', target, 'Mirror Armor');
					this.boost(negativeBoost, source, target, null, true);
				}
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
	// Modified Illusion to support SSB volatiles
	illusion: {
		inherit: true,
		onEnd(pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion cleared');
				let disguisedAs = this.toID(pokemon.illusion.name);
				pokemon.illusion = null;
				const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
					(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
				// Handle scenarios where the name of a user is the same as a mon
				if (this.dex.getSpecies(disguisedAs).exists) disguisedAs += 'user';
				if (pokemon.volatiles[disguisedAs]) {
					pokemon.removeVolatile(disguisedAs);
				}
				if (!pokemon.volatiles[this.toID(pokemon.name) + 'break'] && !pokemon.volatiles[this.toID(pokemon.name)]) { 
					const status = this.dex.getEffect(this.toID(pokemon.name) + 'break'); // first try adding the status with break
					if (status?.exists) {
						pokemon.addVolatile(this.toID(pokemon.name) + 'break', pokemon);
					} else { // Then just add the basic status
						const status = this.dex.getEffect(this.toID(pokemon.name));
						if (status?.exists) {
							pokemon.addVolatile(this.toID(pokemon.name), pokemon);
						}
					}
				}
			}
		},
	},
};
