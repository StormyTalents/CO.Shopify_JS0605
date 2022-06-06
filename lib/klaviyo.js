export async function signUp(data) {
    const url = 'https://a.klaviyo.com/api/v2/list/PuccGZ/subscribe?api_key=pk_a6470fad0ade3d42ee3db8023d4ecd5db0';
  
    const options = {
      method: 'POST',
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        profiles: [
            {email: data}
        ]
        })
    };
  
    try {
      const data = await fetch(url, options).then((response) =>
        response.json(),
      );
      return data;
    } catch (error) {
      throw new Error("Could not fetch klavio!");
    }
  }

  export async function sendBackInStock(email,varId) {
console.log(email)
    const url = 'https://a.klaviyo.com/api/v1/catalog/subscribe';
  
    const options = {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body:`a=PtsWTL&email=${email}&variant=${varId}&platform=shopify`
    };
  
    try {
      const data = await fetch(url, options).then((response) =>
        response.json(),
      );
      return data;
    } catch (error) {
      throw new Error("Could not fetch klavio!");
    }
  }