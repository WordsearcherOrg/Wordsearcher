window.onload = () => {
const searchTypes = new Map([
  ["Describes", "rel_jjb"],
  ["Is Like", "ml"],
  ["Sounds Like", "sl"],
  ["Starts With", "sp"]

])
const spacelessParam = new Map([
  ["Soundslike", "Sounds Like"],
  ["Startswith", "Starts With"],
  ["Islike", "Is Like"]
])
const placeholders = new Map([
  ["Describes", "any word"],
  ["Is Like", "any word or phrase"],
  ["Sounds Like", "anything"],
  ["Starts With", "anything"]
])

var viewing
function search(status) {
  if(document.getElementById("term").value.slice(-1) == " ") { document.getElementById("term").value = document.getElementById("term").value.trim() }
  let footData =  document.getElementById("footerDatamuse")
  if(footData) {
    footData.remove()
  }
  let term = document.getElementById("term").value
  if(term != "") {
  document.getElementById("cards").innerHTML = ""
  let type = document.getElementById("searchType").value
  let topPadding = (window.innerHeight / 2) + 200
  let str = titleCase(fixQuery(type))
  params.set("type", str.replaceAll(" ", ""))
  params.set("word", term)
  if(status != true) {
    history.pushState(null, null, "?"+params.toString())
  }
  //document.getElementById("cards").style.paddingTop = topPadding



  let key = searchTypes.get(type)
  if(key != "sp") { url = `https://api.datamuse.com/words?${key}=${term}&md=r&ipa=1&p&max=1000` 
}
  else { url = `https://api.datamuse.com/words?${key}=${term}*&md=r&ipa=1&p&max=1000`}
  fetch(url)
  .then(response => response.json())
  .then(data => {
    let keys = Object.keys(data)
    document.title = `${type} "${term}" ― Wordsearcher`
    if(keys.length < 1) {
      document.getElementById("noResult").style.visibility = "visible"
      document.getElementById("noResult").classList.remove("fade")
    } else {
      document.getElementById("noResult").style.visibility = "hidden"
      document.getElementById("noResult").classList.add("fade")
    }
    for (let i = 0; i <= keys.length - 1; i++) {
      if(data[i].word.includes(document.getElementById("term").value)) {
        i++
      }
      let num = i
      let node = document.createElement("div")
      node.className = "card"
      let elem = document.createElement("p")
      elem.className = "wordHeader"
      let word = data[num].word
      word = word.charAt(0).toUpperCase() + word.slice(1);
      elem.innerHTML = word
      node.appendChild(elem)
      if(type == "Describes") {
        elem = document.createElement("p")
        elem.className = "describedTerm"
        elem.innerHTML = term.toLowerCase()
        node.appendChild(elem)
      }
      elem = document.createElement("p")
      elem.className = "wordPro"
      for (let i = 0; i <= data[num].tags.length - 1; i++) {
        if(data[num].tags[i].startsWith("ipa_pron")) {
          let pron = data[num].tags[i]
          pron = pron.replace("ipa_pron:", "")
          elem.innerHTML = pron
        }
        //if(elem.innerHTML == "") {
        //  elem.innerHTML = "──"
        //}
      }
      node.appendChild(elem)
      elem = document.createElement("p")
      elem.className = "wordType"
      parts = []
      viewing = 99
      for (let i = 0; i <= data[num].tags.length - 1; i++) {
        if(data[num].tags[i].length <= "3") {
          if(data[num].tags[i] != "syn") {
            if(data[num].tags[i] == "n") {
              parts.push("Noun")
            } else if (data[num].tags[i] == "v"){
              parts.push("Verb")
            } else if (data[num].tags[i] == "adj") {
              parts.push("Adjective")
            } else if (data[num].tags[i] == "adv") {
              parts.push("Adverb")
            } else if (data[num].tags[i] == "u") {
              parts.push("Unknown")
            }
          }
        }
      }
      if(parts.length == 1) {
        elem.innerHTML = parts[0]
      } else if(parts.length > 1) {
        let partsFinal = ""
        for (let i = 0; i <= parts.length - 1; i++) {
          if(i < parts.length - 1) {
            partsFinal = partsFinal + parts[i] + "/"
          } else {
            partsFinal = partsFinal + parts[i]
          }
          elem.innerHTML = partsFinal
        }
      }
      node.appendChild(elem)
      document.getElementById("cards").appendChild(node)
      elem = document.createElement("a")
      elem.className = "dictionary"
      elem.setAttribute("word", data[num].word)
      let book = document.createElement("i")
      book.className = "fas fa-book-open"
      elem.appendChild(book)
      if(data[num].word.includes(" ")) {
        elem.style.cursor = "not-allowed"
        elem.setAttribute("data-tooltip", "Unavailable")
      } else {
        elem.setAttribute("data-tooltip", "Dictionary")
        elem.href = `https://www.dictionary.com/browse/${data[num].word}`
        elem.target = "_blank"
      }
      node.appendChild(elem)
      node.setAttribute("num", i)
      if(i > 99) { 
        node.style.display = "none"
      }
      if(i == keys.length - 1) {
        elem = document.createElement("p")
        elem.innerHTML = "Data provided by Datamuse."
        elem.id = "footerDatamuse"
        document.body.appendChild(elem)
      }
    }
    
  });
};
}
function changePlaceholder() {
  document.getElementById("term").setAttribute("placeholder", placeholders.get(document.getElementById("searchType").value))
}
changePlaceholder()
var url = new URL(document.location)
const params = url.searchParams;
function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ')
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  // Directly return the joined string
  return splitStr.join(' '); 
}
function noQuery() {
  document.getElementById("searchType").value = "Describes"
}
function fixQuery(query) {
  let fixed = query.charAt(0).toUpperCase() + query.substring(1).toLowerCase()
  return fixed
}
function paramUsage() {
if (params.has("type")) {
  let query = fixQuery(params.get('type'), "type")
  if(searchTypes.has(query)) {
    document.getElementById("searchType").value = query
    if(query == "Is Like") {
      document.getElementById("atopSearch").innerHTML = "Find a word that..."
    }
  } else {
    if(spacelessParam.has(query)) {
      document.getElementById("searchType").value = spacelessParam.get(query)
    } else {
      noQuery()
    }
  }
}
if (params.has("word")) {
  document.getElementById("term").value = params.get("word")
  search(true)
}
}
paramUsage()
var parts = []
    function getTextWidth(text, font) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
      
        context.font = font || getComputedStyle(document.body).font;
      
        return context.measureText(text).width;
      }

      let button = document.getElementById("searchButton")
      if(document.getElementById("term").value.length >= 1) {
        button.style.opacity = 1;
        button.style.cursor = "pointer"
        
      } else {
        button.style.opacity = 0.1
        button.style.cursor = "not-allowed"
      }
  function fixBar() {
    document.getElementById("cards").style.paddingTop = (window.innerHeight / 2) + 200
    if (document.getElementById("term").clientWidth + 100>= window.innerWidth) {
      let bannerWidth = 90
      document.getElementById("term").style.width = "80vw";
      document.getElementById("banner").style.width = bannerWidth + "vw";
      document.getElementById("banner").style.height = (0.157197258 * bannerWidth).toString() + "vw";
    } else if(window.innerWidth >= 700){
        document.getElementById("term").style.width = "600px"
        document.getElementById("banner").style.width = "656.5"
        document.getElementById("banner").style.height = "103.2"
        //0.157197258
    }
    if(document.getElementById("cards")) {
      //document.getElementById("cards").style.paddingTop = (window.innerHeight / 2) + 200
    }
  }
  function fixWidth(value) {
    let newWidth = getTextWidth(value, "bold 20px Inter") + 20
      document.getElementById("searchType").style.width = newWidth
      document.getElementById("term").style.paddingLeft = newWidth + 21
  }

  const convertMap = {
    AA: "ɑ",
    AE: "æ",
    AH: "ʌ",
    AO: "ɔ",
    AW: "aʊ",
    AX: "ə",
    AXR: "ɚ",
    AY: "aɪ",
    EH: "ɛ",
    ER: "ɝ",
    EY: "eɪ",
    IH: "ɪ",
    IX: "ɨ",
    IY: "i",
    OW: "oʊ",
    OY: "ɔɪ",
    UH: "ʊ",
    UW: "u",
    UX: "ʉ"
  }
  const convertRE = new RegExp(Object.keys(convertMap).join("|"),"gi")

  function simplifyPr(pr) {
    let oldArray = pr.split(' ')
    let newArray = []
    oldArray.forEach(syl => {
      if (syl.includes("0")) {
        syl = syl.replaceAll("0", "")
      }
      else if (syl.includes("1")) {
        syl = syl.replaceAll("1", "")
        syl = "ˈ" + syl
      }
      else if (syl.includes("2")) {
        syl = syl.replaceAll("2", "")
        syl = "ˌ" + syl
      }
      syl = syl.replaceAll(convertRE, function(matched) {
        return convertMap[matched];
      })
      newArray.push(syl)  
    })
    return(newArray.join().replaceAll(",", ""))
  }

  fixWidth(document.getElementById("searchType").value)
  fixBar();
  window.onresize = fixBar;

  document.getElementById("searchType").onchange = (ev) => {
      changePlaceholder()
      fixWidth(ev.target.value)
      if(ev.target.value == "Is Like") {
        document.getElementById("atopSearch").innerHTML = "Find a word that..."
      } else {
        document.getElementById("atopSearch").innerHTML = "Find a word that..."
      }
  }

  document.getElementById("term").onkeyup = (ev) => {
    let button = document.getElementById("searchButton")
    if(ev.target.value.length >= 1) {
      button.style.opacity = 1;
      button.style.cursor = "pointer"
      
    } else {
      button.style.opacity = 0.1
      button.style.cursor = "not-allowed"
    }
  }
  document.getElementById("term").addEventListener("keyup", (ev) => {{
    if(ev.key === 'Enter' || ev.keyCode === 13) {
      ev.preventDefault()
      document.getElementById("searchButton").click();
    }
  }})
  let dictionaryButtons = document.getElementsByClassName("dictionary")
  for (var i = 0, len = dictionaryButtons.length; i < len; i++) {
    dictionaryButtons[i].addEventListener("click", () => {
    window.open('https://www.dictionary.com/browse/interesting', '_blank');
  })
  }

  document.getElementById("searchButton").addEventListener("click", search)
  window.never = function(ev) {
    let newURL = new URL(ev.target.location)
    let p = newURL.searchParams
    if (p.has("type")) {
      let query = fixQuery(p.get('type'), "type")
      if(searchTypes.has(query)) {
        document.getElementById("searchType").value = query
        if(query == "Is Like") {
          document.getElementById("atopSearch").innerHTML = "Find a word that..."
        }
      } else {
        if(spacelessParam.has(query)) {
          document.getElementById("searchType").value = spacelessParam.get(query)
        } else {
          noQuery()
        }
      }
    }
    if (p.has("word")) {
      document.getElementById("term").value = p.get("word")
      search(false)
    }
}
window.onpopstate = (e) => {
  location.reload()
};
document.getElementById("toTop").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
})
document.addEventListener("scroll", () => {
  let scrollPer = 0.1
  if(window.scrollY >= 0.7 * document.body.scrollHeight) {
    document.querySelectorAll('[num]').forEach(elem => {
      console.log("b")
      if(elem.getAttribute("num") <= viewing + 100) {
        elem.style.display = "inline"
      }
    })
    viewing += 100
  } else if(window.scrollY >= scrollPer * document.body.scrollHeight) {
    document.getElementById("toTop").style.display = "block"
  } else {
    document.getElementById("toTop").style.display = "none"
  }
})
document.getElementById("about").addEventListener("click", () => {
  document.getElementById("aboutBox").style.display = "block"
  document.getElementById("overlay").classList.remove("light")
  document.getElementById("overlay").classList.add("dim")
})
function closeAbout() {
  document.getElementById("aboutBox").style.display = "none"
  document.getElementById("overlay").classList.remove("dim")
  document.getElementById("overlay").classList.add("light")
}
document.getElementById("aboutClose").addEventListener("click", closeAbout)
document.getElementById("overlay").addEventListener("click", closeAbout)

document.getElementById("banner").setAttribute("href", "https://google.com")
}
