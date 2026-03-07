// ============================================
// OceanBook Pro - メインアプリケーションロジック
// バージョン: v2.0
// 最終更新: 2026-03-07
// ============================================

// 現在のページ
let currentPage = 'dashboard';
let participantCount = 1;

// ============================================
// ページ初期化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 OceanBook Pro 起動中...');
    
    // データ初期化確認
    if (typeof DataManager !== 'undefined') {
        DataManager.init();
    }
    
    // モバイルメニュー設定
    setupMobileMenu();
    
    // ナビゲーション設定
    setupNavigation();
    
    // ダッシュボード初期化
    renderDashboard();
    
    // 天気・海況ウィジェット初期化
    if (typeof WeatherWidget !== 'undefined') {
        WeatherWidget.init();
    }
    
    // 予約管理ページ設定
    setupReservationsPage();
    
    // 顧客管理ページ設定
    setupCustomersPage();
    
    // 器材準備リスト設定
    setupEquipmentPage();
    
    // 各ページのイベントリスナー
    setupEventListeners();
    
    console.log('✅ OceanBook Pro 起動完了！');
});

// ============================================
// モバイルメニュー
// ============================================

function setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (!menuBtn || !sidebar || !overlay) return;
    
    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.innerWidth <= 768 && sidebarClose) {
            sidebarClose.style.display = 'block';
        }
    });
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeMobileMenu);
    }
    
    overlay.addEventListener('click', closeMobileMenu);
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            if (sidebarClose) {
                sidebarClose.style.display = 'none';
            }
        }
    });
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebarClose = document.getElementById('sidebar-close');
    
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (sidebarClose) sidebarClose.style.display = 'none';
}

// ============================================
// ナビゲーション
// ============================================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                navigateToPage(page);
            }
        });
    });
}

function navigateToPage(page) {
    // すべてのページを非表示
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // すべてのナビリンクから active を削除
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    // 選択されたページを表示
    const pageElement = document.getElementById(`${page}-page`);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
    // 選択されたナビリンクに active を追加
    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    currentPage = page;
    
    // モバイルメニューを閉じる
    if (window.innerWidth <= 768) {
        closeMobileMenu();
    }
    
    // ページ固有の初期化
    switch(page) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'reservations':
            renderReservationsTable();
            break;
        case 'line':
            if (typeof LINEModule !== 'undefined') {
                LINEModule.renderConversations();
            }
            break;
        case 'customers':
            if (typeof CustomersModule !== 'undefined') {
                CustomersModule.renderCustomersTable();
            }
            break;
        case 'equipment':
            renderEquipmentList();
            break;
        case 'team':
            console.log('チーム分けページ表示');
            break;
        case 'analytics':
            console.log('分析ページ表示');
            break;
    }
}

// グローバル関数として公開
window.showPage = navigateToPage;

// ============================================
// ダッシュボード
// ============================================

function renderDashboard() {
    console.log('📊 ダッシュボード描画');
    
    updateKPICards();
    renderTodaySchedule();
    renderMiniCalendar();
    
    console.log('✅ ダッシュボード描画完了');
}

function updateKPICards() {
    const reservations = loadReservations();
    const conversations = loadLineConversations();
    const today = new Date().toISOString().split('T')[0];
    
    // 今日の予約数
    const todayReservations = reservations.filter(r => 
        r.tourDate === today && r.status !== 'キャンセル'
    );
    
    // 今月の売上
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const monthReservations = reservations.filter(r => {
        const date = new Date(r.tourDate);
        return date.getMonth() + 1 === currentMonth && 
               date.getFullYear() === currentYear && 
               r.status !== 'キャンセル';
    });
    const monthRevenue = monthReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    
    // キャンセル率
    const canceledReservations = reservations.filter(r => r.status === 'キャンセル');
    const cancelRate = reservations.length > 0 
        ? ((canceledReservations.length / reservations.length) * 100).toFixed(1) 
        : 0;
    
    // LINE未読数
    const lineUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    
    // DOM更新
    const kpiTodayEl = document.getElementById('kpi-today-reservations');
    const kpiRevenueEl = document.getElementById('kpi-month-revenue');
    const kpiCancelEl = document.getElementById('kpi-cancel-rate');
    const kpiLineEl = document.getElementById('kpi-line-unread');
    
    if (kpiTodayEl) kpiTodayEl.textContent = todayReservations.length;
    if (kpiRevenueEl) {
        kpiRevenueEl.textContent = `¥${monthRevenue.toLocaleString()}`;
        // 長い数値の場合はフォントサイズを調整
        if (monthRevenue >= 10000000) {
            kpiRevenueEl.setAttribute('data-length', 'very-long');
        } else if (monthRevenue >= 1000000) {
            kpiRevenueEl.setAttribute('data-length', 'long');
        }
    }
    if (kpiCancelEl) kpiCancelEl.textContent = `${cancelRate}%`;
    if (kpiLineEl) kpiLineEl.textContent = lineUnread;
}

