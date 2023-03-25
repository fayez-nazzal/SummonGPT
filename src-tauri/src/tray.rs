use tauri::{SystemTrayMenu, CustomMenuItem, SystemTray, AppHandle, SystemTrayEvent, Manager};
use crate::{commands::on_shortcut, emit_event, Event};

enum MenuItems {
    Show = 0,
    Exit = 1,
    SetupShortcut = 2,
    ClearSettings = 3,
}

impl MenuItems {
    fn title(&self) -> String {
        match self {
            MenuItems::Show => "SummonGPT".to_string(),
            MenuItems::SetupShortcut => "Setup Shortcut".to_string(),
            MenuItems::Exit => "Exit".to_string(),
            MenuItems::ClearSettings => "Clear Settings".to_string(),
        }
    }
}

pub fn init_system_tray() -> SystemTray {
    let show = CustomMenuItem::new(MenuItems::Show.title(), MenuItems::Show.title());
    let setup_shortcut = CustomMenuItem::new(MenuItems::SetupShortcut.title(), MenuItems::SetupShortcut.title());
    let clear_settings = CustomMenuItem::new(MenuItems::ClearSettings.title(), MenuItems::ClearSettings.title());
    let quit = CustomMenuItem::new(MenuItems::Exit.title(), MenuItems::Exit.title());

    let tray_menu = SystemTrayMenu::new().add_item(show).add_item(setup_shortcut).add_item(clear_settings).add_item(quit);

    let tray = SystemTray::new().with_menu(tray_menu);

    tray
}

pub fn on_system_tray_event (app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::LeftClick {
            position: _,
            size: _,
            ..
        } => {
            let main_window = app.get_window("main").unwrap();
            main_window.show().unwrap();
        }
        
        SystemTrayEvent::MenuItemClick { id, .. } => {
            if id == MenuItems::Show.title() {
                on_shortcut(app.clone());
            }

            if id == MenuItems::Exit.title() {
                app.exit(0);
            }

            if id == MenuItems::SetupShortcut.title() {
                on_shortcut(app.clone());
                emit_event(Event::SetupShortcut, app);
            }

            if id == MenuItems::ClearSettings.title() {
                emit_event(Event::ClearSettings, app);
            }
        },
        _ => {}
    }
}