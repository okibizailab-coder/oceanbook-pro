// ===================================
// OceanBook Pro - Main Application
// メインアプリケーション制御
// バージョン: v20.0
// 最終更新: 2026-03-06
// ===================================

// 現在のページ
let currentPage = 'dashboard';

// アプリケーション起動
console.log('🚀 OceanBook Pro v20.0 起動中...');

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM読み込み完了');

    // 各システムを初期化
    setupMobileMenu();
    setupNavigation();
    renderDashboard();
    
    // 天気ウィジェット初期化（v20.0 新機能）
    if (typeof WeatherWidget !== 'undefined') {
        WeatherWidget.init();
    }

    renderReservationsPage();
    renderEquipmentPage();
    setupEventListeners();

    console.log('✅ OceanBook Pro 起動完了');
});

/**
 * モバイルメニュー設定
 */
function setupMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (!menuBtn || !sidebar) return;

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        if (overlay) {
            overlay.classList.toggle('active');
        }
    });

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

/**
 * ナビゲーション設定
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // アクティブクラスを切り替え
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // ページIDを取得
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
            
            // モバイルメニューを閉じる
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    });
}

/**
 * ページ表示切り替え
 */
function showPage(pageId) {
    console.log(`📄 ページ切り替え: ${pageId}`);
    
    // すべてのページを非表示
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // 指定ページを表示
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
    }
}

/**
 * ダッシュボード描画
 */
function renderDashboard() {
    console.log('📊 Dashboard: 描画開始');
    
    // KPIカード更新
    updateKPICards();
    
    // 今日のスケジュール更新
    updateTodaySchedule();
    
    // ミニカレンダー初期化
    initMiniCalendar();
}

/**
 * KPIカード更新
 */
function updateKPICards() {
    // localStorageからデータ取得
    const reservations = JSON.parse(localStorage.getItem('oceanbook_reservations') || '[]');
    
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // 今日の予約数
    const todayReservations = reservations.filter(r => r.date === today && r.status === 'confirmed').length;
    document.getElementById('today-reservations').textContent = todayReservations;
    
    // 今月の売上（仮：1予約 = 12,000円）
    const monthReservations = reservations.filter(r => r.date.startsWith(currentMonth) && r.status === 'confirmed');
    const monthRevenue = monthReservations.length * 12000;
    document.getElementById('month-revenue').textContent = (monthRevenue / 10000).toFixed(1);
    
    // キャンセル率
    const totalReservations = reservations.length;
    const cancelledReservations = reservations.filter(r => r.status === 'cancelled').length;
    const cancelRate = totalReservations > 0 ? (cancelledReservations / totalReservations * 100).toFixed(1) : 0;
    document.getElementById('cancel-rate').textContent = cancelRate;
    
    // LINE未読数
    const lineConversations = JSON.parse(localStorage.getItem('oceanbook_line_conversations') || '[]');
    const unreadCount = lineConversations.filter(c => c.unread).length;
    document.getElementById('line-unread').textContent = unreadCount;
    
    console.log('✅ KPI更新完了', { todayReservations, monthRevenue, cancelRate, unreadCount });
}

/**
 * 今日のスケジュール更新
 */
