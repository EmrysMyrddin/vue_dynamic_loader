function loadPlugins(vueElementId) {
	let loader = new AsyncComponentLoader(vueElementId);

	fetch('/pluginsList')
		.then(function (response) {
			return response.json();
		})
		.then(function (pluginsList) {
			return loader.load(pluginsList);
		})
		.then(function () {
			startVue();
		})
		.catch(function (err) {
			console.log(err);
		});
}

/**
 * Created by gwennael.buchet on 25/04/17.
 */

class AsyncComponentLoader {

	constructor(vueElementId) {
		this.plugins      = [];
		this.vueElementId = vueElementId;
	}

	load(plugins) {
		let self = this;

		this.plugins = plugins;

		return new Promise(function (resolve, reject) {
			let promesses = [];

			plugins.forEach(function (plugin) {
				let p = self._loadScript("js/plugins/" + plugin.pluginName + "/" + plugin.mainFile);
				promesses.push(p);
			});

			Promise
				.all(promesses)
				.then(() => {
					self.addPluginsOnView();
					resolve();
				}, reason => {
					reject(reason);
				});
		})
	}

	addPluginsOnView() {
		let vueElt = document.getElementById(this.vueElementId);
		this.plugins.forEach(function (plugin) {
			let elt = document.createElement(plugin.eltName);

			//add custom atributes from this component to the instanciated element
			/*for (let attr in plugin.attributes) {
				if (plugin.attributes.hasOwnProperty(attr)) {
					let dataName = "" + plugin.pluginName + "_" + attr;

					app.pluginsData[dataName] = plugin.attributes[attr];

					elt.setAttribute(":" + attr, "pluginsData[" + dataName + "]");
				}
			}*/

			vueElt.appendChild(elt);
		});
	}

	_loadScript(src) {
		return new Promise(function (resolve, reject) {
			let script     = document.createElement('script');
			script.src     = src;
			script.async   = true;
			script.onload  = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}
}