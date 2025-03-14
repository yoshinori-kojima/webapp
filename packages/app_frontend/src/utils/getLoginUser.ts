import { users } from '../../../shared/src/data/db/models/init-models';

export const getLoginUser = async () : Promise<users | undefined>  => {
  try{
    //const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //const response = await fetch(`${apiUrl}/login/user`, {
    let ret : users | undefined = undefined;
    const response = await fetch('/api/login/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'credentials': 'include' // クッキーを含めるために必要
        //'authorization': `${token}`
      },
    }).then(response => {
      if(response.status === 200){
        return response.json();
      }else{
        return undefined;
      }
    }).catch((e: DOMException) => {
      alert("error:getLoginUser" + ":" + e.message);
      return undefined;
    });
    ret = await response.data?.users;
    return ret;
  }catch(e){
    return undefined;
  }
};
