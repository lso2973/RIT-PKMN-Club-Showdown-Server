export const Items: {[k: string]: ModdedItemData} = {
	// Modifying Safety Goggles for Arctic Gales weather (ATcheron)
	safetygoggles: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'arcticgales' || type === 'powder') return false;
		},
		onTryHit(pokemon, source, move) {
			if (move.flags['powder'] && pokemon !== source && this.dex.getImmunity('powder', pokemon) && !source.hasAbility('verywelltrained')) {
				this.add('-activate', pokemon, 'item: Safety Goggles', move.name);
				return null;
			}
		},
	},
	// Modifying Berries for Pancake(ScarTheColossus)
	aguavberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	apicotberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	custapberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	figyberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	ganlonberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	iapapaberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	lansatberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	liechiberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	magoberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	micleberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	petayaberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	salacberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	starfberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	wikiberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					(pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
};
