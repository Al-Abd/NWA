if (!navigator.cookieEnabled) alert('Cookies are not allowed!');

// On window load
window.onload = () => {
	nwaSettingConfigOnLoad();
	nwaSelectVersion(localStorage.getItem('nwaVersion'));
	nwaLoadPageFromUrl();
};

// On window error
window.onerror = (error) => {
	alert(`Window onError: ${error}`);
};

//Handle History back
window.addEventListener(
	'popstate',
	/**
	 * @function
	 * @name historyBack
	 * @param {Event} event
	 */
	function historyBack(event) {
		nwaLoadPageFromUrl();
	},
	false
);

/**
 * @function
 * @name nwaLoadPageFromUrl
 * @description Load Page from url, 404 Not Found redirect to home
 * @returns Void
 */
function nwaLoadPageFromUrl() {
	var nwaLocationPathname = window.location.pathname;
	for (i in $nwaScope) {
		for (j in $nwaScope[i]) {
			if ($nwaScope[i][j].nwaPageHistoryUrl == nwaLocationPathname) {
				nwaPageFetch(false, i, j);
				return;
			}
		}
	}
	for (i in $nwaScope) {
		for (j in $nwaScope[i]) {
			if (
				$nwaScope[i][j].nwaPageHistoryUrl != '/' &&
				nwaLocationPathname.startsWith($nwaScope[i][j].nwaPageHistoryUrl + '/')
			) {
				var id = nwaLocationPathname.replace(
					$nwaScope[i][j].nwaPageHistoryUrl + '/',
					''
				);
				nwaPageFetch(false, i, j, id);
				return;
			}
		}
	}
	window.history.replaceState({}, '', '/'); //Forward 404 to home
	nwaLoadPageFromUrl(); //Retry to Load
}

/**
 * @function
 * @name nwaPageFetch
 * @description Load any page
 * @param {*} nwaHistoryPushState
 * @param {Controller} controller
 * @param {*} action
 * @param {string} id
 * @returns Void
 */
function nwaPageFetch(nwaHistoryPushState, controller, action, id) {
	//Check for internet connection
	if (!navigator.onLine) {
		alert('Check Your Internet Connection!');
		return;
	}

	console.log('NWA Page Fetch: ' + controller + ' ' + action + ' ' + id);
	console.time('NWA Page Fetch Time');

	//Show load page
	nwaSelect('body').setAttribute('nwa-load-massage', 'Loading fetch...');
	nwaSelect('body').classList.add('load');

	//template parts
	if ($nwaScope[controller][action].nwaPageFetch.header)
		nwaSelect('body').classList.add('nwaHeader');
	else nwaSelect('body').classList.remove('nwaHeader');
	if ($nwaScope[controller][action].nwaPageFetch.footer)
		nwaSelect('body').classList.add('nwaFooter');
	else nwaSelect('body').classList.remove('nwaFooter');
	if ($nwaScope[controller][action].nwaPageFetch.nav)
		nwaSelect('body').classList.add('nwaNav');
	else nwaSelect('body').classList.remove('nwaNav');

	nwaAutoToggleNav();

	//Change page name on header before page loads
	if ($nwaScope[controller][action].nwaPageFetch.header) {
		nwaSelect('header h1').innerHTML =
			$nwaScope[controller][action].nwaPageFetch.header;
	}

	nwaSelect('main').setAttribute('controller', controller);
	nwaSelect('main').setAttribute('action', action);

	//Change Browser Address Bar
	var nwaPageHistoryUrl = $nwaScope[controller][action].nwaPageHistoryUrl;
	if (id) nwaPageHistoryUrl += '/' + id;
	if (nwaHistoryPushState) window.history.pushState({}, '', nwaPageHistoryUrl);
	else window.history.replaceState({}, '', nwaPageHistoryUrl);

	// Fetch HTML
	fetch($nwaScope[controller][action].nwaPageFetch.url)
		.then((response) => response.text())
		.then((html) => {
			console.timeEnd('NWA Page Fetch Time');
			nwaSelect('main').innerHTML = html;
			if ($nwaScope[controller][action].nwaPageForm)
				nwaPageFormSubmitAjaxEventMaker();
			if ($nwaScope[controller][action].nwaPageData) {
				console.log('NWA Ajax to pageDataAPI');
				nwaSelect('body').setAttribute('nwa-load-massage', 'Connecting API...');
				var url = $nwaScope[controller][action].nwaPageData.url;
				if (id) url += '/' + id;
				nwaAjax({
					method: 'GET',
					url: url,
					success: (status, responseText) => {
						//Run page data on load function from user app.js file
						$nwaScope[controller][action].nwaPageData.onResponse(
							status,
							responseText
						);
						console.log('NWA PageData.onResponse functions called');

						nwaLangTranslate();
						nwaAutoToggleAside();
						nwaSelect('body').classList.remove('load');
						console.log('NWA Fetch+Ajax :)');
					},
					fail: function (status, responseText) {
						nwaLangTranslate();
						nwaAutoToggleAside();
						nwaSelect('body').classList.remove('load');
						console.log('NWA Fetch :) Ajax :(');
					},
				});
			} else {
				console.log('NWA pageDataAPI Not Found');
				nwaLangTranslate();
				nwaAutoToggleAside();
				nwaSelect('body').classList.remove('load');
				console.log('NWA Fetch :)');
			}
		})
		.catch((error) => {
			alert('NWA Page Fetch Error: ' + error);
			console.timeEnd('NWA Page Fetch Time');
			console.log('NWA Page Fetch Error: ' + error);
			console.log('NWA :(');
		});
}

