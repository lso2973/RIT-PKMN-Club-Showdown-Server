import {FS} from '../../../lib/fs';
import {toID} from '../../../sim/dex-data';
import {changeMoves} from "./abilities";

// Similar to User.usergroups. Cannot import here due to users.ts requiring Chat
// This also acts as a cache, meaning ranks will only update when a hotpatch/restart occurs
const usergroups: {[userid: string]: string} = {};
const usergroupData = FS('config/usergroups.csv').readIfExistsSync().split('\n');
for (const row of usergroupData) {
	if (!toID(row)) continue;

	const cells = row.split(',');
	if (cells.length !== 2) throw new Error(`Invalid entry when parsing usergroups.csv`);
	usergroups[toID(cells[0])] = cells[1].trim() || ' ';
}

export function getName(name: string): string {
	const userid = toID(name);
	if (!userid) throw new Error('No/Invalid name passed to getSymbol');

	const group = usergroups[userid] || ' ';
	return group + name;
}

export const Conditions: {[k: string]: ModdedConditionData & {innateName?: string}} = {
	/*
	// Example:
	userid: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Username')}|Switch In Message`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Username')}|Switch Out Message`);
		},
		onFaint() {
			this.add(`c|${getName('Username')}|Faint Message`);
		},
		// Innate effects go here
	},
	IMPORTANT: Obtain the username from getName
	*/
	// Please keep statuses organized alphabetically based on staff member name!
	atcheron: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('ATcheron')}|Here I come, bringing fun!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('ATcheron')}|Off I go, back to snow!`);
		},
		onFaint() {
			this.add(`c|${getName('ATcheron')}|The snow is gone and so am I, but this is not my final cry!`);
		},
	},
	awood: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('AWood')}|Time to get de_dusted!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('AWood')}|Rotating to A...`);
		},
		onFaint() {
			this.add(`c|${getName('AWood')}|Boom.`);
		},
	},
	azrules: {
		noCopy: true,
		onStart(pokemon) {
			if (!pokemon.side.getSideCondition('blj')) {
				this.add(`c|${getName('Azrules')}|Let’s a go`);
			}
		},
		onSwitchOut() {
			this.add(`c|${getName('Azrules')}|Wahoo`);
		},
		onFaint() {
			this.add(`c|${getName('Azrules')}|NOOOO YOU’VE MISALIGNED MY QPUs`);
		},
		onDamagingHit(damage, target, source, move) {
			if (target.hp) {
				this.add(`c|${getName('Azrules')}|That's a spicy meatball`);
			}
		},
	},
	badwolf42: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('bad_wolf42')}|Welcome to Bionicle Fan Club`);
		},
		onSwitchOut() {
			this.add(`c|${getName('bad_wolf42')}|Be right back, I have to go plan for a draft battle.`);
		},
		onFaint() {
			this.add(`c|${getName('bad_wolf42')}|How could you hurt him??? He is Friend Shaped!`);
		},
	},
	bandedbonks: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Banded Bonks')}|*loads durant*`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Banded Bonks')}|Sorry gotta get my team sanity checked, brb`);
		},
		onFaint() {
			this.add(`c|${getName('Banded Bonks')}| `);
			this.add(`raw|<img src="https://media1.tenor.com/images/bc1b3ab8289d2e60843e9823ee90f412/tenor.gif?itemid=8019684">`);
		},
		// Hustle innate ability
		innateName: 'Hustle',
		shortDesc: "This Pokémon's Attack is 1.5x and accuracy of its physical attacks is 0.8x.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, source, target, move) {
			if (source.illusion) return;
			return this.modify(atk, 1.5);
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (source.illusion) return;
			if (move.category === 'Physical' && typeof accuracy === 'number') {
				return this.chainModify([0x0CCD, 0x1000]);
			}
		},
	},
	broil: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('broil')}|Hi, @everyone!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('broil')}|this isn't the last you'll see of me!`);
		},
		onFaint() {
			this.add(`c|${getName('broil')}|cya o/`);
		},
	},
	creeperman129poke: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Creeperman129Poke')}|Creeper, aw man`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Creeperman129Poke')}|Bye *double backflips*`);
		},
		onFaint() {
			this.add(`c|${getName('Creeperman129Poke')}|*1000 Souls have been released*`);
		},
	},
	crimsonkangaroo: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('crimsonKangaroo')}|Taste the cosmos!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('crimsonKangaroo')}|The sun sets, but it'll rise again.`);
		},
		onFaint() {
			this.add(`c|${getName('crimsonKangaroo')}|Looks like this star's gone out...`);
		},
	},
	gigigecko26: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('gigigecko26')}|get out of my dump!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('gigigecko26')}|good more trash for me`);
		},
		onFaint() {
			this.add(`c|${getName('gigigecko26')}|I'll be back and in greater numbers!`);
		},
	},
	ignoritus: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Ignoritus')}|Heard someone was trying to stall :eyes:`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Ignoritus')}|brb`);
		},
		onFaint() {
			this.add(`c|${getName('Ignoritus')}|Welp, back to Temtem.`);
		},
	},
	ignoritusbreak: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Ignoritus')}|Your decisions up to this point have been Baddy Bad`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Ignoritus')}|brb`);
		},
		onFaint() {
			this.add(`c|${getName('Ignoritus')}|Welp, back to Temtem.`);
		},
	},
	jerrytkrot: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Jerrytkrot')}|AHHAHAHH oog HHHHHHH oooHHHHHOO`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Jerrytkrot')}|mmm... AAAAAAAAAAAAAA OOoooOO`);
		},
		onFaint() {
			this.add(`c|${getName('Jerrytkrot')}|OOOO AAAA uuuuuuuuuuuuhh... hhh`);
		},
	},
	meepingtonthe3rd: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('MeepingtonThe3rd')}|Meep`);
		},
		onSwitchOut() {
			this.add(`c|${getName('MeepingtonThe3rd')}|Moop`);
		},
		onFaint() {
			this.add(`c|${getName('MeepingtonThe3rd')}|Meh`);
		},
	},
	mightysharkvgc: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('MightySharkVGC')}|sure, i can play a match or two while I'm in queue`);
		},
		onSwitchOut() {
			this.add(`c|${getName('MightySharkVGC')}|brb queue popped`);
		},
		onFaint() {
			this.add(`c|${getName('MightySharkVGC')}|dang, i lost AND i missed queue? Sad`);
		},
	},
	nivelmaster: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Nivelmaster')}|It’s weather time!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Nivelmaster')}|I'll be back for more weather!`);
		},
		onFaint() {
			this.add(`c|${getName('Nivelmaster')}|Weather related casualty`);
		},
	},
	njjoltiks: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('njjoltiks')}|Caw!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('njjoltiks')}|Caw?`);
		},
		onFaint() {
			this.add(`c|${getName('njjoltiks')}|Caw...`);
		},
	},
	peekz1025: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Peekz1025')}|Prepare to feel the wrath of RIT’s first Grass Gym Leader!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Peekz1025')}|Time for another teammate to take the stage`);
		},
		onFaint() {
			this.add(`c|${getName('Peekz1025')}|IT’S A CRIT!`);
		},
	},
	planetaeus: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Planetaeus')}|Flameo, Hotman!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Planetaeus')}|And now, for my next trick...`);
		},
		onFaint() {
			this.add(`c|${getName('Planetaeus')}|The show... must... burn on...`);
		},
	},
	pseudophysics: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('PseudoPhysics')}|did I getcha?`);
		},
		onSwitchOut() {
			this.add(`c|${getName('PseudoPhysics')}|damn my slow start hasn't ended yet and I'm getting subbed out smh`);
		},
		onFaint() {
			this.add(`c|${getName('PseudoPhysics')}|:pyukuokay: nice`);
		},
	},
	quantumtangler: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('QuantumTangler')}|What's the secret to a good joke? Timing, of course.`);
		},
		onSwitchOut() {
			this.add(`c|${getName('QuantumTangler')}|My actions make more sense if you assume we're playing generation II.`);
		},
		onFaint() {
			this.add(`c|${getName('QuantumTangler')}|You always need to be PUNctual.`);
		},
	},
	ribbonnymph: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('RibbonNymph')}|:flovely:`);
		},
		onSwitchOut() {
			this.add(`c|${getName('RibbonNymph')}|I’m not specs, I have wish`);
		},
		onFaint() {
			this.add(`c|${getName('RibbonNymph')}|Well. This is underfortunate.`);
		},
	},
	rubydragonqueen: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('RubyDragonQueen')}|It's dragon time! ^V^`);
		},
		onSwitchOut() {
			this.add(`c|${getName('RubyDragonQueen')}|Alright, I'm out, who's up next?`);
		},
		onFaint() {
			this.add(`c|${getName('RubyDragonQueen')}|I HAVE BEEN SLAIN!`);
		},
	},
	scarthecolossus: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('ScarTheColossus')}|Doubles is inherently more balanced`);
		},
		onSwitchOut() {
			this.add(`c|${getName('ScarTheColossus')}|You should have set Trick Room`);
		},
		onFaint() {
			this.add(`c|${getName('ScarTheColossus')}|Subscribe to Professor Matt on Youtube`);
		},
	},
	steeevo34: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Steeevo34')}|Behold, the Boi`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Steeevo34')}|You shall be spared... For now.`);
		},
		onFaint() {
			this.add(`c|${getName('Steeevo34')}|A wizard takes his secrets to the grave`);
		},
	},
	steelosprei: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('SteelOsprei')}|My Mamoswine is just very well trained`);
		},
		onSwitchOut() {
			this.add(`c|${getName('SteelOsprei')}|You'll still be useful later`);
		},
		onFaint() {
			this.add(`c|${getName('SteelOsprei')}|Sac and move on`);
		},
	},
	tacocat2595: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('TacocaT_2595')}|I hope I’m not steeling the spotlight.`);
		},
		onSwitchOut() {
			this.add(`c|${getName('TacocaT_2595')}|I’m having a hard time here, let’s have someone else weigh in.`);
		},
		onFaint() {
			this.add(`c|${getName('TacocaT_2595')}|/html <img src="https://cdn.discordapp.com/emojis/680288953068421130.gif?v=1" />`);
		},
	},
	thinkingsceptile: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('ThinkingSceptile')}|Top agent zone is here as a substitute for the sceptile`);
		},
		onSwitchOut() {
			this.add(`c|${getName('ThinkingSceptile')}|Did you get read like a book there?`);
		},
		onFaint() {
			this.add(`c|${getName('ThinkingSceptile')}|Stand....and deliver!`);
		},
	},
	torwildheart: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('torwildheart')}|Remember when the club was in the ICPA?`);
		},
		onSwitchOut() {
			this.add(`c|${getName('torwildheart')}|Let me...catch my breath`);
		},
		onFaint() {
			this.add(`c|${getName('torwildheart')}|I thought I'd be fine if I had no heat waves I could miss`);
		},
	},
	touketsuningen: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('touketsu_ningen')}|It’s Dance time!!!`);
		},
		onSwitchOut() {
			this.add(`c|${getName('touketsu_ningen')}|Wait, I’m not done dancing`);
		},
		onFaint() {
			this.add(`c|${getName('touketsu_ningen')}|I knew I should have brought dragonite instead`);
		},
	},
	voltichalberd: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('VolticHalberd')}|Let’s Spark some controversy~`);
		},
		onSwitchOut() {
			this.add(`c|${getName('VolticHalberd')}|A brief intermission, dears~`);
		},
		onFaint() {
			this.add(`c|${getName('VolticHalberd')}|You’re a real live-wire, huh?`);
		},
	},
	// Snowier Warning support for ATcheron
	arcticgales: {
		name: 'Arctic Gales',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('icyrock')) {
				return 8;
			}
			return 5;
		},
		onStart(battle, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectData.duration = 0;
				this.add('-weather', 'Arctic Gales', '[from] ability: ' + effect, '[of] ' + source);
				this.add('-message', "Arctic gales blow through the arena!");
			} else {
				this.add('-weather', 'Arctic Gales', '[silent]');
				this.add('-message', "Arctic gales blow through the arena!");
			}
		},
		onModifySpe(spe, pokemon) {
			if (!pokemon.hasType('Ice')) {
				return this.chainModify(0.5);
			}
		},
		onResidualOrder: 1,
		onResidual() {
			this.add('-weather', 'Arctic Gales', '[upkeep]', '[silent]');
			this.add('-message', "(The Arctic gales are raging.)");
			if (this.field.isWeather('arcticgales')) this.eachEvent('Weather');
		},
		onWeather(target) {
			if (target.hasType('Ice')) return;
			this.damage(target.baseMaxhp / 16);
		},
		onEnd() {
			this.add('-weather', 'none', '[silent]');
			this.add('-message', "The Arctic gales subsided.");
		},
	},
	// Support for gigigecko26's Rabies
	rabies: {
		name: 'rabies',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			this.effectData.stage = 4;
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'rabies', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'rabies');
			}
			this.add('-start', target, 'rabies');
		},
		onSwitchIn() {
			this.effectData.stage = 4;
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			this.effectData.stage--;
			this.damage(this.clampIntRange(pokemon.baseMaxhp / 16, 1));
			if (this.effectData.stage <= 0) {
				pokemon.faint();
			}
		},
	},
	// Meta Buster support for QuantumTangler
	busteraura: {
		name: 'Buster Aura',
		duration: 0,
		onStart(side) {
			this.add('-sidestart', side, 'ability: Buster Aura');
		},
		onSwitchIn(pokemon) {
			// levels-up pokemon
			const species = pokemon.species;
			const level = pokemon.level + 5;
			(pokemon as any).level = level;
			pokemon.set.level = level;
			pokemon.formeChange(species);

			pokemon.details = species.name + (level === 100 ? '' : ', L' + level) +
				(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
			this.add('detailschange', pokemon, (pokemon.illusion || pokemon).details);

			const newHP = Math.floor(Math.floor(
				2 * species.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100
			) * level / 100 + 10);
			pokemon.hp = newHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newHP;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');

			// adds ohko move
			// cancels early if pokemon already has an ohko move, and prepares list of already-existing moves
			const newMoves = [];
			for (const moveSlot of pokemon.moveSlots) {
				const moveid = moveSlot.id;
				const move = this.dex.getMove(moveid);
				if (move.ohko) {
					return null;
				}
				newMoves.push(moveid);
			}
			// picks an ohko move based on the pokemon's type
			let newOHKO = 'guillotine';
			if (pokemon.hasType('Psychic')) newOHKO = 'sheercold';
			if (pokemon.hasType('Ground')) newOHKO = 'fissure';
			if (pokemon.hasType('Ice')) newOHKO = 'sheercold';
			newMoves.push(newOHKO);
			const newMoveSlots = changeMoves(this, pokemon, newMoves);
			pokemon.moveSlots = newMoveSlots;
			// @ts-ignore
			pokemon.baseMoveSlots = newMoveSlots;
		},
	},
};
