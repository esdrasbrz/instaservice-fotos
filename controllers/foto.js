/**
 * Controller para upload e operações com fotos
 */

var config = require('../config.json');

exports.postFotos = function(req, res) {
    if (!req.files)
        res.status(400).send({message: "Nenhum arquivo de imagem!"});

    var arquivo = req.files.arquivo;
    var nome_arquivo = String(Date.now());

    arquivo.mv(config.server.uploads_dir + nome_arquivo, function(err) {
        if (err)
            res.status(400).send(err);

        req.getConnection(function(err, connection) {
            if (err)
                res.status(400).send(err);

            var data = req.body;
            data['arquivo'] = nome_arquivo;
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
