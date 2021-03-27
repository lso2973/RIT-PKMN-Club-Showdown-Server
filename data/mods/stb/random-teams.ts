import RandomTeams from '../../random-teams';

export interface STBSet {
	species: string;
	ability: string | string[];
	item: string | string[];
	gender: GenderName;
	moves: (string | string[])[];
	signatureMove: string;
	evs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	ivs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	nature?: string | string[];
	shiny?: number | boolean;
	level?: number;
	happiness?: number;
	skip?: string;
}
interface STBSets {[k: string]: STBSet}

export const stbSets: STBSets = {
	/*
	// Example:
	Username: {
		species: 'Species', ability: 'Ability', item: 'Item', gender: '',
		moves: ['Move Name', ['Move Name', 'Move Name']],
		signatureMove: 'Move Name',
		evs: {stat: number}, ivs: {stat: number}, nature: 'Nature', level: 100, shiny: false,
	},
	// Species, ability, and item need to be captialized properly ex: Ludicolo, Swift Swim, Life Orb
	// Gender can be M, F, N, or left as an empty string
	// each slot in moves needs to be a string (the move name, captialized properly ex: Hydro Pump), or an array of strings (also move names)
	// signatureMove also needs to be capitalized properly ex: Scripting
	// You can skip Evs (defaults to 82 all) and/or Ivs (defaults to 31 all), or just skip part of the Evs (skipped evs are 0) and/or Ivs (skipped Ivs are 31)
	// You can also skip shiny, defaults to false. Level can be skipped (defaults to 100).
	// Nature needs to be a valid nature with the first letter capitalized ex: Modest
	*/
	// Please keep sets organized alphabetically based on staff member name!
	ATcheron: {
		species: 'Glaceon', ability: 'Snowier Warning', item: 'Choice Specs', gender: 'F',
		moves: ['Steam Eruption', 'Searing Shot', 'Earth Power'],
		signatureMove: 'Buff Ice',
		evs: {hp: 80, spa: 252, spe: 176}, nature: 'Timid', shiny: true,
	},
	AWood: {
		species: 'glaliemega', ability: 'Refrigerate', item: 'Salac Berry', gender: 'M',
		moves: ['Avalanche', 'Endure', 'Body Slam'],
		signatureMove: 'Headshot',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	'bad_wolf42': {
		species: 'Phanpy', ability: "Friend Shaped", item: 'Eviolite', gender: 'M',
		moves: ['Protect', 'Stealth Rock', 'Slack Off'],
		signatureMove: 'Roll Around',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful',
	},
	'Banded Bonks': {
		species: 'Durant', ability: 'RNG Training', item: 'Choice Band', gender: 'M',
		moves: ['First Impression', 'Superpower', ['Stomping Tantrum', 'Rock Slide', 'Thunder Fang', 'Crunch', 'Aerial Ace']],
		signatureMove: 'bonk.',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	broil: {
		species: 'Furfrou-Pharaoh', ability: 'Magical Coat', item: 'Chesto Berry', gender: 'M',
		moves: ['Cotton Guard', 'Rest', 'Body Press'],
		signatureMove: "Pharaoh's Curse",
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Impish',
	},
	Creeperman129Poke: {
		species: 'Chandelure', ability: 'Spiritual Absorb', item: 'Life Orb', gender: 'M',
		moves: ['Fusion Flare', 'Energy Ball', 'Shadow Ball'],
		signatureMove: 'Haunting',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	crimsonKangaroo: {
		species: 'Solgaleo', ability: 'Solar Wind', item: 'Weakness Policy', gender: '',
		moves: ['Cosmic Power', 'Psychic Fangs', 'Body Press'],
		signatureMove: 'Star Eater',
		evs: {hp: 252, atk: 4, spe: 252}, nature: 'Jolly',
	},
	gigigecko26: {
		species: 'Zigzagoon', ability: 'Rabies', item: 'Eviolite', gender: 'M',
		moves: ['Zippy Zap', 'Earthquake', 'Psyshock'],
		signatureMove: 'Internet Troll',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	Ignoritus: {
		species: 'Froslass', ability: 'Illusion', item: 'Focus Sash', gender: 'M',
		moves: ['Shadow Ball', 'Ice Beam', 'Sheer Cold'],
		signatureMove: 'Spectral Terrain',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	MeepingtonThe3rd: {
		species: 'Raichu-Alola', ability: 'Storm Surfing', item: 'Life Orb', gender: 'M',
		moves: ['Nasty Plot', 'Thunder', 'Splishy Splash'],
		signatureMove: 'Mental Brick',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest',
	},
	MightySharkVGC: {
		species: 'Stakataka', ability: 'Beaster Boost', item: 'Focus Sash', gender: '',
		moves: ['Gyro Ball', 'Rock Blast', 'Earthquake'],
		signatureMove: 'Better Trick Room',
		evs: {hp: 252, atk: 252, spd: 4}, ivs: {def: 14, spe: 0}, nature: 'Lonely',
	},
	njjoltiks: {
		species: 'Ho-Oh', ability: 'From the Ashes', item: 'Choice Band', gender: '',
		moves: ['Sacred Fire', 'Brave Bird', 'Leech Life'],
		signatureMove: 'Burn Out',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly', shiny: true,
	},
	Peekz1025: {
		species: 'Sceptile', ability: "Forest's Wrath", item: 'Sceptilite', gender: 'M',
		moves: ['Dragon Claw', 'Night Slash', 'Earthquake'],
		signatureMove: 'Verdant Blade',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	Planetaeus: {
		species: 'Delphox', ability: 'Burning Spirit', item: 'Iron Ball', gender: 'M',
		moves: ['Flame Charge', 'Grass Knot', 'Fire Blast'],
		signatureMove: 'Prestigitation',
		evs: {atk: 4, spa: 252, spe: 252}, nature: 'Hasty',
	},
	PseudoPhysics: {
		species: 'Wobbuffet', ability: 'gonna getcha', item: 'Focus Sash', gender: 'M',
		moves: ['Encore', 'Mirror Coat', 'Counter'],
		signatureMove: '{the rest}',
		evs: {hp: 252, def: 252, spd: 4}, nature: 'Sassy',
	},
	QuantumTangler: {
		species: 'Gardevoir', ability: 'Meta Buster', item: ['Expert Belt', 'Shell Bell'], gender: 'M',
		moves: ['Psychic', 'Moonblast', 'Healing Wish'],
		signatureMove: 'Stale Meta',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid', shiny: true,
	},
	RibbonNymph: {
		species: 'Sylveon', ability: 'Pixilate X', item: 'Choice Specs', gender: 'F',
		moves: ['Boomburst', 'Flamethrower', 'Wish'],
		signatureMove: 'Ribbon Surge',
		evs: {hp: 252, spa: 252, spd: 4}, ivs: {atk: 0}, nature: 'Modest',
	},
	RubyDragonQueen: {
		species: 'Dragonite', ability: 'Dragonscale', item: 'Dragon Fang', gender: 'F',
		moves: ['Roost', 'Curse', 'Extreme Speed'],
		signatureMove: 'Dragonforce',
		evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adamant',
	},
	Steeevo34: {
		species: 'Shuckle', ability: "A Wizard's Secret", item: 'Lum Berry', gender: 'M',
		moves: ['Trick Room', 'Earthquake', 'Swords Dance'],
		signatureMove: 'Retroincabulate',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {spe: 0}, nature: 'Relaxed',
	},
	ScarTheColossus: {
		species: 'Snorlax', ability: 'Pancake', item: 'Figy Berry', gender: 'M',
		moves: ['Facade', 'Earthquake', 'Crunch'],
		signatureMove: 'Balance',
		evs: {hp: 188, atk: 124, def: 148, spd: 44, spe: 4}, ivs: {spe: 2}, nature: 'Brave',
	},
	'TacocaT_2595': {
		species: 'Bronzong', ability: 'Stainless Steel', item: 'Leftovers', gender: 'F',
		moves: ['Recover', 'Bulk Up', ['Heavy Slam', 'Gyro Ball']],
		signatureMove: 'Kaboom!',
		evs: {hp: 244, atk: 252, def: 12}, ivs: {spe: 0}, nature: 'Brave', shiny: true,
	},
	torwildheart: {
		species: 'mewtwomegax', ability: 'Too Long', item: 'Expert Belt', gender: '',
		moves: [['Thunderous Kick', 'High Jump Kick'], ['Ice Punch', 'Thunder Punch'], ['Trop Kick', 'Blaze Kick']],
		signatureMove: 'Psionic Slice',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant',
	},
	'touketsu_ningen': {
		species: "Haxorus", ability: 'Fey Breaker', item: 'Life Orb', gender: 'M',
		moves: ['Outrage', 'Earthquake', 'Sunsteel Strike'],
		signatureMove: 'Hax Dance',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant',
	},
	VolticHalberd: {
		species: 'Heliolisk', ability: 'Outside is Frightful', item: 'Life Orb', gender: 'M',
		moves: ['Energy Ball', 'Weather Ball', 'Thunderbolt'],
		signatureMove: 'Halburst',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	/*
	TestMon: {
		species: 'Boldore', ability: 'Run Away', item: 'Choice Specs', gender: '',
		moves: ['Splash', 'Celebrate', 'Tackle'],
		signatureMove: 'Tackle X',
	},
	*/
};

export class RandomStaffBrosTeams extends RandomTeams {
	randomStaffBrosTeam(options: {inBattle?: boolean} = {}) {
		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of SSB sets to override the normal pool for debugging.
		const pool = debug.length ? debug : Object.keys(stbSets);
		const typePool: {[k: string]: number} = {};
		let depth = 0;
		while (pool.length && team.length < 6) {
			if (depth >= 200) throw new Error(`Infinite loop in Super Tiger Bros team generation.`);
			depth++;
			const name = this.sampleNoReplace(pool);
			const stbSet: STBSet = this.dex.deepClone(stbSets[name]);
			if (stbSet.skip) continue;

			// Enforce typing limits
			if (!debug.length) { // Type limits are ignored when debugging
				const types = this.dex.getSpecies(stbSet.species).types;
				let rejected = false;
				for (const type of types) {
					if (typePool[type] === undefined) typePool[type] = 0;
					if (typePool[type] >= 2) {
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
				for (const type of types) {
					typePool[type]++;
				}
			}

			const set: PokemonSet = {
				name: name,
				species: stbSet.species,
				item: Array.isArray(stbSet.item) ? this.sampleNoReplace(stbSet.item) : stbSet.item,
				ability: Array.isArray(stbSet.ability) ? this.sampleNoReplace(stbSet.ability) : stbSet.ability,
				moves: [],
				nature: stbSet.nature ? Array.isArray(stbSet.nature) ? this.sampleNoReplace(stbSet.nature) : stbSet.nature : 'Serious',
				gender: stbSet.gender || this.sample(['M', 'F', 'N']),
				evs: stbSet.evs ? {...{hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, ...stbSet.evs} :
				{hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84},
				ivs: {...{hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, ...stbSet.ivs},
				level: stbSet.level || 100,
				happiness: typeof stbSet.happiness === 'number' ? stbSet.happiness : 255,
				shiny: typeof stbSet.shiny === 'number' ? this.randomChance(1, stbSet.shiny) : !!stbSet.shiny,
			};
			while (set.moves.length < 3 && stbSet.moves.length > 0) {
				let move = this.sampleNoReplace(stbSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				set.moves.push(move);
			}
			set.moves.push(stbSet.signatureMove);

			// Any set specific tweaks occur here.
			if (set.name === 'Marshmallon' && !set.moves.includes('Head Charge')) set.moves[this.random(3)] = 'Head Charge';

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

export default RandomStaffBrosTeams;