function renderTodaySchedule() {
    const scheduleContainer = document.getElementById('today-schedule');
    if (!scheduleContainer) return;
    
    const reservations = loadReservations();
    const today = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => 
        r.tourDate === today && r.status !== 'キャンセル'
    );
    
    if (todayReservations.length === 0) {
        scheduleContainer.innerHTML = '<div class="empty-state"><p>本日の予約はありません</p></div>';
        return;
    }
    
    scheduleContainer.innerHTML = `
        <div class="schedule-grid">
            ${todayReservations.map(r => `
                <div class="schedule-card">
                    <div class="schedule-info">
                        <h4>${r.time} ${r.customerName}様</h4>
                        <p>参加者: ${r.participants?.length || 0}名 | ${r.tourType}</p>
                    </div>
                    <div class="schedule-actions">
                        <button class="btn btn-secondary" onclick="viewReservationDetail('${r.id}')">詳細</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderMiniCalendar() {
    const calendarContainer = document.getElementById('mini-calendar');
    if (!calendarContainer) return;
    
    const reservations = loadReservations();
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    let html = `
        <div class="calendar-header">
            <button class="calendar-nav-btn" onclick="changeCalendarMonth(-1)">◀</button>
            <span class="calendar-month-label">${year}年${month + 1}月</span>
            <button class="calendar-nav-btn" onclick="changeCalendarMonth(1)">▶</button>
        </div>
    `;
    
    // 曜日ヘッダー
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    weekdays.forEach(day => {
        html += `<div style="text-align:center; font-weight:600; padding:8px; font-size:12px;">${day}</div>`;
    });
    
    // 空白セル
    for (let i = 0; i < startDayOfWeek; i++) {
        html += '<div></div>';
    }
    
    // 日付セル
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayReservations = reservations.filter(r => r.tourDate === dateStr && r.status !== 'キャンセル');
        const isToday = dateStr === new Date().toISOString().split('T')[0];
        const holidayName = typeof getJapaneseHoliday !== 'undefined' ? getJapaneseHoliday(dateStr) : null;
        
        let classes = ['calendar-cell'];
        if (isToday) classes.push('today');
        if (holidayName) classes.push('holiday');
        if (dayReservations.length > 0) classes.push('has-reservations');
        
        html += `
            <div class="${classes.join(' ')}" onclick="showDateDetail('${dateStr}')">
                <div class="date">${day}</div>
                ${dayReservations.length > 0 ? `<div class="count">${dayReservations.length}件</div>` : ''}
            </div>
        `;
    }
    
    calendarContainer.innerHTML = html;
}

function changeCalendarMonth(direction) {
    // カレンダー月変更機能（実装省略）
    console.log('カレンダー月変更:', direction);
}

window.changeCalendarMonth = changeCalendarMonth;

// ============================================
// 予約管理
// ============================================

function setupReservationsPage() {
    const addBtn = document.getElementById('add-reservation-btn');
    if (addBtn) {
        addBtn.addEventListener('click', openNewReservationModal);
    }
    
    const searchInput = document.getElementById('reservation-search');
    const statusFilter = document.getElementById('status-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', renderReservationsTable);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', renderReservationsTable);
    }
}

