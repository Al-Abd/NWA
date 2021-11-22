/**
 * @function
 * @name nwaSettingConfigOnLoad
 * @description config default setting or get from server
 * @returns Void
 */
function nwaSettingConfigOnLoad() {
	if (!localStorage.getItem('nwaLang'))
		if ($nwaConfig.supportedLanguages.includes(window.navigator.language))
			localStorage.setItem('nwaLang', window.navigator.language);
		else localStorage.setItem('nwaLang', 'enUS');
	if (!localStorage.getItem('nwaZoom'))
		localStorage.setItem('nwaZoom', '100');
	if (!localStorage.getItem('nwaTheme'))
		localStorage.setItem('nwaTheme', 'system');
	if (!localStorage.getItem('nwaColor'))
		localStorage.setItem('nwaColor', $nwaConfig.defaultColor);
	nwaLangChange();
	nwaZoomChange();
	nwaChangeTheme();
	nwaChangeColor();
}

/**
 * @function
 * @name nwaNavSettingChangeThemeOnClick
 * @description Dark mode and theme
 * @returns Void
 */
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

/**
 * @function
 * @name nwaChangeTheme
 * @description Dark mode and theme
 * @returns Void
 */
function nwaChangeTheme() {
	nwaSelect('html').classList.remove('nwaThemeDark');
	nwaSelect('html').classList.remove('nwaThemeLight');
	if (localStorage.getItem('nwaTheme') != 'system')
		nwaSelect('html').classList.add(localStorage.getItem('nwaTheme'));
}

/**
 * @function
 * @name nwaNavSettingChangeColorOnClick
 * @description Change Color
 * @returns Void
 */
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

/**
 * @function
 * @name nwaChangeColor
 * @returns Void
 */
function nwaChangeColor() {
	nwaSelect('html').classList.remove('nwaColorBlackGold');
	nwaSelect('html').classList.remove('nwaColorPurpleGreen');
	if (localStorage.getItem('nwaColor') != 'default')
		nwaSelect('html').classList.add(localStorage.getItem('nwaColor'));
}

/**
 * @function
 * @name nwaSettingSelectOnChangeEvent
 * @description called from nav select tags
 * @param {string} selectName
 * @returns Void
 */
function nwaSettingSelectOnChangeEvent(selectName) {
	var selectSelector = nwaSelect('nav select[name="" + selectName + ""]');
	var selectValue =
		selectSelector.options[selectSelector.selectedIndex].value;
	localStorage.setItem(selectName, selectValue);
	window[selectName + 'Change']();
}

/**
 * @function
 * @name nwaSetDirToHtmlTag
 * @returns Void
 */
function nwaSetDirToHtmlTag() {
	const rtlLangList = ['ar', 'fa'];
	if (rtlLangList.includes(localStorage.getItem('nwaLang')))
		nwaSelect('html').setAttribute('dir', 'rtl');
	else nwaSelect('html').setAttribute('dir', 'ltr');
}

/**
 * @function
 * @name nwaLangChange
 * @returns Void
 */
function nwaLangChange() {
	nwaSelect('nav select[name="nwaLang"]').value =
		localStorage.getItem('nwaLang');

	//apiUrl cant set in NWA system and must be set in users code.
	nwaAjax({
		method: 'GET',
		url: `${apiUrl}/nwaLanguage/${localStorage.getItem('nwaLang')}`,
		success: function (status, responseText) {
			localStorage.setItem('translate', responseText);
			console.log('nwa Lang is: ' + localStorage.getItem('nwaLang'));
			nwaSetDirToHtmlTag();
			nwaLangTranslate();
		},
		fail: function (status, responseText) {
			console.error(status + responseText);
		},
	});
}

/**
 * @function
 * @name nwaLangTranslate
 * @returns Void
 */
function nwaLangTranslate() {
	responseObject = JSON.parse(localStorage.getItem('translate'));
	responseObject.forEach(element => {
		if (responseObject[i].selector != '' && nwaSelect(element.selector))
			nwaSelect(element.selector).innerHTML = element.phrase;
	});
	// var i = 1;
	// for (i in responseObject) {
	// 	if (responseObject[i].selector != '' && nwaSelect(responseObject[i].selector))
	// 		nwaSelect(responseObject[i].selector).innerHTML = responseObject[i].phrase;
	// }
}

/**
 * @function
 * @name nwaZoomChange
 * @returns Void
 */
function nwaZoomChange() {
	nwaSelect('nav select[name="nwaZoom"]').value =
		localStorage.getItem('nwaZoom');
	nwaSelect('html').style.fontSize =
		(62.5 / 100) * localStorage.getItem('nwaZoom') + '%';
}

/**
 * @function
 * @name nwaChangeVersion
 * @returns Void
 */
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

/**
 * @function
 * @name nwaSelectVersion
 * @returns Void
 */
function nwaSelectVersion(version) {
	switch (version) {
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
