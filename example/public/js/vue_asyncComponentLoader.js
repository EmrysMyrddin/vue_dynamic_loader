let asyncComponentLoader;

//todo :
// - check with multiple props per plugin
// - check with complex props values
// - load multiple files per plugin
// - load and apply CSS

function asyncLoadPlugins(vueElementId) {

	asyncComponentLoader = new Vue_AsyncComponentLoader(vueElementId);

	fetch('/pluginsList')
		.then(function (response) {
			return response.json();
		})
		.then(function (pluginsList) {
			/*
			 "pluginsList" is a JSON of this shape :
			 [
				 {
					 "pluginName": "helloparams",
					 "eltName"   : "helloparams-item",
					 "mainFile"  : "helloparams.component.js",
					 "attributes": {
					    "firstname" : "Marcel"
				    }
				 }
			 ]
			 */
			return asyncComponentLoader.load(pluginsList);
		})
		//Now that components are loaded into the DOM and Components are loaded, Vue app can be started
		.then(() => startVue())
		.catch(function (err) {
			console.log(err);
		});
}

/**
 * Created by gwennael.buchet on 25/04/17.
 */
class Vue_AsyncComponentLoader {

	/**
	 *
	 * @param vueElementId {String} ID of the HTML element that will encapsulate the Components
	 */
	constructor(vueElementId) {
		this.plugins       = [];
		this._vueElementId = vueElementId;
		this._idEltCount   = 0;
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
					self._addPluginsOnView();
					resolve();
				}, reason => {
					reject(reason);
				});
		})
	}

	/**
	 * Populate all the props for all loaded plugins, with values declared in the JSON file.
	 * @param vm {Vue} Reference to the Vue app
	 */
	setData(vm) {
		this.plugins.forEach(function (plugin) {
			let elt = document.getElementById(plugin.idElt);

			//add custom atributes from this component to the instanciated element
			for (let attr in plugin.attributes) {
				if (plugin.attributes.hasOwnProperty(attr)) {
					let attrName = plugin.pluginName + "_" + attr + "_" + plugin.idElt;
					let dataName = "pluginsData." + attrName;

					elt.setAttribute(":" + attr, dataName);

					vm.pluginsData[attrName] = plugin.attributes[attr];
				}
			}
		});
	}

	/**
	 *
	 * @private
	 */
	_addPluginsOnView() {
		let vueElt = document.getElementById(this._vueElementId);
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

	/**
	 * Load a JS script file into the DOM
	 * @param filepath {String} full file path and name
	 * @returns {Promise}
	 * @private
	 */
	_loadScript(filepath) {
		return new Promise(function (resolve, reject) {
			let script     = document.createElement('script');
			script.src     = filepath;
			script.async   = true;
			script.onload  = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}

	/**
	 * Generate a unique ID for the plugin with the name passed as parameter
	 * @param pluginName {String}
	 * @returns {string} an unique ID
	 * @private
	 */
	_getUID(pluginName) {
		this._idEltCount++;

		let r = Math.random().toString(32).substr(4, 24);
		return pluginName + "_" + r + '_' + this._idEltCount;
	}
}
