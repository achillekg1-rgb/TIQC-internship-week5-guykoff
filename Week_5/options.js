document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save-button').addEventListener('click', saveOptions);

// Saves options to chrome.storage.local
function saveOptions() {
  const apiKey = document.getElementById('api-key').value;
  chrome.storage.local.set(
    {
      translationApiKey: apiKey
    },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'API Key saved!';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
}

// Restores input field state using the preferences stored in chrome.storage.local.
function restoreOptions() {
  chrome.storage.local.get(
    {
      translationApiKey: '' // Default value if not set
    },
    (items) => {
      document.getElementById('api-key').value = items.translationApiKey;
    }
  );
}