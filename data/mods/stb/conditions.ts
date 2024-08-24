// import {stbSets} from "./random-teams";
import {getName} from './scripts'; // also import changeSet, enemyStaff
import {ModdedConditionData} from '../../../sim/dex-conditions';

export const Conditions: {[id: IDEntry]: ModdedConditionData & {innateName?: string}} = {
	/*
	// Example:
	userid: {
		noCopy: true,
		onStart() {
			this.add(`c:|${getName('Username')}|Switch In Message`);
		},
		onSwitchOut() {
			this.add(`c:|${getName('Username')}|Switch Out Message`);
		},
		onFaint() {
			this.add(`c:|${getName('Username')}|Faint Message`);
		},
		// Innate effects go here
	},
	IMPORTANT: Obtain the username from getName
	*/

	// Please keep statuses organized alphabetically based on username!

	// OLD STB SETS

	broil: {
		noCopy: true,
		onStart(pokemon) {
			this.add(`c:|${getName('broil')}|Hi, @everyone!`);
		},
		onSwitchOut() {
			this.add(`c:|${getName('broil')}|this isn't the last you'll see of me!`);
		},
		onFaint() {
			this.add(`c:|${getName('broil')}|cya o/`);
		},
	},

	davidts: {
		noCopy: true,
		onStart() {
			this.add(`c:|${getName('davidts')}|It's playtime, cuties!`);
		},
		onFaint() {
			this.add(`c:|${getName('davidts')}|In the arms of the angel...`);
		},
	},

	gigigecko26: {
		noCopy: true,
		onStart() {
			this.add(`c:|${getName('gigigecko26')}|get out of my dump!`);
		},
		onSwitchOut() {
			this.add(`c:|${getName('gigigecko26')}|good more trash for me`);
		},
		onFaint() {
			this.add(`c:|${getName('gigigecko26')}|I'll be back and in greater numbers!`);
		},
	},

	peekz1025: {
		noCopy: true,
		onStart() {
			this.add(`c:|${getName('Peekz1025')}|Prepare to feel the wrath of RIT’s first Grass Gym Leader!`);
		},
		onSwitchOut() {
			this.add(`c:|${getName('Peekz1025')}|Time for another teammate to take the stage`);
		},
		onFaint() {
			this.add(`c:|${getName('Peekz1025')}|IT’S A CRIT!`);
		},
	},

	// NEW STB SETS

	// These two are the same person
	'8biteki': {
		noCopy: true,
		onStart() {
			this.add(`c:|${getName('8biteki')}|yo waddup`);
		},
		onSwitchOut() {
			this.add(`c:|${getName('8biteki')}|oh brb`);
		},
		onFaint() {
			this.add(`c:|${getName('8biteki')}|bad rng bg`);
		},
	},
	'ya-da-ne': {
		noCopy: true,
		onStart() {
			this.add(`c:|${getName('ya-da-ne')}|yo waddup`);
		},
		onSwitchOut() {
			this.add(`c:|${getName('ya-da-ne')}|oh brb`);
		},
		onFaint() {
			this.add(`c:|${getName('ya-da-ne')}|bad rng bg`);
		},
	},
	// These two are the same person

	// CUSTOM EFFECTS

	// Rabies for gigigecko26
	rabies: {
		name: 'rabies',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			this.effectState.stage = 4;
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'rabies', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'rabies');
			}
			this.add('-start', target, 'rabies');
		},
		onSwitchIn() {
			this.effectState.stage = 4;
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			this.effectState.stage--;
			this.damage(this.clampIntRange(pokemon.baseMaxhp / 16, 1));
			if (this.effectState.stage <= 0) {
				pokemon.faint();
			}
		},
	},
};
