use tauri::{Emitter, Manager};
use std::sync::Mutex;

// Store credential data temporarily
static PENDING_CREDENTIAL: Mutex<Option<String>> = Mutex::new(None);

#[tauri::command]
async fn open_quick_copy_window(
    app: tauri::AppHandle,
    credential_json: String,
) -> Result<(), String> {
    // Close existing window if it exists
    if let Some(window) = app.get_webview_window("quick-copy") {
        let _ = window.close();
    }
    
    // Store credential data
    if let Ok(mut pending) = PENDING_CREDENTIAL.lock() {
        *pending = Some(credential_json);
    }
    
    // Create new floating window
    let _window = tauri::WebviewWindowBuilder::new(
        &app,
        "quick-copy",
        tauri::WebviewUrl::App("quick-copy.html".into())
    )
    .title("Quick Copy")
    .inner_size(320.0, 400.0)
    .resizable(false)
    .decorations(false)
    .always_on_top(true)
    .skip_taskbar(true)
    .build()
    .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn get_quick_copy_credential() -> Result<String, String> {
    if let Ok(mut pending) = PENDING_CREDENTIAL.lock() {
        if let Some(credential_json) = pending.take() {
            return Ok(credential_json);
        }
    }
    Err("No credential data available".to_string())
}

#[tauri::command]
async fn close_quick_copy_window(app: tauri::AppHandle) -> Result<(), String> {
    // Clear stored credential
    if let Ok(mut pending) = PENDING_CREDENTIAL.lock() {
        *pending = None;
    }
    
    if let Some(window) = app.get_webview_window("quick-copy") {
        window.close().map_err(|e| e.to_string())?;
    }
    
    // Broadcast event to all windows to clear pin state
    let _ = app.emit("quick-copy-closed", ());
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .plugin(tauri_plugin_fs::init())
    .invoke_handler(tauri::generate_handler![
      open_quick_copy_window,
      close_quick_copy_window,
      get_quick_copy_credential
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
