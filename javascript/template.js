//Auto toggle nav depends on screen size when screen size changed
window.onresize = function() {
	nwaAutoToggleNav();
	nwaAutoToggleAside();
}

//Auto Toggle Nav depends on screen size
function nwaAutoToggleNav() {
	if (nwaSelect('body').classList.contains('nwaNav'))
		if (window.innerWidth <= 1440)
			nwaSelect('body').classList.remove('nwaNavActive');
    	else
			nwaSelect('body').classList.add('nwaNavActive');
	else
		nwaSelect('body').classList.remove('nwaNavActive');
}
function nwaAutoToggleAside() {
	if (nwaSelect('body main').getElementsByTagName('aside').length > 0)
		if (window.innerWidth <= 1220)
			nwaSelect('body').classList.remove('nwaAsideActive');
    	else
			nwaSelect('body').classList.add('nwaAsideActive');
	else
		nwaSelect('body').classList.remove('nwaAsideActive');
}

//Close Nav onClick outside of nav
window.addEventListener('click', function(event) {
  	if (window.innerWidth <= 1000)
		if (!nwaSelect('body nav').contains(event.target) && !nwaSelect('body header').contains(event.target) && !nwaSelect('body main').contains(event.target)) {
			nwaSelect('body').classList.remove('nwaNavActive');
			nwaSelect('body').classList.remove('nwaAsideActive');
    	}
});
