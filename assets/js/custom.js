
const defaultConfig = {
    portal_title: "EPR Portal",
    portal_subtitle: "Extended Producer Responsibility",
    home_welcome: "Welcome to EPR Portal",
    background_color: "#f3f4f6",
    surface_color: "#ffffff",
    text_color: "#1f2937",
    primary_action_color: "#10b981",
    secondary_action_color: "#1e3a5f"
};

// EPR Category tabs functionality
const categoryTabs = document.querySelectorAll('.epr-category-tab');
let currentCategory = 'pwmr';

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');

        // Update active tab
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        currentCategory = category;
        console.log('Category changed to:', category);

        // Here you would filter/update the dashboard data based on selected category
        updateDashboardForCategory(category);
    });
});

function updateDashboardForCategory(category) {
    // This function would update the entire dashboard based on the selected EPR category
    console.log('Updating dashboard for category:', category);
    // In a real application, this would fetch category-specific data
}

// Navigation functionality
const navItems = document.querySelectorAll('.nav-item[data-section]');
const sections = document.querySelectorAll('.content-section');
const mainMenu = document.getElementById('main-menu');
const menuToggle = document.querySelector('[data-toggle="main-menu"]');

// Filter functionality
const groupFilter = document.getElementById('group-filter');
const entityFilter = document.getElementById('entity-filter');
const userFilter = document.getElementById('user-filter');
const customFilter = document.getElementById('custom-filter');

const sectionTitles = {
    'home': 'Home Dashboard',
    'leadership': 'Leadership All EPR Dashboard',
    'calendar': 'Compliance Calendar',
    'epr-compliance': 'EPR Compliance Dashboard',
    'epr-purchase': 'EPR Purchase',
    'epr-consumption': 'EPR Consumption',
    'epr-credits': 'EPR Credits',
    'account-view': 'Account Wise View',
    'real-time': 'Real Time Data Status',
    'bwmr': 'Battery Waste Management Rules',
    'ewmr': 'E-Waste Management Rules',
    'ai-insights': 'AI Insights',
    'ai-copilot': 'AI Copilot Chat'
};

// Handle filter changes
function updateDashboardData() {
    const group = groupFilter.value;
    const entity = entityFilter.value;
    const userView = userFilter.value;
    const customView = customFilter.value;

    console.log('Filters updated:', { group, entity, userView, customView });
    // Here you would typically fetch filtered data from your backend
}

if (groupFilter) groupFilter.addEventListener('change', updateDashboardData);
if (entityFilter) entityFilter.addEventListener('change', updateDashboardData);
if (userFilter) userFilter.addEventListener('change', updateDashboardData);
if (customFilter) customFilter.addEventListener('change', updateDashboardData);

// Toggle dropdown menu
if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isVisible = mainMenu.classList.contains('show');
        mainMenu.classList.toggle('show');
        const arrow = menuToggle.querySelector('svg:last-child');
        if (arrow) {
            if (!isVisible) {
                arrow.style.transform = 'rotate(180deg)';
            } else {
                arrow.style.transform = 'rotate(0deg)';
            }
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mainMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            mainMenu.classList.remove('show');
            const arrow = menuToggle.querySelector('svg:last-child');
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
    });

    // Handle menu item clicks in dropdown
    // const dropdownItems = mainMenu.querySelectorAll('[data-section]');
    // dropdownItems.forEach(item => {
    //     item.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         const sectionId = item.getAttribute('data-section');

    //         // Close the dropdown
    //         mainMenu.classList.remove('show');
    //         const arrow = menuToggle.querySelector('svg:last-child');
    //         if (arrow) arrow.style.transform = 'rotate(0deg)';

    //         // Navigate to section
    //         navigateToSection(sectionId);
    //     });
    // });
}

// Helper function for navigation
function navigateToSection(sectionId) {
    // Update active states
    const topNavItems = document.querySelectorAll('.nav-item[data-section]:not(#main-menu .nav-item)');
    topNavItems.forEach(nav => nav.classList.remove('active'));

    // Show selected section
    sections.forEach(section => section.classList.remove('active'));
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Handle section navigation for top nav items only
const topNavItems = document.querySelectorAll('.nav-item[data-section]:not(#main-menu .nav-item)');
topNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const sectionId = item.getAttribute('data-section');

        if (sectionId) {
            e.preventDefault();

            // Update active states
            topNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show selected section
            navigateToSection(sectionId);
        }
    });
});

