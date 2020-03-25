
var padUrl = "";

function update(step) {
    var t = document.getElementById("settings_title").value;
    var st = document.getElementById("settings_subtitle").value;
    var u = document.getElementById("settings_url").value;

    document.getElementById("sign_title").textContent = t;
    document.getElementById("sign_subtitle").textContent = st;
    // TODO: shorten text URL? frama.link (LSTU) sends the full page HTML as reply of the POST :-(
    document.getElementById("sign_url").textContent = u.replace(/^http.:\/\//,"");
    document.getElementById("open_pad").href = u;

    var fragments = [];
    if (t.length)
        fragments.push("title=" + encodeURIComponent(t));
    if (st.length)
        fragments.push("subtitle=" + encodeURIComponent(st));

    var hash;

    if (u.length && u != padUrl) {
        var qrcode = new QRCode({
            content: u,
            container: "svg-viewbox", //Responsive use
            join: true //Crisp rendering and 4-5x reduced file size
        });
        var svg = qrcode.svg();

        document.getElementById("qr").innerHTML = svg;
        document.getElementById("pad_iframe").src = u;
        padUrl = u;
    }
    if (u.length)
        fragments.push("pad=" + encodeURIComponent(u));

    // force scrolling back, in case setting the hash changes it
    // cf. https://stackoverflow.com/questions/645202/can-i-update-window-location-hash-without-having-the-web-page-scroll
    var scrollmem = [document.body.scrollLeft, document.body.scrollTop];
    history.pushState(null,null,'#' + fragments.join("&"));
    document.body.scrollTo(scrollmem[0], scrollmem[1]);

    if (step) {
        document.getElementById("step-"+step).className = "done";
        step++;
        if (step < 5) {
            document.getElementById("step-"+step).className = "todo";
            document.getElementById("step-"+step).scrollIntoView(
                {behavior: "smooth", block: "center", inline: "nearest"});
        }
    }

}


function genPad() {
    /* from https://framagit.org/framasoft/framapad/-/blob/master/app/components/pages/Home.vue */
    const name = [...Array(10)].map(() => Math.random().toString(36)[3]).join('')
        .replace(/(.|$)/g, c => c[!Math.round(Math.random()) ? 'toString' : 'toLowerCase']());

    /* pick a random instance */
    var instance = {};
    while (!instance.chatons) {
        // filter out non-chatons instances for now
        instance = instances[Object.keys(instances)[Math.floor(Math.random() * Object.keys(instances).length)]];
    }
    console.log("Using etherpad instance " + instance.title);
    document.getElementById("instance_name").href = instance.website;
    document.getElementById("instance_name").textContent = instance.title;

    var url = instance.endpoint + name;
    console.log(url);
    // XXX: DEBUG
    //url = "https://mensuel.framapad.org/p/i9e3ux4m7j";
    document.getElementById("settings_url").value = url;
}


function updatePad(d) {
    //console.log(d);
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

    if (document.location.hash.length) {
        var hash = document.location.hash.slice(1);
        hash = hash.split("&");
        hash = hash.map(h => h.split("="))
        fragments = {};
        hash.forEach(h => fragments[h[0]] = decodeURIComponent(h[1]));
        document.getElementById("settings_title").value = fragments['title'] || "";
        document.getElementById("settings_subtitle").value = fragments['subtitle'] || "";
        document.getElementById("settings_url").value = fragments['pad'] || "";
        update();
    }

    document.getElementById("settings_title").select();
    document.getElementById("settings_title").focus();
    document.getElementById("step-1").className = "todo";
})
