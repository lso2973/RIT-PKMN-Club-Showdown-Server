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
};
