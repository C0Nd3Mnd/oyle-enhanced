<script setup lang="ts">
import { ref } from "vue";
import { version } from "../package.json";
import { mdiOwl, mdiCat, mdiBird } from "@mdi/js";

const postImageHeightLimitOptions = [
  {
    title: "Standard",
    value: false,
  },
  {
    title: "400px",
    value: "400px",
  },
  {
    title: "600px",
    value: "600px",
  },
  {
    title: "800px",
    value: "800px",
  },
  {
    title: "Unbegrenzt",
    value: "unset",
  },
];

const limitPageWidthOptions = [
  {
    title: "Standard",
    value: false,
  },
  {
    title: "1200px",
    value: "1200px",
  },
  {
    title: "1400px",
    value: "1400px",
  },
  {
    title: "1600px",
    value: "1600px",
  },
  {
    title: "Unbegrenzt",
    value: "unset",
  },
];

const storage = ref<{ [key: string]: any }>({});

chrome.storage.sync.get((items) => {
  storage.value = items;
});

function toggleProp(prop: string) {
  console.log("PROP UPDATE", prop);
  storage.value[prop] = !storage.value[prop];

  chrome.storage.sync.set({ [prop]: storage.value[prop] });
}

function setPropString(prop: string, value: string) {
  storage.value[prop] = value;

  chrome.storage.sync.set({ [prop]: storage.value[prop] });
}

async function reload() {
  const tabs = await chrome.tabs.query({
    url: "*://*.oyle-community.de/*",
  });

  for (const tab of tabs) {
    if (!tab.id) {
      continue;
    }

    chrome.tabs.reload(tab.id);
  }
}

const easterEggIcon = ref(mdiOwl);

function easterEgg() {
  switch (easterEggIcon.value) {
    case mdiOwl:
      easterEggIcon.value = mdiCat;
      break;
    case mdiCat:
      easterEggIcon.value = mdiBird;
      break;
    case mdiBird:
      easterEggIcon.value = mdiOwl;
      break;
  }
}
</script>

<template>
  <v-layout>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-nav-icon :icon="easterEggIcon" @click="easterEgg" />
      <v-app-bar-title>Oyle Enhanced</v-app-bar-title>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-list lines="two" select-strategy="independent" density="compact">
        <v-list-subheader>Allgemein</v-list-subheader>
        <v-list-item>
          <v-select
            :items="limitPageWidthOptions"
            label="Maximale Breite der Seite"
            :model-value="storage.limitPageWidth"
            @update:modelValue="setPropString('limitPageWidth', $event)"
          />
        </v-list-item>
        <v-list-subheader>Posts</v-list-subheader>
        <v-list-item>
          <v-select
            :items="postImageHeightLimitOptions"
            label="Maximale Höhe von Bildern"
            :model-value="storage.postImageHeightLimit"
            @update:modelValue="setPropString('postImageHeightLimit', $event)"
          />
        </v-list-item>
        <v-list-subheader>Navigation</v-list-subheader>
        <v-list-item @click="toggleProp('fixedNavigationIcons')">
          <template #prepend>
            <v-list-item-action start>
              <v-checkbox-btn :model-value="storage.fixedNavigationIcons" />
            </v-list-item-action>
          </template>
          <v-list-item-title>Breite der Icons gleichsetzen</v-list-item-title>
          <v-list-item-subtitle>
            Setzt die Breite aller Icons auf den gleichen Wert, um gleichmäßige
            Abstände zu erzeugen.
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-subheader>Forenansicht</v-list-subheader>
        <v-list-item @click="toggleProp('hideForumNewsBanner')">
          <template #prepend>
            <v-list-item-action start>
              <v-checkbox-btn :model-value="storage.hideForumNewsBanner" />
            </v-list-item-action>
          </template>
          <v-list-item-title>News-Banner ausblenden</v-list-item-title>
          <v-list-item-subtitle>
            Blendet den großen News-Banner oben auf der Seite aus.
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-container fluid>
        <v-row>
          <v-col align="right">
            <v-btn color="primary" @click="reload">Neu laden</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-footer class="pa-0">
        <div class="px-4 py-2 bg-secondary text-center w-100">
          Version {{ version }}, erstellt von
          <a
            href="https://oyle-community.de/index.php?members/sleeping_bird.8/"
            target="_blank"
            class="text-accent"
          >
            Sleeping_bird
          </a>
        </div>
      </v-footer>
    </v-main>
  </v-layout>
</template>
