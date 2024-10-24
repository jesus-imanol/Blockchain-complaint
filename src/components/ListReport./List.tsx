
// ReportList.tsx
import React, { useEffect, useState } from "react";

const List = () => {
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
        console.log(localStorage.getItem('reports'))
        setReports(storedReports);

    }, []);

    return (
        <div>
            <h2>Empresas disponibles para realizar denuncias</h2>
            {reports.length === 0 ? (
                <p>No hay reportes registrados.</p>
            ) : (
                <ul>
                    {reports.map((report, index) => (
                        <li key={index}>
                            <strong>Ubicación:</strong> {report.ubicacion} <br />
                            <strong>Lugar:</strong> {report.lugar} <br />
                            <strong>Descripción:</strong> {report.descripcion} <br />
                            <strong>Categoría:</strong> {report.categoria} <br />
                            <strong>Nombre denunciado:</strong> {report.firstnameDenuncied} {report.lastnameDenuncied} <br />
                            <strong>Edad:</strong> {report.ageDenuncied} <br />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default List;
