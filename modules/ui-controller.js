import { CONFIG } from './config.js'
import { historyService } from './history-service.js'
import { logger } from './logger.js'
import {getCurrentWeatherWithFallback} from './weather-service.js'
export const elements = {
  searchBar: document.querySelector("#searchBar"),
  searchBtn: document.querySelector("#searchBtn"),
  locationName: document.querySelector("#location"),
  temp: document.querySelector("#temp"),
  tempCaracter: document.querySelector("#tempCaracter"),
  Umidity: document.querySelector("#Umidity"),
  pressureAtm: document.querySelector("#pressureAtm"),
  wind: document.querySelector("#wind"),
  vizibility: document.querySelector("#vizibility"),
  sunrise: document.querySelector("#sunrise"),
  sunset: document.querySelector("#sunset"),
  theme: document.querySelector("#theme"),
  language: document.querySelector("#language"),
  themeBtn: document.querySelector("#themeBtn"),
  languageBtn: document.querySelector("#languageBtn"),
  unitsBtn: document.querySelector("#unitsBtn"),
  autoLocateBtn: document.querySelector("#auto-locateBtn"),
  WeatherImg: document.querySelector("#WeatherImg"),
  one: document.querySelector("#one"),
  two: document.querySelector("#two"),
  three: document.querySelector("#three"),
  for: document.querySelector("#for"),
  five: document.querySelector("#five"),
  six: document.querySelector("#six"),
  seven: document.querySelector("#seven"),
  loader: document.querySelector("#loader"),
  btnContainer: document.querySelector("#BtnContainer"),
  settingsBtn: document.querySelector("#setting"),
  notFoundLocation: document.querySelector("#notFoundLocation"),
  toShort: document.querySelector("#toShort"),
  AfterMesage: document.querySelector("#recentSearch"),
  recentObject: document.createElement("button"),
  searchH: document.querySelector("#searchH"),
  autoLocate: document.querySelector("#auto-locate")
  // ... restul elementelor
}
// RECENT-OBJEXT.STYLES: //
elements.recentObject.setAttribute("id", "recentLocation")
elements.recentObject.style.cssText=`
display: inline-block;
background-color: rgba(70, 70, 70, 0.5);
margin: 0.6em;
border-radius: 10px;
padding: 5px;
font-size: 20px;
`
//
// elements.autoLocate.setAttribute("checked", "true")
// FUNCTIA DE RANDARE A BUTOANELOR //
export const renderHistory = (historyItems) => {
  const container = document.getElementById("recentSearch");
  const message = document.getElementById("mesage");

  if (historyItems.length === 0) {
    console.info("Nu ai căutări recente!");
    return;
  }

  Array.from(container.children).forEach(child => {
    if (child.id !== "mesage") {
      container.removeChild(child);
    }
  });

  const tableData = [];

  historyItems.forEach(x => {
    const getTimeAgo = (timestamp) => {
      const now = Date.now();
      const diff = now - timestamp;
      const sec = Math.floor(diff / 1000);
      const min = Math.floor(sec / 60);
      const hour = Math.floor(min / 60);
      const days = Math.floor(hour / 24);

      if (sec < 60) return `${sec} secunde în urmă`;
      if (min < 60) return `${min} minute în urmă`;
      if (hour < 24) return `${hour} ore în urmă`;
      return `${days} zile în urmă`;
    };

    const time = getTimeAgo(x.timestamp);
    const ordinary = {
      "🏢Orașe": x.city,
      "🚩Țări": x.country,
      "⏰Timp": time
    };
    tableData.push(ordinary);

    const btn = document.createElement("button");
    btn.textContent = x.city;
    btn.setAttribute("id", "locationBtn")

    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      let deleteBtn = btn.querySelector(".deleteBtn");
      let acceptBtn = btn.querySelector(".acceptBtn")
      if (deleteBtn) {
        deleteBtn.remove();
      }
      if (acceptBtn) {
        acceptBtn.remove()
      } else {
        deleteBtn = document.createElement("button");
        deleteBtn.textContent = "[ ✕ ]";
        deleteBtn.className = "deleteBtn";
        deleteBtn.setAttribute("id","deleteBtn")

        acceptBtn = document.createElement("button");
        acceptBtn.textContent = "[ ✓ ]";
        acceptBtn.className = "acceptBtn";
        acceptBtn.setAttribute("id","acceptBtn")

        btn.appendChild(acceptBtn)
        btn.appendChild(deleteBtn)
        
        deleteBtn.addEventListener("click", async function (event) {
          event.stopPropagation();

          if (historyService.getHistory().length <= 1) {
            logger.warn(`📛Locatia "${x.city}" nu poate fi stearsa!`, "");
            return;
          }

          historyService.removeLocation(x.city);
          renderHistory(historyService.getHistory());

          if (historyService.getHistory().length > 0) {
            const firstCity = historyService.getHistory()[0].city;
            const data = await getCurrentWeatherWithFallback(firstCity);
            const test = tableData.filter((x) => x !== ordinary);
            console.log("==============")
            showLoading();
            console.info('📑 Locatie identificata(AUTO): \n ↪', data);
            hideLoading();
            console.info('📄 Locatia incarcata este(AUTO):\n', `>${data.name}`);
            displayWeather(data);
            document.getElementById("searchBar").value = data.name;
            setTimeout(() => {
              document.getElementById("searchBar").value = ""
            }, 1000);
            console.info("🔎 Locații recente:");
            console.table(test);
            console.log("[HISTORY-LOGS]:\n", logger.getLogs());
            console.log("==============")
          }
        });
        acceptBtn.addEventListener("click", async function(e){
          e.stopPropagation();

      const searchBar = document.getElementById("searchBar");
      searchBar.value = x.city;

      try {
        let data = await getCurrentWeatherWithFallback(x.city);
        // if (historyService.getHistory()[0].country === "RO") (TEST FUNCTIONAL)
        if (data.sys.country === "RO") {
                document.querySelector("html").setAttribute("lang", "ro");
                CONFIG.DEFAULT_LANG = "ro"
                languageBtn.style.marginLeft = "60px";
                languageBtn.textContent = "RO";
                elements.one.textContent = "STAREA-VREMII:"
                elements.two.textContent = "UMIDITATEA-DIN-ATMOSFERA:"
                elements.three.textContent = "PRESIUNEA-ATMOSFERICA:"
                elements.for.textContent = "VANT:"
                elements.five.textContent = "VIZIBILITATE:"
                elements.six.textContent = "RASARIT:"
                elements.seven.textContent = "APUS:"
                }else{
                document.querySelector("html").setAttribute("lang", "en");
                CONFIG.DEFAULT_LANG = "en";
                languageBtn.style.marginLeft = "";
                languageBtn.textContent = "EN";
                elements.one.textContent = "WEATHER:"
                elements.two.textContent = "HUMIDITY:"
                elements.three.textContent = "AIR PRESSURE:"
                elements.for.textContent = "WIND:"
                elements.five.textContent = "VISIBILITY:"
                elements.six.textContent = "SUNRISE:"
                elements.seven.textContent = "SUNSET:"
                }

                data = await getCurrentWeatherWithFallback(x.city);

        const test = tableData.filter((x) => x !== ordinary);
        test.unshift(ordinary);
        console.log("==============")
        showLoading();
        console.info('📑 Locatie identificata: \n ↪', data);
        hideLoading();
        console.info('📄 Locatia incarcata este:\n', `>${data.name}`);
        const history = historyService.getHistory()
        const exists = history.find(item => item.city === data.name)
        if (exists) {
            historyService.moveToTop(data.name)
        }
        renderHistory(historyService.getHistory())
        displayWeather(data);
        document.getElementById("searchBar").value = data.name;
        setTimeout(() => {
              document.getElementById("searchBar").value = ""
            }, 1000);
        console.info("🔎 Locații recente:");
        console.table(test);
        console.log("==============")
        console.log("[HISTORY-LOGS]:\n", logger.getLogs());
      } catch (error) {
        console.error('Eroare la încărcarea vremii:', error);
      } finally {
        hideLoading();
      }
        })
      }
    });

    btn.addEventListener("dblclick", async function (e) {
      e.stopPropagation();

      const searchBar = document.getElementById("searchBar");
      searchBar.value = x.city;

      try {
        let data = await getCurrentWeatherWithFallback(x.city);
        // if (historyService.getHistory()[0].country === "RO") (TEST FUNCTIONAL)
        if (data.sys.country === "RO") {
                document.querySelector("html").setAttribute("lang", "ro");
                CONFIG.DEFAULT_LANG = "ro"
                languageBtn.style.marginLeft = "60px";
                languageBtn.textContent = "RO";
                elements.one.textContent = "STAREA-VREMII:"
                elements.two.textContent = "UMIDITATEA-DIN-ATMOSFERA:"
                elements.three.textContent = "PRESIUNEA-ATMOSFERICA:"
                elements.for.textContent = "VANT:"
                elements.five.textContent = "VIZIBILITATE:"
                elements.six.textContent = "RASARIT:"
                elements.seven.textContent = "APUS:"
                }else{
                document.querySelector("html").setAttribute("lang", "en");
                CONFIG.DEFAULT_LANG = "en";
                languageBtn.style.marginLeft = "";
                languageBtn.textContent = "EN";
                elements.one.textContent = "WEATHER:"
                elements.two.textContent = "HUMIDITY:"
                elements.three.textContent = "AIR PRESSURE:"
                elements.for.textContent = "WIND:"
                elements.five.textContent = "VISIBILITY:"
                elements.six.textContent = "SUNRISE:"
                elements.seven.textContent = "SUNSET:"
                }

                data = await getCurrentWeatherWithFallback(x.city);

        const test = tableData.filter((x) => x !== ordinary);
        test.unshift(ordinary);
        console.log("==============")
        showLoading();
        console.info('📑 Locatie identificata: \n ↪', data);
        hideLoading();
        console.info('📄 Locatia incarcata este:\n', `>${data.name}`);
        const history = historyService.getHistory()
        const exists = history.find(item => item.city === data.name)
        if (exists) {
            historyService.moveToTop(data.name)
        }
        renderHistory(historyService.getHistory())
        displayWeather(data);
        document.getElementById("searchBar").value = data.name;
        setTimeout(() => {
              document.getElementById("searchBar").value = ""
            }, 1000);
        console.info("🔎 Locații recente:");
        console.table(test);
        console.log("==============")
        console.log("[HISTORY-LOGS]:\n", logger.getLogs());
      } catch (error) {
        console.error('Eroare la încărcarea vremii:', error);
      } finally {
        hideLoading();
      }
    });

    container.appendChild(btn);
  });
};
//  //
export function showLoading() {
    elements.loader.style.display = "none"
    logger.info("🔁Detectez locația...", "")
}
//
export function hideLoading() {
    elements.loader.style.display = ""
}
//
export function showError(message) {
    console.error(`${message}`)
}
//
export function showMessage(text){
    return text
}
// //

