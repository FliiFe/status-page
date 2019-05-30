import Vue from 'vue'
import Vuex from 'vuex'

// const PSP_ID = 'NLPAVC3Ov'
// const API_URL = `https://cors-anywhere.herokuapp.com/https://stats.uptimerobot.com/api/status-page/${PSP_ID}/`
const API_URL = (method) => `https://api.uptimerobot.com/v2/${method}`
const API_KEYS = ['m781804470-3666285d01ccbae016c24f62', 'm781804458-4537affcf8190fbd37d61500', 'm782786452-a1524749270d014dfd4b388e']

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        monitors: []
    },
    mutations: {
        addMonitor(state, monitor) {
            const ind = state.monitors.findIndex(({ id }) => id == monitor.id)
            monitor.response_times.sort((d1, d2) => d1.datetime - d2.datetime)
            const sortedValues = monitor.response_times.map(({ value }) => value).sort((a, b) => b - a)
            const median = (sortedValues[(sortedValues.length - 1) >> 1] + sortedValues[sortedValues.length >> 1]) / 2
            monitor.minres = monitor.response_times.reduce((a, { value }) => Math.min(a, value), +Infinity)
            monitor.processed_response_times = monitor.response_times.map(({ datetime, value }) => ({ datetime, value: Math.min(value, 3 * median) - monitor.minres + 10 }))
            if (ind >= 0) {
                Vue.set(state.monitors, ind, monitor)
            } else {
                state.monitors.push(monitor)
            }
        }
    },
    actions: {
        updateMonitors(context) {
            API_KEYS.forEach(key => {
                fetch(API_URL('getMonitors'), {
                    method: 'POST',
                    body: `api_key=${key}&format=json&logs=1&custom_uptime_ratios=7&response_times=1&response_times_average=60`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(r => r.json())
                    .then(k => context.commit('addMonitor', k.monitors[0]))
            })
        }
    },
    getters: {
        globalStatus(state) {
            return state.monitors.reduce((a, v) => a && v.status <= 2, true)
        },
        sortedMonitors(state) {
            return state.monitors.slice(0).sort((m1, m2) => m1.create_datetime - m2.create_datetime)
        }
    },
    strict: true
})
