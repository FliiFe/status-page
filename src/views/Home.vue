<template>
  <div class="home">
    <h1 @click="update()">{{$store.getters.globalStatus ? "•ᴗ•" : "ಠ_ಠ"}}</h1>
    <div class="card" v-for="monitor in $store.getters.sortedMonitors" v-bind:key="monitor.id">
      <div class="first">
        <div>{{monitor.friendly_name}}</div>
        <div>
          {{monitor.custom_uptime_ratio.split('-')[0]}}%
          <div :class="['indicator', 'status' + monitor.status]"></div>
        </div>
      </div>
      <div class="second">
        <la-cartesian :data="monitor.processed_response_times" :padding="2" autoresize>
          <defs>
            <linearGradient id="color-id" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#2c3e50"></stop>
              <stop offset="0.5" stop-color="#42b983"></stop>
              <stop offset="1" stop-color="#6fa8dc"></stop>
            </linearGradient>
            <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#2c3e50" stop-opacity="0.4"></stop>
              <stop offset="0.5" stop-color="#42b983" stop-opacity="0.2"></stop>
              <stop offset="1" stop-color="#6fa8dc" stop-opacity="0"></stop>
            </linearGradient>
          </defs>
          <la-x-axis prop="datetime" :ticks="[]" color="rgba(0,0,0,0)"></la-x-axis>
          <la-area
            fill-color="url(#area-fill)"
            curve
            animated
            :width="2"
            prop="value"
            color="url(#color-id)"
          ></la-area>
          <la-tooltip animated>
            <div class="tooltip" slot-scope="props">
              <div
                :key="item.value"
                v-for="item in props.actived"
                v-show="item.value"
                ><p class="time">{{getTimeFromUnix(+props.label)}}</p> — {{ item.value - 10 + monitor.minres }}ms</div>
            </div>
          </la-tooltip>
        </la-cartesian>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'home',
    methods: {
        update() {
            this.$store.dispatch('updateMonitors');
        },
        getTimeFromUnix(unix) {
            const pad = str => ('000' + str.toString()).slice(-2);
            const date = new Date(unix * 1e3);
            return `${pad(date.getHours().toString())}:${pad(
                date.getMinutes()
            )}`;
        }
    },
    mounted() {
        this.update();
        setInterval(this.update, 60e3);
    }
};
</script>

<style>
h1 {
    margin: 0 auto;
    display: block;
    width: fit-content;
    font-size: 50pt;
    margin-top: 40px;
    min-height: 100px;
}

.first {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid #aaa;
    padding: 16px;
}

.second {
    padding: 0;
    padding-top: 16px;
}

.tooltip {
    background: rgba(0.5, 0.5, 0.5, 0.5);
    padding: 4px;
    border-radius: 3px;
    color: white;
}

.tooltip p {
    display: inline;
    font-weight: bold;
}

.card {
    border-radius: 4px;
    border: 1px solid #aaa;
    margin-bottom: 16px;
    margin-top: 16px;
    padding: 0;
}

.indicator {
    display: inline-block;
    background: red;
    width: 15px;
    height: 15px;
    border-radius: 10px;
    margin-left: 8px;
}

/* monitor is down */
.indicator.status9,
.indicator.status8 {
    background-color: #d50000;
    box-shadow: 0 0px 3px #d50000;
}

/* monitor is up */
.indicator.status2 {
    background-color: #42b983;
    box-shadow: 0 0px 3px #42b983;
}

/* paused */
.indicator.status0 {
    background-color: black;
    box-shadow: 0 0px 3px black;
}
</style>