function updateTodaySchedule() {
    const reservations = JSON.parse(localStorage.getItem('oceanbook_reservations') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    const todayReservations = reservations
        .filter(r => r.date === today && r.status === 'confirmed')
        .sort((a, b) => a.time.localeCompare(b.time));
    
    const scheduleContainer = document.getElementById('today-schedule');
    if (!scheduleContainer) return;
    
    if (todayReservations.length === 0) {
        scheduleContainer.innerHTML = '<p style="text-align: center; color: #7f8c8d;">今日の予約はありません</p>';
        return;
    }
    
    let html = '<div class="schedule-list">';
    todayReservations.forEach(reservation => {
        html += `
            <div class="schedule-item" style="padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${reservation.time}</strong> - ${reservation.customerName}
                        <span style="color: #7f8c8d; font-size: 14px; margin-left: 8px;">
                            👥 ${reservation.participants}名 | 🧑‍🤝‍🧑 ${reservation.guide || '未割当'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    scheduleContainer.innerHTML = html;
}

/**
 * ミニカレンダー初期化
 */
function initMiniCalendar() {
    const calendarContainer = document.getElementById('mini-calendar');
    if (!calendarContainer) return;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    renderMiniCalendar(year, month);
}

/**
 * ミニカレンダー描画
 */
function renderMiniCalendar(year, month) {
    const calendarContainer = document.getElementById('mini-calendar');
    if (!calendarContainer) return;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    let html = `
        <div class="calendar-header">
            <button class="calendar-nav-btn" onclick="changeMiniCalendarMonth(-1)">◀</button>
            <span style="font-weight: 600;">${year}年 ${month + 1}月</span>
            <button class="calendar-nav-btn" onclick="changeMiniCalendarMonth(1)">▶</button>
        </div>
        <div class="calendar-grid">
            <div style="color: #e74c3c; font-weight: 600;">日</div>
            <div style="font-weight: 600;">月</div>
            <div style="font-weight: 600;">火</div>
            <div style="font-weight: 600;">水</div>
            <div style="font-weight: 600;">木</div>
            <div style="font-weight: 600;">金</div>
            <div style="color: #3498db; font-weight: 600;">土</div>
    `;
    
    // 空白セル
    for (let i = 0; i < firstDay; i++) {
        html += '<div></div>';
    }
    
    // 日付セル
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const isToday = currentDate.toDateString() === today.toDateString();
        const dateStr = currentDate.toISOString().split('T')[0];
        
        const reservations = JSON.parse(localStorage.getItem('oceanbook_reservations') || '[]');
        const dayReservations = reservations.filter(r => r.date === dateStr && r.status === 'confirmed').length;
        
        let className = 'calendar-day';
        if (isToday) className += ' today';
        
        html += `
            <div class="${className}" title="${dayReservations}件の予約">
                ${day}
                ${dayReservations > 0 ? `<div style="font-size: 10px; color: #3498db;">●</div>` : ''}
            </div>
        `;
    }
    
    html += '</div>';
    calendarContainer.innerHTML = html;
}

/**
 * カレンダー月変更
 */
let currentCalendarYear = new Date().getFullYear();
let currentCalendarMonth = new Date().getMonth();

function changeMiniCalendarMonth(delta) {
    currentCalendarMonth += delta;
    
    if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    } else if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    }
    
    renderMiniCalendar(currentCalendarYear, currentCalendarMonth);
}

/**
 * 予約ページ描画
 */
function renderReservationsPage() {
    const reservations = JSON.parse(localStorage.getItem('oceanbook_reservations') || '[]');
    const tbody = document.querySelector('#reservations-page tbody');
    
    if (!tbody) return;
    
    if (reservations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">予約データがありません</td></tr>';
        return;
    }
    
    let html = '';
    reservations.forEach(reservation => {
        const statusClass = `status-${reservation.status}`;
        const statusText = {
            'confirmed': '確定',
            'pending': '仮予約',
            'cancelled': 'キャンセル'
        }[reservation.status] || reservation.status;
        
        html += `
            <tr>
                <td>${reservation.id}</td>
                <td>${reservation.date}</td>
                <td>${reservation.time}</td>
                <td>${reservation.customerName}</td>
                <td>${reservation.participants}名</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="viewReservation('${reservation.id}')">詳細</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

/**
 * 器材ページ描画
 */
function renderEquipmentPage() {
    const reservations = JSON.parse(localStorage.getItem('oceanbook_reservations') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    const todayReservations = reservations.filter(r => r.date === today && r.status === 'confirmed');
    
    const container = document.getElementById('equipment-list');
    if (!container) return;
    
    if (todayReservations.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">今日の予約はありません</p>';
        return;
    }
    
    let html = '<div class="equipment-table">';
    html += '<h3>🎽 今日の器材準備リスト</h3>';
    
    todayReservations.forEach(reservation => {
        html += `<h4>${reservation.time} - ${reservation.customerName}（${reservation.participants}名）</h4>`;
        html += '<table><thead><tr><th>名前</th><th>ライフJK</th><th>フィン</th><th>ブーツ</th><th>グローブ</th><th>マスク</th></tr></thead><tbody>';
        
        if (reservation.participantDetails) {
            reservation.participantDetails.forEach(p => {
                const eq = p.equipment || {};
                html += `
                    <tr>
                        <td>${p.name}</td>
                        <td>${eq.lifeJacket || '-'}</td>
                        <td>${eq.fins || '-'}</td>
                        <td>${eq.boots || '-'}</td>
                        <td>${eq.gloves || '-'}</td>
                        <td>${eq.mask || '-'}</td>
                    </tr>
                `;
            });
        }
        
        html += '</tbody></table>';
    });
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * イベントリスナー設定
 */
function setupEventListeners() {
    // 新規予約ボタン
    const newReservationBtn = document.getElementById('new-reservation-btn');
    if (newReservationBtn) {
        newReservationBtn.addEventListener('click', () => {
            console.log('➕ 新規予約モーダル表示');
            // モーダル表示処理（実装済みと仮定）
        });
    }
}

/**
 * 予約詳細表示
 */
function viewReservation(id) {
    console.log(`📋 予約詳細表示: ${id}`);
    // 詳細モーダル表示処理（実装済みと仮定）
}

// グローバル関数として公開
window.showPage = showPage;
window.changeMiniCalendarMonth = changeMiniCalendarMonth;
window.viewReservation = viewReservation;
window.renderDashboard = renderDashboard;
window.renderReservationsPage = renderReservationsPage;
window.renderEquipmentPage = renderEquipmentPage;
