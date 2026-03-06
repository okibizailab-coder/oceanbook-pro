// ============================================
// OceanBook Pro - メインアプリケーション（簡易版）
// ============================================

let currentPage = 'dashboard';

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 OceanBook Pro 起動中...');
    
    // 初期化
    setupMobileMenu();
    setupNavigation();
    
    // 天気ウィジェット初期化
    if (typeof WeatherWidget !== 'undefined') {
        WeatherWidget.init();
    }
    
    // ダッシュボード描画
    renderDashboard();
    
    console.log('✅ OceanBook Pro 起動完了！');
});

// ============================================
// モバイルメニュー
// ============================================

function setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (!menuBtn || !sidebar || !overlay) return;
    
    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}

// ============================================
// ナビゲーション
// ============================================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const page = link.dataset.page;
            
            // アクティブクラス切り替え
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            
            const targetPage = document.getElementById(`${page}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
                link.classList.add('active');
            }
            
            // モバイルメニューを閉じる
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    });
}

// ============================================
// ダッシュボード
// ============================================

function renderDashboard() {
    console.log('📊 ダッシュボード描画');
    
    // localStorageからデータ取得
    const reservations = JSON.parse(localStorage.getItem('oceanbook_reservations') || '[]');
    const lineConversations = JSON.parse(localStorage.getItem('oceanbook_line_conversations') || '[]');
    
    // 今日の日付
    const today = new Date().toISOString().split('T')[0];
    const todayDateEl = document.getElementById('today-date');
    if (todayDateEl) todayDateEl.textContent = `（${today}）`;
    
    // KPI計算
    const todayReservations = reservations.filter(r => 
        r.tourDate === today && r.status !== 'キャンセル'
    );
    
    const currentMonth = new Date().getMonth() + 1;
    const monthReservations = reservations.filter(r => {
        const rMonth = new Date(r.tourDate).getMonth() + 1;
        return rMonth === currentMonth && r.status !== 'キャンセル';
    });
    
    const monthRevenue = monthReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const cancelCount = reservations.filter(r => r.status === 'キャンセル').length;
    const cancelRate = reservations.length > 0 ? 
        ((cancelCount / reservations.length) * 100).toFixed(1) : 0;
    const lineUnread = lineConversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    
    // KPI表示（安全にアクセス）
    const kpiTodayEl = document.getElementById('kpi-today-reservations');
    const kpiRevenueEl = document.getElementById('kpi-month-revenue');
    const kpiCancelEl = document.getElementById('kpi-cancel-rate');
    const kpiLineEl = document.getElementById('kpi-line-unread');
    const kpiEquipEl = document.getElementById('kpi-equipment-check');
    
    if (kpiTodayEl) kpiTodayEl.textContent = todayReservations.length;
    if (kpiRevenueEl) kpiRevenueEl.textContent = `¥${monthRevenue.toLocaleString()}`;
    if (kpiCancelEl) kpiCancelEl.textContent = `${cancelRate}%`;
    if (kpiLineEl) kpiLineEl.textContent = lineUnread;
    if (kpiEquipEl) kpiEquipEl.textContent = '75%';
    
    // 今日のスケジュール
    renderTodaySchedule(todayReservations);
    
    // ミニカレンダー
    renderMiniCalendar(reservations);
    
    console.log('✅ ダッシュボード描画完了', {
        todayReservations: todayReservations.length,
        monthRevenue,
        cancelRate,
        lineUnread
    });
}

// ============================================
// 今日のスケジュール
// ============================================

function renderTodaySchedule(todayReservations) {
    const container = document.getElementById('today-schedule');
    if (!container) return;
    
    if (todayReservations.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:#6C757D;">今日の予約はありません</div>';
        return;
    }
    
    container.innerHTML = todayReservations.map(r => {
        const statusClass = r.status === '確定' ? 'confirmed' : 'tentative';
        return `
            <div style="padding:16px; background:#F0F9FF; border-radius:8px; margin-bottom:12px; border-left:4px solid #0A9396;">
                <h4 style="margin-bottom:8px;">${r.time} ${r.customerName}様グループ</h4>
                <p style="font-size:14px; color:#6C757D;">${r.participants.length}名 / ${r.tourType} / <span class="status-badge ${statusClass}">${r.status}</span></p>
            </div>
        `;
    }).join('');
}

// ============================================
// ミニカレンダー
// ============================================

function renderMiniCalendar(reservations) {
    const container = document.getElementById('mini-calendar');
    if (!container) return;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let html = `
        <div style="text-align:center; font-weight:600; padding:12px; background:#0A9396; color:white; border-radius:8px; margin-bottom:12px;">
            ${year}年 ${month + 1}月
        </div>
        <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; text-align:center;">
            <div style="font-weight:600; color:#DC3545;">日</div>
            <div style="font-weight:600;">月</div>
            <div style="font-weight:600;">火</div>
            <div style="font-weight:600;">水</div>
            <div style="font-weight:600;">木</div>
            <div style="font-weight:600;">金</div>
            <div style="font-weight:600; color:#0A9396;">土</div>
    `;
    
    // 空白セル
    for (let i = 0; i < firstDay; i++) {
        html += '<div></div>';
    }
    
    // 日付セル
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayReservations = reservations.filter(r => r.tourDate === dateStr && r.status !== 'キャンセル');
        const count = dayReservations.length;
        
        const isToday = (day === today.getDate() && month === today.getMonth() && year === today.getFullYear());
        
        html += `
            <div style="padding:8px; ${isToday ? 'background:#0A9396; color:white;' : ''} border-radius:6px; cursor:pointer;">
                ${day}
                ${count > 0 ? `<div style="font-size:10px; color:#0A9396;">${count}件</div>` : ''}
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// ============================================
// データ読み込み
// ============================================

function loadReservations() {
    return JSON.parse(localStorage.getItem('oceanbook_reservations') || '[]');
}

function loadCustomers() {
    return JSON.parse(localStorage.getItem('oceanbook_customers') || '[]');
}

function loadLineConversations() {
    return JSON.parse(localStorage.getItem('oceanbook_line_conversations') || '[]');
}

console.log('✅ app.js 読み込み完了');
