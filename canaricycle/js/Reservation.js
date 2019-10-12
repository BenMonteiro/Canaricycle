/*
Ce fichier a pour fonction la gestion des réservations (enregistrement des données, annulation...). Il charge aussi le fichier Timer.js gérant le décompte dynamique du temps restant avant
expiration de la réservation.
*/

class Reservation {

    //---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    //--------------------------------------------------------------------Constructor----------------------------------------------------------------------------------//
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    constructor() {
        //-----Appel de la classe Timer
        this.timer = new Timer();
        //-----Determine si le bloc de réservation est affiché
        this.displayResa = false;
        //-----Récupération des données du localStorage
        this.nom = localStorage.getItem('Nom');
        this.Prenom = localStorage.getItem('Prenom');
        //-----Définition des zones de saisie des noms et prénoms
        this.champNom = document.getElementById('nom');
        this.champPrenom = document.getElementById('prenom');
        //-----Définition du temps au refresh de la page
        this.refreshDate = new Date();
        this.refreshTime = this.refreshDate.getTime();
        //-----Determine si il y a une réservation en cours
        this.currentReservation = false;
        //-----Fonction à appeler automatiquement 
        this.displayUsername();
        this.listeners();
    };

    // -----------------------------------------------------------------------------------------------------------------------------------------------------//
    // ---------------------------------------------------------------------- Event listeners---------------------------------------------------------------//
    // -----------------------------------------------------------------------------------------------------------------------------------------------------//
    listeners() {
        //-----Au clic sur le bouton de reservation : 
        $("#resaButton").on("click",function() {
            //-----On appelle la fonction saveUserInfos
            this.saveUserInfos();
            //-----Le dit que le canvas est vide et on met le message de signature en noir
            canvas.emptyCanvas = true;
            $(".signatureCanvas").css("color", "black")
            //-----Si les champs nom et prenom sont remplis : 
            if (document.getElementById("nom").value !== '' && document.getElementById("prenom").value !=='' ) {
                //-----1) On cache le formulaire
                $("form, .champsVide").hide();
                //-----2) On fait apparaite le canvas et le bouton de confirmation 
                $("#canvas, #confirmation, .signatureCanvas").fadeIn("slow");
            //-----Sinon on affiche le message demandant de remplir le formulaire
            } else {
                $(".champsVide").show()
            };
        }.bind(this));

        //-----Au clic sur le bouton de confirmation:
        $("#confirmation").on("click",function() {
            //-----Si le champ de signature a été rempli :
            if (false === canvas.emptyCanvas) {
                //-----1) On cache les messages non voulus ainsi que le canvas et le bouton confirmation
                $("#resaAnnulee, #resaExpiree, #canvas, #confirmation, .signatureCanvas").hide();
                //-----2) On appele la fonction saveReservation
                this.saveReservation();
                //-----3) On affiche le nom de la station dans laquelle on a réservé le vélo dans le compte à rebourd
                $("#stationResa").html(sessionStorage.getItem('Station'));
                $("#userId").html((localStorage.getItem('Prenom'))+' '+(localStorage.getItem('Nom')));
                //-----4)On affiche le compte à rebourd
                $("#compteurResa, #annulation, .currentResaMessage").show();
                //-----5) On lance le timer et on indique qu'une réservation est en cours
                this.timer.interval();
                this.currentReservation = true;
                //-----7)On recentre l'écran sur le compteur
                $('html,body').animate({scrollTop: $("#compteurResa").offset().top});
            //-----Sinon, on met le message de signature en rouge
            } else {
                $(".signatureCanvas").css("color", "red");
            }
        }.bind(this));

        //-----Au clic sur le bouton d'annulation:
        $("#annulation").on("click", function () {
            //-----On appelle la fonction annulerReservation et on indique qu'il n'y a plus de réservation en cours
            this.annulerReservation();
            this.currentReservation = false;
        }.bind(this));

        //-----Au rechargement de la page on appelle les fonctions refreshreservation et refreshTimer. Et si une réservation est encours, on scroll jusqu'au compteur pour qu'elle soit visible facilement 
        $(window).load(function() {
            this.refreshReservation();
            this.timer.refreshTimer();
            $("#stationResa").html(sessionStorage.getItem('Station'));
            $("#userId").html((localStorage.getItem('Prenom'))+' '+(localStorage.getItem('Nom')));
            if (true === this.currentReservation) {
                $('html,body').animate({scrollTop: $("#compteurResa").offset().top});
            };
        }.bind(this));
    };  

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    // --------------------------------------------------------------------Fonctions----------------------------------------------------------------------------------//
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    //---Fonction de déplacement de la carte et d'affichage du bloc de réservation---//
    afficherResa() {
        //-----Si displayResa = false et que la taille de la fenetre est > 850px alors: 
        if (false === this.displayResa && 850 < $(window).width() ) {
            //-----1) On replace la carte sur la gauche
            $("#map").animate({
                marginLeft: "2%"
            }, 600);
            //-----2)Au bout 1.2sec on affiche le bloc de réservation
            setTimeout(function() {
                $("#reservation").fadeIn(1000);
            }, 600);
            //-----Si displayResa = false et que la taille de la fenetre est < 850px alors: 
        } else if (false === this.displayResa && 850 >= $(window).width() ) {
            // -----1)On fait apparaitre le bloc réservation (en dessous de la carte et la carte reste centrée)
            $("#reservation").fadeIn(1000);
        };
        // -----Dans les 2 cas, on fait passer displayResa à true afin que l'animation ne se fasse qu'au premier clic. 
        //-----Ainsi, si on reclique sur l carte, l'animation de la cartene se relance pas et le bloc réservation ne disparait pas.
        this.displayResa = true;
    };

    //---Fonction pour préremplir les champs nom et prénom avec les données stocker dans le localStorage à la derniere visite---//
    displayUsername() {
        //-----Si les sessionStorage des nom et prénom ne sont pas vides, alors on affiche leur contenu à la prochaine visite
        if (this.nom !== null && this.Prenom !== null) {
            this.champNom.setAttribute("value", this.nom);
            this.champPrenom.setAttribute("value", this.Prenom);
        };
    };

    //---Sauvegarde des données dans localStorage---//
    saveUserInfos() {
        localStorage.setItem('Nom', this.champNom.value);
        localStorage.setItem('Prenom', this.champPrenom.value);
    };

    //---Sauvegarde du nom de la station et de la date de réservation dans sessionStorage---//
    saveReservation() {
        sessionStorage.clear();
        sessionStorage.setItem('Station', document.getElementById('stationName').textContent);
        let date = new Date();
        let initialTime = date.getTime();
        sessionStorage.setItem('initialTime', initialTime);
    };

    //---Fonction d'annulation de la réservation---//
    annulerReservation() {
        //-----1) On clear de canvas et les données de réservation de sessionStorage et on le cache (ainsi que les boutons de confirmation et d'annulation)
        canvas.clearCanvas();
        sessionStorage.clear();
        $("#annulation, #compteurResa, resaExpiree").hide();
        //-----2) On remet le timer à 20min et on clear le decompte
        this.timer.decompteMin = 20;
        this.timer.min.textContent = 20;
        this.timer.decompteSec = 0;
        this.timer.sec.textContent = 0;
        clearInterval(this.timer.intervalId);
        //-----3) On affiche le formulaire et on remplace le compteur par un message de confirmation de l'annulation
        $("form, #resaAnnulee").show();
        $(".currentResaMessage").hide();
    };

    //---Fonction de sauvegarde du temps au rechargement de la page---//
    refreshReservation() {
        sessionStorage.setItem('refreshTime', this.refreshTime);
    };
};