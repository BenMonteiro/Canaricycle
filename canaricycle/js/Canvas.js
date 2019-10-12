/*
Ce fichier a pour fonction de générer le champ de signature. Il est construit pour fonctionner aussi bien sur support classique que sur support tactile
*/

class Canvas {

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    // --------------------------------------------------------------------Constructor----------------------------------------------------------------------------------//
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//

    constructor() {
        //-----Definition de l'élement canvas
        this.canvas = document.getElementById('canvas');
        //-----Contexte du canvas ( ici en 2D)
        this.ctx = this.canvas.getContext('2d');
        //-----Défini si on peut ecrire dans le canvas ou non 
        this.draw = false;
        //-----Défini si il n'y a rien d'écrit dans le canvas
        this.emptyCanvas = true;
        //-----Coordonnées x et  y 
        this.x = 0;
        this.y = 0;
        //----- Fonction à appeler automatiquement
        this.touchSignature();
        this.sign();
    };

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    // --------------------------------------------------------------------Fonctions pour desktop---------------------------------------------------------------------//
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//

    //---Fonction d'initialisation du dessin---//
    initMove() {
        //-----A la position "down" de la souris, on récupère les coordonneés de la souris
        this.canvas.addEventListener('mousedown', function (e) {
            //-----On regle les bords du rectangle de dessin sur les bords du canvas
            let rect = this.canvas.getBoundingClientRect();
            //-----x = la coordonnée de la souris - la position du bord gauche du rectangle
            this.x = e.clientX - rect.left;
            //-----y = la coordonnée de la souris - la position du bord haut du rectangle
            this.y = e.clientY - rect.top;
            //-----On passe la propriété draw à true
            this.draw = true;
        }.bind(this));
    };

    //---Fonction de dessin---//
    move() {
        //-----Au mouvement de la souris, on récupère les coordonnées et on dessine un trait avec la fonction drawLine si draw = true 
        this.canvas.addEventListener('mousemove', function (e) {
            let rect = this.canvas.getBoundingClientRect();
            if (true === this.draw) {
                this.drawLine(this.ctx,this.x,this.y,e.clientX - rect.left,e.clientY - rect.top);
                this.x = e.clientX - rect.left;
                this.y = e.clientY - rect.top;
            };
        }.bind(this));
    };

    //---Fonction pour arreter le dessin---//
    stopMove() {
        //-----Si draw = true ,lorsque la souris est en position "up", on réinitialise les coordonnées de x et y et on passe draw à false 
        this.canvas.addEventListener('mouseup', function (e) {
            //-----On dit que le canvas est rempli 
            this.emptyCanvas = false;
            if (this.draw === true) {
                this.x = 0;
                this.y = 0;
                this.draw = false;
            };
        }.bind(this));
    };

    //---Fonction finale---//
    sign() {
        this.initMove();
        this.move();
        this.stopMove();
    };

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    // --------------------------------------------------------------------Fonctions dessin tactile----------------------------------------------------------------------//
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//

    //---Fonction d'initialisation du dessin---//
    initTouch() {
        //-----Au toucher, on récupère les coordonneés du touch
        this.canvas.addEventListener('touchstart', function (e) {
            //-----On regle les bords du rectangle de dessin sur les bords du canvas
            let rect = this.canvas.getBoundingClientRect();
            //-----x = la coordonnée de la souris - la position du bord gauche du rectangle
            this.x = e.touches[0].clientX - rect.left;
            //-----y = la coordonnée de la souris - la position du bord haut du rectangle
            this.y = e.touches[0].clientY - rect.top;
            //-----On passe la propriété draw à true
            this.draw = true;
        }.bind(this), false)
    };

    //---Fonction de dessin---//
    onTouchMove() {
        //-----Au mouvement du doigt, on récupère les coordonnées et on dessine un trait avec la fonction drawLine si draw =true 
        this.canvas.addEventListener('touchmove', function (e) {
            let rect = this.canvas.getBoundingClientRect();
            if (true === this.draw) {
                e.preventDefault()
                this.drawLine(this.ctx,this.x,this.y,e.touches[0].clientX - rect.left,e.touches[0].clientY - rect.top)
                this.x =e.touches[0].clientX - rect.left;
                this.y = e.touches[0].clientY - rect.top;
            }
        }.bind(this), false)
    };

    //---Fonction pour arreter le dessin---//
    stopTouch() {
        //-----Si draw = true ,lorsque l'on ne touche plus l'écran, on réinitialise les coordonnées de x et y et on passe draw à false 
        this.canvas.addEventListener('touchend', function (e) {
            //-----On dit que le canvas est rempli 
            this.emptyCanvas = false;
            if (true === this.draw) {
                this.x = 0;
                this.y = 0;
                this.draw = false
            }
        }.bind(this), false)
    };
    
    //---Fonction finale---//
    touchSignature() {
        this.initTouch();
        this.onTouchMove();
        this.stopTouch()
    };

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//
    // --------------------------------------------------------------------Fonctions communes___----------------------------------------------------------------------//
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------//

    //---Fonction définissant le dessin---// 
    drawLine(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    };

    //---Fonction pour effacer le contenu du canvas---//
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
};