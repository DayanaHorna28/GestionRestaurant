import Configuration from "./config"
import util from "./js/util"
import axios from "axios"

const conf=Configuration.getConfiguration()

const headers = {"Content-Type":"application/json;charset=UTF-8", "clientAuth":conf.CLIENT_AUTH, "client":conf.CLIENT_CODE}

const ServerConnection = (() => {



    const getGamesTypes = (clientid)=>{
         let mode = "wb";
        return new Promise( (result, reject)=>{
        fetch(`${conf.API_GAMES_NODE}/lobby/gameTypesByClient?cat=slot&type=${mode}&client=${clientid}`,  {method:"GET",headers} )
        .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        } )
        //https://lobby-test.apiusoft.com/gameTypes?c=slot
    }
    
    const authInGame = (agregatorToken) =>{
        return new Promise( (result, reject)=>{
            fetch(conf.API+`/authInGame/${agregatorToken}`,{method:"GET",headers})
            .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        })
    }

    const login = (username,password)=>{
        return new Promise( (result, reject)=>{
            let payload = {
                "username":username,
                "password":password
            }
            //fetch( BACKEND,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:payload } )
            fetch(conf.API+"/login",{method:"POST",headers, body: JSON.stringify(payload) })
            .then(async(response) => { if(response.status!=200) throw await response.json(); else return response;})
            .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{  console.log("eeee", e); reject(e) } )
        })
    };

    const saveMyAccount =(user) =>{
        console.log(user);
        var payload = user;
        var user_storage = JSON.parse(sessionStorage.getItem("user" )) 
        payload.token= user_storage.token;
        payload.agregatorToken = user_storage.agregatorToken;
        return new Promise( (result, reject)=>{
            fetch(conf.API+"/user/myAccount",{method:"POST",headers, body:JSON.stringify(payload)} )
            .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        } )
    };

    const getMyAccount = (userToken)=>{
        return new Promise( (result, reject)=>{
            fetch( conf.API+"/myaccount/"+userToken,{method:"GET" } )
            .then(response => response.json())
            //.then( data =>{result(data)}) 
            .then( data =>{ if(data.errorCode){ checkReject(data).then(r=> reject(r) ) } else result(data)})   
            .catch( (e)=>{ reject(e) } )
            //setTimeout(()=>{ result( {token:'123456789qwerty'} ) },1000);
        })
    }

    const getPaymethods = (userToken)=>{
        return new Promise( (result, reject)=>{
            fetch( conf.API+"/paymethods/"+userToken,{method:"GET" } )
            .then(response => response.json())
            //.then( data =>{result(data)})  
            .then( data =>{ if(data.errorCode){ reject(data) } else result(data)})    
            .catch( (e)=>{ reject(e) } )
        })
    }
    const getPayLink = (token, amount, type)=>{
        return new Promise( (result, reject)=>{
            fetch( conf.API+"/getpaylink/", {method:"POST",headers, body:JSON.stringify({token, amount, type})}  )
            .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        })
    }

    const withdrawal= (token, amount, bank, account, info)=>{
        return new Promise( (result, reject)=>{
            let payload = {token, amount, bank, account, info}
            fetch(conf.API+"/withdrawal",{method:"POST",headers, body: JSON.stringify(payload) })
            .then(response => response.json())
            .then( data =>{ if(data.errorCode){ reject(data) } else result(data)})    
            .catch( (e)=>{ reject(e) } )
        })
    }

    const bankDeposit=(token,bankDeposit )=>{
        return new Promise( (result, reject)=>{
            let payload = {...bankDeposit, token}
            fetch(conf.API+"/wallet/bankDeposit",{method:"POST",headers, body: JSON.stringify(payload) })
            .then(response => response.json())
            .then( data =>{ if(data.errorCode){ reject(data) } else result(data)})    
            .catch( (e)=>{ reject(e) } )
        })
    }

    const changePassword = (userToken, newPassword, oldpass)=>{
        return new Promise( (result, reject)=>{
            let payload = {
                userToken,
                newPassword,
                oldpass
            }
            //fetch( BACKEND,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:payload } )
            fetch(conf.API+"/changepassword",{method:"POST",headers, body: JSON.stringify(payload) })
            .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        })
    }

    const sendPassword = (email)=>{
        return new Promise( (result, reject)=>{
            let payload ={email};
            fetch(conf.API+"/sendPassword",{method:"POST",headers, body:JSON.stringify(payload) } )
            .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
            //setTimeout(()=>{ result( {token:userToken}) },1000);
        })
    }

    const gameTypes = ()=>{
         let mode = "wb";
        return new Promise( (result, reject)=>{
        fetch(conf.API+`/gameTypes?c=slot&m=${mode}`,  {method:"GET",headers} )
        .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        } )
        //https://lobby-test.apiusoft.com/gameTypes?c=slot
    }
    const getBrandList=(category)=>{
        let url = conf.API + `/brands?m=wb`;
        url += category != "all" ? "&c="+category : "" 
        //https://lobby-test.apiusoft.com/brands?c=slot
        return new Promise( (result, reject)=>{ fetch(url, {method:"GET",headers} )
            .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        } )
    }

    const getGameList=(category, section, page=1, currency='USD', xpage=20)=>{
        let trashcode = "";
        if ( typeof section =='object' && section.brand && section.brand =='DROPS & WINS') {
            trashcode = 'DROP';
        }else if (typeof section =='object' && section.brand && section.brand =='JUEGOS POPULARES'){
            trashcode = 'POP';
        }
        console.log("sectiosectionsectionn",section);
        let mode = "wb";
        let url=conf.API+`/games?c=${category}&m=${mode}&page=${page}&xpage=${xpage}&curr=${currency}`;
        if( typeof section =='object' && section.brand && section.brand != "DROPS & WINS" && section.brand != "JUEGOS POPULARES"  ) url += `&b=${section.brand}`;
        else if( typeof section =='object' && section.search ) url += `&g=${section.search}`;
        else if(section=="TOP") url += `&o=200000`;
        else if(section=="POP" || trashcode == 'POP') url += `&o=100000`;
        else if(section=="NEW") url += `&n=true`;
        else if( /BACC|RLIV|BJLIV|MWLIV|LOTTO|SICBO|TVLIV|DROP|CLASS|RULE|TABL|MEGA|FAST/.test(section)) url += `&t=${section}`; 
        else if(trashcode == 'DROP'){
            url += `&t=${"DROP"}`; 
        }
        return new Promise( (result, reject)=>{
            fetch(url, {method:"GET",headers} )
        .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        } )
    }

    const getBalance=(userToken)=>{
        return new Promise( (result, reject)=>{
            fetch(conf.API+`/balance/${userToken}`,{method:"GET",headers})
            .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        })
    }
    const getURLNovus=(url)=>{
        return new Promise( (result, reject)=>{
            fetch(url,{method:"GET",headers})
            .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        })
    }

    const getFavGames =(userToken, category) =>{
          let mode = "wb";
        var url=conf.API+"/favs";
        url += `?c=${category}&m=${mode}&t=${userToken}`
        return new Promise( (result, reject)=>{
            fetch(url,{method:"GET",headers} )
        .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        } )
    }

    const saveFav =(userToken, gameId, action) =>{
        var url=conf.API+"/saveFavs";
        var payload = {action,g:gameId,t:userToken}
        return new Promise( (result, reject)=>{
            fetch(url,{method:"POST",headers, body:JSON.stringify(payload)} )
        .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        } )
    }

    const register = (username, name,codephone, phone, email, password, date, operatorId,smscode, currency=conf.currency)=>{
        //TODO: fecha de nacimiento
        //TODO: operataorId para Golden Debe Venir
        
        var url=conf.API+"/user";
        var payload = {username, name, phone:codephone+phone, email, currency, password, date, smscode,country:conf.country, operatorId, doctype:"", document:"", birthday:date, domain:conf.domain, usertype:"X", org:conf.org}
        return new Promise( (result, reject)=>{
            fetch(url,{method:"POST",headers, body:JSON.stringify(payload)} )
        .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        } )
    }

    const getMovements = (token, dateStringFrom, dateStringTo, filter)=>{
        return new Promise( (result, reject)=>{
            fetch(conf.API+`/wallet/${token}/${dateStringFrom}/${dateStringTo}/${filter}/movements`,{method:"GET"})
            .then(response => response.json())
            .then( data =>{ if(data.errorCode){ checkReject(data).then(r=> reject(r) ) } else result(data)})    
            .catch( (e)=>{ reject(e) } )
        })
    }

    const checkReject=(data)=>{
       return new Promise( (result, reject) =>{
        if(data.errorCode!='OLD_TOKEN' ) result(data)
        else{
            alert("SESION ABIERTA EN OTRO DISPOSITIVO");
            sessionStorage.removeItem("user");
            location.reload();
            return;
        }
       })
    }

    const uploadFile = (fileName, base64file) => {
        var url=conf.API+"/uploadFile";
        var payload = {fileName, base64file}
        return new Promise( (result, reject)=>{
            fetch(url,{method:"POST",headers, body:JSON.stringify(payload)} )
            .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        } )
    }
    const user={
        preRegister:(username, email,codephone, phone)=>{
            var url=conf.API+"/user/preRegister";
            var payload = {username,email,phone:codephone+phone, org: conf.org}
            return axios.post( url,payload,{headers} );
            
            /*return new Promise( (result, reject)=>{
                fetch(url,{method:"POST",headers, body:JSON.stringify(payload)} )
                .then(response => response.json())
                .then( data =>{result(data)})   
                .catch( (e)=>{ reject(e) } )
            } )*/
        }
    }
    const wallet = {
        checkPreviewWithdrawal:(token)=>{
            return new Promise( (result, reject)=>{
                fetch(conf.API+`/checkRetailWithdrawal/${token}`,{method:"GET"})
                .then(response => response.json())
                .then( data =>{ if(data.errorCode){ checkReject(data).then(r=> reject(r) ) } else result(data)})    
                .catch( (e)=>{ reject(e) } )
            })
        },
        retailWithdrawal:(token, amount)=>{
            var url=conf.API+"/retailWithdrawal";
        var payload = {token, amount}
        return new Promise( (result, reject)=>{
            fetch(url,{method:"POST",headers, body:JSON.stringify(payload)} )
            .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        } )
        },
        depositRetail:(token, cod)=>{
            var url=conf.API+"/wallet/depositRetail";
        var payload = {token, cod}
        return new Promise( (result, reject)=>{
            fetch(url,{method:"POST",headers, body:JSON.stringify(payload)} )
            .then(response => response.json())
            .then( data =>{result(data)})   
            .catch( (e)=>{ reject(e) } )
        } )
        }

    }
   
    return {
        wallet, user,
        getMovements,getGamesTypes, uploadFile, bankDeposit, withdrawal, getPaymethods, getPayLink, register,login, getGameList,getMyAccount,changePassword,sendPassword, gameTypes, getBrandList, getFavGames, saveFav, authInGame, getBalance,getURLNovus, saveMyAccount
    }
    
})()

export default ServerConnection