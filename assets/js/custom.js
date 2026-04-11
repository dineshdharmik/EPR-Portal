
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

// Chat functionality
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

const sampleResponses = [
    "Based on your current data, I recommend purchasing 2,500 PWMR credits by January 18th to optimize costs. The predicted price increase of 4.2% could cost you an additional ₹8,200.",
    "Your upcoming deadlines are: PWMR Q4 Report (Jan 15), EPR Certificate Renewal (Jan 20), and Annual EWMR Declaration (Jan 31). Would you like me to prepare the documents?",
    "PWMR (Plastic Waste Management Rules) focuses on plastic packaging waste, while EWMR (E-Waste Management Rules) covers electronic equipment. Both require separate compliance tracking and credits.",
    "Your credit utilization is trending upward at 12% month-over-month. You're currently at 85% efficiency compared to 73% industry average. PWMR credits are your highest consumption at 40%."
];

let responseIndex = 0;

if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'flex items-start space-x-3 justify-end';
        userMessageDiv.innerHTML = `
          <div class="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-2xl rounded-tr-none p-4 max-w-xl ml-auto">
            <p class="text-sm">${message}</p>
            <span class="text-xs text-white text-opacity-80 mt-2 block">Just now</span>
          </div>
          <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
            You
          </div>
        `;
        chatMessages.appendChild(userMessageDiv);
        chatInput.value = '';

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulate AI typing
        setTimeout(() => {
            const aiMessageDiv = document.createElement('div');
            aiMessageDiv.className = 'flex items-start space-x-3';
            aiMessageDiv.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="flex-1 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl rounded-tl-none p-4">
              <p class="text-sm text-gray-800">${sampleResponses[responseIndex % sampleResponses.length]}</p>
              <span class="text-xs text-gray-500 mt-2 block">Just now</span>
            </div>
          `;
            chatMessages.appendChild(aiMessageDiv);
            responseIndex++;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
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

(function () { function c() { var b = a.contentDocument || a.contentWindow.document; if (b) { var d = b.createElement('script'); d.innerHTML = "window.__CF$cv$params={r:'9c503bc1c2303d18',t:'MTc2OTYwMDYyMC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);"; b.getElementsByTagName('head')[0].appendChild(d) } } if (document.body) { var a = document.createElement('iframe'); a.height = 1; a.width = 1; a.style.position = 'absolute'; a.style.top = 0; a.style.left = 0; a.style.border = 'none'; a.style.visibility = 'hidden'; document.body.appendChild(a); if ('loading' !== document.readyState) c(); else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c); else { var e = document.onreadystatechange || function () { }; document.onreadystatechange = function (b) { e(b); 'loading' !== document.readyState && (document.onreadystatechange = e, c()) } } } })();