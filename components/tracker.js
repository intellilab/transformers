export default {
  methods: {
    onVisibilityChange() {
      if (document.visibilityState === 'visible') this.tracker.track();
      else this.tracker.revoke();
    },
  },
  mounted() {
    const tracker = {
      track() {
        tracker.revoke();
        tracker.timer = setTimeout(() => {
          _hmt.push(['_trackEvent', 'action', 'stay']);
          tracker.timer = null;
        }, 10 * 1000);
      },
      revoke() {
        if (tracker.timer) {
          clearTimeout(tracker.timer);
          tracker.timer = null;
        }
      },
    };
    tracker.track();
    this.tracker = tracker;
    window.addEventListener('visibilitychange', this.onVisibilityChange, false);
  },
  beforeDestroy() {
    this.tracker.revoke();
    window.removeEventListener('visibilitychange', this.onVisibilityChange, false);
  },
};