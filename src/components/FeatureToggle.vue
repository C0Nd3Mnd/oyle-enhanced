<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";

const value = ref(false);

onMounted(() => {
  chrome.storage.sync.get((items) => {
    value.value = items[props.prop];
  });
});

const props = defineProps({
  prop: {
    type: String,
    required: true,
  },
});

function toggleProp(prop: string) {
  value.value = !value.value;

  chrome.storage.sync.set({ [props.prop]: value.value });
}
</script>

<template>
  <v-list-item v-bind="$props" @click="toggleProp(props.prop)">
    <template #prepend>
      <v-list-item-action start>
        <v-checkbox-btn :model-value="value" />
      </v-list-item-action>
    </template>
  </v-list-item>
</template>
