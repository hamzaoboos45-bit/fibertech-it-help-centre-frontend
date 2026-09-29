const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://hamzaaloudat45.pythonanywhere.com"
).replace(/\/$/, "");
const SUBCATEGORY_ROUTE_ALIASES = {
    "hardware/computer": "computer-and-desktop",
    "hardware/computer-&-desktop": "computer-and-desktop",
    "hardware/monitor": "monitor-and-display",
    "hardware/monitor-&-display": "monitor-and-display",
    "hardware/keyboard-mouse": "keyboard-and-mouse",
    "hardware/keyboard-&-mouse": "keyboard-and-mouse",
    "hardware/other": "other-hardware",

    "network/wifi": "wi-fi-issues",
    "network/internet": "internet-connection",
    "network/vpn": "vpn-access",
    "network/access": "network-access",
    "network/equipment": "network-equipment",

    "security/password": "password-issues",
    "security/account-access": "account-access",
    "security/permissions": "access-permissions",
    "security/mfa": "mfa-and-authentication",
    "security/account-security": "account-security",

    "software/errors": "software-errors",
    "software/installation": "installation-updates",
    "software/installation-&-updates": "installation-updates",
};
const BACKEND_TO_FRONTEND_SUBCATEGORY_ROUTES = {
    "hardware/computer-and-desktop": "computer",
    "hardware/monitor-and-display": "monitor",
    "hardware/keyboard-and-mouse": "keyboard-mouse",
    "hardware/other-hardware": "other",

    "network/wi-fi-issues": "wifi",
    "network/internet-connection": "internet",
    "network/vpn-access": "vpn",
    "network/network-access": "access",
    "network/network-equipment": "equipment",

    "security/password-issues": "password",
    "security/account-access": "account-access",
    "security/access-permissions": "permissions",
    "security/mfa-and-authentication": "mfa",
    "security/account-security": "account-security",

    "software/software-errors": "errors",
    "software/installation-updates": "installation",
};

export function getFrontendSubcategoryRoute(categorySlug, backendSubcategorySlug) {
    return BACKEND_TO_FRONTEND_SUBCATEGORY_ROUTES[`${categorySlug}/${backendSubcategorySlug}`] || backendSubcategorySlug;
}


function resolveSubcategorySlug(categorySlug, routeSubcategorySlug) {
    return SUBCATEGORY_ROUTE_ALIASES[`${categorySlug}/${routeSubcategorySlug}`] || routeSubcategorySlug;
}

async function apiFetch(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(options.headers || {}),
        },
        cache: "no-store",
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const message = data?.error || `Request failed with status ${response.status}`;
        throw new Error(message);
    }

    return data;
}

export function getCategories() {
    return apiFetch("/api/categories");
}

export function getSubcategories(categorySlug) {
    return apiFetch(`/api/categories/${encodeURIComponent(categorySlug)}/subcategories`);
}

export function getSubcategory(categorySlug, subcategorySlug) {
    const backendSubcategorySlug = resolveSubcategorySlug(categorySlug, subcategorySlug);
    return apiFetch(
        `/api/categories/${encodeURIComponent(categorySlug)}/subcategories/${encodeURIComponent(backendSubcategorySlug)}`,
    );
}

export function getIssues(categorySlug, subcategorySlug) {
    const backendSubcategorySlug = resolveSubcategorySlug(categorySlug, subcategorySlug);
    return apiFetch(
        `/api/categories/${encodeURIComponent(categorySlug)}/subcategories/${encodeURIComponent(backendSubcategorySlug)}/issues`,
    );
}

export function getIssue(categorySlug, subcategorySlug, issueSlug) {
    const backendSubcategorySlug = resolveSubcategorySlug(categorySlug, subcategorySlug);
    return apiFetch(
        `/api/categories/${encodeURIComponent(categorySlug)}/subcategories/${encodeURIComponent(backendSubcategorySlug)}/issues/${encodeURIComponent(issueSlug)}`,
    );
}

export function getArticle(slug) {
    return apiFetch(`/api/articles/${encodeURIComponent(slug)}`);
}

export function createHelpRequest(payload) {
    return apiFetch("/api/help-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

// Ticket tracking endpoint reserved for the backend ticket-status implementation.
export function getTicketStatus(ticketId) {
    return apiFetch(`/api/help-requests/ticket/${encodeURIComponent(ticketId)}`);
}
