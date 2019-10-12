/*
Ce fichier a pour fonction la gestion de la logique du carrousel décrivant le fonctionnement de l'application
*/

class Carrousel {

    // -----------------------------------------------------------------------------------------------------------------------------------------------------//
    // ----------------------------------------------------------------------Constructor----------------------------------------------------------------------//
    // -----------------------------------------------------------------------------------------------------------------------------------------------------//
    constructor() {
        //-----Timer du diaporama
        this.timerSlide = 5000;
        //-----Slide actuelle
        this.slide = 1;
        //-----nombre de slides
        this.nbSlide = 1;
        //-----défilement du diaporama
        this.interval = null;
        //-----Mise en pause
        this.pause = false;
        //-----autoStart
        this.autoStart = true;
        //-----Défini si autoStart activé
        this.pause = !this.autoStart;
        //-----nombre de Slide
        this.nbSlide = $(".carrousel li").length;
        //-----Fonctions à appeler automatiquement 
        this.addCarrouselButtons();
        this.addPagination();
        this.listeners();
        //-----Lancement du diaporama
        this.interval = setInterval(function() {
            this.moveSlide(1)
        }.bind(this), this.timerSlide);
    };

    // -----------------------------------------------------------------------------------------------------------------------------------------------------//
    // ---------------------------------------------------------------------- Event listeners---------------------------------------------------------------//
    // -----------------------------------------------------------------------------------------------------------------------------------------------------//
    listeners() {
        //-----Clic sur le bouton next
        $(".fleche_droite").on("click", function() {
            this.moveSlide(1);
        }.bind(this));

        //-----Clic sur le bouton previous
        $(".fleche_gauche").on("click", function() {
            this.moveSlide(0);
        }.bind(this));

        //-----Clic sur le bouton pause
        $(".pause").on("click", function() {
            $(".pause ").toggle();
            this.makePause();
            this.pause = !this.pause;
        }.bind(this));

        //-----Appuie touches flèches
        $("body").on("keydown", function() {
            //-----Appuie touche flèche droite
            if (39 === event.which) {
                this.moveSlide(1);
                //-----Appuie touche flèche gauche
            } else if (37 === event.which) {
                this.moveSlide(0);
            };
        }.bind(this));
    };

    // -----------------------------------------------------------------------------------------------------------------------------------------------------//
    // ----------------------------------------------------------------------Fonctions----------------------------------------------------------------------//
    // -----------------------------------------------------------------------------------------------------------------------------------------------------//

    //---Fonction de défilement des slides. Direction 1 va en avant et direction 0 retourne en arriere---//
    moveSlide(direction) {
        //-----Si la direction est 1, alors on appelle la fonction moveNextSlide
        if (1 === direction) {
            this.moveNextSlide();
        //----- Si la direction est 0, alors on appelle la fonction movePreviousSlide
        } else if (0 === direction) {
            this.movePreviousSlide();
        };
    };

    //---Fonction de défilement du carrousel vers la slide suivante---//
    moveNextSlide() {
        //---Déplacement de la timeline---//
        //-----Valeur du déplacement de la timeline
        let moveTimelineValue ='+=20%';
        //-----Si le nombre de slide est supérieur au numéro de la slide affichée, alors la marge gauche de la timeline augmente de la valeur moveTimelineValue, sinon, elle est égal à 0
        let marginLeftTimelineValue = (this.slide < this.nbSlide) ? moveTimelineValue : '0px';
        //-----Animation de la timeline
        $("#moving_bloc").animate({
            marginLeft : marginLeftTimelineValue
        },1000);

        //-----Déplacement des slides
        //-----Valeur du déplacement de la slide
        let moveValue = '-=100%';
        //-----Si le nombre de slide est supérieur au numéro de la slide affichée, alors la marge gauche du carrousel dimine de la valeur moveValue, sinon, elle est égal à 0
        let marginLeftValue = (this.slide < this.nbSlide) ? moveValue : '0px';
        //-----Animation du carrousel
        $("#diaporama").animate({
            marginLeft: marginLeftValue
        }, 1000);
        //-----Si la slide affiché à le même numéro que le nombre de slide, on dit que cette slide a pour numéro 0 
        if (this.slide === this.nbSlide) {
            this.slide = 0;
        };
        //-----On incrémente les numéros de slide
        ++this.slide;
    };

    //---Fonction de défilement du carrousel vers la slide précédente---//
    movePreviousSlide() {
        //-----Déplacement de la timeline
        let moveTimelineValue ='-=20%';
        //-----Si le numéro de la slide affichée est supérieur à 1, alors la marge gauche de la timeline diminue de la valeur de moveTimelineValue 
        //-----sinon, elle est égal à la valeur max que peut prendre le déplacement (ici, 80%)
        let marginLeftTimelineValue = (this.slide > 1) ? moveTimelineValue : ((this.nbSlide - 1) * (100/this.nbSlide)) + '%';
        $("#moving_bloc").animate({
            marginLeft : marginLeftTimelineValue
        },1000);

        //-----Déplacement des slides
        let moveValue = '+=100%';
        //-----Si le numéro de la slide affichée est supérieur à 1, alors la marge gauche du carrousel augmente de la valeur de moveTimelineValue 
        //-----sinon, elle est égal à la valeur max que peut prendre le déplacement (ici, -400%)
        let marginLeftValue = (this.slide > 1) ? moveValue : (-(this.nbSlide - 1) * 100) + '%';
        $("#diaporama").animate({
            marginLeft: marginLeftValue
        }, 1000);
        //-----Si le numéro de la slide affichée est 1, on dit que le numéro de slide est égal au nombre de slide + 1 
        if (1 === this.slide) {
            this.slide = this.nbSlide + 1 ;
        }
        //-----On décrémente les numéro de slide
        --this.slide;
    };

    //---Fonction permettant de mettre le diaporama en pause et de le relancer---//
    makePause() {
        //-----Si le diaporama n'est pas en pause, au clic on stop l'interval
        if (false === this.pause) {
            clearInterval(this.interval);
        }
        //-----Si le diaporama est en pause, au clic, on le relance
        else if (true === this.pause) {
            this.interval = setInterval(function() {
                this.moveSlide(1)
            }.bind(this), this.timerSlide);
        }
    };

    //---Ajout des boutons sur le carrousel---//
    addCarrouselButtons() {
        $("#diaporama").append(
                '<button class="fleche_gauche"><i class="fas fa-chevron-left fa-2x"></i></button>'+
                '<button class="fleche_droite"><i class="fas fa-chevron-right fa-2x"></i></button>'+
                '<button class="pause"><i class="fas fa-pause fa-2x"></i></button>'+
                '<button class="pause play"><i class="fas fa-play fa-2x"></i></button>'
        );
    };

    //---Ajout de la pagination---//
    addPagination() {
        $("#diaporama").append(
            '<div id="timeline"><div id="moving_bloc"></div></div>'
        );
    };
};

