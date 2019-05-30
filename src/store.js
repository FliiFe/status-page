import Vue from 'vue'
import Vuex from 'vuex'

// const PSP_ID = 'NLPAVC3Ov'
// const API_URL = `https://cors-anywhere.herokuapp.com/https://stats.uptimerobot.com/api/status-page/${PSP_ID}/`
const API_URL = (method) => `https://api.uptimerobot.com/v2/${method}`
const API_KEYS = ['m781804470-3666285d01ccbae016c24f62', 'm781804458-4537affcf8190fbd37d61500']

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        monitors: []
    },
    mutations: {
        addMonitor(state, monitor) {
            const ind = state.monitors.findIndex(({ id }) => id == monitor.id)
            if (ind >= 0) {
                Vue.set(state.monitors, ind, monitor)
            } else {
                state.monitors.push(monitor)
            }
        }
    },
    actions: {
        updateMonitors(context) {
            // fetch(API_URL + '1?sort=1').then(response => response.json())
            //     .then(result => result.psp.monitors.forEach(monitor => context.commit('addMonitor', monitor)) || console.log(result))
            API_KEYS.forEach(key => {
                fetch(API_URL('getMonitors'), {
                    method: 'POST',
                    body: `api_key=${key}&format=json&logs=1&custom_uptime_ratios=7`,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(r => r.json())
                    .then(k => context.commit('addMonitor', k.monitors[0]))
            })
        }
    },
    getters: {
        globalStatus (state) {
            return state.monitors.reduce((a, v) => a && v.status <= 2, true)
        },
        sortedMonitors (state) {
            return state.monitors.slice(0).sort((m1, m2) => m1.friendly_name > m2.friendly_name)
        }
    },
    strict: true
})
