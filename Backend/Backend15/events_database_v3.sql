INSERT INTO tags (name, `group`) VALUES
('Kiállítás', 'típus'),
('Sport', 'típus'),
('Szórakozás', 'típus'),
('Gasztro', 'típus'),
('Feltöltődés', 'típus'),
('Beltér', 'jelleg'),
('Kültér', 'jelleg'),
('Fél napos', 'időtartam'),
('Egész napos', 'időtartam'),
('Pár órás', 'időtartam'),
('Egyéni', 'részvétel módja'),
('Csoportos', 'részvétel módja'),
('Fizetős', 'belépés'),
('Ingyenes', 'belépés');

INSERT INTO events (name, startDate, endDate, startTime, endTime, description, image, locationName, locationcountry, address, weblink, gpx) VALUES
('QuizNight', '2025.03.10', '2025.03.10', '20:00', '', 'Mi az a QuizNight? A QuizNight az angolszász területeken méltán népszerű pubquiz (magyarul bárkvíz, vagy kocsmakvíz) műfaj magyarországi változata. A játék -mint a neve is mutatja- alapvetően egy kvízjáték, amit jellemzően bárokban, kávézókban, pubokban tartunk minden héten, és az itthon népszerű kvízjátékokkal szemben nem egyéni játékosok nevezhetnek, hanem csapatok versenyeznek egymással. 2009-ben az országban elsőként kezdtük és a magyar nyelven elérhető kocsmakvíz bajnokságok közül a QuizNight hétfő esti játékaival játszanak a legtöbb országban, legtöbb helyszínen és a legtöbben. A Bajnokság fordulóira és más eseményeinkre a quiznight.hu honlapon tudsz jegyet venni csapatodnak. A Bajnokság ősszel tizenegy egyedi fordulóból áll, amik mind-mind különálló kérdéssort jelentenek és minden helyszínen minden fordulónak saját nyertese van, tehát bárki csatlakozhat akár egy-egy fordulóra is. Minden fordulóban pontokat gyűjthettek, hogy a végén a Döntőben kiderüljön, hogy melyik csapat a legjobb mind közül.', 'assets/Pictures/events/quiznight.jpg', 'változó', '', '', 'https://quiznight.hu/', ''),
('Hévíz-patak téli vízitúra', '2025.03.16', '2025.03.16', '', '','Izgalmas kalandra vágysz? A Hévíz vízitúra egy egyedülálló lehetőség, hogy télen is átélhesd a természet varázsát. A Hévíz-patak kristálytiszta vize és a téli táj látványa garantáltan felejthetetlen élményt nyújt.','assets/Pictures/events/heviz_vizitura.jpg','Hévíz-patak', 'Magyarország', '', 'https://vizitura.hu/', ''),
('50 000 lépés a Holdon Teljesítménytúra', '2025.05.10', '2025.05.10', '09:00', '16:30', 'Gyere és fedezd fel a Vásárhely környéki természet szépségét gyalog, futva, vagy kerékpáron, kerüld meg a várost a körtöltés mentén, járd be a Kása-erdőt!', 'assets/Pictures/events/50000_lepes_a_holdon_teljesitmenytura.jpg', 'Hódmezővásárhely', 'Magyarország', '6800 Hódmezővásárhely, Hősök tere 1.', 'https://www.hodmentor.hu/hirek/50-000-lepes-a-holdon-teljesitmenytura-2025/', ''),
('Hello Piac - Közösségi design vásár', '2025.04.26', '2025.04.26', '11:00', '18:00', 'A HELLO PIAC Design Vásáron szeretnénk előterébe helyezi az emberi kapcsolatok megerősítését, a magyar termelők és kisvállalkozók minőségi termékeit, a környezettudatos és fenntarthatóbb mindennapi élet kialakítását elősegítő, környezetbarát termékeket, a tudatos vásárlás fontosságát és kiemelt célunk a fogyatékossággal élő emberek által készített magas színvonalú termékek népszerűsítése. Szeretnénk beintegrálni kínálatukat a sikeres piacok hasonló termékei közé, mert ugyanolyan értéket és minőséget képviselnek, de mégsem kapják meg azt a teret és figyelmet, amelyre méltóak lennének. A belépés INGYENES! A vásárra KUTYUSOKAT 🐾 is örömmel várunk!', 'assets/Pictures/events/hello_piac_202504.jpg', 'Erzsébet-tér', 'Magyarország', '1051 Erzsébet tér 12.', 'https://hellopiac.hu/rendezvenyeink-aktualis/', ''),
('Sun & Moon, Koczor Pincészet és Vendégfogadó', '2025.03.30', '2025.03.30', '16:00', '23:59', 'Csatlakozz hozzánk, egy különleges zenei utazásra, ahol a napszakok, illatok, fények változásaihoz idomulva hozzuk el nektek a legnagyobb zenei katarzist, páratlan környezetben. A Koczor Pince a balatonfüred-csopaki borvidék egyik legkedveltebb borászata, a Koczor Pincészet ad otthont idei első füredi rendezvényünknek. A tavalyi hatalmas szezonnyitónk után, nem volt kérdés, hogy idén is visszatérünk. Itt is meglesz a szokásos: Gyönyörű kilátás a Balatonra, zseniális borok, csoda dekor, és mellé pedig igazi napszakot követő zenei élmény, organictól, progressive-ig, afro-n át, minden amit szeretünk', 'assets/Pictures/events/koczor_202504.jpg', 'Koczor Pincészet', 'Magyarország', '8230 Balatonfüred, Bocsár dülő 0118/12.', 'https://cooltix.hu/event/67b498dac83f1903858e9e93', ''),
('Hello Piac - Közösségi design vásár', '2025.03.29', '2025.03.29', '11:00', '17:00', 'A HELLO PIAC Design Vásáron szeretnénk előterébe helyezi az emberi kapcsolatok megerősítését, a magyar termelők és kisvállalkozók minőségi termékeit, a környezettudatos és fenntarthatóbb mindennapi élet kialakítását elősegítő, környezetbarát termékeket, a tudatos vásárlás fontosságát és kiemelt célunk a fogyatékossággal élő emberek által készített magas színvonalú termékek népszerűsítése. Szeretnénk beintegrálni kínálatukat a sikeres piacok hasonló termékei közé, mert ugyanolyan értéket és minőséget képviselnek, de mégsem kapják meg azt a teret és figyelmet, amelyre méltóak lennének. A belépés INGYENES! A vásárra KUTYUSOKAT 🐾 is örömmel várunk!', 'assets/Pictures/events/hello_piac_202503.jpg', 'Erzsébet-tér', 'Magyarország', '1051 Erzsébet tér 12.', 'https://hellopiac.hu/rendezvenyeink-aktualis/', ''),
('Tavaszkert - Dísznövény 2025 Szakkiállítás és Vásár','2025.04.25', '2025.04.27', '08:00', '18:00', 'Egyetemünk Budai Campusán immár 34. alkalommal kerül megrendezésre a tavaszi kiállítás, a tavaszkert - Dísznövény 2025 Szakkiállítás és Vásár. A kertészeti cégek termékei: egy- és kétnyári virágpalánták, évelő dísznövények mellett többek között Országos Bonsai és Suiseki Kiállítás is várja a látogatókat, emellett a Budai Campus intézeteinek munkatársai is számos workshoppal, bemutatóval készülnek.', 'assets/Pictures/events/tavaszkert_202504.jpg', 'Budai Arborétum', 'Magyarország', '1118 Budapest Villányi út 29-43.', 'https://tajepiteszet.uni-mate.hu/h%C3%ADr/-/content-viewer/tavaszkert-disznoveny-szakkiallitas-es-vasar/318829', ''),
('IKEBANA Kiállítás', '2025.04.25', '2025.04.27', '08:00', '18:00', 'Idén első alkalommal az Ikebana Hungary Ikenobo IKEBANA iskolája a természet és művészet harmóniáját mutatja be a tavaszkert Dísznövény 2025 Szakkiállítás és Vásáron, a MATE főépületének Dísztermében az Országos Bonsai és Suiseki Kiállítás kíséretében. Az eseményen Baloghy Éva és tanítványai munkái láthatók.', 'assets/Pictures/events/ikebana_kiallitas_202504_1.jpg', 'Budai Arborétum', 'Magyarország', '1118 Budapest Villányi út 29-43.', 'https://www.ikebanahungary.com/', ''),
('KISKERTPIAC - Divatban a zöld', '2025.03.16', '2025.03.16', '10:00', '16:00', 'Mit kapsz, ha ellátogatsz a KISKERTPIACra? Először is olyan érzést, mintha egy kicsit más világba csöppennél. Ezt nem mi mondjuk, folyamatosan visszahalljuk. Persze sok-sok növényt, mosolygós kiállítókat és a különleges, minőségi természetközeli termékeiket, alkotásaikat. A KISKERTPIAC hangulatát adjuk, mely a vásárlás mellett beszélgetések, vagy akár egyedül, eltöltött minőségi időt jelenti számodra finom ételek, italok mellett. Minden alkalommal egy megadott témában workshopokon, interaktív előadásokon vehetsz részt. Biztosak vagyunk abban, ha ellátogatsz a KISKERTPIACra láthatóan, és vagy láthatatlanul viszel magaddal valami jót.','assets/Pictures/events/kiskertpiac_202503_01.jpg', 'MADHOUSE, Anker köz','Magyarország', '1061 Budapest, Anker köz 1-3.', '', ''),
('KISKERTPIAC - Közel a természet', '2025.05.16', '2025.05.16', '', '', 'Természetközeli otthon - növényes beültetések, dekorációk / Legyünk városi kertészek! - lakásdzsungel / Mini szobakertek - növényes beültetés / Fűszernövény szerelem a konyhában - fűszernövények a konyhában / Konyhakert a balkonon, konyhakerti palánták / Virágos terasz / egynyári növények kaspókban / Virágos ötletek kiskertészeknek', 'assets/Pictures/events/kiskertpiac_202505_1.jpg', 'Mad Garden Buda', 'Magyarország', '1033 Budapest, Miklós tér 1.', '', ''),
('Kutyával és kisvonattal a medvehagymás Bakonyban', '2025.04.04', '2025.04.06', '', '','Szívesen megosztjuk Veletek receptünket stresszoldásra. Hozzávalók: egy jó bakonyi kutyabarát szálloda, kutyáink társasága, közös medvehagyma-gyűjtő kutyás kirándulás, gasztro-élmények és utazás kisvonattal.;A Szépalma Hotel csapatával közösen az alábbit “főztük ki” számotokra:;2 éjszakás elhelyezés a választott szobatípusban;kiadós svédasztalos reggelik;ízletes vacsorák - medvehagymás ételkülönlegességekkel;3 napon átközös kutyás kirándulások;a szálloda szauna-részlegének korlátlan használata;szuper csapat és jókedv', 'assets/Pictures/events/szepalma_hotel_202504.jpg', 'Porva, Szépalma Hotel és Ménesbirtok', 'Magyarország', '8429 Porva-Szépalmapuszta, hrsz 0172.', 'https://utazzkutyaddal.hu/programok/kutyas-hetvege-a-medvehagymas-bakonyban/', ''),
('Ménesbirtok látogatás', '', '', '', '', 'Mindenkinek ajánljuk ezt az átfogó programunkat, aki szeretne bepillantást nyerni a kulisszák mögé és megismerni lovaink történetét. A ménesbirtok látogatás során szakavatott kollégánk körbevezetést tart az istállókban, miközben egyes állomásokon érdekes feladatok várják a vendégeket. A közös séta során számos bennfentes információt osztunk meg látogatóinkkal, azon túl, hogy testközelből találkozhatnak lovainkkal, érdekes játékok és hasznos ismeretek várnak rájuk.', 'assets/Pictures/events/szepalma_hotel_latogatas_1.jpg', 'Porva, Szépalma Hotel és Ménesbirtok', 'Magyarország', '8429 Porva-Szépalmapuszta, hrsz 0172.', 'https://szepalma.hu/allatvedelmi-alapitvany/program/allando-program/', ''),
('GasztroFok - Kulináris körutazás Siófokon!', '2025.03.29', '2025.03.30', '11:00', '22:00', 'Két éve indult útnak Siófokon a GasztroFok elnevezésű kulináris összefogás, mely a térség gazdag bor- és gasztronómiai kínálatát hivatott bemutatni. Az esemény keretein belül az érdeklődőknek lehetőségük van „körbekóstolni” a résztvevő vendéglátóhelyek erre az alkalomra összeállított menüsorát Széplaktól Sóstóig, Kilititől Szabadiig, bevonva a helyi termelőket is. A kezdeményezés elindításával a városvezetés célja az volt, hogy az egész éves Balaton szemléletet erősítse, valamint az, hogy Siófok felkerüljön a régió gasztro-térképére. A kínálatban egyaránt megtalálhatóak helyi termelők, pincészetek, a legmagasabb kategóriás gurmet éttermek, streed food ételeket vagy desszerteket kínáló szolgáltatók is. Így biztosan mindenki talál az ízlésének megfelelő választási lehetőséget. A teljes kínálat hamarosan elérhető a Siofokguide Facebook oldalán a Gasztrofok események alatt, a város honlapján és a Tourinform Irodában.', 'assets/Pictures/events/gasztrofok_202503_1.jpg', 'Siófok', 'Magyarország', '8600 Siófok, Főtér 11.', 'https://siofok.hu/gasztrofok-2', ''),
('GasztroFok - Kulináris körutazás Siófokon!', '2025.11.08', '2025.11.09', '10:00', '22:00', 'Két éve indult útnak Siófokon a GasztroFok elnevezésű kulináris összefogás, mely a térség gazdag bor- és gasztronómiai kínálatát hivatott bemutatni. Az esemény keretein belül az érdeklődőknek lehetőségük van „körbekóstolni” a résztvevő vendéglátóhelyek erre az alkalomra összeállított menüsorát Széplaktól Sóstóig, Kilititől Szabadiig, bevonva a helyi termelőket is. A kezdeményezés elindításával a városvezetés célja az volt, hogy az egész éves Balaton szemléletet erősítse, valamint az, hogy Siófok felkerüljön a régió gasztro-térképére. A kínálatban egyaránt megtalálhatóak helyi termelők, pincészetek, a legmagasabb kategóriás gurmet éttermek, streed food ételeket vagy desszerteket kínáló szolgáltatók is. Így biztosan mindenki talál az ízlésének megfelelő választási lehetőséget. A teljes kínálat hamarosan elérhető a Siofokguide Facebook oldalán a Gasztrofok események alatt, a város honlapján és a Tourinform Irodában.', 'assets/Pictures/events/gasztrofok_202511.jpg', 'Siófok', 'Magyarország', '8600 Siófok, Főtér 11.', 'https://siofok.hu/gasztrofok-2', ''),
('Éjjel-nappal Somló', '2025.06.21.', '2025.06.23.', '', '', 'Szent Iván hétvégéjén, június 21-22-23-án az egész Somló nyitva tart! Gyertek kóstolni, kirándulni, élvezni a nyár beköszöntét ezen az egyedülálló romantikájú szőlőhegyen. A Tornai Pincészetben is sok érdekes programot találtok: lesz különleges kóstoló, pincetúra, grillkonyha a teraszon, a legjobb boraink kíséretében. Szombaton pedig az év egyik legrövidebb, de legizgalmasabb éjszakáján: az elmaradhatatlan teraszbuli hajnalig!', 'assets/Pictures/events/ClementsPinceszet_202506.jpg', 'Clements Pincészet, Somló', 'Magyarország', '8481 Somlóvásárhely, Somlóhegy 1471 hrsz.', 'https://www.tornaipince.hu/ejjel-nappal-somlo-154?srsltid=AfmBOopT6ievva5OPHK77q3AXb729d5aeepql9zZHg79rAK9j6dNADbL', ''),
('20. Wekerlei Garázsvásár Fesztivál', '2025.04.26', '2025.04.27', '09:00', '17:00', 'A körforgás nem áll meg, ahogy a Wekerlei Garázsvásár Fesztivál szervezése is megy tovább. Újabb időpont, újabb lehetőség kipakolni a sufnit és könnyíteni a sok éve gyűjtött tárgyak halmából. Ha árusítanál, akkor azért, ha látogatóként vásárolnál, akkor azért kövesd az eseményt a friss infókért. Ami biztos, tavasszal 2 napos nagy eseménnyel tervezünk, már csak azért is mert ez lesz a huszadik alkalom. Megünnepeljük, mindenképp, közösen. Az esemény szervezője továbbra is a Wekerlei Közösségi Egyesület, támogatást és csatlakozókat mindig örömmel fogadunk.', 'assets/Pictures/events/weckerlei_garazsvasar_202504.jpg', 'Wekerletelep, XIX. kerület', 'Magyarország', '1192 Budapest, Kós Károly tér', 'https://www.wekerleigarazsvasar.hu/', ''),
('Makrohang lemezbemutató', '2025.03.21', '2025.03.21', '19:30', '21:00', '2025. márciusában a makrohang a hollandiai Eurosonic és a Ment Ljubljana showcase fesztiválok után a Magyar Zene Házába látogat, hogy bemutassa régóta várt nagylemezét. A magát “jazz for metalheads”-ként leíró instrumentális zenekar tavalyi visszatérése óta sorra tölti meg a budapesti koncerttermeket kiszámíthatatlan, hangos és szívszorítóan szép zenéjükkel, melyet ezúttal is különleges vizuális show-val egészítenek majd ki.', 'assets/Pictures/events/makrohang_202503.jpg', 'Magyar Zene Háza', 'Magyarország', '1146 Budapest, Olof Palme stny. 3', 'https://www.zenehaza.hu/esemeny/makrohang', ''),
('Barkóczi Noémi lemezbemutató', '2025.04.03', '2025.04.03', '19:30', '21:30', 'Barkóczi Noémi énekes-gitáros-dalszerző a 2010-es évek elején tűnt fel a színen, egyedi hangvételű dalai már első nagylemeze idején egy sajátos univerzumot alkottak (Nem vagyok itt, 2017). A hosszú évek hallgatását megtörő 2021-es Dolgom volt című nagylemezen az akusztikus gitárt elektromosra cserélte és sokkal bátrabban kísérletezett újabb, karcosabb hangzásokkal. Az album kapott Fonogram-jelölést, és több hazai médium az év nagylemezei között emlegette. Azóta Gulyás Kristóffal (mius), Bognár Mártonnal (Kamikaze Scotsmen) és 2024 őszétől már Szczuka Pankával (Flanger Kids) kiegészült zenekara bejárta a hazai klubokat és fesztiválokat, és most már bizonyos, hogy az együttes zenéje ugyanolyan jól működik többezer ember előtt a Budapest Parkban, mint egy vidéki klub pincéjében. Noémi szerepelt szövegíróként a Dalfutár című műsorban, közreműködött Jónás Vera lemezén és a Kaláka előtt tisztelgő nagylemezen, énekelt a The Qualitons Szenes Iván emlékestjén a Müpában, valamint több dala is feltűnt hazai filmekben. Az elmúlt időszak történései, változásai és pillanatai új dalokat ihlettek, amik egy harmadik nagylemezzé álltak össze, amit Barkóczi Noémi és zenekara a Magyar Zene Háza színpadán mutat meg először a közönségnek.', 'assets/Pictures/events/BarkoziNoemi_lemezbemutato202504.jpg', 'Magyar Zene Háza', 'Magyarország', '1146 Budapest, Olof Palme stny. 3', 'https://www.zenehaza.hu/esemeny/barkoczi-noemi-lemezbemutato', ''),
('Murcof presents The Etna Sessions (MEX) | Áron Lőrinczi', '2025.04.12', '2025.04.12', '19:30', '22:00', 'Murcof a Zene Házában! A mexikói glitch- és ambientmágus egy exkluzív szeánszon mutatja be The Etna Sessions című audiovizuális munkáját. Az olasz vulkán környezetéből származó hangfelvételek felhasználásával készült mű a drone, atmoszférikus dub és absztrakt techno magmatikus elegyeként fortyog. A projekt célja a természet és a digitális világ kapcsolatának feltárása egy audiofil zenei élmény keretében. A limitált férőhelyes, ültetett műsort Áron Lőrinczi nyitja meg, akinek kísérleti ambient anyaga tavasszal jelenik meg Closure Brochure címmel.', 'assets/Pictures/events/murcof_202504.jpg', 'Magyar Zene Háza', 'Magyarország', '1146 Budapest, Olof Palme stny. 3', 'https://www.zenehaza.hu/esemeny/murcof-presents-the-etna-sessions-mex-aron-lorinczi', ''),
('Épületséta: zene az üvegen túl', '2025.05.17', '2025.05.17', '15:00', '16:00', 'Tekintse meg a Magyar Zene Háza belső tereit egy szakavatott zenepedagógus vezetésével! Az épületsétánk sajátossága, hogy nem csupán az építészetről szól, hanem a térbe álmodott és itt elhangzó zenékről is! Miért? Kinek? Hogyan? Ezek a központi kérdések és minden téma a ház körül forog, azaz a házban. Miközben megismerkedhetnek Sou Fujimoto fantasztikus épületével, egy kis zenei ismeretre is szert tehetnek! Interaktív és szórakoztató program felnőtteknek! ;A sétát Tápai Dóra vezeti, aki Ének-zenetanár, karvezető a MZH zenepedagógusa és előadója.', 'assets/Pictures/events/magyar_zene_haza_202505.jpg', 'Magyar Zene Háza', 'Magyarország', '1146 Budapest, Olof Palme stny. 3', 'https://www.zenehaza.hu/esemeny/epuletseta-zene-az-uvegen-tul-7', ''),
('Kőröshegyi Tulipánszüret', '2025.03.28', '2025.04.21', '09:00', '17:00', 'A Kőröshegyi Tulipán és Levendula Park Magyarország egyik legvarázslatosabb virágmezője, amely tavasszal és nyáron lenyűgöző látvánnyal várja a látogatókat. Idén tavasszal több, mint félmillió tulipán borítja virágba Kőröshegyet! Gyere el, és merülj el a színek és illatok varázslatos világában a Balaton festői panorámájával a háttérben. Szeretnél egy csokor friss virágot hazavinni? Válogass kedvedre a folyamatosan virágzó tulipánmezőn, ahol a legkülönfélébb színek és formák várnak! Imádod a gyönyörű fotókat? Külön fotós mező és gondosan kialakított látványelemek garantálják, hogy tökéletes hátteret találj a legemlékezetesebb képekhez. Mindig virágzó területek: A tulipánmezőt szakaszosan nyitjuk meg, így a szezon minden napján friss és csodás virágok várnak rád!', 'assets/Pictures/events/tulipanszuret_202503_1.jpg', 'Kőröshegy', 'Magyarország', '8617 Kőröshegy, Dózsa György köz HRSZ.: 0193/36', 'https://www.jegyvasarlas.hu/esemenyek/koroshegyi-tulipanszuret-2025-magyarorszag-legnagyobb-tulipan-parkja/67b44d5ba311ac451ea12451', ''),
('Indoor Minigolf', '', '', '', '', 'Vedd célba Budapest legexkluzívabb minigolf centrumát! Sötét termeket átfonó színes formák, 3 mágikus világ, 18 lyuk, egy foszforeszkáló labda és a golfütő, amivel elütheted nálunk az időt. Budapest szívében szintet lép a szórakozás! Fedezd fel művészek által kialakított káprázatos UV festésű pályáinkat, majd dőlj hátra, és élvezd a széles étel és italkínálatot bárunk kényelmében! Az INDOOR MiniGolf Budapest több, mint a város legizgalmasabb minigolf klubja. Családi kikapcsolódás, közösségi tér, páratlan rendezvényhelyszín és az est fénypontja egész évben, bármilyen időben.', 'assets/Pictures/events/indoor_minigolf_1.jpg', 'Budapest', 'Magyarország', '1061 Budapest, Király utca 8-10. Central Passage 1. emelet', 'https://indoorpirate.hu/', ''),
('Pécsi szabadtéri kincskereső játék - Landventure', '', '', '', '', 'Szabadtéri program izgalmas küldetésekkel! Kalandozz a városközpont legszebb utcáin ezzel a városi nyomozós játékkal, amihez csak egy okostelefon kell. Lépjetek a történet középpontjába, járjátok be a város legszebb részeit és oldjátok meg az izgalmas rejtélyeket egy újszerű séta közben! Játsszatok bármikor, kötöttségek nélkül egyedül, párban, családdal, barátokkal, gyerekkel vagy akár kutyussal.', 'assets/Pictures/events/landventure_pecs_1.jpg', 'Pécs', 'Magyarország', '', 'https://www.thelandventure.com/hu/hu/pecs-program', ''),
('Esztergomi szabadtéri kincskereső játék - Landventure', '', '', '', '', 'Szabadtéri program izgalmas küldetésekkel! Kalandozz a városközpont legszebb utcáin ezzel a városi nyomozós játékkal, amihez csak egy okostelefon kell. Lépjetek a történet középpontjába, járjátok be a város legszebb részeit és oldjátok meg az izgalmas rejtélyeket egy újszerű séta közben! Játsszatok bármikor, kötöttségek nélkül egyedül, párban, családdal, barátokkal, gyerekkel vagy akár kutyussal.', 'assets/Pictures/events/landventure_esztergom_1.jpg', 'Esztergom', 'Magyarország', '', 'https://www.thelandventure.com/hu/hu/program-esztergom/a-magikus-pajzs-esztergom-varosnezes', ''),
('Szabadtéri kincskereső játék Szegeden - Landventure', '', '', '', '', 'Szabadtéri program izgalmas küldetésekkel! Kalandozz a városközpont legszebb utcáin ezzel a városi nyomozós játékkal, amihez csak egy okostelefon kell. Lépjetek a történet középpontjába, járjátok be a város legszebb részeit és oldjátok meg az izgalmas rejtélyeket egy újszerű séta közben! Játsszatok bármikor, kötöttségek nélkül egyedül, párban, családdal, barátokkal, gyerekkel vagy akár kutyussal.', 'assets/Pictures/events/landventure_szeged_1.jpg', 'Szeged', 'Magyarország', '', 'https://www.thelandventure.com/hu/hu/szeged-szabadteri-program', ''),
('Debrecen városi nyomozós program - CityFox', '', '', '', '', 'Izgalmas városi kincskereső, szabadtéri nyomozós kalandjáték, a helyi látványoságokkal egybekötve. Szabadulószoba a városban, az év bármely napján. Debrecenben évről évre megrendezik a virágkarnevált, amelyre nagyon sok ember érkezik. Azonban most ez kicsit másképp alakulhat, ugyanis ellopták az összes virágot. A tolvajokat és a virágokat egyelőre nem találni, teljesen felszívódtak. Néhány nyomot azonban hagytak a városban, viszont a rendőrség így is tehetetlen. A küldetés a Ti kezetekben van már, rátok figyel egész Debrecen, hogy vajon sikerül-e megoldanotok a rejtélyt!', 'assets/Pictures/events/cityfox_debrecen_2.jpg', 'Debrecen', 'Magyarország', '', 'https://cityfox.hu/debrecen', ''),
('Budastep - városi séták', '', '', '', '', 'A Budastep vezetett tematikus sétáin túl lehetőségünk van részt venni csapatban izgalmas szabadtéri szabadulós játékokon is. A játékok során nem csak az idővel, de a történettel is játszotok, eközben bejárva Budapest ezidáig kevésbé ismert oldalát. Történelmi adatok helyett városi pletykákat, érdekességeket gyűjtöttek össze számotokra, a közös munka során pedig izgalmas rejtvényeket fejthettek meg, alkothattok, játszhattok és a játék végén pedig egészen biztosan máshogy fogtok nézni Budapestre.', 'assets/Pictures/events/budastep_1.jpg', 'Budapest', 'Magyarország', '', 'https://budastep.hu', ''),
('Városfelfedező telefonos játék - HelloVáros', '', '', '', '', 'Jelenleg már négy helyszínen, Szentendrén, Siófokon, Balatonfüreden és Pécsen is kalandra indulhatunk a Hello Város felfedezős játékainak jóvoltából. Az applikáció letöltése után ingyen elkezdhetjük a játékot, amint megtudtuk a játék kezdőpontjának helyszínét. Az első feladat megoldását követően megkapjuk a következő pontot, aztán így tovább, amíg el nem jutunk a megoldásig a különböző feladványok segítségével. Álljatok össze csapatba és kalandozzatok kedvetekre! A siófoki játék a Fő téren indul, egy kört ír le a városban és szintén a Fő téren ér véget, a játék tehát visszatér a kezdő pontba. Az applikáció ezen az induló ponton (Fő tér) feldobja az első feladatot, és ha sikerül megoldani, akkor a játékosok megkapják a következő pontot, ahova el kell jutniuk. Ott kapják meg a második feladatot és a második pontot és így tovább. A játék közben megismerik Siófok látnivalóit, egy kicsit a város történetét, a hírességeket, akik ugyancsak itt nyaraltak és számos különleges tudnivalóval gazdagodnak. A játék időtartama kb. 1,5-2 óra.', 'assets/Pictures/events/hellovaros_siofok_1.jpg', 'Siófok', 'Magyarország', '', 'https://www.hellovaros.hu/', ''),
('Városfelfedező telefonos játék - HelloVáros', '', '', '', '', 'Jelenleg már négy helyszínen, Szentendrén, Siófokon, Balatonfüreden és Pécsen is kalandra indulhatunk a Hello Város felfedezős játékainak jóvoltából. Az applikáció letöltése után ingyen elkezdhetjük a játékot, amint megtudtuk a játék kezdőpontjának helyszínét. Az első feladat megoldását követően megkapjuk a következő pontot, aztán így tovább, amíg el nem jutunk a megoldásig a különböző feladványok segítségével. Álljatok össze csapatba és kalandozzatok kedvetekre!', 'assets/Pictures/events/hellovaros_balatonfured_1.jpg', 'Balatonfüred', 'Magyarország', '', 'https://www.hellovaros.hu/', ''),
('World of Adventures - Everest', '', '', '', '', 'A World of Adventures különböző nehézségű játékai egyszerre ötvözik a szabadulószobák kihívásait a geocaching izgalmával, Magyarország legkülönfélébb tájain. Jelenleg számtalan kaland közül választhatunk (világszerte 99-féle kaland elérhető jelenleg), amelyek közül néhányat bringával lehet teljesíteni, változó nehézségi szintekkel. Csak a telefonunkra és a játék belépőjére van szükségünk, már indulhat is az izgalmakkal teli kalandozás! Ez egy 5 órás, 12 km-es kalandtúra.', 'assets/Pictures/events/World_of_Adventures_pilis.jpg', 'Dömös', 'Magyarország', '', 'https://wofa.games/adventure/everest', ''),
('World of Adventures - Szárnyaló nyaralás', '', '', '', '', 'A World of Adventures különböző nehézségű játékai egyszerre ötvözik a szabadulószobák kihívásait a geocaching izgalmával, Magyarország legkülönfélébb tájain. Jelenleg számtalan kaland közül választhatunk (világszerte 99-féle kaland elérhető jelenleg), amelyek közül néhányat bringával lehet teljesíteni, változó nehézségi szintekkel. Csak a telefonunkra és a játék belépőjére van szükségünk, már indulhat is az izgalmakkal teli kalandozás! Ez egy 2 óra alatt megtehető, 3 km-es városi kalandtúra.', 'assets/Pictures/events/World_of_Adventures_zalakaros.jpg', 'Zalakaros', 'Magyarország', '', 'https://wofa.games/adventure/szarnyalo-nyaralas', ''),
('World of Adventures - Lámpások éjszakája', '', '', '', '', 'A World of Adventures különböző nehézségű játékai egyszerre ötvözik a szabadulószobák kihívásait a geocaching izgalmával, Magyarország legkülönfélébb tájain. Jelenleg számtalan kaland közül választhatunk (világszerte 99-féle kaland elérhető jelenleg), amelyek közül néhányat bringával lehet teljesíteni, változó nehézségi szintekkel. Csak a telefonunkra és a játék belépőjére van szükségünk, már indulhat is az izgalmakkal teli kalandozás! Ez egy 3 óra alatt megtehető, 3 km-es városi kalandtúra.', 'assets/Pictures/events/World_of_Adventures_szentendre.jpg', 'Szentendre', 'Magyarország', '', 'https://wofa.games/adventure/lampasok-ejszakaja-szentendre', ''),
('Qulto - Városfoglaló', '', '', '', '', 'A Qulto névre keresztelt, kulturális turizmust támogató alkalmazás azért jött létre, hogy minél többen megismerhessék hazánk helyi értékeit és kincseit. A sétákat könnyedén személyre szabhatjuk, érdekességekkel színesíthetjük és elérhetővé tehetjük bárki számára.', 'assets/Pictures/events/qulto.jpg', 'Szolnok', 'Magyarország', '', 'https://www.qulto.eu/varosfoglalo/', ''),
('Ylla: A modern állatfotózás születése', '2025.02.20', '2025.04.06', '12:00', '19:00', 'Ylla (Koffler Kamilla) egy olyan korban szentelte magát az állatportréknak, amikor még senki sem gondolt arra, hogy állatfotózásra szakosodjon. A harmincas évek párizsi művészköreiben mozgó Ylla műtermében készített állatfotókat, illetve állatkerteket keresett fel, ahol a közeli képek kedvéért veszélyes vadak ketrecébe is bemerészkedett. Február 20-tól április 6-ig az ő különleges képeit tekinthetjük meg a Mai Manó Ház falai között.', 'assets/Pictures/events/maimano_ylla_202502_1.jpg', 'Mai Manó Ház', 'Magyarország', '1065 Budapest, Nagymező u. 20.', 'https://www.maimano.hu/programok/kiallitas---ylla-a-modern-allatfotozas-szuletese', ''),
('Magyarország színezve. Rejtőzködő fényképek 1862-ből', '2025.03.05', '2025.09.15', '10:00', '18:00', 'A kiállítás egy olyan, Magyarországon eddig soha nem látott, különleges anyagot tár a közönség elé, amelyre nemrégiben bukkantak a kutatók: a tárlat az 1862-ben a londoni világkiállításon bemutatott, Magyarország korabeli tájegységein, településein készült népviseleti fényképsorozatot állítja középpontba. A korábban elveszettnek hitt Tiedge János fényképek a londoni Victoria & Albert Múzeum gyűjteményéből kölcsönzéssel érkeznek Budapestre, ehhez kapcsolódik egy, a Néprajzi Múzeumban őrzött másolati sorozat. A két gyűjtemény kiegészíti egymást. A képek több mint 160 év után lesznek láthatók Budapesten, bemutatva a készítés történetét is a szervezéstől a világkiállításig.', 'assets/Pictures/events/NeprajziMuzeum_Moszinezve.jpg', 'Néprajzi Múzeum', 'Magyarország', '1146 Budapest, Dózsa György út 35.', 'https://www.neprajz.hu/kiallitasok/idoszaki/2025/magyarorszag-szinezve.-rejtozkodo-fenykepek-1862-bol.html', ''),
('Budapest FotóFesztivál', '2025.03.28', '2025.05.11', '12:00', '19:00', 'A 2017 tavaszán indult Budapest FotóFesztivál közel két hónapon átívelő rendezvénysorozata kortárs és klasszikus magyar, valamint nemzetközi kiállításokból, szakmai és közönségprogramokból áll. Célja a fotográfia értékeinek, újdonságainak bemutatása a szakmai és a nagyközönség számára fotókiállításokkal, változatos programok, workshopok, múzeumpedagógiai foglalkozások megvalósításával. A Fesztivál inspirál, párbeszédet indít, kulturális intézményeket kapcsol össze és minél szélesebb körben képviseli a fotóművészetet. 2025-ben a Punkt.hu médiatámogatóként segíti a fesztivál kommunikációját, mely egy országos premierrel indítja programsorozatát: a Budapest Fotófesztivál és a Műcsarnok szakmai együttműködésében megvalósuló tárlaton Magyarországon első alkalommal láthatók a legendás német divatfotográfus Peter Lindbergh (1944-2019) ikonikus alkotásai.', 'assets/Pictures/events/BPfotofesztival_202503.jpg', 'Műcsarnok', 'Magyarország', '1146 Budapest, Dózsa György út 37.', 'https://www.budapestphotofestival.hu/fooldal/bpf-2025/', ''),  
('Green Scorpions Offroad Experince', '', '', '', '', 'Csapatunk olyan egyedülálló időtöltési, szórakozási lehetőséget kínál kicsiknek és nagyoknak egyaránt, amely felejthetetlen élményt nyújt mind a kikapcsolódásra vágyóknak, mind az extrém sportok kedvelőinek. Mindez nem más, mint az Off Road túra, illetve Off Road vezetés, offroadozás élménye.;Cégünket azzal a céllal hoztuk létre, hogy az Off Road-élmény elérhető legyen mindazok számára, akik szeretnek izgalmas kalandokban részt venni, vagy csak szívesen kipróbálnák magukat új dolgokban, esetleg részt vettek már Off Road versenyeken nézőként, azonban nem volt alkalmuk közelebbről is megismerni ennek a sportnak a sajátosságait. Mindezeken túl izgalmas programokat kínálunk az offroadozás és terepjárók szerelmeseinek is, melyet minden esetben vendégeink igényei alapján állítunk össze.;Vendégeink saját igényeik szerint - megismerhetik az offroadozás sajátosságait, - részt vehetnek profi sofőrjeink által biztosított élményutazáson, - bátrabb vendégeink ki is próbálhatják a különböző feladatokat (mint például vakvezetés, csörlőzés, kerékcsere stb.), külön erre a célra kialakított könnyített pályán.;A Borsod-Abaúj-Zemplén megyei Borsodnádasd területén kialakított ügyességi pályáinkon zajlanak foglalkozásaink, valamint túraútvonalaink is a Borsodnádasdot körülvevő látványos hegyvidéken futnak. Land Rover, Suzuki Samurai, Jeep típusú autóink mind speciálisan erre a célra kialakított biztonsági felszerelésekkel és specifikus Off Road-kiegészítőkkel, alkatrészekkel felszereltek, hiszen vendégeink biztonsága és kiszolgálása számunka elsődleges cél. Ugyanakkor fiatalos, dinamikus, profi csapatunknak köszönhetően a jó hangulat minden körülmények között garantált.','assets/Pictures/events/GreenScorpions_1.jpg', 'Borsodnádasd', 'Magyarország', '', 'https://www.szilvasvarad.hu/hu/regionk/greenscorpions-offroadozas', ''),
('Robert Capa, a tudósító', '2024.11.27', '2025.12.31', '13:00', '18:00', 'Tavaly nyáron nyitotta meg kapuit a világ első, állandó Robert Capa-életműkiállítása a Robert Capa Kortárs Fotográfiai Központ új kiállítóterében. Az egyedülálló tárlat a sorozatból mintegy 138 fényképet mutat be, a fotós életének fontosabb állomásait tárva a látogatók elé, meghatározott témák szerinti feldolgozásban. Capa munkássága azért fontos, mert képeivel és hozzáállásával mély hatást gyakorolt a közönségre, örökre megváltoztatva a fotóriporteri szakma normáit.', 'assets/Pictures/events/RobertCapa_kiallitas_2025.jpg', 'Capa Központ', 'Magyarország', '1065 Budapest, Nagymező u. 8', 'https://robertcapaexhibition.capacenter.hu/', ''),
('Smart Sport Expo és Fitness Fesztivál', '2025.06.08', '2025.06.08', '', '', 'Az év leginnovatívabb fitnesz rendezvénye és Expója. A jövő a sportban is megérkezett! 14 éves kor alatt a belépés díjtalan!, A Smart Sport Expó & Fitness Fesztivál célja, hogy a mai „smart”, azaz okos rendszereket, az online technológia jelenlegi újításait közelebb hozza a felhasználókhoz és megismertesse az aktuális újdonságokkal. Ezt hazánk legjobb szakemberi, közéleti személyiségei, sportolói, edzői és piacvezető cégei segítségével szeretnénk bemutatni. Élvezd a legjobb csoportos órákat a legjobb hazai és nemzetközi edzőkkel a küzdőtér nagyszínpadán, vagy a 4 multiteremben! Tudj meg minden újdonságot a hazai és nemzetközi fitnesz, életmód, táplálkozás  és „okos” sport aktuális piaci helyzetéről, nézz szét a fitness expón, és válassz a kedvezményes, akciós ajánlatokból a 100 kiállító kínálata között. Vagy válassz a különleges workshoppok kínálatából. A rendezvény keretein belül a versenysport is megjelenik. Európa egyik legnagyobb fitness versenye az IFBB Diamond Cup & Bikini fitness, Fitt-Model Európa Kupa is itt kerül lebonyolításra. Mellette Ritmus Csapatok, Nemzetközi táncverseny, Erőemelő Bajnokság és a Uniform IFBB Fitness Challange Világbajnokság is megrendezésre kerül. A rendezvényen díjmentes gyerekmegőrző működik.', 'assets/Pictures/events/smartsportexpo_1.jpg', 'Papp László Budapest Sportaréna', 'Magyarország', '1143 Budapest, Stefánia út 2', 'https://www.smartsportexpo.hu/', ''),
('Végig a Spartacus-tanösvényen', '', '', '', '', 'A dunakanyari hegyvidék különleges hangulatú, emblematikus túraútja a Spartacus-vadászösvény, mely meredek hegyoldalakat keresztezve, szintben tekereg, és közben fantasztikus kilátást nyújt a Duna völgyére. A Dunakanyar egyik leghangulatosabb turistaútja szűk, „egyemberes” ösvény, amely gyakorlatilag szintben, hullámzás nélkül tekereg végig a Visegrádi-hegység zegzugos bércei között. Egykor vadászösvény volt, ma Budapest szomszédságának megkapó szépségű túraútvonala. Alacsony, erdős hegyeink nem gyakran kényeztetnek el hegyoldali panorámákkal, de amikor a Spartacus kopár, sziklás lejtőt szel át, bámulatos a panoráma a mély völgyeket kibélelő erdőkre, a Duna völgyére és a Szent Mihály-hegyre. A meredek, helyenként szinte szakadékszerű hegyoldalak mellett a hegység vulkáni múltjáról árulkodó sziklatornyokkal és egy menedékkunyhóval is találkozunk utunk során, mielőtt a zúgóiról és pisztrángos tavairól ismert Apát-kúti-völgybe érkezünk. Ha valaki igazán vadregényes környezetben szeretne emlékezetes túrát tenni, de nem vágyik nehéz kihívásra, akkor a Spartacus az ideális választás. Gyakorlatilag szintben sétálva, fárasztó emelkedők nélkül csodálhatjuk meg a dunakanyari hegyvidék és erdőség szépségeit, és mindehhez egyetlen délután is elegendő.', 'assets/Pictures/events/spartacus_tanosveny.jpg', 'Visegrádi-hegység', 'Magyarország', 'Pilisszentlászló', 'https://www.termeszetjaro.hu/hu/tour/gyalogtura/vegig-a-spartacus-vadaszoesvenyen/26280602/#dmdtab=oax-tab3', 'assets/gpx/spartacus_tanosveny.gpx');
	
