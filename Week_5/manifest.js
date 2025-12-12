{
    "manifest_version": 3,
    "name": "Week5 Translator",
    "version": "1.0.0",
    "action": { "default_popup": "popup.html" },
    "permissions": ["activeTab", "scripting", "storage", "contextMenus"],
    "background": { "service_worker": "background.js" },
    "content_scripts": [{
        "matches": ["<all_urls>"],
        "js": ["content.js"],
        "run_at": "document_idle"
    }],
    "options_page": "options.html"
}
