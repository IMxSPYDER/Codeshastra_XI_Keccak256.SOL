import React from 'react'
import img1 from '../assets/img.png'
import Button from './Button'
import bars from '../assets/bars.png'

const Landing = ({theme}) => {
  return (
    <div className={`flex justify-around items-center mt-10 min-h-screen ${theme === "dark" ? "text-white" : "text-black"}`}>
        {/* <img src={bars} alt="" className='absolute top-0 w-full opacity-5 bg-no-repeat' /> */}
    <div className='flex flex-col md:flex-row items-center  justify-center md:w-11/12 w-full'>
        <div className='md:w-1/2 md:gap-5 h-full w-full px-20 flex flex-col gap-10 justify-center'>
        <small className={` text-lg ${theme === "dark" ? "text-white" : "text-black"}`}>Empowering Digital Identity in a Decentralized World</small>
        <h1 className='text-6xl font-bold'><span className='text-blue-400'>VoteSphere</span> Empowering Trust</h1>
        <p className={`text-sx w-full ${theme === "dark" ? "text-white" : "text-black"}`}>VoteSphere is a decentralized voting platform using blockchain, zero-knowledge proofs, and smart contracts to enable secure, private and verifiable elections — without exposing voter identity or preferences.</p>
        <div className='text-sx flex flex-row gap-10'>
            <div>
                <p className='mb-4'><span className='text-green-500'>✔</span> Unmatched Privacy</p>
                <p className='mb-4'><span className='text-green-500'>✔</span> Geo-Secure Participation</p>
            </div>
            <div>
                <p className='mb-4'><span className='text-green-500'>✔</span> Instant Transparency</p>
                <p className='mb-4'><span className='text-green-500'>✔</span> Versatile Voting</p>
            </div>
        </div>
        {/* <Button  text = {"Get Connected"}/> */}
        </div>

        <div className='md:w-1/2 w-full md:m-0 mt-10 flex items-center justify-center '>
            <img src={img1}  alt="" />
        </div>
    </div>
    </div>
  )
}

export default Landing