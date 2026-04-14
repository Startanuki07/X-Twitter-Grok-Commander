// ==UserScript==
// @name         X (Twitter) — Grok Commander
// @name:zh-TW   X (Twitter) — Grok 指揮官
// @name:zh-CN   X (Twitter) — Grok 指挥官
// @name:ja      X (Twitter) — Grok コマンダー
// @name:ko      X (Twitter) — Grok 커맨더
// @name:es      X (Twitter) — Grok Comandante
// @name:pt-BR   X (Twitter) — Grok Comandante
// @name:fr      X (Twitter) — Grok Commandant
// @namespace    https://greasyfork.org/en/users/1575945-star-tanuki07?locale_override=1
// @namespace    https://github.com/Startanuki07
// @version      1.2.1
// @license      MIT
// @author       Star_tanuki07
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @connect      discord.com
// @connect      api.telegram.org
// @run-at       document-end
// @description      Replaces the Grok button on every tweet with an AI command menu offering 3 built-in modes (Fact Check, Deep Analysis, Translate) and 2 fully customizable slots. Each mode can be sent to Grok's sidebar drawer or privately via x.com/i/grok. Supports manual or auto-send, multi-language auto-detection, and per-language customizable prompt templates. Ideal for casual users who want quick AI-powered context on trending topics without diving deep.
// @description:zh-TW 將每則推文旁的 Grok 按鈕替換為 AI 指令選單，提供 3 種內建模式（事實查核、深度分析、梗文翻譯）與 2 個完全可自訂的備用槽位。每種模式可發送至側邊欄，或透過 🔒 私人模式跳轉至 x.com/i/grok 保護隱私。支援手動或自動送出、多語言自動偵測與各語言獨立模板自訂。適合偶爾想快速理解時事話題脈絡的一般用戶。
// @description:zh-CN 将每条推文旁的 Grok 按钮替换为 AI 指令菜单，提供 3 种内置模式（事实核查、深度分析、翻译解释）与 2 个完全可自定义的备用槽位。每种模式可发送至侧边栏，或通过 🔒 私密模式跳转至 x.com/i/grok 保护隐私。支持手动或自动发送、多语言自动检测与各语言独立模板自定义。适合偶尔想快速了解热点话题背景的普通用户。
// @description:ja    各ツイートのGrokボタンをAIコマンドメニューに置き換え、3つの内蔵モード（ファクトチェック・詳細分析・翻訳と解説）と2つのカスタムスロットを提供。サイドバーへの送信、または 🔒 プライベートモードで x.com/i/grok へ転送することもできます。手動・自動送信、多言語自動検出、言語別テンプレートカスタマイズに対応。トレンドの話題を気軽に把握したいカジュアルユーザーに最適。
// @description:ko    모든 트윗의 Grok 버튼을 AI 명령 메뉴로 교체하여 3가지 내장 모드（팩트 체크・심층 분석・번역 및 설명）와 2개의 커스텀 슬롯을 제공합니다. 사이드바로 전송하거나 🔒 비공개 모드로 x.com/i/grok 에서 처리할 수 있습니다. 수동/자동 전송, 다국어 자동 감지, 언어별 템플릿 커스터마이즈 지원. 트렌드 주제를 가볍게 파악하고 싶은 일반 사용자에게 적합합니다.
// @description:es    Reemplaza el botón de Grok en cada tweet con un menú de comandos de IA que ofrece 3 modos integrados (Verificación de datos, Análisis profundo, Traducción) y 2 espacios completamente personalizables. Cada modo puede enviarse al panel lateral de Grok o de forma privada mediante x.com/i/grok. Soporta envío manual o automático, detección automática de idioma y plantillas personalizables por idioma.
// @description:pt-BR Substitui o botão do Grok em cada tweet por um menu de comandos de IA com 3 modos integrados (Verificação de fatos, Análise profunda, Tradução) e 2 slots totalmente personalizáveis. Cada modo pode ser enviado ao painel lateral do Grok ou de forma privada via x.com/i/grok. Suporta envio manual ou automático, detecção automática de idioma e modelos personalizáveis por idioma.
// @description:fr    Remplace le bouton Grok sur chaque tweet par un menu de commandes IA proposant 3 modes intégrés (Vérification des faits, Analyse approfondie, Traduction) et 2 emplacements entièrement personnalisables. Chaque mode peut être envoyé au panneau latéral Grok ou en mode privé via x.com/i/grok. Prise en charge de l'envoi manuel ou automatique, de la détection automatique de la langue et de modèles personnalisables par langue.
// ==/UserScript==

