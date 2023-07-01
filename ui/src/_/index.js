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

const _ = {
    getInitials,
    getSave
}

export default _