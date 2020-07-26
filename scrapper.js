const cheerio = require('cheerio');
const request = require('request-promise');

// con callback
exports.ExistePalabra = (palabra, cb) => {
    var url = 'https://dle.rae.es/srv/search?w=' + palabra;
    request(url, (error, resp, body) => {
        if (error) {
            cb({
                error: error
            });
        }

        let $ = cheerio.load(body);
        let $resultado = $("#resultados").text().trim();

        var buf = Buffer.from($resultado);
        var data;

        if (buf.indexOf("Aviso") == 0) {
            data = "Esta palabra no existe";
        } else {
            data = "Esta palabra si existe";
        }

        cb(data);
    });
}


/*** otro tipo de la misma funcion con async await promise */
module.exports = {
    async Existe(palabra) {
        const $ = await request({
            uri: 'https://dle.rae.es/srv/search?w=' + palabra,
            transform: body => cheerio.load(body)
        });

        const resultado = await $("#resultados").text().trim();

        var buf = Buffer.from(resultado);

        if (buf.indexOf("Aviso") == 0) {
            return "Esta palabra no existe";
        } else {
            return "Esta palabra si existe";
        }
    }
};