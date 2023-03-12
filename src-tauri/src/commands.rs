use crate::{emit_event, state::AppState, Event};
use tauri::{GlobalShortcutManager, Manager};

pub fn on_shortcut(handle: tauri::AppHandle) {
    println!("Shortcut pressed");

    let app_window = handle.get_window("main").unwrap();

    let result = app_window.unminimize();

    if result.is_err() {
        eprintln!("Error: {}", result.err().unwrap());
        return;
    }

    app_window.show().unwrap();
    app_window.set_focus().unwrap();
    let result = app_window.set_focus();

    if result.is_err() {
        eprintln!("Error: {}", result.err().unwrap());
        return;
    }

    emit_event(Event::Shortcut, &handle);
}

#[tauri::command(async)]
pub fn println(message: String) {
    println!("{}", message);
}

#[tauri::command(async)]
pub fn register_shortcut(shortcut: &str, handle: tauri::AppHandle) -> bool {
    let mut global_shortcut_manager = handle.global_shortcut_manager();
    let handle_clone = handle.clone();
    let state = handle_clone.state::<AppState>();
    let mut app_state = state.0.lock().unwrap();

    let previous_shortcut = app_state.shortcut.clone();

    println!("Registering shortcut: {}", shortcut);

    // unregister previous shortcut
    if previous_shortcut.is_some() {
        global_shortcut_manager
            .unregister(previous_shortcut.unwrap().as_str())
            .unwrap();
    }

    let result = global_shortcut_manager.register(shortcut, move || {
        on_shortcut(handle.clone());
    });

    if result.is_ok() {
        app_state.shortcut = Some(shortcut.to_string());
        return true;
    } else {
        eprintln!("Error registering shortcut: {}", result.err().unwrap());
        return false;
    }
}

#[tauri::command(async)]
pub fn unregister_shortcut(handle: tauri::AppHandle) {
    let state = handle.state::<AppState>();
    let app_state = state.0.lock().unwrap();

    let shortcut = app_state.shortcut.clone();

    if shortcut.is_none() {
        return;
    }

    handle
        .global_shortcut_manager()
        .unregister(shortcut.unwrap().as_str())
        .unwrap();
}

#[tauri::command(async)]
pub fn hide_window(handle: tauri::AppHandle) {
    println!("hiding window");
    let app_window = handle.get_window("main").unwrap();
    let result = app_window.set_always_on_top(false);

    if result.is_err() {
        eprintln!("Error setting always on top");
    }

    app_window.hide().expect("Failed to hide window");

    emit_event(Event::WindowHide, &handle);
}
