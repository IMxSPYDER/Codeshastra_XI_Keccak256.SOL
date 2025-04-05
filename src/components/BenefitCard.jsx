import img1 from '../assets/1.png'
import img2 from '../assets/2.png'
import img3 from '../assets/3.png'
import img4 from '../assets/4.png'
import img5 from '../assets/5.png'
import img6 from '../assets/6.png'

const benefits = [
  {
    icon: img1,
    title: " Geo-Fenced Voting Access",
    description: "Enable or restrict voting based on users' physical or IP location — ideal for local elections, community decisions, and region-specific governance."
  },
  {
    icon: img2,
    title: "Zero-Knowledge Proofs (ZKP)",
    description: "Enable users to verify specific attributes without revealing full details. This enhances privacy while maintaining trust."
  },
  {
    icon: img3,
    title: "Interoperability with Other DID Standards",
    description: "Support for multiple decentralized identity protocols (W3C DID, Hyperledger Indy, Sovrin, etc.), ensuring seamless integration across various blockchain ecosystems."
  },
  {
    icon: img4,
    title: "Smart Contract-Based Identity Verification",
    description: "Use blockchain-powered smart contracts to automate and secure identity verification, reducing fraud and eliminating intermediaries."
  },
  {
    icon: img5,
    title: "Multi-Factor Authentication",
    description: "Secure voter login through a combination of password, biometric verification and SMS/OTP — making impersonation virtually impossible."
  },
  {
    icon: img6,
    title: "Decentralized Login",
    description: "Users can log in without relying on traditional passwords, using decentralized authentication methods like Web3 wallets or cryptographic key pairs."
  }
];

export default function BenefitCard({ theme }) {
  return (
    <div className={`${theme === "dark" ? "text-white" : "text-black"} py-16 px-6 text-center`}>
      <small className={`${theme === "dark" ? "text-white" : "text-black"} uppercase text-lg`}>Benefits of VoteSphere</small>
      <h2 className={`${theme === "dark" ? "text-white" : "text-black"} text-5xl font-bold my-4`}>Be Part of a Future-Ready Democracy</h2>
      <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} max-w-3xl text-lg mx-auto mb-10`}>
      As a member of the VoteSphere community, you contribute to building a more transparent, secure and inclusive voting ecosystem — shaping how decisions are made in communities, organizations and governance for years to come.
      </p>
      <div className="grid md:grid-cols-3 gap-6 p-10 px-20 text-white w-5/6 mx-auto"></div>
    
    <div className="grid md:grid-cols-3 gap-6 p-10 px-20 text-white w-5/6 mx-auto">
      {benefits.map((benefit, index) => (
        <div key={index} className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}  p-6 rounded-3xl shadow-lg text-center inset `}>
          
          <div className="flex justify-center mb-4 ">
            <img src={benefit.icon} alt={benefit.title} className=" w-20 h-20 object-contain shadow-lg rounded-lg bg-gray-500 boxshadow " />
          </div>
          <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-xl font-semibold mb-2 `}>{benefit.title}</h3>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-700"}  text-sx `}>{benefit.description }</p>
        </div>
      ))}
    </div>
    </div>
  );
}