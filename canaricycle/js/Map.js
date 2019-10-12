/*
Ce fichier a pour fonction de générer la .carte de la ville de Nantes et d'afficher toutes les stations de vélos à l'aide de marqueurs colorés.
 Il permet aussi l'affichage en temps réels des informations de la station sélectionnée puisqu'un appel a l'Api JCDécaux est fait à chaque fois que l'on clique sur un marqueur. 
*/

class Map {

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    // --------------------------------------------------------------------Constructor----------------------------------------------------------------------------------//
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    constructor() {
        //---Création de la carte de la ville de Nantes
        this.myMap = L.map('map').setView([47.2172500, -1.5533600], 14);
        //-----Création d'un icone pour les marqueurs 
        this.bikeIcon = L.Icon.extend({
            options: {
                iconSize: [
                    40, 40
                ],
                iconAnchor: [
                    0, 0
                ],
                popupAnchor: [20, 10]
            }
        });
        //-----Ajout de l'url donnant la couleur de chaque marqueur
        this.greenIcon = new this.bikeIcon({iconUrl: 'images/greenMarker.png'});
        this.orangeIcon = new this.bikeIcon({iconUrl: 'images/orangeMarker.png'});
        this.redIcon = new this.bikeIcon({iconUrl: 'images/redMarker.png'});
        this.addMap();
    };

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    // --------------------------------------------------------------------Fonctions----------------------------------------------------------------------------------//
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    //---Ajout de la carte de la ville de Nantes---//
    addMap() {
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVubW9udGVpcm8iLCJhIjoiY2p2Y2VsZXo0MWh3YTRlcDgxMWlwdXF5aCJ9.OlwgcOCHsnEneZlMIUv8VQ',
            {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> con' +
                        'tributors,<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</' +
                        'a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: 'your.mapbox.access.token'
            }
        ).addTo(this.myMap);
    };

    //---Fonction de determination de l'icone à choisir---//
    getMarker(station) {
        //-----Par défaut, on affiche un marqueur orange 
        let colorIcon = this.orangeIcon
        //-----Si il reste plus de 5 vélos dans la station, on affiche un marqueur vert
        if (station.totalStands.availabilities.bikes > 5) {
            colorIcon = this.greenIcon;
        //-----Si il ne reste plus de vélos dans la station ou que la station est fermée (closed), on affiche un marqueur rouge
        } else if (0 === station.totalStands.availabilities.bikes ||"CLOSED" === station.status) {
            colorIcon = this.redIcon;
        };
        //-----Création d'un marqueur
        return L.marker([station.position.latitude,station.position.longitude], {icon: colorIcon });
    };

    //---Fonction d"affichage des marqueurs aux emplacements des stations---//
    displayMarkers(station) {
        //---Affichage du nom des stations---//
        let stationCodeName = station.name;
        //-----Remplacement des "-" par des espaces pour qu'ils ne soient plus visibles
        let stationNameSansTirets = stationCodeName.replace('-',' ');
        //-----Suppression des 7 premiers caratères (qui était de la forme "#000000")
        let stationName = stationNameSansTirets.substring(7, stationCodeName.length);
        //-----Ajout des marqueurs sur la carte et d'un popup indiquant le nom et l'adresse de la station au clic sur un marqueur
        let marker = this.getMarker(station);
        marker.addTo(this.myMap).bindPopup(stationName+"<br />"+station.address).openPopup();

        //-----Au clic sur un marqueur, on appelle la fonction displayInfos
        marker.addEventListener("click",function() {
            //-----Au clic, on clear automatiquement le canvas et on le cache
            canvas.clearCanvas();
            $("#canvas, #confirmation, .signatureCanvas").hide()
            //-----Si aucune réservation n'est enregistré et que l'encart de réservation n'est pas affiché, on l'afiche
            if (false === resa.currentReservation && false === resa.displayResa) {
                resa.afficherResa();
                $("form").show();
            }
            //-----Si aucune réservation n'est enregistré et que l'encart de réservation est affiché, on l'actualise avec un effet de transition
            else if (false === resa.currentReservation && true === resa.displayResa) {
                $("#reservation").hide();
                setTimeout(function(){
                    $("#reservation").fadeIn("slow");
                },600);
                $("form").show();
            }
            //-----Si l'encart de réservation est déjà affiché et qu'une réservation est en cours, on met un effet de transition pour afficher les nouvelles infos 
            //-----et on masque le formulaire pour qu'il n'y ai pas de seconde réservation 
            else if (true === resa.currentReservation && true === resa.displayResa) {
                $("#reservation").hide();
                setTimeout(function(){
                    $("#reservation").fadeIn("slow");
                },600)
                $("form").hide();
                $(".currentResaMessage").show();
            }
            //-----Si l'encart de réservation n'est pasdéjà affiché et qu'une réservation est en cours, on l'affiche
            //-----et on masque le formulaire pour qu'il n'y ai pas de seconde réservation 
            else if (true === resa.currentReservation && false === resa.displayResa) {
                $("form").hide();
                $(".currentResaMessage").show();
                resa.afficherResa();
            };
            //-----On appelle la fonction displayInfos quel que soit l'état de displayResa
            api.displayInfos(station,stationName);
        });
    };
};

