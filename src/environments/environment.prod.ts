export const environment = {
    production: true,
    startURL:"/",
    backend:{
        url: "https://windmillcode-site.herokuapp.com",
    },
    logging:{
        url:"http://127.0.0.1:6111"
    },
    testing:{
        confirm:false
    },
    mock:{
        general:{
            fn:()=>{
                alert("There was an error please try again later")
            }
        },
        adminDeleteUser:{
            confirm:true
        }
    }
};
