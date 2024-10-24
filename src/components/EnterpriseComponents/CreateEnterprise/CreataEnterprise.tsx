import React, { useState } from "react";
import { useAlert, useAccount } from "@gear-js/react-hooks";
import { useSailsCalls } from "@/app/hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import './Create.css';

interface EnterpriseData {
  name: string;
  code_post: string;
  location: string;
  hour: string;
  name_owner: string;
}

const CreateEnterprise: React.FC = () => {
  const sails = useSailsCalls();
  const alert = useAlert();
  const { accounts, account } = useAccount();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [hour, setHour] = useState('');

  const handleCreateEnterprise = async () => {
    if (!accounts || !sails) {
      alert.error('Accounts or Sails are not ready');
      return;
    }
  
    const localAccount = account?.address;
    const isVisibleAccount = accounts.some(
      (visibleAccount) => visibleAccount.address === localAccount
    );
  
    if (!isVisibleAccount) {
      alert.error("Account not available to sign");
      return;
    }
  
    const source = accounts[0].meta.source;
  
    let signer;
    try {
      const { signer: Signer1 } = await web3FromSource(accounts[0].meta.source);
      
      signer = Signer1;
    } catch (error) {
      alert.error(`Error obtaining signer: ${(error as Error).message}`);
      return;
    }
  

    if (!name || !postalCode || !location || !hour || !ownerName) {
      alert.error("Please fill in all fields.");
      return;
    }
  
    const actorId = localAccount; 
    const enterpriseData = {
      actor_id: "5F3sa2nCjHshFu9PYYXwn7UgY7zJKXuoB7D8WQwoqRQ9gn1U",
      name,
      code_post: postalCode,
      location,
      hour,
      name_owner: ownerName,
    };
    if (!account) {
      alert.error('Account is not ready');
      return;
    }
  
    console.log('Enterprise Data:', enterpriseData); 
  
    try {
      const response = await sails.command(
        'ReportService/CreatedEnterprise', 
          {
            userAddress:account.decodedAddress,
            signer
          },
        {
          callArguments: [
            account.decodedAddress,
            enterpriseData.name,
            enterpriseData.code_post,
            enterpriseData.location,
            enterpriseData.hour,
            enterpriseData.name_owner,
        
          ],  
          callbacks: {
            onLoad: () => alert.info('Preparing to send enterprise data...'),
            onBlock: (blockHash) => alert.success(`Transaction included in block: ${blockHash}`),
            onSuccess: () => alert.success('Enterprise registered successfully!'),
            onError: () => {
              alert.error(`Error while registering enterprise`);
            },
          }
        }
      );
  
      console.log(`Response: ${response}`);
    } catch (error: any) {
      alert.error(`Error while registering enterprise: ${error?.message || error}`);
    }
  };
  
  return (
    <div className="container">
  <div className="form-column">
    <form className="form">
      <strong>
        <p className="titulo">Registrar empresa</p>
      </strong>
      <p className="descripcion">Ingrese los datos de la empresa para registrarlo en el sistema.</p>
      <input
        type="text"
        placeholder="Name of Enterprise"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Location of Enterprise"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Name of Owner"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Postal Code"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Working Hours (e.g., 09:00-17:00)"
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        className="input"
      />
      <button 
        type="button" 
        onClick={handleCreateEnterprise} 
        className="button">
        Submit
      </button>
    </form>
  </div>
  <div className="image-column">
    <img src="/edificio.png" alt="Edificio" className="image" />
  </div>
</div>

    
  );
}

export { CreateEnterprise };
