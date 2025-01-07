function read(file) {
	zip.createReader(new zip.BlobReader(file), function cb(zipReader) {
		zipReader.getEntries(function cb(entriesArray) {
			var count = entriesArray.length;
			entriesArray.forEach(function cb(entry) {
				entry.getData(new zip.BlobWriter, function cb(blob) {
					entry.url = URL.createObjectURL(blob);
					if (!--count) {
						entriesArray.sort(function(a, b) {
							return a.filename < b.filename ? -1 : a.filename > b.filename ? 1 : 0
						}).forEach(function(entry) {
							var a = document.body.appendChild(document.createElement('a'))
							a.href = entry.url;
							a.innerHTML = entry.filename;
						});
						go();
					}
				});
			});
		});
	});
}

var input = document.getElementsByTagName('input')[0];
input.onchange = function() {
	read(input.files[0]);
};

var go = function (){var NS_LecteurBD = {};
NS_LecteurBD.initialisation = function() {
	var NS = NS_LecteurBD;
	NS.list = document.querySelectorAll('a');
	document.head.innerHTML = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Lecteur</title>';
	document.body.innerHTML = '';
	document.body.style.backgroundColor = 'rgb(39,40,34)';
	NS.type = 'max-width';
	NS.omm = { to: 0, x: 0, y: 0 };
	NS.percent = 85;
	NS.setWidth = function() {
		if (NS.percent != NS.widthImage.value) NS.widthImage.value = NS.percent;
		NS.moins.innerHTML = NS.percent <= 5 ? '-.5' : '-5';
		if (NS.percent <= .5) NS.moins.disabled = true;
		else NS.moins.disabled = false;
		NS.plus.innerHTML = NS.percent < 5 ? '+.5' : '+5';
		NS.styleImage.innerHTML = '.image{' + NS.type + ':' + NS.percent + '%' + '}';
	};
	NS.affichage = function() {
		if (NS.list.length < 3) return;
		var allowedTypes = ['png', 'jpg', 'jpeg', 'gif', 'ico', 'bmp'];
		NS.lecteur.innerHTML = '';
		for (var i = 0; i < NS.list.length; i++) {
			var divI = document.createElement('div');
			divI.innerHTML = '<img class="image" src="' + NS.list[i].href + '"/>';
			NS.lecteur.appendChild(divI);
		}
	};
	NS.styleImage = (function() {
		var styl = document.createElement('style');
		styl.id = 'styleImage';
		styl.innerHTML = '.image {width: 85%;}';
		document.head.appendChild(styl);
		return styl;
	})();
	(function() {
		var styl = document.createElement('style');
		styl.innerHTML = '.image {height:auto;margin-right:8px;}';
		document.head.appendChild(styl);
	})();
	NS.heihgtmax = (function() {
		var styl = document.createElement('style');
		styl.id = 'heihgtmax';
		document.head.appendChild(styl);
		return styl;
	})();
	NS.control = (function() {
		var divControl = document.createElement('div');
		divControl.id = 'control';
		divControl.style.position = 'fixed';
		divControl.style.top = '0px';
		divControl.style.left = '0px';
		divControl.style.backgroundColor = 'white';
		divControl.style.padding = '2px';
		divControl.style.borderStyle = 'solid';
		divControl.style.borderColor = 'blueviolet';
		divControl.style.borderWidth = '0px 8px 8px 0px';
		divControl.style.textAlign = 'justify';
		var to, op;
		divControl.onmouseover = function() {
			clearTimeout(to);
			op = 100;
			this.style.opacity = 1;
		};
		divControl.onmouseout = function(e) {
			if (e.relatedTarget && e.relatedTarget.tagName == 'BUTTON') return;
			fondu();
		};

		function fondu() {
			op -= 5;
			divControl.style.opacity = op / 100;
			if (op <= 0) return;
			to = setTimeout(fondu, 50);
		}
		document.body.appendChild(divControl);
		return divControl;
	})();
	NS.maxHeigh = (function() {
		var chkbx = document.createElement('input');
		chkbx.id = 'maxheigh';
		chkbx.type = 'checkbox';
		NS.control.appendChild(chkbx);
		var labl = document.createElement('label');
		labl.htmlFor = 'maxheigh';
		var txt = document.createTextNode('hauteur limitée à 100%.');
		labl.appendChild(txt);
		NS.control.appendChild(labl);
		chkbx.onclick = function() {
			if (this.checked) {
				NS.heihgtmax.innerHTML = ".image{max-height:" + innerHeight + "px;}";
				window.onresize = function() { NS.heihgtmax.innerHTML = ".image{max-height:" + innerHeight + "px;}"; };
			} else {
				window.onresize = '';
				NS.heihgtmax.innerHTML = "";
			}
		};
		return chkbx;
	})();
	NS.largeur = (function() {
		NS.control.appendChild(document.createElement('br'));
		var txt = document.createElement('span');
		txt.innerHTML = 'largeur:';
		txt.style.paddingLeft = '5px';
		NS.control.appendChild(txt);
		var selectLargeur = document.createElement('select');
		selectLargeur.id = 'largeur';
		selectLargeur.innerHTML = '\<option value="max-width">limitée à</option>\<option value="width" selected>forcée à</option>\<option value="">auto</option>';
		NS.control.appendChild(selectLargeur);
		selectLargeur.onchange = function() {
			if (this.value) {
				NS.type = this.value;
				NS.moins.disabled = NS.widthImage.disabled = NS.plus.disabled = NS.cent.disabled = false;
				NS.setWidth();
			} else {
				NS.styleImage.innerHTML = '.image{width:auto}';
				NS.moins.disabled = NS.widthImage.disabled = NS.plus.disabled = NS.cent.disabled = true;
			}
		};
		return selectLargeur;
	})();
	NS.zoom = (function() {
		NS.control.appendChild(document.createElement('br'));
		var divZoom = document.createElement('div');
		divZoom.marginTop = '2px';
		NS.control.appendChild(divZoom);
		return divZoom;
	})();
	NS.moins = (function() {
		var moins = document.createElement('button');
		moins.id = 'moins';
		moins.innerHTML = '-5';
		NS.zoom.appendChild(moins);
		moins.onclick = function() {
			if (NS.percent <= .5) return false;
			NS.percent -= NS.percent > 5 ? (NS.percent % 5) || 5 : (NS.percent % .5) || .5;
			NS.setWidth();
		};
		return moins;
	})();
	NS.widthImage = (function() {
		var val = document.createElement('input');
		val.id = 'widthImage';
		val.type = 'number';
		val.value = 85;
		val.min = 0;
		val.style.width = '40px';
		NS.zoom.appendChild(val);
		var txt = document.createTextNode('%');
		NS.zoom.appendChild(txt);
		val.onchange = function() {
			if (this.value) NS.percent = parseFloat(this.value);
			NS.setWidth();
		};
		return val;
	})();
	NS.plus = (function() {
		var plus = document.createElement('button');
		plus.id = 'plus';
		plus.innerHTML = '+5';
		NS.zoom.appendChild(plus);
		plus.onclick = function() {
			NS.percent += NS.percent >= 5 ? 5 - NS.percent % 5 : .5 - NS.percent % .5;
			NS.setWidth();
		};
		return plus;
	})();
	NS.cent = (function() {
		var cent = document.createElement('button');
		cent.id = 'cent';
		cent.innerHTML = '100%';
		NS.zoom.appendChild(cent);
		cent.onclick = function() {
			NS.percent = 100;
			NS.setWidth();
		};
		return cent;
	})();
	NS.lecteur = (function() {
		var divLecteur = document.createElement('div');
		divLecteur.id = 'lecteur';
		divLecteur.style.textAlign = 'center';
		document.body.appendChild(divLecteur);
		return divLecteur;
	})();
	window.onmousemove = function(a) {
		if (a.clientX == NS.omm.x && a.clientY == NS.omm.y) return;
		clearTimeout(NS.omm.to);
		document.body.style.cursor = '';
		NS.omm = { to: setTimeout(function() { document.body.style.cursor = 'none'; }, 5000), x: a.clientX, y: a.clientY }
	};
	NS.affichage();
};
NS_LecteurBD.initialisation();
};