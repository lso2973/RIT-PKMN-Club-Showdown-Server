import {getName} from './conditions';
import {changeSet, changeMoves} from "./abilities";
import {ssbSets} from "./random-teams";


/**************************************************
 * Generated by the following script:
	Object.keys(Dex.data.Moves).filter(id => {
		const move = Dex.data.Moves[id];
		if (!move || move.isZ || move.isNonstandard || move.isMax || move.noSketch) return false;
		return [
			'agility', 'aromatherapy', 'auroraveil', 'autotomize', 'banefulbunker', 'batonpass', 'bellydrum', 'bulkup', 'calmmind', 'clangoroussoul', 'coil', 'cottonguard', 'courtchange', 'curse', 'defog', 'destinybond', 'detect', 'disable', 'dragondance', 'drainingkiss', 'encore', 'extremeevoboost', 'geomancy', 'glare', 'haze', 'healbell', 'healingwish', 'healorder', 'heartswap', 'honeclaws', 'kingsshield', 'irondefense', 'leechseed', 'lightscreen', 'lovelykiss', 'magiccoat', 'maxguard', 'memento', 'milkdrink', 'moonlight', 'morningsun', 'nastyplot', 'naturesmadness', 'noretreat', 'obstruct', 'painsplit', 'partingshot', 'perishsong', 'protect', 'quiverdance', 'recover', 'reflect', 'reflecttype', 'rest', 'roar', 'rockpolish', 'roost', 'shellsmash', 'shiftgear', 'slackoff', 'sleeppowder', 'sleeptalk', 'softboiled', 'spikes', 'spikyshield', 'spore', 'stealthrock', 'stickyweb', 'strengthsap', 'substitute', 'switcheroo', 'swordsdance', 'synthesis', 'tailglow', 'tailwind', 'taunt', 'thunderwave', 'toxic', 'toxicspikes', 'transform', 'trick', 'whirlwind', 'willowisp', 'wish', 'yawn',
		].includes(id) || (
			move.basePower > 75 && ![
				'accelerock', 'acrobatics', 'aquajet', 'avalanche', 'bonemerang', 'bouncybubble', 'bulletpunch', 'bulletseed', 'buzzybuzz', 'circlethrow', 'clearsmog', 'doubleironbash', 'dragondarts', 'dragontail', 'endeavor', 'facade', 'firefang', 'flipturn', 'freezedry', 'frustration', 'geargrind', 'grassknot', 'gyroball', 'hex', 'icefang', 'iceshard', 'iciclespear', 'knockoff', 'lowkick', 'machpunch', 'nightshade', 'nuzzle', 'pikapapow', 'psychocut', 'pursuit', 'quickattack', 'rapidspin', 'return', 'rockblast', 'scorchingsands', 'seismictoss', 'shadowclaw', 'shadowsneak', 'sizzlyslide', 'storedpower', 'stormthrow', 'suckerpunch', 'superfang', 'surgingstrikes', 'tailslap', 'tripleaxel', 'uturn', 'veeveevolley', 'voltswitch', 'watershuriken', 'weatherball',
			].includes(id)
		);
	});
 **************************************************/