function renderReservationsTable() {
    let reservations = loadReservations();
    
    // フィルター適用
    const searchQuery = document.getElementById('reservation-search')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    
    if (searchQuery) {
        reservations = reservations.filter(r => 
            r.id.toLowerCase().includes(searchQuery) ||
            r.customerName.toLowerCase().includes(searchQuery)
        );
    }
    
    if (statusFilter) {
        reservations = reservations.filter(r => r.status === statusFilter);
    }
    
    const tbody = document.getElementById('reservations-tbody');
    if (!tbody) return;
    
    if (reservations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:40px;">予約が見つかりません</td></tr>';
        return;
    }
    
    tbody.innerHTML = reservations.map(r => {
        const statusClass = r.status === '確定' ? 'confirmed' :
                           r.status === '仮予約' ? 'tentative' :
                           r.status === 'キャンセル' ? 'cancelled' : 'completed';
        
        return `
            <tr onclick="viewReservationDetail('${r.id}')" style="cursor:pointer;">
                <td>${r.id}</td>
                <td>${r.createdAt ? new Date(r.createdAt).toLocaleDateString('ja-JP') : '-'}</td>
                <td>${r.tourDate}</td>
                <td>${r.time}</td>
                <td>${r.tourType}</td>
                <td>${r.customerName}</td>
                <td>${r.participants?.length || 0}名</td>
                <td>¥${(r.totalAmount || 0).toLocaleString()}</td>
                <td><span class="status-badge ${statusClass}">${r.status}</span></td>
                <td>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); viewReservationDetail('${r.id}')">詳細</button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewReservationDetail(reservationId) {
    const reservations = loadReservations();
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
        alert('予約が見つかりません');
        return;
    }
    
    const modal = document.getElementById('reservation-detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('reservation-detail-body');
    
    if (!modal || !modalBody) return;
    
    const statusClass = reservation.status === '確定' ? 'confirmed' :
                       reservation.status === '仮予約' ? 'tentative' :
                       reservation.status === 'キャンセル' ? 'cancelled' : 'completed';
    
    if (modalTitle) {
        modalTitle.innerHTML = `予約詳細 | ${reservation.id} | <span class="status-badge ${statusClass}">${reservation.status}</span>`;
    }
    
    modalBody.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; margin-bottom:24px;">
            <div>
                <h4 style="border-bottom:2px solid #0A9396; padding-bottom:8px; margin-bottom:16px;">📋 基本情報</h4>
                <table style="width:100%; font-size:14px;">
                    <tr><td style="padding:8px; font-weight:600;">予約番号</td><td style="padding:8px;">${reservation.id}</td></tr>
                    <tr><td style="padding:8px; font-weight:600;">代表者名</td><td style="padding:8px;">${reservation.customerName}</td></tr>
                    <tr><td style="padding:8px; font-weight:600;">ツアー種別</td><td style="padding:8px;">${reservation.tourType}</td></tr>
                    <tr><td style="padding:8px; font-weight:600;">開催日時</td><td style="padding:8px;">${reservation.tourDate} ${reservation.time}</td></tr>
                    <tr><td style="padding:8px; font-weight:600;">参加者数</td><td style="padding:8px;">${reservation.participants?.length || 0}名</td></tr>
                    <tr><td style="padding:8px; font-weight:600;">合計金額</td><td style="padding:8px;">¥${(reservation.totalAmount || 0).toLocaleString()}</td></tr>
                </table>
            </div>
            <div>
                <h4 style="border-bottom:2px solid #0A9396; padding-bottom:8px; margin-bottom:16px;">👥 参加者情報</h4>
                ${(reservation.participants || []).map((p, i) => `
                    <div style="background:#F8F9FA; padding:12px; border-radius:8px; margin-bottom:12px;">
                        <strong>参加者${i + 1}</strong>: ${p.name} (${p.age}歳 / ${p.gender})<br>
                        身長: ${p.height}cm / 体重: ${p.weight}kg / 足サイズ: ${p.shoeSize}cm
                    </div>
                `).join('')}
            </div>
        </div>
        <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:24px;">
            <button class="btn btn-secondary" onclick="closeReservationDetail()">閉じる</button>
        </div>
    `;
    
    modal.style.display = 'flex';
    modal.classList.add('active');
}

function closeReservationDetail() {
    const modal = document.getElementById('reservation-detail-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}

window.viewReservationDetail = viewReservationDetail;
window.closeReservationDetail = closeReservationDetail;

// ============================================
// 新規予約モーダル
// ============================================

function openNewReservationModal() {
    const modal = document.getElementById('new-reservation-modal');
    if (!modal) return;
    
    participantCount = 1;
    modal.style.display = 'flex';
    modal.classList.add('active');
    
    const addParticipantBtn = document.getElementById('add-participant-btn');
    if (addParticipantBtn) {
        addParticipantBtn.onclick = addParticipantForm;
    }
    
    const form = document.getElementById('new-reservation-form');
    if (form) {
        form.onsubmit = handleNewReservationSubmit;
    }
}

function closeNewReservation() {
    const modal = document.getElementById('new-reservation-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        const form = document.getElementById('new-reservation-form');
        if (form) form.reset();
        participantCount = 1;
    }
}

function addParticipantForm() {
    const container = document.getElementById('participants-container');
    if (!container) return;
    
    const index = participantCount;
    participantCount++;
    
    const formHTML = `
        <div class="participant-form">
            <h5>参加者${index + 1}</h5>
            <div class="form-grid">
                <div class="form-group">
                    <label>氏名*</label>
                    <input type="text" name="participants[${index}][name]" required>
                </div>
                <div class="form-group">
                    <label>年齢*</label>
                    <input type="number" name="participants[${index}][age]" required>
                </div>
                <div class="form-group">
                    <label>性別*</label>
                    <select name="participants[${index}][gender]" required>
                        <option value="男性">男性</option>
                        <option value="女性">女性</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>身長(cm)*</label>
                    <input type="number" name="participants[${index}][height]" required>
                </div>
                <div class="form-group">
                    <label>体重(kg)*</label>
                    <input type="number" name="participants[${index}][weight]" required>
                </div>
                <div class="form-group">
                    <label>足サイズ(cm)*</label>
                    <input type="number" name="participants[${index}][shoeSize]" required>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', formHTML);
}

function handleNewReservationSubmit(e) {
    e.preventDefault();
    console.log('予約登録処理（実装予定）');
    alert('予約登録機能は現在開発中です');
    closeNewReservation();
    return false;
}

window.openNewReservationModal = openNewReservationModal;
window.closeNewReservation = closeNewReservation;

// ============================================
// 顧客管理
// ============================================

function setupCustomersPage() {
    const addBtn = document.getElementById('add-customer-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            alert('新規顧客登録機能は現在開発中です');
        });
    }
}

// ============================================
// 器材準備リスト
// ============================================

function setupEquipmentPage() {
    const loadBtn = document.getElementById('load-equipment-btn');
    if (loadBtn) {
        loadBtn.addEventListener('click', renderEquipmentList);
    }
}

function renderEquipmentList() {
    console.log('器材準備リスト表示');
    const dateInput = document.getElementById('equipment-date');
    const date = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];
    
    const reservations = loadReservations();
    const dayReservations = reservations.filter(r => r.tourDate === date && r.status !== 'キャンセル');
    
    console.log(`${date}の予約: ${dayReservations.length}件`);
}

// ============================================
// 日付詳細モーダル
// ============================================

function showDateDetail(date) {
    const reservations = loadReservations();
    const dayReservations = reservations.filter(r => r.tourDate === date && r.status !== 'キャンセル');
    
    const modal = document.getElementById('date-detail-modal');
    const title = document.getElementById('date-detail-title');
    const body = document.getElementById('date-detail-body');
    
    if (!modal || !title || !body) return;
    
    title.textContent = `${date}の予約 (${dayReservations.length}件)`;
    
    if (dayReservations.length === 0) {
        body.innerHTML = '<div class="empty-state"><p>この日の予約はありません</p></div>';
    } else {
        body.innerHTML = `
            <div style="display:grid; gap:12px;">
                ${dayReservations.map(r => `
                    <div style="padding:16px; background:#F0F9FF; border-radius:8px; border-left:4px solid #0A9396;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <h4 style="margin-bottom:8px;">${r.time} ${r.customerName}様 (${r.participants?.length || 0}名)</h4>
                                <p style="font-size:14px; color:#6C757D;">${r.tourType}</p>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button class="btn btn-primary" onclick="closeDateDetail(); viewReservationDetail('${r.id}')">詳細</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    modal.style.display = 'flex';
    modal.classList.add('active');
}

function closeDateDetail() {
    const modal = document.getElementById('date-detail-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}

window.showDateDetail = showDateDetail;
window.closeDateDetail = closeDateDetail;

// ============================================
// イベントリスナー設定
// ============================================

function setupEventListeners() {
    // モーダルの外側をクリックしたら閉じる
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            if (e.target.id === 'new-reservation-modal') {
                closeNewReservation();
            } else if (e.target.id === 'reservation-detail-modal') {
                closeReservationDetail();
            } else if (e.target.id === 'date-detail-modal') {
                closeDateDetail();
            }
        }
    });
}

// ============================================
// データ読み込み関数
// ============================================

function loadReservations() {
    try {
        const data = localStorage.getItem('oceanbook_reservations');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('予約データの読み込みエラー:', e);
        return [];
    }
}

function loadCustomers() {
    try {
        const data = localStorage.getItem('oceanbook_customers');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('顧客データの読み込みエラー:', e);
        return [];
    }
}

function loadLineConversations() {
    try {
        const data = localStorage.getItem('oceanbook_line_conversations');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('LINE会話データの読み込みエラー:', e);
        return [];
    }
}

// グローバル関数として公開
window.renderDashboard = renderDashboard;
window.renderReservationsTable = renderReservationsTable;

console.log('✅ app.js 読み込み完了');
