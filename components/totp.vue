<template>
  <div class="flex items-center">
    <div class="p-2 text-green-600" v-text="value"></div>
    <div class="w-6 h-6 leading-6 text-center text-xs border border-gray-400 rounded-full" v-text="count"></div>
  </div>
</template>

<script>
import { TOTP } from 'otpauth';

export default {
  props: ['data'],
  data() {
    return {
      count: 0,
      value: '',
    };
  },
  computed: {
    options() {
      return {
        ...this.data,
        label: this.data.label || '',
        algorithm: this.data.algorithm || 'sha1',
        digits: +this.data.digits || 6,
        period: +this.data.period || 30,
      };
    },
    totp() {
      try {
        return new TOTP(this.options);
      } catch {
        return null;
      }
    },
  },
  watch: {
    totp: 'update',
  },
  methods: {
    updateCount() {
      const epoch = Math.round(Date.now() / 1000);
      const { period } = this.options;
      this.count = period - epoch % period;
      if (this.count === period) this.update();
    },
    update() {
      try {
        this.value = this.totp.generate();
      } catch {
        this.value = '??????';
      }
    },
  },
  mounted() {
    this.timer = setInterval(this.updateCount, 1000);
    this.updateCount();
    this.update();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
