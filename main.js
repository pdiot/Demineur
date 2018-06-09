
var lignes;
var nbLignes;
var nbMines;
var done;

var nbFlags;

function init() {
	
	nbLignes = 12;
	nbMines = Math.floor(nbLignes * nbLignes * 20 / 100);
	nbFlags = nbMines;
	
	console.log("log1");
	lignes = new Array();
	
	for (i = 0; i < nbLignes; i++) {
		console.log("boii");
		lignes[i] = new Array();
		ligne = lignes[i];
		for (j=0; j < nbLignes; j++) {
			var cellule = {
				bombe:"false",
				ligne:i,
				colonne:j
			};
			ligne[j] = cellule;
		}
		console.log("taille de lignes["+i+"] : " + lignes[i].size);
	}
	
	console.log("taille de lignes: " + lignes.size);
	console.log("log2");
	i = 0;
	
	while (i<nbMines){
	
	console.log("nb mines posées début while: " + i);
		lignes.forEach(function(ligne){
			ligne.forEach(function(cellule){
				if (i < nbMines) {
					if(cellule.bombe==="false"){
						if (getRandomInt(60)<10){
						cellule.bombe="true";
						i++;
						console.log("nb mines posées après pose: " + i);
						}
					}					
				}				
			})
		});	
	}
	
	
	console.log("log3");
	
	drawGrid();	
	document.getElementById("nbrestants").innerHTML=nbFlags;
	
}

function reset() {
	window.location.reload();
}

window.onload = function() {
	init();
};

function drawGrid() {
	console.log("log4");
	
	var tbody = document.getElementById("bodhi");
	
	lignes.forEach(function(ligne){
		console.log("boucles lignes");
		var tr = document.createElement("tr");
		tbody.appendChild(tr);
		ligne.forEach(function(cellule){
			console.log("boucles ligne");
			var td = document.createElement("td");
			tr.appendChild(td);
			var button = document.createElement("button");
			button.setAttribute("bombe", cellule.bombe);
			button.setAttribute("ligne", cellule.ligne);
			button.setAttribute("colonne", cellule.colonne);
			button.setAttribute("id", "bx"+cellule.ligne+"y"+cellule.colonne);
			button.classList.add("cellule");
			button.addEventListener("click", cliqueCellule);
			td.appendChild(button);
		});
		
	});
	
	$('.cellule').bind('contextmenu', function(e){
		clicdroit(e);
		return false;
	});
	
	console.log("log5");
}

function validate() {
	var ko = 0;
	if (nbFlags < 0) {
		document.getElementById("resultValidate").innerHTML="Vous avez mis trop de drapeaux !"
	} else if (nbFlags > 0) {
		document.getElementById("resultValidate").innerHTML="Il vous reste des drapeaux à placer !"
	} else {
		for (i = 0; i < nbLignes; i++) {
			for (j = 0; j < nbLignes; j++) {
				var button = document.getElementById("bx"+i+"y"+j);
				if (button.getAttribute("bombe") === "true" && button.classList.contains("fa-flag")) {
					
				} else {
					ko ++;
				}
			}
		}
		
		if (ko > 0) {
			document.getElementById("resultValidate").innerHTML="Il y'a des erreurs"
		} else {
			document.getElementById("resultValidate").innerHTML="Bien joué ! Une nouvelle partie ?"
			var btn = document.createElement("button");
			btn.addEventListener("click", reset);
			btn.innerHTML="Allez, ça part.";
			document.getElementById("erf").innerHTML="Non merci.";
		}	
	}
	
	document.getElementById("validatemodalbutton").click();
}

function clicdroit(event) {
	var button = event.target;
	if (button.getAttribute("disabled") === "true") {
		
	} else {
		if (button.classList.contains("fas")) {
			button.classList.remove("fas");
			button.classList.remove("fa-flag");
			nbFlags ++;
			document.getElementById("nbrestants").innerHTML=nbFlags;
		} else {
			button.classList.add("fas");
			button.classList.add("fa-flag");
			nbFlags --;
			document.getElementById("nbrestants").innerHTML=nbFlags;
		}
	}	
}

function cliqueCellule(event) {
	console.log(event);
	console.log(event.target);
	var button = event.target;
	if (button.classList.contains("fas")) {
			button.classList.remove("fas");
			button.classList.remove("fa-flag");
			nbFlags ++;
			document.getElementById("nbrestants").innerHTML=nbFlags;
	}
	if (button.getAttribute("bombe") === "true") {
		console.log("y'a une bombe lol");
		var icone = document.createElement("i");
		icone.classList.add("fas");
		icone.classList.add("fa-bomb");
		button.appendChild(icone);
		button.setAttribute("disabled", "true");
		var porc = document.getElementById("porc");
		porc.click();
	} else {
		done = new Array();
		compterBombes(button);
	}
}

function compterBombes(button) {
	var atester = new Array();
	
	var ligne = button.getAttribute("ligne");
	
	var colonne = button.getAttribute("colonne");
	
	if (ligne != 0) {
		
		if (colonne != 0) {
			var b7 = document.getElementById("bx"+(ligne-1)+"y"+(colonne-1));
			atester.push(b7);
		}
		
		if (colonne != nbLignes -1) {
			var b9 = document.getElementById("bx"+(ligne-1)+"y"+(parseInt(colonne)+1));
			atester.push(b9);
		}
		
		var b8 = document.getElementById("bx"+(ligne-1)+"y"+(colonne));
		atester.push(b8);		
	}
	
	if (colonne != 0) {
		var b4 = document.getElementById("bx"+(ligne)+"y"+(colonne-1));
		atester.push(b4);
	}
	
	if (colonne != nbLignes-1) {
		var b6 = document.getElementById("bx"+(ligne)+"y"+(parseInt(colonne)+1));
		atester.push(b6);
	}
	
	if (ligne != nbLignes-1) {
		
		if (colonne != 0) {
			var b1 = document.getElementById("bx"+(parseInt(ligne)+1)+"y"+(colonne-1));
			atester.push(b1);
		}
		
		if (colonne != nbLignes -1) {
			var b3 = document.getElementById("bx"+(parseInt(ligne)+1)+"y"+(parseInt(colonne)+1));
			atester.push(b3);
		}
		var b2 = document.getElementById("bx"+(parseInt(ligne)+1)+"y"+(colonne));
		atester.push(b2);	
	}
	
	var ret=0;
	atester.forEach(function(bt){
		console.log("bouton : " + bt);
		ret += check(bt);
	});
	if (ret == 0) {
		done.push(button);
		atester.forEach(function(bt){
			if (done.includes(bt)) {
				
			} else {
				compterBombes(bt);
			}
	});
	}
	
	button.innerHTML=ret;
	button.setAttribute("disabled", "true");
	if (ret == 0) {
		button.classList.add("b0");
	} else if (ret == 1) {
		button.classList.add("b1");
	} else if (ret == 2) {
		button.classList.add("b2");
	} else {
		button.classList.add("b3");
	}

}

function check(button) {
	console.log("cellule " + button.getAttribute("id"));
	if (button.getAttribute("bombe")==="false") {
		console.log("pas bombe");
		return 0;
	} else {
		return 1;
		console.log("bombe");
	}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function test() {
	var cells = $(".cellule");
	cells.each(function(index, cell){
		if (cell.getAttribute("bombe")==="true") {
			var icone = document.createElement("i");
			icone.classList.add("fas");
			icone.classList.add("fa-bomb");
			cell.appendChild(icone);
			cell.setAttribute("disabled", "true");
		}
	});
}