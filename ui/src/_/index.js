import Cookies from 'js-cookie'

const getInitials = (name) => {
  const words = name.split(' ');
  
  if (words.length === 1) {
    if (words[0].length === 1) {
      return words[0].toUpperCase();
    } else {
      return words[0].substring(0, 2).toUpperCase();
    }
  } else {
    const firstInitials = words.slice(0, 2).map(word => word.charAt(0).toUpperCase());
    return firstInitials.join('');
  }
}

const getSave = ()=>{
  try {
    return JSON.parse(Cookies.get("save"))
  }catch{
    return {}
  }

}

const auth = ()=>{
  if(window.location.pathname.startsWith('/login')){
    if(Cookies.get('save')){
      window.location.href = (()=>{
        return new URLSearchParams(window.location.search).get('redirect') || '/home'
      })()
    } 
  }else{
    if(!Cookies.get('save')){
      window.location.href = `/login?redirect=${window.location.pathname}`
    }
  }
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^\d{10}$/

const _ = {
    getInitials,
    getSave,
    auth,
    emailRegex,
    phoneRegex
}

export default _