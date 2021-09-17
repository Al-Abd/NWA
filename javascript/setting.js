//config default setting or get from server
function nwaSettingConfigOnLoad() {
	if (!localStorage.getItem('nwaLang'))
		if ($nwaConfig.supportedLanguages.includes(window.navigator.language))
			localStorage.setItem('nwaLang', window.navigator.language);
		else
			localStorage.setItem('nwaLang', 'enUS');
	if (!localStorage.getItem('nwaZoom'))  localStorage.setItem('nwaZoom', '100');
	if (!localStorage.getItem('nwaTheme')) localStorage.setItem('nwaTheme', 'system');
	if (!localStorage.getItem('nwaColor')) localStorage.setItem('nwaColor', $nwaConfig.defaultColor);
	nwaLangChange();
	nwaZoomChange();
	nwaChangeTheme();
	nwaChangeColor();
}

//Dark Mode and Theme
function nwaNavSettingChangeThemeOnClick() {
	if (nwaSelect('html').classList.contains('nwaThemeLight')) {
		localStorage.setItem('nwaTheme', 'system');
	} else if (nwaSelect('html').classList.contains('nwaThemeDark')) {
		localStorage.setItem('nwaTheme', 'nwaThemeLight');
	} else {
		localStorage.setItem('nwaTheme', 'nwaThemeDark');
	}
	nwaChangeTheme();
}
function nwaChangeTheme() {
	nwaSelect('html').classList.remove('nwaThemeDark');
	nwaSelect('html').classList.remove('nwaThemeLight');
	if (localStorage.getItem('nwaTheme') != 'system') nwaSelect('html').classList.add(localStorage.getItem('nwaTheme'));
}
//Change Color
function nwaNavSettingChangeColorOnClick() {
	localStorage.setItem('nwaTheme', 'nwaThemeLight');
	if (nwaSelect('html').classList.contains('nwaColorPurpleGreen')) {
		localStorage.setItem('nwaColor', 'default');
	} else if (nwaSelect('html').classList.contains('nwaColorBlackGold')) {
		localStorage.setItem('nwaColor', 'nwaColorPurpleGreen');
	} else {
		localStorage.setItem('nwaColor', 'nwaColorBlackGold');
	}
	nwaChangeTheme();
	nwaChangeColor();
}
function nwaChangeColor() {
	nwaSelect('html').classList.remove('nwaColorBlackGold');
	nwaSelect('html').classList.remove('nwaColorPurpleGreen');
	if (localStorage.getItem('nwaColor') != 'default') nwaSelect('html').classList.add(localStorage.getItem('nwaColor'));
}


//called from nav select tags
function nwaSettingSelectOnChangeEvent(selectName) {
  var selectSelector = nwaSelect('nav select[name="' + selectName + '"]');
  var selectValue = selectSelector.options[selectSelector.selectedIndex].value;
  localStorage.setItem(selectName, selectValue);
  window[selectName + 'Change']();
}
function nwaSetDirToHtmlTag() {
	const rtlLangList = ['ar', 'fa'];
	if (rtlLangList.includes(localStorage.getItem('nwaLang')))
		nwaSelect('html').setAttribute('dir', 'rtl');
	else
		nwaSelect('html').setAttribute('dir', 'ltr');
}
function nwaLangChange() {
	nwaSelect('nav select[name="nwaLang"]').value = localStorage.getItem('nwaLang');

	//URL cant set in NWA system and most be set in users code.
	nwaAjax({method:'GET', url:apiUrl+'/'+apiLangController+'/'+localStorage.getItem('nwaLang'), success: function(status,responseText) {
		localStorage.setItem('translate', responseText);
		console.log('nwa Lang is: '+localStorage.getItem('nwaLang'));
		nwaSetDirToHtmlTag();
		nwaLangTranslate();
	}, fail: function(status,responseText) {
		console.error(status+responseText);
	} });
}
function nwaLangTranslate() {
	responseObject=JSON.parse(localStorage.getItem('translate'));
	var i=1;
	for (i in responseObject) {
		if (responseObject[i].selector != '' && nwaSelect(responseObject[i].selector))
			nwaSelect(responseObject[i].selector).innerHTML = responseObject[i].trans+'<br>';
	}
}
function nwaZoomChange() {
	nwaSelect('nav select[name="nwaZoom"]').value = localStorage.getItem('nwaZoom');
	nwaSelect('html').style.fontSize = 62.5/100*localStorage.getItem('nwaZoom') + '%';
}



function nwaChangeVersion() {
	if (localStorage.getItem('nwaVersion') == 'beta') {
		nwaSelectVersion('alpha');
		alert('alpha version activated.');
	} else if (localStorage.getItem('nwaVersion') == 'alpha') {
		nwaSelectVersion('default');
		alert('default version activated.');
	} else {
		nwaSelectVersion('beta');
		alert('beta version activated.');
	}
}
function nwaSelectVersion(version) {
	switch(version) {
		case 'alpha':
			nwaSelect('body').classList.remove('nwaBeta');
			nwaSelect('body').classList.add('nwaAlpha');
			localStorage.setItem('nwaVersion', 'alpha');
		break;
		case 'beta':
			nwaSelect('body').classList.add('nwaBeta');
			nwaSelect('body').classList.remove('nwaAlpha');
			localStorage.setItem('nwaVersion', 'beta');
		break;
		default:
			nwaSelect('body').classList.remove('nwaBeta');
			nwaSelect('body').classList.remove('nwaAlpha');
			localStorage.removeItem('nwaVersion');
	}
}
