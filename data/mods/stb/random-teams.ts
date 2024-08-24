import RandomTeams from '../../random-battles/gen9/teams';

export interface STBSet {
	species: string;
	ability: string | string[];
	item: string | string[];
	gender: GenderName | GenderName[];
	moves: (string | string[])[];
	signatureMove: string;
	evs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	ivs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	nature?: string | string[];
	shiny?: number | boolean;
	level?: number;
	happiness?: number;
	skip?: string;
	teraType?: string | string[];
}

interface STBSets {[k: string]: STBSet}

export const stbSets: STBSets = {
	/*
	// Example:
	Username: {
		species: 'Species', ability: 'Ability', item: 'Item', gender: '',
		moves: ['Move Name', ['Move Name', 'Move Name']],
		signatureMove: 'MoveName',
		evs: {stat: number}, ivs: {stat: number}, nature: 'Nature',
	},
	// Species, ability, and item need to be capitalized properly ex: Ludicolo, Swift Swim, Life Orb
	// Gender can be M, F, N, or left as an empty string
	// each slot in moves needs to be a string (the move name, capitalized properly ex: Hydro Pump), or an array of strings (also move names)
	// signatureMove also needs to be capitalized properly ex: Pharaoh's Curse
	// You can skip EVs (defaults to 84 all) and/or IVs (defaults to 31 all), or just skip part of the EVs (skipped EVs are 0) and/or IVs (skipped IVs are 31)
	// Nature needs to be a valid nature with the first letter capitalized ex: Quirky
	*/

	// Please keep sets organized alphabetically based on username!

	// OLD STB SETS
	broil: {
		species: 'Furfrou-Pharaoh', ability: 'Magical Coat', item: 'Chesto Berry', gender: 'M',
		moves: ['Cotton Guard', 'Rest', 'Body Press'],
		signatureMove: "Pharaoh's Curse",
		evs: {hp: 252, def: 252, spd: 4}, nature: "Impish",
	},

	davidts: {
		species: 'Sableye', ability: 'Prankster', item: 'Sablenite', gender: 'M',
		moves: ['Taunt', 'Cosmic Power', 'Foul Play'],
		signatureMove: "Ruby's Curse",
		evs: {hp: 4, def: 252, spd: 252}, ivs: {atk: 0}, nature: 'Impish', shiny: true,
	},

	gigigecko26: {
		species: 'Zigzagoon', ability: 'Rabies', item: 'Eviolite', gender: 'M',
		moves: ['Zing Zap', 'Earthquake', 'Psyshock'],
		signatureMove: 'Internet Troll',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Jolly',
	},

	Peekz1025: {
		species: 'Sceptile', ability: "Forest's Wrath", item: 'Sceptilite', gender: 'M',
		moves: ['Dragon Claw', 'Night Slash', 'Earthquake'],
		signatureMove: 'Verdant Blade',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},

	// NEW STB SETS

	// 8biteki/ya-da-ne
	'ya-da-ne': {
		species: 'Tapu Lele', ability: "Heir of Light", item: 'Choice Specs', gender: 'F',
		moves: [['Ice Beam', 'Freeze Dry'], 'Heat Wave', 'Volt Switch'],
		signatureMove: 'Tackle',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest', shiny: true,
	},
	// Only used for /stb
	'8biteki': {
		species: 'Necrozma-Dawn-Wings', ability: "Heir of Light", item: "Leftovers", gender: 'F',
		moves: [['Ice Beam', 'Freeze Dry'], 'Take Heart', 'Recover'],
		signatureMove: 'Tackle',
		evs: {hp: 252, def: 252, spa: 4}, nature: 'Bold', shiny: true, skip: 'ya-da-ne',
	}

};

