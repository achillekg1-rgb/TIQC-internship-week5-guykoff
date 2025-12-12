// --- Helper Functions ---

/**
 * Basic hashing function to create a cache key from text.
 * Note: A real-world hash would use a crypto library, but this is simple for MVP.
 * @param {string} input - The text to hash (e.g., URL + "::" + selectionText).
 * @returns {Promise<string>}
 */
async function hashKey(input) {
    // Replace non-alphanumeric with hyphens and truncate to a max length
    const sanitized = input.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return sanitized.substring(0, 128); 
}

/**
 * Mock translation function for MVP.
 * STRETCH: Replace this with an actual API call (and rate-limit logic).
 * @param {string} text - The text to translate.
 * @returns {Promise<string>} - A mocked translation result.
 */
async function translate(text) {
    console.log(`Translating: "${text}"`);
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    // Simple mock translation logic
    if (!text.trim()) {
        return "Please select some text to translate.";
    }
    const maxLength = 30;
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    
    // Return a mocked translated string
    return `[Mock Translation]: "${truncatedText}" has been translated successfully! (Cache Miss)`;
}


// --- Main Extension Logic ---

chrome.runtime.onInstalled.addListener(() => {
    // Creates the "Translate selection" option in the context menu
    chrome.contextMenus.create({
        id: "translate-selection",
        title: "Translate selection",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== "translate-selection") return;
    
    const text = info.selectionText || "";

    const key = await hashKey(tab.url + "::" + text); 
    
    const cached = await chrome.storage.local.get(key);
    let translated = cached[key];
    let cacheHit = false;

    if (translated) {
        cacheHit = true;
        console.log("Cache Hit for key:", key);
    } else {
        translated = await translate(text);
        
        await chrome.storage.local.set({ [key]: translated });
        console.log("Cache Miss: Translation stored for key:", key);
    }
    
    const finalTranslation = cacheHit 
        ? `[Cache Hit] ${translated}` 
        : translated;

    chrome.tabs.sendMessage(tab.id, { 
        type: "SHOW_TRANSLATION", 
        text: finalTranslation 
    });
});