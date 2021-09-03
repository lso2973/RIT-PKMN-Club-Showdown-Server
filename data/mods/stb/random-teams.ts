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
	'Anonymous Pulsar': {
		species: 'Genesect', ability: 'Analysis', item: 'Life Orb', gender: 'M',
		moves: ['Thunderbolt', 'Ice Beam', 'Flamethrower'],
		signatureMove: 'Upload',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
	},
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
	Azrules: {
		species: 'Plusle', ability: 'speeeeeeeee', item: 'Heavy Duty Boots', gender: 'M',
		moves: ['Electro Ball', 'Spacial Rend', 'Doom Desire'],
		signatureMove: 'BLJ',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Timid', shiny: true,
	},
	'bad_wolf42': {
		species: 'Phanpy', ability: "Friend Shaped", item: 'Eviolite', gender: 'F',
		moves: ['Protect', 'Stealth Rock', 'Slack Off'],
		signatureMove: 'Roll Around',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Careful',
	},
	'Banded Bonks': {
		species: 'Durant', ability: 'Of The Many', item: 'White Herb', gender: 'M',
		moves: ['First Impression', 'Superpower', ['Stomping Tantrum', 'Rock Slide', 'Thunder Fang', 'Crunch', 'Aerial Ace']],
		signatureMove: 'Stallbreaking',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	Braxxus5th: {
		species: 'Tyranitar', ability: 'Pocket Sandstream', item: 'Leftovers', gender: 'M',
		moves: ['Rock Wrecker', 'Thousand Arrows', 'Sucker Punch'],
		signatureMove: 'Jack\'s Jank Junk',
		evs: {hp: 124, atk: 76, def: 68, spd: 188, spe: 52}, nature: 'Adamant',
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
		species: 'Solgaleo', ability: 'Solar Wind', item: 'Weakness Policy', gender: 'M',
		moves: ['Fire Fang', 'Psychic Fangs', 'Body Press'],
		signatureMove: 'Star Eater',
		evs: {hp: 252, atk: 4, spe: 252}, nature: 'Jolly',
	},
	davidts: {
		species: 'Sableye', ability: 'Prankster', item: 'Sablenite‎', gender: 'M',
		moves: ['Taunt', 'Cosmic Power', 'Foul Play'],
		signatureMove: "Ruby's Curse",
		evs: {hp: 4, def: 252, spd: 252}, ivs: {atk: 0}, nature: 'Impish', shiny: true,
	},
	'En Passant': {
		species: 'Duraludon', ability: 'Tactical Stance', item: 'Assault Vest', gender: 'M',
		moves: [['Dragon Pulse', 'Flash Cannon'], ['Iron Head', 'Dragon Hammer'], ['Earthquake', 'Fire Punch'], ['Earth Power', 'Flamethrower'], ['Steel Beam', 'Draco Meteor']],
		signatureMove: 'Capture',
		evs: {hp: 252, atk: 200, spd: 36, spe: 20}, nature: 'Gentle',
	},
	gigigecko26: {
		species: 'Zigzagoon', ability: 'Rabies', item: 'Eviolite', gender: 'M',
		moves: ['Zing Zap', 'Earthquake', 'Psyshock'],
		signatureMove: 'Internet Troll',
		evs: {hp: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	Ignoritus: {
		species: 'Froslass', ability: 'Illusion', item: 'Focus Sash', gender: 'M',
		moves: ['Shadow Ball', 'Ice Beam', 'Sheer Cold'],
		signatureMove: 'Spectral Terrain',
		evs: {spa: 252, spd: 4, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	Jerrytkrot: {
		species: 'Seismitoad', ability: 'Wonder Guard', item: 'Sticky Barb', gender: 'M',
		moves: [['Heal Pulse', 'Telekinesis', 'Wonder Room'], ['Explosion', 'Self-Destruct', 'Substitute', 'Healing Wish', 'Memento'], ['Refresh', 'Taunt', 'Protect', 'Endure']],
		signatureMove: 'Froge Blessings',
		evs: {hp: 1, atk: 2, def: 3, spa: 4, spd: 5, spe: 6}, ivs: {hp: 7, def: 9, spa: 10, spd: 11, spe: 12}, nature: 'Modest',
	},
	MeepingtonThe3rd: {
		species: 'Raichu-Alola', ability: 'Storm Surfing', item: 'Life Orb', gender: 'M',
		moves: ['Nasty Plot', 'Thunder', 'Splishy Splash'],
		signatureMove: 'Mental Brick',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Modest',
	},
	MightySharkVGC: {
		species: 'Garchomp', ability: 'Cool Sword', item: 'Life Orb', gender: 'F',
		moves: ['Behemoth Blade', 'Thousand Arrows', 'Sacred Sword'],
		signatureMove: 'Too Many Swords',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
	},
	Nivelmaster: {
		species: 'Castform', ability: 'Weatherman', item: 'Choice Specs', gender: 'M',
		moves: [],
		signatureMove: 'Weathermanball',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
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
		species: 'Sylveon', ability: 'Ribbon Surge', item: 'Choice Specs', gender: 'F',
		moves: ['Boomburst', 'Flamethrower', 'Wish'],
		signatureMove: 'Quick Whip',
		evs: {hp: 252, spa: 252, spd: 4}, ivs: {atk: 0}, nature: 'Modest',
	},
	RubyDragonQueen: {
		species: 'Dragonite', ability: 'Dragonscale', item: 'Dragon Fang', gender: 'N',
		moves: ['Roost', 'Curse', 'Extreme Speed'],
		signatureMove: 'Dragonforce',
		evs: {hp: 252, atk: 252, spd: 4}, nature: 'Adamant',
	},
	ScarTheColossus: {
		species: 'Snorlax', ability: 'Pancake', item: 'Figy Berry', gender: 'M',
		moves: ['Facade', 'Earthquake', 'Crunch'],
		signatureMove: 'Balance',
		evs: {hp: 188, atk: 124, def: 148, spd: 44, spe: 4}, ivs: {spe: 2}, nature: 'Brave',
	},
	Steeevo34: {
		species: 'Shuckle', ability: "A Wizard's Secret", item: 'Lum Berry', gender: 'M',
		moves: ['Trick Room', 'Earthquake', 'Swords Dance'],
		signatureMove: 'Retroincabulate',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {spe: 0}, nature: 'Relaxed',
	},
	SteelOsprei: {
		species: 'Mamoswine', ability: 'Very Well Trained', item: 'Choice Scarf', gender: 'M',
		moves: ['Earthquake', 'Icicle Crash', 'Superpower'],
		signatureMove: 'Stone edge but it doesn\'t miss',
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Jolly',
	},
	SubparSniper: {
		species: 'Stoutland', ability: 'Scrappy', item: 'Choice Scarf', gender: 'M',
		moves: ['Fire Fang', 'Ice Fang', 'Stomping Tantrum'],
		signatureMove: 'Clapback',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	'TacocaT_2595': {
		species: 'Mandibuzz', ability: 'Bone Removal Without Approval', item: 'Thick Club', gender: 'F',
		moves: ['Bonemerang', 'Bone Club', 'Shadow Bone'],
		signatureMove: 'Bone Appetit',
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Impish',
	},
	/* Not a member of club anymore, RIP
	ThinkingSceptile: {
		species: 'Magnezone', ability: 'Calcing...', item: 'Choice Specs', gender: 'M',
		moves: ['Thunderbolt', 'Flash Cannon', 'Ice Beam'],
		signatureMove: 'Ha! Read!',
		evs: {hp: 252, spa: 252, def: 4}, ivs: {atk: 0}, nature: 'Quiet',
	},
    */
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
	Werewolf72: {
		species: 'Lucario', ability: 'The High Ground', item: 'Expert Belt', gender: 'M',
		moves: ['Shadow Ball', 'Ice Beam', 'Thunderbolt'],
		signatureMove: 'The Force',
		evs: {hp: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Timid',
	},
	/* TestMon: {
		species: 'Chansey', ability: 'Run Away', item: 'Choice Specs', gender: '',
		moves: ['Splash', 'Toxic', 'Tackle'],
		signatureMove: 'The Force',
	},*/
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
				const types = this.dex.species.get(stbSet.species).types;
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
			if (set.name === 'Braxxus5th' && this.random(2) === 1) {
				set.moves[0] = 'Meteor Beam';
				set.moves[1] = 'Earth Power';
				set.moves[2] = 'Dark Pulse';
				set.nature = 'Modest';
				set.evs = {hp: 100, atk: 0, def: 80, spa: 252, spd: 24, spe: 52};
			}
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