export class RandomTigerBrosTeams extends RandomTeams {
	randomTigerBrosTeam(options: {inBattle?: boolean} = {}) {
		this.enforceNoDirectCustomBanlistChanges();

		const team: PokemonSet[] = [];
		// V Set this to a list of SSB sets to override the normal pool for debugging.
		const debug: string[] = ["ya-da-ne", "Peekz1025", "gigigecko26", "davidts", "broil"];
		// const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pool = debug.length ? debug : Object.keys(stbSets);
		const typePool: {[k: string]: number} = {};
		let depth = 0;
		while (pool.length && team.length < this.maxTeamSize) {
			if (depth >= 200) throw new Error(`Infinite loop in Super Tiger BRos team generation.`);
			depth++;
			const name = this.sampleNoReplace(pool);
			const stbSet: STBSet = this.dex.deepClone(stbSets[name]);
			if (stbSet.skip) continue;

			// Enforce typing limits
			if (!debug.length) { // Type limits are ignored when debugging
				const species = this.dex.species.get(stbSet.species);
				const weaknesses = [];
				for (const type of this.dex.types.names()) {
					const typeMod = this.dex.getEffectiveness(type, species.types);
					if (typeMod > 0) weaknesses.push(type);
				}
				let rejected = false;
				for (const type of weaknesses) {
					if (typePool[type] === undefined) typePool[type] = 0;
					if (typePool[type] >= 3) {
						// Reject
						rejected = true;
						break;
					}
				}
				if (stbSet.ability === 'Wonder Guard') {
					if (!typePool['wonderguard']) {
						typePool['wonderguard'] = 1;
					} else {
						rejected = true;
					}
				}
				if (rejected) continue;
				// Update type counts
				for (const type of weaknesses) {
					typePool[type]++;
				}
			}

			// Terastallization is not legal but
			// include this anyways just in case
			let teraType: string | undefined;
			if (stbSet.teraType) {
				teraType = stbSet.teraType === 'Any' ?
					this.sample(this.dex.types.names()) :
					this.sampleIfArray(stbSet.teraType);
			}


			const moves: string[] = [];
			while (moves.length < 3 && stbSet.moves.length > 0) {
				let move = this.sampleNoReplace(stbSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				moves.push(this.dex.moves.get(move).name);
			}
			moves.push(this.dex.moves.get(stbSet.signatureMove).name);

			const set: PokemonSet = {
				name,
				species: stbSet.species,
				item: this.sampleIfArray(stbSet.item),
				ability: this.sampleIfArray(stbSet.ability),
				moves,
				nature: stbSet.nature ? Array.isArray(stbSet.nature) ? this.sampleNoReplace(stbSet.nature) : stbSet.nature : 'Serious',
				gender: stbSet.gender ? this.sampleIfArray(stbSet.gender) : this.sample(['M', 'F', 'N']),
				evs: stbSet.evs ? {...{hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, ...stbSet.evs} :
				{hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84},
				ivs: {...{hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, ...stbSet.ivs},
				level: this.adjustLevel || stbSet.level || 100,
				happiness: typeof stbSet.happiness === 'number' ? stbSet.happiness : 255,
				shiny: typeof stbSet.shiny === 'number' ? this.randomChance(1, stbSet.shiny) : !!stbSet.shiny,
			};

			// Any set specific tweaks occur here.
			if (set.name === "ya-da-ne" && this.random(2) === 1) {
				// 50/50 to be ya-da-ne or 8biteki
				// ya-da-ne is a Choice Specs Tapu Lele,
				// whereas 8biteki is a Setup Sweeper
				// Necrozma-Dawn-Wings. Both are Ice/Psychic.
				set.species = "Necrozma-Dawn-Wings";
				set.name = "8biteki";
				// Maintain 50% chance to run either
				// Ice Beam or Freeze Dry
				if (this.random(4) % 2 === 0) {
					set.moves[0] = "Ice Beam";
				} else {
					set.moves[0] = "Freeze Dry";
				}
				set.moves[1] = "Take Heart";
				set.moves[2] = "Recover";
				set.nature = "Bold";
				set.evs = {hp: 252, atk: 0, def: 252, spa: 4, spd: 0, spe: 0};
				set.item = "Leftovers";
			}

			// This should never come up due to
			// Terastal clause but include it in
			// the event that admins want Tera to
			// be added into STB.
			if (teraType) set.teraType = teraType;

			team.push(set);

			// Team specific tweaks occur here
			// Swap last and second to last sets if last set has Illusion
			if (team.length === 6 && set.ability === 'Illusion') {
				team[5] = team[4];
				team[4] = set;
			}
		}
		return team;
	}
}

export default RandomTigerBrosTeams;
