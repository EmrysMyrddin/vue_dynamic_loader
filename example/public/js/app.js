'use strict';

/*-----------------
 Filters
 -----------------*/

Vue.filter('uppercase', function (value) {
    return value.toUpperCase();
});

/*-----------------
 APP
 -----------------*/
function startVue() {
    new Vue({

        // We want to target the div with an id of 'componentsList'
        el: '#componentsList',

        data: {
            plugins: []
        },

        created: function () {
        },

        methods: {},

        computed: {}
    });
}
