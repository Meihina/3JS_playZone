import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'Home',
		redirect: '/DoodleNormal'
	},
	{
		path: '/Bezier',
		name: 'Bezier',
		component: () => import(/* webpackChunkName: "about" */ '../views/Bezier.vue')
	},
	{
		path: '/Persona',
		name: 'Persona',
		component: () => import(/* webpackChunkName: "about" */ '../views/Persona.vue')
	},
	{
		path: '/DoodleNormal',
		name: 'DoodleNormal',
		component: () => import(/* webpackChunkName: "about" */ '../views/DoodleNormal.vue')
	},
	{
		path: '/DoodlePhy',
		name: 'DoodlePhy',
		component: () => import(/* webpackChunkName: "about" */ '../views/DoodlePhy.vue')
	},
	{
		path: '/Plane',
		name: 'Plane',
		component: () => import(/* webpackChunkName: "about" */ '../views/Plane.vue')
	},
	{
		path: '/RubiksCube',
		name: 'RubiksCube',
		component: () => import(/* webpackChunkName: "about" */ '../views/DoodleRubiksCube.vue')
	},
	{
		path: '/SphereHeaven',
		name: 'SphereHeaven',
		component: () => import(/* webpackChunkName: "about" */ '../views/Heaven.vue')
	},
	{
		path: '/CSSPlayZone',
		name: 'CSSPlayZone',
		component: () => import(/* webpackChunkName: "about" */ '../views/CSSPlayZone.vue')
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
