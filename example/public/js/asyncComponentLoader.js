let loader;

function loadPlugins(vueElementId) {

	loader = new AsyncComponentLoader(vueElementId);

	fetch('/pluginsList')
		.then(function (response) {
			return response.json();
		})
		.then(function (pluginsList) {
			return loader.load(pluginsList);
		})
		.then(function () {
			loader.addPluginsOnView();
			loader.setDataToProps();
		})
		.then(() => startVue())
		.catch(function (err) {
			console.log(err);
		});
}
//todo : idée : avoir un composant "conteneur" qui encapsule tous les autres composants
//todo : idée : utiliser les v-ref

/**
 * Created by gwennael.buchet on 25/04/17.
 */

class AsyncComponentLoader {

	constructor(vueElementId) {
		this.plugins      = [];
		this.vueElementId = vueElementId;
		this._idEltCount  = 0;
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
					//self.addPluginsOnView();
					resolve();
				}, reason => {
					reject(reason);
				});
		})
	}

	addPluginsOnView() {
		//todo : essayer d'utiliser addChild du component global. A voir avec le layout par CSS...
		let vueElt = document.getElementById(this.vueElementId);
		let self   = this;

		this.plugins.forEach(function (plugin) {
			let elt = document.createElement(plugin.eltName);

			//let's generat a unique ID for this HTMLElement
			let idElt = self._getUID(plugin.pluginName);
			elt.setAttribute("id", idElt);
			plugin['idElt'] = idElt;

			vueElt.appendChild(elt);
		});
	}

	setDataToProps() {
		this.plugins.forEach(function (plugin) {
			let elt = document.getElementById(plugin.idElt);

			//add custom atributes from this component to the instanciated element
			for (let attr in plugin.attributes) {
				if (plugin.attributes.hasOwnProperty(attr)) {
					let dataName = "pluginsData." + plugin.pluginName + "_" + attr;

					//app.pluginsData[dataName] = plugin.attributes[attr];
					//Vue.set(dataName, plugin.attributes[attr]);
					//Vue.set(this.contacts[dataName], 'name', this.editPsgName);

					elt.setAttribute(":" + attr, dataName);
				}
			}
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

	_getUID(pluginName) {
		this._idEltCount++;

		let r = Math.random().toString(36).substr(2, 16);
		return pluginName + "_" + r + '_' + this._idEltCount;
	}
}
