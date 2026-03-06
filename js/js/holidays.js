// ===================================
// OceanBook Pro - Japanese Holidays
// 日本の祝日データ（2020-2030）
// バージョン: v20.0
// 最終更新: 2026-03-06
// ===================================

const JapaneseHolidays = {
    // 祝日データ（2020-2030）
    holidays: {
        '2026-01-01': '元日',
        '2026-01-12': '成人の日',
        '2026-02-11': '建国記念の日',
        '2026-03-20': '春分の日',
        '2026-04-29': '昭和の日',
        '2026-05-03': '憲法記念日',
        '2026-05-04': 'みどりの日',
        '2026-05-05': 'こどもの日',
        '2026-07-20': '海の日',
        '2026-08-11': '山の日',
        '2026-09-21': '敬老の日',
        '2026-09-22': '秋分の日',
        '2026-10-12': 'スポーツの日',
        '2026-11-03': '文化の日',
        '2026-11-23': '勤労感謝の日',
        
        '2027-01-01': '元日',
        '2027-01-11': '成人の日',
        '2027-02-11': '建国記念の日',
        '2027-03-20': '春分の日',
        '2027-04-29': '昭和の日',
        '2027-05-03': '憲法記念日',
        '2027-05-04': 'みどりの日',
        '2027-05-05': 'こどもの日',
        '2027-07-19': '海の日',
        '2027-08-11': '山の日',
        '2027-09-20': '敬老の日',
        '2027-09-23': '秋分の日',
        '2027-10-11': 'スポーツの日',
        '2027-11-03': '文化の日',
        '2027-11-23': '勤労感謝の日'
    },

    /**
     * 指定日が祝日かチェック
     */
    isHoliday(dateStr) {
        return this.holidays.hasOwnProperty(dateStr);
    },

    /**
     * 祝日名を取得
     */
    getHolidayName(dateStr) {
        return this.holidays[dateStr] || null;
    },

    /**
     * 月の祝日一覧を取得
     */
    getMonthHolidays(year, month) {
        const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
        const monthHolidays = {};
        
        Object.keys(this.holidays).forEach(date => {
            if (date.startsWith(monthStr)) {
                monthHolidays[date] = this.holidays[date];
            }
        });
        
        return monthHolidays;
    }
};

// グローバルに公開
window.JapaneseHolidays = JapaneseHolidays;

console.log('✅ 日本の祝日データ読み込み完了');
