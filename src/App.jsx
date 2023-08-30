import { useState, useEffect, useRef } from 'react'

import './App.css'

function App() {
  const canvasRef = useRef();
  const contextRef = useRef();
  const scrollTopRef = useRef();
  const totalFrames = 662;
  useEffect(() =>{
      contextRef.current = canvasRef?.current?.getContext('2d');
      const img = new Image();
      img.src = './src/assets/0001.jpg'
      
      img.onload = () => {
        canvasRef.current.width = window.innerWidth*0.99;
        canvasRef.current.height = window.innerHeight;
        contextRef.current.drawImage(
          img, 
          0, 
          0, 
          canvasRef.current.width,
          canvasRef.current.height
          );
      }

      const getImageName = (index) => 
        `./src/assets/${index.toString().padStart(4,"0")}.jpg`
      

      const preLoadImages = () => {
        const imageLoadedPromises = [];
        for(let i=1; i < totalFrames; i++){
          const img = new Image()
          const imgLoadPromise = new Promise((resolve, reject) =>{
            img.onload = () => resolve(img)
            img.onerror = reject(`${i} Somthing went wrong`);
          });
          imageLoadedPromises.push(imgLoadPromise)
          img.src =  getImageName(i)
        }
        return Promise.all(imageLoadedPromises)
      }
      const updateImage = (index) => {
        img.src = getImageName(index);
        contextRef.current.drawImage(
          img, 
          0, 
          0, 
          canvasRef.current.width,
          canvasRef.current.height
          );
      }
    const handleScroll= (e) => {
      scrollTopRef.current = document.documentElement.scrollTop;
      const maxScrollDistance = document.documentElement.scrollHeight - window.innerHeight;
      const fractionScrolled = scrollTopRef.current/(maxScrollDistance);

      const imageIndex= Math.min(totalFrames, Math.ceil(fractionScrolled * totalFrames));
      imageIndex > 0 && requestAnimationFrame(() => updateImage(imageIndex))
    }
    window.addEventListener("scroll",handleScroll);
    preLoadImages();
    return () => {
      window.removeEventListener("scroll",handleScroll)
    }
  },[] )
  return (
    <>
        <main id={"main"}>
        <section className={"section-container"}>
          <div className="hero">
            <h2 className="hero-text">Wanna see a cute puppy?</h2>
          </div>
        </section>
        <section className={"section-container"}>
          <div className={"canvas-container"}>
            <canvas ref={canvasRef} id="scroll-canvas" />
          </div>
        </section>
        <section className={"section-container"}>
          <div className="hero">
            <h1 className="hero-text">Wow that puppy was so cute!!</h1>
            <h2>Scroll back up to play it in reverse</h2>
          </div>
        </section>
      </main>
    </>
  )
}

export default App
