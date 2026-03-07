1	// ============================================
     2	// OceanBook Pro - メインアプリケーションロジック
     3	// バージョン: v3.0 完全版
     4	// 最終更新: 2026-03-07
     5	// ============================================
     6	
     7	// 現在のページ
     8	let currentPage = 'dashboard';
     9	let participantCount = 1;
    10	
    11	// ============================================
    12	// ページ初期化
    13	// ============================================
    14	
    15	document.addEventListener('DOMContentLoaded', () => {
    16	    console.log('🚀 OceanBook Pro 起動中...');
    17	    
    18	    // データ初期化確認
    19	    if (typeof DataManager !== 'undefined') {
    20	        DataManager.init();
    21	    }
    22	    
    23	    // モバイルメニュー設定
    24	    setupMobileMenu();
    25	    
    26	    // ナビゲーション設定
    27	    setupNavigation();
    28	    
    29	    // ダッシュボード初期化
    30	    renderDashboard();
    31	    
    32	    // 天気・海況ウィジェット初期化
    33	    if (typeof WeatherWidget !== 'undefined') {
    34	        WeatherWidget.init();
    35	    }
    36	    
    37	    // 予約管理ページ設定
    38	    setupReservationsPage();
    39	    
    40	    // LINE管理ページ設定
    41	    setupLinePage();
    42	    
    43	    // 顧客管理ページ設定
    44	    setupCustomersPage();
    45	    
    46	    // 器材準備リスト設定
    47	    setupEquipmentPage();
    48	    
    49	    // 各ページのイベントリスナー
    50	    setupEventListeners();
    51	    
    52	    console.log('✅ OceanBook Pro 起動完了！');
    53	});
    54	
    55	// ============================================
    56	// モバイルメニュー
    57	// ============================================
    58	
    59	function setupMobileMenu() {
    60	    const menuBtn = document.getElementById('mobile-menu-btn');
    61	    const sidebar = document.getElementById('sidebar');
    62	    const sidebarClose = document.getElementById('sidebar-close');
    63	    const overlay = document.getElementById('sidebar-overlay');
    64	    
    65	    if (!menuBtn || !sidebar || !overlay) return;
    66	    
    67	    menuBtn.addEventListener('click', () => {
    68	        sidebar.classList.add('active');
    69	        overlay.classList.add('active');
    70	        document.body.style.overflow = 'hidden';
    71	        if (window.innerWidth <= 768 && sidebarClose) {
    72	            sidebarClose.style.display = 'block';
    73	        }
    74	    });
    75	    
    76	    if (sidebarClose) {
    77	        sidebarClose.addEventListener('click', closeMobileMenu);
    78	    }
    79	    
    80	    overlay.addEventListener('click', closeMobileMenu);
    81	    
    82	    window.addEventListener('resize', () => {
    83	        if (window.innerWidth > 768) {
    84	            sidebar.classList.remove('active');
    85	            overlay.classList.remove('active');
    86	            document.body.style.overflow = '';
    87	            if (sidebarClose) {
    88	                sidebarClose.style.display = 'none';
    89	            }
    90	        }
    91	    });
    92	}
    93	
    94	function closeMobileMenu() {
    95	    const sidebar = document.getElementById('sidebar');
    96	    const overlay = document.getElementById('sidebar-overlay');
    97	    const sidebarClose = document.getElementById('sidebar-close');
    98	    
    99	    if (sidebar) sidebar.classList.remove('active');
   100	    if (overlay) overlay.classList.remove('active');
   101	    document.body.style.overflow = '';
   102	    if (sidebarClose) sidebarClose.style.display = 'none';
   103	}
   104	
   105	// ============================================
   106	// ナビゲーション
   107	// ============================================
   108	
   109	function setupNavigation() {
   110	    const navLinks = document.querySelectorAll('.nav-link');
   111	    
   112	    navLinks.forEach(link => {
   113	        link.addEventListener('click', (e) => {
   114	            e.preventDefault();
   115	            const page = link.getAttribute('data-page');
   116	            if (page) {
   117	                navigateToPage(page);
   118	            }
   119	        });
   120	    });
   121	}
   122	
   123	function navigateToPage(page) {
   124	    // すべてのページを非表示
   125	    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
   126	    
   127	    // すべてのナビリンクから active を削除
   128	    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
   129	    
   130	    // 選択されたページを表示
   131	    const pageElement = document.getElementById(`${page}-page`);
   132	    if (pageElement) {
   133	        pageElement.classList.add('active');
   134	    }
   135	    
   136	    // 選択されたナビリンクに active を追加
   137	    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
   138	    if (activeLink) {
   139	        activeLink.classList.add('active');
   140	    }
   141	    
   142	    currentPage = page;
   143	    
   144	    // モバイルメニューを閉じる
   145	    if (window.innerWidth <= 768) {
   146	        closeMobileMenu();
   147	    }
   148	    
   149	    // ページ固有の初期化
   150	    switch(page) {
   151	        case 'dashboard':
   152	            renderDashboard();
   153	            break;
   154	        case 'reservations':
   155	            renderReservationsTable();
   156	            break;
   157	        case 'line':
   158	            renderLineConversations();
   159	            break;
   160	        case 'customers':
   161	            renderCustomersTable();
   162	            break;
   163	        case 'equipment':
   164	            renderEquipmentList();
   165	            break;
   166	        case 'team':
   167	            console.log('チーム分けページ表示');
   168	            break;
   169	        case 'analytics':
   170	            console.log('分析ページ表示');
   171	            break;
   172	    }
   173	}
   174	
   175	// グローバル関数として公開
   176	window.showPage = navigateToPage;
   177	
   178	// ============================================
   179	// ダッシュボード
   180	// ============================================
   181	
   182	function renderDashboard() {
   183	    console.log('📊 ダッシュボード描画');
   184	    
   185	    updateKPICards();
   186	    renderTodaySchedule();
   187	    renderMiniCalendar();
   188	    
   189	    console.log('✅ ダッシュボード描画完了');
   190	}
   191	
   192	function updateKPICards() {
   193	    const reservations = loadReservations();
   194	    const conversations = loadLineConversations();
   195	    const today = new Date().toISOString().split('T')[0];
   196	    
   197	    // 今日の予約数
   198	    const todayReservations = reservations.filter(r => 
   199	        r.tourDate === today && r.status !== 'キャンセル'
   200	    );
   201	    
   202	    // 今月の売上
   203	    const currentMonth = new Date().getMonth() + 1;
   204	    const currentYear = new Date().getFullYear();
   205	    const monthReservations = reservations.filter(r => {
   206	        const date = new Date(r.tourDate);
   207	        return date.getMonth() + 1 === currentMonth && 
   208	               date.getFullYear() === currentYear && 
   209	               r.status !== 'キャンセル';
   210	    });
   211	    const monthRevenue = monthReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
   212	    
   213	    // キャンセル率
   214	    const canceledReservations = reservations.filter(r => r.status === 'キャンセル');
   215	    const cancelRate = reservations.length > 0 
   216	        ? ((canceledReservations.length / reservations.length) * 100).toFixed(1) 
   217	        : 0;
   218	    
   219	    // LINE未読数
   220	    const lineUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
   221	    
   222	    // DOM更新
   223	    const kpiTodayEl = document.getElementById('kpi-today-reservations');
   224	    const kpiRevenueEl = document.getElementById('kpi-month-revenue');
   225	    const kpiCancelEl = document.getElementById('kpi-cancel-rate');
   226	    const kpiLineEl = document.getElementById('kpi-line-unread');
   227	    
   228	    if (kpiTodayEl) kpiTodayEl.textContent = todayReservations.length;
   229	    if (kpiRevenueEl) {
   230	        kpiRevenueEl.textContent = `¥${monthRevenue.toLocaleString()}`;
   231	        // 長い数値の場合はフォントサイズを調整
   232	        if (monthRevenue >= 10000000) {
   233	            kpiRevenueEl.setAttribute('data-length', 'very-long');
   234	        } else if (monthRevenue >= 1000000) {
   235	            kpiRevenueEl.setAttribute('data-length', 'long');
   236	        }
   237	    }
   238	    if (kpiCancelEl) kpiCancelEl.textContent = `${cancelRate}%`;
   239	    if (kpiLineEl) kpiLineEl.textContent = lineUnread;
   240	}
   241	
   242	function renderTodaySchedule() {
   243	    const scheduleContainer = document.getElementById('today-schedule');
   244	    if (!scheduleContainer) return;
   245	    
   246	    const reservations = loadReservations();
   247	    const today = new Date().toISOString().split('T')[0];
   248	    const todayReservations = reservations.filter(r => 
   249	        r.tourDate === today && r.status !== 'キャンセル'
   250	    );
   251	    
   252	    if (todayReservations.length === 0) {
   253	        scheduleContainer.innerHTML = '<div class="empty-state"><p>本日の予約はありません</p></div>';
   254	        return;
   255	    }
   256	    
   257	    scheduleContainer.innerHTML = `
   258	        <div class="schedule-grid">
   259	            ${todayReservations.map(r => `
   260	                <div class="schedule-card">
   261	                    <div class="schedule-info">
   262	                        <h4>${r.time} ${r.customerName}様</h4>
   263	                        <p>参加者: ${r.participants?.length || 0}名 | ${r.tourType}</p>
   264	                    </div>
   265	                    <div class="schedule-actions">
   266	                        <button class="btn btn-secondary" onclick="viewReservationDetail('${r.id}')">詳細</button>
   267	                    </div>
   268	                </div>
   269	            `).join('')}
   270	        </div>
   271	    `;
   272	}
   273	
   274	function renderMiniCalendar() {
   275	    const calendarContainer = document.getElementById('mini-calendar');
   276	    if (!calendarContainer) return;
   277	    
   278	    const reservations = loadReservations();
   279	    const now = new Date();
   280	    const year = now.getFullYear();
   281	    const month = now.getMonth();
   282	    
   283	    const firstDay = new Date(year, month, 1);
   284	    const lastDay = new Date(year, month + 1, 0);
   285	    const daysInMonth = lastDay.getDate();
   286	    const startDayOfWeek = firstDay.getDay();
   287	    
   288	    let html = `
   289	        <div class="calendar-header">
   290	            <button class="calendar-nav-btn" onclick="changeCalendarMonth(-1)">◀</button>
   291	            <span class="calendar-month-label">${year}年${month + 1}月</span>
   292	            <button class="calendar-nav-btn" onclick="changeCalendarMonth(1)">▶</button>
   293	        </div>
   294	    `;
   295	    
   296	    // 曜日ヘッダー
   297	    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
   298	    weekdays.forEach(day => {
   299	        html += `<div style="text-align:center; font-weight:600; padding:8px; font-size:12px;">${day}</div>`;
   300	    });
   301	    
   302	    // 空白セル
   303	    for (let i = 0; i < startDayOfWeek; i++) {
   304	        html += '<div></div>';
   305	    }
   306	    
   307	    // 日付セル
   308	    for (let day = 1; day <= daysInMonth; day++) {
   309	        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
   310	        const dayReservations = reservations.filter(r => r.tourDate === dateStr && r.status !== 'キャンセル');
   311	        const isToday = dateStr === new Date().toISOString().split('T')[0];
   312	        const holidayName = typeof getJapaneseHoliday !== 'undefined' ? getJapaneseHoliday(dateStr) : null;
   313	        
   314	        let classes = ['calendar-cell'];
   315	        if (isToday) classes.push('today');
   316	        if (holidayName) classes.push('holiday');
   317	        if (dayReservations.length > 0) classes.push('has-reservations');
   318	        
   319	        html += `
   320	            <div class="${classes.join(' ')}" onclick="showDateDetail('${dateStr}')">
   321	                <div class="date">${day}</div>
   322	                ${dayReservations.length > 0 ? `<div class="count">${dayReservations.length}件</div>` : ''}
   323	            </div>
   324	        `;
   325	    }
   326	    
   327	    calendarContainer.innerHTML = html;
   328	}
   329	
   330	function changeCalendarMonth(direction) {
   331	    // カレンダー月変更機能（実装省略）
   332	    console.log('カレンダー月変更:', direction);
   333	}
   334	
   335	window.changeCalendarMonth = changeCalendarMonth;
   336	
   337	// ============================================
   338	// 予約管理
   339	// ============================================
   340	
   341	function setupReservationsPage() {
   342	    const addBtn = document.getElementById('add-reservation-btn');
   343	    if (addBtn) {
   344	        addBtn.addEventListener('click', openNewReservationModal);
   345	    }
   346	    
   347	    const searchInput = document.getElementById('reservation-search');
   348	    const statusFilter = document.getElementById('status-filter');
   349	    
   350	    if (searchInput) {
   351	        searchInput.addEventListener('input', renderReservationsTable);
   352	    }
   353	    if (statusFilter) {
   354	        statusFilter.addEventListener('change', renderReservationsTable);
   355	    }
   356	}
   357	
   358	function renderReservationsTable() {
   359	    let reservations = loadReservations();
   360	    
   361	    // フィルター適用
   362	    const searchQuery = document.getElementById('reservation-search')?.value.toLowerCase() || '';
   363	    const statusFilter = document.getElementById('status-filter')?.value || '';
   364	    
   365	    if (searchQuery) {
   366	        reservations = reservations.filter(r => 
   367	            r.id.toLowerCase().includes(searchQuery) ||
   368	            r.customerName.toLowerCase().includes(searchQuery)
   369	        );
   370	    }
   371	    
   372	    if (statusFilter) {
   373	        reservations = reservations.filter(r => r.status === statusFilter);
   374	    }
   375	    
   376	    const tbody = document.getElementById('reservations-tbody');
   377	    if (!tbody) return;
   378	    
   379	    if (reservations.length === 0) {
   380	        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:40px;">予約が見つかりません</td></tr>';
   381	        return;
   382	    }
   383	    
   384	    tbody.innerHTML = reservations.map(r => {
   385	        const statusClass = r.status === '確定' ? 'confirmed' :
   386	                           r.status === '仮予約' ? 'tentative' :
   387	                           r.status === 'キャンセル' ? 'cancelled' : 'completed';
   388	        
   389	        return `
   390	            <tr onclick="viewReservationDetail('${r.id}')" style="cursor:pointer;">
   391	                <td>${r.id}</td>
   392	                <td>${r.createdAt ? new Date(r.createdAt).toLocaleDateString('ja-JP') : '-'}</td>
   393	                <td>${r.tourDate}</td>
   394	                <td>${r.time}</td>
   395	                <td>${r.tourType}</td>
   396	                <td>${r.customerName}</td>
   397	                <td>${r.participants?.length || 0}名</td>
   398	                <td>¥${(r.totalAmount || 0).toLocaleString()}</td>
   399	                <td><span class="status-badge ${statusClass}">${r.status}</span></td>
   400	                <td>
   401	                    <button class="btn btn-primary" onclick="event.stopPropagation(); viewReservationDetail('${r.id}')">詳細</button>
   402	                </td>
   403	            </tr>
   404	        `;
   405	    }).join('');
   406	}
   407	
   408	function viewReservationDetail(reservationId) {
   409	    const reservations = loadReservations();
   410	    const reservation = reservations.find(r => r.id === reservationId);
   411	    
   412	    if (!reservation) {
   413	        alert('予約が見つかりません');
   414	        return;
   415	    }
   416	    
   417	    const modal = document.getElementById('reservation-detail-modal');
   418	    const modalTitle = document.getElementById('modal-title');
   419	    const modalBody = document.getElementById('reservation-detail-body');
   420	    
   421	    if (!modal || !modalBody) return;
   422	    
   423	    const statusClass = reservation.status === '確定' ? 'confirmed' :
   424	                       reservation.status === '仮予約' ? 'tentative' :
   425	                       reservation.status === 'キャンセル' ? 'cancelled' : 'completed';
   426	    
   427	    if (modalTitle) {
   428	        modalTitle.innerHTML = `予約詳細 | ${reservation.id} | <span class="status-badge ${statusClass}">${reservation.status}</span>`;
   429	    }
   430	    
   431	    modalBody.innerHTML = `
   432	        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; margin-bottom:24px;">
   433	            <div>
   434	                <h4 style="border-bottom:2px solid #0A9396; padding-bottom:8px; margin-bottom:16px;">📋 基本情報</h4>
   435	                <table style="width:100%; font-size:14px;">
   436	                    <tr><td style="padding:8px; font-weight:600;">予約番号</td><td style="padding:8px;">${reservation.id}</td></tr>
   437	                    <tr><td style="padding:8px; font-weight:600;">代表者名</td><td style="padding:8px;">${reservation.customerName}</td></tr>
   438	                    <tr><td style="padding:8px; font-weight:600;">ツアー種別</td><td style="padding:8px;">${reservation.tourType}</td></tr>
   439	                    <tr><td style="padding:8px; font-weight:600;">開催日時</td><td style="padding:8px;">${reservation.tourDate} ${reservation.time}</td></tr>
   440	                    <tr><td style="padding:8px; font-weight:600;">参加者数</td><td style="padding:8px;">${reservation.participants?.length || 0}名</td></tr>
   441	                    <tr><td style="padding:8px; font-weight:600;">合計金額</td><td style="padding:8px;">¥${(reservation.totalAmount || 0).toLocaleString()}</td></tr>
   442	                </table>
   443	            </div>
   444	            <div>
   445	                <h4 style="border-bottom:2px solid #0A9396; padding-bottom:8px; margin-bottom:16px;">👥 参加者情報</h4>
   446	                ${(reservation.participants || []).map((p, i) => `
   447	                    <div style="background:#F8F9FA; padding:12px; border-radius:8px; margin-bottom:12px;">
   448	                        <strong>参加者${i + 1}</strong>: ${p.name} (${p.age}歳 / ${p.gender})<br>
   449	                        身長: ${p.height}cm / 体重: ${p.weight}kg / 足サイズ: ${p.shoeSize}cm
   450	                    </div>
   451	                `).join('')}
   452	            </div>
   453	        </div>
   454	        <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:24px;">
   455	            <button class="btn btn-secondary" onclick="closeReservationDetail()">閉じる</button>
   456	        </div>
   457	    `;
   458	    
   459	    // !important を上書き
   460	    modal.style.setProperty('display', 'flex', 'important');
   461	    modal.classList.add('active');
   462	}
   463	
   464	function closeReservationDetail() {
   465	    const modal = document.getElementById('reservation-detail-modal');
   466	    if (modal) {
   467	        modal.style.setProperty('display', 'none', 'important');
   468	        modal.classList.remove('active');
   469	    }
   470	}
   471	
   472	window.viewReservationDetail = viewReservationDetail;
   473	window.closeReservationDetail = closeReservationDetail;
   474	
   475	// ============================================
   476	// 新規予約モーダル
   477	// ============================================
   478	
   479	function openNewReservationModal() {
   480	    const modal = document.getElementById('new-reservation-modal');
   481	    if (!modal) return;
   482	    
   483	    participantCount = 1;
   484	    // !important を上書き
   485	    modal.style.setProperty('display', 'flex', 'important');
   486	    modal.classList.add('active');
   487	    
   488	    const addParticipantBtn = document.getElementById('add-participant-btn');
   489	    if (addParticipantBtn) {
   490	        addParticipantBtn.onclick = addParticipantForm;
   491	    }
   492	    
   493	    const form = document.getElementById('new-reservation-form');
   494	    if (form) {
   495	        form.onsubmit = handleNewReservationSubmit;
   496	    }
   497	}
   498	
   499	function closeNewReservation() {
   500	    const modal = document.getElementById('new-reservation-modal');
   501	    if (modal) {
   502	        modal.style.setProperty('display', 'none', 'important');
   503	        modal.classList.remove('active');
   504	        const form = document.getElementById('new-reservation-form');
   505	        if (form) form.reset();
   506	        participantCount = 1;
   507	    }
   508	}
   509	
   510	function addParticipantForm() {
   511	    const container = document.getElementById('participants-container');
   512	    if (!container) return;
   513	    
   514	    const index = participantCount;
   515	    participantCount++;
   516	    
   517	    const formHTML = `
   518	        <div class="participant-form">
   519	            <h5>参加者${index + 1}</h5>
   520	            <div class="form-grid">
   521	                <div class="form-group">
   522	                    <label>氏名*</label>
   523	                    <input type="text" name="participants[${index}][name]" required>
   524	                </div>
   525	                <div class="form-group">
   526	                    <label>年齢*</label>
   527	                    <input type="number" name="participants[${index}][age]" required>
   528	                </div>
   529	                <div class="form-group">
   530	                    <label>性別*</label>
   531	                    <select name="participants[${index}][gender]" required>
   532	                        <option value="男性">男性</option>
   533	                        <option value="女性">女性</option>
   534	                    </select>
   535	                </div>
   536	                <div class="form-group">
   537	                    <label>身長(cm)*</label>
   538	                    <input type="number" name="participants[${index}][height]" required>
   539	                </div>
   540	                <div class="form-group">
   541	                    <label>体重(kg)*</label>
   542	                    <input type="number" name="participants[${index}][weight]" required>
   543	                </div>
   544	                <div class="form-group">
   545	                    <label>足サイズ(cm)*</label>
   546	                    <input type="number" name="participants[${index}][shoeSize]" required>
   547	                </div>
   548	            </div>
   549	        </div>
   550	    `;
   551	    
   552	    container.insertAdjacentHTML('beforeend', formHTML);
   553	}
   554	
   555	function handleNewReservationSubmit(e) {
   556	    e.preventDefault();
   557	    console.log('予約登録処理（実装予定）');
   558	    alert('予約登録機能は現在開発中です');
   559	    closeNewReservation();
   560	    return false;
   561	}
   562	
   563	window.openNewReservationModal = openNewReservationModal;
   564	window.closeNewReservation = closeNewReservation;
   565	
   566	// ============================================
   567	// LINE管理
   568	// ============================================
   569	
   570	function setupLinePage() {
   571	    // 自動/手動切り替えボタン
   572	    const autoToggleBtn = document.getElementById('line-auto-mode-toggle');
   573	    if (autoToggleBtn) {
   574	        autoToggleBtn.addEventListener('click', toggleLineAutoMode);
   575	    }
   576	}
   577	
   578	function renderLineConversations() {
   579	    const conversations = loadLineConversations();
   580	    const listContainer = document.getElementById('line-conversations-list');
   581	    
   582	    if (!listContainer) {
   583	        console.warn('LINE会話リストコンテナが見つかりません');
   584	        return;
   585	    }
   586	    
   587	    if (conversations.length === 0) {
   588	        listContainer.innerHTML = `
   589	            <div class="empty-state" style="text-align:center; padding:40px; color:#6C757D;">
   590	                <p>💬 LINE会話がまだありません</p>
   591	                <p style="font-size:14px; margin-top:8px;">お客様からメッセージが届くとここに表示されます</p>
   592	            </div>
   593	        `;
   594	        return;
   595	    }
   596	    
   597	    listContainer.innerHTML = conversations.map(conv => {
   598	        const unreadBadge = conv.unreadCount > 0 
   599	            ? `<span class="badge badge-danger">${conv.unreadCount}</span>` 
   600	            : '';
   601	        
   602	        return `
   603	            <div class="line-conversation-card" onclick="openLineChat('${conv.userId}')">
   604	                <div class="conversation-header">
   605	                    <div class="user-info">
   606	                        <div class="user-avatar">${conv.displayName.charAt(0)}</div>
   607	                        <div>
   608	                            <h4>${conv.displayName} ${unreadBadge}</h4>
   609	                            <p class="timestamp">${formatTimestamp(conv.lastMessageTime)}</p>
   610	                        </div>
   611	                    </div>
   612	                </div>
   613	                <div class="last-message">${conv.lastMessage || 'メッセージがありません'}</div>
   614	            </div>
   615	        `;
   616	    }).join('');
   617	}
   618	
   619	function toggleLineAutoMode() {
   620	    const currentMode = localStorage.getItem('line_auto_mode') === 'true';
   621	    const newMode = !currentMode;
   622	    
   623	    localStorage.setItem('line_auto_mode', newMode);
   624	    
   625	    const btn = document.getElementById('line-auto-mode-toggle');
   626	    if (btn) {
   627	        if (newMode) {
   628	            btn.textContent = '🤖 自動モード ON';
   629	            btn.classList.remove('btn-secondary');
   630	            btn.classList.add('btn-success');
   631	        } else {
   632	            btn.textContent = '✋ 手動モード';
   633	            btn.classList.remove('btn-success');
   634	            btn.classList.add('btn-secondary');
   635	        }
   636	    }
   637	    
   638	    alert(newMode ? '自動返信モードをONにしました' : '手動返信モードに切り替えました');
   639	}
   640	
   641	function openLineChat(userId) {
   642	    console.log('LINE チャット開く:', userId);
   643	    alert(`LINE チャット画面（ユーザーID: ${userId}）\n※ 実装予定`);
   644	}
   645	
   646	function formatTimestamp(timestamp) {
   647	    if (!timestamp) return '';
   648	    const date = new Date(timestamp);
   649	    const now = new Date();
   650	    const diffMs = now - date;
   651	    const diffMins = Math.floor(diffMs / 60000);
   652	    const diffHours = Math.floor(diffMins / 60);
   653	    const diffDays = Math.floor(diffHours / 24);
   654	    
   655	    if (diffMins < 1) return 'たった今';
   656	    if (diffMins < 60) return `${diffMins}分前`;
   657	    if (diffHours < 24) return `${diffHours}時間前`;
   658	    if (diffDays < 7) return `${diffDays}日前`;
   659	    return date.toLocaleDateString('ja-JP');
   660	}
   661	
   662	window.openLineChat = openLineChat;
   663	
   664	// ============================================
   665	// 顧客管理
   666	// ============================================
   667	
   668	function setupCustomersPage() {
   669	    const addBtn = document.getElementById('add-customer-btn');
   670	    if (addBtn) {
   671	        addBtn.addEventListener('click', () => {
   672	            alert('新規顧客登録機能は現在開発中です');
   673	        });
   674	    }
   675	}
   676	
   677	function renderCustomersTable() {
   678	    const customers = loadCustomers();
   679	    const customersTable = document.getElementById('customers-table');
   680	    
   681	    if (!customersTable) {
   682	        console.warn('顧客テーブルが見つかりません');
   683	        return;
   684	    }
   685	    
   686	    if (customers.length === 0) {
   687	        customersTable.innerHTML = `
   688	            <div class="empty-state" style="text-align:center; padding:40px; color:#6C757D;">
   689	                <p>👤 顧客データがまだありません</p>
   690	                <p style="font-size:14px; margin-top:8px;">予約データから自動的に顧客情報が作成されます</p>
   691	            </div>
   692	        `;
   693	        return;
   694	    }
   695	    
   696	    customersTable.innerHTML = `
   697	        <table class="data-table">
   698	            <thead>
   699	                <tr>
   700	                    <th>顧客ID</th>
   701	                    <th>氏名</th>
   702	                    <th>来店回数</th>
   703	                    <th>累計売上</th>
   704	                    <th>最終来店日</th>
   705	                    <th>操作</th>
   706	                </tr>
   707	            </thead>
   708	            <tbody>
   709	                ${customers.map(c => `
   710	                    <tr>
   711	                        <td>${c.id}</td>
   712	                        <td>${c.name}</td>
   713	                        <td>${c.visitCount}回</td>
   714	                        <td>¥${c.totalRevenue.toLocaleString()}</td>
   715	                        <td>${c.lastVisit}</td>
   716	                        <td>
   717	                            <button class="btn btn-primary" onclick="viewCustomerDetail('${c.id}')">詳細</button>
   718	                        </td>
   719	                    </tr>
   720	                `).join('')}
   721	            </tbody>
   722	        </table>
   723	    `;
   724	}
   725	
   726	function viewCustomerDetail(customerId) {
   727	    console.log('顧客詳細表示:', customerId);
   728	    alert(`顧客詳細画面（ID: ${customerId}）\n※ 実装予定`);
   729	}
   730	
   731	window.viewCustomerDetail = viewCustomerDetail;
   732	
   733	// ============================================
   734	// 器材準備リスト
   735	// ============================================
   736	
   737	function setupEquipmentPage() {
   738	    const loadBtn = document.getElementById('load-equipment-btn');
   739	    if (loadBtn) {
   740	        loadBtn.addEventListener('click', renderEquipmentList);
   741	    }
   742	}
   743	
   744	function renderEquipmentList() {
   745	    console.log('器材準備リスト表示');
   746	    const dateInput = document.getElementById('equipment-date');
   747	    const date = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];
   748	    
   749	    const reservations = loadReservations();
   750	    const dayReservations = reservations.filter(r => r.tourDate === date && r.status !== 'キャンセル');
   751	    
   752	    console.log(`${date}の予約: ${dayReservations.length}件`);
   753	}
   754	
   755	// ============================================
   756	// 日付詳細モーダル
   757	// ============================================
   758	
   759	function showDateDetail(date) {
   760	    const reservations = loadReservations();
   761	    const dayReservations = reservations.filter(r => r.tourDate === date && r.status !== 'キャンセル');
   762	    
   763	    const modal = document.getElementById('date-detail-modal');
   764	    const title = document.getElementById('date-detail-title');
   765	    const body = document.getElementById('date-detail-body');
   766	    
   767	    if (!modal || !title || !body) return;
   768	    
   769	    title.textContent = `${date}の予約 (${dayReservations.length}件)`;
   770	    
   771	    if (dayReservations.length === 0) {
   772	        body.innerHTML = '<div class="empty-state"><p>この日の予約はありません</p></div>';
   773	    } else {
   774	        body.innerHTML = `
   775	            <div style="display:grid; gap:12px;">
   776	                ${dayReservations.map(r => `
   777	                    <div style="padding:16px; background:#F0F9FF; border-radius:8px; border-left:4px solid #0A9396;">
   778	                        <div style="display:flex; justify-content:space-between; align-items:center;">
   779	                            <div>
   780	                                <h4 style="margin-bottom:8px;">${r.time} ${r.customerName}様 (${r.participants?.length || 0}名)</h4>
   781	                                <p style="font-size:14px; color:#6C757D;">${r.tourType}</p>
   782	                            </div>
   783	                            <div style="display:flex; gap:8px;">
   784	                                <button class="btn btn-primary" onclick="closeDateDetail(); viewReservationDetail('${r.id}')">詳細</button>
   785	                            </div>
   786	                        </div>
   787	                    </div>
   788	                `).join('')}
   789	            </div>
   790	        `;
   791	    }
   792	    
   793	    // !important を上書き
   794	    modal.style.setProperty('display', 'flex', 'important');
   795	    modal.classList.add('active');
   796	}
   797	
   798	function closeDateDetail() {
   799	    const modal = document.getElementById('date-detail-modal');
   800	    if (modal) {
   801	        modal.style.setProperty('display', 'none', 'important');
   802	        modal.classList.remove('active');
   803	    }
   804	}
   805	
   806	window.showDateDetail = showDateDetail;
   807	window.closeDateDetail = closeDateDetail;
   808	
   809	// ============================================
   810	// イベントリスナー設定
   811	// ============================================
   812	
   813	function setupEventListeners() {
   814	    // モーダルの外側をクリックしたら閉じる
   815	    document.addEventListener('click', (e) => {
   816	        if (e.target.classList.contains('modal')) {
   817	            if (e.target.id === 'new-reservation-modal') {
   818	                closeNewReservation();
   819	            } else if (e.target.id === 'reservation-detail-modal') {
   820	                closeReservationDetail();
   821	            } else if (e.target.id === 'date-detail-modal') {
   822	                closeDateDetail();
   823	            }
   824	        }
   825	    });
   826	}
   827	
   828	// ============================================
   829	// データ読み込み関数
   830	// ============================================
   831	
   832	function loadReservations() {
   833	    try {
   834	        const data = localStorage.getItem('oceanbook_reservations');
   835	        return data ? JSON.parse(data) : [];
   836	    } catch (e) {
   837	        console.error('予約データの読み込みエラー:', e);
   838	        return [];
   839	    }
   840	}
   841	
   842	function loadCustomers() {
   843	    try {
   844	        const data = localStorage.getItem('oceanbook_customers');
   845	        return data ? JSON.parse(data) : [];
   846	    } catch (e) {
   847	        console.error('顧客データの読み込みエラー:', e);
   848	        return [];
   849	    }
   850	}
   851	
   852	function loadLineConversations() {
   853	    try {
   854	        const data = localStorage.getItem('oceanbook_line_conversations');
   855	        return data ? JSON.parse(data) : [];
   856	    } catch (e) {
   857	        console.error('LINE会話データの読み込みエラー:', e);
   858	        return [];
   859	    }
   860	}
   861	
   862	// グローバル関数として公開
   863	window.renderDashboard = renderDashboard;
   864	window.renderReservationsTable = renderReservationsTable;
   865	window.renderLineConversations = renderLineConversations;
   866	window.renderCustomersTable = renderCustomersTable;
   867	
   868	console.log('✅ app.js v3.0 完全版 読み込み完了');
   869	
