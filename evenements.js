exports.action = function(data){ 

var reg="/"+data.day+"(.+)/i" ; var rgxp = eval(reg) ; var temp = JarvisIA.reco.match(rgxp) ; console.log(temp)
var day = temp[1].trim() ; console.log("on envoie "+day)
console.log("on envoie "+day.trim())

var mois = ""
    if (day.search('janvier')    >-1){ var mois="1"}
    if (day.search('février')    >-1){ var mois="2"}
    if (day.search('mars')       >-1){ var mois="3"}
    if (day.search('avril')      >-1){ var mois="4"}
    if (day.search('mai')        >-1){ var mois="5"}
    if (day.search('juin')       >-1){ var mois="6"}
    if (day.search('juillet')    >-1){ var mois="7"}
    if (day.search('aout')       >-1){ var mois="8"}
    if (day.search('septembre')  >-1){ var mois="9"}
    if (day.search('octobre')    >-1){ var mois="10"}
    if (day.search('novembre')   >-1){ var mois="11"}
    if (day.search('décembre')   >-1){ var mois="12"}
if(mois=="")    {console.log(mois);return false}

   var jours=day.replace(new RegExp('[^0-9]', 'ig'),"")//on garde que les chiffres
if(jours.length<1){JarvisIASpeech("je n'ai pas compris");return false}

console.log(mois);
console.log(jours);

    day=day.replace(/ /gi,'-')
console.log("Recherche d'événements pour la date du : "+day)
    var moment = require('moment');moment.locale('fr');
    var date = new Date();
    var dat = date.getMilliseconds();
console.log("Jarvis doit chercher des événements à la date du "+day)
   
    var fs = require("fs");
    var path = require('path');
    var filePath = __dirname + "/SaveEvenements/"+mois+"/"+jours+".json";
    var file_content;
    file_content = fs.readFileSync(filePath, 'utf8');
    file_content = JSON.parse(file_content);

    if(typeof file_content[dat] != 'undefined' && file_content[dat] != "") {
        var infos = file_content[dat];
    console.log("Informations: " + infos);
    JarvisIASpeech(infos);
        return; }
    else {
        var url = 'https://www.calagenda.fr/histoire-du-jour-'+day+'.html'; 
    console.log('Url Request: ' + url);
        var request = require('request');
        var cheerio = require('cheerio');

        request({ 'uri': url}, function(error, response, html) {

    if (error || response.statusCode != 200) {
    JarvisIASpeech("La requête vers Google a échoué. Erreur " + response.statusCode );
        return; }
        
        var $ = cheerio.load(html, { xmlMode: false, ignoreWhitespace: true, lowerCaseTags: true });

        var nbrcitation = $('#tablehistoire > article').length;
    console.log(nbrcitation);
        var Choix = Math.floor(Math.random() * nbrcitation);
        var jour_mois = $('#tablehistoire > article').eq(Choix).find('h3').text().trim()
        var histoire = $('#tablehistoire > article').eq(Choix).find('p').text().trim()
    
    console.log(jour_mois)
    console.log(histoire)
            
        var événement = ("le "+jour_mois+" : "+histoire); 
            if(événement == "") {   // Si la première version n'existe pas on teste l'autre
        var événement = ("le "+jour_mois+" : "+histoire);
        }

            if(événement == "") {
        console.log("Impossible de récupérer d'événements pour le "+day);
        JarvisIASpeech("Désolé, je n'ai pas réussi à trouver d'événements pour le "+day); }
            else {
                file_content[dat] = événement;
                chaine = JSON.stringify(file_content, null, '\t');
                fs.writeFile(filePath, chaine, function (err) {
                console.log("[ --- "+day+" --- ] Evénements enregistrés");
                });
    
    console.log("Informations: " + événement);
    JarvisIASpeech(événement);
            }
            return;
        }); 
    }
    
}