(function () {
  "use strict";

  const DEFAULT_CONFIG = {
    lang: "auto",
    ui: {
      "zh-TW": {
        settings_title: "⚙️ 指揮官設定 (Grok Commander)",
        lang_label: "慣用語言 (Language)",
        lang_hint: "切換後，下方模版將重置為該語言預設值。",
        lang_auto: "自動偵測 (Auto)",
        send_mode_label: "送出模式 (Send Mode)",
        send_manual: "🛡️ 手動確認（填入後由使用者送出）",
        send_auto: "🚀 自動送出（填入後自動發送）",
        send_mode_hint: "預設為手動確認，避免誤觸。",
        prompt_label: "提示詞",
        label_label: "標題名稱",
        btn_reset: "恢復預設值",
        btn_cancel: "取消",
        btn_save: "儲存設定",
        confirm_reset: "確定要恢復預設值？這將覆蓋您的自定義模版。",
        alert_saved: "設定已儲存！",
        alert_no_grok: "錯誤：找不到全域 Grok 按鈕。",
        private_tooltip: "私人模式（抽屜內啟用私人聊天）",
        settings_tooltip: "設定 (Settings)",
        commander_btn_label: "Grok 指揮官",
        commander_btn_title: "AI 指揮官（已啟用）",
        need_reopen: "請先點擊右下角的 Grok 按鈕開啟側邊欄，再使用指令選單",
        push_section_label: "📨 推送設定 (Push Notifications)",
        push_enable_discord: "啟用 Discord 推送",
        push_enable_telegram: "啟用 Telegram 推送",
        push_discord_url: "Discord Webhook URL",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Telegram Bot Token",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "Telegram Chat ID",
        push_tg_chat_placeholder: "-100xxxxxxxxxx 或 @頻道名稱",
        push_confirm_title: "確認推送",
        push_confirm_body: "推送此貼文連結？",
        push_confirm_check: "之後不再提示（可在設定中恢復）",
        push_confirm_ok: "推送",
        push_confirm_cancel: "取消",
        push_restore_confirm: "恢復推送確認提示",
        push_not_configured: "尚未設定推送目標，請先開啟設定面板填寫",
        push_btn_tooltip: "推送貼文連結至 Discord Webhook / Telegram Bot",
        push_test: "傳送測試訊息",
        push_test_sending: "傳送中…",
        push_label_placeholder: "頻道名稱（標籤）",
        push_add: "+ 新增",
        push_select_title: "選擇推送目標",
        push_select_hint: "請選擇要推送的頻道",
        push_select_none: "請至少選擇一個頻道",
        push_max_reached: "最多支援 10 組",
        push_result_ok: "✅ 推送成功",
        push_result_fail: "❌ 推送失敗",
        push_url_converter: "推送網址格式",
        push_url_converter_hint: "推送前將 x.com/twitter.com 轉換為指定網域",
      },
      "zh-CN": {
        settings_title: "⚙️ 指挥官设置 (Grok Commander)",
        lang_label: "常用语言 (Language)",
        lang_hint: "切换后，下方模板将重置为该语言默认值。",
        lang_auto: "自动检测 (Auto)",
        send_mode_label: "发送模式 (Send Mode)",
        send_manual: "🛡️ 手动确认（填入后由用户发送）",
        send_auto: "🚀 自动发送（填入后自动发送）",
        send_mode_hint: "默认为手动确认，避免误触。",
        prompt_label: "提示词",
        label_label: "标题名称",
        btn_reset: "恢复默认值",
        btn_cancel: "取消",
        btn_save: "保存设置",
        confirm_reset: "确定要恢复默认值？这将覆盖您的自定义模板。",
        alert_saved: "设置已保存！",
        alert_no_grok: "错误：找不到全局 Grok 按钮。",
        private_tooltip: "私密模式（抽屜内启用私人聊天）",
        settings_tooltip: "设置 (Settings)",
        commander_btn_label: "Grok 指挥官",
        commander_btn_title: "AI 指挥官（已启用）",
        need_reopen: "请先点击右下角的 Grok 按钮打开侧边栏，再使用指令菜单",
        push_section_label: "📨 推送设置 (Push Notifications)",
        push_enable_discord: "启用 Discord 推送",
        push_enable_telegram: "启用 Telegram 推送",
        push_discord_url: "Discord Webhook URL",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Telegram Bot Token",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "Telegram Chat ID",
        push_tg_chat_placeholder: "-100xxxxxxxxxx 或 @频道名",
        push_confirm_title: "确认推送",
        push_confirm_body: "推送此帖子链接？",
        push_confirm_check: "之后不再提示（可在设置中恢复）",
        push_confirm_ok: "推送",
        push_confirm_cancel: "取消",
        push_restore_confirm: "恢复推送确认提示",
        push_not_configured: "尚未设置推送目标，请先打开设置面板填写",
        push_btn_tooltip: "推送帖子链接至 Discord Webhook / Telegram Bot",
        push_test: "发送测试消息",
        push_test_sending: "发送中…",
        push_label_placeholder: "频道名称（标签）",
        push_add: "+ 新增",
        push_select_title: "选择推送目标",
        push_select_hint: "请选择要推送的频道",
        push_select_none: "请至少选择一个频道",
        push_max_reached: "最多支持 10 组",
        push_result_ok: "✅ 推送成功",
        push_result_fail: "❌ 推送失败",
        push_url_converter: "推送网址格式",
        push_url_converter_hint: "推送前将 x.com/twitter.com 转换为指定域名",
      },
      en: {
        settings_title: "⚙️ Commander Settings (Grok Commander)",
        lang_label: "Language",
        lang_hint:
          "Switching will reset the templates below to the default for that language.",
        lang_auto: "Auto Detect",
        send_mode_label: "Send Mode",
        send_manual: "🛡️ Manual (fill only, user sends)",
        send_auto: "🚀 Auto Send (send automatically after filling)",
        send_mode_hint: "Default is manual to avoid accidental sends.",
        prompt_label: "Prompt",
        label_label: "Label",
        btn_reset: "Reset to Defaults",
        btn_cancel: "Cancel",
        btn_save: "Save Settings",
        confirm_reset:
          "Reset to defaults? This will overwrite your custom templates.",
        alert_saved: "Settings saved!",
        alert_no_grok: "Error: Global Grok button not found.",
        private_tooltip: "Private Mode (enable private chat in drawer)",
        settings_tooltip: "Settings",
        commander_btn_label: "Grok Commander",
        commander_btn_title: "AI Commander (Active)",
        need_reopen: "Please click the Grok button (bottom-right) to open the sidebar first, then use the command menu",
        push_section_label: "📨 Push Notifications",
        push_enable_discord: "Enable Discord Push",
        push_enable_telegram: "Enable Telegram Push",
        push_discord_url: "Discord Webhook URL",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Telegram Bot Token",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "Telegram Chat ID",
        push_tg_chat_placeholder: "-100xxxxxxxxxx or @channelname",
        push_confirm_title: "Confirm Push",
        push_confirm_body: "Push this tweet link?",
        push_confirm_check: "Don't ask again (can be restored in Settings)",
        push_confirm_ok: "Push",
        push_confirm_cancel: "Cancel",
        push_restore_confirm: "Restore push confirmation prompt",
        push_not_configured: "No push target configured. Please open Settings first.",
        push_btn_tooltip: "Push tweet link via Discord Webhook / Telegram Bot",
        push_test: "Send Test Message",
        push_test_sending: "Sending…",
        push_label_placeholder: "Channel name (label)",
        push_add: "+ Add",
        push_select_title: "Select Push Targets",
        push_select_hint: "Choose channels to push to",
        push_select_none: "Please select at least one channel",
        push_max_reached: "Maximum 10 entries supported",
        push_result_ok: "✅ Push sent",
        push_result_fail: "❌ Push failed",
        push_url_converter: "URL Format",
        push_url_converter_hint: "Convert x.com/twitter.com to the selected domain before pushing",
      },
      ja: {
        settings_title: "⚙️ コマンダー設定 (Grok Commander)",
        lang_label: "言語設定 (Language)",
        lang_hint:
          "切り替えると、下のテンプレートがその言語のデフォルトにリセットされます。",
        lang_auto: "自動検出 (Auto)",
        send_mode_label: "送信モード (Send Mode)",
        send_manual: "🛡️ 手動確認（入力後、ユーザーが送信）",
        send_auto: "🚀 自動送信（入力後、自動送信）",
        send_mode_hint: "デフォルトは手動確認で誤送信を防ぎます。",
        prompt_label: "プロンプト",
        label_label: "タイトル",
        btn_reset: "デフォルトに戻す",
        btn_cancel: "キャンセル",
        btn_save: "設定を保存",
        confirm_reset:
          "デフォルトに戻しますか？カスタムテンプレートが上書きされます。",
        alert_saved: "設定を保存しました！",
        alert_no_grok: "エラー：グローバル Grok ボタンが見つかりません。",
        private_tooltip: "プライベートモード（ドロワー内でプライベートチャットを有効化）",
        settings_tooltip: "設定 (Settings)",
        commander_btn_label: "Grok コマンダー",
        commander_btn_title: "AI コマンダー（有効）",
        need_reopen: "右下のGrokボタンをクリックしてサイドバーを開いてから、コマンドメニューをご利用ください",
        push_section_label: "📨 プッシュ通知設定",
        push_enable_discord: "Discord プッシュを有効化",
        push_enable_telegram: "Telegram プッシュを有効化",
        push_discord_url: "Discord Webhook URL",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Telegram Bot Token",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "Telegram Chat ID",
        push_tg_chat_placeholder: "-100xxxxxxxxxx または @チャンネル名",
        push_confirm_title: "プッシュ確認",
        push_confirm_body: "この投稿リンクをプッシュしますか？",
        push_confirm_check: "今後確認しない（設定で復元可能）",
        push_confirm_ok: "送信",
        push_confirm_cancel: "キャンセル",
        push_restore_confirm: "プッシュ確認ダイアログを復元",
        push_not_configured: "プッシュ先が未設定です。設定を開いて入力してください",
        push_btn_tooltip: "Discord Webhook / Telegram Bot へ投稿リンクを送信",
        push_test: "テストメッセージを送信",
        push_test_sending: "送信中…",
        push_label_placeholder: "チャンネル名（ラベル）",
        push_add: "+ 追加",
        push_select_title: "送信先を選択",
        push_select_hint: "送信するチャンネルを選択してください",
        push_select_none: "少なくとも1つ選択してください",
        push_max_reached: "最大10件まで登録できます",
        push_result_ok: "✅ 送信成功",
        push_result_fail: "❌ 送信失敗",
        push_url_converter: "URL フォーマット",
        push_url_converter_hint: "送信前に x.com/twitter.com を指定ドメインに変換します",
      },
      ko: {
        settings_title: "⚙️ 커맨더 설정 (Grok Commander)",
        lang_label: "언어 설정 (Language)",
        lang_hint:
          "전환하면 아래 템플릿이 해당 언어의 기본값으로 재설정됩니다.",
        lang_auto: "자동 감지 (Auto)",
        send_mode_label: "전송 모드 (Send Mode)",
        send_manual: "🛡️ 수동 확인（입력 후 사용자가 전송）",
        send_auto: "🚀 자동 전송（입력 후 자동 전송）",
        send_mode_hint: "기본값은 수동 확인으로 오발송을 방지합니다.",
        prompt_label: "프롬프트",
        label_label: "제목",
        btn_reset: "기본값으로 재설정",
        btn_cancel: "취소",
        btn_save: "설정 저장",
        confirm_reset:
          "기본값으로 재설정하시겠습니까? 커스텀 템플릿이 덮어쓰여집니다.",
        alert_saved: "설정이 저장되었습니다！",
        alert_no_grok: "오류: 전역 Grok 버튼을 찾을 수 없습니다.",
        private_tooltip: "비공개 모드（드로어 내 비공개 채팅 활성화）",
        settings_tooltip: "설정 (Settings)",
        commander_btn_label: "Grok 커맨더",
        commander_btn_title: "AI 커맨더（활성화）",
        need_reopen: "오른쪽 하단의 Grok 버튼을 클릭하여 사이드바를 먼저 열고 명령 메뉴를 사용하세요",
        push_section_label: "📨 푸시 알림 설정",
        push_enable_discord: "Discord 푸시 활성화",
        push_enable_telegram: "Telegram 푸시 활성화",
        push_discord_url: "Discord Webhook URL",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Telegram Bot Token",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "Telegram Chat ID",
        push_tg_chat_placeholder: "-100xxxxxxxxxx 또는 @채널명",
        push_confirm_title: "푸시 확인",
        push_confirm_body: "이 트윗 링크를 푸시하시겠습니까？",
        push_confirm_check: "다시 묻지 않음（설정에서 복원 가능）",
        push_confirm_ok: "전송",
        push_confirm_cancel: "취소",
        push_restore_confirm: "푸시 확인 메시지 복원",
        push_not_configured: "푸시 대상이 설정되지 않았습니다. 설정 패널을 열어 입력해주세요",
        push_btn_tooltip: "Discord Webhook / Telegram Bot으로 트윗 링크 전송",
        push_test: "테스트 메시지 전송",
        push_test_sending: "전송 중…",
        push_label_placeholder: "채널 이름 (라벨)",
        push_add: "+ 추가",
        push_select_title: "푸시 대상 선택",
        push_select_hint: "전송할 채널을 선택하세요",
        push_select_none: "최소 하나의 채널을 선택하세요",
        push_max_reached: "최대 10개까지 등록 가능합니다",
        push_result_ok: "✅ 전송 성공",
        push_result_fail: "❌ 전송 실패",
        push_url_converter: "URL 형식",
        push_url_converter_hint: "전송 전에 x.com/twitter.com을 지정 도메인으로 변환합니다",
      },
      es: {
        settings_title: "⚙️ Configuración del Comandante (Grok Commander)",
        lang_label: "Idioma (Language)",
        lang_hint: "Al cambiar, las plantillas de abajo se restablecerán al idioma seleccionado.",
        lang_auto: "Detección automática (Auto)",
        send_mode_label: "Modo de envío (Send Mode)",
        send_manual: "🛡️ Manual (solo rellenar, el usuario envía)",
        send_auto: "🚀 Automático (enviar automáticamente al rellenar)",
        send_mode_hint: "Por defecto es manual para evitar envíos accidentales.",
        prompt_label: "Indicación",
        label_label: "Etiqueta",
        btn_reset: "Restablecer valores predeterminados",
        btn_cancel: "Cancelar",
        btn_save: "Guardar configuración",
        confirm_reset: "¿Restablecer valores predeterminados? Esto sobrescribirá sus plantillas personalizadas.",
        alert_saved: "¡Configuración guardada!",
        alert_no_grok: "Error: no se encontró el botón global de Grok.",
        private_tooltip: "Modo privado (activar chat privado en el panel)",
        settings_tooltip: "Configuración",
        commander_btn_label: "Grok Comandante",
        commander_btn_title: "Comandante IA (Activo)",
        need_reopen: "Haz clic en el botón de Grok (abajo a la derecha) para abrir el panel lateral primero y luego usa el menú de comandos",
        push_section_label: "📨 Notificaciones push",
        push_enable_discord: "Activar push de Discord",
        push_enable_telegram: "Activar push de Telegram",
        push_discord_url: "URL de Discord Webhook",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Token del Bot de Telegram",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "ID de Chat de Telegram",
        push_tg_chat_placeholder: "-100xxxxxxxxxx o @nombrecanal",
        push_confirm_title: "Confirmar envío",
        push_confirm_body: "¿Enviar el enlace de este tweet?",
        push_confirm_check: "No volver a preguntar (se puede restaurar en Configuración)",
        push_confirm_ok: "Enviar",
        push_confirm_cancel: "Cancelar",
        push_restore_confirm: "Restaurar confirmación de envío push",
        push_not_configured: "No hay destino de push configurado. Abre Configuración primero.",
        push_btn_tooltip: "Enviar enlace del tweet vía Discord Webhook / Telegram Bot",
        push_test: "Enviar mensaje de prueba",
        push_test_sending: "Enviando…",
        push_label_placeholder: "Nombre del canal (etiqueta)",
        push_add: "+ Añadir",
        push_select_title: "Seleccionar destinos de push",
        push_select_hint: "Elige los canales a los que enviar",
        push_select_none: "Por favor selecciona al menos un canal",
        push_max_reached: "Máximo 10 entradas admitidas",
        push_result_ok: "✅ Envío exitoso",
        push_result_fail: "❌ Envío fallido",
        push_url_converter: "Formato de URL",
        push_url_converter_hint: "Convierte x.com/twitter.com al dominio seleccionado antes de enviar",
      },
      "pt-BR": {
        settings_title: "⚙️ Configurações do Comandante (Grok Commander)",
        lang_label: "Idioma (Language)",
        lang_hint: "Ao trocar, os modelos abaixo serão redefinidos para o padrão do idioma selecionado.",
        lang_auto: "Detecção automática (Auto)",
        send_mode_label: "Modo de envio (Send Mode)",
        send_manual: "🛡️ Manual (apenas preencher, o usuário envia)",
        send_auto: "🚀 Automático (enviar automaticamente ao preencher)",
        send_mode_hint: "O padrão é manual para evitar envios acidentais.",
        prompt_label: "Prompt",
        label_label: "Rótulo",
        btn_reset: "Restaurar padrões",
        btn_cancel: "Cancelar",
        btn_save: "Salvar configurações",
        confirm_reset: "Restaurar padrões? Isso sobrescreverá seus modelos personalizados.",
        alert_saved: "Configurações salvas!",
        alert_no_grok: "Erro: botão global do Grok não encontrado.",
        private_tooltip: "Modo privado (ativar chat privado no painel)",
        settings_tooltip: "Configurações",
        commander_btn_label: "Grok Comandante",
        commander_btn_title: "Comandante IA (Ativo)",
        need_reopen: "Clique no botão do Grok (canto inferior direito) para abrir o painel lateral primeiro e depois use o menu de comandos",
        push_section_label: "📨 Notificações push",
        push_enable_discord: "Ativar push do Discord",
        push_enable_telegram: "Ativar push do Telegram",
        push_discord_url: "URL do Discord Webhook",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Token do Bot do Telegram",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "ID do Chat do Telegram",
        push_tg_chat_placeholder: "-100xxxxxxxxxx ou @nomecanal",
        push_confirm_title: "Confirmar envio",
        push_confirm_body: "Enviar o link deste tweet?",
        push_confirm_check: "Não perguntar novamente (pode ser restaurado em Configurações)",
        push_confirm_ok: "Enviar",
        push_confirm_cancel: "Cancelar",
        push_restore_confirm: "Restaurar confirmação de push",
        push_not_configured: "Nenhum destino de push configurado. Abra as Configurações primeiro.",
        push_btn_tooltip: "Enviar link do tweet via Discord Webhook / Telegram Bot",
        push_test: "Enviar mensagem de teste",
        push_test_sending: "Enviando…",
        push_label_placeholder: "Nome do canal (rótulo)",
        push_add: "+ Adicionar",
        push_select_title: "Selecionar destinos de push",
        push_select_hint: "Escolha os canais para enviar",
        push_select_none: "Por favor, selecione pelo menos um canal",
        push_max_reached: "Máximo de 10 entradas suportadas",
        push_result_ok: "✅ Envio bem-sucedido",
        push_result_fail: "❌ Falha no envio",
        push_url_converter: "Formato de URL",
        push_url_converter_hint: "Converte x.com/twitter.com para o domínio selecionado antes de enviar",
      },
      fr: {
        settings_title: "⚙️ Paramètres du Commandant (Grok Commander)",
        lang_label: "Langue (Language)",
        lang_hint: "En changeant, les modèles ci-dessous seront réinitialisés aux valeurs par défaut de la langue sélectionnée.",
        lang_auto: "Détection automatique (Auto)",
        send_mode_label: "Mode d'envoi (Send Mode)",
        send_manual: "🛡️ Manuel (remplir seulement, l'utilisateur envoie)",
        send_auto: "🚀 Automatique (envoyer automatiquement après remplissage)",
        send_mode_hint: "Par défaut en manuel pour éviter les envois accidentels.",
        prompt_label: "Invite",
        label_label: "Étiquette",
        btn_reset: "Rétablir les valeurs par défaut",
        btn_cancel: "Annuler",
        btn_save: "Enregistrer les paramètres",
        confirm_reset: "Rétablir les valeurs par défaut ? Cela écrasera vos modèles personnalisés.",
        alert_saved: "Paramètres enregistrés !",
        alert_no_grok: "Erreur : bouton Grok global introuvable.",
        private_tooltip: "Mode privé (activer le chat privé dans le panneau)",
        settings_tooltip: "Paramètres",
        commander_btn_label: "Grok Commandant",
        commander_btn_title: "Commandant IA (Actif)",
        need_reopen: "Cliquez sur le bouton Grok (en bas à droite) pour ouvrir le panneau latéral d'abord, puis utilisez le menu de commandes",
        push_section_label: "📨 Notifications push",
        push_enable_discord: "Activer les push Discord",
        push_enable_telegram: "Activer les push Telegram",
        push_discord_url: "URL du Webhook Discord",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Token du Bot Telegram",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "ID du Chat Telegram",
        push_tg_chat_placeholder: "-100xxxxxxxxxx ou @nomcanal",
        push_confirm_title: "Confirmer l'envoi",
        push_confirm_body: "Envoyer le lien de ce tweet ?",
        push_confirm_check: "Ne plus demander (restaurable dans les Paramètres)",
        push_confirm_ok: "Envoyer",
        push_confirm_cancel: "Annuler",
        push_restore_confirm: "Restaurer la confirmation d'envoi push",
        push_not_configured: "Aucune cible push configurée. Ouvrez d'abord les Paramètres.",
        push_btn_tooltip: "Envoyer le lien du tweet via Discord Webhook / Telegram Bot",
        push_test: "Envoyer un message de test",
        push_test_sending: "Envoi en cours…",
        push_label_placeholder: "Nom du canal (étiquette)",
        push_add: "+ Ajouter",
        push_select_title: "Sélectionner les cibles push",
        push_select_hint: "Choisissez les canaux auxquels envoyer",
        push_select_none: "Veuillez sélectionner au moins un canal",
        push_max_reached: "Maximum 10 entrées supportées",
        push_result_ok: "✅ Envoi réussi",
        push_result_fail: "❌ Échec de l'envoi",
        push_url_converter: "Format d'URL",
        push_url_converter_hint: "Convertit x.com/twitter.com vers le domaine sélectionné avant l'envoi",
      },
    },
    templates: {
      "zh-TW": {
        factcheck: {
          label: "事實查核",
          icon: "🕵️",
          prompt:
            "【指令：請進行事實查核】\n請詳細分析以下這則貼文的真實性，指出可能的錯誤、誤導資訊或缺乏證據的地方，並提供正確的背景脈絡：\n\n",
        },
        analysis: {
          label: "深度分析",
          icon: "📊",
          prompt:
            "【指令：深度分析】\n請擔任資深的社群觀察家，解析這則推文。請分析其潛在的語氣、情緒導向、目標受眾，以及發文者可能隱含的動機或立場：\n\n",
        },
        translate: {
          label: "梗文翻譯",
          icon: "🌐",
          prompt:
            "【指令：翻譯與解釋】\n請將這則推文翻譯成通順、道地的台灣繁體中文（口語化）。如果內容包含網路流行語、迷因（Meme）或文化梗，請務必補充解釋其背景含義：\n\n",
        },
        tree: {
          label: "自訂模式 1",
          icon: "✏️",
          prompt:
            "（這是可自訂的模式，請在設定中修改標題和提示詞）\n\n請用一段話簡單說明這則推文在討論什麼，以及為什麼值得關注：\n\n",
        },
        solution: {
          label: "自訂模式 2",
          icon: "✏️",
          prompt:
            "（這是可自訂的模式，請在設定中修改標題和提示詞）\n\n請針對這則推文，提出你認為最有趣或值得深入探討的問題：\n\n",
        },
      },
      "zh-CN": {
        factcheck: {
          label: "事实核查",
          icon: "🕵️",
          prompt:
            "【指令：请进行事实核查】\n请详细分析以下这则帖子的真实性，指出可能的错误、误导信息或缺乏证据的地方，并提供正确的背景脉络：\n\n",
        },
        analysis: {
          label: "深度分析",
          icon: "📊",
          prompt:
            "【指令：深度分析】\n请担任资深的社群观察家，解析这则推文。请分析其潜在的语气、情绪导向、目标受众，以及发文者可能隐含的动机或立场：\n\n",
        },
        translate: {
          label: "推文翻译",
          icon: "🌐",
          prompt:
            "【指令：翻译与解释】\n请将这则推文翻译成通顺、地道的简体中文。如果内容包含网络流行语、迷因（Meme）或文化梗，请务必补充解释其背景含义：\n\n",
        },
        tree: {
          label: "自定模式 1",
          icon: "✏️",
          prompt:
            "（这是可自定义的模式，请在设置中修改标题和提示词）\n\n请用一段话简单说明这则帖子在讨论什么，以及为什么值得关注：\n\n",
        },
        solution: {
          label: "自定模式 2",
          icon: "✏️",
          prompt:
            "（这是可自定义的模式，请在设置中修改标题和提示词）\n\n请针对这则帖子，提出你认为最有趣或值得深入探讨的问题：\n\n",
        },
      },
      en: {
        factcheck: {
          label: "Fact Check",
          icon: "🕵️",
          prompt:
            "[Instruction: Fact Check]\nPlease conduct a detailed fact-check on the following tweet. Point out potential errors, misleading information, or lack of evidence, and provide the correct context:\n\n",
        },
        analysis: {
          label: "Deep Analysis",
          icon: "📊",
          prompt:
            "[Instruction: Deep Analysis]\nAct as a social media observer. Analyze this tweet for its tone, emotional direction, target audience, and any implied motives or stances of the author:\n\n",
        },
        translate: {
          label: "Translate",
          icon: "🌐",
          prompt:
            "[Instruction: Translate]\nPlease translate this tweet into fluent English. If it contains internet slang, memes, or cultural references, please explain their background meaning:\n\n",
        },
        tree: {
          label: "Custom 1",
          icon: "✏️",
          prompt:
            "(This is a customizable mode. Edit the label and prompt in Settings.)\n\nIn one paragraph, briefly explain what this tweet is discussing and why it matters:\n\n",
        },
        solution: {
          label: "Custom 2",
          icon: "✏️",
          prompt:
            "(This is a customizable mode. Edit the label and prompt in Settings.)\n\nWhat is the most interesting or thought-provoking question raised by this tweet?\n\n",
        },
      },
      ja: {
        factcheck: {
          label: "ファクトチェック",
          icon: "🕵️",
          prompt:
            "【指令：ファクトチェック】\n以下の投稿の真偽を詳細に分析し、誤りや誤解を招く情報、証拠不足の点を指摘し、正しい背景情報を提供してください：\n\n",
        },
        analysis: {
          label: "詳細分析",
          icon: "📊",
          prompt:
            "【指令：詳細分析】\nソーシャルメディアの観察者として、このツイートを分析してください。潜在的なトーン、感情の方向性、ターゲット層、そして投稿者の隠された動機や立場を解析してください：\n\n",
        },
        translate: {
          label: "翻訳と解説",
          icon: "🌐",
          prompt:
            "【指令：翻訳と解説】\nこのツイートを自然で流暢な日本語に翻訳してください。ネットスラング、ミーム（Meme）、または文化的背景が含まれている場合は、その意味や背景も必ず補足説明してください：\n\n",
        },
        tree: {
          label: "カスタム 1",
          icon: "✏️",
          prompt:
            "（カスタマイズ可能なモードです。設定でタイトルとプロンプトを変更してください）\n\nこのツイートが何を議論しているか、なぜ注目すべきかを一段落で簡単に説明してください：\n\n",
        },
        solution: {
          label: "カスタム 2",
          icon: "✏️",
          prompt:
            "（カスタマイズ可能なモードです。設定でタイトルとプロンプトを変更してください）\n\nこのツイートで最も興味深い、または深く考えさせられる点は何ですか？\n\n",
        },
      },
      ko: {
        factcheck: {
          label: "팩트 체크",
          icon: "🕵️",
          prompt:
            "【명령: 팩트 체크】\n다음 트윗의 진위 여부를 자세히 분석하고, 오류, 오해의 소지가 있는 정보 또는 증거 부족 부분을 지적하며 올바른 배경 정보를 제공하십시오:\n\n",
        },
        analysis: {
          label: "심층 분석",
          icon: "📊",
          prompt:
            "【명령: 심층 분석】\n소셜 미디어 관찰자로서 이 트윗을 분석하십시오. 잠재적인 어조, 감정 방향, 타겟 청중, 그리고 작성자의 내재된 동기나 입장을 분석해 주십시오:\n\n",
        },
        translate: {
          label: "번역 및 설명",
          icon: "🌐",
          prompt:
            "【명령: 번역 및 설명】\n이 트윗을 자연스럽고 유창한 한국어로 번역하십시오. 인터넷 속어, 밈(Meme) 또는 문화적 맥락이 포함된 경우 그 배경 의미도 반드시 보충 설명해 주십시오:\n\n",
        },
        tree: {
          label: "커스텀 1",
          icon: "✏️",
          prompt:
            "（커스터마이즈 가능한 모드입니다. 설정에서 제목과 프롬프트를 수정하세요）\n\n이 트윗이 무엇을 논의하고 있는지, 왜 주목할 만한지 한 단락으로 간단히 설명해 주세요：\n\n",
        },
        solution: {
          label: "커스텀 2",
          icon: "✏️",
          prompt:
            "（커스터마이즈 가능한 모드입니다. 설정에서 제목과 프롬프트를 수정하세요）\n\n이 트윗에서 가장 흥미롭거나 깊이 생각해볼 만한 점은 무엇인가요？\n\n",
        },
      },
      es: {
        factcheck: {
          label: "Verificar datos",
          icon: "🕵️",
          prompt:
            "[Instrucción: Verificación de datos]\nRealiza una verificación detallada de los hechos del siguiente tweet. Señala posibles errores, información engañosa o falta de evidencia, y proporciona el contexto correcto:\n\n",
        },
        analysis: {
          label: "Análisis profundo",
          icon: "📊",
          prompt:
            "[Instrucción: Análisis profundo]\nActúa como un observador experto de redes sociales. Analiza este tweet en cuanto a su tono, dirección emocional, audiencia objetivo y los posibles motivos o posturas implícitas del autor:\n\n",
        },
        translate: {
          label: "Traducir",
          icon: "🌐",
          prompt:
            "[Instrucción: Traducir]\nTraduce este tweet al español fluido y natural. Si contiene jerga de internet, memes o referencias culturales, explica su significado y contexto:\n\n",
        },
        tree: {
          label: "Personalizado 1",
          icon: "✏️",
          prompt:
            "(Este es un modo personalizable. Edita la etiqueta y la indicación en Configuración.)\n\nEn un párrafo, explica brevemente de qué trata este tweet y por qué es importante:\n\n",
        },
        solution: {
          label: "Personalizado 2",
          icon: "✏️",
          prompt:
            "(Este es un modo personalizable. Edita la etiqueta y la indicación en Configuración.)\n\n¿Cuál es la pregunta más interesante o reflexiva que plantea este tweet?\n\n",
        },
      },
      "pt-BR": {
        factcheck: {
          label: "Verificar fatos",
          icon: "🕵️",
          prompt:
            "[Instrução: Verificação de fatos]\nRealize uma verificação detalhada dos fatos do seguinte tweet. Aponte possíveis erros, informações enganosas ou falta de evidências, e forneça o contexto correto:\n\n",
        },
        analysis: {
          label: "Análise profunda",
          icon: "📊",
          prompt:
            "[Instrução: Análise profunda]\nAja como um observador experiente de redes sociais. Analise este tweet quanto ao seu tom, direção emocional, público-alvo e possíveis motivos ou posições implícitas do autor:\n\n",
        },
        translate: {
          label: "Traduzir",
          icon: "🌐",
          prompt:
            "[Instrução: Traduzir]\nTraduzir este tweet para o português brasileiro fluente e natural. Se contiver gírias de internet, memes ou referências culturais, explique seu significado e contexto:\n\n",
        },
        tree: {
          label: "Personalizado 1",
          icon: "✏️",
          prompt:
            "(Este é um modo personalizável. Edite o rótulo e o prompt em Configurações.)\n\nEm um parágrafo, explique brevemente o que este tweet está discutindo e por que é importante:\n\n",
        },
        solution: {
          label: "Personalizado 2",
          icon: "✏️",
          prompt:
            "(Este é um modo personalizável. Edite o rótulo e o prompt em Configurações.)\n\nQual é a pergunta mais interessante ou reflexiva levantada por este tweet?\n\n",
        },
      },
      fr: {
        factcheck: {
          label: "Vérifier les faits",
          icon: "🕵️",
          prompt:
            "[Instruction : Vérification des faits]\nEffectuez une vérification détaillée des faits du tweet suivant. Signalez les erreurs potentielles, les informations trompeuses ou le manque de preuves, et fournissez le contexte correct :\n\n",
        },
        analysis: {
          label: "Analyse approfondie",
          icon: "📊",
          prompt:
            "[Instruction : Analyse approfondie]\nAgissez en tant qu'observateur expert des réseaux sociaux. Analysez ce tweet en termes de ton, de direction émotionnelle, de public cible et des motifs ou positions implicites de l'auteur :\n\n",
        },
        translate: {
          label: "Traduire",
          icon: "🌐",
          prompt:
            "[Instruction : Traduire]\nTraduisez ce tweet en français courant et naturel. S'il contient du jargon internet, des mèmes ou des références culturelles, expliquez leur signification et leur contexte :\n\n",
        },
        tree: {
          label: "Personnalisé 1",
          icon: "✏️",
          prompt:
            "(Ceci est un mode personnalisable. Modifiez l'étiquette et l'invite dans les Paramètres.)\n\nEn un paragraphe, expliquez brièvement ce dont ce tweet traite et pourquoi c'est important :\n\n",
        },
        solution: {
          label: "Personnalisé 2",
          icon: "✏️",
          prompt:
            "(Ceci est un mode personnalisable. Modifiez l'étiquette et l'invite dans les Paramètres.)\n\nQuelle est la question la plus intéressante ou stimulante soulevée par ce tweet ?\n\n",
        },
      },
    },
  };

  function loadConfig() {
    const saved = GM_getValue("grok_user_config", null);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("[Commander] Config corrupted, resetting.", e);
        GM_setValue("grok_user_config", null);
      }
    }
    return { lang: "auto", autoSend: false, customTemplates: null };
  }

  function saveConfig(config) {
    GM_setValue("grok_user_config", JSON.stringify(config));
  }

  function resolveLang(langCode) {
    if (langCode === "custom") return "custom";
    if (langCode !== "auto") return langCode;
    const b = (navigator.language || navigator.userLanguage).toLowerCase();
    if (b.includes("zh-tw") || b.includes("hk")) return "zh-TW";
    if (b.includes("zh")) return "zh-CN";
    if (b.includes("ja")) return "ja";
    if (b.includes("ko")) return "ko";
    if (b.includes("pt")) return "pt-BR";
    if (b.includes("fr")) return "fr";
    if (b.includes("es")) return "es";
    return "en";
  }

  function loadCustomLangPack() {
    try {
      const raw = GM_getValue("grok_custom_lang_pack", null);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("[Commander] Custom lang pack corrupted.", e);
      return null;
    }
  }

  function saveCustomLangPack(pack) {
    GM_setValue("grok_custom_lang_pack", JSON.stringify(pack));
  }

  function t(key) {
    const lang = resolveLang(loadConfig().lang || "auto");
    if (lang === "custom") {
      const pack = loadCustomLangPack();
      if (pack && pack.ui && pack.ui[key] !== undefined) return pack.ui[key];
      return DEFAULT_CONFIG.ui["en"][key] || key;
    }
    const dict = DEFAULT_CONFIG.ui[lang] || DEFAULT_CONFIG.ui["en"];
    return dict[key] || DEFAULT_CONFIG.ui["en"][key] || key;
  }

  function getCurrentTemplates() {
    const config = loadConfig();
    const lang = resolveLang(config.lang);

    if (lang === "custom") {
      const pack = loadCustomLangPack();
      const base = (pack && pack.templates) ? pack.templates : DEFAULT_CONFIG.templates["en"];
      if (config.customTemplates && config.customTemplates._lang === "custom") {
        return config.customTemplates;
      }
      return base;
    }

    const defaults =
      DEFAULT_CONFIG.templates[lang] || DEFAULT_CONFIG.templates["en"];
    if (config.customTemplates && config.customTemplates._lang === lang) {
      return config.customTemplates;
    }
    return defaults;
  }

  const STYLES = `
        #grok-commander-menu {
            position: fixed; z-index: 99990;
            background-color: #000000; border: 1px solid #333639;
            border-radius: 12px; box-shadow: 0 8px 16px rgba(255, 255, 255, 0.1);
            padding: 8px; display: flex; flex-direction: column; gap: 4px;
            min-width: 170px; font-family: sans-serif;
            animation: fadeIn 0.15s ease-out;
        }
        .grok-menu-item {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 12px; color: #E7E9EA; font-size: 14px;
            border-radius: 8px; cursor: pointer; user-select: none;
            transition: background 0.1s;
        }
        .grok-menu-item:hover { background-color: #1D9BF0; color: #fff; }
        .grok-menu-item-label { flex: 1; }
        .grok-private-btn {
            font-size: 13px; padding: 2px 6px; border-radius: 5px;
            color: #1d9bf0; cursor: pointer; flex-shrink: 0;
            transition: background 0.1s, color 0.1s;
            border: 1px solid #1d9bf0;
            background: rgba(29,155,240,0.08);
            line-height: 1;
            display: inline-flex; align-items: center; justify-content: center;
        }
        .grok-private-btn:hover { background: rgba(139,92,246,0.2); color: #a78bfa; border-color: #a78bfa; }
        .grok-menu-footer {
            margin-top: 4px; border-top: 1px solid #333; padding-top: 4px;
            display: flex; justify-content: space-between; align-items: center;
        }
        .grok-settings-btn {
            padding: 4px 8px; font-size: 18px; cursor: pointer;
            color: #71767B; border-radius: 4px;
        }
        .grok-settings-btn:hover { background-color: rgba(255,255,255,0.1); color: #fff; }
        .grok-lang-quick-btn {
            padding: 3px 8px; font-size: 12px; cursor: pointer;
            color: #71767B; border-radius: 4px; border: 1px solid #333;
            background: transparent; line-height: 1.4;
            transition: background 0.1s, color 0.1s;
        }
        .grok-lang-quick-btn:hover { background: rgba(29,155,240,0.15); color: #1D9BF0; border-color: #1D9BF0; }
        .grok-lang-submenu {
            border-top: 1px solid #333; padding-top: 4px; margin-top: 4px;
            display: flex; flex-direction: column; gap: 2px;
        }
        .grok-lang-submenu-item {
            padding: 6px 12px; font-size: 13px; color: #E7E9EA;
            border-radius: 6px; cursor: pointer; transition: background 0.1s;
        }
        .grok-lang-submenu-item:hover { background: rgba(29,155,240,0.2); color: #1D9BF0; }
        .grok-lang-submenu-item.active { color: #1D9BF0; font-weight: bold; }

        .grok-push-btn {
            font-size: 13px; padding: 2px 6px; border-radius: 5px;
            color: #71767B; cursor: pointer; flex-shrink: 0;
            transition: background 0.1s, color 0.1s;
            border: 1px solid #333; background: transparent; line-height: 1;
        }
        .grok-push-btn:hover { background: rgba(29,155,240,0.2); color: #1D9BF0; border-color: #1D9BF0; }

        
        #grok-push-confirm-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.55); z-index: 2147483640;
            display: flex; justify-content: center; align-items: center;
        }
        #grok-push-confirm-box {
            background: #16181C; border: 1px solid #2f3336; border-radius: 16px;
            padding: 24px; width: 320px; max-width: 90%;
            font-family: sans-serif; color: #E7E9EA;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
        }
        #grok-push-confirm-box h3 { margin: 0 0 12px; font-size: 16px; color: #fff; }
        #grok-push-confirm-box p  { margin: 0 0 16px; font-size: 13px; color: #8899A6; word-break: break-all; }
        .grok-push-confirm-check  { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #536471; margin-bottom: 20px; cursor: pointer; }
        .grok-push-confirm-check input { cursor: pointer; }
        .grok-push-confirm-btns   { display: flex; gap: 10px; justify-content: flex-end; }

        
        #grok-settings-overlay {
            all: initial !important;
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            background: rgba(0,0,0,0.6) !important;
            z-index: 2147483640 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            font-family: sans-serif !important;
            box-sizing: border-box !important;
        }
        #grok-settings-modal {
            all: initial !important;
            background: #0d1117 !important;
            border: 1px solid #2f3336 !important;
            border-radius: 16px !important;
            width: min(500px, 94vw) !important;
            height: min(88vh, 820px) !important;
            display: flex !important;
            flex-direction: column !important;
            color: #E7E9EA !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.95) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            animation: gcModalIn 0.18s ease-out !important;
        }
        @keyframes gcModalIn {
            from { opacity: 0; transform: scale(0.96) translateY(8px); }
            to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .grok-modal-header {
            padding: 16px 20px !important;
            border-bottom: 1px solid #1e2532 !important;
            font-size: 15px !important; font-weight: 700 !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
            color: #fff !important;
            background: #0d1117 !important;
        }
        .grok-modal-body {
            padding: 16px 20px !important;
            overflow-y: auto !important;
            flex: 1 !important;
            box-sizing: border-box !important;
            color: #E7E9EA !important;
            min-height: 0 !important;
            background: #080b10 !important;
        }
        .grok-modal-footer {
            padding: 12px 20px !important;
            border-top: 1px solid #1e2532 !important;
            display: flex !important;
            justify-content: flex-end !important;
            gap: 8px !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
            background: #0d1117 !important;
        }

        
        .grok-section-card {
            border: 1px solid #1e2532;
            border-radius: 12px;
            margin-bottom: 14px;
            overflow: hidden;
            background: #0d1117;
        }
        .grok-section-header {
            padding: 9px 16px;
            background: #111827;
            font-size: 10px; font-weight: 700; color: #4a90d9;
            letter-spacing: 1px; text-transform: uppercase;
            border-bottom: 1px solid #1e2532;
            display: flex; align-items: center; gap: 6px;
        }
        .grok-section-body {
            padding: 14px 16px;
            display: flex; flex-direction: column; gap: 12px;
        }

        
        .grok-form-row { display: flex; flex-direction: column; gap: 5px; }
        .grok-form-label { font-size: 12px; font-weight: 600; color: #8899A6; }
        .grok-form-hint  { font-size: 11px; color: #3d4a55; margin-top: 2px; line-height: 1.5; }
        .grok-input-select {
            width: 100%; background: #16181C; border: 1px solid #2f3336;
            color: #E7E9EA; padding: 8px 10px; border-radius: 8px; font-size: 13px;
            outline: none; transition: border-color 0.15s;
        }
        .grok-input-select:focus { border-color: #1d9bf0; }
        .grok-input-text {
            width: 100%; background: #16181C; border: 1px solid #2f3336;
            color: #E7E9EA; padding: 7px 10px; border-radius: 8px; font-size: 12px;
            box-sizing: border-box; font-family: monospace; outline: none;
        }
        .grok-input-textarea {
            width: 100%; height: 80px; background: #16181C; border: 1px solid #2f3336;
            color: #E7E9EA; padding: 7px 10px; border-radius: 8px; font-size: 12px;
            resize: vertical; font-family: monospace; box-sizing: border-box; outline: none;
            transition: border-color 0.15s;
        }
        .grok-input-textarea:focus { border-color: #1d9bf060; }

        
        .grok-btn {
            padding: 8px 16px; border-radius: 20px; border: none;
            cursor: pointer; font-weight: 700; font-size: 13px;
            transition: opacity 0.15s, background 0.15s;
        }
        .grok-btn:hover { opacity: 0.85; }
        .grok-btn-primary   { background: #1D9BF0; color: #fff; }
        .grok-btn-secondary { background: transparent; color: #EFF3F4; border: 1px solid #536471; }
        .grok-btn-danger    { background: transparent; color: #F4212E; border: 1px solid #F4212E; margin-right: auto; }

        
        .grok-push-toggle { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; }
        .grok-push-toggle input { cursor: pointer; width: 14px; height: 14px; flex-shrink: 0; }
        .grok-push-fields { display: flex; flex-direction: column; gap: 6px; padding-left: 22px; }
        .grok-push-section { display: flex; flex-direction: column; gap: 6px; }

        
        .grok-push-entry { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; background: #0d1117; border: 1px solid #2f3336; border-radius: 8px; position: relative; }
        .grok-push-entry-header { display: flex; align-items: center; gap: 6px; }
        .grok-push-entry-label { flex: 1; background: #16181C; border: 1px solid #2f3336; color: #E7E9EA; padding: 4px 8px; border-radius: 6px; font-size: 12px; }
        .grok-push-remove-btn { background: transparent; border: none; color: #536471; font-size: 16px; cursor: pointer; padding: 0 4px; line-height: 1; flex-shrink: 0; }
        .grok-push-remove-btn:hover { color: #F4212E; }
        .grok-push-add-btn { align-self: flex-start; padding: 4px 12px; border-radius: 12px; border: 1px dashed #536471; background: transparent; color: #536471; font-size: 12px; cursor: pointer; transition: all 0.15s; margin-top: 2px; }
        .grok-push-add-btn:hover { border-color: #1D9BF0; color: #1D9BF0; }

        
        #grok-push-select-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); z-index: 2147483641; display: flex; justify-content: center; align-items: center; }
        #grok-push-select-box { background: #16181C; border: 1px solid #2f3336; border-radius: 16px; padding: 20px; width: 340px; max-width: 92%; font-family: sans-serif; color: #E7E9EA; box-shadow: 0 8px 24px rgba(0,0,0,0.6); }
        #grok-push-select-box h3 { margin: 0 0 6px; font-size: 15px; }
        #grok-push-select-box p  { margin: 0 0 12px; font-size: 12px; color: #536471; }
        .grok-push-select-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; max-height: 280px; overflow-y: auto; }
        .grok-push-select-item { display: flex; align-items: center; gap: 8px; padding: 7px 10px; background: #0d1117; border: 1px solid #2f3336; border-radius: 8px; cursor: pointer; font-size: 13px; }
        .grok-push-select-item:hover { border-color: #1D9BF0; }
        .grok-push-select-item input { cursor: pointer; width: 14px; height: 14px; flex-shrink: 0; }
        .grok-push-select-badge { font-size: 10px; padding: 1px 6px; border-radius: 10px; margin-left: auto; flex-shrink: 0; }
        .grok-push-select-badge.discord { background: rgba(88,101,242,0.25); color: #8b9eff; }
        .grok-push-select-badge.telegram { background: rgba(41,182,246,0.25); color: #64c8f5; }
        .grok-test-btn {
            align-self: flex-start; margin-top: 4px;
            padding: 4px 12px; border-radius: 12px; border: 1px solid #536471;
            background: transparent; color: #8899A6; font-size: 12px; cursor: pointer;
            transition: all 0.15s;
        }
        .grok-test-btn:hover:not(:disabled) { border-color: #1D9BF0; color: #1D9BF0; background: rgba(29,155,240,0.1); }
        .grok-test-btn:disabled { opacity: 0.5; cursor: default; }

        
        .grok-tmpl-item { border: 1px solid #2f3336; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
        .grok-tmpl-title { font-size: 12px; font-weight: bold; color: #8899A6; margin-bottom: 2px; }
        .grok-tmpl-row   { display: flex; gap: 8px; align-items: center; }
        .grok-tmpl-row span { font-size: 11px; color: #536471; white-space: nowrap; }

        
        .grok-toast {
            position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
            background: rgba(21,32,43,0.95); border: 1px solid #2f3336;
            color: #E7E9EA; font-size: 13px; font-family: sans-serif;
            padding: 10px 18px; border-radius: 20px; z-index: 2147483646;
            box-shadow: 0 4px 16px rgba(0,0,0,0.5); max-width: 360px;
            text-align: center; line-height: 1.5;
            animation: grok-toast-in 0.2s ease-out;
        }
        @keyframes grok-toast-in {
            from { opacity: 0; transform: translateX(-50%) translateY(8px); }
            to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .grok-toast.fade-out { opacity: 0; transition: opacity 0.3s ease-out; }

        
        .grok-toast-warn {
            position: fixed; bottom: 20px; right: 88px;
            background: rgba(15,20,28,0.97); border: 1.5px solid #f0b429;
            color: #ffffff; font-size: 13px; font-family: sans-serif;
            padding: 14px 16px; border-radius: 12px; z-index: 2147483647;
            box-shadow: 0 4px 24px rgba(240,180,41,0.25), 0 2px 8px rgba(0,0,0,0.6);
            max-width: 200px; width: 200px; text-align: center; line-height: 1.6;
            animation: grok-toast-warn-in 0.25s ease-out;
        }
        @keyframes grok-toast-warn-in {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .grok-toast-warn.fade-out { opacity: 0; transition: opacity 0.3s ease-out; }

        .my-commander-btn-active { color: #FF1493 !important; transition: color 0.2s ease; }

        
        #grok-custom-lang-panel {
            background: rgba(29,155,240,0.06); border: 1px solid #1d9bf030;
            border-radius: 10px; padding: 12px; margin-top: 10px;
            display: flex; flex-direction: column; gap: 8px;
        }
        #grok-custom-lang-panel .gcl-status {
            font-size: 11px; color: #536471; padding: 2px 0;
        }
        #grok-custom-lang-panel .gcl-status.loaded { color: #4ade80; }
        .gcl-btn-row { display: flex; gap: 8px; }
        .gcl-btn {
            flex: 1; padding: 7px 10px; font-size: 12px; border-radius: 7px;
            cursor: pointer; border: 1px solid #333; background: #111;
            color: #E7E9EA; transition: background 0.15s, border-color 0.15s;
            text-align: center;
        }
        .gcl-btn:hover { background: #1a2733; border-color: #1d9bf0; color: #1d9bf0; }
        .gcl-btn.danger:hover { background: #2a1010; border-color: #e0445a; color: #e0445a; }
        .gcl-instructions {
            font-size: 10.5px; color: #3d4a55; line-height: 1.6;
        }
        .gcl-instructions code {
            background: #111; border-radius: 3px; padding: 1px 4px;
            font-family: monospace; color: #71767B; font-size: 10px;
        }

        
        #grok-custom-lang-inline {
            font-size: 11px; color: #536471;
        }
        #grok-custom-lang-inline .gcl-badge {
            font-size: 11px; padding: 2px 8px; border-radius: 20px;
            border: 1px solid #333; background: #0d1117;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;
        }
        #grok-custom-lang-inline .gcl-badge.loaded { color: #4ade80; border-color: #4ade8040; }
        #grok-custom-lang-inline .gcl-badge.empty   { color: #536471; }
        .gcl-manage-btn {
            font-size: 11px; padding: 2px 10px; border-radius: 6px;
            cursor: pointer; border: 1px solid #1d9bf0;
            background: rgba(29,155,240,0.08); color: #1d9bf0;
            white-space: nowrap; transition: background 0.15s;
        }
        .gcl-manage-btn:hover { background: rgba(29,155,240,0.2); }

        
        .grok-modal-body::-webkit-scrollbar { width: 5px; }
        .grok-modal-body::-webkit-scrollbar-track { background: transparent; }
        .grok-modal-body::-webkit-scrollbar-thumb {
            background: #1e2d3d;
            border-radius: 10px;
            transition: background 0.2s;
        }
        .grok-modal-body::-webkit-scrollbar-thumb:hover { background: #1d9bf060; }
        .grok-modal-body { scrollbar-width: thin; scrollbar-color: #1e2d3d transparent; }

        .grok-input-textarea::-webkit-scrollbar { width: 4px; }
        .grok-input-textarea::-webkit-scrollbar-track { background: transparent; }
        .grok-input-textarea::-webkit-scrollbar-thumb {
            background: #2a3a4a; border-radius: 10px;
        }
        .grok-input-textarea::-webkit-scrollbar-thumb:hover { background: #1d9bf050; }
        .grok-input-textarea { scrollbar-width: thin; scrollbar-color: #2a3a4a transparent; }
        #grok-clm-overlay {
            position: fixed !important; top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            background: rgba(0,0,0,0.65) !important;
            z-index: 2147483647 !important;
            display: flex !important; justify-content: center !important; align-items: center !important;
        }
        #grok-clm-box {
            background: #0d1117; border: 1px solid #1d9bf060; border-radius: 16px;
            width: min(400px, 90vw); padding: 22px;
            font-family: sans-serif; color: #E7E9EA;
            box-shadow: 0 0 0 1px #1d9bf020, 0 20px 40px rgba(0,0,0,0.9);
            display: flex; flex-direction: column; gap: 16px;
        }
        #grok-clm-box h3 {
            margin: 0; font-size: 15px; color: #fff;
            display: flex; justify-content: space-between; align-items: center;
            padding-bottom: 12px; border-bottom: 1px solid #1e2532;
        }
        #grok-clm-box h3 span.gcl-close {
            cursor: pointer; color: #536471; font-size: 18px; line-height: 1;
            padding: 2px 4px; border-radius: 4px;
        }
        #grok-clm-box h3 span.gcl-close:hover { color: #E7E9EA; background: #1e2532; }
        .gcl-subrow { display: flex; gap: 8px; }
        .gcl-subbtn {
            flex: 1; padding: 10px 12px; font-size: 13px; border-radius: 9px;
            cursor: pointer; border: 1px solid #2f3336; background: #16181C;
            color: #E7E9EA; transition: background 0.15s, border-color 0.15s;
            text-align: center; font-weight: 500;
        }
        .gcl-subbtn:hover { background: #1a2733; border-color: #1d9bf0; color: #1d9bf0; }
        .gcl-subbtn.danger { border-color: #3a1515; color: #888; }
        .gcl-subbtn.danger:hover { background: #2a1010; border-color: #e0445a; color: #e0445a; }
        .gcl-hint {
            font-size: 10.5px; color: #3d4a55; line-height: 1.7;
            border-top: 1px solid #1e2532; padding-top: 12px;
        }
    `;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function openSettings() {
    document.getElementById("grok-commander-menu")?.remove();
    window._gcT = t;
    const config = loadConfig();
    const currentLang = config.lang;
    const templatesToEdit = getCurrentTemplates();

    const overlay = document.createElement("div");
    overlay.id = "grok-settings-overlay";

    const pc = loadPushConfig();
    let html = `
      <div id="grok-settings-modal">
        <div class="grok-modal-header">
          <span>${t("settings_title")}</span>
          <span style="cursor:pointer;color:#536471;font-size:18px" id="grok-settings-close">✕</span>
        </div>
        <div class="grok-modal-body">

          <!-- ① 語言 & 送出模式 -->
          <div class="grok-section-card">
            <div class="grok-section-header">⚙️ ${t("send_mode_label")} &amp; ${t("lang_label")}</div>
            <div class="grok-section-body">
              <div class="grok-form-row">
                <label class="grok-form-label">${t("lang_label")}</label>
                <select id="grok-lang-select" class="grok-input-select">
                  <option value="auto"   ${currentLang==="auto"   ?"selected":""}>${t("lang_auto")}</option>
                  <option value="zh-TW"  ${currentLang==="zh-TW"  ?"selected":""}>繁體中文</option>
                  <option value="zh-CN"  ${currentLang==="zh-CN"  ?"selected":""}>简体中文</option>
                  <option value="en"     ${currentLang==="en"     ?"selected":""}>English</option>
                  <option value="ja"     ${currentLang==="ja"     ?"selected":""}>日本語</option>
                  <option value="ko"     ${currentLang==="ko"     ?"selected":""}>한국어</option>
                  <option value="es"     ${currentLang==="es"     ?"selected":""}>Español</option>
                  <option value="pt-BR"  ${currentLang==="pt-BR"  ?"selected":""}>Português (BR)</option>
                  <option value="fr"     ${currentLang==="fr"     ?"selected":""}>Français</option>
                  <option value="custom" ${currentLang==="custom" ?"selected":""}>✏️ Custom Language</option>
                </select>
                <div class="grok-form-hint">${t("lang_hint")}</div>
                <div id="grok-custom-lang-inline" style="display:${currentLang==="custom"?"flex":"none"};align-items:center;gap:8px;padding:6px 0 2px;">
                  <!-- status badge + manage button, injected by JS -->
                </div>
              </div>
              <div class="grok-form-row">
                <label class="grok-form-label">${t("send_mode_label")}</label>
                <select id="grok-autosend-select" class="grok-input-select">
                  <option value="manual" ${!config.autoSend?"selected":""}>${t("send_manual")}</option>
                  <option value="auto"   ${ config.autoSend?"selected":""}>${t("send_auto")}</option>
                </select>
                <div class="grok-form-hint">${t("send_mode_hint")}</div>
              </div>
            </div>
          </div>

          <!-- ② 模板編輯器 -->
          <div class="grok-section-card">
            <div class="grok-section-header">✏️ Prompt Templates</div>
            <div class="grok-section-body" id="grok-template-editors"></div>
          </div>

          <!-- ③ 推送設定 -->
          <div class="grok-section-card">
            <div class="grok-section-header">📨 ${t("push_section_label").replace("📨 ","")}</div>
            <div class="grok-section-body">
              <div class="grok-form-row">
                <label class="grok-form-label">${t("push_url_converter")}</label>
                <select id="grok-url-converter-select" class="grok-input-select">
                  <option value="vxtwitter.com" ${pc.urlConverter==="vxtwitter.com"?"selected":""}>vxtwitter.com</option>
                  <option value="fixupx.com"    ${pc.urlConverter==="fixupx.com"   ?"selected":""}>fixupx.com</option>
                  <option value="fxtwitter.com" ${pc.urlConverter==="fxtwitter.com"?"selected":""}>fxtwitter.com</option>
                  <option value="cunnyx.com"    ${pc.urlConverter==="cunnyx.com"   ?"selected":""}>cunnyx.com</option>
                  <option value="fixvx.com"     ${pc.urlConverter==="fixvx.com"    ?"selected":""}>fixvx.com</option>
                  <option value="twitter.com"   ${pc.urlConverter==="twitter.com"  ?"selected":""}>twitter.com</option>
                  <option value="x.com"         ${(!pc.urlConverter||pc.urlConverter==="x.com")?"selected":""}>x.com（不轉換）</option>
                </select>
                <div class="grok-form-hint">${t("push_url_converter_hint")}</div>
              </div>
              <div id="grok-push-discord-list"></div>
              <div id="grok-push-tg-list"></div>
              <label class="grok-push-toggle" style="color:#536471;font-size:12px;margin-top:4px;">
                <input type="checkbox" id="grok-push-skip-restore" ${!pc.skipConfirm?"checked":""}>
                <span>${t("push_restore_confirm")}</span>
              </label>
            </div>
          </div>

        </div>
        <div class="grok-modal-footer">
          <button id="grok-settings-reset"  class="grok-btn grok-btn-danger">${t("btn_reset")}</button>
          <button id="grok-settings-cancel" class="grok-btn grok-btn-secondary">${t("btn_cancel")}</button>
          <button id="grok-settings-save"   class="grok-btn grok-btn-primary">${t("btn_save")}</button>
        </div>
      </div>
    `;
    overlay.innerHTML = html;
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0", left: "0",
      width: "100vw", height: "100vh",
      zIndex: "2147483640",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "rgba(0,0,0,0.6)",
      boxSizing: "border-box",
    });
    document.body.appendChild(overlay);

    const modalEl = overlay.querySelector("#grok-settings-modal");
    if (modalEl) {
      Object.assign(modalEl.style, {
        display: "flex",
        flexDirection: "column",
        width: "min(480px, 92vw)",
        height: "min(86vh, 800px)",
        maxHeight: "86vh",
        overflow: "hidden",
        boxSizing: "border-box",
        background: "#000",
      });
    }
    const modalBodyEl = overlay.querySelector(".grok-modal-body");
    if (modalBodyEl) Object.assign(modalBodyEl.style, {
      flex: "1", overflowY: "auto", minHeight: "0",
      padding: "14px 18px", boxSizing: "border-box",
    });
    const modalFooterEl = overlay.querySelector(".grok-modal-footer");
    if (modalFooterEl) Object.assign(modalFooterEl.style, {
      display: "flex", justifyContent: "flex-end", gap: "8px",
      flexShrink: "0", padding: "12px 18px", boxSizing: "border-box",
      borderTop: "1px solid #2f3336", background: "#000",
    });

    const editorContainer = document.getElementById("grok-template-editors");
    const keys = ["factcheck", "analysis", "tree", "solution", "translate"];

    function renderEditors(templates) {
      editorContainer.innerHTML = "";
      keys.forEach((key) => {
        const tmpl = templates[key];
        if (!tmpl) return;
        const div = document.createElement("div");
        div.className = "grok-tmpl-item";
        div.innerHTML = `
          <div class="grok-tmpl-title">${escapeHtml(tmpl.icon)} ${escapeHtml(tmpl.label)}</div>
          <div class="grok-tmpl-row">
            <span>${window._gcT("label_label")}</span>
            <input type="text" class="grok-input-select" style="height:28px;padding:3px 8px;font-size:12px;flex:1;"
                   data-label-key="${key}" value="${escapeHtml(tmpl.label)}" maxlength="20">
          </div>
          <div class="grok-form-row">
            <label class="grok-form-label">${window._gcT("prompt_label")}</label>
            <textarea class="grok-input-textarea" data-key="${key}">${escapeHtml(tmpl.prompt)}</textarea>
          </div>
        `;
        editorContainer.appendChild(div);
      });
    }
    renderEditors(templatesToEdit);

    const MAX_PUSH = 10;

    function renderPushEntries(containerId, type, entries) {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = "";

      const header = document.createElement("div");
      header.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;";
      header.innerHTML = `<span style="font-size:12px;font-weight:bold;color:#8899A6">${type === "discord" ? "Discord" : "Telegram"}</span>`;
      const addBtn = document.createElement("button");
      addBtn.className = "grok-push-add-btn";
      addBtn.textContent = t("push_add");
      addBtn.onclick = () => {
        if (entries.length >= MAX_PUSH) { showToast(t("push_max_reached")); return; }
        entries.push(type === "discord"
          ? { label: "", url: "", enabled: true }
          : { label: "", token: "", chat: "", enabled: true }
        );
        renderPushEntries(containerId, type, entries);
      };
      header.appendChild(addBtn);
      container.appendChild(header);

      if (!entries.length) {
        const empty = document.createElement("div");
        empty.style.cssText = "font-size:11px;color:#3d4a55;padding:4px 0 8px;";
        empty.textContent = t("push_add") + " →";
        container.appendChild(empty);
        return;
      }

      entries.forEach((entry, idx) => {
        const div = document.createElement("div");
        div.className = "grok-push-entry";

        const entryHeader = document.createElement("div");
        entryHeader.className = "grok-push-entry-header";

        const enableChk = document.createElement("input");
        enableChk.type = "checkbox";
        enableChk.checked = entry.enabled;
        enableChk.style.cssText = "cursor:pointer;width:14px;height:14px;flex-shrink:0;";
        enableChk.onchange = () => { entry.enabled = enableChk.checked; };

        const labelInput = document.createElement("input");
        labelInput.className = "grok-push-entry-label";
        labelInput.placeholder = t("push_label_placeholder");
        labelInput.value = entry.label || "";
        labelInput.oninput = () => { entry.label = labelInput.value; };

        const removeBtn = document.createElement("button");
        removeBtn.className = "grok-push-remove-btn";
        removeBtn.textContent = "✕";
        removeBtn.onclick = () => {
          entries.splice(idx, 1);
          renderPushEntries(containerId, type, entries);
        };

        entryHeader.appendChild(enableChk);
        entryHeader.appendChild(labelInput);
        entryHeader.appendChild(removeBtn);
        div.appendChild(entryHeader);

        if (type === "discord") {
          const urlRow = document.createElement("div");
          urlRow.className = "grok-form-row";
          urlRow.innerHTML = `<label class="grok-form-label">${t("push_discord_url")}</label>`;
          const urlInput = document.createElement("input");
          urlInput.className = "grok-input-text";
          urlInput.placeholder = t("push_discord_placeholder");
          urlInput.value = entry.url || "";
          urlInput.oninput = () => { entry.url = urlInput.value; };
          urlRow.appendChild(urlInput);
          div.appendChild(urlRow);

          const testBtn = document.createElement("button");
          testBtn.className = "grok-test-btn";
          testBtn.textContent = t("push_test");
          testBtn.onclick = () => {
            const url = urlInput.value.trim();
            if (!url) { showToast(t("push_not_configured")); return; }
            testBtn.disabled = true; testBtn.textContent = t("push_test_sending");
            GM_xmlhttpRequest({
              method: "POST", url,
              headers: { "Content-Type": "application/json" },
              data: JSON.stringify({ content: "🤖 Grok Commander — Test message ✅" }),
              onload: (r) => {
                testBtn.disabled = false; testBtn.textContent = t("push_test");
                showToast((r.status >= 200 && r.status < 300) ? t("push_result_ok") : t("push_result_fail"));
              },
              onerror: () => { testBtn.disabled = false; testBtn.textContent = t("push_test"); showToast(t("push_result_fail")); },
            });
          };
          div.appendChild(testBtn);

        } else {
          const tokenRow = document.createElement("div");
          tokenRow.className = "grok-form-row";
          tokenRow.innerHTML = `<label class="grok-form-label">${t("push_tg_token")}</label>`;
          const tokenInput = document.createElement("input");
          tokenInput.className = "grok-input-text";
          tokenInput.placeholder = t("push_tg_token_placeholder");
          tokenInput.value = entry.token || "";
          tokenInput.oninput = () => { entry.token = tokenInput.value; };
          tokenRow.appendChild(tokenInput);
          div.appendChild(tokenRow);

          const chatRow = document.createElement("div");
          chatRow.className = "grok-form-row";
          chatRow.innerHTML = `<label class="grok-form-label">${t("push_tg_chat")}</label>`;
          const chatInput = document.createElement("input");
          chatInput.className = "grok-input-text";
          chatInput.placeholder = t("push_tg_chat_placeholder");
          chatInput.value = entry.chat || "";
          chatInput.oninput = () => { entry.chat = chatInput.value; };
          chatRow.appendChild(chatInput);
          div.appendChild(chatRow);

          const testBtn = document.createElement("button");
          testBtn.className = "grok-test-btn";
          testBtn.textContent = t("push_test");
          testBtn.onclick = () => {
            const token = tokenInput.value.trim();
            const chat  = chatInput.value.trim();
            if (!token || !chat) { showToast(t("push_not_configured")); return; }
            testBtn.disabled = true; testBtn.textContent = t("push_test_sending");
            GM_xmlhttpRequest({
              method: "POST",
              url: `https://api.telegram.org/bot${token}/sendMessage`,
              headers: { "Content-Type": "application/json" },
              data: JSON.stringify({ chat_id: chat, text: "🤖 Grok Commander — Test message ✅" }),
              onload: (r) => {
                testBtn.disabled = false; testBtn.textContent = t("push_test");
                try { showToast(JSON.parse(r.responseText).ok ? t("push_result_ok") : t("push_result_fail")); }
                catch (e) { showToast(t("push_result_fail")); }
              },
              onerror: () => { testBtn.disabled = false; testBtn.textContent = t("push_test"); showToast(t("push_result_fail")); },
            });
          };
          div.appendChild(testBtn);
        }

        container.appendChild(div);
      });
    }

    const draftDiscord  = (pc.discord  || []).map(e => ({ ...e }));
    const draftTelegram = (pc.telegram || []).map(e => ({ ...e }));
    renderPushEntries("grok-push-discord-list", "discord",  draftDiscord);
    renderPushEntries("grok-push-tg-list",      "telegram", draftTelegram);

    document.getElementById("grok-settings-close").onclick = closeSettings;
    document.getElementById("grok-settings-cancel").onclick = closeSettings;

    const settingsOverlayEl = document.getElementById("grok-settings-overlay");
    if (settingsOverlayEl) {
      settingsOverlayEl.addEventListener("click", (e) => {
        if (e.target === settingsOverlayEl) closeSettings();
      });
    }

    const CUSTOM_LANG_INSTRUCTIONS = [
      "English:    Export → translate values → Import",
      "Deutsch:    Exportieren → Werte übersetzen → Importieren",
      "Français:   Exporter → traduire les valeurs → Importer",
      "Español:    Exportar → traducir los valores → Importar",
      "Italiano:   Esporta → traduci i valori → Importa",
      "Português:  Exportar → traduzir os valores → Importar",
      "Русский:    Экспорт → перевести значения → Импорт",
      "ภาษาไทย:    ส่งออก → แปลค่า → นำเข้า",
      "Türkçe:     Dışa aktar → değerleri çevir → İçe aktar",
      "Polski:     Eksportuj → przetłumacz wartości → Importuj",
      "العربية:    تصدير ← ترجمة القيم ← استيراد",
      "हिन्दी:     निर्यात → मान अनुवाद करें → आयात",
      "Indonesia:  Ekspor → terjemahkan nilai → Impor",
      "Tiếng Việt: Xuất → dịch các giá trị → Nhập",
    ].join("\n");

    function buildExportTemplate() {
      const uiBase = Object.assign({}, DEFAULT_CONFIG.ui["en"]);
      const tmplBase = JSON.parse(JSON.stringify(DEFAULT_CONFIG.templates["en"]));
      return {
        _note: [
          "=== GROK COMMANDER — CUSTOM LANGUAGE TRANSLATION TEMPLATE ===",
          "TASK: Translate ONLY the string VALUES. DO NOT rename any KEYS.",
          "RULES:",
          "  1. Set 'langName' to your language's native name (e.g. 'ภาษาไทย', 'Deutsch').",
          "  2. Set 'langCode' to the BCP-47 code (e.g. 'th', 'de', 'it').",
          "  3. Keep ALL {placeholders} unchanged. The only placeholder in ui is none; in templates prompts keep \\n.",
          "  4. Keep ALL emoji unchanged (🔗 ⚙️ 🌐 📖 📅 ❌ ⚠️ 🛡️ 🚀 📨 ✅ ❌).",
          "  5. '_note' must be copied verbatim — do NOT translate it.",
          "  6. Output the COMPLETE JSON, no markdown fences.",
          "==================================================================="
        ],
        langName: "Your Language Name",
        langCode: "xx",
        ui: uiBase,
        templates: tmplBase
      };
    }

    function exportLangTemplate() {
      const tpl = buildExportTemplate();
      const json = JSON.stringify(tpl, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "grok-commander-lang-template.json";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
    }

    function importLangTemplate(onSuccess) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json,application/json";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            let raw = ev.target.result;
            raw = raw.replace(/^```json\s*/m, "").replace(/```\s*$/m, "").trim();
            const pack = JSON.parse(raw);
            if (!pack.langName || !pack.ui || !pack.templates) {
              showToast("❌ Invalid format: missing langName / ui / templates");
              return;
            }
            saveCustomLangPack(pack);
            onSuccess(pack);
          } catch (err) {
            showToast("❌ JSON parse error: " + err.message);
          }
        };
        reader.readAsText(file, "utf-8");
      };
      document.body.appendChild(input);
      input.click();
      setTimeout(() => input.remove(), 5000);
    }

    function openCustomLangModal(onPackChanged) {
      document.getElementById("grok-clm-overlay")?.remove();

      const pack    = loadCustomLangPack();
      const haspack = pack && pack.langName;

      const overlay = document.createElement("div");
      overlay.id = "grok-clm-overlay";
      overlay.innerHTML = `
        <div id="grok-clm-box">
          <h3>
            <span>✏️ Custom Language</span>
            <span class="gcl-close" id="gcl-close-btn">✕</span>
          </h3>
          <div id="gcl-status-line" style="font-size:12px;color:${haspack?"#4ade80":"#536471"}">
            ${haspack
              ? `✅ Loaded: <b>${escapeHtml(pack.langName)}</b> <span style="color:#536471">(${escapeHtml(pack.langCode||"??")})</span>`
              : "⚠️ No custom language loaded yet."}
          </div>
          <div class="gcl-subrow">
            <button class="gcl-subbtn" id="gcl-export-btn">📤 Export Template</button>
            <button class="gcl-subbtn" id="gcl-import-btn">📥 Import Translation</button>
          </div>
          ${haspack ? `<div class="gcl-subrow"><button class="gcl-subbtn danger" id="gcl-clear-btn">🗑️ Remove Custom Pack</button></div>` : ""}
          <div class="gcl-hint">${escapeHtml(CUSTOM_LANG_INSTRUCTIONS).replace(/\n/g,"<br>")}</div>
        </div>
      `;
      Object.assign(overlay.style, {
        position: "fixed", top: "0", left: "0",
        width: "100vw", height: "100vh",
        zIndex: "2147483647",
        display: "flex", justifyContent: "center", alignItems: "center",
        background: "rgba(0,0,0,0.65)",
        boxSizing: "border-box",
      });
      document.body.appendChild(overlay);

      overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
      document.getElementById("gcl-close-btn").onclick = () => overlay.remove();

      document.getElementById("gcl-export-btn").onclick = (e) => {
        e.stopPropagation();
        exportLangTemplate();
      };

      document.getElementById("gcl-import-btn").onclick = (e) => {
        e.stopPropagation();
        importLangTemplate((newPack) => {
          showToast(`✅ Loaded: ${escapeHtml(newPack.langName)}`);
          overlay.remove();
          onPackChanged(newPack);
        });
      };

      if (haspack) {
        document.getElementById("gcl-clear-btn").onclick = (e) => {
          e.stopPropagation();
          GM_setValue("grok_custom_lang_pack_bak", GM_getValue("grok_custom_lang_pack", null));
          GM_setValue("grok_custom_lang_pack", null);
          overlay.remove();
          onPackChanged(null);

          const undoToast = document.createElement("div");
          undoToast.className = "grok-toast";
          undoToast.style.cssText = "display:flex;align-items:center;gap:12px;min-width:260px;justify-content:space-between;";
          undoToast.innerHTML = `
            <span>🗑️ Custom pack removed</span>
            <button id="gcl-undo-btn" style="
              background:rgba(29,155,240,0.15);border:1px solid #1d9bf0;color:#1d9bf0;
              border-radius:12px;padding:3px 12px;cursor:pointer;font-size:12px;white-space:nowrap;
              font-weight:600;flex-shrink:0;
            ">↩ Undo</button>
          `;
          document.body.appendChild(undoToast);

          let undone = false;
          const undoTimer = setTimeout(() => {
            undoToast.classList.add("fade-out");
            setTimeout(() => undoToast.remove(), 320);
            if (!undone) GM_setValue("grok_custom_lang_pack_bak", null);
          }, 8000);

          undoToast.querySelector("#gcl-undo-btn").onclick = () => {
            undone = true;
            clearTimeout(undoTimer);
            undoToast.remove();
            const bak = GM_getValue("grok_custom_lang_pack_bak", null);
            if (bak) {
              GM_setValue("grok_custom_lang_pack", bak);
              GM_setValue("grok_custom_lang_pack_bak", null);
              try {
                const restored = JSON.parse(bak);
                onPackChanged(restored);
                showToast(`✅ Restored: ${escapeHtml(restored.langName)}`);
              } catch(e) {
                showToast("⚠️ Restore failed.");
              }
            }
          };
        };
      }
    }

    function renderCustomLangInline(container, onPackChanged) {
      const pack    = loadCustomLangPack();
      const haspack = pack && pack.langName;
      container.innerHTML = `
        <span class="gcl-badge ${haspack?"loaded":"empty"}">
          ${haspack ? `✅ ${escapeHtml(pack.langName)}` : "⚠️ None loaded"}
        </span>
        <button class="gcl-manage-btn" id="gcl-manage-btn">⚙️ Manage…</button>
      `;
      document.getElementById("gcl-manage-btn").onclick = (e) => {
        e.stopPropagation();
        openCustomLangModal((newPack) => {
          renderCustomLangInline(container, onPackChanged);
          onPackChanged(newPack);
        });
      };
    }

    const customLangInline = document.getElementById("grok-custom-lang-inline");
    if (currentLang === "custom") renderCustomLangInline(customLangInline, (newPack) => {
      const tmpl = (newPack && newPack.templates) ? newPack.templates : DEFAULT_CONFIG.templates["en"];
      renderEditors(tmpl);
    });

    const langSelect = document.getElementById("grok-lang-select");
    langSelect.onchange = () => {
      const targetVal = langSelect.value;
      if (customLangInline) {
        customLangInline.style.display = targetVal === "custom" ? "flex" : "none";
        if (targetVal === "custom") renderCustomLangInline(customLangInline, (newPack) => {
          const tmpl = (newPack && newPack.templates) ? newPack.templates : DEFAULT_CONFIG.templates["en"];
          renderEditors(tmpl);
        });
      }
      if (targetVal === "custom") {
        openCustomLangModal((newPack) => {
          renderCustomLangInline(customLangInline, (np) => {
            const tmpl = (np && np.templates) ? np.templates : DEFAULT_CONFIG.templates["en"];
            renderEditors(tmpl);
          });
          const tmpl = (newPack && newPack.templates) ? newPack.templates : DEFAULT_CONFIG.templates["en"];
          renderEditors(tmpl);
        });
      }
      let targetLang = targetVal;
      if (targetVal === "auto") targetLang = resolveLang("auto");
      if (targetVal === "custom") {
        const pack = loadCustomLangPack();
        renderEditors((pack && pack.templates) ? pack.templates : DEFAULT_CONFIG.templates["en"]);
      } else {
        renderEditors(DEFAULT_CONFIG.templates[targetLang] || DEFAULT_CONFIG.templates["en"]);
      }
    };

    document.getElementById("grok-settings-reset").onclick = () => {
      if (confirm(t("confirm_reset"))) {
        const targetVal = langSelect.value;
        if (targetVal === "custom") {
          const pack = loadCustomLangPack();
          renderEditors((pack && pack.templates) ? pack.templates : DEFAULT_CONFIG.templates["en"]);
        } else {
          const targetLang = resolveLang(targetVal);
          renderEditors(DEFAULT_CONFIG.templates[targetLang] || DEFAULT_CONFIG.templates["en"]);
        }
      }
    };

    document.getElementById("grok-settings-save").onclick = () => {
      let selectedLang = langSelect.value;
      let realLangCode = selectedLang;

      if (selectedLang === "auto") {
        realLangCode = resolveLang("auto");
      }

      const newConfig = {
        lang: selectedLang,
        autoSend:
          document.getElementById("grok-autosend-select").value === "auto",
        customTemplates: {
          _lang: realLangCode,
        },
      };

      let baseTemplates;
      if (realLangCode === "custom") {
        const pack = loadCustomLangPack();
        baseTemplates = (pack && pack.templates) ? pack.templates : DEFAULT_CONFIG.templates["en"];
      } else {
        baseTemplates = DEFAULT_CONFIG.templates[realLangCode] || DEFAULT_CONFIG.templates["en"];
      }
      editorContainer.querySelectorAll("textarea").forEach((ta) => {
        const key = ta.getAttribute("data-key");
        const labelInput = editorContainer.querySelector(
          `input[data-label-key="${key}"]`,
        );
        const customLabel =
          labelInput?.value?.trim() || baseTemplates[key]?.label;
        newConfig.customTemplates[key] = {
          ...baseTemplates[key],
          label: customLabel,
          prompt: ta.value,
        };
      });
      saveConfig(newConfig);

      savePushConfig({
        discord:      draftDiscord,
        telegram:     draftTelegram,
        skipConfirm:  !document.getElementById("grok-push-skip-restore").checked,
        urlConverter: document.getElementById("grok-url-converter-select").value,
      });

      closeSettings();
      showToast(t("alert_saved"));
    };
  }

  function closeSettings() {
    document.getElementById("grok-settings-overlay")?.remove();
  }

  function showToast(text, duration = 4000) {
    document.querySelector(".grok-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "grok-toast";
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 320);
    }, duration);
  }

  function showWarnToast(text, duration = 5000) {
    const toast = document.createElement("div");
    toast.className = "grok-toast-warn";
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 320);
    }, duration);
  }

  function loadPushConfig() {
    try {
      const raw = JSON.parse(GM_getValue("grok_push_config", "{}"));
      if (!raw.discord && !raw.telegram) {
        return {
          discord: raw.discordUrl
            ? [{ label: "Discord", url: raw.discordUrl, enabled: !!raw.discordEnabled }]
            : [],
          telegram: raw.tgToken
            ? [{ label: "Telegram", token: raw.tgToken, chat: raw.tgChat, enabled: !!raw.telegramEnabled }]
            : [],
          skipConfirm: raw.skipConfirm || false,
          urlConverter: raw.urlConverter || "x.com",
        };
      }
      if (!raw.urlConverter) raw.urlConverter = "x.com";
      return raw;
    } catch (e) {
      return { discord: [], telegram: [], skipConfirm: false };
    }
  }

  function savePushConfig(cfg) {
    GM_setValue("grok_push_config", JSON.stringify(cfg));
  }

  const URL_CONVERTER_DOMAINS = [
    "vxtwitter.com",
    "fixupx.com",
    "fxtwitter.com",
    "cunnyx.com",
    "fixvx.com",
    "twitter.com",
    "x.com",
  ];

  function convertTweetUrl(url, targetDomain) {
    if (!targetDomain || targetDomain === "x.com") return url;
    try {
      return url.replace(
        /^(https?:\/\/)(www\.)?(x\.com|twitter\.com)/i,
        `$1${targetDomain}`
      );
    } catch (e) {
      return url;
    }
  }

  function doPushTargets(url, targets) {
    if (!targets.length) { showToast(t("push_not_configured")); return; }

    const cfg = loadPushConfig();
    const convertedUrl = convertTweetUrl(url, cfg.urlConverter || "x.com");

    const discordTargets  = targets.filter(tgt => tgt.type === "discord");
    const telegramTargets = targets.filter(tgt => tgt.type === "telegram");
    let successCount = 0;
    let failCount = 0;
    const total = targets.length;

    function finish() {
      if (successCount + failCount < total) return;
      if (failCount === 0) showToast(`${t("push_result_ok")} (${successCount}/${total})`);
      else if (successCount === 0) showToast(`${t("push_result_fail")} (${failCount}/${total})`);
      else showToast(`${t("push_result_ok")} ${successCount} / ${t("push_result_fail")} ${failCount}`);
    }

    discordTargets.forEach((target, i) => {
      setTimeout(() => {
        GM_xmlhttpRequest({
          method: "POST", url: target.url,
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify({ content: convertedUrl }),
          onload: (r) => { (r.status >= 200 && r.status < 300) ? successCount++ : failCount++; finish(); },
          onerror: () => { failCount++; finish(); },
        });
      }, i * 600);
    });

    telegramTargets.forEach((target, i) => {
      setTimeout(() => {
        GM_xmlhttpRequest({
          method: "POST",
          url: `https://api.telegram.org/bot${target.token}/sendMessage`,
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify({ chat_id: target.chat, text: convertedUrl, disable_web_page_preview: false }),
          onload: (r) => {
            try { JSON.parse(r.responseText).ok ? successCount++ : failCount++; }
            catch (e) { failCount++; }
            finish();
          },
          onerror: () => { failCount++; finish(); },
        });
      }, discordTargets.length * 600 + i * 150);
    });
  }

  function showPushConfirm(url, onConfirm) {
    const cfg = loadPushConfig();
    const convertedUrl = convertTweetUrl(url, cfg.urlConverter || "x.com");

    const allTargets = [
      ...cfg.discord
        .filter(e => e.enabled && e.url)
        .map(e => ({ type: "discord", label: e.label || "Discord", url: e.url })),
      ...cfg.telegram
        .filter(e => e.enabled && e.token && e.chat)
        .map(e => ({ type: "telegram", label: e.label || "Telegram", token: e.token, chat: e.chat })),
    ];

    if (!allTargets.length) { showToast(t("push_not_configured")); return; }

    if (cfg.skipConfirm && allTargets.length === 1) { onConfirm(allTargets); return; }

    document.getElementById("grok-push-select-overlay")?.remove();
    const overlay = document.createElement("div");
    overlay.id = "grok-push-select-overlay";

    const itemsHtml = allTargets.map((target, i) => `
      <label class="grok-push-select-item">
        <input type="checkbox" data-idx="${i}" checked>
        <span style="flex:1">${target.label}</span>
        <span class="grok-push-select-badge ${target.type}">${target.type === "discord" ? "Discord" : "Telegram"}</span>
      </label>
    `).join("");

    overlay.innerHTML = `
      <div id="grok-push-select-box">
        <h3>${t("push_select_title")}</h3>
        <p>${t("push_select_hint")}<br><span style="color:#1D9BF0;word-break:break-all">${escapeHtml(convertedUrl)}</span></p>
        <div class="grok-push-select-list">${itemsHtml}</div>
        <label class="grok-push-confirm-check" style="margin-bottom:14px;">
          <input type="checkbox" id="grok-push-skip-check"> ${t("push_confirm_check")}
        </label>
        <div class="grok-push-confirm-btns">
          <button id="grok-push-cancel" class="grok-btn grok-btn-secondary">${t("push_confirm_cancel")}</button>
          <button id="grok-push-ok"     class="grok-btn grok-btn-primary">${t("push_confirm_ok")}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("grok-push-cancel").onclick = () => overlay.remove();
    document.getElementById("grok-push-ok").onclick = () => {
      const selected = [...overlay.querySelectorAll("input[data-idx]:checked")]
        .map(el => allTargets[parseInt(el.dataset.idx)]);
      if (!selected.length) { showToast(t("push_select_none")); return; }
      if (document.getElementById("grok-push-skip-check").checked) {
        const c = loadPushConfig(); c.skipConfirm = true; savePushConfig(c);
      }
      overlay.remove();
      onConfirm(selected);
    };
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  }

  const GROK_PATTERNS = ["M12.745 20.54", "M2.5 12C2.5 6.75", "M12 2C6.48 2"];

  const SEND_SVG_FINGERPRINT =
    "M12 3.59l7.457 7.45-1.414 1.42L13 7.41V21h-2V7.41l-5.043 5.05-1.414-1.42L12 3.59z";

  const SEND_BTN_LABELS = [
    "問 Grok 一些問題",
    "發送",
    "送出",
    "发布",
    "发送",
    "向 Grok 提问",
    "Grok something",
    "Send post",
    "Ask Grok",
    "Reply",
    "Grokに質問",
    "ポストする",
    "送信",
    "返信",
    "Grok에게 질문하기",
    "게시하기",
    "보내기",
    "답글",
    "Publicar",
    "Enviar",
    "Preguntarle a Grok",
    "Responder",
    "Postar",
    "Perguntar ao Grok",
    "Publier",
    "Envoyer",
    "Demander à Grok",
    "Répondre",
  ];

  const BLACKLIST_LABELS = [
    "image",
    "picture",
    "generate",
    "draw",
    "create",
    "圖片",
    "影像",
    "生成",
    "繪製",
    "製作",
    "照片",
    "图片",
    "生成",
    "画像",
    "生成",
    "이미지",
    "생성",
  ];

  let activeInterval = null;
  let pendingTask = null;

  function resetGlobalState() {
    if (activeInterval) {
      clearInterval(activeInterval);
      activeInterval = null;
    }
    pendingTask = null;
  }

  function isGrokIcon(element) {
    if (!element || element.tagName !== "path") return false;
    const d = element.getAttribute("d");
    if (!d) return false;
    return GROK_PATTERNS.some((p) => d.startsWith(p));
  }

  function simulateEnterKey(element) {
    ["keydown", "keypress", "keyup"].forEach((type) => {
      element.dispatchEvent(
        new KeyboardEvent(type, {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
        }),
      );
    });
  }

  function setReactValue(element, value) {
    const ownDesc = Object.getOwnPropertyDescriptor(element, "value");
    const protoDesc = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(element),
      "value",
    );
    const setter =
      ownDesc?.set && ownDesc.set !== protoDesc?.set
        ? protoDesc?.set
        : ownDesc?.set || protoDesc?.set;
    if (setter) {
      setter.call(element, value);
    } else {
      element.value = value;
    }
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  const _hijackedBtns = new WeakSet();

  function hijackOperations() {
    const paths = document.querySelectorAll("path");
    paths.forEach((path) => {
      if (isGrokIcon(path)) {
        const originalBtn = path.closest("button");
        if (
          originalBtn &&
          originalBtn.closest("article") &&
          !originalBtn.classList.contains("my-commander-btn") &&
          !_hijackedBtns.has(originalBtn)
        ) {
          const newBtn = originalBtn.cloneNode(true);
          newBtn.classList.add("my-commander-btn", "my-commander-btn-active");
          newBtn.style.color = "#FF1493";
          newBtn.setAttribute("aria-label", t("commander_btn_label"));
          newBtn.title = t("commander_btn_title");

          newBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const article = newBtn.closest("article");
            if (!article) return;
            const textEl = article.querySelector('[data-testid="tweetText"]');
            const urlEl = article.querySelector("time")?.closest("a");
            const tweetData = {
              text: textEl ? textEl.innerText : "",
              url: urlEl ? urlEl.href : window.location.href,
            };
            showMenu(e.clientX, e.clientY, tweetData);
          };

          if (originalBtn.parentNode) {
            _hijackedBtns.add(newBtn);
            originalBtn.parentNode.replaceChild(newBtn, originalBtn);
          }
        }
      }
    });
  }

  function showMenu(x, y, tweetData) {
    document.getElementById("grok-commander-menu")?.remove();
    document.getElementById("grok-menu-overlay")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "grok-menu-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 99989,
      background: "transparent",
    });
    overlay.onclick = () => {
      overlay.remove();
      document.getElementById("grok-commander-menu")?.remove();
    };
    document.body.appendChild(overlay);

    const currentTemplates = getCurrentTemplates();
    const menu = document.createElement("div");
    menu.id = "grok-commander-menu";

    const rectWidth = 180;
    const rectHeight = 250;
    let finalX = x;
    let finalY = y;
    if (x + rectWidth > window.innerWidth)
      finalX = window.innerWidth - rectWidth - 20;
    if (y + rectHeight > window.innerHeight) finalY = y - rectHeight;
    menu.style.left = `${finalX}px`;
    menu.style.top = `${finalY}px`;

    const keys = ["factcheck", "analysis", "tree", "solution", "translate"];
    const pushCfg = loadPushConfig();
    const hasAnyTarget =
      (pushCfg.discord  || []).some(e => e.enabled && e.url) ||
      (pushCfg.telegram || []).some(e => e.enabled && e.token && e.chat);
    keys.forEach((key) => {
      const tmpl = currentTemplates[key];
      if (!tmpl) return;
      const item = document.createElement("div");
      item.className = "grok-menu-item";

      const mainPart = document.createElement("span");
      mainPart.style.cssText =
        "display:flex;align-items:center;gap:10px;flex:1;";
      mainPart.innerHTML = `<span style="font-size:16px">${escapeHtml(tmpl.icon)}</span><span class="grok-menu-item-label">${escapeHtml(tmpl.label)}</span>`;
      mainPart.onclick = (e) => {
        e.stopPropagation();
        overlay.remove();
        menu.remove();
        resetGlobalState();
        executeCommand(tmpl.prompt, tweetData);
      };

      const privateBtn = document.createElement("button");
      privateBtn.className = "grok-private-btn";
      privateBtn.innerHTML = `<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" style="color:#1d9bf0"><g><mask id="gc-priv-a" fill="currentColor"><ellipse cx="8.334" cy="8.541" rx="1.042" ry="1.458"/></mask><ellipse cx="8.334" cy="8.541" fill="currentColor" rx="1.042" ry="1.458"/><path d="M9.375 8.541H8.042c0 .157-.047.244-.056.257-.003.004.016-.026.074-.06.062-.037.157-.071.274-.071v2.666c.83 0 1.455-.473 1.82-.986.369-.514.554-1.157.554-1.806H9.375zM8.334 10V8.667c.116 0 .211.034.273.071.058.034.078.064.075.06-.01-.013-.057-.1-.057-.257H5.959c0 .649.186 1.292.553 1.806.366.513.992.986 1.822.986V10zM7.292 8.54h1.333c0-.157.047-.243.057-.256.003-.004-.017.026-.075.06-.062.036-.157.071-.273.071V5.75c-.83 0-1.456.473-1.822.985-.367.515-.553 1.158-.553 1.806h1.333zm1.042-1.458v1.333c-.117 0-.212-.035-.274-.071-.058-.034-.077-.064-.074-.06.009.013.056.1.056.256h2.666c0-.648-.185-1.29-.553-1.806-.366-.512-.991-.985-1.821-.985v1.333z" fill="currentColor" mask="url(#gc-priv-a)"/><mask id="gc-priv-b" fill="currentColor"><ellipse cx="11.667" cy="8.541" rx="1.042" ry="1.458"/></mask><ellipse cx="11.667" cy="8.541" fill="currentColor" rx="1.042" ry="1.458"/><path d="M12.708 8.541h-1.333c0 .157-.047.244-.056.257-.003.004.016-.026.074-.06.062-.037.157-.071.274-.071v2.666c.83 0 1.455-.473 1.82-.986.369-.514.554-1.157.554-1.806h-1.333zM11.667 10V8.667c.116 0 .211.034.273.071.058.034.078.064.075.06-.01-.013-.057-.1-.057-.257H9.292c0 .649.186 1.292.553 1.806.366.513.992.986 1.822.986V10zm-1.042-1.46h1.333c0-.157.047-.243.057-.256.003-.004-.017.026-.075.06-.062.036-.157.071-.273.071V5.75c-.83 0-1.456.473-1.822.985-.367.515-.553 1.158-.553 1.806h1.333zm1.042-1.458v1.333c-.117 0-.212-.035-.274-.071-.058-.034-.077-.064-.075-.06.01.013.057.1.057.256h2.666c0-.648-.185-1.29-.553-1.806-.366-.512-.992-.985-1.821-.985v1.333z" fill="currentColor" mask="url(#gc-priv-b)"/><path d="M10 3.333c-6.667 0-3.27 5.601-7.5 7.5 0 1.374 1.17 1.25 1.608 2.308.367.886-.545 2.658-.775 3.525h3.334L10 17.5l3.333-.834h3.334c-.315-1.066-.993-2.38-.771-3.521.227-1.172 1.604-.86 1.604-2.312-4.23-1.899-.833-7.5-7.5-7.5z" fill="none" stroke="currentColor" stroke-width="1.333"/></g></svg>`;
      privateBtn.title = t("private_tooltip");
      privateBtn.onclick = (e) => {
        e.stopPropagation();
        overlay.remove();
        menu.remove();
        resetGlobalState();
        executePrivateCommand(tmpl.prompt, tweetData);
      };

      item.appendChild(mainPart);
      item.appendChild(privateBtn);

      if (hasAnyTarget) {
        const pushBtn = document.createElement("button");
        pushBtn.className = "grok-push-btn";
        pushBtn.title = t("push_btn_tooltip");
        pushBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>`;
        pushBtn.onclick = (e) => {
          e.stopPropagation();
          overlay.remove();
          menu.remove();
          showPushConfirm(tweetData.url, (targets) => doPushTargets(tweetData.url, targets));
        };
        item.appendChild(pushBtn);
      }

      menu.appendChild(item);
    });

    const footer = document.createElement("div");
    footer.className = "grok-menu-footer";

    const langBtn = document.createElement("button");
    langBtn.className = "grok-lang-quick-btn";
    const currentLangCode = resolveLang(loadConfig().lang || "auto");
    const _customPack = loadCustomLangPack();
    const _customLabel = (_customPack && _customPack.langName) ? _customPack.langName : "Custom";
    const LANG_FLAGS = { "zh-TW": "🇹🇼", "zh-CN": "🇨🇳", en: "🇺🇸", ja: "🇯🇵", ko: "🇰🇷", es: "🇪🇸", "pt-BR": "🇧🇷", fr: "🇫🇷", custom: "✏️" };
    const LANG_NAMES = { "zh-TW": "繁中", "zh-CN": "简中", en: "EN", ja: "日本語", ko: "한국어", es: "Español", "pt-BR": "Português", fr: "Français", custom: _customLabel };
    langBtn.textContent = `${LANG_FLAGS[currentLangCode] ?? "🌐"} ${LANG_NAMES[currentLangCode] ?? currentLangCode}`;
    langBtn.title = t("lang_label");

    let submenuVisible = false;
    langBtn.onclick = (e) => {
      e.stopPropagation();
      submenuVisible = !submenuVisible;
      if (submenuVisible) {
        const submenu = document.createElement("div");
        submenu.className = "grok-lang-submenu";
        submenu.id = "grok-lang-submenu";
        const langs = [
          { code: "zh-TW", label: "🇹🇼 繁體中文" },
          { code: "zh-CN", label: "🇨🇳 简体中文" },
          { code: "en",    label: "🇺🇸 English" },
          { code: "ja",    label: "🇯🇵 日本語" },
          { code: "ko",    label: "🇰🇷 한국어" },
          { code: "es",    label: "🇪🇸 Español" },
          { code: "pt-BR", label: "🇧🇷 Português (BR)" },
          { code: "fr",    label: "🇫🇷 Français" },
        ];
        langs.push({ code: "custom", label: `✏️ ${_customLabel}` });
        langs.forEach(({ code, label }) => {
          const item = document.createElement("div");
          item.className = "grok-lang-submenu-item" + (code === currentLangCode ? " active" : "");
          item.textContent = label + (code === currentLangCode ? " ✓" : "");
          item.onclick = (ev) => {
            ev.stopPropagation();
            const config = loadConfig();
            config.lang = code;
            saveConfig(config);
            overlay.remove();
            menu.remove();
            showToast(`${LANG_FLAGS[code] ?? "🌐"} ${LANG_NAMES[code] ?? code}`);
          };
          submenu.appendChild(item);
        });
        menu.appendChild(submenu);
      } else {
        document.getElementById("grok-lang-submenu")?.remove();
      }
    };

    const settingsBtn = document.createElement("div");
    settingsBtn.className = "grok-settings-btn";
    settingsBtn.title = t("settings_tooltip");
    settingsBtn.textContent = "⚙️";
    settingsBtn.onclick = (e) => {
      e.stopPropagation();
      overlay.remove();
      menu.remove();
      openSettings();
    };

    footer.appendChild(langBtn);
    footer.appendChild(settingsBtn);
    menu.appendChild(footer);

    document.body.appendChild(menu);
  }

  function findGlobalGrokButton() {
    const paths = document.querySelectorAll("path");
    for (let p of paths) {
      if (isGrokIcon(p)) {
        const btn = p.closest("button");
        if (
          btn &&
          !btn.closest("article") &&
          !btn.classList.contains("my-commander-btn") &&
          btn.offsetParent !== null
        ) {
          return btn;
        }
      }
    }
    return null;
  }

  function triggerClick(element) {
    if (!element) return;
    element.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
    );
    element.dispatchEvent(
      new MouseEvent("mouseup", { bubbles: true, cancelable: true }),
    );
    element.click();
  }

  function findDrawerPrivacyButton() {
    const labels = [
      "私人聊天",
      "非公開",
      "Private chat", "Private Chat",
      "私密聊天",
      "비공개 채팅",
      "プライベートチャット",
      "Chat privado",
      "Bate-papo privado",
      "Discussion privée", "Chat privé",
    ];
    for (const label of labels) {
      const btn = document.querySelector(
        `button[aria-label="${label}"], [role="button"][aria-label="${label}"]`
      );
      if (btn && btn.offsetParent !== null) return btn;
    }
    return null;
  }

  function isDrawerPrivacyOn(btn) {
    if (!btn) return false;
    const svg = btn.querySelector("svg");
    return svg ? svg.classList.contains("r-1cvl2hr") : false;
  }

  function ensureDrawerPrivacyState(withPrivacy) {
    const btn = findDrawerPrivacyButton();
    if (!btn) return { found: false, needsSecondClick: false };
    const currentlyOn = isDrawerPrivacyOn(btn);
    if (!withPrivacy) {
      if (currentlyOn) triggerClick(btn);
      return { found: true, needsSecondClick: false };
    } else {
      if (!currentlyOn) {
        triggerClick(btn);
        return { found: true, needsSecondClick: false };
      } else {
        return { found: true, needsSecondClick: false };
      }
    }
  }

  function executePrivateCommand(prompt, tweetData) {
    executeCommand(prompt, tweetData, true);
  }

  function executeCommand(prompt, tweetData, withPrivacy = false) {
    const fullContent = `${prompt}\n\n[Tweet URL]: ${tweetData.url}\n[Tweet Content]: ${tweetData.text}`;
    const autoSend = loadConfig().autoSend === true;
    pendingTask = {
      content: fullContent,
      autoSend,
      withPrivacy,
      textFilled: false,
      injectCount: 0,
    };

    const existingTextarea = (() => {
      for (const ta of document.querySelectorAll("textarea")) {
        if (ta.offsetParent !== null) return ta;
      }
      return null;
    })();

    if (existingTextarea) {
      console.log("[Commander] 側邊欄已開啟 -> 直接填入（繞過全域按鈕）");
      pendingTask.targetInput = existingTextarea;

      const drawerObs = new MutationObserver(() => {
        if (existingTextarea.offsetParent === null) {
          drawerObs.disconnect();
          showWarnToast(t("need_reopen"));
        }
      });
      drawerObs.observe(document.body, { childList: true, subtree: true });

      startInjectionDirect(existingTextarea, withPrivacy);
      return;
    }

    const hasOpenedBefore = GM_getValue("grok_drawer_opened", false);
    if (!hasOpenedBefore) {
      const globalBtn = findGlobalGrokButton();
      if (globalBtn) {
        GM_setValue("grok_drawer_opened", true);
        console.log("[Commander] 首次自動開啟側邊欄...");
        triggerClick(globalBtn);

        const waitForTextarea = new MutationObserver(() => {
          for (const ta of document.querySelectorAll("textarea")) {
            if (ta.offsetParent !== null) {
              waitForTextarea.disconnect();
              const drawerObs = new MutationObserver(() => {
                if (ta.offsetParent === null) {
                  drawerObs.disconnect();
                  showWarnToast(t("need_reopen"));
                }
              });
              drawerObs.observe(document.body, { childList: true, subtree: true });
              return;
            }
          }
        });
        waitForTextarea.observe(document.body, { childList: true, subtree: true });

        startInjection(withPrivacy);
        return;
      }
    }
    showWarnToast(t("need_reopen"));
  }

  function startInjectionDirect(targetInput, withPrivacy = false) {
    if (activeInterval) { clearInterval(activeInterval); activeInterval = null; }
    let attempts = 0;
    let clearedInput = false;
    let privateHandled = false;
    let textareaEverSeen = !!targetInput;

    activeInterval = setInterval(() => {
      attempts++;
      if (attempts > 80 || !pendingTask) {
        resetGlobalState();
        return;
      }

      const stillVisible = targetInput && targetInput.offsetParent !== null;
      if (textareaEverSeen && !stillVisible) {
        console.warn("[Commander] textarea 消失，中止直接注入");
        resetGlobalState();
        showWarnToast(t("need_reopen"));
        return;
      }

      if (!privateHandled) {
        const result = ensureDrawerPrivacyState(withPrivacy);
        if (result.found) {
          privateHandled = true;
          return;
        } else if (attempts > 12) {
          privateHandled = true;
        } else {
          return;
        }
      }

      if (!pendingTask.textFilled) {
        if (!clearedInput) {
          setReactValue(targetInput, "");
          clearedInput = true;
          return;
        }
        setReactValue(targetInput, pendingTask.content);
        targetInput.focus();
        pendingTask.textFilled = true;
        pendingTask.targetInput = targetInput;
        return;
      }

      if (pendingTask.textFilled && pendingTask.autoSend) {
        if (pendingTask.targetInput) simulateEnterKey(pendingTask.targetInput);
        let targetBtn = null;
        const buttons = document.querySelectorAll("button");
        for (let btn of buttons) {
          const label = btn.getAttribute("aria-label");
          if (label && BLACKLIST_LABELS.some((bad) => label.toLowerCase().includes(bad))) continue;
          if (label && SEND_BTN_LABELS.some((good) => label === good)) { targetBtn = btn; break; }
          const svgPath = btn.querySelector("path");
          if (svgPath) {
            const d = svgPath.getAttribute("d");
            if (d === SEND_SVG_FINGERPRINT || (d && d.startsWith("M12 3.59"))) {
              if (!d.startsWith("M3 12")) { targetBtn = btn; break; }
            }
          }
        }
        if (targetBtn && !targetBtn.disabled && targetBtn.getAttribute("aria-disabled") !== "true") {
          triggerClick(targetBtn);
          setTimeout(() => {
            if (pendingTask && pendingTask.targetInput) setReactValue(pendingTask.targetInput, "");
            resetGlobalState();
          }, 500);
        }
      }
    }, 100);
  }

  function startInjection(withPrivacy = false) {
    if (activeInterval) { clearInterval(activeInterval); activeInterval = null; }
    let attempts = 0;
    let privateModeClicked = false;
    let clearedInput = false;
    let textareaEverSeen = false;

    activeInterval = setInterval(() => {
      attempts++;
      if (attempts > 80 || !pendingTask) {
        resetGlobalState();
        return;
      }
      const mask = document.querySelector('[data-testid="mask"]');
      const closeBtn = document.querySelector(
        'button[data-testid="app-bar-close"]',
      );
      if (mask && closeBtn) {
        console.warn("[Commander] 攔截到生圖視窗 -> 執行關閉！");
        triggerClick(closeBtn);
        return;
      }

      const textarea_check = (() => {
        for (const ta of document.querySelectorAll("textarea")) {
          if (ta.offsetParent !== null) return ta;
        }
        return null;
      })();

      if (textarea_check) textareaEverSeen = true;

      if (textareaEverSeen && !textarea_check) {
        resetGlobalState();
        showWarnToast(t("need_reopen"));
        return;
      }

      if (!privateModeClicked) {
        const result = ensureDrawerPrivacyState(withPrivacy);
        if (result.found) {
          privateModeClicked = true;
          return;
        }
        const privacyLabels = [
          "私人", "非公開", "Private", "隐私",
          "プライベート", "비공개", "Privado", "Privé", "Privat",
          "Privée", "Particular",
        ];
        for (const label of privacyLabels) {
          const btn = document.querySelector(
            `button[aria-label="${label}"], [role="button"][aria-label="${label}"]`,
          );
          if (btn && btn.offsetParent !== null) {
            if (isDrawerPrivacyOn(btn) !== withPrivacy) triggerClick(btn);
            privateModeClicked = true;
            return;
          }
        }
        if (attempts > 12) privateModeClicked = true;
      }

      const targetInput = textarea_check;

      if (pendingTask.textFilled && !targetInput) {
        resetGlobalState();
        return;
      }

      if (targetInput && privateModeClicked && !pendingTask.textFilled) {
        if (!clearedInput) {
          setReactValue(targetInput, "");
          clearedInput = true;
          return;
        }
        setReactValue(targetInput, pendingTask.content);
        targetInput.focus();
        pendingTask.textFilled = true;
        pendingTask.targetInput = targetInput;
        return;
      }

      if (pendingTask.textFilled && pendingTask.autoSend) {
        if (pendingTask.targetInput) {
          console.log("[Commander] 模擬 Enter 發送...");
          simulateEnterKey(pendingTask.targetInput);
        }

        let targetBtn = null;
        const buttons = document.querySelectorAll("button");

        for (let btn of buttons) {
          const label = btn.getAttribute("aria-label");
          if (
            label &&
            BLACKLIST_LABELS.some((bad) => label.toLowerCase().includes(bad))
          )
            continue;

          if (label && SEND_BTN_LABELS.some((good) => label === good)) {
            targetBtn = btn;
            break;
          }

          const svgPath = btn.querySelector("path");
          if (svgPath) {
            const d = svgPath.getAttribute("d");
            if (d === SEND_SVG_FINGERPRINT || (d && d.startsWith("M12 3.59"))) {
              if (!d.startsWith("M3 12")) {
                targetBtn = btn;
                break;
              }
            }
          }
        }

        if (
          targetBtn &&
          !targetBtn.disabled &&
          targetBtn.getAttribute("aria-disabled") !== "true"
        ) {
          console.log("[Commander] 鎖定發送按鈕 -> 點擊！");
          triggerClick(targetBtn);

          setTimeout(() => {
            if (pendingTask && pendingTask.targetInput) {
              setReactValue(pendingTask.targetInput, "");
              console.log("[Commander] 輸入框已強制清空");
            }
            resetGlobalState();
          }, 500);
        }
      }
    }, 100);
  }

  const style = document.createElement("style");
  style.textContent = STYLES;
  document.head.appendChild(style);

  const observer = new MutationObserver(() => hijackOperations());
  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(hijackOperations, 1000);

  GM_setValue("grok_drawer_opened", false);

  const hasRun = GM_getValue("grok_setup_complete_global", false);
  if (!hasRun) {
    setTimeout(() => {
      openSettings();
      GM_setValue("grok_setup_complete_global", true);
    }, 2000);
  }

  GM_registerMenuCommand("⚙️ Grok Commander 設定", () => openSettings());

  console.log("X Grok Commander V24 (URL Converter for Push) Loaded");
})();