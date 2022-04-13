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
		component: () => import('../views/Bezier.vue')
	},
	{
		path: '/Persona',
		name: 'Persona',
		component: () => import('../views/Persona.vue')
	},
	{
		path: '/DoodleNormal',
		name: 'DoodleNormal',
		component: () => import('../views/DoodleNormal.vue')
	},
	{
		path: '/DoodlePhy',
		name: 'DoodlePhy',
		component: () => import('../views/DoodlePhy.vue')
	},
	{
		path: '/RubiksCube',
		name: 'RubiksCube',
		component: () => import('../views/DoodleRubiksCube.vue')
	},
	{
		path: '/SphereHeaven',
		name: 'SphereHeaven',
		component: () => import('../views/Heaven.vue')
	},
	{
		path: '/CSSPlayZone',
		name: 'CSSPlayZone',
		component: () => import('../views/CSSPlayZone.vue')
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
