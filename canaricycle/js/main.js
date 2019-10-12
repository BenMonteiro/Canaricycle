// ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
// --------------------------------------------------------------------APPEL AJAX----------------------------------------------------------------------------------//
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
function ajaxGet(url, callback) {
    let req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
// --------------------------------------------------------------------APPEL DES PLUGINS--------------------------------------------------------------------------//
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------//

//-----Chargement du carrousel expliquant le fonctionnement de l'application
let carrousel = new Carrousel();

//-----Chargement de la classe Api récupérant les données sur l'Api JCDécaux et chargement de la classe Map générant la carte et les marqueurs représentants les stations
let api = new Api();

//-----Chargement du champ de signature 
let canvas = new Canvas();

//-----Chargement de la gestion des réservations avec localStorage et sessionStore + chargement de la classe Timer qui génere le décompte dynamique de 20min
let resa = new Reservation();









