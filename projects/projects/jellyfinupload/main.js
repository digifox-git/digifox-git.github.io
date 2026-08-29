document.addEventListener("DOMContentLoaded", () => {

    let currentTab = ""
    let tabs = document.querySelectorAll(".tab")
    let sidebarItems = document.querySelectorAll(".sidebar_item")
    let uploadIcons = document.querySelectorAll(".uploading_icon")
    let consoleLogger = document.getElementById("console_log")
    let userArea = document.getElementById("user_info_bar")

    let activeRequests = 0

    authKeyInput = document.getElementById("auth_input")
    let authKey = authKeyInput.value
    authKeyInput.addEventListener("change", () => {
        authKey = authKeyInput.value
    })

    function can_interact() {
        if (activeRequests == 0) {
            set_interact(true)
            return true
        } else {
            set_interact(false)
            return false
        }
    }

    function set_interact(bool) {
        let buttons = document.querySelectorAll("button")
        canInteract = bool
        if (bool == true) {
            buttons.forEach(button => {
                button.classList.remove("busy")
            })
        } else {
            buttons.forEach(button => {
                button.classList.add("busy")
            })
        }
    }

    async function post(endpoint, isJSON = true, authorization, body) {
        // Catch incorrect formatting
        if (endpoint.charAt(0) != "/") return `POST: Endpoint must begin with "/" (Found ${endpoint.charAt(0)} instead)`
        activeRequests++
        can_interact()

        let res = await new Promise((resolve, reject) => {
            console.log(`Posting to https://jupload.digifox.space${endpoint}`)
            const xhr = new XMLHttpRequest()

            xhr.open("POST", `https://jupload.digifox.space${endpoint}`)
            if (isJSON) {
                xhr.setRequestHeader("Content-Type", "application/json") // Format for JSON
                body = JSON.stringify(body)
            }
            xhr.setRequestHeader("Authorization", authorization)

            // Handle complete request
            xhr.onload = () => {
                try {
                    resolve(JSON.parse(xhr.responseText))
                } catch (error) {
                    reject(error)
                }
            }

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = (event.loaded / event.total) * 100
                    consoleLogger.innerText = `${percent.toFixed(2)}% complete`
                    userArea.style.background = `linear-gradient(to right,rgb(255, 255, 255) ${percent}%, rgb(160, 160, 160) ${percent - 1}%, rgb(160, 160, 160) 100%)`
                }
            }

            // Can't connect
            xhr.onerror = () => {
                reject(new Error("POST request failed!"))
            }

            xhr.send(body)
        })

        activeRequests--
        can_interact()

        userArea.style.background = `white`
        return res
    }

    async function get(endpoint, authorization) {
        activeRequests++

        let res = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.open("GET", `https://jupload.digifox.space${endpoint}`)

            xhr.setRequestHeader("Authorization", authorization)

            // Handle complete request
            xhr.onload = () => {
                try {
                    resolve(JSON.parse(xhr.responseText))
                } catch (error) {
                    reject(error)
                }
            }

            // Can't connect
            xhr.onerror = () => {
                reject(new Error("Upload has failed!"))
            }

            xhr.send()
        })
        activeRequests--
        return res
    }

    async function auth_check() {
        const res = await post("/auth/check", false, authKey)
        console.log(res.content)
        return res.content
    }

    function switch_tab(label) {
        can_interact()
        consoleLogger.innerText = ""
        tabs.forEach(tab => {
            tab.classList.remove("slide_from_right")
            tab.style.display = "none"
            if (tab.ariaLabel == label) {
                tab.style.display = "flex"
                currentTab = label
                void tab.offsetWidth // Forces page to reload layout so animation will play
                // https://stackoverflow.com/questions/60686489/what-purpose-does-void-element-offsetwidth-serve
                tab.classList.add("slide_from_right")
            }
        }) 

        sidebarItems.forEach(item => {
            if (item.ariaLabel == currentTab) {
                item.classList.add("selected")
                item.classList.remove("unselected")
            } else {
                item.classList.add("unselected")
                item.classList.remove("selected")
            }
        })
    }

    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            console.log(`Switching to ${item.ariaLabel} tab.`)
            switch_tab(item.ariaLabel)
        })
    })

    function create_item(div, name, iconnum, label) {
        let category = document.getElementById(div)

        let item = document.createElement("div")
        let icon = document.createElement("img")
        let text = document.createElement("p")

        item.classList.add(label)

        item.ariaLabel = name
        item.classList.add("sidebar_item")
        item.classList.add("unselected")
        icon.src = `assets/Icons.${iconnum}.png`
        text.innerText = name

        item.addEventListener("click", () => {
            if (label == "show") {
                get_show(name)
            }

            console.log(`Switching to ${item.ariaLabel} tab.`)
            let mediaTab = document.getElementById(`${label}_tab`)
            let mediaName = document.getElementById(`tab_${label}_name`)
            mediaName.innerText = name
            mediaTab.ariaLabel = item.ariaLabel
            switch_tab(item.ariaLabel)
        })

        item.appendChild(icon)
        item.appendChild(text)

        category.appendChild(item)
    }

    const controller = new AbortController() // Call controller.abort() to cancel a fetch request

    let uploadMovieButton = document.getElementById("upload_movie_button")
    uploadMovieButton.addEventListener("click", async () => {
        if (await auth_check() == false) {
            consoleLogger.innerText = "Invalid authentication key!"
            return
        }
        
        if (can_interact()) upload_movie()
    })

    let createShowButton = document.getElementById("create_show_button")
    let seasons = document.getElementById("new_show_seasons").value
    createShowButton.addEventListener("click", () => {
        let name = document.getElementById("new_show_name").value
        if (can_interact()) create_show(name, seasons)
    })

    let deleteMovieButton = document.getElementById("deleteMovie")
    deleteMovieButton.addEventListener("click", async () => {
        if (await auth_check() == false) {
            consoleLogger.innerText = "Invalid authentication key!"
            return
        }
        if (can_interact() && confirm("Are you sure you want to perform this action?") == true) {
            delete_movie(currentTab)
        }
    })

    let deleteShowButton = document.getElementById("deleteShow")
    deleteShowButton.addEventListener("click", async () => {
        if (await auth_check() == false) {
            consoleLogger.innerText = "Invalid authentication key!"
            return
        }
        if (can_interact() && confirm("Are you sure you want to perform this action?") == true) {
            delete_show(currentTab)
        }
    })

    uploadIcons.forEach(icon => {
        icon.classList.add("hidden")
    })

    async function create_season(showName) {
        const res = await post("/create/season", true, authKey, { "name": showName })
        consoleLogger.innerText = JSON.stringify(res.content)
        get_shows()
        get_show(showName)
        switch_tab(showName)
    }

    async function delete_episode(show, season, episode) {
        const res = await post("/delete/episode", true, authKey, { "name": show, "season": season, "episode": episode })
        consoleLogger.innerText = JSON.stringify(res.content)
        get_shows()
        get_show(show)
        switch_tab(show)
    }

    async function delete_season(showName, season) {
        const res = await post("/delete/season", true, authKey, { "name": showName, "season": season })
        consoleLogger.innerText = JSON.stringify(res.content)
        get_shows()
        get_show(showName)
        switch_tab(showName)
    }

    async function delete_show(showName) {
        const res = await post("/delete/show", true, authKey, { "name": showName })
        consoleLogger.innerText = JSON.stringify(res.content)
        switch_tab("Welcome Page")
        get_shows()
    }
 
    async function delete_movie(movieName) {
        const res = await post("/delete/movie", true, authKey, { "name": movieName })
        consoleLogger.innerText = JSON.stringify(res.content)
        get_movies()
    }

    async function upload_episodes(showName, showSeason, uploadButton) {
        let files = uploadButton.files
        if (!files) {
            consoleLogger.innerText = "You must upload at least one file!"
            return
        }

        const formData = new FormData() // Files must be sent with FormData object
        for (const file of files) {
            formData.append("file", file)
        }
        formData.append("name", showName)
        formData.append("season", showSeason)

        const res = await post("/upload/show", false, authKey, formData)
        consoleLogger.innerText = JSON.stringify(res.content)
        get_shows()
        get_show(showName)
        switch_tab(showName)
    }

    async function upload_movie() {
        let files = document.getElementById("movie_files").files
        if (!files) {
            consoleLogger.innerText = "You must upload at least one file!"
            return
        }

        const formData = new FormData() // Files must be sent with FormData object
        for (const file of files) {
            formData.append("file", file)
        }

        const res = await post("/upload/movie", false, authKey, formData)
        consoleLogger.innerText = JSON.stringify(res.content)
        get_movies()
    }

    async function create_show(showName, seasons) {
        await post("/create/show", true, authKey, { "name": showName, "seasons": seasons })
        get_shows()
    }
    
    async function get_show(showName) {
        document.querySelectorAll(".season").forEach(season => {
            season.remove()
        })
        document.querySelectorAll(".new_season_button").forEach(item => {
            item.remove()
        })

        const res = await post("/get/show", true, authKey, { "name": showName })

        let showTab = document.getElementById("show_tab")
        for (const season of Object.keys(res.content)) {
            
            let seasonDiv = document.createElement("div")
            seasonDiv.classList.add("season")
            seasonDiv.ariaLabel = season
            let headerDiv = document.createElement("div")
            headerDiv.classList.add("season_header_div")
            let seasonHeader = document.createElement("h2")
            seasonHeader.innerText = season
            let addEpisodes = document.createElement("button")
            addEpisodes.innerText = "+"
            addEpisodes.classList.add("add_episodes")
            addEpisodes.ariaLabel = season // Set label to season so it can be grabbed later
            let seasonEpisodes = document.createElement("div")
            seasonEpisodes.classList.add("episodes")
            
            let browseInput = document.createElement("input")
            browseInput.class = "episode_upload_button"
            browseInput.type = "file"
            browseInput.name = "add_episodes"
            browseInput.accept = ".mp4,.mov,.mkv"
            browseInput.multiple = true
            browseInput.style.display = "none"

            browseInput.addEventListener("change", async () => {
                can_interact()
                if (await auth_check() == false) {
                    consoleLogger.innerText = "Invalid authentication key!"
                    return
                }
                if (browseInput.files && can_interact()) {
                    upload_episodes(showName, season, browseInput)
                }
                for (const episode of browseInput.files) {
                    let episodeDiv = document.createElement("div")
                    episodeDiv.classList.add("episode")
                    let episodeName = document.createElement("p")
                    episodeName.innerText = "Uploading..."
                    let episodeOptions = document.createElement("div")
                    episodeOptions.classList.add("episode_options")

                    episodeDiv.appendChild(episodeName)
                    episodeDiv.appendChild(episodeOptions)

                    seasonEpisodes.appendChild(episodeDiv)
                }
            })

            addEpisodes.addEventListener("click", () => {
                if (can_interact()) browseInput.click()
            })

            for (const episode in res.content[season]) {
                let episodeDiv = document.createElement("div")
                episodeDiv.classList.add("episode")
                let episodeName = document.createElement("p")
                episodeName.innerText = res.content[season][episode]
                let episodeOptions = document.createElement("div")
                episodeOptions.classList.add("episode_options")
                let episodeDelete = document.createElement("button")
                episodeDelete.innerText = "Delete"

                episodeDelete.addEventListener("click", () => {
                    if (can_interact() && confirm("Are you sure you want to perform this action?") == true) {
                        delete_episode(showName, season, res.content[season][episode])
                    }
                })

                episodeOptions.appendChild(episodeDelete)
                episodeDiv.appendChild(episodeName)
                episodeDiv.appendChild(episodeOptions)

                seasonEpisodes.appendChild(episodeDiv)
            }

            headerDiv.appendChild(seasonHeader)
            headerDiv.appendChild(addEpisodes)
            headerDiv.appendChild(browseInput)

            seasonDiv.appendChild(headerDiv)
            seasonDiv.appendChild(seasonEpisodes)
            showTab.appendChild(seasonDiv)
        }

        let newSeason = document.createElement("button")
        newSeason.innerText = "Add New Season"
        newSeason.classList.add("new_season_button")
        newSeason.addEventListener("click", () => {
            if (can_interact()) create_season(showName)
        })

        let deleteLatestSeason = document.createElement("button")
        deleteLatestSeason.innerText = "Delete Latest Season"
        deleteLatestSeason.classList.add("new_season_button")
        deleteLatestSeason.addEventListener("click", () => {
            if (can_interact() && confirm("Are you sure you want to perform this action?") == true) {
                const latestSeason = Object.keys(document.querySelectorAll(".season")).length
                delete_season(showName, `Season ${latestSeason}`)
            }
        })
        showTab.appendChild(newSeason)
        showTab.appendChild(deleteLatestSeason)
    }

    async function get_shows() {
        const res = await get("/get/shows", authKey)

        document.getElementById("shows_category").querySelectorAll(".show").forEach(item => {
            item.remove()
        })
        for (show of res.content) {
            create_item("shows_category", show, 8, "show")
        }
        sidebarItems = document.querySelectorAll(".sidebar_item")
    }

    async function get_movies() {
        const res = await get("/get/movies", authKey)

        document.getElementById("movies_category").querySelectorAll(".movie").forEach(item => {
            item.remove()
        })
        for (movie of res.content) {
            create_item("movies_category", movie, 38, "movie")
        }
        sidebarItems = document.querySelectorAll(".sidebar_item")
    }

    get_shows()
    get_movies()
    switch_tab("Welcome Page")

    setInterval(() => {
        can_interact()
    }, 1000);
})