//Ilustrare grafica:
export const displayWeather = (weatherData) => {
    if (weatherData) {
        const accesKey = weatherData
    elements.locationName.textContent=accesKey.name.toUpperCase()
        const celsiusTemp = accesKey.main.temp

        if (elements.unitsBtn.textContent === "°C") {
            if (celsiusTemp>35) {
                elements.WeatherImg.setAttribute("container","🌞")
            }
            if (celsiusTemp<35) {
                elements.WeatherImg.setAttribute("container","🌤️")
            }
            if (celsiusTemp<20) {
                elements.WeatherImg.setAttribute("container","⛅")
            }
            if (celsiusTemp<10) {
                elements.WeatherImg.setAttribute("container","🌥️")
            }
            if (celsiusTemp<0) {
                elements.WeatherImg.setAttribute("container","☁️")
            }
        }else if (elements.unitsBtn.textContent === "°F") {
            if (celsiusTemp>95) {
                elements.WeatherImg.setAttribute("container","🌞")
            }
            if (celsiusTemp<95) {
                elements.WeatherImg.setAttribute("container","🌤️")
            }
            if (celsiusTemp<68) {
                elements.WeatherImg.setAttribute("container","⛅")
            }
            if (celsiusTemp<50) {
                elements.WeatherImg.setAttribute("container","🌥️")
            }
            if (celsiusTemp<32) {
                elements.WeatherImg.setAttribute("container","☁️")
            }
        }
        elements.temp.setAttribute("data-unit",celsiusTemp.toFixed(1) + elements.unitsBtn.textContent) 
    elements.tempCaracter.textContent=accesKey.weather[0].description.toUpperCase()
    elements.Umidity.textContent=accesKey.main.humidity + " %"
    elements.pressureAtm.textContent=accesKey.main.pressure + " hPa"
    if (elements.unitsBtn.textContent==="°C") {
        elements.wind.textContent = accesKey.wind.speed + " m/s"
    }else if (elements.unitsBtn.textContent==="°F") {
        const newWindUnit = accesKey.wind.speed * 1.609344
        elements.wind.textContent = newWindUnit.toFixed(2) + " Km/h"
    }
    elements.vizibility.textContent=accesKey.visibility/1000 +"Km"
    const sunriseTime = new Date(accesKey.sys.sunrise * 1000);
    const sunsetTime = new Date(accesKey.sys.sunset * 1000);
//
    elements.sunrise.textContent = sunriseTime.toLocaleTimeString([], {
     hour: '2-digit',
     minute: '2-digit'
    });
//
    elements.sunset.textContent = sunsetTime.toLocaleTimeString([], {
     hour: '2-digit',
     minute: '2-digit'
    });
    }
}