const USEFUL_MOVES = [
	"agility", "anchorshot", "appleacid", "aquatail", "aromatherapy", "attackorder", "aurasphere", "aurawheel", "auroraveil",
	"autotomize", "banefulbunker", "batonpass", "behemothbash", "behemothblade", "belch", "bellydrum", "blastburn", "blazekick",
	"blizzard", "blueflare", "bodypress", "bodyslam", "boltbeak", "boltstrike", "boomburst", "bounce", "bravebird", "bugbuzz",
	"bulkup", "burnup", "calmmind", "clangingscales", "clangoroussoul", "closecombat", "coil", "cottonguard", "courtchange",
	"crabhammer", "crosschop", "crunch", "curse", "darkestlariat", "darkpulse", "dazzlinggleam", "defog", "destinybond", "detect",
	"dig", "disable", "discharge", "dive", "doomdesire", "doubleedge", "dracometeor", "dragonclaw", "dragondance", "dragonhammer",
	"dragonpulse", "dragonrush", "drainingkiss", "dreameater", "drillpeck", "drillrun", "drumbeating", "dynamaxcannon",
	"dynamicpunch", "earthpower", "earthquake", "encore", "energyball", "eruption", "eternabeam", "expandingforce", "explosion",
	"extrasensory", "extremespeed", "falsesurrender", "fierydance", "fireblast", "firelash", "firepledge", "firstimpression",
	"fishiousrend", "flamethrower", "flareblitz", "flashcannon", "fleurcannon", "fly", "flyingpress", "focusblast", "focuspunch",
	"foulplay", "freezeshock", "frenzyplant", "fusionbolt", "fusionflare", "futuresight", "gigaimpact", "glare", "grasspledge",
	"gravapple", "gunkshot", "hammerarm", "haze", "headcharge", "headsmash", "healbell", "healingwish", "heatwave",
	"highhorsepower", "highjumpkick", "honeclaws", "hurricane", "hydrocannon", "hydropump", "hyperbeam", "hypervoice",
	"icebeam", "iceburn", "iciclecrash", "inferno", "irondefense", "ironhead", "irontail", "jawlock", "kingsshield",
	"lastresort", "lavaplume", "leafblade", "leafstorm", "leechlife", "leechseed", "lightscreen", "liquidation",
	"lunge", "magiccoat", "megahorn", "megakick", "megapunch", "memento", "meteorassault", "meteorbeam", "meteormash",
	"milkdrink", "mistyexplosion", "moonblast", "moongeistbeam", "moonlight", "morningsun", "muddywater", "multiattack",
	"nastyplot", "nightdaze", "noretreat", "obstruct", "outrage", "overdrive", "overheat", "painsplit", "partingshot",
	"perishsong", "petalblizzard", "petaldance", "phantomforce", "photongeyser", "plasmafists", "playrough", "poisonjab",
	"pollenpuff", "poltergeist", "powergem", "powerwhip", "prismaticlaser", "protect", "psychic", "psychicfangs", "psyshock",
	"psystrike", "pyroball", "quiverdance", "recover", "reflect", "reflecttype", "rest", "roar", "rockpolish", "rockwrecker",
	"roost", "sacredsword", "scald", "secretsword", "seedbomb", "selfdestruct", "shadowball", "shadowbone", "shellsidearm",
	"shellsmash", "shelltrap", "shiftgear", "skullbash", "skyattack", "slackoff", "slam", "sleeppowder", "sleeptalk",
	"sludgebomb", "sludgewave", "snipeshot", "softboiled", "solarbeam", "solarblade", "sparklingaria", "spectralthief",
	"spikes", "spikyshield", "spiritshackle", "spore", "stealthrock", "steelbeam", "steelroller", "stickyweb",
	"stoneedge", "strangesteam", "strength", "strengthsap", "submission", "substitute", "sunsteelstrike", "superpower",
	"surf", "switcheroo", "swordsdance", "synthesis", "tailwind", "takedown", "taunt", "thrash", "throatchop", "thunder",
	"thunderbolt", "thunderwave", "toxic", "toxicspikes", "transform", "triattack", "trick", "uproar", "vcreate",
	"volttackle", "waterfall", "waterpledge", "waterspout", "whirlwind", "wickedblow", "wildcharge", "willowisp", "wish",
	"woodhammer", "xscissor", "yawn", "zapcannon", "zenheadbutt", "zingzap",
];

