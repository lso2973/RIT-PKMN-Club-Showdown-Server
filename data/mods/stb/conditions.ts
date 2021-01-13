import {FS} from '../../../lib/fs';
import {toID} from '../../../sim/dex-data';

// Used in many abilities, placed here to reduce the number of updates needed and to reduce the chance of errors
const STRONG_WEATHERS = ['desolateland', 'primordialsea', 'deltastream', 'heavyhailstorm', 'winterhail'];

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
	atcheron:{
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
	bandedbonks:{
		noCopy: true,
		onStart() {
			this.add(`c|${getName('Banded Bonks')}|*loads durant*`);
		},
		onSwitchOut() {
			this.add(`c|${getName('Banded Bonks')}|Sorry, my free trial of being out has expired, give me a second`);
		},
		onFaint() {
			this.add(`c|${getName('Banded Bonks')}|Sometimes you bonk, sometimes you get bonked`);
		},
		// Hustle innate ability
		innateName: 'Hustle',
		shortDesc: "This Pokemon's Attack is 1.5x and accuracy of its physical attacks is 0.8x.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.modify(atk, 1.5);
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (move.category === 'Physical' && typeof accuracy === 'number') {
				return this.chainModify([0x0CCD, 0x1000]);
			}
		},
	},
	peekz1025:{
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
	scarthecolossus: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('ScarTheColossus')}|Doubles is inherently more balanced`);
		},
		onSwitchOut(){
			this.add(`c|${getName('ScarTheColossus')}|You should have set Trick Room`);
		},
		onFaint(){
			this.add(`c|${getName('ScarTheColossus')}|Subscribe to Professor Matt on Youtube`);
		},
	},
	torwildheart:{
		noCopy: true,
		onStart() {
			this.add(`c|${getName('torwildheart')}|Remember when the club was in the ICPA?`);
		},
		onSwitchOut(){
			this.add(`c|${getName('torwildheart')}|Let me...catch my breath`);
		},
		onFaint(){
			this.add(`c|${getName('torwildheart')}|I thought I'd be fine if I had no heat waves I could miss`);
		},
	},
	voltichalberd: {
		noCopy: true,
		onStart() {
			this.add(`c|${getName('VolticHalberd')}|Let’s Spark some controversy~`);
		},
		onSwitchOut(){
			this.add(`c|${getName('VolticHalberd')}|A brief intermission, dears~`);
		},
		onFaint(){
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
			} else {
				this.add('-weather', 'Arctic Gales');
			}
		},
		onModifySpe(spe, pokemon) {
			if (!pokemon.hasType('Ice')) {
				return this.chainModify(0.5);
			}
		},
		onResidualOrder: 1,
		onResidual() {
			this.add('-weather', 'Arctic Gales', '[upkeep]');
			if (this.field.isWeather('arcticgales')) this.eachEvent('Weather');
		},
		onWeather(target) {
			if (target.hasType('Ice')) return;
			this.damage(target.baseMaxhp / 16);
		},
		onEnd() {
			this.add('-weather', 'none');
		},
	}
};
