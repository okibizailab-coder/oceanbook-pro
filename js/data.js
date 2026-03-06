// ===================================
// OceanBook Pro - Data Management
// データ管理システム（localStorage）
// バージョン: v20.0
// 最終更新: 2026-03-06
// ===================================

const DataManager = {
    /**
     * 初期化
     */
    init() {
        console.log('💾 DataManager: 初期化開始');
        
        // 初回起動チェック
        const isFirstRun = !localStorage.getItem('oceanbook_initialized');
        
        if (isFirstRun) {
            console.log('🎉 初回起動：初期データを設定します');
            this.setInitialData();
            localStorage.setItem('oceanbook_initialized', 'true');
        } else {
            console.log('✅ データ読み込み完了');
        }
    },

    /**
     * 初期データ設定
     */
    setInitialData() {
        // 予約データ（41件）
        const reservations = this.generateReservations();
        localStorage.setItem('oceanbook_reservations', JSON.stringify(reservations));
        console.log(`📅 予約データ ${reservations.length}件 設定完了`);

        // LINE会話データ（5件）
        const lineConversations = this.generateLineConversations();
        localStorage.setItem('oceanbook_line_conversations', JSON.stringify(lineConversations));
        console.log(`💬 LINE会話 ${lineConversations.length}件 設定完了`);

        // 顧客データ（3件）
        const customers = this.generateCustomers();
        localStorage.setItem('oceanbook_customers', JSON.stringify(customers));
        console.log(`👤 顧客データ ${customers.length}件 設定完了`);
    },

    /**
     * 予約データ生成（41件）
     */
    generateReservations() {
        const reservations = [];
        const today = new Date();
        const guides = ['山城ガイド', '新垣ガイド', '比嘉ガイド'];
        const statuses = ['confirmed', 'confirmed', 'confirmed', 'pending', 'cancelled'];
        
        const names = [
            '田中太郎', '佐藤花子', '鈴木一郎', '高橋美咲', '伊藤健太',
            '渡辺優子', '山本大輔', '中村さくら', '小林誠', '加藤愛',
            '吉田拓也', '山田麻衣', '佐々木翔', '松本彩', '木村勇太'
        ];

        for (let i = 0; i < 41; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + Math.floor(Math.random() * 30) - 5);
            
            const dateStr = date.toISOString().split('T')[0];
            const time = ['09:00', '10:30', '13:00', '14:30'][Math.floor(Math.random() * 4)];
            const participants = Math.floor(Math.random() * 4) + 1;
            const adults = Math.max(1, participants - Math.floor(Math.random() * 2));
            const children = participants - adults;
            
            const reservation = {
                id: `20260301-${String(i + 1).padStart(3, '0')}`,
                date: dateStr,
                time: time,
                customerName: names[Math.floor(Math.random() * names.length)],
                phone: `090-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
                email: `customer${i + 1}@example.com`,
                participants: participants,
                adults: adults,
                children: children,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                guide: guides[Math.floor(Math.random() * guides.length)],
                notes: i % 3 === 0 ? 'お子様用器材準備' : '',
                createdAt: new Date(date.getTime() - 86400000).toISOString(),
                participantDetails: this.generateParticipantDetails(participants)
            };
            
            reservations.push(reservation);
        }
        
        return reservations.sort((a, b) => b.date.localeCompare(a.date));
    },

    /**
     * 参加者詳細生成
     */
    generateParticipantDetails(count) {
        const details = [];
        const names = ['太郎', '花子', '一郎', '美咲', '健太', '優子', '大輔', 'さくら'];
        
        for (let i = 0; i < count; i++) {
            const height = 150 + Math.floor(Math.random() * 30);
            const weight = 50 + Math.floor(Math.random() * 30);
            const shoeSize = 23 + Math.floor(Math.random() * 6);
            
            details.push({
                name: names[i % names.length],
                age: 20 + Math.floor(Math.random() * 40),
                height: height,
                weight: weight,
                shoeSize: shoeSize,
                vision: Math.random() > 0.7 ? '近視（-3.0）' : '正常',
                equipment: this.calculateEquipment(height, weight, shoeSize)
            });
        }
        
        return details;
    },

    /**
     * 器材自動判定
     */
    calculateEquipment(height, weight, shoeSize) {
        // ライフジャケット
        let lifeJacket = 'M';
        if (height < 155 || weight < 50) lifeJacket = 'S';
        else if (height >= 175 && weight >= 75) lifeJacket = 'L';
        else if (height >= 185 && weight >= 85) lifeJacket = 'XL';

        // フィン
        let fins = '24-25';
        if (shoeSize <= 23) fins = '22-23';
        else if (shoeSize <= 25) fins = '24-25';
        else if (shoeSize <= 27) fins = '26-27';
        else fins = '28-29';

        // ブーツ（5mm単位切り上げ）
        const boots = Math.ceil(shoeSize / 0.5) * 0.5;

        // グローブ
        let gloves = 'M';
        if (height < 150) gloves = 'S';
        else if (height >= 165) gloves = 'L';

        // マスク
        const mask = '正常';

        // ウェットスーツ
        let wetsuit = 'M';
        if (height < 160) wetsuit = 'S';
        else if (height >= 175) wetsuit = 'L';

        return {
            lifeJacket,
            fins,
            boots: String(boots),
            gloves,
            mask,
            wetsuit
        };
    },

    /**
     * LINE会話データ生成（5件）
     */
    generateLineConversations() {
        return [
            {
                id: 'line-001',
                customerName: '田中花子',
                lastMessage: 'ありがとうございました！',
                timestamp: Date.now() - 3600000,
                unread: false,
                messages: [
                    { sender: 'customer', text: '予約したいのですが', timestamp: Date.now() - 7200000 },
                    { sender: 'staff', text: 'ありがとうございます！ご希望の日時を教えてください', timestamp: Date.now() - 7000000 },
                    { sender: 'customer', text: '3月15日の午前中でお願いします', timestamp: Date.now() - 6800000 },
                    { sender: 'staff', text: '承知しました。09:00からでよろしいでしょうか？', timestamp: Date.now() - 6600000 },
                    { sender: 'customer', text: 'はい、お願いします！', timestamp: Date.now() - 6400000 }
                ]
            },
            {
                id: 'line-002',
                customerName: '山田太郎',
                lastMessage: '明日の天気はどうですか？',
                timestamp: Date.now() - 1800000,
                unread: true,
                messages: [
                    { sender: 'customer', text: '明日の予約の件ですが', timestamp: Date.now() - 3600000 },
                    { sender: 'customer', text: '明日の天気はどうですか？', timestamp: Date.now() - 1800000 }
                ]
            },
            {
                id: 'line-003',
                customerName: '佐藤美咲',
                lastMessage: '子供用の器材はありますか？',
                timestamp: Date.now() - 7200000,
                unread: true,
                messages: [
                    { sender: 'customer', text: '6歳の子供も参加できますか？', timestamp: Date.now() - 9000000 },
                    { sender: 'staff', text: 'はい、大丈夫です！6歳からご参加いただけます', timestamp: Date.now() - 8800000 },
                    { sender: 'customer', text: '子供用の器材はありますか？', timestamp: Date.now() - 7200000 }
                ]
            },
            {
                id: 'line-004',
                customerName: '鈴木健太',
                lastMessage: 'キャンセル料はかかりますか？',
                timestamp: Date.now() - 14400000,
                unread: false,
                messages: [
                    { sender: 'customer', text: '予約をキャンセルしたいのですが', timestamp: Date.now() - 18000000 },
                    { sender: 'staff', text: '承知しました。いつのご予約でしょうか？', timestamp: Date.now() - 17800000 },
                    { sender: 'customer', text: 'キャンセル料はかかりますか？', timestamp: Date.now() - 14400000 },
                    { sender: 'staff', text: '前日までのキャンセルは無料です', timestamp: Date.now() - 14200000 }
                ]
            },
            {
                id: 'line-005',
                customerName: '高橋愛',
                lastMessage: '写真データはいただけますか？',
                timestamp: Date.now() - 86400000,
                unread: false,
                messages: [
                    { sender: 'customer', text: '今日はありがとうございました！', timestamp: Date.now() - 90000000 },
                    { sender: 'staff', text: 'こちらこそありがとうございました！楽しんでいただけましたか？', timestamp: Date.now() - 89800000 },
                    { sender: 'customer', text: '写真データはいただけますか？', timestamp: Date.now() - 86400000 },
                    { sender: 'staff', text: 'はい、明日までにLINEでお送りします', timestamp: Date.now() - 86200000 }
                ]
            }
        ];
    },

    /**
     * 顧客データ生成（3件）
     */
    generateCustomers() {
        return [
            {
                id: 'customer-001',
                name: '田中太郎',
                phone: '090-1234-5678',
                email: 'tanaka@example.com',
                totalVisits: 3,
                totalRevenue: 36000,
                lastVisit: '2026-02-20',
                notes: 'リピーター様。次回割引対象'
            },
            {
                id: 'customer-002',
                name: '佐藤花子',
                phone: '090-2345-6789',
                email: 'sato@example.com',
                totalVisits: 1,
                totalRevenue: 12000,
                lastVisit: '2026-03-01',
                notes: '初回利用。お子様連れ'
            },
            {
                id: 'customer-003',
                name: '鈴木一郎',
                phone: '090-3456-7890',
                email: 'suzuki@example.com',
                totalVisits: 5,
                totalRevenue: 60000,
                lastVisit: '2026-03-05',
                notes: 'VIP顧客。優先対応'
            }
        ];
    },

    /**
     * データ取得
     */
    getReservations() {
        return JSON.parse(localStorage.getItem('oceanbook_reservations') || '[]');
    },

    getLineConversations() {
        return JSON.parse(localStorage.getItem('oceanbook_line_conversations') || '[]');
    },

    getCustomers() {
        return JSON.parse(localStorage.getItem('oceanbook_customers') || '[]');
    },

    /**
     * データ保存
     */
    saveReservations(data) {
        localStorage.setItem('oceanbook_reservations', JSON.stringify(data));
        console.log('💾 予約データ保存完了');
    },

    saveLineConversations(data) {
        localStorage.setItem('oceanbook_line_conversations', JSON.stringify(data));
        console.log('💾 LINE会話データ保存完了');
    },

    saveCustomers(data) {
        localStorage.setItem('oceanbook_customers', JSON.stringify(data));
        console.log('💾 顧客データ保存完了');
    },

    /**
     * データリセット
     */
    resetAllData() {
        if (confirm('すべてのデータをリセットしますか？この操作は取り消せません。')) {
            localStorage.clear();
            console.log('🗑️ すべてのデータをリセットしました');
            location.reload();
        }
    }
};

// 初期化実行
DataManager.init();

// グローバルに公開
window.DataManager = DataManager;

console.log('✅ データ管理システム初期化完了');