export const Moves: {[k: string]: ModdedMoveData} = {
	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		desc: "", // long description
		shortDesc: "", // short description, shows up in /dt
		name: "Move Name",
		isNonstandard: "Custom",
		gen: 8,
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/smogon/pokemon-showdown/blob/master/data/moves.js#L1-L27
		onTryMove() {
			this.attrLastMove('[still]'); // For custom animations
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Move Name 1', source);
			this.add('-anim', source, 'Move Name 2', source);
		}, // For custom animations
		secondary: {
			status: "tox",
			chance: 20,
		}, // secondary, set to null to not use one. Exact usage varies, check data/moves.js for examples
		target: "normal", // What does this move hit?
		// normal = the targeted foe, self = the user, allySide = your side (eg light screen), foeSide = the foe's side (eg spikes), all = the field (eg raindance). More can be found in data/moves.js
		type: "Water", // The move's type
		// Other useful things
		noPPBoosts: true, // add this to not boost the PP of a move, not needed for Z moves, dont include it otherwise
		isZ: "crystalname", // marks a move as a z move, list the crystal name inside
		zMove: {effect: ''}, // for status moves, what happens when this is used as a Z move? check data/moves.js for examples
		zMove: {boost: {atk: 2}}, // for status moves, stat boost given when used as a z move
		critRatio: 2, // The higher the number (above 1) the higher the ratio, lowering it lowers the crit ratio
		drain: [1, 2], // recover first num / second num % of the damage dealt
		heal: [1, 2], // recover first num / second num % of the target's HP
	},
	*/
	// Please keep sets organized alphabetically based on staff member name!
	// RibbonNymph
	ribbonsurge: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "For 5 turns, the terrain becomes Ribbon Terrain. During the effect, the power of Fairy type moves is multiplied by 1.3, the power of Dragon type moves is halved, and grounded Pokémon are protected from non-volatile status afflictions."
		shortDesc: "5 turns. Fairy 1.3x dmg, Dragon 0.5x dmg. Blocks status afflictions."
		name: "Ribbon Surge",
		pp: 10,
		priority: 0,
		flags: {nonsky: 1},
		terrain: 'ribbonterrain',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (effect && ((effect as Move).status || effect.id === 'yawn')) {
					this.add('-activate', target, 'move: Ribbon Surge');
				}
				return false;
			},
			onTryAddVolatile(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'confusion') {
					if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Ribbon Surge');
					return null;
				}
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('ribbon terrain weaken');
					return this.chainModify(0.5);
				}
				if (move.type === 'Fairy' && attacker.isGrounded()) {
					this.debug('ribbon terrain boost');
					return this.chainModify(1.3);
				}
			},
			onStart(battle, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Ribbon Surge', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Ribbon Surge');
				}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd(side) {
				this.add('-fieldend', 'Ribbon Surge');
			},
		},
		secondary: null,
		target: "all",
		type: "Fairy",
		zMove: {boost: {spd: 1}},
		contestType: "Beautiful",
	},
	// Support for RibbonNymph's Ribbon Surge
	camouflage: {
		inherit: true,
		onHit(target) {
			let newType = 'Normal';
			if (this.field.isTerrain('electricterrain')) {
				newType = 'Electric';
			} else if (this.field.isTerrain('grassyterrain')) {
				newType = 'Grass';
			} else if (this.field.isTerrain('mistyterrain') || this.field.isTerrain('ribbonterrain')) {
				newType = 'Fairy';
			} else if (this.field.isTerrain('psychicterrain')) {
				newType = 'Psychic';
			}

			if (target.getTypes().join() === newType || !target.setType(newType)) return false;
			this.add('-start', target, 'typechange', newType);
		},
	},
	mistyexplosion: {
		inherit: true,
		onBasePower(basePower, source) {
			if ((this.field.isTerrain('mistyterrain') || this.field.isTerrain('ribbonterrain')) && source.isGrounded()) {
				this.debug('misty terrain boost');
				return this.chainModify(1.5);
			}
		},
	},
	naturepower: {
		inherit: true,
		onTryHit(target, pokemon) {
			let move = 'triattack';
			if (this.field.isTerrain('electricterrain')) {
				move = 'thunderbolt';
			} else if (this.field.isTerrain('grassyterrain')) {
				move = 'energyball';
			} else if (this.field.isTerrain('mistyterrain') || this.field.isTerrain('ribbonterrain')) {
				move = 'moonblast';
			} else if (this.field.isTerrain('psychicterrain')) {
				move = 'psychic';
			}
			this.useMove(move, pokemon, target);
			return null;
		},
	},
	secretpower: {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (this.field.isTerrain('')) return;
			move.secondaries = [];
			if (this.field.isTerrain('electricterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'par',
				});
			} else if (this.field.isTerrain('grassyterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'slp',
				});
			} else if (this.field.isTerrain('mistyterrain') || this.field.isTerrain('ribbonterrain')) {
				move.secondaries.push({
					chance: 30,
					boosts: {
						spa: -1,
					},
				});
			} else if (this.field.isTerrain('psychicterrain')) {
				move.secondaries.push({
					chance: 30,
					boosts: {
						spe: -1,
					},
				});
			}
		},
	},
	terrainpulse: {
		inherit: true,
		onModifyType(move, pokemon) {
			if (!pokemon.isGrounded()) return;
			switch (this.field.terrain) {
			case 'electricterrain':
				move.type = 'Electric';
				break;
			case 'grassyterrain':
				move.type = 'Grass';
				break;
			case 'mistyterrain':
			case 'ribbonterrain':
				move.type = 'Fairy';
				break;
			case 'psychicterrain':
				move.type = 'Psychic';
				break;
			}
		},
	},
};
