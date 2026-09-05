/
├── index.html              → single shell, all mounts + <script src="src/app.js">
├── styles/
│   ├── tokens.css          (vars, reset, layout primitives)
│   ├── components/         (header.css, card.css, footer.css, hero.css, booking.css)
│   ├── dashboard/          (sidebar.css, stats.css, admin-shell.css — visually separate from public site)
│   └── utilities/buttons.css
└── src/
    ├── app.js              (bootstrap + registerViews + state)
    ├── router.js            (hash routes: '', '#about', '#portfolio', '#blog', '#admin')
    ├── pages/               (HomePage, AboutPage, PortfolioPage, BlogPage, AdminLoginPage, AdminDashboardPage)
    ├── components/          (public: Header, Footer, Hero, ServicesSection, ProjectCard, PostCard, BookingForm, Modal)
    │                         (admin: Sidebar, StatCard, LeadRow, ContentTable, ContentForm)
    ├── services/            (api.js, dataLoader.js — D1-backed)
    └── utilities/           (helpers.js, booking.js, channelLinks.js, auth.js)