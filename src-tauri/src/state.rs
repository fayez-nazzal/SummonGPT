use std::sync::{Arc, Mutex};

use async_openai::Client;
use auto_launch::AutoLaunch;

pub struct AppInnerState {
    pub auto_start: Option<AutoLaunch>,
    pub shortcut: Option<String>,
    pub client: Option<Client>
}

pub struct AppState(pub Arc<Mutex<AppInnerState>>);

pub fn init_state() -> AppState {
    AppState(Arc::new(Mutex::new(AppInnerState {
        auto_start: None,
        shortcut: None,
        client: None
    })))
}
