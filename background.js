browser.contextMenus.create({
  id: "analyze-writing",
  title: "WriteGood - Analyze Writing",
  contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyze-writing") {
    browser.tabs.sendMessage(tab.id, {
      action: "analyzeText",
      text: info.selectionText
    });
  }
}); 