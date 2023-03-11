use std::sync::{Arc, Mutex};

use auto_launch::AutoLaunch;

pub struct AppInnerState {
    pub auto_start: Option<AutoLaunch>,
    pub shortcut: Option<String>,
}

pub struct AppState(pub Arc<Mutex<AppInnerState>>);

pub fn init_state() -> AppState {
    AppState(Arc::new(Mutex::new(AppInnerState {
        auto_start: None,
        shortcut: None,
    })))
}