async function onConfigChange(config) {
    const portalTitle = document.getElementById('portal-title');
    const portalSubtitle = document.getElementById('portal-subtitle');
    const homeWelcome = document.getElementById('home-welcome');

    portalTitle.textContent = config.portal_title || defaultConfig.portal_title;
    portalSubtitle.textContent = config.portal_subtitle || defaultConfig.portal_subtitle;
    homeWelcome.textContent = config.home_welcome || defaultConfig.home_welcome;

    const backgroundColor = config.background_color || defaultConfig.background_color;
    const surfaceColor = config.surface_color || defaultConfig.surface_color;
    const textColor = config.text_color || defaultConfig.text_color;
    const primaryActionColor = config.primary_action_color || defaultConfig.primary_action_color;
    const secondaryActionColor = config.secondary_action_color || defaultConfig.secondary_action_color;

    document.body.style.background = backgroundColor;

    const statCards = document.querySelectorAll('.stat-card, .data-table, .chart-container');
    statCards.forEach(card => {
        card.style.background = surfaceColor;
    });

    const sidebar = document.querySelector('.sidebar');
    sidebar.style.background = `linear-gradient(180deg, ${secondaryActionColor} 0%, ${secondaryActionColor}dd 100%)`;

    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach(fill => {
        if (!fill.style.background.includes('gradient')) {
            fill.style.background = `linear-gradient(90deg, ${primaryActionColor} 0%, ${primaryActionColor}dd 100%)`;
        }
    });

    const badges = document.querySelectorAll('.badge-success');
    badges.forEach(badge => {
        badge.style.background = `${primaryActionColor}33`;
        badge.style.color = primaryActionColor;
    });
}

// AI Copilot — calls api/copilot-chat.php (Gemini or Groq via server-side key)
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatSubmit = document.getElementById('chat-submit');
const copilotSetupHint = document.getElementById('copilot-setup-hint');

const COPILOT_API = 'api/copilot-chat.php';
const COPILOT_HEALTH = 'api/copilot-health.php';

/** @type {{ role: string, content: string }[]} */
let copilotHistory = [];

function scrollChatToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function appendUserBubble(text) {
    const row = document.createElement('div');
    row.className = 'flex items-start space-x-3 justify-end';
    const bubble = document.createElement('div');
    bubble.className =
        'flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-2xl rounded-tr-none p-4 max-w-xl ml-auto';
    const p = document.createElement('p');
    p.className = 'text-sm whitespace-pre-wrap';
    p.textContent = text;
    const time = document.createElement('span');
    time.className = 'text-xs text-white text-opacity-80 mt-2 block';
    time.textContent = 'Just now';
    bubble.appendChild(p);
    bubble.appendChild(time);
    const avatar = document.createElement('div');
    avatar.className =
        'flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-semibold text-sm';
    avatar.textContent = 'You';
    row.appendChild(bubble);
    row.appendChild(avatar);
    chatMessages.appendChild(row);
}

function appendAiBubble(text, isError) {
    const row = document.createElement('div');
    row.className = 'flex items-start space-x-3';
    const iconWrap = document.createElement('div');
    iconWrap.className =
        'flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center';
    iconWrap.innerHTML =
        '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>';
    const bubble = document.createElement('div');
    bubble.className = isError
        ? 'flex-1 rounded-2xl rounded-tl-none border border-red-200 bg-red-50 p-4'
        : 'flex-1 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl rounded-tl-none p-4';
    const p = document.createElement('p');
    p.className = isError ? 'text-sm text-red-800 whitespace-pre-wrap' : 'text-sm text-gray-800 whitespace-pre-wrap';
    p.textContent = text;
    const time = document.createElement('span');
    time.className = isError ? 'text-xs text-red-600 mt-2 block' : 'text-xs text-gray-500 mt-2 block';
    time.textContent = 'Just now';
    bubble.appendChild(p);
    bubble.appendChild(time);
    row.appendChild(iconWrap);
    row.appendChild(bubble);
    chatMessages.appendChild(row);
}

function appendTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'flex items-start space-x-3 copilot-typing-row';
    row.innerHTML = `
      <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center opacity-70">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
      <div class="flex-1 bg-gray-100 rounded-2xl rounded-tl-none p-4">
        <p class="text-sm text-gray-500">Thinking…</p>
      </div>`;
    chatMessages.appendChild(row);
    scrollChatToBottom();
    return row;
}

