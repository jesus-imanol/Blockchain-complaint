import React, { useState, useEffect } from "react";
import { useAlert, useAccount } from "@gear-js/react-hooks";
import { useSailsCalls } from "@/app/hooks";
import './GetReports.css';

interface ReportData {
    person_report: {
        firstname_denuncied: string,
        lastname_denuncied: string,
        img_denuncied: string,
        description_denuncied: string,
        age_denuncied: number,
    },
    report_id: number,
    details: string,
    is_public: boolean,
    description: string,
    category: string,
    otro?: string,
}

const GetReports: React.FC = () => {
    const sails = useSailsCalls();
    const alert = useAlert();
    const { accounts } = useAccount();
    
    const [reports, setReports] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(false);

    const handleGetReports = async () => {
        if (!accounts || !sails) {
            alert.error('Accounts or Sails are not ready');
            return;
        }
        
        setLoading(true);
        try {
            // Llamada a la consulta de todos los reportes sin pasar `userAddress`
            const response = await sails.command('ReportService.GetAllReports', {});

            setReports(response);
            alert.success('Reports fetched successfully!');
        } catch (error: any) {
            alert.error(`Error while fetching reports: ${error?.message || error}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetReports();
    }, []); // Dependencias vacías para ejecutar solo al montar el componente

    return (
        <div className="container">
            <h2>Get Reports</h2>
            {loading ? (
                <p>Loading reports...</p>
            ) : (
                <ul>
                    {reports.map((report) => (
                        <li key={report.report_id}>
                            <h3>{report.description}</h3>
                            <p>Report ID: {report.report_id}</p>
                            <p>Reported by: {report.person_report.firstname_denuncied} {report.person_report.lastname_denuncied}</p>
                            <p>Details: {report.details}</p>
                            <p>Category: {report.category}</p>
                            <p>Public: {report.is_public ? 'Yes' : 'No'}</p>
                            <p>Other: {report.otro}</p>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={handleGetReports} className="button">Refresh Reports</button>
        </div>
    );
};

export { GetReports };
