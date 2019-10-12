/* Ce fichier a pour fonction la gestion du décompte dynamique du temps restant
 * avant expiration de la réservation.
 */

class Timer {

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    // --------------------------------------------------------------------Constructor----------------------------------------------------------------------------------//
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//

    constructor() {
        //-----Définition des élement secondes et minutes
        this.sec = document.getElementById("sec");
        this.min = document.getElementById("min");
        //-----Transformation du texte des secondes et minutes en nombre
        this.decompteSec = Number(this.sec.textContent);
        this.decompteMin = Number(this.min.textContent);
        //-----Temps de la réservation en millisecondes
        this.dureeResa = (20 * 60 * 1000);
        //-----Interval du décompte
        this.intervalId = null;
    };

    //---Fonction du décompte de temps de réservation---//
    interval() {
        //-----Toutes les secondes :
        this.intervalId = setInterval(() => {
            //-----Si les secondes sont à 0 et que les minutes sont différentes de 0 alors:
            if (0 === this.decompteSec && 0 != this.decompteMin) {
                //-----1) on passe les secondes à 59
                this.decompteSec = 59;
                this.sec.textContent = 59;
                //-----2) o n décremente les minutes de 1
                this.min.textContent = this.decompteMin - 1;
                this.decompteMin = this.decompteMin - 1;
                //-----Si les secondes sont > 1  et que les minutes sont >= 0 alors:
            } else if (1 <= this.decompteSec && 0 <= this.decompteMin) {
                //-----1) On décrémente les secondes de 1
                this.sec.textContent = this.decompteSec - 1;
                this.decompteSec = this.decompteSec - 1;
                //-----2) Les minutes restent inchangés
                this.min.textContent = this.decompteMin;
                //-----Si les secondes sont à 0  et que les minutes sont aussi à 0 alors:
            } else if (0 === this.decompteMin && 0 === this.decompteSec) {
                //-----1) On annule la réservation
                sessionStorage.clear();
                //-----2) On stop le décompte
                clearInterval(this.intervalId);
                // -----3) On affiche un message d'expiration de la réservation et on cache le
                // compteur
                $("#resaExpiree, form").show();
                $("#compteurResa, .currentResaMessage, #annulation").hide();
                //-----4)Il n'y a plus de réservation en cours
                resa.currentReservation = false;
            }
        }, 1000);
    };

    //---Fonction pour raffraichir le timer au rechargement de la page---//
    refreshTimer() {
        // ---déclaration des variables---// 
        //-----temps passé de puis la réservation(en millisecondes) = timeStamp au rechargement de la page - timeStamp au moment de la réservation
        let passedTime = sessionStorage.getItem('refreshTime') - sessionStorage.getItem('initialTime');
        //----- temps raffraichi = 20 minutes - passedtime
        let refreshedTimer = this.dureeResa - passedTime;
        //-----Valeurs des minutes et secondes du temps raffraichi
        let refreshedTimerMin = Math.floor(refreshedTimer / (60 * 1000));
        let refreshedTimerSec = Math.round((refreshedTimer % (60 * 1000)) / 1000);
        // -----Si le temps qui à passé entre la réservation et le rechargement de la
        // page est inférieur à 20min :
        if (passedTime < this.dureeResa) {
            // -----1) On récupère le nom de la station dans laquelle la réservation à été faite
            $("#stationResa").html(sessionStorage.getItem('Station'));
            // -----2) On affiche le compteur et le bouton annuler et on indique qu'une réservation est en cours
            $("#compteurResa, #annulation").show();
            resa.currentReservation = true;
            // -----3)On détermine le nouveau timer avec le temps qui a passé depuis la réservation et on relance l'interval
            this.decompteMin = refreshedTimerMin;
            this.min.textContent = refreshedTimerMin;
            this.decompteSec = refreshedTimerSec;
            this.sec.textContent = refreshedTimerSec;
            this.interval();
            // -----Si le temps qui à passé entre la réservation et le rechargement de la page est supérieur à 20min :
        } else if (passedTime > this.dureeResa) {
            // -----1)On affiche le message d'expiration de la réservation et on indique qu'il n'y a plus de réservation en cours
            $("#resaexpiree, form").show();
            $("#compteurResa, .currentResaMessage, #annulation").hide();
            resa.currentReservation = false;
            // -----Si le temps qui à passé entre la réservation et le rechargement de la page est égal au temps enregistré au rechargement de la page                              
            // alors on n'affiche pas le compteur car cela veut dire qu'aucune réservation n'a été faite
        } else if (passedTime === sessionStorage.getItem('refreshTime')) {
            $("#compteurResa, #annulation").hide();
            resa.currentReservation = false;
        };
    };
};