import { MonoTypeOperatorFunction } from "rxjs"
export type InventoryTable ={
    [k:string]:any,
    searchBy:{
        placeholder:{
            text:string
        },
        options:{
            items:Array<{
                text:string,
                click:()=>void,
                style:{},
                stateText:string
            }>
        },
        icon:{
            click:()=> void
        }
    },
    search:{
        label:{
            text:string
        },
        button:{
            text:string,
            click:()=> void
        },
        query:{
            input:{
                value:string
            },
            state:string
        },
        reset:{
            click:()=>void
        }
    },
    pages:{
        per:{
            input:{
                value:string,
                focusout:()=> void
            },
            label:{
                text:string
            }
        },
        list:{
            retrieved:Set<number>,
            pipeFns:[
                MonoTypeOperatorFunction<any>
            ]

        },
        current:{
            input:{
                value:string,
                disabled:boolean,
                onAdd:()=>void,
                onMinus:()=>void,
                range:{
                    max:number,
                    min:number
                }
            },

            lastPageSet:boolean,
            setLastPage:({max,lastResultSize})=>void
        }
    },
    headers:{
        items:{
            title:{
                text:string
            },
            sort:{
                confirm:boolean
            },
            view:{
                subProp:string,
                text:string,
                type:string
            }
        }[]
    },
    details:{
        view:{
            style:{ [klass: string]: any; }
        },
        close:{
            click:()=>void
        },
        [k:string]:any,
        update:{
            url:string,
            method:string,
            loading:{
                view:{
                    [k:string]:any,
                    style:{[k:string]:any}
                }
            }
            pullValues:({
                target:InventoryTableDetailsUpdatePullValuesTarget
            })=>InventoryTableDetailsUpdatePullValuesReturn,
            click:()=> void,
            clickAux:()=> InventoryTableDetailsUpdateClickAuxReturn,
        },
        delete:{
            url:string,
            method:string,
            click:()=> void
        }
        values:{
            [k:string]:any,
            state:"view"|"edit" |"create",
            target:{
                [k:string]:{
                    [k:string]:any
                }
            }
        },
    },
    util:{
        mock:{
            general:{
                fn:()=>any
            },
            update:{
                confirm:boolean
            },
            delete:{
                confirm:boolean
            },
            create:{
                confirm:boolean
            }
        },
        keyvaluePipe:{
            unsorted:()=> any
        },
        listItems:()=>any,
        customInteractMods:({key:string,item:any})=> any,
        metaForEntry:({entry:InventoryTableUtilMetaForEntryEntry}) => any
    }
}

export type InventoryTableDetailsUpdatePullValuesTarget={
    [k:string]:{
        input:{
            value:string|number
        }
    }
}

export type InventoryTableUtilMetaForEntryEntry ={
    [k:string]:any
}

export type InventoryTableDetailsUpdatePullValuesReturn={
    [k:string]:string|number
}


export type InventoryTableDetailsUpdateClickAuxReturn ={
    body:any
}
