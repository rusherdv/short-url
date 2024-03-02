import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import useReducerApp from '../helpers/store';
import { getIP } from '../helpers/actions';


const Redirect = () => {
    const [state, dispatch] = useReducerApp();
    const params = useParams()

    useEffect(() => {
      const getRedirect = async () => {
        const data = localStorage.getItem("urls") ?? "[]";
        if (data) {
          const items = JSON.parse(data);
          const id = params.id;
          const item = items.find((i) => i.shortUrl === id);
          if (item) {
            dispatch({ type: "LOAD" });
            try {
              const ip = await getIP();
              dispatch({ type: "ADD_VIEW", data: id, ip });
              setTimeout(() => {
                window.location.href = item.url
              }, 100);
            } catch (error) {
              console.error('Error al obtener la IP:', error);
            }
          }
        }
      };
      getRedirect();
    }, []);
    

    useEffect(() => {}, [state]);

    return (
    <div></div>
  )
}

export default Redirect