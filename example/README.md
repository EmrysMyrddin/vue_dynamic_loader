## A sample project using the components loader

**"Vue_AsyncComponentLoader"** is, as for now, in the "vue_asyncComponentLoader.js" file.

This sample application is composed with :
 * A NodeJS Server which expose, via a REST service, a list of plugins to be loaded into the front
 * A dynamic VueJS front application 

### Install
```yarn install```

### Start
```yarn start```

then go to ```localhost:8080``` to access website

To get the list of plugins that will be loaded at runtime :

 ```http://localhost:8080/pluginsList```

### What does it do
 1. As the front starts, it requests plugins to be loaded from the server (a simple JSON list).
 1. Server returns the list as a JSON.
 1. Front website uses **"Vue_AsyncComponentLoader"** to load and instanciate all plugin components just before the Vue app is loaded.
 1. After Vue app is created (via its "created" function), it calls "" from **"Vue_AsyncComponentLoader"**
 
 

