async function buildCSS() {
  const storage = await chrome.storage.sync.get();

  let css = "";

  if (storage.fixedNavigationIcons) {
    css += `
/* Navigation bar equal icon width */
.p-navEl-icon > i.fa--xf {
  text-align: center;
  width: 1.25em;
}`;
  }

  if (storage.postImageHeightLimit) {
    css += `
/* Max height for images embedded in posts */
img.bbImage {
  max-height: ${storage.postImageHeightLimit};
  width: auto;
}`;
  }

  if (storage.limitPageWidth) {
    css += `
/* Max width */
div.p-header-inner,
div.p-nav-inner,
div.p-sectionLinks-inner,
div.p-body-inner,
div.p-footer-inner {
  max-width: ${storage.limitPageWidth};
}`;
  }

  if (storage.hideSignatureImages) {
    css += `
/* Hide signature images */
.message-signature img {
  display: none;
}`;
  }

  switch (storage.topicNavigationMode) {
    case "simple":
      css += `
/* Force display simple nav */
.pageNavWrapper.pageNavWrapper--mixed .pageNav {
  display: none;
}

.pageNavWrapper.pageNavWrapper--mixed .pageNavSimple {
  display: inline-flex;
}`;
      break;
    case "advanced":
      css += `
/* Force display advanced nav */
.pageNavWrapper.pageNavWrapper--mixed .pageNav {
  display: block;
}

.pageNavWrapper.pageNavWrapper--mixed .pageNavSimple {
  display: none;
}`;
      break;
  }

  return css;
}

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.sync.get();
  const factory = {
    fixedNavigationIcons: false,
    postImageHeightLimit: false,
    limitPageWidth: false,
    hideSignatureImages: false,
    topicNavigationMode: false,
  };

  chrome.storage.sync.set({
    ...factory,
    ...existing,
  });

  // Remove existing keys that are no longer in use.
  const factoryKeys = Object.keys(factory);
  const obsoleteKeys = Object.keys(existing).filter(
    (x) => !factoryKeys.includes(x)
  );
  chrome.storage.sync.remove(obsoleteKeys);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab.url || changeInfo.status !== "loading") {
    return;
  }

  const url = new URL(tab.url);

  if (url.hostname !== "oyle-community.de") {
    return;
  }

  chrome.scripting.insertCSS(
    {
      css: await buildCSS(),
      target: { tabId },
      origin: "AUTHOR",
    },
    () => {
      console.log(`Injected CSS into tab ${tabId}.`, changeInfo, tab);
    }
  );
});
