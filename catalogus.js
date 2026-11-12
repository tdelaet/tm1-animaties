/* TM1-animaties — catalogus van alle delen, hoofdstukken en voorbeelden uit het handboek.
   Dit is de enige plaats die je aanpast als er een pagina bijkomt:
     - zet status op 'klaar' (zichtbaar en aanklikbaar op de overzichtspagina),
       'bezig' (zichtbaar, niet aanklikbaar) of laat 'gepland' staan;
     - het bestand staat in de map van het hoofdstuk, met de naam die TM1.pad() geeft
       (bv. h13-kinematica-puntmassa/vb13-1-kind-op-een-schommel.html),
       tenzij je bij het voorbeeld zelf een 'pad' opgeeft.
   soort: 'vb' = voorbeeld, 'op' = geïntegreerde opgave. */
window.TM1 = window.TM1 || {};

TM1.catalogus = [
  { deel: 'I', titel: 'Vectorrekening', hoofdstukken: [
    { nr: 1, titel: 'Vectoren, bewerkingen en vectorvergelijkingen', map: 'h01-vectoren', items: [
      { id: '1.1', titel: 'Eenheidsvector' },
      { id: '1.2', titel: 'Richtingscosinussen' },
      { id: '1.3', titel: 'Vector in twee assenstelsels' },
      { id: '1.4', titel: 'Vectorvergelijking oplossen' },
      { id: '1.5', titel: 'Vectorbewerkingen' },
      { id: '1.6', titel: 'Vectorproduct' },
      { id: '1.7', titel: 'Afgeleide vectorfunctie' }]},
    { nr: 2, titel: 'Vectoren voor meetkundige analyse', map: 'h02-meetkundige-analyse', items: [
      { id: '2.1', titel: 'Vlaggenmast' },
      { id: '2.2', titel: 'Mobiele robot' },
      { id: '2.3', titel: 'Reuzenrad' },
      { id: '2.4', titel: 'Rollend wiel' },
      { id: '2.5', titel: 'Sta-apparaat' },
      { id: '2.6', titel: 'Telescopische kraanwagen' },
      { id: '2.7', titel: 'Kruk-drijfstangmechanisme' },
      { id: '2.8', titel: 'Sta-apparaat' },
      { id: '2.9', titel: 'Telescopische kraanwagen' },
      { id: '2.10', titel: 'Kruk-drijfstangmechanisme' },
      { id: '2.11', titel: 'Kubus duwt tegen zware plaat' },
      { id: '2.12', titel: 'Van rotatie naar rotatie' }]}
  ]},
  { deel: 'II', titel: 'Statica van enkelvoudige lichamen', hoofdstukken: [
    { nr: 3, titel: 'Krachten', map: 'h03-krachten', items: [] },
    { nr: 4, titel: 'Vrijmaken – vrijlichaamdiagram', map: 'h04-vrijlichaamdiagram', items: [
      { id: '4.1', titel: 'Lichaam in contact met vier andere lichamen' }]},
    { nr: 5, titel: 'Krachtenevenwicht', map: 'h05-krachtenevenwicht', items: [
      { id: '5.1', titel: 'Last aan twee kabels' },
      { id: '5.2', titel: 'Lichaam in contact met vier andere lichamen' },
      { id: '5.3', titel: 'Last op een hellend vlak' }]},
    { nr: 6, titel: 'Momenten', map: 'h06-momenten', items: [
      { id: '6.1', titel: 'Equivalente koppels van krachten' },
      { id: '6.2', titel: 'Zwaartepunt dunne driehoekige homogene plaat' }]},
    { nr: 7, titel: 'Evenwicht van een lichaam', map: 'h07-evenwicht-lichaam', items: [
      { id: '7.1', titel: 'Drie onafhankelijke voorwaarden in 2D' },
      { id: '7.2', titel: 'Zes onafhankelijke voorwaarden in 3D' },
      { id: '7.3', titel: 'Een last aan een kraanhaak' },
      { id: '7.4', titel: 'Een ingeklemde balk' },
      { id: '7.5', titel: 'Een luifel met sneeuwlast' },
      { id: '7.6', titel: 'Een man staat op een ladder' },
      { id: '7.7', titel: 'Een blok ligt op een hellend vlak' },
      { id: '7.8', titel: 'Lamp vastgemaakt aan de muur' }]}
  ]},
  { deel: 'III', titel: 'Statica samengestelde lichamen', hoofdstukken: [
    { nr: 8, titel: 'Samengesteld lichaam in statisch evenwicht', map: 'h08-samengesteld-lichaam', items: [
      { id: '8.1', titel: 'Stavenconstructie met kabel' },
      { id: '8.2', titel: 'Loods' },
      { id: '8.3', titel: 'Stavenconstructie met kabel' },
      { id: '8.4', titel: 'Loods' }]},
    { nr: 9, titel: 'Inwendige krachten en momenten', map: 'h09-inwendige-krachten', items: [
      { id: '9.1', titel: 'Doorsnijding van een balk' },
      { id: '9.2', titel: 'Driepuntsbuiging' },
      { id: '9.3', titel: 'Vierpuntsbuiging' }]},
    { nr: 10, titel: 'Stavenconstructies en vakwerken', map: 'h10-vakwerken', items: [
      { id: '10.1', titel: 'Stavenconstructie met kabel' },
      { id: '10.2', titel: 'Knoop met twee vakwerkstaven' },
      { id: '10.3', titel: 'Vlak vakwerk – isostatisch?' },
      { id: '10.4', titel: 'Vlak vakwerk' }]},
    { nr: 11, titel: 'Geïntegreerde opgaven bij het deel Statica', map: 'h11-opgaven-statica', items: [
      { id: '11.1', soort: 'op', titel: 'Een antennemast' },
      { id: '11.2', soort: 'op', titel: 'Een basculebrug' },
      { id: '11.3', soort: 'op', titel: 'Een beladen trein op een brug' }]}
  ]},
  { deel: 'IV', titel: 'Kinematica via tijdsafgeleiden', hoofdstukken: [
    { nr: 12, titel: 'Inleiding', map: 'h12-inleiding-kinematica', items: [] },
    { nr: 13, titel: 'Kinematica van een puntmassa', map: 'h13-kinematica-puntmassa', items: [
      { id: '13.1', titel: 'Kind op een schommel', status: 'klaar' },
      { id: '13.2', titel: 'Een vliegtuig landt met zijwind', status: 'klaar' },
      { id: '13.3', titel: 'Kind op een schommel (versnelling)', status: 'klaar',
        pad: 'h13-kinematica-puntmassa/vb13-3-kind-op-een-schommel.html', opmerking: 'bouwt verder op Vb. 13.1' },
      { id: '13.4', titel: 'Versnellende auto', status: 'klaar' },
      { id: '13.5', titel: 'Katapult slingert kei weg', status: 'klaar' },
      { id: '13.6', titel: 'Cirkelbeweging met constante grootte van de snelheid', status: 'klaar' },
      { id: '13.7', titel: 'Een rechtlijnige beweging', status: 'klaar' },
      { id: '13.8', titel: 'Een slingerbeweging', status: 'klaar' },
      { id: '13.9', titel: 'Plooiladder', status: 'klaar' }]},
    { nr: 14, titel: 'Kinematica van een lichaam', map: 'h14-kinematica-lichaam', items: [
      { id: '14.1', titel: 'Reuzenrad: translatie van de gondel', status: 'klaar' },
      { id: '14.2', titel: 'Rotor van een helikopter' },
      { id: '14.3', titel: 'Wasmachine' },
      { id: '14.4', titel: 'Ronddraaiende cilinder', status: 'klaar', opmerking: 'voorstel van uitwerking (niet in het handboek)' }]},
    { nr: 15, titel: 'Meetkundige analyses voor snelheden', map: 'h15-snelheden-meetkundig', items: [
      { id: '15.1', titel: 'Vlaggenmast', status: 'klaar' },
      { id: '15.2', titel: 'Mobiele robot', status: 'klaar' },
      { id: '15.3', titel: 'Reuzenrad', status: 'klaar' },
      { id: '15.4', titel: 'Rollend wiel', status: 'klaar' },
      { id: '15.5', titel: 'Telescopische kraanwagen' },
      { id: '15.6', titel: 'Telescopische kraanwagen' },
      { id: '15.7', titel: 'Plooiladder' },
      { id: '15.8', titel: 'Kubus duwt tegen zware plaat' },
      { id: '15.9', titel: 'Van rotatie naar rotatie' },
      { id: '15.10', titel: 'Windturbine' }]}
  ]},
  { deel: 'V', titel: 'Kinematica via bewegende assenstelsels', hoofdstukken: [
    { nr: 16, titel: 'Inleiding', map: 'h16-inleiding-bewegende-assen', items: [] },
    { nr: 17, titel: 'Kinematica in verschillende assenstelsels', map: 'h17-bewegende-assenstelsels', items: [
      { id: '17.1', titel: 'Toegepast op de telescopische kraanwagen' },
      { id: '17.2', titel: 'Een rolbeweging' },
      { id: '17.3', titel: 'Kubus duwt tegen zware plaat' },
      { id: '17.4', titel: 'Een kruk-drijfstangmechanisme' },
      { id: '17.5', titel: 'Wiel van een spoorrijtuig rolt over een spoor' }]},
    { nr: 18, titel: 'Geïntegreerde opgaven bij het deel Kinematica', map: 'h18-opgaven-kinematica', items: [
      { id: '18.1', soort: 'op', titel: 'Een windturbine' },
      { id: '18.2', soort: 'op', titel: 'Een sproeier voor een gazon' },
      { id: '18.3', soort: 'op', titel: 'Een vrijworp in het basketbal' }]}
  ]},
  { deel: 'VI', titel: 'Dynamica van enkelvoudige lichamen', hoofdstukken: [
    { nr: 19, titel: 'Dynamica van een puntmassa', map: 'h19-dynamica-puntmassa', items: [
      { id: '19.1', titel: 'Een slinger beschrijft een kegelbeweging' },
      { id: '19.2', titel: 'Een blok op een vallend platform' },
      { id: '19.3', titel: 'Een container hangt aan een loopkat' },
      { id: '19.4', titel: 'Een massa aan een ronddraaiende veer' },
      { id: '19.5', titel: 'Een massa rondgeslingerd in een verticaal vlak' },
      { id: '19.6', titel: 'Tweede postulaat als differentiaalvergelijking' }]},
    { nr: 20, titel: 'Dynamica van star lichaam in vlakke beweging', map: 'h20-dynamica-star-lichaam', items: [
      { id: '20.1', titel: 'Traagheidsmoment van een halter' },
      { id: '20.2', titel: 'Traagheidsmoment van een dunne staaf' },
      { id: '20.3', titel: 'Rotatie van een lichaam uit twee massa’s (video)' },
      { id: '20.4', titel: 'Aandrijving van een vliegwiel' },
      { id: '20.5', titel: 'Scharnierende staaf' },
      { id: '20.6', titel: 'Cilinder rolt langs helling naar beneden' }]},
    { nr: 21, titel: 'Dynamica van star lichaam in vlakke beweging: Steiner', map: 'h21-steiner', items: [
      { id: '21.1', titel: 'Scharnierende staaf rond een vaste as' }]}
  ]},
  { deel: 'VII', titel: 'Dynamica: energie en meerdere lichamen', hoofdstukken: [
    { nr: 22, titel: 'Bewegingsvergelijkingen samengestelde lichamen', map: 'h22-samengestelde-lichamen', items: [
      { id: '22.1', titel: 'Een doos op een versnellende slede' }]},
    { nr: 23, titel: 'Arbeid, energie en vermogen', map: 'h23-arbeid-energie', items: [
      { id: '23.1', titel: 'Puntmassa langs een ruimtelijke kromme' },
      { id: '23.2', titel: 'Arbeid van een constante kracht' },
      { id: '23.3', titel: 'Arbeid van een constant motorkoppel' },
      { id: '23.4', titel: 'Uitrekken van een veer' },
      { id: '23.5', titel: 'Uitrekken van een veer met potentiaalfunctie' },
      { id: '23.6', titel: 'Puntmassa schuift langs een helling' },
      { id: '23.7', titel: 'Vrije val van een puntmassa' },
      { id: '23.8', titel: 'Puntmassa verbonden aan een veer' },
      { id: '23.9', titel: 'Puntmassa hangt aan een veer' },
      { id: '23.10', titel: 'Twee puntmassa’s verbonden door een veer' },
      { id: '23.11', titel: 'Schijf aangedreven door een motor' },
      { id: '23.12', titel: 'Scharnierende staaf' },
      { id: '23.13', titel: 'Cilinder rolt langs helling naar beneden' }]},
    { nr: 24, titel: 'Samenvatting en richtlijnen voor dynamicaproblemen', map: 'h24-samenvatting-dynamica', items: [] },
    { nr: 25, titel: 'Geïntegreerde opgaven bij het deel Dynamica', map: 'h25-opgaven-dynamica', items: [
      { id: '25.1', soort: 'op', titel: 'Een auto versnelt op een helling' },
      { id: '25.2', soort: 'op', titel: 'Een kind zit op een schommel' }]}
  ]},
  { deel: 'VIII', titel: 'Virtuele arbeid', hoofdstukken: [
    { nr: 26, titel: 'Virtuele arbeid', map: 'h26-virtuele-arbeid', items: [
      { id: '26.1', titel: 'Telescopische kraanwagen' },
      { id: '26.2', titel: 'Takel' },
      { id: '26.3', titel: 'Een balk op twee steunpunten' },
      { id: '26.4', titel: 'Balk opgehangen aan een wand' },
      { id: '26.5', titel: 'Stangenmechanisme met vier stangen' },
      { id: '26.6', titel: 'Een enkele slinger' },
      { id: '26.7', titel: 'Een dubbele slinger' },
      { id: '26.8', titel: 'Schaarmechanisme' }]},
    { nr: 27, titel: 'Geïntegreerde opgaven bij het deel Virtuele arbeid', map: 'h27-opgaven-virtuele-arbeid', items: [
      { id: '27.1', soort: 'op', titel: 'Een ophaalbrug' },
      { id: '27.2', soort: 'op', titel: 'Een fietser rijdt een helling op' }]}
  ]}
];

/** Maakt van een titel een bestandsnaamdeel: kleine letters, zonder accenten of leestekens. */
TM1.slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Pad van een pagina, relatief t.o.v. de hoofdmap. */
TM1.pad = (hfst, item) => item.pad ||
  `${hfst.map}/${item.soort || 'vb'}${item.id.replace('.', '-')}-${TM1.slug(item.titel)}.html`;
