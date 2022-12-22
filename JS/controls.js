


document.addEventListener("click", (e) => {
    if (e.target.classList.contains("change")) {
        var translateValue = document.querySelector(`.${e.target.classList[1].split("-")[0]}-${e.target.classList[1].split("-")[1]}-value`)
        x = translateValue.innerHTML
        if (e.target.classList[1].split("-")[2] == "plus") { x++ }
        else {x--}  
        translateValue.innerHTML = x
    }
})