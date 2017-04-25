## A sample project using the components loader

### Install
```yarn install```

### Start
```yarn start```

then go to ```localhost:8090``` to access website

To get list of plugins that will be loaded at runtime :

 ```http://localhost:8090/pluginsList```

### What does it do
 1. As the front starts, it requests plugins to be loaded from the server (a simple NodeJS server)
 1. Server returns a list of plugins to be loaded by the front
 1. Front website loads all plugins
 1. Front webapp run a new VueJS app
 
 

