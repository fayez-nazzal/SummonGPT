use crate::{emit_event, emit_stream_event, state::AppState, Event};
use async_openai::types::{
    ChatCompletionRequestMessageArgs, CreateChatCompletionRequestArgs, Role, ChatCompletionRequestMessage,
};
use async_openai::Client;
use futures::StreamExt;
use serde::{Serialize, Deserialize};
use tauri::{GlobalShortcutManager, Manager};
use tokio::runtime::Builder;

pub fn on_shortcut(handle: tauri::AppHandle) {
    println!("Shortcut pressed");

    let app_window = handle.get_window("main").unwrap();

    let result = app_window.unminimize();

    if result.is_err() {
        eprintln!("Error: {}", result.err().unwrap());
        return;
    }

    app_window.show().unwrap();
    app_window.set_always_on_top(true).unwrap();
    app_window.center().unwrap();
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

#[derive(Serialize, Deserialize)]
pub struct Bobble {
    role: i32,
    content: String,
}

pub async fn async_stream_chat(
    bobbles: Vec<Bobble>,
    bobble_index: i32,
    api_key: &str,
    handle: tauri::AppHandle,
) -> Result<(), Box<dyn std::error::Error>> {
    let messages: Vec<ChatCompletionRequestMessage> = bobbles
    .into_iter()
    .map(|bobble| {
        let role = match bobble.role {
            0 => Role::System,
            1 => Role::User,
            _ => Role::Assistant,
        };
        
        ChatCompletionRequestMessageArgs::default()
            .role(role)
            .content(bobble.content)
            .build()
            .unwrap()
    })
    .collect();

    let request = CreateChatCompletionRequestArgs::default()
        .model("gpt-3.5-turbo")
        .max_tokens(1024u16)
        .messages(messages)
        .build()
        .unwrap();

    let state = handle.state::<AppState>();
    let mut app_state = state.0.lock().unwrap();

    if app_state.client.is_none() {
        app_state.client = Some(Client::new().with_api_key(api_key));
    }

    let client = app_state.client.as_ref().unwrap();

    let mut stream = client.chat().create_stream(request).await.unwrap();

    while let Some(result) = stream.next().await {
        match result {
            Ok(response) => {
                response.choices.iter().for_each(|chat_choice| {
                    if let Some(ref content) = chat_choice.delta.content {
                        emit_stream_event(&handle, content.to_string(), bobble_index);
                    }
                });
            }
            Err(err) => {
                eprintln!("Error: {}", err);
            }
        }
    }

    Ok(())
}

#[tauri::command(async)]
pub async fn stream_chat(bobbles: Vec<Bobble>, bobble_index: i32, api_key: String, handle: tauri::AppHandle) {
    let handle_clone = handle.clone();

    // call stream chat async
    std::thread::spawn(move || {
        let rt = Builder::new_multi_thread()
            .enable_all()
            .build()
            .unwrap();

        rt.block_on(async_stream_chat(bobbles, bobble_index, api_key.as_str(), handle_clone)).unwrap();
    });
}

#[tauri::command(async)]
pub async fn check_openai_auth(api_key: String) -> bool {
    let client = Client::new().with_api_key(api_key.as_str());

    let result = client.files().list().await;

    result.is_ok()
}