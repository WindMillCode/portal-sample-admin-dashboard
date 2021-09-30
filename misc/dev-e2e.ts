// choose a item from the lab
of({})
.pipe(
    delay(3000),
    tap(()=>{
        eventDispatcher({
            element:document.querySelector(".a_p_p_LabsPod0Item") as HTMLElement,
            event:"click"
        })
    })
)
.subscribe()
//
