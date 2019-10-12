/* Ce fichier a pour fonction de réaliser les appels vers l'Api de JCDécaux et
 * de charger le fichier Map.js Afin d'obtenir toutes les informations relatives
 * à chaque station.
 */

class Api {

    // --------------------------------------------------------------------------------------------------------------------------------------------------------------//
    // --------------------------------------------------------------------Constructor----------------------------------------------------------------------------------//
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//

    constructor() {
        //-----Appel de la classe Map
        this.map = new Map();
        //-----Url de l'api donnant toutes les stations du contrat de la ville de Nantes
        this.apiUrlToutesStations = "https://api.jcdecaux.com/vls/v3/stations?contract=nantes&apiKey=a21dcdc73aca13130f1e32400f432e77ffe63a44";
        //-----Timer de raffraichissement des infos de l'Api (toutes les 2min)
        this.timerForRefresh = 120000;
        //-----Fonctions à appeler automatiquement
        this.callApi();
        // -----La fonction callApi est appelé en boucle toutes les deux minutes afin
        // que les données soient mises à jour
        this.intervalApi = setInterval(function () {
            this.callApi()
        }.bind(this), this.timerForRefresh);
    };

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    // --------------------------------------------------------------------Fonctions----------------------------------------------------------------------------------//
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    // ---Appel de l'Api---//
    callApi() {
        ajaxGet(this.apiUrlToutesStations, function (reponse) {
            let stations = JSON.parse(reponse)
            //-----Pour chaque station, on appelle la fonction displayMarkers
            stations.forEach(function (station) {
                this.map.displayMarkers(station)
            }.bind(this));
        }.bind(this));
    };

    // ---Fonction d'affichage des infos de la station sélectionnée dans le bloc
    // réservation
    displayInfos(station, stationName) {
        // -----On renvoie une requête ajax pour récupérer les infos de la station
        // sélectionnée
        ajaxGet("https://api.jcdecaux.com/vls/v3/stations/" + station.number + "?contract=nantes&apiKey=a21dcdc73aca13130f1e32400f432e77ffe63a44",function (updatedreponse) {
            let updatedInfos = JSON.parse(updatedreponse)
            let statut = ('CLOSED' === updatedInfos.status ? 'Fermé' : 'Ouvert');
            // -----On remplace la div infosStation par une nouvelle div où l'on affiche
            // toutes les infos nécessaires
            $("#infosStation").html(
                //-----Affiche le nom de la station
                `<h1><em>Station</em>: <span id="stationName">` + stationName + `</span></h1>` +
            //-----Affiche l'adresse de la station
                `<p><span>` + updatedInfos.address + `</span></p>` +
            //-----Affiche le statut de la station (OPEN ou CLOSED)
                `<p><em>Statut</em>: <span>` + statut + `</span></p>` +
            //-----Affiche le nombre d'emplacements libres dans la station
                `<p><em>Nombre d'emplacements libres</em>: <span>` + updatedInfos.totalStands.availabilities.stands + `</span></p>` +
            //-----Affiche le nombre de vélos disponibles dans la station
                `<p><em>Nombre de vélos disponibles</em>: <span>` + updatedInfos.totalStands.availabilities.bikes + `</span></p>`
            );
            // -----Si il n'y a plus de vélos disponibles ou que la station est fermée, on cache le formulaire et on affiche un message d'erreur
            if (false === resa.currentReservation && (0 === updatedInfos.totalStands.availabilities.bikes || "CLOSED" === updatedInfos.status)) {
                $("form, .champsVide").hide();
                $(".errorMessage").show();
            } else {
                $(".errorMessage").hide();
            };
        });
    };
};
