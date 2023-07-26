'use strict';

document.addEventListener('CONFIRM_EMAIL', (e) => {
	console.log('CONFIRM_EMAIL');
});

document.addEventListener('RESERVE', (e) => {
	console.log('RESERVE');
});

document.addEventListener('UN_RESERVE', (e) => {
	console.log('UN_RESERVE');
});

document.addEventListener('BASKET', (e) => {
	console.log('BASKET');
});

document.addEventListener('UN_RESERVE_ALL', (e) => {
	console.log('UN_RESERVE_ALL');
});

document.addEventListener('CREATE_ORDER', (e) => {
	console.log('CREATE_ORDER');
});