export async function registerServiceWorker(){
    if(!("serviceWorker" in navigator)){
        throw Error("Las notificaciones no son soportadas por este navegador")
    }
    await navigator.serviceWorker.register("/sw_notificaciones.js");
}


export async function getReadyServiceWorker(){
    if(!("serviceWorker" in navigator)){
        throw Error("Las notificaciones no son soportadas por este navegador")
    }
    return navigator.serviceWorker.ready;
}