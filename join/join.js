// Tinwing's invite page (D-084): https://perturbedmuffin.github.io/tinwing-site/join/?c=<code>
// With Tinwing installed, iOS opens the game straight from that link (a universal link) and
// this page is never seen. Without it (or when the link opened here anyway) the page shows
// the code, Open Tinwing (the game's own tinwing://join/<code> link), and how to get the game.
// No trackers, no cookies, no third-party anything: this file and the page are all there is.
(function () {
	"use strict";

	// Where to get the game. BETA is the TestFlight public link
	// ("https://testflight.apple.com/join/..."); empty = no "Join the beta" button.
	var APP_ID = "6834710152";
	var APP_STORE = "https://apps.apple.com/app/id" + APP_ID;
	var BETA = "";

	// The code, read exactly as the game reads the link (LobbyCode.from_url): the first c= in
	// the query, exactly four digits 0-9, or nothing.
	function inviteCode() {
		var query = window.location.search.replace(/^\?/, "");
		var pairs = query.split("&");
		for (var i = 0; i < pairs.length; i++) {
			if (pairs[i].indexOf("c=") === 0) {
				var c = pairs[i].substring(2);
				return /^[0-9]{4}$/.test(c) ? c : "";
			}
		}
		return "";
	}

	var code = inviteCode();

	// Safari's own app banner: "Get" without the game, "Open" with it (passing the code's
	// link to the game). Safari shows it only once the game is on the App Store. Written
	// while the page head is still being read, so Safari sees it.
	document.write('<meta name="apple-itunes-app" content="app-id=' + APP_ID +
		(code ? ", app-argument=tinwing://join/" + code : "") + '">');

	function fill() {
		var get = document.getElementById("get");
		get.href = APP_STORE;
		var beta = document.getElementById("beta");
		if (/^https:\/\/testflight\.apple\.com\/join\/[A-Za-z0-9]+$/.test(BETA)) {
			beta.href = BETA;
			beta.hidden = false;
		}
		if (!code) {
			if (window.location.search) {
				document.getElementById("no-code-label").textContent =
					"This invite link has no code in it. Ask your friend to send it again, or for their 4-digit code.";
			}
			return;
		}
		document.title = "Fly with me in Tinwing! Code " + code;
		var tiles = document.getElementById("tiles");
		tiles.setAttribute("aria-label", "Code " + code.split("").join(" "));
		for (var i = 0; i < code.length; i++) {
			var tile = document.createElement("span");
			tile.textContent = code.charAt(i);
			tiles.appendChild(tile);
		}
		document.getElementById("open").href = "tinwing://join/" + code;
		var mine = document.getElementById("this-code");
		mine.textContent = code;
		mine.className = "inline-code";
		document.getElementById("with-code").hidden = false;
		document.getElementById("no-code").hidden = true;
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", fill);
	} else {
		fill();
	}
})();
