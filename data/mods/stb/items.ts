export const Items: {[k: string]: ModdedItemData} = {
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
