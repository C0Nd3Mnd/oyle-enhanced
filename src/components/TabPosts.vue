<script setup lang="ts">
import { useAddonStore } from "../stores/addon";

const addonStore = useAddonStore();

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
</script>

<template>
  <v-list select-strategy="independent" density="compact">
    <v-list-subheader>Posts</v-list-subheader>
    <v-list-item>
      <v-select
        :items="postImageHeightLimitOptions"
        label="Maximale Höhe von Bildern"
        :model-value="addonStore.storage.postImageHeightLimit"
        hide-details
        @update:modelValue="addonStore.setItem('postImageHeightLimit', $event)"
      />
    </v-list-item>
    <FeatureToggle
      prop="hideSignatureImages"
      title="Signaturbilder ausblenden"
      subtitle="Blendet sämtliche Bilder in Signaturen von Posts aus."
      lines="two"
    />
  </v-list>
</template>
