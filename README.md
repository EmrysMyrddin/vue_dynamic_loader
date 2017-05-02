# Loading VueJS components at runtime

VueJS allows to use plugins that need to be declared during the development phase of the application :
https://vuejs.org/v2/guide/plugins.html

But what if you need a dynamic plugins system, which allows you to import components that are not known during development time ?
Or if you just want to manage a mashup interface ?

That's exactly what propose "vue_dynamic_loader" : to add components without having to declare them into your code.
Like a common plugins system, actually.

 - [x] Asynchronously loading of external plugins
 - [x] Take care of props of the plugin
 - [x] Allows several instances of the same plugin
 - [ ] Load several files per plugin
 - [ ] Load and apply scoped CSS

## How to use

-- Work In Progress. Please, have a look at the "example" folder for now --