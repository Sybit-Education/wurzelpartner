# Kartenarchiv

Die Straßenkarte verwendet `public/maps/radolfzell.pmtiles`, ein aus dem
Protomaps-Basemap-Build vom 16. November 2026 ausgeschnittenes PMTiles-Archiv.
Es ist 7.919.010 Byte groß und auf die Radolfzell-Kartengrenzen
`8.9,47.71,9.1,47.87` zugeschnitten. Die Daten stammen aus OpenStreetMap und
Natural Earth; die Kartenansicht blendet die erforderliche OSM-Attribution ein.

Das Archiv enthält native Vektorkacheln bis Zoomstufe 15. Die Karte darf wie
bisher bis Zoomstufe 18 vergrößert werden; darüber hinaus werden die
Vektorkacheln skaliert. Das Satellitenbild bleibt ein separater, optionaler
Esri-Dienst.

Ab Kachelzoomstufe 15 werden Straßen- und Wegenamen deutlicher beschriftet, ab
Kachelzoomstufe 16 Gebäude stärker abgegrenzt. Ab Kachelzoomstufe 17 erscheinen
Hausnummern, sofern sie im Archiv als Adresspunkt vorhanden sind und die
Beschriftung nicht mit wichtigeren Kartenelementen kollidiert. Das
verwendete Archiv wird dafür nicht vergrößert oder nachgeladen. Da die Karte
auch halbe Zoomstufen erlaubt und Leaflet die Kachelzoomstufe rundet, können
die Details jeweils eine halbe Zoomstufe früher erscheinen.

## Archiv neu erzeugen

Installiere die PMTiles-CLI v1.31.2 von den
[GitHub-Releases](https://github.com/protomaps/go-pmtiles/releases/tag/v1.31.2).
Wähle ein verfügbares Tagesarchiv von
[`build.protomaps.com`](https://build.protomaps.com/) und übergib dessen Datum
im Format `YYYYMMDD`:

```bash
./scripts/generate-radolfzell-map.sh YYYYMMDD
pmtiles verify public/maps/radolfzell.pmtiles
pmtiles show public/maps/radolfzell.pmtiles --header-json
```

Das Skript lädt nicht das weltweite Archiv herunter. Die CLI liest die
benötigten Bereiche per HTTP Range und schreibt nur den Ausschnitt in die
öffentliche Asset-Datei. Prüfe vor dem Commit die gemeldeten Bounds und die
Dateigröße. Behalte die OSM-Attribution bei und dokumentiere hier das Datum,
die Größe und abweichende Bounds eines neuen Archivs.

## Netzwerk und Datenschutz

Die PMTiles-Datei wird von derselben Domain wie die Anwendung geladen; für die
Straßenkarte kontaktiert der Browser keinen externen Kachelserver. Der
Webserver muss HTTP-Range-Anfragen für die Datei unterstützen. Das macht nicht
die gesamte Anwendung offline verfügbar: Standorte benötigen weiterhin die
Anwendungs-API, und die optionale Esri-Satellitenebene stellt bei Auswahl eine
Verbindung zu Esri her.
