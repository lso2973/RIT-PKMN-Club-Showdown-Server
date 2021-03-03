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
	// Modifying various items fot Very Well Trained (SteelOsprei) without editing sim files
	assaultvest: {
		inherit: true,
		onModifySpD(spd, source) {
			if (source.hasAbility('verywelltrained')) return;
			return this.chainModify(1.5);
		},
	},
	babiriberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Steel' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	brightpowder: {
		inherit: true,
		onModifyAccuracy(accuracy, source) {
			if (source.hasAbility('verywelltrained')) return;
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return this.chainModify([0x0F1C, 0x1000]);
		},
	},
	chartiberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Rock' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	chilanberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (
				move.type === 'Normal' &&
				(!target.volatiles['substitute'] || move.flags['authentic'] || (move.infiltrates && this.gen >= 6))
			) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	chopleberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Fighting' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	cobaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Flying' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	colburberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Dark' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	deepseascale: {
		inherit: true,
		onModifySpD(spd, pokemon, source) {
			if (source.hasAbility('verywelltrained')) return;
			if (pokemon.baseSpecies.name === 'Clamperl') {
				return this.chainModify(2);
			}
		},
	},
	destinyknot: {
		inherit: true,
		onAttract(target, source) {
			if (source.hasAbility('verywelltrained')) return;
			this.debug('attract intercepted: ' + target + ' from ' + source);
			if (!source || source === target) return;
			if (!source.volatiles['attract']) source.addVolatile('attract', target);
		},
	},
	eviolite: {
		inherit: true,
		onModifyDef(def, pokemon, source) {
			if (source.hasAbility('verywelltrained')) return;
			if (pokemon.baseSpecies.nfe) {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon, source) {
			if (source.hasAbility('verywelltrained')) return;
			if (pokemon.baseSpecies.nfe) {
				return this.chainModify(1.5);
			}
		},
	},
	focusband: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (source.hasAbility('verywelltrained')) return;
			if (this.randomChance(1, 10) && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add("-activate", target, "item: Focus Band");
				return target.hp - 1;
			}
		},
		num: 230,
		gen: 2,
	},
	focussash: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (source.hasAbility('verywelltrained')) return;
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				if (target.useItem()) {
					return target.hp - 1;
				}
			}
		},
	},
	habanberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Dragon' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	kasibberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Ghost' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 196,
		gen: 4,
	},
	kebiaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Poison' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	metalpowder: {
		inherit: true,
		onModifyDef(def, pokemon, source) {
			if (source.hasAbility('verywelltrained')) return;
			if (pokemon.species.name === 'Ditto' && !pokemon.transformed) {
				return this.chainModify(2);
			}
		},
	},
	occaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Fire' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	passhoberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Water' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	payapaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Psychic' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	rindoberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Grass' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	roseliberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Fairy' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	shucaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Ground' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	tangaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Bug' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	wacanberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Electric' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	yacheberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (source.hasAbility('verywelltrained')) return;
			if (move.type === 'Ice' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
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
