export const Items: {[k: string]: ModdedItemData} = {
	// Modifying Berries for Stuffed Glutton (ScarTheColossus)
	aguavberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
				pokemon.eatItem();
			}
		},
	},
	apicotberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hasAbility('gluttony'))) {
				pokemon.eatItem();
			}
		},
	},
	custapberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
				pokemon.eatItem();
			}
		},
	},
	figyberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
				pokemon.eatItem();
			}
		},
	},
	ganlonberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
				pokemon.eatItem();
			}
		},
	},
	iapapaberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
				pokemon.eatItem();
			}
		},
	},
	lansatberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
				pokemon.eatItem();
			}
		},
	},
	liechiberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
				pokemon.eatItem();
			}
		},
	},
	magoberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
				pokemon.eatItem();
			}
		},
	},
	micleberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
				pokemon.eatItem();
			}
		},
	},
	petayaberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
				pokemon.eatItem();
			}
		},
	},
	salacberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
				pokemon.eatItem();
			}
		},
	},
	starfberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
				pokemon.eatItem();
			}
		},
	},
	wikiberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && (pokemon.hasAbility('gluttony') || pokemon.hasAbility('stuffedglutton')))) {
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
