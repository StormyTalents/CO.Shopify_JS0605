export function getURL(type, handle, blogCat, customUrl) { 
  
    let mainHandle
    
    if (handle == undefined && customUrl == undefined) {
        handle = "#"
    }
    
    if(type == "menuItem") {
        handle = customUrl
    }

    switch(type) {
      case "blog":
        mainHandle = `/blogs/${blogCat}/`;
      break;
      case "blogCategories":
        mainHandle = `/blogs/`;
      break;
      case "blogGroupOfCategories":
        mainHandle = `/blogs/`;
      break;
      case "collections":
        mainHandle = "/collections/";
      break;
      case "product":
        mainHandle = "/products/";
      break;
      case "page":
        mainHandle = "/pages/";
      break;
      case "menuItem":
        mainHandle = "";
      break;
      default:
        mainHandle = "/";
    }

    return(mainHandle+""+handle)
  }
