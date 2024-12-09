# MyBookshelf -mobiiliapplikaatio (syksy 2024)

Tässä repositoriossa on Mobiiliohjelmointi -kurssilla toteuttamani lopputyön lähdekoodi.

## Käytetyt teknologiat
Lopputyössä yhdistyy frontend- ja mobiiliteknologioita, joista tässä keskeisimmät.

* **React Native** on avoimen lähdekoodin kehys, jonka avulla luodaan natiivisovelluksia Androidille ja iOS:lle käyttäen JavaScriptiä ja Reactiä. Sovelluksen käyttöliittymän on komponenttipohjainen.

* **Expo** on kehitystyökalu, joka tarjoaa natiivikehitykseen kattavat toiminnot, kuten kehityspalvelimen, build-työkalut ja pääsyn natiivimoduuleihin ilman Xcodea tai Android Studiota.

* **Firebase** tarjoaa taustapalveluita, kuten tietokannan, autentikoinnin ja hostingin. Mobiilisovelluksen käyttäjät autentikoidaan Firebase Authenticationilla ja käyttäjien tallentama tieto säilytetään Firestoressa.

* **Axios**  on HTTP-pyyntöjen tekemiseen tarkoitettu kirjasto ja tässä mobiiliapplikaatiossa sillä haetaan Google Books API:sta kirjojen tietoja käyttäjän antaman hakusanan perusteella.

* **React Navigation** mahdollistaa sovelluksen perusnavigaation ja bottom-tabs -navigointi välilehtien painikkeet sovelluksen alareunaan. Stack Navigation pinoaa päällekkäin sisäänkirjautuneen käyttäjän näkymän sekä sisäänkirjautumattoman aloitussivun.

* **AsyncStorage** on React Nativen kirjasto, jolla tarjoaa tallennetaan avain-arvo -pohjaista tietoa sovelluksessa paikallisesti.

* **Vector Icons** on React Nativen ikonikirjasto, jonka ikoneita on lisätty applikaation navigointipalkkiin.

* **Dotenv** on React Native kirjasto, joka mahdollistaa ympäristömuuttujien käytön sovelluksessa. API-avainten arkaluontoiset tiedot välitetään sen avulla .env-tiedostosta.

* **Safe Area Context** hallitsee turvallisia alueita sovelluksen käyttöliittymässä, esim. alareunan navigointipalkin kohdalla ja yläreunan ilmoituskuvake-rivillä.

* **React Native Screens** tarjoaa suorituskykyistä navigointia sovelluksen eri näkymien välillä.
