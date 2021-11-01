// @ts-nocheck
//  modify or view metadata
of({})
.pipe(
    delay(1000),
    tap(
        ()=>{
            let row = 5;
            let cart0Button:HTMLButtonElement | null = document.querySelector(`body > app-root > app-main > main > section > section.a_p_p_UsersPod1 > div.a_p_p_UsersPod1ItemA2 > div > div:nth-child(${row}) > button`)
            cart0Button = (cart0Button as HTMLButtonElement)
            let shipping0Button:HTMLButtonElement| null = document.querySelector(`body > app-root > app-main > main > section > section.a_p_p_UsersPod1 > div.a_p_p_UsersPod1ItemA3 > div > div:nth-child(${row}) > button`)
            shipping0Button = (shipping0Button as HTMLButtonElement)
            let billing0Button:HTMLButtonElement | null = document.querySelector(`body > app-root > app-main > main > section > section.a_p_p_UsersPod1 > div.a_p_p_UsersPod1ItemA4 > div > div:nth-child(${row}) > button`)
            billing0Button = (billing0Button as HTMLButtonElement)
            let modify0Button= document.querySelector(`body > app-root > app-main > main > section > section.a_p_p_UsersPod1 > div.a_p_p_UsersPod1ItemA5 > div > div:nth-child(${row}) > button`)
            modify0Button = (modify0Button as HTMLButtonElement)
            let buttonArray = [cart0Button,shipping0Button,billing0Button,modify0Button]
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


// component table modify or view metadata
of({})
.pipe(
    delay(1000),
    tap(
        ()=>{
            let row = Math.floor(Math.random()*20);


            // let buttonArray = [cart0Button,shipping0Button,billing0Button,modify0Button]
            let buttonArray = Array(4).fill(null)
            .map((x: HTMLButtonElement,i=4)=>{

                return document
                .querySelector("app-inventory")!
                .shadowRoot!
                .querySelector(`main >
                section.a_p_p_InventoryPod2 >
                div:nth-child(${i+4}) > div > div:nth-child(${row}) > button`)

            })
            eventDispatcher({
                element:buttonArray[3] as HTMLButtonElement,
                event:"click"
            })
        }
    )
)
.subscribe()
//


// create order resource
let {ryber}= this
of({})
.pipe(
    delay(1000),
    tap(()=>{
        let createButton=
            document
            .querySelector("app-inventory")!
            .shadowRoot!
            .querySelector(".a_p_p_InventoryPod0Button2")

        eventDispatcher({
            element:createButton  as HTMLButtonElement ,
            event:"click"
        })
    }),
    delay(1000),
    concatMap(()=>{

        return ryber.http.post(
            `${env.backend.url}/product/list`,
            {
                data:{
                    filter:["desc","img_url","quantity"]
                }
            }
        )
        .pipe(
            pluck("message","list")
        )
    }),
    tap((result:any)=>{
        // create a new resource


        let products = result
        let product= products[Math.floor(Math.random()*products.length)]
        product.quantity  =   Math.floor(Math.random() *10) +1
        product.total = parseFloat(product.price) * product.quantity
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
            ...flatDeep(bSA.final),
            product.total.toFixed(2),
            product.title,
            product.price.toFixed(2),
            product.quantity
        ]

        let inputs = document
        .querySelector("app-inventory")!
        .shadowRoot!
        .querySelectorAll(".a_p_p_InventoryPod3Input0")
        .forEach((x:any,i)=>{
            x.value = myValues[i];
            eventDispatcher({
                element:x,
                event:"focusout"
            })
        })
        //
    })
)
.subscribe()
//

// create user resource
let {ryber}= this
of({})
.pipe(
    delay(1000),
    tap(()=>{
        let createButton=
            document
            .querySelector("app-inventory")!
            .shadowRoot!
            .querySelector(".a_p_p_InventoryPod0Button2")

        eventDispatcher({
            element:createButton  as HTMLButtonElement ,
            event:"click"
        })
    }),
    delay(1000),
    concatMap(()=>{

        return ryber.http.post(
            `${env.backend.url}/product/list`,
            {
                data:{
                    filter:["desc","img_url","quantity"]
                }
            }
        )
        .pipe(
            pluck("message","list")
        )
    }),
    tap((result:any)=>{
        // create a new resource


        let products = result
        let product= products[Math.floor(Math.random()*products.length)]
        product.quantity  =   Math.floor(Math.random() *10) +1
        product.total = parseFloat(product.price) * product.quantity
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
            ...flatDeep(bSA.final),
        ]

        let inputs = document
        .querySelector("app-inventory")!
        .shadowRoot!
        .querySelectorAll(".a_p_p_InventoryPod3Input0")
        .forEach((x:any,i)=>{
            x.value = myValues[i];
            eventDispatcher({
                element:x,
                event:"focusout"
            })
        })
        //
    })
)
.subscribe()
//


// create  product resource
let {ryber}= this
of({})
.pipe(
    delay(1000),
    tap(()=>{
        let createButton=
            document
            .querySelector("app-inventory")!
            .shadowRoot!
            .querySelector(".a_p_p_InventoryPod0Button2")

        eventDispatcher({
            element:createButton  as HTMLButtonElement ,
            event:"click"
        })
    }),
    delay(1000),
    tap(()=>{

        let myValues = [
            faker.commerce.productName(),
            faker.commerce.price(),
            "",
            faker.commerce.productDescription(),
            Math.floor(Math.random()*100)
        ]
        document
        .querySelector("app-inventory")!
        .shadowRoot!
        .querySelectorAll(".a_p_p_InventoryPod3Input0")
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


//

//

of({})
.pipe(
    delay(1000),
    tap(
        ()=>{
            let row = Math.floor(Math.random()*6);


            // let buttonArray = [cart0Button,shipping0Button,billing0Button,modify0Button]
            let buttonArray = Array(1).fill(null)
            .map((x: HTMLButtonElement,i=4)=>{

                return document
                .querySelector("app-inventory")!
                .shadowRoot!
                .querySelector(`main >
                section.a_p_p_InventoryPod2 >
                div:nth-child(${i+5}) > div > div:nth-child(${row}) > button`)

            })
            eventDispatcher({
                element:buttonArray[3] as HTMLButtonElement,
                event:"click"
            })
        }
    )
)
.subscribe()
//
