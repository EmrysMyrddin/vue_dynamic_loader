Vue.component('helloparams-item', {
	template: '<div><h1>Hello {{firstname}} {{lastname}}</h1></div>',

	props   : ['firstname', 'lastname'],
	methods : {},
	computed: {}
});
