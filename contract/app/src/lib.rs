//lib.rs

//lib.rs
#![no_std]

use sails_rs::prelude::*;

use keyring_service::services::keyring_service::KeyringService;
// Importar nuestros módulos
pub mod states;
pub mod services;

// Importar los servicios que se utilizarán en el programa
use services::report_service::ReportService;


// Estructura principal del programa TrafficLightProgram
pub struct TrafficLightProgram;

// Implementación del programa TrafficLightProgram
#[program]
impl TrafficLightProgram {
    pub fn new() -> Self {
        ReportService::seed();
        KeyringService::seed();

        Self
    }
    #[route("Keyring")]
    pub fn keyring_svc(&self) -> KeyringService {
        KeyringService::new()
    }
    // Exponer el servicio ReportService a través de una ruta específica
    #[route("ReportService")]
    pub fn report_service(&self) -> ReportService {
        ReportService::new()
    }
}