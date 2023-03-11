use tauri::{SystemTrayMenu, CustomMenuItem, SystemTray, AppHandle, SystemTrayEvent, Manager};
use crate::commands::on_shortcut;

enum MenuItems {
    Show = 0,
    Exit = 1,
}

impl MenuItems {
    fn title(&self) -> String {
        match self {
            MenuItems::Show => "SummonGPT".to_string(),
            MenuItems::Exit => "Exit".to_string(),
        }
    }
}

pub fn init_system_tray() -> SystemTray {
    let show = CustomMenuItem::new(MenuItems::Show.title(), MenuItems::Show.title());
    let quit = CustomMenuItem::new(MenuItems::Exit.title(), MenuItems::Exit.title());

    let tray_menu = SystemTrayMenu::new().add_item(show).add_item(quit);

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
        },
        _ => {}
    }
}