<script setup lang="ts">
import { ref } from "vue";
import { version } from "../package.json";
import { mdiOwl, mdiCat, mdiBird, mdiSleep, mdiGithub } from "@mdi/js";
import FeatureToggle from "./components/FeatureToggle.vue";
import { useAddonStore } from "./stores/addon";

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
    </v-app-bar>
    <v-main>
      <v-list select-strategy="independent" density="compact">
        <v-list-subheader>Allgemein</v-list-subheader>
        <v-list-item>
          <v-select
            :items="limitPageWidthOptions"
            label="Maximale Breite der Seite"
            :model-value="addonStore.storage.limitPageWidth"
            hide-details
            @update:modelValue="addonStore.setItem('limitPageWidth', $event)"
          />
        </v-list-item>
        <v-list-subheader>Posts</v-list-subheader>
        <v-list-item>
          <v-select
            :items="postImageHeightLimitOptions"
            label="Maximale Höhe von Bildern"
            :model-value="addonStore.storage.postImageHeightLimit"
            hide-details
            @update:modelValue="
              addonStore.setItem('postImageHeightLimit', $event)
            "
          />
        </v-list-item>
        <FeatureToggle
          prop="hideSignatureImages"
          title="Signaturbilder ausblenden"
          subtitle="Blendet sämtliche Bilder in Signaturen von Posts aus."
          lines="two"
        />
        <v-list-subheader>Navigation</v-list-subheader>
        <FeatureToggle
          prop="fixedNavigationIcons"
          title="Breite der Icons gleichsetzen"
          subtitle="Setzt die Breite aller Icons auf den gleichen Wert, um gleichmäßige Abstände zu erzeugen."
          lines="three"
        />
        <!--        <v-list-subheader>Forenansicht</v-list-subheader>-->
        <!--        <v-list-item @click="toggleProp('hideForumNewsBanner')">-->
        <!--          <template #prepend>-->
        <!--            <v-list-item-action start>-->
        <!--              <v-checkbox-btn :model-value="storage.hideForumNewsBanner" />-->
        <!--            </v-list-item-action>-->
        <!--          </template>-->
        <!--          <v-list-item-title>News-Banner ausblenden</v-list-item-title>-->
        <!--          <v-list-item-subtitle>-->
        <!--            Blendet den großen News-Banner oben auf der Seite aus.-->
        <!--          </v-list-item-subtitle>-->
        <!--        </v-list-item>-->
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
