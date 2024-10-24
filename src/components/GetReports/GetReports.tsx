import React, { useState } from "react";
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

    const decodeBase64 = (data: string) => {
        try {
            return atob(data);
        } catch (error) {
            return data;
        }
    };

    const handleGetReports = async () => {
        if (!accounts || !sails) {
            alert.error('Accounts or Sails are not ready');
            return;
        }
        
        setLoading(true);
        try {
            // Cambiar 'command' por 'query' ya que estamos realizando una consulta
            const response = await sails.query('ReportService/GetAllReports', {});

            setReports(response);
            alert.success('Reports fetched successfully!');
        } catch (error: any) {
            alert.error("Error while fetching reports:");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Get Reports</h2>
            {loading ? (
                <p>Loading reports...</p>
            ) : (
                <div className="cards-container">
                    {reports.map((report) => (
                        <div className="card" key={report.report_id}>
                            <div className="card-content">
                                <h3>{report.description}</h3>
                                <p><strong>Report ID:</strong> {report.report_id}</p>
                                <p><strong>Details:</strong> {report.details}</p>
                                {/* <p><strong>Reported by:</strong> {report.person_report.firstname_denuncied} {report.person_report.lastname_denuncied}</p> */}
                                {/* <p><strong>Category:</strong> {report.category}</p> */}
                                {/* {report.person_report.img_denuncied && (
                                    <img src={report.person_report.img_denuncied} alt="Denounced Image" className="report-image" />
                                )} */}
                                {/* <p><strong>Other:</strong> {report.otro ? report.otro : 'No data'}</p> */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={handleGetReports} className="button">Refresh Reports</button>
        </div>
    );
    
};

export { GetReports };