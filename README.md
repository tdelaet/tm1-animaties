# Toegepaste Mechanica 1 — interactieve animaties

Interactieve animaties bij de voorbeelden en geïntegreerde opgaven uit het handboek
*Toegepaste Mechanica. Een vectorgebaseerde aanpak*. Elke pagina is gewone HTML en JavaScript,
zonder bouwstap: open een bestand in de browser en het werkt.

## Structuur

```
index.html                 overzichtspagina voor studenten (alle delen, hoofdstukken en voorbeelden)
catalogus.js               DE lijst van alle voorbeelden en hun status; de overzichtspagina leest alleen dit
gedeeld/
  tm1.css                  gedeelde opmaak, incl. vaste kleuren per vectorgrootheid
  tm1.js                   gedeelde tekenfuncties (pijlen, symboollabels, grafieken, animatielus …)
sjabloon/
  voorbeeld.html           startpunt voor een nieuwe animatie van een puntmassa
h01-vectoren/ … h27-opgaven-virtuele-arbeid/
                           één map per hoofdstuk, met daarin de pagina's van dat hoofdstuk
.gitlab-ci.yml             zet alles online via GitLab Pages
```

Bestandsnamen volgen een vaste regel: `vb13-1-kind-op-een-schommel.html` voor Voorbeeld 13.1,
`op25-2-een-kind-zit-op-een-schommel.html` voor geïntegreerde opgave 25.2. De overzichtspagina
berekent die naam zelf uit het nummer en de titel in `catalogus.js`.

## Een nieuwe animatie toevoegen

1. Kopieer `sjabloon/voorbeeld.html` naar de map van het hoofdstuk en geef het de juiste naam.
   De naam vind je door het voorbeeld op te zoeken in `catalogus.js`: kleine letters, zonder
   accenten, spaties worden streepjes (bv. `h13-kinematica-puntmassa/vb13-7-een-rechtlijnige-beweging.html`).
2. Pas in het bestand alles aan dat met `PAS AAN` gemarkeerd is. Voor een puntmassa volstaat vaak
   de functie `positie(t)`: snelheid en versnelling worden dan numeriek afgeleid. Staan ze analytisch
   in het handboek, vul ze dan zelf in.
3. Zet in `catalogus.js` bij dat voorbeeld `status: 'klaar'`. Vanaf dan is het aanklikbaar in het overzicht.
   Met `status: 'bezig'` verschijnt het label "in de maak".
4. Commit en push. GitLab Pages zet de nieuwe versie binnen enkele minuten online.

Een pagina die meer dan één voorbeeld dekt (zoals Vb. 13.1 en 13.3), geef je bij het tweede voorbeeld
een `pad` en eventueel een `opmerking` in `catalogus.js`.

`h13-kinematica-puntmassa/vb13-1-kind-op-een-schommel.html` is het uitgewerkte referentievoorbeeld:
die toont alle bouwstenen (vectoren met componenten, stroboscoop, natuurlijke ontbinding, drie gekoppelde
grafieken, denkvragen).

## Afspraken voor een consistente reeks

- **Notatie zoals in het handboek**: vectoren met pijl (`<span class="v">v</span><sub>P</sub>`),
  x naar rechts en y naar boven, dezelfde puntnamen als in de figuren.
- **Vaste kleuren** (in `gedeeld/tm1.css`): positie groen, snelheid blauw, versnelling oranjerood
  (tangentieel oranje, normaal roze), componenten v<sub>x</sub> teal en v<sub>y</sub> paars, krachten bruin,
  momenten paars. Elke vector krijgt daarnaast een label, zodat kleur nooit de enige aanduiding is.
- **Asbijschriften van grafieken** in LaTeX-stijl: wiskunde tussen `$…$`, bv. `'$|\\vec{v}_P|$ [m/s]'`
  of `'$a_{Pt}$ [m/s²]'` (zie `TM1.formule` in `gedeeld/tm1.js`). In JavaScript-strings staat de backslash dubbel.
- **Formules in TeX** (KaTeX): `<div class="tex">…</div>` met kleurmacro's `\kr`, `\kv`, `\ka`, `\kat`, `\kan`, `\ke`
  en gekleurde accolades `\ubv{inhoud}{naam}`, `\ubat{…}{…}`, … (zie `TM1.tex` in `gedeeld/tm1.js`). Kolomvectoren met
  `\begin{Bmatrix}…\end{Bmatrix}` zoals in het handboek; schrijf `&amp;` in plaats van `&`.
  In de pagina horen dan ook de KaTeX-links uit het sjabloon (`sjabloon/voorbeeld.html`).
- **Versnelling, snelheid en positie als stelsel**: zet *a*, *v* en *r* onder elkaar met een accolade ervoor,
  `\left\{\begin{aligned} … \\ … \\ … \end{aligned}\right.`, telkens in die volgorde (ook per fase of per component).
- **Kleur in formules** gelijk aan de animatie, voor vectoren én de bijbehorende scalaire grootheden (bv. *a*<sub>Pt</sub> oranje),
  met de klassen uit `gedeeld/tm1.css`: `<span class="k-r"><span class="v">r</span><sub>P</sub></span>`,
  `<span class="i k-at">a<sub>Pt</sub></span>` (ook `k-v`, `k-a`, `k-an`, `k-e`, `k-F`, `k-M`).
- **Valversnelling**: rekenen met *g* = 10 m/s², zoals in de cursus.
- **Vectorschaal**: vast (niet afhankelijk van de schuifregelaars); elke scène toont linksonder een vaste legende, bv. 2 m/s en 5 m/s².
- **Opgelegde beweging**: maak in de tekst duidelijk wanneer de beweging gegeven is (kinematica)
  en wanneer ze volgt uit krachten (dynamica).
- **Denkvragen** onderaan: een paar vragen die studenten met de animatie zelf kunnen beantwoorden.

## Lokaal bekijken

Dubbelklik op `index.html`. Alles werkt rechtstreeks vanuit de map; een webserver is niet nodig.
Alleen de lettertypes (Google Fonts) en KaTeX voor de formules (jsDelivr) komen van het internet; zonder
internet vallen de lettertypes terug op standaardlettertypes en blijven de formules als TeX-code staan.
