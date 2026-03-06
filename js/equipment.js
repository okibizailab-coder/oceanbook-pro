// ===================================
// OceanBook Pro - Equipment System
// 器材自動判定システム
// バージョン: v20.0
// 最終更新: 2026-03-06
// ===================================

const EquipmentSystem = {
    /**
     * 器材自動判定
     */
    calculate(height, weight, shoeSize, vision) {
        return {
            lifeJacket: this.calculateLifeJacket(height, weight),
            fins: this.calculateFins(shoeSize),
            boots: this.calculateBoots(shoeSize),
            gloves: this.calculateGloves(height),
            mask: this.calculateMask(vision),
            wetsuit: this.calculateWetsuit(height, weight)
        };
    },

    /**
     * ライフジャケット判定
     */
    calculateLifeJacket(height, weight) {
        if (height < 155 || weight < 50) return 'S';
        if (height >= 185 && weight >= 85) return 'XL';
        if (height >= 175 && weight >= 75) return 'L';
        return 'M';
    },

    /**
     * フィン判定
     */
    calculateFins(shoeSize) {
        if (shoeSize <= 23) return '22-23';
        if (shoeSize <= 25) return '24-25';
        if (shoeSize <= 27) return '26-27';
        return '28-29';
    },

    /**
     * ブーツ判定（5mm単位切り上げ）
     */
    calculateBoots(shoeSize) {
        const boots = Math.ceil(shoeSize / 0.5) * 0.5;
        return String(boots);
    },

    /**
     * グローブ判定
     */
    calculateGloves(height) {
        if (height < 150) return 'S';
        if (height >= 165) return 'L';
        return 'M';
    },

    /**
     * マスク判定
     */
    calculateMask(vision) {
        if (!vision || vision === '正常') return '通常';
        return '度付き';
    },

    /**
     * ウェットスーツ判定
     */
    calculateWetsuit(height, weight) {
        if (height < 155) return 'S';
        if (height < 165) return 'M';
        if (height < 175) return 'L';
        if (height >= 185 && weight >= 85) return 'XXL';
        if (height >= 175) return 'XL';
        return 'L';
    }
};

// グローバルに公開
window.EquipmentSystem = EquipmentSystem;

console.log('✅ 器材自動判定システム読み込み完了');
