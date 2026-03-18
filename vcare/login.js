/* ============================================================
   onco.care — 공통 로그인 오버레이
   ============================================================ */
(function() {
  // ── State ──
  let loginStep = 0; // 0:kakao, 1:role, 2:medical-license, 3:department, 4:complete
  let loginData = { role: '', license: '', department: '' };

  const DEPARTMENTS = [
    '내과','외과','소아청소년과','산부인과',
    '정형외과','신경과','정신건강의학과','피부과',
    '비뇨의학과','이비인후과','안과','재활의학과',
    '영상의학과','마취통증의학과','응급의학과','가정의학과',
    '흉부외과','신경외과'
  ];

  // ── Create overlay DOM ──
  const overlay = document.createElement('div');
  overlay.className = 'login-overlay';
  overlay.id = 'loginOverlay';
  overlay.innerHTML = `
    <div class="login-modal" style="position:relative">
      <div class="login-modal-header">
        <div class="login-modal-logo"><em>onco.</em>care</div>
        <div class="login-modal-sub">차세대 지능형 의료 전문 커뮤니티</div>
      </div>
      <button class="login-modal-close" id="loginClose">&times;</button>
      <div class="login-body">
        <div class="login-dots" id="loginDots"></div>
        <div id="loginContent"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const dotsEl = document.getElementById('loginDots');
  const contentEl = document.getElementById('loginContent');

  // ── Render ──
  function render() {
    // Determine total steps based on role
    let totalDots;
    if (loginData.role === '의료진') {
      totalDots = 4; // kakao → role → license → department
    } else {
      totalDots = 2; // kakao → role
    }

    // Dots
    if (loginStep === 0) {
      dotsEl.innerHTML = '';
    } else {
      dotsEl.innerHTML = Array.from({ length: totalDots }, (_, i) => {
        const step = i + 1;
        const cls = step < loginStep ? 'login-dot done' : step === loginStep ? 'login-dot active' : 'login-dot';
        return `<div class="${cls}"></div>`;
      }).join('');
    }

    // Content
    if (loginStep === 0) {
      // Kakao login
      contentEl.innerHTML = `
        <div class="login-welcome">
          <div class="login-welcome-icon">👋</div>
          <h3>onco.care에 오신 것을<br>환영합니다</h3>
          <p>차세대 지능형 의료 전문 커뮤니티<br>간편하게 로그인하고 시작하세요.</p>
          <button class="login-kakao" id="loginKakaoBtn">
            <svg viewBox="0 0 24 24" fill="#3C1E1E"><path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67l-.9 3.33c-.07.27.22.49.46.35l3.87-2.57c.6.08 1.23.12 1.91.12 5.52 0 10-3.58 10-7.9S17.52 3 12 3z"/></svg>
            카카오로 1초만에 로그인하기
          </button>
          <p class="login-terms">로그인 시 서비스 이용약관에 동의합니다.</p>
        </div>
      `;
      document.getElementById('loginKakaoBtn').addEventListener('click', function() {
        loginStep = 1;
        render();
      });

    } else if (loginStep === 1) {
      // Role selection
      contentEl.innerHTML = `
        <div class="login-step-title">어떤 역할로<br>이용하시나요?</div>
        <div class="login-step-desc">역할에 맞는 맞춤 경험을 제공합니다.</div>
        <div class="login-options">
          <button class="login-opt ${loginData.role==='환자'?'selected':''}" data-role="환자">
            <div class="login-opt-icon" style="background:rgba(63,191,188,0.08)">🙋</div>
            <div class="login-opt-text">환자<small>본인이 환자인 경우</small></div>
          </button>
          <button class="login-opt ${loginData.role==='보호자'?'selected':''}" data-role="보호자">
            <div class="login-opt-icon" style="background:rgba(245,158,11,0.08)">🤝</div>
            <div class="login-opt-text">보호자<small>가족·지인을 돌보는 경우</small></div>
          </button>
          <button class="login-opt ${loginData.role==='의료진'?'selected':''}" data-role="의료진">
            <div class="login-opt-icon" style="background:rgba(110,63,163,0.08)">🩺</div>
            <div class="login-opt-text">의료진<small>의사·간호사 등 의료 전문가</small></div>
          </button>
        </div>
        <div class="login-nav">
          <button class="login-btn login-btn--back" id="loginBack">이전</button>
          <button class="login-btn login-btn--next ${loginData.role?'enabled':''}" id="loginNext">다음</button>
        </div>
      `;
      // Option click
      contentEl.querySelectorAll('.login-opt').forEach(function(btn) {
        btn.addEventListener('click', function() {
          contentEl.querySelectorAll('.login-opt').forEach(function(b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
          loginData.role = btn.dataset.role;
          document.getElementById('loginNext').classList.add('enabled');
        });
      });
      document.getElementById('loginBack').addEventListener('click', function() {
        loginStep = 0;
        render();
      });
      document.getElementById('loginNext').addEventListener('click', function() {
        if (!loginData.role) return;
        if (loginData.role === '의료진') {
          loginStep = 2;
        } else {
          loginStep = 99; // complete
        }
        render();
      });

    } else if (loginStep === 2) {
      // Medical license
      contentEl.innerHTML = `
        <div class="login-step-title">의료 면허번호를<br>입력해 주세요</div>
        <div class="login-step-desc">면허번호는 인증 목적으로만 사용되며<br>외부에 공개되지 않습니다.</div>
        <input class="login-input" id="loginLicense" type="text" placeholder="예: 제 12345 호" maxlength="20" value="${loginData.license}">
        <div class="login-input-hint">면허번호는 관리자 인증 후 활성화됩니다</div>
        <div class="login-nav">
          <button class="login-btn login-btn--back" id="loginBack">이전</button>
          <button class="login-btn login-btn--next ${loginData.license.length>=3?'enabled':''}" id="loginNext">다음</button>
        </div>
      `;
      var licInput = document.getElementById('loginLicense');
      var nextBtn = document.getElementById('loginNext');
      licInput.addEventListener('input', function() {
        loginData.license = licInput.value.trim();
        if (loginData.license.length >= 3) nextBtn.classList.add('enabled');
        else nextBtn.classList.remove('enabled');
      });
      licInput.focus();
      document.getElementById('loginBack').addEventListener('click', function() {
        loginStep = 1;
        render();
      });
      nextBtn.addEventListener('click', function() {
        if (loginData.license.length < 3) return;
        loginStep = 3;
        render();
      });

    } else if (loginStep === 3) {
      // Department selection
      contentEl.innerHTML = `
        <div class="login-step-title">진료과를 선택해 주세요</div>
        <div class="login-step-desc">전문 분야에 맞는 콘텐츠를 제공합니다.</div>
        <div class="login-dept-grid">
          ${DEPARTMENTS.map(function(d) {
            return '<button class="login-dept ' + (loginData.department===d?'selected':'') + '" data-dept="' + d + '">' + d + '</button>';
          }).join('')}
        </div>
        <div class="login-nav">
          <button class="login-btn login-btn--back" id="loginBack">이전</button>
          <button class="login-btn login-btn--next ${loginData.department?'enabled':''}" id="loginNext">완료</button>
        </div>
      `;
      contentEl.querySelectorAll('.login-dept').forEach(function(btn) {
        btn.addEventListener('click', function() {
          contentEl.querySelectorAll('.login-dept').forEach(function(b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
          loginData.department = btn.dataset.dept;
          document.getElementById('loginNext').classList.add('enabled');
        });
      });
      document.getElementById('loginBack').addEventListener('click', function() {
        loginStep = 2;
        render();
      });
      document.getElementById('loginNext').addEventListener('click', function() {
        if (!loginData.department) return;
        loginStep = 99;
        render();
      });

    } else if (loginStep === 99) {
      // Success
      dotsEl.innerHTML = '';
      var tags = '<span class="login-success-tag">' + loginData.role + '</span>';
      if (loginData.role === '의료진') {
        tags += '<span class="login-success-tag">면허 인증 완료</span>';
        tags += '<span class="login-success-tag">' + loginData.department + '</span>';
      }
      contentEl.innerHTML = `
        <div class="login-success">
          <div class="login-success-icon">✅</div>
          <h3>로그인이 완료되었습니다!</h3>
          <p>onco.care에 오신 것을 환영합니다.<br>맞춤 의료 커뮤니티를 시작하세요.</p>
          <div class="login-success-tags">${tags}</div>
          <button class="login-btn--done" id="loginDone">시작하기</button>
        </div>
      `;
      document.getElementById('loginDone').addEventListener('click', function() {
        closeLogin();
        // Save to localStorage
        try { localStorage.setItem('oncocare_login', JSON.stringify(loginData)); } catch(e) {}
        updateLoginUI();
        // Dispatch custom event for page-specific handling
        window.dispatchEvent(new CustomEvent('oncocare-login', { detail: loginData }));
      });
    }
  }

  // ── Open / Close ──
  function openLogin() {
    loginStep = 0;
    loginData = { role: '', license: '', department: '' };
    overlay.classList.add('on');
    document.body.style.overflow = 'hidden';
    render();
  }

  function closeLogin() {
    overlay.classList.remove('on');
    document.body.style.overflow = '';
  }

  // ── Logout ──
  function doLogout() {
    try { localStorage.removeItem('oncocare_login'); } catch(e) {}
    loginData = { role: '', license: '', department: '' };
    resetLoginUI();
    window.dispatchEvent(new CustomEvent('oncocare-logout'));
  }

  // ── Reset header UI to logged-out state ──
  function resetLoginUI() {
    document.querySelectorAll('.btn-login').forEach(function(el) {
      el.textContent = '로그인';
      el.style.pointerEvents = '';
      el.style.background = '';
      el.style.borderColor = '';
      el.style.color = '';
      el.classList.remove('logged-in');
    });
    // Remove any existing logout buttons
    document.querySelectorAll('.btn-logout').forEach(function(el) {
      el.remove();
    });
    document.querySelectorAll('.drawer-login').forEach(function(el) {
      el.textContent = '로그인';
      el.style.background = 'var(--text)';
      el.style.pointerEvents = '';
    });
    document.querySelectorAll('.drawer-logout').forEach(function(el) {
      el.remove();
    });
  }

  // ── Update header UI after login ──
  function updateLoginUI() {
    // Replace login button text and add logout button in GNB
    document.querySelectorAll('.btn-login').forEach(function(el) {
      el.textContent = loginData.role === '의료진'
        ? '🩺 의료진'
        : loginData.role === '보호자' ? '🤝 보호자' : '🙋 ' + (loginData.role || '마이');
      el.style.pointerEvents = 'none';
      el.style.background = 'rgba(110,63,163,0.06)';
      el.style.borderColor = 'rgba(110,63,163,0.2)';
      el.style.color = '#6E3FA3';
      el.classList.add('logged-in');

      // Add logout button next to login button if not already present
      if (!el.parentElement.querySelector('.btn-logout')) {
        var logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.className = 'btn-logout';
        logoutBtn.textContent = '로그아웃';
        logoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          doLogout();
        });
        el.parentElement.insertBefore(logoutBtn, el.nextSibling);
      }
    });

    // Update drawer login button and add drawer logout
    document.querySelectorAll('.drawer-login').forEach(function(el) {
      el.textContent = loginData.role === '의료진'
        ? '🩺 의료진 로그인됨'
        : loginData.role === '보호자' ? '🤝 보호자 로그인됨' : '🙋 로그인됨';
      el.style.background = '#6E3FA3';
      el.style.pointerEvents = 'none';

      // Add drawer logout button if not already present
      if (!el.parentElement.querySelector('.drawer-logout')) {
        var drawerLogout = document.createElement('a');
        drawerLogout.href = '#';
        drawerLogout.className = 'drawer-logout';
        drawerLogout.textContent = '로그아웃';
        drawerLogout.addEventListener('click', function(e) {
          e.preventDefault();
          // Close drawer
          var drawerEl = document.getElementById('drawer');
          var dimEl = document.getElementById('dim');
          if (drawerEl) drawerEl.classList.remove('on');
          if (dimEl) dimEl.classList.remove('on');
          document.body.style.overflow = '';
          doLogout();
        });
        el.parentElement.appendChild(drawerLogout);
      }
    });
  }

  // Close button
  document.getElementById('loginClose').addEventListener('click', closeLogin);
  // Click outside modal to close
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeLogin();
  });

  // ── Restore login state from localStorage ──
  try {
    var saved = localStorage.getItem('oncocare_login');
    if (saved) {
      var parsed = JSON.parse(saved);
      if (parsed && parsed.role) {
        loginData = parsed;
        updateLoginUI();
        window.dispatchEvent(new CustomEvent('oncocare-login', { detail: loginData }));
      }
    }
  } catch(e) {}

  // ── Bind login buttons ──
  document.querySelectorAll('.btn-login').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      openLogin();
    });
  });
  document.querySelectorAll('.drawer-login').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      // Close drawer first if open
      var drawerEl = document.getElementById('drawer');
      var dimEl = document.getElementById('dim');
      if (drawerEl) drawerEl.classList.remove('on');
      if (dimEl) dimEl.classList.remove('on');
      document.body.style.overflow = '';
      openLogin();
    });
  });
})();
