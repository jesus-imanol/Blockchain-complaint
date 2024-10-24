// report_state.rs
use sails_rs::{collections::HashMap, prelude::*};

use crate::services::report_service::ReportService;

#[derive(Clone, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct ReportDataMent {
    pub person_report: PersonReport,
    pub report_id: u128, // Cambiado de usize a u128 para evitar el error de Encode, Decode y TypeInfo
    pub details: String, 
    pub is_public: bool, 
    pub description: String, 
    pub category: Category,
    pub otro: Option<String>, 
}

#[derive(Clone, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum Category {
    FaltasALaProbidadAdministrativa,
    MalUsoDeRecursos,
    Robo, 
    TraficoDeInfluencias, 
    Maltrato,
    AcosoLaboral,
    AcosoSexual, 
    DiscriminacionArbitraria, 
    ConflictoDeInteres, 
    UsoDeInformacionReservada, 
    Soborno, 
    IntentoDeAsesinato,
    AgresionFisica, 
    AgresionVerbal, 
    Violacion, 
    OperacionSospechosa,
    Estafa, 
    Amenaza, 
    Otros
}

#[derive(Clone, Default, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Enterprise {
    pub name: String,
    pub code_post: String,
    pub location: String,
    pub hour: String,
    pub name_owner: String,
}

pub static mut STATE: Option<ReportState> = None;

// Definición de la estructura de persona reportada
#[derive(Clone, Default, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct PersonReport {
    pub firstname_denuncied: String,
    pub lastname_denuncied: String,
    pub img_denuncied: String,
    pub description_denuncied: String,
    pub age_denuncied: u128,
}

// Estructura para el estado
#[derive(Clone, Default)]
pub struct ReportState {
    pub all_reports: HashMap<u128, ReportDataMent>, // Cambiado de usize a u128
    pub all_enterprises: HashMap<ActorId, Enterprise>
}

pub struct IoReportState {
    pub all_reports: Vec<(u128, ReportDataMent)>, // Cambiado de usize a u128
    pub all_enterprises: Vec<(ActorId, Enterprise)>
}

impl From<ReportState> for IoReportState {
    // Método de conversión
    fn from(value: ReportState) -> Self {
        let ReportState {
            all_reports,
            all_enterprises,
        } = value;

        let all_reports = all_reports.into_iter().collect();
        let all_enterprises = all_enterprises
            .iter()
            .map(|(k, v)| (*k, v.clone()))
            .collect();

        Self {
            all_reports,
            all_enterprises,
        }
    }
}

// Añadimos los métodos de estado como antes
impl ReportState {
    pub fn new() -> Self {
        Self {
            all_reports: HashMap::new(),
            all_enterprises: HashMap::new(),
        }
    }

    pub fn init_state() {
        unsafe {
            if STATE.is_none() {
                STATE = Some(Self::new());
            }
        };
    }

    pub fn state_mut() -> &'static mut ReportState {
        let state = unsafe { STATE.as_mut() };
        debug_assert!(state.is_some(), "El estado no está inicializado");
        unsafe { state.unwrap_unchecked() }
    }

    pub fn state_ref() -> &'static ReportState {
        let state = unsafe { STATE.as_ref() };
        debug_assert!(state.is_some(), "El estado no está inicializado");
        unsafe { state.unwrap_unchecked() }
    }

    pub fn add_report(&mut self, report: ReportDataMent) {
        let index = report.report_id; // Usamos el ID ya provisto en ReportDataMent
        self.all_reports.insert(index, report);
    }

    pub fn add_enterprise(&mut self, actor_id: ActorId, enterprise: Enterprise) {
        self.all_enterprises.insert(actor_id, enterprise);
    }
    pub fn get_all_reports(&self) -> Vec<ReportDataMent> {
        self.all_reports.values().cloned().collect() // Devuelve un vector con todos los reportes
    }
    pub fn get_all_enterprises(&self) -> Vec<Enterprise> {
        self.all_enterprises.values().cloned().collect() // Devuelve un vector con todos los reportes
    }
}