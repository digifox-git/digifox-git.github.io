function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

document.addEventListener("DOMContentLoaded", function() {

    if (localStorage.getItem("user-search-background") === null) {
        save_data("user-search-background", "bubbles.jpg")
    }
    
    background = localStorage.getItem("user-search-background"); 

    document.body.style.backgroundImage = `url(assets/backgrounds/${background})`;

})

function set_background() {

    background = document.getElementById("selectbackground").value;

    if (background == "Bubbles") {
        save_data("user-search-background", "bubbles.jpg")
    }

    if (background == "Wireframe") {
        save_data("user-search-background", "wireframe.jpg")
    }

    if (background == "Winter Night") {
        save_data("user-search-background", "winternight.gif")
    }

    if (background == "Websurfer") {
        save_data("user-search-background", "websurfer.jpg")
    }
    
    if (background == "Wealth") {
        save_data("user-search-background", "wealth.gif")
    }
    
    if (background == "Waves") {
        save_data("user-search-background", "waves.gif")
    }
    
    if (background == "Traffic Jam") {
        save_data("user-search-background", "trafficjam.gif")
    }
    
    if (background == "Town Square") {
        save_data("user-search-background", "townsquare.gif")
    }
        
    if (background == "Tie Dye") {
        save_data("user-search-background", "tiedye.jpg")
    }
        
    if (background == "The Web") {
        save_data("user-search-background", "theweb.gif")
    }
        
    if (background == "Supernova") {
        save_data("user-search-background", "supernova.gif")
    }
        
    if (background == "Space Love") {
        save_data("user-search-background", "spacelove.gif")
    }
        
    if (background == "Smiletown") {
        save_data("user-search-background", "smiletown.gif")
    }
        
    if (background == "Sky High") {
        save_data("user-search-background", "skyhigh.gif")
    }
        
    if (background == "Rose") {
        save_data("user-search-background", "rose.gif")
    }
        
    if (background == "Regal Quilt") {
        save_data("user-search-background", "regalquilt.gif")
    }
        
    if (background == "Pool") {
        save_data("user-search-background", "pool.gif")
    }
        
    if (background == "Pastel Pots") {
        save_data("user-search-background", "pastelpots.jpg")
    }
        
    if (background == "Nectar") {
        save_data("user-search-background", "nectar.jpg")
    }
        
    if (background == "Musical") {
        save_data("user-search-background", "musical.jpg")
    }
        
    if (background == "Compact Disk") {
        save_data("user-search-background", "compactdisk.gif")
    }
        
    if (background == "Meadow") {
        save_data("user-search-background", "meadow.jpg")
    }
        
    if (background == "Mainframe") {
        save_data("user-search-background", "mainframe.gif")
    }
        
    if (background == "Love Chess") {
        save_data("user-search-background", "lovechess.gif")
    }
        
    if (background == "Lily") {
        save_data("user-search-background", "lily.gif")
    }
        
    if (background == "Interlocking Skulls") {
        save_data("user-search-background", "interlockingskulls.jpg")
    }
        
    if (background == "Illusion") {
        save_data("user-search-background", "illusion.gif")
    }
        
    if (background == "Ice Bouquet") {
        save_data("user-search-background", "icebouquet.jpg")
    }
            
    if (background == "Hopes and Dreams") {
        save_data("user-search-background", "hopesanddreams.gif")
    }
            
    if (background == "Home") {
        save_data("user-search-background", "home.gif")
    }
            
    if (background == "Floppy Heaven") {
        save_data("user-search-background", "floppyheaven.gif")
    }
            
    if (background == "Clover") {
        save_data("user-search-background", "clover.gif")
    }
            
    if (background == "Checkerboard") {
        save_data("user-search-background", "checkerboard.gif")
    }
            
    if (background == "Cardstock Apples") {
        save_data("user-search-background", "cardstockapples.jpg")
    }
            
    if (background == "Butterfly Stars") {
        save_data("user-search-background", "butterflystars.gif")
    }
            
    if (background == "Blue Space") {
        save_data("user-search-background", "bluespace.gif")
    }

    if (background == "Blue Ocean") {
        save_data("user-search-background", "blueocean.gif")
    }
            
    if (background == "Beach") {
        save_data("user-search-background", "beach.gif")
    }
                
    if (background == "Autumn") {
        save_data("user-search-background", "autumn.jpg")
    }

    savedBackground = localStorage.getItem("user-search-background");

    document.body.style.backgroundImage = `url(assets/backgrounds/${savedBackground})`; 
}

function display_warning() {
    var element = document.getElementById('epilepsywarning');

    if (localStorage.getItem("user-hide-epilepsy-warnings") != "true") {
        if(element.style.display == 'none' ||element.style.display == '') {
            element.style.display = 'flex';
        }
    }
}

function hide_warning() {
    var element = document.getElementById('epilepsywarning');

    if(element.style.display == 'flex') {
        element.style.display = 'none';
    }
}
