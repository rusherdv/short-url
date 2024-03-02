import React, { useEffect, useState } from 'react'
import useReducerApp from '../helpers/store'
import showNotification from '../helpers/notification';

const Create = () => {

    const [state,dispatch] = useReducerApp();
    const [url, seturl] = useState('');
    const [openUrls, setOpenUrls] = useState({});
  
    const addUrl = async (e) => {
      e.preventDefault()
      try {
        const validUrl = new URL(url);
        seturl('')  
        dispatch({ type: "ADD", data: url });
      } catch (error) {
        showNotification('Invalid URL', 'error')
      }
    }

    const toggleUrlVisibility = (index) => {
      setOpenUrls((prevOpenUrls) => ({
        ...prevOpenUrls,
        [index]: !prevOpenUrls[index]
      }));
    }
  

    const cleanUrls = () => {
      localStorage.removeItem('urls');
      dispatch({ type: "LOAD" });
    }

    const copyToClipboard = (url) => {
      const elementoTemporal = document.createElement("textarea");
      elementoTemporal.value = url;
      document.body.appendChild(elementoTemporal);
      elementoTemporal.select();
      document.execCommand("copy");
      document.body.removeChild(elementoTemporal);
      showNotification('Copied to clipboard', 'success')
    };

    useEffect(() => {
      dispatch({ type: "LOAD" });
    }, []);

    return (
    <div className='h-screen w-full bg-[#111] flex flex-col justify-center items-center shadow-2xl'>
      <h1 className='text-gray-500 inter600 text-4xl mb-5'>short<span className='inter900'>URL</span></h1>
      <div className='w-[500px] h-[700px] bg-[#222] rounded-md flex justify-start items-center flex-col overflow-y-auto pb-5 scroll-container'>
        <form onSubmit={addUrl} className='w-full flex justify-center flex-col items-center mt-6'>
          <input value={url} onChange={(e) => seturl(e.target.value)} placeholder='Type a valid URL...' type="text" className='border-gray-500 bg-transparent border-2 rounded-md text-white inter400 w-11/12 h-12 pl-4 pr-4' />
          <button type='submit' className='w-11/12 border-2 border-gray-500 h-10 mt-2 rounded-md text-gray-400 hover:bg-gray-900 inter600'>Add</button>
        </form>

        {
          state.items.length != 0 && (
            <div className='w-10/12 bg-gray-500 h-[1px] mt-3'>.</div>
          )
        }

        {state?.items.map((item, index) => (
          <div className='border-2 border-gray-500 rounded-md w-11/12 mt-3 p-4 pb-3 text-white relative inter400' key={crypto.randomUUID()}>
            <p className='truncate text-gray-400'>URL: <a href={item.url} title={item.url} target="_blank" className='truncate hover:underline'>{item.url}</a></p>
            <p className='text-gray-400'>ShortURL: <a className='inter600 hover:underline text-gray-300' href={`${window.location.href}${item.shortUrl}`} target='_blank'>{window.location.href}{item.shortUrl}</a></p>
            <p className='text-gray-400'>Views: {item.views}</p>
            <div onClick={() => copyToClipboard(`${window.location.href}${item.shortUrl}`)} className='ml-2 border-2 p-1.5 rounded-md absolute border-gray-500 bottom-2 right-2 hover:bg-gray-700 hover:cursor-pointer'>
              <svg width={12} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="#ffffff" d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/>
              </svg>
            </div>
            {item.ips.length > 0 && (
              <>
              {openUrls[index] ? 
              <div className='text-gray-400 flex items-start'>
                <p className='mr-1'>IPS:</p>
                {item.ips.map((ip, idx) => (
                    <p key={idx}>{idx > 0 && ','} {ip}</p>
                  ))
                }
              </div>
              :
              <></>
              }
                <p className='text-gray-300 text-xs mt-1 hover:underline hover:cursor-pointer' onClick={() => toggleUrlVisibility(index)}>
                  {openUrls[index] ? 'View less' : 'View more'}
                </p>
              </>
            )}
          </div>
        ))}

        {
          state.items.length != 0 && (
            <button onClick={cleanUrls} className='w-11/12 h-10 mt-2 rounded-md bg-gray-500 text-black hover:bg-gray-600 inter600'>Clean</button>
          )
        }
      </div>
      <div onClick={() => window.location.reload()} className='bg-[#222] text-white hover:cursor-pointer hover:bg-white hover:text-[#222] transition-all w-20 rounded-br-md rounded-bl-md flex justify-center items-center h-8 shadow-md'>
        <p className='inter600 text-sm'>reload</p>
      </div>
    </div>
    )
}

export default Create