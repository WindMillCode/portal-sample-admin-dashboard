// @ts-nocheck
//  modify or view metadata
of({})
.pipe(
    delay(1000),
    tap(
        ()=>{
            let row = 5;
            let orderId0Button:HTMLButtonElement | null = document.querySelector(`body > app-root > app-main > main > section > section.a_p_p_UsersPod1 > div.a_p_p_UsersPod1ItemA2 > div > div:nth-child(${row}) > button`)
            orderId0Button = (orderId0Button as HTMLButtonElement)
            let shipping0Button:HTMLButtonElement| null = document.querySelector(`body > app-root > app-main > main > section > section.a_p_p_UsersPod1 > div.a_p_p_UsersPod1ItemA3 > div > div:nth-child(${row}) > button`)
            shipping0Button = (shipping0Button as HTMLButtonElement)
            let billing0Button:HTMLButtonElement | null = document.querySelector(`body > app-root > app-main > main > section > section.a_p_p_UsersPod1 > div.a_p_p_UsersPod1ItemA4 > div > div:nth-child(${row}) > button`)
            billing0Button = (billing0Button as HTMLButtonElement)
            let modify0Button= document.querySelector(`body > app-root > app-main > main > section > section.a_p_p_UsersPod1 > div.a_p_p_UsersPod1ItemA5 > div > div:nth-child(${row}) > button`)
            modify0Button = (modify0Button as HTMLButtonElement)
            let buttonArray = [orderId0Button,shipping0Button,billing0Button,modify0Button]
            eventDispatcher({
                element:buttonArray[3],
                event:"click"
            })
        }
    )
)
.subscribe()
//
