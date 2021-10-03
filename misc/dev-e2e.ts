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

// create a user
of({})
.pipe(
    delay(2000),
    tap(()=>{
        eventDispatcher({
            element:document.querySelector("button.a_p_p_UsersPod0Button3") as HTMLElement,
            event:"click"
        })
    }),
    delay(100),
    tap(()=>{
        let sameAsBilling = [true,false][Math.random()*2|0];
        let bSA:any= { // billingShippingArithmetic
            initial : [faker.name.firstName,
            faker.name.lastName,
            faker.internet.email,
            faker.phone.phoneNumber,
            faker.address.streetAddress,
            faker.address.city,
            faker.address.state,
            faker.address.zipCode,
            faker.address.country]
            .map((y:any,j)=>{
                let val= y()
                return  sameAsBilling ? [val,val] :[val,y()]

            }),
        }
        bSA.final = Array(2).fill(null)
        .map((x:any,i)=>{
            return bSA.initial
            .map((y:any,j)=>{
                return y[i]
            })
        })
        let myValues = [
            faker.internet.userName(),
            faker.internet.password(),
            ...flatDeep(bSA.final)
        ]
        console.log(myValues)
        document.querySelectorAll(".a_p_p_UsersPod2Input0")
        .forEach((x:any,i)=>{
            x.value = myValues[i];
            eventDispatcher({
                element:x,
                event:"focusout"
            })
        })


    })
)
.subscribe()
//
