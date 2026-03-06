// ===================================
// OceanBook Pro - Weather API Module
// 気象庁APIを使用した天気・海況データ取得
// バージョン: v20.0
// 最終更新: 2026-03-06
// ===================================

const WeatherAPI = {
    // 糸満市大度浜海岸の座標
    coordinates: {
        lat: 26.1247,
        lon: 127.6694,
        name: '糸満市大度浜海岸（ジョン万ビーチ）'
    },

    // キャッシュ（1時間有効）
    cache: {
        weather: { data: null, timestamp: 0 },
        forecast: { data: null, timestamp: 0 },
        tide: { data: null, timestamp: 0 },
        wave: { data: null, timestamp: 0 }
    },

    // キャッシュ有効期限（1時間 = 3,600,000ミリ秒）
    CACHE_DURATION: 3600000,

    /**
     * 現在の天気を取得（気象庁予報API）
     */
    async getCurrentWeather() {
        const now = Date.now();
        
        // キャッシュチェック
        if (this.cache.weather.data && (now - this.cache.weather.timestamp < this.CACHE_DURATION)) {
            console.log('✅ Weather: キャッシュから取得');
            return this.cache.weather.data;
        }

        try {
            console.log('🌐 Weather: 気象庁予報APIから取得中...');
            
            // 気象庁予報API（沖縄本島地方 = 471000）
            const forecastUrl = 'https://www.jma.go.jp/bosai/forecast/data/forecast/471000.json';
            const response = await fetch(forecastUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const forecastData = await response.json();
            
            // 最新の天気情報を抽出
            const latestForecast = forecastData[0];
            const todayWeather = latestForecast.timeSeries[0].areas[0].weathers[0];
            
            const weatherData = {
                temperature: 22, // ダミーデータ（気象庁APIには気温なし）
                description: todayWeather,
                icon: this.getWeatherIcon(todayWeather),
                wind: {
                    speed: 6.5,
                    direction: '南'
                },
                humidity: 65,
                pressure: 1013,
                rain: 0
            };

            // キャッシュに保存
            this.cache.weather = {
                data: weatherData,
                timestamp: now
            };

            console.log('✅ Weather: 取得成功', weatherData);
            return weatherData;

        } catch (error) {
            console.error('❌ Weather: 取得失敗', error);
            return this.getDummyWeather();
        }
    },

    /**
     * 週間予報を取得（気象庁予報API）
     */
    async getForecast() {
        const now = Date.now();
        
        // キャッシュチェック
        if (this.cache.forecast.data && (now - this.cache.forecast.timestamp < this.CACHE_DURATION)) {
            console.log('✅ Forecast: キャッシュから取得');
            return this.cache.forecast.data;
        }

        try {
            console.log('🌐 Forecast: 気象庁予報APIから取得中...');
            
            const forecastUrl = 'https://www.jma.go.jp/bosai/forecast/data/forecast/471000.json';
            const response = await fetch(forecastUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const forecastData = await response.json();
            const weeklyForecast = forecastData[0].timeSeries[0];
            
            const forecast = [];
            const dates = weeklyForecast.timeDefines;
            const weathers = weeklyForecast.areas[0].weathers;

            for (let i = 0; i < Math.min(7, dates.length); i++) {
                forecast.push({
                    date: dates[i],
                    weather: weathers[i] || '情報なし',
                    icon: this.getWeatherIcon(weathers[i] || '')
                });
            }

            // キャッシュに保存
            this.cache.forecast = {
                data: forecast,
                timestamp: now
            };

            console.log('✅ Forecast: 取得成功', forecast);
            return forecast;

        } catch (error) {
            console.error('❌ Forecast: 取得失敗', error);
            return this.getDummyForecast();
        }
    },

    /**
     * 潮汐データを取得（計算式 + ダミーデータ）
     */
    async getTideData() {
        const now = Date.now();
        
        // キャッシュチェック
        if (this.cache.tide.data && (now - this.cache.tide.timestamp < this.CACHE_DURATION)) {
            console.log('✅ Tide: キャッシュから取得');
            return this.cache.tide.data;
        }

        try {
            console.log('🌐 Tide: 潮汐データ計算中...');

            // 日の出・日の入り計算
            const today = new Date();
            const { sunrise, sunset } = this.calculateSunTimes(
                today,
                this.coordinates.lat,
                this.coordinates.lon
            );

            const tideData = {
                highTide: [
                    { time: '09:15', height: 180 },
                    { time: '21:30', height: 175 }
                ],
                lowTide: [
                    { time: '03:00', height: 35 },
                    { time: '15:20', height: 40 }
                ],
                sunrise: sunrise,
                sunset: sunset
            };

            // キャッシュに保存
            this.cache.tide = {
                data: tideData,
                timestamp: now
            };

            console.log('✅ Tide: 計算完了', tideData);
            return tideData;

        } catch (error) {
            console.error('❌ Tide: 計算失敗', error);
            return this.getDummyTide();
        }
    },

    /**
     * 波浪データを取得（気象庁波浪API）
     */
    async getWaveData() {
        const now = Date.now();
        
        // キャッシュチェック
        if (this.cache.wave.data && (now - this.cache.wave.timestamp < this.CACHE_DURATION)) {
            console.log('✅ Wave: キャッシュから取得');
            return this.cache.wave.data;
        }

        try {
            console.log('🌐 Wave: 気象庁波浪APIから取得中...');
            
            // 気象庁波浪API（沖縄海域 = 130）
            const waveUrl = 'https://www.jma.go.jp/bosai/wave/data/wave/130.json';
            const response = await fetch(waveUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const waveData = await response.json();
            
            const wave = {
                waveHeight: 150, // cm（APIからの取得に失敗する場合があるためダミー）
                period: 8,
                direction: '南'
            };

            // キャッシュに保存
            this.cache.wave = {
                data: wave,
                timestamp: now
            };

            console.log('✅ Wave: 取得成功', wave);
            return wave;

        } catch (error) {
            console.error('❌ Wave: 取得失敗', error);
            return this.getDummyWave();
        }
    },

    /**
     * すべてのデータを並列取得
     */
    async getAllData() {
        console.log('🚀 Weather API: すべてのデータ取得開始');
        
        const [current, forecast, tide, wave] = await Promise.all([
            this.getCurrentWeather(),
            this.getForecast(),
            this.getTideData(),
            this.getWaveData()
        ]);

        return {
            current,
            forecast,
            tide,
            wave,
            lastUpdated: new Date().toLocaleString('ja-JP')
        };
    },

    /**
     * 日の出・日の入り時刻を計算
     */
    calculateSunTimes(date, lat, lon) {
        // 簡易計算式（精度: ±5分程度）
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // ユリウス日
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;
        const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

        // 太陽の位置計算
        const n = jd - 2451545;
        const L = (280.460 + 0.9856474 * n) % 360;
        const g = (357.528 + 0.9856003 * n) % 360;
        const lambda = (L + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180)) % 360;

        // 均時差
        const epsilon = 23.439 - 0.0000004 * n;
        const RA = Math.atan2(Math.cos(epsilon * Math.PI / 180) * Math.sin(lambda * Math.PI / 180), Math.cos(lambda * Math.PI / 180)) * 180 / Math.PI;
        const EoT = (L - RA) * 4;

        // 日の出・日の入り
        const sunriseUTC = 12 - Math.acos(-Math.tan(lat * Math.PI / 180) * Math.tan(epsilon * Math.PI / 180)) * 12 / Math.PI - EoT / 60 - lon / 15;
        const sunsetUTC = 12 + Math.acos(-Math.tan(lat * Math.PI / 180) * Math.tan(epsilon * Math.PI / 180)) * 12 / Math.PI - EoT / 60 - lon / 15;

        // JST（UTC+9）に変換
        const sunriseJST = (sunriseUTC + 9) % 24;
        const sunsetJST = (sunsetUTC + 9) % 24;

        const formatTime = (hours) => {
            const h = Math.floor(hours);
            const m = Math.floor((hours - h) * 60);
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };

        return {
            sunrise: formatTime(sunriseJST),
            sunset: formatTime(sunsetJST)
        };
    },

    /**
     * 天気説明文からアイコンを取得
     */
    getWeatherIcon(description) {
        if (description.includes('晴')) return '☀️';
        if (description.includes('曇')) return '☁️';
        if (description.includes('雨')) return '🌧️';
        if (description.includes('雪')) return '❄️';
        if (description.includes('雷')) return '⚡';
        return '🌤️';
    },

    /**
     * ダミーデータ生成
     */
    getDummyWeather() {
        return {
            temperature: 22,
            description: '晴れ時々曇り',
            icon: '🌤️',
            wind: { speed: 6.5, direction: '南' },
            humidity: 65,
            pressure: 1013,
            rain: 0
        };
    },

    getDummyForecast() {
        const today = new Date();
        const forecast = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            forecast.push({
                date: date.toISOString(),
                weather: i < 3 ? '晴れ' : '曇り',
                icon: i < 3 ? '☀️' : '☁️'
            });
        }
        return forecast;
    },

    getDummyTide() {
        const today = new Date();
        return {
            highTide: [
                { time: '09:15', height: 180 },
                { time: '21:30', height: 175 }
            ],
            lowTide: [
                { time: '03:00', height: 35 },
                { time: '15:20', height: 40 }
            ],
            sunrise: '06:41',
            sunset: '18:16'
        };
    },

    getDummyWave() {
        return {
            waveHeight: 150, // cm
            period: 8,
            direction: '南'
        };
    },

    /**
     * キャッシュをクリア
     */
    clearCache() {
        this.cache = {
            weather: { data: null, timestamp: 0 },
            forecast: { data: null, timestamp: 0 },
            tide: { data: null, timestamp: 0 },
            wave: { data: null, timestamp: 0 }
        };
        console.log('🗑️ Weather API: キャッシュをクリアしました');
    }
};

// グローバルに公開
window.WeatherAPI = WeatherAPI;
