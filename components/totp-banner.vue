<template>
  <div class="flex items-center">
    <div class="p-2 text-green-600" v-text="state.value"></div>
    <div class="w-6 h-6 leading-6 text-center text-xs border border-gray-400 rounded-full" v-text="state.count"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, watch } from 'vue';
import { TOTP } from 'otpauth';

const props = defineProps<{
  data: {
    label?: string;
    algorithm?: string;
    digits?: number;
    period?: number;
  };
}>();

const state = reactive({
  count: 0,
  value: '',
});

const options = computed(() => ({
  ...props.data,
  label: props.data.label || '',
  algorithm: props.data.algorithm || 'sha1',
  digits: +props.data.digits || 6,
  period: +props.data.period || 30,
}));

let totp: TOTP;
watch(options, (options) => {
  try {
    totp = new TOTP(options);
    update();
  } catch {
    totp = null;
  }
});

function update() {
  try {
    state.value = totp.generate();
  } catch {
    state.value = '??????';
  }
}

function updateCount() {
  const epoch = Math.round(Date.now() / 1000);
  const { period } = options.value;
  state.count = period - epoch % period;
  if (state.count === period) update();
}

let timer: number;
onMounted(() => {
  timer = setInterval(updateCount, 1000);
  updateCount();
  update();
})
onUnmounted(() => {
  clearInterval(timer);
});
</script>
