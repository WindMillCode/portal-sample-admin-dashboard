export  function mediaPrefix(devObj){
    let {media} = devObj
    return "./assets/media/"+media
}

export function numberParse(   devObj:any  ){
    // string or array
    let {dim} = devObj
    if(typeof dim === "string"){
        return parseFloat(dim.split("p")[0])
    }
    else{
        return dim
        .map((x:any,i)=>{
            return parseFloat(x.split("p")[0])
        })
    }
}

export function classPrefix(devObj:{view:string}){
    let {view} = devObj
    let prefix = "a_p_p_"+view
    return (devObj:{val:string})=>{
        let {val} = devObj
        return prefix+val
    }
}

export function eventDispatcher(   devObj:{event:string,element:HTMLElement | Window | Element}   ){

    try {
        let event0= new Event(devObj.event)
        devObj.element.dispatchEvent(event0)
        // console.log(event0)
    }
    catch(e){
        let eventLegacy = document.createEvent("Event");
        eventLegacy.initEvent(devObj.event, false, true);
        devObj.element.dispatchEvent(eventLegacy)
    }
}


export class LinkedList{

    constructor(startVal:any){
        this._head.val = startVal;
        (this.list as any) = this._head
    }

    addNode= (devObj)=>{
        let {val} = devObj
        ;(this.list as any).next = {
            val,
            next:null
        }
        this.list =  (this.list as any).next
    }

    head= ()=>{
        return this._head
    }



    _head= {
        val:null,
        next:null
    }

    list= null
}


type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?:
            Required<Pick<T, K>>
            & Partial<Record<Exclude<Keys, K>, undefined>>
    }[Keys]

type SamePropTypeOnly<T> = {
    [P: string]: T;
}
