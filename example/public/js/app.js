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
new Vue({

    // We want to target the div with an id of 'componentsList'
    el: '#componentsList',

    data: {
        plugins: []
    },

    created: function () {
        this.$http.get('/pluginsList')
            .then(response => {
                this.plugins = response.body;

                console.log(this.plugins);
            }, response => {
                // error callback
            });
    },

    methods: {},

    computed: {}
});
