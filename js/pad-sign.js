

function update() {
    var t = document.getElementById("settings_title").value;
    var st = document.getElementById("settings_subtitle").value;
    var u = document.getElementById("settings_url").value;
    var qrcode = new QRCode({
        content: u,
        container: "svg-viewbox", //Responsive use
        join: true //Crisp rendering and 4-5x reduced file size
    });
    var svg = qrcode.svg();

    document.getElementById("qr").innerHTML = svg;
    document.getElementById("sign_title").textContent = t;
    document.getElementById("sign_subtitle").textContent = st;
    document.getElementById("sign_url").textContent = u;

}


function genPad() {
    /* from https://framagit.org/framasoft/framapad/-/blob/master/app/components/pages/Home.vue */
    const name = [...Array(10)].map(() => Math.random().toString(36)[3]).join('')
        .replace(/(.|$)/g, c => c[!Math.round(Math.random()) ? 'toString' : 'toLowerCase']());
    console.log(name);
}


function updatePad(d) {
    console.log(d);
}


/*
 localization
 inspirations:
 https://github.com/dascritch/cpu-audio/blob/master/src/10_i18n.js
 */

const sources_i18n = {
    'fr': {
        'btn_do_print:value': "Imprimer",
        'btn_do_print:title': "Imprimer le contenu"
    },
    'en': {
        'btn_do_print:value': "Print",
        'btn_do_print:title': "Print current content"

        
    },
}

function getLang()
{
	if (navigator.languages)
		return navigator.languages[0];
	else if (navigator.language)
		return navigator.language;
	else if (navigator.userLanguage)
		return navigator.userLanguage;
	else if (navigator.browserLanguage)
		return navigator.browserLanguage;
}

function localizeUI() {
	var lang = getLang();
	var hideEn = true;
    var divs = false;
    var langs = ['en', 'fr'];

	if (/^fr$|^fr-/.test(lang) == true) {
        langs = langs.filter(l => l != "fr");
	} else
        langs = langs.filter(l => l != "en");
    langs = langs.map(l => ":lang(" + l + ")");
    langs = langs.join(", ");
    var node = document.createElement('style');
    node.type = "text/css";
    node.innerHTML = langs + " { display: none; }";
    document.head.appendChild(node);

/*		var divs = document.querySelectorAll(":lang(fr)");
    if (divs) {
        for (var i = 0; i < divs.length; i++) {
            divs[i].style.display = '?';
        }
    }
    if (hideEn) {
        divs =  document.querySelectorAll(":lang(en)");
        for (var i = 0; i < divs.length; i++) {
            divs[i].style.display = 'none';
        }
    }
*/
}

document.addEventListener('DOMContentLoaded', (event) => {
    localizeUI();
})
