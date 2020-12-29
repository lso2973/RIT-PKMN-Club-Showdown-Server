export const Items: {[k: string]: ModdedItemData} = {
	// Modifying Berries for Pancake(ScarTheColossus)
	aguavberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	apicotberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	custapberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	figyberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	ganlonberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	iapapaberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	lansatberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	liechiberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	magoberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	micleberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	petayaberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	salacberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	starfberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	wikiberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('pancake')))) {
				pokemon.eatItem();
			}
		},
	},
	// Modified Misty Seeds for Ribbon Terrain
	mistyseed: {
		inherit: true,
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && (this.field.isTerrain('mistyterrain') || this.field.isTerrain('ribbonterrain'))) {
				pokemon.useItem();
			}
		},
		onAnyTerrainStart() {
			const pokemon = this.effectData.target;
			if (this.field.isTerrain('mistyterrain') || this.field.isTerrain('ribbonterrain')) {
				pokemon.useItem();
			}
		},
	},
};
