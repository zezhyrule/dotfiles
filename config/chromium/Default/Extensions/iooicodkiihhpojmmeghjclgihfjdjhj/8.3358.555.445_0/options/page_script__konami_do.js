
    //  konami
    //  ======
        var konami = new Konami();
            konami.pattern = '38384040373937396665'; /* no Enter at the end */
            konami.code = function() { $('body').addClass('showKonami'); };
            konami.load();
    
    //  konami shortcut
    //  ===============
    //  $('#sidebar__logo').click(function () { $('body').toggleClass('showKonami'); return false; });
