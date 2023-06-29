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

const _ = {
    getInitials
}

export default _