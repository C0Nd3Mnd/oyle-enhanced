<script setup lang="ts">
import { computed, ref } from "vue";
import { version } from "../package.json";
import {
  mdiOwl,
  mdiCat,
  mdiBird,
  mdiSleep,
  mdiGithub,
  mdiFormatSize,
  mdiCog,
  mdiInformation,
  mdiCardText,
} from "@mdi/js";
import { useAddonStore } from "./stores/addon";
import FeatureToggle from "./components/FeatureToggle.vue";
import TabGeneral from "./components/TabGeneral.vue";
import TabPosts from "./components/TabPosts.vue";

const topicNavigationModeOptions = [
  {
    title: "Standard",
    value: false,
  },
  {
    title: "Einfach",
    value: "simple",
  },
  {
    title: "Erweitert",
    value: "advanced",
  },
];

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
      easterEggIcon.value = mdiSleep;
      break;
    case mdiSleep:
      easterEggIcon.value = mdiBird;
      break;
    case mdiBird:
      easterEggIcon.value = mdiCat;
      break;
    case mdiCat:
      easterEggIcon.value = mdiOwl;
      break;
  }
}

const addonStore = useAddonStore();

const tabs = [
  {
    name: "general",
    label: "Allgemein",
    icon: mdiCog,
  },
  {
    name: "posts",
    label: "Posts",
    icon: mdiCardText,
  },
  {
    name: "font",
    label: "Schriftart",
    icon: mdiFormatSize,
  },
  {
    name: "information",
    label: "Informationen",
    icon: mdiInformation,
  },
];

const activeTab = ref("general");
const activeTabTitle = computed(
  () => tabs.find((tab) => tab.name === activeTab.value)?.label
);
</script>

<template>
  <v-layout>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-nav-icon :icon="easterEggIcon" @click="easterEgg" />
      <v-app-bar-title>Oyle Enhanced</v-app-bar-title>
      <v-btn @click="reload">
        Neu laden
        <v-tooltip activator="parent" location="bottom">
          Lädt alle im Browser geöffneten oyle-community.de Tabs neu.
        </v-tooltip>
      </v-btn>

      <template #extension>
        <v-tabs v-model="activeTab" grow density="compact">
          <v-tab v-for="tab in tabs" :key="tab.name" :value="tab.name">
            <v-icon>{{ tab.icon }}</v-icon>
            <v-tooltip activator="parent" location="bottom">
              {{ tab.label }}
            </v-tooltip>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <h6 class="text-h6 px-4 pb-0 pt-2">{{ activeTabTitle }}</h6>
      <v-window v-model="activeTab">
        <v-window-item value="general">
          <TabGeneral />
        </v-window-item>
        <v-window-item value="posts">
          <TabPosts />
        </v-window-item>
        <v-window-item value="font">Schriftart</v-window-item>
        <v-window-item value="about">Informationen</v-window-item>
      </v-window>
      <v-list select-strategy="independent" density="compact">
        <v-list-subheader>Themen</v-list-subheader>
        <v-list-item>
          <v-select
            :items="topicNavigationModeOptions"
            label="Navigationsmodus"
            :model-value="addonStore.storage.topicNavigationMode"
            hide-details
            @update:modelValue="
              addonStore.setItem('topicNavigationMode', $event)
            "
          />
        </v-list-item>
      </v-list>
      <v-footer app class="pa-0">
        <div class="px-4 py-2 bg-secondary w-100 d-flex">
          <span>
            Version {{ version }}, erstellt von
            <a
              href="https://oyle-community.de/index.php?members/sleeping_bird.8/"
              target="_blank"
              class="text-accent"
            >
              Sleeping_bird
            </a>
          </span>
          <v-spacer />
          <a
            href="https://github.com/C0Nd3Mnd/oyle-enhanced"
            title="GitHub"
            target="_blank"
            class="text-white"
          >
            <v-icon>{{ mdiGithub }}</v-icon>
          </a>
        </div>
      </v-footer>
    </v-main>
  </v-layout>
</template>