function removeTypingIndicator(row) {
    if (row && row.parentNode) {
        row.parentNode.removeChild(row);
    }
}

function setCopilotLoading(loading) {
    if (chatSubmit) {
        chatSubmit.disabled = loading;
    }
    if (chatInput) {
        chatInput.disabled = loading;
    }
}

async function sendCopilotMessage(message) {
    const trimmed = message.trim();
    if (!trimmed || !chatMessages) return;

    copilotHistory.push({ role: 'user', content: trimmed });
    appendUserBubble(trimmed);
    chatInput.value = '';
    chatInput.style.height = 'auto';
    scrollChatToBottom();

    const typingRow = appendTypingIndicator();
    setCopilotLoading(true);

    try {
        const res = await fetch(COPILOT_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: copilotHistory }),
        });
        const data = await res.json().catch(() => ({}));
        removeTypingIndicator(typingRow);

        if (data.ok && typeof data.text === 'string' && data.text.trim() !== '') {
            copilotHistory.push({ role: 'assistant', content: data.text });
            appendAiBubble(data.text, false);
        } else {
            const err =
                typeof data.error === 'string' && data.error
                    ? data.error
                    : 'Something went wrong. Check your connection and API configuration.';
            copilotHistory.pop();
            appendAiBubble(err, true);
        }
    } catch {
        removeTypingIndicator(typingRow);
        copilotHistory.pop();
        appendAiBubble('Could not reach the Copilot service. Ensure the site is running on PHP (e.g. XAMPP) and try again.', true);
    } finally {
        setCopilotLoading(false);
        scrollChatToBottom();
    }
}

if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (chatSubmit && chatSubmit.disabled) return;
        sendCopilotMessage(chatInput.value);
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.requestSubmit();
        }
    });

    chatInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    document.querySelectorAll('.copilot-suggested-q').forEach((btn) => {
        btn.addEventListener('click', () => {
            const prompt = btn.getAttribute('data-prompt') || '';
            if (!prompt || (chatSubmit && chatSubmit.disabled)) return;
            chatInput.value = prompt;
            sendCopilotMessage(prompt);
        });
    });

    fetch(COPILOT_HEALTH)
        .then((r) => r.json())
        .then((h) => {
            if (!h || h.configured || !copilotSetupHint) return;
            copilotSetupHint.classList.remove('hidden');
            copilotSetupHint.innerHTML =
                '<strong>Setup required for live AI:</strong> Copy <code class="rounded bg-amber-100 px-1">api/copilot-config.example.php</code> to <code class="rounded bg-amber-100 px-1">api/copilot-config.local.php</code>, add a free key from ' +
                '<a class="font-medium underline" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio (Gemini)</a> or ' +
                '<a class="font-medium underline" href="https://console.groq.com/keys" target="_blank" rel="noopener">Groq</a>, then refresh this page.';
        })
        .catch(() => {});
}

if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities: (config) => ({
            recolorables: [
                {
                    get: () => config.background_color || defaultConfig.background_color,
                    set: (value) => {
                        config.background_color = value;
                        window.elementSdk.setConfig({ background_color: value });
                    }
                },
                {
                    get: () => config.surface_color || defaultConfig.surface_color,
                    set: (value) => {
                        config.surface_color = value;
                        window.elementSdk.setConfig({ surface_color: value });
                    }
                },
                {
                    get: () => config.text_color || defaultConfig.text_color,
                    set: (value) => {
                        config.text_color = value;
                        window.elementSdk.setConfig({ text_color: value });
                    }
                },
                {
                    get: () => config.primary_action_color || defaultConfig.primary_action_color,
                    set: (value) => {
                        config.primary_action_color = value;
                        window.elementSdk.setConfig({ primary_action_color: value });
                    }
                },
                {
                    get: () => config.secondary_action_color || defaultConfig.secondary_action_color,
                    set: (value) => {
                        config.secondary_action_color = value;
                        window.elementSdk.setConfig({ secondary_action_color: value });
                    }
                }
            ],
            borderables: [],
            fontEditable: undefined,
            fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
            ["portal_title", config.portal_title || defaultConfig.portal_title],
            ["portal_subtitle", config.portal_subtitle || defaultConfig.portal_subtitle],
            ["home_welcome", config.home_welcome || defaultConfig.home_welcome]
        ])
    });
}