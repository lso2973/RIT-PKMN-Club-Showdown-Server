export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen5',
	gen: 4,
	modifyDamage(baseDamage, pokemon, target, move, suppressMessages = false) {
		// DPP divides modifiers into several mathematically important stages
		// The modifiers run earlier than other generations are called with ModifyDamagePhase1 and ModifyDamagePhase2

		if (!move.type) move.type = '???';
		const type = move.type;

		// Burn
		if (pokemon.status === 'brn' && baseDamage && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
			baseDamage = this.modify(baseDamage, 0.5);
		}

		// Other modifiers (Reflect/Light Screen/etc)
		baseDamage = this.runEvent('ModifyDamagePhase1', pokemon, target, move, baseDamage);

		// Double battle multi-hit
		if (move.spreadHit) {
			const spreadModifier = move.spreadModifier || (this.gameType === 'free-for-all' ? 0.5 : 0.75);
			this.debug('Spread modifier: ' + spreadModifier);
			baseDamage = this.modify(baseDamage, spreadModifier);
		}

		// Weather
		baseDamage = this.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

		if (this.gen === 3 && move.category === 'Physical' && !Math.floor(baseDamage)) {
			baseDamage = 1;
		}

		baseDamage += 2;

		const isCrit = target.getMoveHitData(move).crit;
		if (isCrit) {
			baseDamage = this.modify(baseDamage, move.critModifier || 2);
		}

		// Mod 2 (Damage is floored after all multipliers are in)
		baseDamage = Math.floor(this.runEvent('ModifyDamagePhase2', pokemon, target, move, baseDamage));

		// this is not a modifier
		baseDamage = this.randomizer(baseDamage);

		// STAB
		if (move.forceSTAB || type !== '???' && pokemon.hasType(type)) {
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a MissingNo.)
			baseDamage = this.modify(baseDamage, move.stab || 1.5);
		}
		// types
		let typeMod = target.runEffectiveness(move);
		typeMod = this.clampIntRange(typeMod, -6, 6);
		target.getMoveHitData(move).typeMod = typeMod;
		if (typeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);

			for (let i = 0; i < typeMod; i++) {
				baseDamage *= 2;
			}
		}
		if (typeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);

			for (let i = 0; i > typeMod; i--) {
				baseDamage = Math.floor(baseDamage / 2);
			}
		}

		if (isCrit && !suppressMessages) this.add('-crit', target);

		// Final modifier.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		if (!Math.floor(baseDamage)) {
			return 1;
		}

		return Math.floor(baseDamage);
	},
	hitStepInvulnerabilityEvent(targets, pokemon, move) {
		const hitResults = this.runEvent('Invulnerability', targets, pokemon, move);
		for (const [i, target] of targets.entries()) {
			if (hitResults[i] === false) {
				this.attrLastMove('[miss]');
				this.add('-miss', pokemon, target);
			}
		}
		return hitResults;
	},
	hitStepAccuracy(targets, pokemon, move) {
		const hitResults = [];
		for (const [i, target] of targets.entries()) {
			this.activeTarget = target;
			// calculate true accuracy
			let accuracy = move.accuracy;
			if (move.ohko) { // bypasses accuracy modifiers
				if (!target.isSemiInvulnerable()) {
					if (pokemon.level < target.level) {
						this.add('-immune', target, '[ohko]');
						hitResults[i] = false;
						continue;
					}
					accuracy = 30 + pokemon.level - target.level;
				}
			} else {
				const boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];

				let boosts;
				let boost!: number;
				if (accuracy !== true) {
					if (!move.ignoreAccuracy) {
						boosts = this.runEvent('ModifyBoost', pokemon, null, null, {...pokemon.boosts});
						boost = this.clampIntRange(boosts['accuracy'], -6, 6);
						if (boost > 0) {
							accuracy *= boostTable[boost];
						} else {
							accuracy /= boostTable[-boost];
						}
					}
					if (!move.ignoreEvasion) {
						boosts = this.runEvent('ModifyBoost', target, null, null, {...target.boosts});
						boost = this.clampIntRange(boosts['evasion'], -6, 6);
						if (boost > 0) {
							accuracy /= boostTable[boost];
						} else if (boost < 0) {
							accuracy *= boostTable[-boost];
						}
					}
				}
				accuracy = this.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
			}
			if (move.alwaysHit) {
				accuracy = true; // bypasses ohko accuracy modifiers
			} else {
				accuracy = this.runEvent('Accuracy', target, pokemon, move, accuracy);
			}
			if (accuracy !== true && !this.randomChance(accuracy, 100)) {
				if (!move.spreadHit) this.attrLastMove('[miss]');
				this.add('-miss', pokemon, target);
				hitResults[i] = false;
				continue;
			}
			hitResults[i] = true;
		}
		return hitResults;
	},

	calcRecoilDamage(damageDealt, move) {
		return this.clampIntRange(Math.floor(damageDealt * move.recoil![0] / move.recoil![1]), 1);
	},
};