/**
 * @name nwaPageFormSubmitAjaxEventMaker
 * @description FORM AJAX
 * @returns Void
 */
function nwaPageFormSubmitAjaxEventMaker() {
	nwaSelect('main form').addEventListener('submit', (e) => {
		e.preventDefault();
		nwaSelect('main form').classList.add('nwaFromRequested');
		console.groupCollapsed(
			'Crj form: ' +
			nwaSelect('main').getAttribute('controller') +
			' ' +
			nwaSelect('main').getAttribute('action') +
			' ' +
			nwaSelect('main form').id
		);

		var data = {};
		for (var i = 0; i < nwaSelect('main form').length; i++) {
			if (nwaSelect('main form').elements[i].getAttribute('name'))
				data[nwaSelect('main form').elements[i].getAttribute('name')] =
					nwaSelect('main form').elements[i].value;
		}
		var url =
			$nwaScope[nwaSelect('main').getAttribute('controller')][
				nwaSelect('main').getAttribute('action')
			].nwaPageForm.url;
		nwaAjax({
			reference: nwaSelect('main form'),
			method: 'POST',
			url: url,
			data: data,
			success: function (status, responseText, formId) {
				console.groupEnd();
				$nwaScope[nwaSelect('main').getAttribute('controller')][
					nwaSelect('main').getAttribute('action')
				].nwaPageForm.onResponse(status, responseText);
			},
			fail: function (status, responseText, formId) {
				console.groupEnd();
			},
		});
	});
}

/**
 * @function
 * @name nwaAjax
 * @description Send HTTP request
 */
function nwaAjax(object) {
	console.time('Ajax time');
	var nwaHttp = new XMLHttpRequest();

	nwaHttp.open(object.method, object.url, true);
	nwaHttp.withCredentials = false;
	nwaHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	if (localStorage.getItem('token'))
		nwaHttp.setRequestHeader('Authorization', localStorage.getItem('token'));
	nwaHttp.timeout = 20000;
	nwaHttp.send(JSON.stringify(object.data));
	console.log(
		'Client ' +
		object.method +
		' ' +
		object.url +
		' : ' +
		JSON.stringify(object.data)
	);

	nwaHttp.onreadystatechange = () => {
		// If request operation is complete.
		if (this.readyState == 4) {
			console.log('Server ' + this.status + ': ' + this.responseText);
			console.timeEnd('Ajax time');
			if (this.status < 300 && this.status != 0) {
				if (typeof object.success === 'function')
					if (typeof object.reference !== 'undefined')
						object.success(this.status, this.responseText, object.reference.id);
					else object.success(this.status, this.responseText);
			}
			// If request failed
			else {
				if (typeof object.fail === 'function')
					if (typeof object.reference !== 'undefined')
						object.fail(this.status, this.responseText, object.reference.id);
					else object.fail(this.status, this.responseText);
				if (this.status == 0) alert('server status: 0');
				else if (
					confirm(
						'Server error ' +
						this.status +
						': ' +
						this.responseText +
						'\n' +
						'Reload the app?'
					)
				) {
					if (this.status == 401 || this.status == 403) localStorage.clear();
					location.reload();
				}
			}
			if (typeof object.reference !== 'undefined')
				object.reference.classList.remove('nwaFromRequested');
		}
	};

	nwaHttp.ontimeout = (e) => {
		alert('http ajax connection time out.');
		console.log('Ajax time Out!');
	};
}
