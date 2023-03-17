#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::commands::check_openai_auth;
use crate::commands::hide_window;
use crate::commands::println;
use crate::commands::register_shortcut;
use crate::commands::stream_chat;
use crate::commands::unregister_shortcut;
use auto_launch::*;
use serde::ser::StdError;
use state::init_state;
use state::AppState;
use std::env::current_exe;
use tauri::ActivationPolicy;
use tauri::App;
use tauri::AppHandle;
use tauri::Manager;
use tray::init_system_tray;
use tray::on_system_tray_event;

mod commands;
mod state;
mod tray;

#[derive(Clone, serde::Serialize)]
struct EventPayload {
}

#[derive(Clone, serde::Serialize)]
struct StreamEventPayload {
    content: String,
    bobble_index: i32,
}

enum Event {
    Shortcut,
    SetupShortcut,
    WindowHide,
    Stream
}

impl Event {
    fn to_string(&self) -> String {
        match self {
            Event::Shortcut => "shortcut".to_string(),
            Event::SetupShortcut => "setup_shortcut".to_string(),
            Event::WindowHide => "window_hide".to_string(),
            Event::Stream => "stream".to_string()
        }
    }
}

fn emit_event(event: Event, handle: &AppHandle) {
    handle
        .emit_all(event.to_string().as_str(), EventPayload {})
        .unwrap();
}

fn emit_stream_event(handle: &AppHandle, content: String, bobble_index: i32) {
    handle
        .emit_all(&Event::Stream.to_string().as_str(), StreamEventPayload { content, bobble_index })
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

    let auto_start = app_state.auto_start.as_ref();

    if auto_start.is_some() {
        let auto_start = auto_start.unwrap();

        if !auto_start.is_enabled().is_err() && !auto_start.is_enabled().unwrap() {
            let result = auto_start.enable();

            if result.is_err() {
                eprintln!("Failed to enable auto start");
            }
        };
    }

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
            println,
            stream_chat,
            check_openai_auth
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(run_app);
}
