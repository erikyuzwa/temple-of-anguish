// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let _window = app.get_window("main").unwrap();
      #[cfg(debug_assertions)] // only include this code on debug builds
      {
        _window.open_devtools();
        _window.close_devtools();
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![exit_app])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn exit_app() {
  std::process::exit(0x0);
}