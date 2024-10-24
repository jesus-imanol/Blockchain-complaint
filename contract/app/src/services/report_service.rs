use sails_rs::{
    prelude::*,
};
use crate::states::report_state::{
    Category, ReportDataMent, PersonReport, ReportState, Enterprise
};

#[derive(Default)]
pub struct ReportService;
impl ReportService {
    pub fn seed() {
        ReportState::init_state();
  }
}

#[service]
impl ReportService {
 
        pub fn new() -> Self {
            Self
        }


    pub fn created_report(
        &mut self, 
        person_report: PersonReport, 
        report_id: u128, 
        details: String, 
        is_public: bool, 
        description: String, 
        category: Category, 
        otro: Option<String>, 
        //enterprises: HashMap<u32, ActorId>
    ) -> ReportDataMent {
        let report = ReportDataMent {
            person_report,
            report_id,
            details,
            is_public,
            description,
            category, 
            otro, 
            //enterprises,
        };

        // Añadir el reporte con el ActorId asociado al estado
        ReportState::state_mut().add_report(report.clone());

        // Retorna el reporte junto con el ActorId para el payload
        report
    }
    pub fn created_enterprise(
        &mut self,
        actor_id: ActorId,
        name: String,
        code_post: String,
        location: String,
        hour: String,
        name_owner: String )-> Enterprise {
            let enterprise = Enterprise {
                name,
                code_post,
                location,
                hour,
                name_owner
            };
            ReportState::state_mut().add_enterprise(actor_id,enterprise.clone());
        enterprise

    }
    pub fn get_all_reports(&self) -> Vec<ReportDataMent> {
        ReportState::state_ref().get_all_reports()
    }
    pub fn get_all_enterprises(&self) -> Vec<Enterprise> {
        ReportState::state_ref().get_all_enterprises()
    }
}
#[derive(Clone,Encode,Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct EnterpriseReport {
    pub name: String,
    pub code_post: String,
    pub location: String,
    pub hour: String,
    pub name_owner: String,
}