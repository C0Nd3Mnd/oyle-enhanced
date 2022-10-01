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

  if (storage.replaceLogo) {
    // https://i.imgur.com/otNUb9m.png

    css += `
/* Replace logo with a crappy one */
.p-header-logo > a:nth-child(1) > img:nth-child(1) {
  content: url('${storage.replaceLogo}');
  max-height: 36px;
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

  if (storage.hideForumNewsBanner) {
    css += `
/* Hide forum news banner */
#top > div.p-body > div > div.p-body-main > div.p-body-content > div > div.block.porta-features.porta-features-fix {
  display: none;
}`;
  }

  if (storage.hideSignatureImages) {
    css += `
/* Hide signature images */
.message-signature img {
  display: none;
}`;
  }

  return css;
}

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.sync.get();
  const factory = {
    fixedNavigationIcons: false,
    postImageHeightLimit: false,
    replaceLogo: "",
    limitPageWidth: false,
    hideForumNewsBanner: false,
    hideSignatureImages: false,
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

  // chrome.scripting.removeCSS(
  //   {
  //     css: CSS_TEMP,
  //     target: { tabId },
  //   },
  //   () => {
  //     chrome.scripting.insertCSS(
  //       {
  //         css: CSS_TEMP,
  //         target: { tabId },
  //       },
  //       () => {
  //         console.log("Injected CSS into tab.", tab);
  //       }
  //     );
  //   }
  // );
});
