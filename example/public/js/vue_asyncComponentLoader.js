let asyncComponentLoader;

//todo :
// - check with multiple props per plugin
// - load and apply CSS
// - let plgins path to be configurable
// - let maintain a list of component loaded to be used by the main application

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
			 "files"  : ["helloparams.component.js"],
			 "cssFiles" : ["style.css"], //optional
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

				//load JavaScript files

				//if there is just 1 file declared and it's not in an array, let's create a new one with only 1 value
				if (!Array.isArray(plugin.files))
					plugin.files = [plugin.files];

				plugin.files.forEach(function (file) {
					let p = self._loadScript("js/plugins/" + plugin.pluginName + "/" + file);
					promesses.push(p);
				});

				//load CSS files
				if (plugin.cssFiles !== undefined && plugin.cssFiles !== null) {
					if (!Array.isArray(plugin.cssFiles))
						plugin.cssFiles = [plugin.cssFiles];

					plugin.cssFiles.forEach(function (file) {
						let p = self._loadStyle("js/plugins/" + plugin.pluginName + "/" + file);
						promesses.push(p);
					});
				}
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

	//todo: "makeLoadPromise" function to create a promise to load scripts and style files

	/**
	 * Populate all the props for all loaded plugins, with values declared in the JSON file.
	 * @param vm {Vue} Reference to the Vue app
	 */
	setPropsValues(vm) {
		this.plugins.forEach(function (plugin) {
			let elt = document.getElementById(plugin.idElt);

			//add custom atributes from this component to the instanciated element
			for (let attr in plugin.propsValues) {
				if (plugin.propsValues.hasOwnProperty(attr)) {
					let attrName = plugin.pluginName + "_" + attr + "_" + plugin.idElt;
					let dataName = "pluginsData." + attrName;

					elt.setAttribute(":" + attr, dataName);

					vm.pluginsData[attrName] = plugin.propsValues[attr];
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
	 * Load a CSS file into the DOM
	 * @param filepath {String} full file path and name
	 * @returns {Promise}
	 * @private
	 */
	_loadStyle(filepath) {
		return new Promise(function (resolve, reject) {
			let style     = document.createElement('link');
			style.rel     = "stylesheet";
			style.href     = filepath;
			style.async   = true;
			style.onload  = resolve;
			style.onerror = reject;
			document.head.appendChild(style);
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
