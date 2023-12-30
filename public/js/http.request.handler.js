const httpRequestSender = (url, requestInfos) => {
 return fetch(url, requestInfos)
  .then(res => {
   if (!res.ok) {
    throw new Error("Action has failed")
   } else {
    return res.json();
   }
  })
  .catch(err => console.log(err.stack));
}