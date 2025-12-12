const CACHE_TTL_HOURS = 24; 
const CACHE_SIZE_CAP = 500; 
const CACHE_KEY_PREFIX = "translation-cache-"; 


/**
 *
 * @param {string} input
 * @returns {Promise<string>}
 */
async function hashKey(input) {
    const sanitized = input.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return CACHE_KEY_PREFIX + sanitized.substring(0, 128); 
}

/**
 * @param {string} text
 * @returns {Promise<string>}
 */
async function translate(text) {
    const items = await chrome.storage.local.get('translationApiKey');
    const apiKey = items.translationApiKey;

    if (!apiKey) {
        return "ERROR: API Key is missing. Please set it in the Extension Options.";
    }


    if (apiKey.includes("invalid")) { 
        return "ERROR: API Key appears invalid or usage quota exceeded.";
    }

    console.log(`Translating using key: ${apiKey.substring(0, 5)}...`);
    
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    if (!text.trim()) {
        return "Please select some text to translate.";
    }

    const truncatedText = text.length > 30 ? text.substring(0, 30) + "..." : text;
    
    return `[API Used] Translation of "${truncatedText}" completed.`;
}

async function cleanupCache() {
    const allItems = await chrome.storage.local.get(null);
    let keysToDelete = [];
    let cacheKeys = [];

    for (const key in allItems) {
        if (key.startsWith(CACHE_KEY_PREFIX)) {
            cacheKeys.push({ key: key, timestamp: allItems[key].timestamp });
        }
    }
    
    const cutoffTime = Date.now() - (CACHE_TTL_HOURS * 60 * 60 * 1000);
    cacheKeys.forEach(item => {
        if (item.timestamp < cutoffTime) {
            keysToDelete.push(item.key);
        }
    });

    if (cacheKeys.length - keysToDelete.length > CACHE_SIZE_CAP) {
        const remainingKeys = cacheKeys.filter(item => !keysToDelete.includes(item.key))
                                       .sort((a, b) => a.timestamp - b.timestamp);
                                       
        const overflowCount = remainingKeys.length - CACHE_SIZE_CAP;
        if (overflowCount > 0) {
            keysToDelete.push(...remainingKeys.slice(0, overflowCount).map(item => item.key));
        }
    }

    if (keysToDelete.length > 0) {
        await chrome.storage.local.remove(keysToDelete);
        console.log(`Cleaned up ${keysToDelete.length} cache entries.`);
    }
}




chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "translate-selection",
        title: "Translate selection",
        contexts: ["selection"]
    });

    cleanupCache();
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== "translate-selection") return;
    
    const text = info.selectionText || "";
    if (!text) return;


    cleanupCache(); 
    
    const key = await hashKey(tab.url + "::" + text); 
    

    const cachedItem = await chrome.storage.local.get(key);
    let translated = null;
    let cacheHit = false;

    if (cachedItem[key] && cachedItem[key].translation) {
        const age = Date.now() - cachedItem[key].timestamp;
        if (age < CACHE_TTL_HOURS * 60 * 60 * 1000) {
            translated = cachedItem[key].translation;
            cacheHit = true;
            console.log("Cache Hit for key:", key);
        } else {
            console.log("Cache entry expired for key:", key);
        }
    } 

    if (!translated) {

        translated = await translate(text);
        

        await chrome.storage.local.set({ 
            [key]: {
                translation: translated,
                timestamp: Date.now()
            }
        });
        console.log("Cache Miss: New translation stored for key:", key);
    }
    
    const finalTranslation = cacheHit 
        ? `[Cache Hit] ${translated}` 
        : translated;

    chrome.tabs.sendMessage(tab.id, { 
        type: "SHOW_TRANSLATION", 
        text: finalTranslation 
    });
});