/**
 * Controller para upload e operações com fotos
 */

var config = require('../config.json');
var fs = require('fs');

exports.postFotos = function(req, res) {
    if (!req.files)
        res.status(400).send({message: "Nenhum arquivo de imagem!"});

    var arquivo = req.files.arquivo;
    var nome_arquivo = req.user.id + '.' + String(Date.now());

    arquivo.mv(config.server.uploads_dir + nome_arquivo, function(err) {
        if (err)
            res.status(400).send(err);

        req.getConnection(function(err, connection) {
            if (err)
                res.status(400).send(err);

            var data = req.body;
            data['arquivo'] = nome_arquivo;
            data['usuario_id'] = req.user.id;
            connection.query('INSERT INTO Foto SET ?', [data], function(err, rows) {
                if (err)
                    res.status(400).send(err);

                res.json({message: "Foto postada com sucesso!"});
            });
        });
    });
};

exports.getFotos = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('SELECT * FROM Foto', function(err, rows) {
            if (err)
                res.status(400).send(err);

            res.json(rows);
        });
    });
};

exports.getFoto = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('SELECT * FROM Foto WHERE id = ?', [req.params.id], function(err, rows) {
            if (err)
                res.status(400).send(err);

            if (rows.length != 1)
                res.status(404).send();
            else
                res.json(rows[0]);
        });
    });
};

exports.putFoto = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('UPDATE Foto SET ? WHERE id = ? and usuario_id = ?', [req.body, req.params.id, req.user.id], function(err, rows) {
            if (err)
                res.status(400).send(err);

            res.json(rows);
        });
    });
};

exports.deleteFoto = function(req, res) {
    req.getConnection(function(err, connection) {
        if (err)
            res.status(400).send(err);

        connection.query('SELECT * FROM Foto WHERE id = ? and usuario_id = ?', [req.params.id, req.user.id], function(err, rows) {
            if (err)
                res.status(400).send(err);

            if (rows.length != 1) {
                res.status(404).send();
            } else {
                var foto = rows[0];

                connection.beginTransaction(function(err) {
                    if (err)
                        res.status(400).send(err);

                    connection.query('DELETE FROM Foto WHERE id = ?', [req.params.id], function(err, rows) {
                        if (err) {
                            connection.rollback(function() {
                                res.status(400).send(err);
                            });
                        }

                        connection.commit(function(err) {
                            if (err) {
                                connection.rollback(function() {
                                    res.status(400).send(err);
                                });
                            }

                            fs.unlink(config.server.uploads_dir + foto.arquivo);
                            res.json({ message: 'Foto excluída com sucesso!' });
                        });
                    });
                });
            }
        });
    });
};
