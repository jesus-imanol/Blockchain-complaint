import React, { useState } from "react";
import { useAlert, useAccount } from "@gear-js/react-hooks";
import { useSailsCalls } from "@/app/hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import './CreateReport.css';
import cryptojs from 'crypto-js';

function CreateReport() {
    const [ubicacion, setUbicacion] = useState<string>('');
    const [lugar, setLugar] = useState<string>('');
    const [descripcion, setDescripcion] = useState<string>('');
    const [evidencia, setEvidencia] = useState<string>('');
    const [categoria, setCategoria] = useState<string>('');
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const sails = useSailsCalls();
    const alert = useAlert();
    const { accounts, account } = useAccount();
    
    // Nueva información de la persona denunciada
    const [firstnameDenuncied, setFirstnameDenuncied] = useState<string>('');
    const [lastnameDenuncied, setLastnameDenuncied] = useState<string>('');
    const [imgDenuncied, setImgDenuncied] = useState<string>('');
    const [ageDenuncied, setAgeDenuncied] = useState<number | null>(null); // Cambiado a number o null

    interface PersonReport {
        firstname_denuncied: string;
        lastname_denuncied: string;
        img_denuncied: string;
        description_denuncied: string;
        age_denuncied: number; // Cambiado a number
    }
      
    enum Category {
        FaltasALaProbidadAdministrativa = "FaltasALaProbidadAdministrativa",
        MalUsoDeRecursos = "MalUsoDeRecursos",
        Robo = "Robo",
        TraficoDeInfluencias = "TraficoDeInfluencias",
        Maltrato = "Maltrato",
        AcosoLaboral = "AcosoLaboral",
        AcosoSexual = "AcosoSexual",
        DiscriminacionArbitraria = "DiscriminacionArbitraria",
        ConflictoDeInteres = "ConflictoDeInteres",
        UsoDeInformacionReservada = "UsoDeInformacionReservada",
        Soborno = "Soborno",
        IntentoDeAsesinato = "IntentoDeAsesinato",
        AgresionFisica = "AgresionFisica",
        AgresionVerbal = "AgresionVerbal",
        Violacion = "Violacion",
        OperacionSospechosa = "OperacionSospechosa",
        Estafa = "Estafa",
        Amenaza = "Amenaza",
        Otros = "Otros",
    }

    interface Emprises {
        id: number; 
        actor_id: string; 
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Define personReport
        const personReport: PersonReport = {
            firstname_denuncied: cryptojs.AES.encrypt(firstnameDenuncied, "awe").toString(), // Puedes cambiar esto según tus necesidades
            lastname_denuncied: cryptojs.AES.encrypt(lastnameDenuncied, "awe").toString(),
            img_denuncied: imgDenuncied,
            description_denuncied: cryptojs.AES.encrypt(descripcion, "awe").toString(),
            age_denuncied: ageDenuncied !== null ? ageDenuncied : 0, // Usa 0 si es null
        };
        console.log('personReport:', personReport); // Agrega esta línea para verificar el contenido de personReport
    
        let report_id = Math.floor(Math.random() * 10000); 
        let index = 0; 
        index++;

        // Verifica si hay cuentas y si sails está listo
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
    
        // Obtener el signer
        const source = accounts[0].meta.source;
        let signer;
        try {
            const { signer: Signer1 } = await web3FromSource(source);
            signer = Signer1;
        } catch (error) {
            alert.error(`Error obtaining signer: ${(error as Error).message}`);
            return;
        }
         
        if (!account) {
            alert.error('Account is not ready');
            return;
        }

        // Crear objeto emprises
        const emprises: Emprises[] = [[index, account.decodedAddress]];

        console.log('Sending report data:', 
            personReport,
            report_id,
            account.decodedAddress,
            isPublic,
            descripcion,
            categoria,
            emprises
        );
        
        try {
            const response = await sails.command(
                'ReportService/CreatedReport', 
                {
                    userAddress: account.decodedAddress,
                    signer
                },
                {
                    callArguments: [
                        personReport,
                        report_id,
                        descripcion,  // Cambié aquí a 'description'
                        isPublic,
                        categoria,
                        null, // "otro" (si hay otro campo, reemplazar null por el valor correcto)
                        emprises
                    ],
                    
                    callbacks: {
                        onLoad: () => alert.info('Preparing to send report data...'),
                        onBlock: (blockHash) => alert.success(`Transaction included in block: ${blockHash}`),
                        onSuccess: () => alert.success('Report registered successfully!'),
                        onError: () => {
                            alert.error(`Error while registering report`);
                        },
                    }
                }
            );

            console.log(`Response: ${response}`);
        } catch (error: any) {
            alert.error(`Error while registering report: ${error?.message || error}`);
        }
    };

    return (
        <>
            <section className='report'> 
                <div className="distro"></div>
                <div className="distro">
                    <div className="form_create">
                        <h2>Datos de la denuncia</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <h4>Ubicación del lugar</h4>
                                <input 
                                    type="text" 
                                    value={ubicacion} 
                                    onChange={(e) => setUbicacion(e.target.value)} 
                                />
                            </div>
                            <div>
                                <h4>Selecciona el lugar</h4>
                                <input 
                                    type="text" 
                                    value={lugar} 
                                    onChange={(e) => setLugar(e.target.value)} 
                                />
                            </div>
                            <div>
                                <h4>Descripción detallada</h4>
                                <input 
                                    type="text" 
                                    value={descripcion} 
                                    onChange={(e) => setDescripcion(e.target.value)} 
                                />
                            </div>
                            <div>
                                <h4>Evidencia</h4>
                                <input 
                                    type="text" 
                                    value={evidencia} 
                                    onChange={(e) => setEvidencia(e.target.value)} 
                                />
                            </div>
                            <div>
                                <h4>Categoría</h4>
                                <select 
                                    value={categoria} 
                                    onChange={(e) => setCategoria(e.target.value)}
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {Object.values(Category).map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Datos de la persona denunciada */}
                            <h3>Datos de la persona denunciada</h3>
                            <div>
                                <h4>Nombre</h4>
                                <input 
                                    type="text" 
                                    value={firstnameDenuncied} 
                                    onChange={(e) => setFirstnameDenuncied(e.target.value)} 
                                />
                            </div>
                            <div>
                                <h4>Apellido</h4>
                                <input 
                                    type="text" 
                                    value={lastnameDenuncied} 
                                    onChange={(e) => setLastnameDenuncied(e.target.value)} 
                                />
                            </div>
                            <div>
                                <h4>Imagen (URL)</h4>
                                <input 
                                    type="text" 
                                    value={imgDenuncied} 
                                    onChange={(e) => setImgDenuncied(e.target.value)} 
                                />
                            </div>
                            <div>
                                <h4>Edad</h4>
                                <input 
                                    type="number"
                                    value={ageDenuncied !== null ? ageDenuncied : ''} // Muestra vacío si es null
                                    onChange={(e) => setAgeDenuncied(e.target.value ? Number(e.target.value) : null)} // Convierte a number o null
                                />
                            </div>

                            <button type="submit">Enviar datos</button>
                        </form>
                    </div>
                </div>
                <div className="distro"></div>
            </section>
        </>
    );
}

export default CreateReport;
