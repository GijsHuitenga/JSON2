
// een tabel kop in markup uitvoeren uit een array
const maakTabelKop = (arr) => {
	let kop = "<table class='boek'><tr>";
	arr.forEach((item) => {
		kop += "<th>" + item + "</th>";
	});
	kop += "</tr>";
	return kop;
}

// functie die van een maand string een nummer maakt
const geefMaandNummer = (maand) => {
	let nummer;
	switch (maand) {
		case "januari": 	nummer = 0; break;
		case "februari": 	nummer = 1; break;
		case "maart": 		nummer = 2; break;
		case "april": 		nummer = 3; break;
		case "mei": 		nummer = 4; break;
		case "juni": 		nummer = 5; break;
		case "juli": 		nummer = 6; break;
		case "augustus": 	nummer = 7; break;
		case "september": 	nummer = 8; break;
		case "oktober": 	nummer = 9; break;
		case "november": 	nummer = 10; break;
		case "december": 	nummer = 11; break;
		default: 			nummer = 0;
	}
	return nummer;
}

//  'De' vooraan de tekst
const switchtTekst = (string) => {
    if(string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }
    return string;
}

// winkelwagen object
// 1. toegevoegde items bevat
// 2. method om data ophalen uit LS
// 3. method om items te verwijderen
// 4. method om items uit te voeren
// 5. method om totaal prijs te berekenen
let winkelwagen = {
	items: [],

	haalItemsOp: function() {
		let bestelling;
		if(localStorage.getItem('besteldeBoeken') == null) {
			bestelling = [];
		} else {
			bestelling = JSON.parse(localStorage.getItem('besteldeBoeken'));
        }
        bestelling.forEach(item => {
            this.items.push(item);
        })
		return bestelling;
    },
    
    verwijderItem: function(ean) {
        this.items.forEach((item, index) => {
            if(item.ean == ean) {
                this.items.splice(index, 1);
                ean = 4;
            }
        })
        localStorage.setItem('besteldeBoeken', JSON.stringify(this.items));
        if(this.items.length > 0) {
            document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
        } else {
            document.querySelector('.winkelwagen__aantal').innerHTML = '';
        }
        this.uitvoeren();
    },

    totaalBetaling: function() {
        let totaal = 0;
        this.items.forEach(boek => {
            totaal += boek.prijs;
        });
        return totaal;
    },
    
    uitvoeren: function() {
        // uitvoer legen
        document.getElementById('uitvoer-winkelwagen').innerHTML = "";

        this.items.forEach(boek => {
            let sectie = document.createElement('section');
            sectie.className = 'selectie';

            // boek cover
            let image = document.createElement('img');
            image.className = 'selectie__cover';
            image.setAttribute('src', boek.cover);
            image.setAttribute('alt', switchtTekst(boek.titel));
            
            // titel
            let titel = document.createElement('h3');
            titel.className = 'selectie__titel';
            titel.textContent = switchtTekst(boek.titel);

            // prijs toevoegen
            let prijs = document.createElement('div');
            prijs.className = 'selectie__prijs';
            prijs.textContent = boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});
            
            // verwijder knop toevoegen
            let verwijder = document.createElement('div');
            verwijder.className = 'selectie__verwijder';
            verwijder.addEventListener('click', () => {
                this.verwijderItem(boek.ean);
            })
            
            // elementen toevoegen
            sectie.appendChild(image);
            sectie.appendChild(titel);
            sectie.appendChild(prijs);
            sectie.appendChild(verwijder);
            document.getElementById('uitvoer-winkelwagen').appendChild(sectie);
        });

        // totaal prijs toevoegen
        let sectie = document.createElement('section');
        sectie.className = 'selectie';
        
        let totaalTekst = document.createElement('div');
        totaalTekst.className = 'selectie__totaal--tekst';
        totaalTekst.innerHTML = 'Totaal: ';

        let totaalPrijs = document.createElement('div');
        totaalPrijs.className = 'selectie__totaal--prijs';
        totaalPrijs.textContent = this.totaalBetaling().toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

        sectie.appendChild(totaalTekst);
        sectie.appendChild(totaalPrijs);
        document.getElementById('uitvoer-winkelwagen').appendChild(sectie);

        // winkelwagen aantal uitvoeren
        if(this.items.length > 0) {
			document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
		} else {
			document.querySelector('.winkelwagen__aantal').innerHTML = '';
		}
    }
} 

winkelwagen.haalItemsOp();
winkelwagen.uitvoeren();
