import { MonoTypeOperatorFunction,OperatorFunction, Subject } from "rxjs"
export type InventoryTable ={

    db:{
        displayItems:any[],
        items:any[],
        xhrItems:Subject<any>
    },
    details:{
        close:{
            click:()=>void
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
        values:{
            meta:any,
            state:"view"|"edit" |"create" | "img",
            target:{
                [k:string]:{
                    [k:string]:{
                        input:{
                            value:string|number
                        }
                    }
                }
            }
        },
        view:{
            style:{ [klass: string]: any; }
        },
    },
    headers:{
        items:{
            title:{
                text:string
            },
            sort:{
                confirm:boolean,
                down:{click:()=>void},
                up:{click:()=>void}
            },
            view:{
                subProp:string,
                text:string,
                type:string
            }
        }[]
    },
    pages:{
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
            setLastPage:(devObj:{max:number,lastResultSize:number})=>void
        },
        list:{
            retrieved:Set<number>,
            pipeFns:[
                MonoTypeOperatorFunction<any>
            ]

        },
        per:{
            input:{
                value:string,
                focusout:()=> void
            },
            label:{
                text:string
            }
        },
    },
    search:{
        button:{
            text:string,
            click:()=> void
        },
        label:{
            text:string
        },
        query:{
            input:{
                value:string
            },
            state:string
        },
        reset:{
            text:string,
            click:()=>void
        }
    },
    searchBy:{
        icon:{
            click:()=> void
        },
        options:{
            items:Array<{
                text:string,
                click:()=>void,
                style:{},
                stateText:string
            }>
        },
        placeholder:{
            text:string
        },
    },
    util:{
        customInteractMods:({key:string,item:any})=> any,
        keyvaluePipe:{
            unsorted:()=> any
        },
        listItems:()=>any,
        metaForEntry:({entry:InventoryTableUtilMetaForEntryEntry}) => any,
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
        modifyResorucePipeFns:(devObj:{
            resource:InventoryTableUtilModifyResorucePipeFnsResource,
            action:string | "create"| "update"|"delete"
        }) => [
            MonoTypeOperatorFunction<{}>,
            MonoTypeOperatorFunction<{}> ,
            OperatorFunction<{}, Object | {}>,
            MonoTypeOperatorFunction<{}>
        ],
        pullValues:({
            target:InventoryTableUtilPullValuesTarget
        })=>InventoryTableUtilPullValuesReturn,
        toInputInPlace:({myResult:any})=> InventoryTableUtilToInputInPlaceReturn,

    },

}

export type InventoryTableDevObj= {
    db: {
        items: never[];
        displayItems: never[];
        readonly xhrItems?:Subject<any>
    },
    details:{
        create:{
            loading: any;
            url: string;
            method: string;
            confirm: {
                text: string;
                clickAux: () => any;
            },
            request:{
                text: string;
                clickAux: () => any;
            }

        },
        update: {
            text: string;
            loading: any;
            url: string;
            method: string;
            clickAux: () => any;
        },
        delete: {
            text: string;
            loading: any;
            url: string;
            method: string;
            clickAux: () => {
                body: {
                    data: {
                        orderId: any;
                    };
                };
            };
        },
        readonly values?:{
            meta:any,
            state:"view"|"edit" |"create",
            target:{
                [k:string]:{
                    [k:string]:{
                        input:{
                            value:string|number
                        }
                    }
                }
            }
        },

    },
    headers: {
        items: {
            title: {
                text: string;
            };
            sort: {
                confirm: boolean;
            };
            view: {
                subProp: string;
                text: string;
                type: string;
            };
        }[];
    },
    pages: {
        per: {
            input: {
                value: any ;
            };
            label: {
                text: string;
            };
        };
        readonly list?:{
            retrieved:Set<number>,
            pipeFns:[
                MonoTypeOperatorFunction<any>
            ]

        }
        current: {
            input: {
                value: string | number | any;
            };
        };
    },
    search: {
        label: {
            text: string;
        };
        button: {
            text: string;
        };
        reset: {
            text: string;
        };
    },
    searchBy: {
        placeholder: {
            text: string;
        };
        options: {
            items: {
                text: string;
                style: {};
                stateText: string;
            }[];
        };
        icon: {};
    },
    util:{
        customInteractMods:({key:string,item:any})=> any,
        listItems:()=>any,
        metaForEntry:({entry:InventoryTableUtilMetaForEntryEntry}) => any,
        readonly toInputInPlace?:({myResult:any})=> InventoryTableUtilToInputInPlaceReturn,



    },

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

export type InventoryTableDetailsCreateRequestClickAuxReturn = InventoryTableUtilToInputInPlaceReturn


export type InventoryTableUtilPullValuesTarget={
    [k:string]:{
        input:{
            value:string|number
        }
    }
}




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



