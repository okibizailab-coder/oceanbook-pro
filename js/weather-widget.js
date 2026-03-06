// ===================================
// OceanBook Pro - Weather Widget
// 天気・海況ウィジェット表示制御
// バージョン: v20.0
// 最終更新: 2026-03-06
// ===================================

const WeatherWidget = {
    /**
     * ウィジェット初期化
     */
    init() {
        console.log('🌤️ Weather Widget: 初期化開始');
        
        this.loadData();

        // 1時間ごとに自動更新
        setInterval(() => {
            console.log('🔄 Weather Widget: 自動更新');
            this.loadData();
        }, 3600000); // 1時間 = 3,600,000ミリ秒
    },

    /**
     * データ読み込み
     */
    async loadData() {
        const loadingElement = document.getElementById('weather-widget-loading');
        const contentElement = document.getElementById('weather-widget-content');

        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
        if (contentElement) {
            contentElement.style.display = 'none';
        }

        try {
            console.log('📡 Weather Widget: データ取得中...');
            const data = await WeatherAPI.getAllData();
            
            console.log('✅ Weather Widget: データ取得成功', data);
            this.render(data);

        } catch (error) {
            console.error('❌ Weather Widget: データ取得失敗', error);
            this.renderError();
        } finally {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }
    },

    /**
     * ウィジェットを描画
     */
    render(data) {
        const contentElement = document.getElementById('weather-widget-content');
        
        if (!contentElement) {
            console.error('❌ Weather Widget: #weather-widget-content が見つかりません');
            return;
        }

        const { current, tide, wave } = data;

        const html = `
            <div class="weather-widget-title">
                🌊 今日の海況・天気（糸満市大度浜海岸）
            </div>

            <!-- 潮汐情報 -->
            <div class="tide-section">
                <div class="tide-info">
                    <div class="tide-item">
                        <div class="tide-label">満潮</div>
                        <div class="tide-time">${tide.highTide[0].time}</div>
                    </div>
                    <div class="tide-item">
                        <div class="tide-label">干潮</div>
                        <div class="tide-time">${tide.lowTide[0].time}</div>
                    </div>
                    <div class="tide-item">
                        <div class="tide-label">満潮</div>
                        <div class="tide-time">${tide.highTide[1].time}</div>
                    </div>
                    <div class="tide-item">
                        <div class="tide-label">干潮</div>
                        <div class="tide-time">${tide.lowTide[1].time}</div>
                    </div>
                </div>
                <div class="sun-info">
                    <div class="sun-item">
                        🌅 日の出 <strong>${tide.sunrise}</strong>
                    </div>
                    <div class="sun-item">
                        🌇 日の入り <strong>${tide.sunset}</strong>
                    </div>
                </div>
            </div>

            <!-- 現在の天気 -->
            <div class="current-weather">
                <div class="weather-icon">${current.icon}</div>
                <div class="temperature">${current.temperature}°C</div>
                <div class="weather-description">${current.description}</div>
            </div>

            <!-- 詳細情報 -->
            <div class="weather-details">
                <div class="weather-detail-item">
                    <div class="detail-label">波高</div>
                    <div class="detail-value">${(wave.waveHeight / 100).toFixed(1)} m</div>
                </div>
                <div class="weather-detail-item">
                    <div class="detail-label">降水量</div>
                    <div class="detail-value">${current.rain} mm</div>
                </div>
                <div class="weather-detail-item">
                    <div class="detail-label">風</div>
                    <div class="detail-value">${current.wind.direction} ${current.wind.speed} m/s</div>
                </div>
            </div>

            <!-- アクションボタン -->
            <div class="weather-actions">
                <button class="btn btn-primary" onclick="WeatherWidget.showForecast()">
                    📅 7日間予報を見る
                </button>
                <button class="btn btn-secondary" onclick="WeatherWidget.refresh()">
                    🔄 更新
                </button>
            </div>

            <!-- 最終更新時刻 -->
            <div class="last-update">
                最終更新: ${data.lastUpdated}
            </div>
        `;

        contentElement.innerHTML = html;
        contentElement.style.display = 'block';
        
        console.log('✅ Weather Widget: 描画完了');
    },

    /**
     * エラー表示
     */
    renderError() {
        const contentElement = document.getElementById('weather-widget-content');
        
        if (!contentElement) return;

        const html = `
            <div class="weather-widget-error">
                <p>⚠️ 天気データの取得に失敗しました</p>
                <button class="btn btn-primary" onclick="WeatherWidget.refresh()">
                    再読み込み
                </button>
            </div>
        `;

        contentElement.innerHTML = html;
        contentElement.style.display = 'block';
    },

    /**
     * 週間予報を表示
     */
    async showForecast() {
        console.log('📅 Weather Widget: 週間予報表示');

        try {
            const forecast = await WeatherAPI.getForecast();

            // モーダルを作成
            const modal = document.createElement('div');
            modal.className = 'forecast-modal active';
            modal.id = 'forecast-modal';

            let forecastHTML = '';
            forecast.forEach((day, index) => {
                const date = new Date(day.date);
                const dateStr = `${date.getMonth() + 1}/${date.getDate()}（${this.getDayOfWeek(date)}）`;
                
                forecastHTML += `
                    <div class="forecast-day">
                        <div class="forecast-date">${dateStr}</div>
                        <div class="forecast-weather">
                            <span style="font-size: 32px;">${day.icon}</span>
                            <div>${day.weather}</div>
                        </div>
                    </div>
                `;
            });

            modal.innerHTML = `
                <div class="forecast-modal-content">
                    <div class="forecast-modal-header">
                        <h2 class="forecast-modal-title">📅 7日間の天気予報</h2>
                        <button class="forecast-close" onclick="WeatherWidget.closeForecast()">×</button>
                    </div>
                    <div class="forecast-list">
                        ${forecastHTML}
                    </div>
                    <p style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
                        ※ 気象庁予報APIによる沖縄本島地方の予報です
                    </p>
                </div>
            `;

            document.body.appendChild(modal);

            // モーダル外クリックで閉じる
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeForecast();
                }
            });

        } catch (error) {
            console.error('❌ Forecast: 表示失敗', error);
            alert('週間予報の取得に失敗しました');
        }
    },

    /**
     * 週間予報モーダルを閉じる
     */
    closeForecast() {
        const modal = document.getElementById('forecast-modal');
        if (modal) {
            modal.remove();
        }
    },

    /**
     * 手動更新
     */
    async refresh() {
        console.log('🔄 Weather Widget: 手動更新開始');
        
        // キャッシュをクリア
        WeatherAPI.clearCache();
        
        // データ再取得
        await this.loadData();
        
        // 通知表示
        this.showNotification('✅ 天気情報を更新しました');
    },

    /**
     * 通知表示
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    /**
     * 曜日を取得
     */
    getDayOfWeek(date) {
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        return days[date.getDay()];
    }
};

// グローバルに公開
window.WeatherWidget = WeatherWidget;

// アニメーション用CSS（動的追加）
if (!document.getElementById('weather-widget-animations')) {
    const style = document.createElement('style');
    style.id = 'weather-widget-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
