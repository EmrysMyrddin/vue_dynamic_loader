/**
 * Created by gwennael.buchet on 25/04/17.
 */

function loadPlugins() {
    fetch('http://localhost:8090/pluginsList')
        .then(function (response) {
            return response.json();
        })
        .then(function (pluginsList) {
            let loader = new AsyncComponentLoader();
            return loader.load(pluginsList);
        })
        .then(function (response) {
            console.log(response);
            toto();
            startVue();
        })
        .catch(function (err) {
            console.log(err);
        });
}

class AsyncComponentLoader {

    constructor() {
    }

    load(plugins) {
        let self = this;

        return new Promise(function (resolve, reject) {
            let promesses = [];

            plugins.forEach(function (plugin) {
                let p = self.loadScript("js/plugins/" + plugin.name + "/" + plugin.mainFile);
                promesses.push(p);
            });

            Promise
                .all(promesses)
                .then(values => {
                    resolve(values);
                }, reason => {
                    reject(reason);
                });
        })
    }


    loadScript(src) {
        return new Promise(function (resolve, reject) {
            let script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}