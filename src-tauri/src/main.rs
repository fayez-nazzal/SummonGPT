#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::commands::hide_window;
use crate::commands::println;
use crate::commands::register_shortcut;
use crate::commands::unregister_shortcut;
use auto_launch::*;
use serde::ser::StdError;
use state::init_state;
use state::AppState;
use tauri::ActivationPolicy;
use std::env::current_exe;
use tauri::App;
use tauri::AppHandle;
use tauri::Manager;
use tray::init_system_tray;
use tray::on_system_tray_event;

mod commands;
mod state;
mod tray;

#[derive(Clone, serde::Serialize)]
struct HistoryEventPayload {}

enum Event {
    Shortcut,
}

impl Event {
    fn to_string(&self) -> String {
        match self {
            Event::Shortcut => "shortcut".to_string(),
        }
    }
}

fn emit_event(event: Event, handle: &AppHandle) {
    handle
        .emit_all(event.to_string().as_str(), HistoryEventPayload {})
        .unwrap();
}

fn setup(app: &mut App) -> std::result::Result<(), Box<(dyn StdError + 'static)>> {
    app.set_activation_policy(ActivationPolicy::Accessory);

    let handle = app.handle();

    let app_name = &app.package_info().name;
    let current_exe = current_exe().unwrap();

    let state = (&handle).state::<AppState>();
    let mut app_state = state.0.lock().unwrap();

    app_state.auto_start = Some(
        AutoLaunchBuilder::new()
            .set_app_name(&app_name)
            .set_app_path(&current_exe.to_str().unwrap())
            .set_use_launch_agent(true)
            .build()
            .unwrap(),
    );

    Ok(())
}

fn run_app(_app_handle: &AppHandle, event: tauri::RunEvent) {
    match event {
        tauri::RunEvent::ExitRequested { api, .. } => {
            api.prevent_exit();
        }
        _ => {}
    }
}

fn main() {
    tauri::Builder::default()
        .manage(init_state())
        .setup(setup)
        .system_tray(init_system_tray())
        .on_system_tray_event(on_system_tray_event)
        .invoke_handler(tauri::generate_handler![
            register_shortcut,
            unregister_shortcut,
            hide_window,
            println
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(run_app);
}
