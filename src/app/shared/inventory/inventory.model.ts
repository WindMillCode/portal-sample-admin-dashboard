import { MonoTypeOperatorFunction,OperatorFunction } from "rxjs"
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
            text:string,
            url:string,
            method:string,
            loading:{
                view:{
                    [k:string]:any,
                    style:{[k:string]:any}
                }
            }
            click:()=> void,
            clickAux:()=> InventoryTableDetailsUpdateClickAuxReturn,
        },
        delete:{
            text:string,
            loading:{
                view:{
                    [k:string]:any,
                    style:{[k:string]:any}
                }
            },
            url:string,
            method:string,
            click:()=> void,
            clickAux:()=> InventoryTableDetailsUpdateClickAuxReturn
        },
        create:{
            loading:{
                view:{
                    [k:string]:any,
                    style:{[k:string]:any}
                }
            },
            request:{
                text:string,
                click:()=>void,
                clickAux:()=>InventoryTableDetailsCreateRequestClickAuxReturn
            },
            confirm:{
                text:string,
                click:()=>void,
                clickAux:()=>InventoryTableDetailsCreateConfirmClickAuxReturn
            },
            url:string,
            method:string,
        },
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
        pullValues:({
            target:InventoryTableUtilPullValuesTarget
        })=>InventoryTableUtilPullValuesReturn,
        toInputInPlace:({myResult:any})=> InventoryTableUtilToInputInPlaceReturn,
        modifyResorucePipeFns:(devObj:{
            resource:InventoryTableUtilModifyResorucePipeFnsResource,
            action:string | "create"| "update"|"delete"
        }) => [
            MonoTypeOperatorFunction<{}>,
            MonoTypeOperatorFunction<{}> ,
            OperatorFunction<{}, Object | {}>,
            MonoTypeOperatorFunction<{}>
        ]
        keyvaluePipe:{
            unsorted:()=> any
        },
        listItems:()=>any,
        customInteractMods:({key:string,item:any})=> any,
        metaForEntry:({entry:InventoryTableUtilMetaForEntryEntry}) => any
    }
}


export type InventoryTableUtilToInputInPlaceReturn = {
    [k:string] :{
        [k:string]:{
            input:{
                value:string|number
            }
        }
    }
}
export type InventoryTableUtilPullValuesTarget={
    [k:string]:{
        input:{
            value:string|number
        }
    }
}
export type InventoryTableDetailsCreateRequestClickAuxReturn = InventoryTableUtilPullValuesTarget


export type InventoryTableUtilMetaForEntryEntry ={
    [k:string]:any
}

export type InventoryTableUtilPullValuesReturn={
    [k:string]:string|number
}

export type InventoryTableDetailsDeleteClickAuxReturn = InventoryTableDetailsUpdateClickAuxReturn
export type InventoryTableUtilModifyResorucePipeFnsResource = InventoryTableDetailsUpdateClickAuxReturn

export type InventoryTableDetailsUpdateClickAuxReturn ={
    body:any
}
export type InventoryTableDetailsCreateConfirmClickAuxReturn =InventoryTableDetailsUpdateClickAuxReturn



