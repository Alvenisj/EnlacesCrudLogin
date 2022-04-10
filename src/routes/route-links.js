const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/add', isLoggedIn, (req, res) => {

    res.render('links/add')
});


// RUTA QUE SE ENCARGA DE INSERTAR LOS LINKS A LA BASE DE DATOS
router.post('/add', async (req, res) => {

    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    }
    
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Enlace guardado correctamente');
    res.redirect('/links');

});

//RUTA QUE SE ENCARGA DE LISTAR LOS LINKS
router.get('/', isLoggedIn,  async (req, res) => {

   const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
   res.render('links/list', { links });

});

// RUTA QUE SE ENCARGA DE ELIMINAR LIS LINKS
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Enlace borrado satisfactoriamente');
    res.redirect('/links');

});

// RUTA QUE SE ENCARGA DE EDITAR LOS LINKS

router.get('/edit/:id', isLoggedIn, async (req, res) => {

    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', { links: links[0]});

});


//RUTA PARA GUARDAR LOS DATOS QUE SE EDITARON
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Enlace actualizado satisfactoriamente');
    res.redirect('/links');


})











module.exports = router;