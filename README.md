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
oefenzittingen/            animaties bij oefeningen uit de oefeningenbundel
uitbreidingen/             uitgebreidere versies van voorbeelden, bewaard voor later (TM1.uitbreidingen, niet in het overzicht)
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
- **Vectoriële kettingen** (hoofdstuk 2): elke schakel krijgt een eigen kleur (`\kka` … `\kke` in TeX,
  `k-ka` … `k-ke` in HTML, `C.ka` … `C.ke` in JavaScript), ook in de uitgeschreven termen van de formules;
  de resulterende positievector blijft groen. In hoofdstuk 15 blijven alle positievectoren groen, want daar
  hebben de snelheden de kleuren.
- **Werkblad-indeling**: de figuur en de grafieken staan naast elkaar, zodat een student ze samen ziet
  (ook op een laptopscherm). Een pagina wordt gewoon opgebouwd zoals het sjabloon (scène, zijpanelen
  "Bediening" en "Tonen", grafieken eronder); `TM1.werkblad()` in `gedeeld/tm1.js` verhuist bij het laden
  de toon-opties naar een strook onder de figuur, de bediening naar een balk daaronder (extra schuifregelaars
  in "Meer instellingen"), de uitleestabel naar een dichtgeklapt onderdeel en de grafieken naar een kolom
  rechts. Op een gsm staat alles onder elkaar.
- **Valversnelling**: rekenen met *g* = 10.0 m/s², zoals in de cursus.
- **3 beduidende cijfers** (afspraak in de cursus): elk getal in de opgave, de uitwerking en de controle krijgt
  3 beduidende cijfers en een eenheid, bv. *v*<sub>0</sub> = 11.0 m/s, tan *α* = 0.150, *μ* = 0.00500, *θ* = 30.0°.
  Ook uitlezingen in JavaScript (`toPrecision(3)` of een passend `toFixed`). Tellingen en nummers (Vb. 19.7, stap 3) niet.
  Uitkomsten: eerst symbolisch, dan meteen de numerieke waarde, zonder lange reeksen tussenresultaten.
- **Vectorschaal**: vast (niet afhankelijk van de schuifregelaars); elke scène toont linksonder een vaste legende, bv. 2 m/s en 5 m/s².
- **Opgelegde beweging**: maak in de tekst duidelijk wanneer de beweging gegeven is (kinematica)
  en wanneer ze volgt uit krachten (dynamica).
- **Dynamica (vanaf hoofdstuk 19)**: de bediening (afspelen, opnieuw, knoppen om snelheid en versnellingen te tonen)
  staat in een balk tussen de situatie en het vrijlichaamsdiagram, niet eronder: `BALK = TM1.balkTussen(sc)` in `render()`,
  de situatie getekend met `let H = (Hall - BALK) * 0.5` en `H += BALK` vóór het vrijlichaamsdiagram.
  In de situatie altijd vinkjes om de snelheid en de versnelling te tonen (`TM1.vaKnoppen(['v', 'a', …])` en
  `TM1.vaPijlen(…)` in `gedeeld/tm1.js`); waar relevant ook de versnelling opgesplitst in *a*<sub>t</sub> en *a*<sub>n</sub>.
  Bij de vinkjes staat enkel het symbool (vector *v* en *a* met pijl, *a*<sub>t</sub>, *a*<sub>n</sub>), niet de woorden.
  De pijlen staan bij het laden uit.
  Het vergrootglas (loep op de verbindingen) verschijnt pas in stap 2, niet in stap 1.
  In het vrijlichaamsdiagram grijpt de versnelling (dubbele pijl) altijd aan in de puntmassa, niet in een apart punt ernaast.
  **Grafiek → schuifknop**: onder elke grafiek staat meteen een schuifknop voor de variabele op de x-as (met de
  uitlezing eronder). Die knop past ook de animatie, het vrijlichaamsdiagram … aan (niet enkel de grafiek).
  Geen ondertitel (`kicker`) onder de titel; in de opgave staat **Gevraagd:** altijd op een nieuwe lijn (eigen alinea).
  **Stap 3 (opstellen van vergelijkingen)**: eerst alle vergelijkingen verzamelen, zonder tussentijds in te vullen:
  de vectoriële bewegingsvergelijking met meteen daaronder haar componenten, met de versnelling nog als
  *a*<sub>x</sub>, *a*<sub>y</sub> (, *a*<sub>z</sub>) en de krachten nog niet ingevuld (bv. *W*, niet *μN*);
  dan de bijkomende vergelijkingen: eerst beknopt de kinematica (bv. "beweegt enkel volgens *x*: *a*<sub>x</sub> = *a*, *a*<sub>y</sub> = 0"),
  dan wrijving, veerwet …, en de voorwaarde(n) uit de verbinding.
  Onder een streep: de componenten met de versnelling ingevuld, en dan tellen: hoeveel vergelijkingen, voor welke
  onbekenden, en welke voorwaarden achteraf te controleren zijn.
- **Denkvragen** onderaan: een paar vragen die studenten met de animatie zelf kunnen beantwoorden.

## Lokaal bekijken

Dubbelklik op `index.html`. Alles werkt rechtstreeks vanuit de map; een webserver is niet nodig.
Alleen de lettertypes (Google Fonts) en KaTeX voor de formules (jsDelivr) komen van het internet; zonder
internet vallen de lettertypes terug op standaardlettertypes en blijven de formules als TeX-code staan.
