'use strict';

/*-----------------
 Filters
 -----------------*/
/*
Vue.filter('uppercase', function (value) {
    return value.toUpperCase();
});*/

/*-----------------
 APP
 -----------------*/

let app = null;

function startVue() {
    app = new Vue({
        // We want to target the div with an id of 'componentsList'
        el: '#componentsList',

        data: {
            pluginsData : {}
        },

        created: function () {
          loader.plugins.forEach((plugin) => {
      			for (let attr in plugin.attributes) {
      				if (plugin.attributes.hasOwnProperty(attr)) {
      					this.pluginsData[plugin.pluginName + "_" + attr] = plugin.attributes[attr];
      				}
      			}
      		});
        },
        computed: {
        }
    });
}
