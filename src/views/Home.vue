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
            <div class="second"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'home',
    methods: {
        update() {
            this.$store.dispatch('updateMonitors');
        }
    },
    mounted() {
        this.update();
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
}

.card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    background-color: white;
    margin-bottom: 16px;
    margin-top: 16px;
    padding: 16px;
}

.card:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
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
    background-color: #00c853;
    box-shadow: 0 0px 3px #00c853;
}

/* paused */
.indicator.status0 {
    background-color: black;
    box-shadow: 0 0px 3px black;
}
</style>
