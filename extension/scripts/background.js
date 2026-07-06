chrome.action.onClicked.addListener(async (tab) => {
    try {
        await chrome.sidePanel.open({
            tabId: tab.id
        });
    } catch (error) {
        console.error('Failed to open side panel:', error);
    }
});