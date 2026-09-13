// ==UserScript==
// @name         X (Twitter) — Grok Commander
// @name:zh-TW   X (Twitter) — Grok 指揮官
// @name:zh-CN   X (Twitter) — Grok 指挥官
// @name:ja      X (Twitter) — Grok コマンダー
// @name:ko      X (Twitter) — Grok 커맨더
// @name:es      X (Twitter) — Grok Comandante
// @name:pt-BR   X (Twitter) — Grok Comandante
// @name:fr      X (Twitter) — Grok Commandant
// @namespace    https://greasyfork.org/en/users/1575945-star-tanuki07
// @homepageURL  https://github.com/Startanuki07
// @version      2.0.0.0
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
// @description:zh-TW 將每則推文旁的 Grok 按鈕替換為 AI 指令選單，提供 3 種內建模式（事實查核、深度分析、重點摘要）與 2 個完全可自訂的備用槽位（反駁視角、翻譯/自訂）。每種模式可發送至側邊欄，或透過 🔒 私人模式跳轉至 x.com/i/grok 保護隱私。支援手動或自動送出、多語言自動偵測與各語言獨立模板自訂。適合偶爾想快速理解時事話題脈絡的一般用戶。
// @description:zh-CN 将每条推文旁的 Grok 按钮替换为 AI 指令菜单，提供 3 种内置模式（事实核查、深度分析、重点摘要）与 2 个完全可自定义的备用槽位（反驳视角、翻译/自定义）。每种模式可发送至侧边栏，或通过 🔒 私密模式跳转至 x.com/i/grok 保护隐私。支持手动或自动发送、多语言自动检测与各语言独立模板自定义。适合偶尔想快速了解热点话题背景的普通用户。
// @description:ja    各ツイートのGrokボタンをAIコマンドメニューに置き換え、3つの内蔵モード（ファクトチェック・詳細分析・要点まとめ）と2つのカスタムスロット（反論視点・翻訳/カスタム）を提供。サイドバーへの送信、または 🔒 プライベートモードで x.com/i/grok へ転送することもできます。手動・自動送信、多言語自動検出、言語別テンプレートカスタマイズに対応。トレンドの話題を気軽に把握したいカジュアルユーザーに最適。
// @description:ko    모든 트윗의 Grok 버튼을 AI 명령 메뉴로 교체하여 3가지 내장 모드（팩트 체크・심층 분석・핵심 요약）와 2개의 커스텀 슬롯（반론 시각・번역/커스텀）을 제공합니다. 사이드바로 전송하거나 🔒 비공개 모드로 x.com/i/grok 에서 처리할 수 있습니다. 수동/자동 전송, 다국어 자동 감지, 언어별 템플릿 커스터마이즈 지원. 트렌드 주제를 가볍게 파악하고 싶은 일반 사용자에게 적합합니다.
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
        private_tooltip: "私人模式（開啟後以私人聊天執行指令）",
        btn_confirm: "確定",
        privacy_auto_synced: "已自動同步私人模式狀態",
        settings_tooltip: "設定 (Settings)",
        commander_btn_label: "Grok 指揮官",
        commander_btn_title: "AI 指揮官（已啟用）",
        need_reopen: "找不到右下角的 Grok 按鈕，請先手動點擊開啟側邊欄再使用指令選單；若瀏覽器視窗較窄，該按鈕可能被隱藏，請嘗試拉寬視窗",
        push_section_label: "📨 推送設定 (Push Notifications)",
        push_section_desc: "將貼文連結自動推送到 Discord 頻道或 Telegram 群組／頻道。",
        tmpl_section_label: "✏️ 提示詞模板 (Prompt Templates)",
        tmpl_section_hint: "點選選單中的模式時，對應的提示詞會自動附加到貼文內容後方。",
        tmpl_reset_one_tooltip: "重置此模板為預設值",
        confirm_reset_one: "確定要將「{label}」模板恢復為預設值？此操作可用 Ctrl+Z 復原。",
        toast_reset_one: "已重置「{label}」模板（可按 Ctrl+Z 復原）",
        push_discord_url: "Discord Webhook URL",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Telegram Bot Token",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "Telegram Chat ID",
        push_tg_chat_placeholder: "-100xxxxxxxxxx 或 @頻道名稱",
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
        unsaved_title: "有未儲存的變更",
        unsaved_save_close: "💾 儲存並關閉",
        unsaved_discard: "不儲存，直接關閉",
        unsaved_footer_hint: "有未儲存的變更",
        tab_options: "選項",
        privacy_mode_badge_tooltip: "切換私人模式操作方式",
        privacy_mode_switched_per_item: "已切換：每個模板各自一顆私人模式按鈕",
        privacy_mode_switched_toggle: "已切換：單一全域私人模式開關",
        tab_template: "模板",
        tab_push: "推送",
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
        private_tooltip: "私密模式（开启后以私密聊天执行指令）",
        btn_confirm: "确定",
        privacy_auto_synced: "已自动同步私密模式状态",
        settings_tooltip: "设置 (Settings)",
        commander_btn_label: "Grok 指挥官",
        commander_btn_title: "AI 指挥官（已启用）",
        need_reopen: "找不到右下角的 Grok 按钮，请先手动点击打开侧边栏再使用指令菜单；若浏览器窗口较窄，该按钮可能被隐藏，请尝试拉宽窗口",
        push_section_label: "📨 推送设置 (Push Notifications)",
        push_section_desc: "将贴文链接自动推送到 Discord 频道或 Telegram 群组／频道。",
        tmpl_section_label: "✏️ 提示词模板 (Prompt Templates)",
        tmpl_section_hint: "点选菜单中的模式时，对应的提示词会自动附加到贴文内容后方。",
        tmpl_reset_one_tooltip: "将此模板重置为默认值",
        confirm_reset_one: "确定要将\"{label}\"模板恢复为默认值？此操作可用 Ctrl+Z 撤销。",
        toast_reset_one: "已重置\"{label}\"模板（可按 Ctrl+Z 撤销）",
        push_discord_url: "Discord Webhook URL",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Telegram Bot Token",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "Telegram Chat ID",
        push_tg_chat_placeholder: "-100xxxxxxxxxx 或 @频道名",
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
        unsaved_title: "有未保存的更改",
        unsaved_save_close: "💾 保存并关闭",
        unsaved_discard: "不保存，直接关闭",
        unsaved_footer_hint: "有未保存的更改",
        tab_options: "选项",
        privacy_mode_badge_tooltip: "切换私密模式操作方式",
        privacy_mode_switched_per_item: "已切换：每个模板各自一颗私密模式按钮",
        privacy_mode_switched_toggle: "已切换：单一全局私密模式开关",
        tab_template: "模板",
        tab_push: "推送",
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
        private_tooltip: "Private Mode (runs command in private chat when enabled)",
        btn_confirm: "Confirm",
        privacy_auto_synced: "Private mode auto-synced",
        settings_tooltip: "Settings",
        commander_btn_label: "Grok Commander",
        commander_btn_title: "AI Commander (Active)",
        need_reopen: "Couldn't find the Grok button (bottom-right). Please open the sidebar manually first, then use the command menu; if your browser window is narrow, the button may be hidden — try widening it",
        push_section_label: "📨 Push Notifications",
        push_section_desc: "Automatically push post links to a Discord channel or Telegram group/channel.",
        tmpl_section_label: "✏️ Prompt Templates",
        tmpl_section_hint: "When you select a mode from the menu, its prompt is automatically appended to the post content.",
        tmpl_reset_one_tooltip: "Reset this template to default",
        confirm_reset_one: "Reset the \"{label}\" template to its default value? You can undo this with Ctrl+Z.",
        toast_reset_one: "Reset \"{label}\" template to default (press Ctrl+Z to undo)",
        push_discord_url: "Discord Webhook URL",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Telegram Bot Token",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "Telegram Chat ID",
        push_tg_chat_placeholder: "-100xxxxxxxxxx or @channelname",
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
        unsaved_title: "You have unsaved changes",
        unsaved_save_close: "💾 Save & Close",
        unsaved_discard: "Discard & Close",
        unsaved_footer_hint: "You have unsaved changes",
        tab_options: "Options",
        privacy_mode_badge_tooltip: "Switch private mode UI style",
        privacy_mode_switched_per_item: "Switched: per-template private mode button",
        privacy_mode_switched_toggle: "Switched: single global private mode toggle",
        tab_template: "Templates",
        tab_push: "Push",
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
        private_tooltip: "プライベートモード（有効時はプライベートチャットでコマンドを実行）",
        btn_confirm: "確定",
        privacy_auto_synced: "プライベートモードを自動同期しました",
        settings_tooltip: "設定 (Settings)",
        commander_btn_label: "Grok コマンダー",
        commander_btn_title: "AI コマンダー（有効）",
        need_reopen: "右下のGrokボタンが見つかりません。手動でサイドバーを開いてからコマンドメニューをご利用ください。ブラウザの幅が狭いとボタンが隠れることがあるので、幅を広げてお試しください",
        push_section_label: "📨 プッシュ通知設定",
        push_section_desc: "投稿リンクを Discord チャンネルまたは Telegram グループ／チャンネルに自動送信します。",
        tmpl_section_label: "✏️ プロンプトテンプレート",
        tmpl_section_hint: "メニューからモードを選択すると、対応するプロンプトが投稿内容の後に自動追加されます。",
        tmpl_reset_one_tooltip: "このテンプレートをデフォルトに戻す",
        confirm_reset_one: "「{label}」テンプレートをデフォルトに戻しますか？Ctrl+Z で元に戻せます。",
        toast_reset_one: "「{label}」テンプレートをデフォルトに戻しました（Ctrl+Z で元に戻せます）",
        push_discord_url: "Discord Webhook URL",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Telegram Bot Token",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "Telegram Chat ID",
        push_tg_chat_placeholder: "-100xxxxxxxxxx または @チャンネル名",
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
        unsaved_title: "保存されていない変更があります",
        unsaved_save_close: "💾 保存して閉じる",
        unsaved_discard: "保存せずに閉じる",
        unsaved_footer_hint: "保存されていない変更があります",
        tab_options: "オプション",
        privacy_mode_badge_tooltip: "プライベートモードの操作方式を切替",
        privacy_mode_switched_per_item: "切替：テンプレートごとの個別ボタン方式",
        privacy_mode_switched_toggle: "切替：単一のグローバルトグル方式",
        tab_template: "テンプレート",
        tab_push: "プッシュ",
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
        private_tooltip: "비공개 모드（활성화 시 비공개 채팅으로 명령 실행）",
        btn_confirm: "확인",
        privacy_auto_synced: "비공개 모드가 자동으로 동기화되었습니다",
        settings_tooltip: "설정 (Settings)",
        commander_btn_label: "Grok 커맨더",
        commander_btn_title: "AI 커맨더（활성화）",
        need_reopen: "오른쪽 하단의 Grok 버튼을 찾을 수 없습니다. 먼저 수동으로 사이드바를 연 후 명령 메뉴를 사용하세요. 브라우저 창이 좁으면 버튼이 가려질 수 있으니 창을 넓혀 보세요",
        push_section_label: "📨 푸시 알림 설정",
        push_section_desc: "게시물 링크를 Discord 채널 또는 Telegram 그룹/채널로 자동 전송합니다.",
        tmpl_section_label: "✏️ 프롬프트 템플릿",
        tmpl_section_hint: "메뉴에서 모드를 선택하면 해당 프롬프트가 게시물 내용 뒤에 자동으로 추가됩니다.",
        tmpl_reset_one_tooltip: "이 템플릿을 기본값으로 재설정",
        confirm_reset_one: "「{label}」 템플릿을 기본값으로 재설정하시겠습니까? Ctrl+Z로 되돌릴 수 있습니다.",
        toast_reset_one: "「{label}」 템플릿을 기본값으로 재설정했습니다 (Ctrl+Z로 되돌리기 가능)",
        push_discord_url: "Discord Webhook URL",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Telegram Bot Token",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "Telegram Chat ID",
        push_tg_chat_placeholder: "-100xxxxxxxxxx 또는 @채널명",
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
        unsaved_title: "저장되지 않은 변경 사항이 있습니다",
        unsaved_save_close: "💾 저장 후 닫기",
        unsaved_discard: "저장 안 하고 닫기",
        unsaved_footer_hint: "저장되지 않은 변경 사항이 있습니다",
        tab_options: "옵션",
        privacy_mode_badge_tooltip: "비공개 모드 조작 방식 전환",
        privacy_mode_switched_per_item: "전환됨: 템플릿별 개별 버튼 방식",
        privacy_mode_switched_toggle: "전환됨: 단일 전역 토글 방식",
        tab_template: "템플릿",
        tab_push: "푸시",
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
        private_tooltip: "Modo privado (ejecuta el comando en chat privado cuando está activado)",
        btn_confirm: "Confirmar",
        privacy_auto_synced: "Modo privado sincronizado automáticamente",
        settings_tooltip: "Configuración",
        commander_btn_label: "Grok Comandante",
        commander_btn_title: "Comandante IA (Activo)",
        need_reopen: "No se encontró el botón de Grok (abajo a la derecha). Ábrelo manualmente primero y luego usa el menú de comandos; si la ventana del navegador es estrecha, el botón puede estar oculto — intenta ensancharla",
        push_section_label: "📨 Notificaciones push",
        push_section_desc: "Envía automáticamente el enlace del post a un canal de Discord o grupo/canal de Telegram.",
        tmpl_section_label: "✏️ Plantillas de prompts",
        tmpl_section_hint: "Al seleccionar un modo del menú, el prompt correspondiente se añade automáticamente al contenido del post.",
        tmpl_reset_one_tooltip: "Restablecer esta plantilla a su valor predeterminado",
        confirm_reset_one: "¿Restablecer la plantilla \"{label}\" a su valor predeterminado? Puedes deshacerlo con Ctrl+Z.",
        toast_reset_one: "Plantilla \"{label}\" restablecida (Ctrl+Z para deshacer)",
        push_discord_url: "URL de Discord Webhook",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Token del Bot de Telegram",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "ID de Chat de Telegram",
        push_tg_chat_placeholder: "-100xxxxxxxxxx o @nombrecanal",
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
        unsaved_title: "Hay cambios sin guardar",
        unsaved_save_close: "💾 Guardar y cerrar",
        unsaved_discard: "Cerrar sin guardar",
        unsaved_footer_hint: "Hay cambios sin guardar",
        tab_options: "Opciones",
        privacy_mode_badge_tooltip: "Cambiar estilo del modo privado",
        privacy_mode_switched_per_item: "Cambiado: botón individual por plantilla",
        privacy_mode_switched_toggle: "Cambiado: interruptor global único",
        tab_template: "Plantillas",
        tab_push: "Envío",
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
        private_tooltip: "Modo privado (executa o comando em chat privado quando ativado)",
        btn_confirm: "Confirmar",
        privacy_auto_synced: "Modo privado sincronizado automaticamente",
        settings_tooltip: "Configurações",
        commander_btn_label: "Grok Comandante",
        commander_btn_title: "Comandante IA (Ativo)",
        need_reopen: "Não foi possível encontrar o botão do Grok (canto inferior direito). Abra o painel manualmente primeiro e depois use o menu de comandos; se a janela do navegador estiver estreita, o botão pode estar oculto — tente alargá-la",
        push_section_label: "📨 Notificações push",
        push_section_desc: "Envia automaticamente o link do post para um canal do Discord ou grupo/canal do Telegram.",
        tmpl_section_label: "✏️ Templates de prompts",
        tmpl_section_hint: "Ao selecionar um modo no menu, o prompt correspondente é adicionado automaticamente ao conteúdo do post.",
        tmpl_reset_one_tooltip: "Restaurar este modelo para o padrão",
        confirm_reset_one: "Restaurar o modelo \"{label}\" para o padrão? Você pode desfazer com Ctrl+Z.",
        toast_reset_one: "Modelo \"{label}\" restaurado para o padrão (Ctrl+Z para desfazer)",
        push_discord_url: "URL do Discord Webhook",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Token do Bot do Telegram",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "ID do Chat do Telegram",
        push_tg_chat_placeholder: "-100xxxxxxxxxx ou @nomecanal",
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
        unsaved_title: "Há alterações não salvas",
        unsaved_save_close: "💾 Salvar e fechar",
        unsaved_discard: "Fechar sem salvar",
        unsaved_footer_hint: "Há alterações não salvas",
        tab_options: "Opções",
        privacy_mode_badge_tooltip: "Alternar estilo do modo privado",
        privacy_mode_switched_per_item: "Alterado: botão individual por modelo",
        privacy_mode_switched_toggle: "Alterado: alternador global único",
        tab_template: "Modelos",
        tab_push: "Envio",
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
        private_tooltip: "Mode privé (exécute la commande en chat privé une fois activé)",
        btn_confirm: "Confirmer",
        privacy_auto_synced: "Mode privé synchronisé automatiquement",
        settings_tooltip: "Paramètres",
        commander_btn_label: "Grok Commandant",
        commander_btn_title: "Commandant IA (Actif)",
        need_reopen: "Bouton Grok introuvable (en bas à droite). Ouvrez d'abord le panneau manuellement, puis utilisez le menu de commandes ; si la fenêtre du navigateur est étroite, le bouton peut être masqué — essayez de l'élargir",
        push_section_label: "📨 Notifications push",
        push_section_desc: "Envoie automatiquement le lien du post vers un canal Discord ou un groupe/canal Telegram.",
        tmpl_section_label: "✏️ Modèles de prompts",
        tmpl_section_hint: "Lorsque vous sélectionnez un mode dans le menu, le prompt correspondant est automatiquement ajouté au contenu du post.",
        tmpl_reset_one_tooltip: "Réinitialiser ce modèle aux valeurs par défaut",
        confirm_reset_one: "Réinitialiser le modèle « {label} » à sa valeur par défaut ? Vous pouvez annuler avec Ctrl+Z.",
        toast_reset_one: "Modèle « {label} » réinitialisé (Ctrl+Z pour annuler)",
        push_discord_url: "URL du Webhook Discord",
        push_discord_placeholder: "https://discord.com/api/webhooks/...",
        push_tg_token: "Token du Bot Telegram",
        push_tg_token_placeholder: "123456789:ABC-xxxxxxxx",
        push_tg_chat: "ID du Chat Telegram",
        push_tg_chat_placeholder: "-100xxxxxxxxxx ou @nomcanal",
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
        unsaved_title: "Des modifications non enregistrées existent",
        unsaved_save_close: "💾 Enregistrer et fermer",
        unsaved_discard: "Fermer sans enregistrer",
        unsaved_footer_hint: "Des modifications non enregistrées existent",
        tab_options: "Options",
        privacy_mode_badge_tooltip: "Changer le style du mode privé",
        privacy_mode_switched_per_item: "Changé : bouton individuel par modèle",
        privacy_mode_switched_toggle: "Changé : interrupteur global unique",
        tab_template: "Modèles",
        tab_push: "Envoi",
      },
    },
    templates: {
      "zh-TW": {
        factcheck: {
          label: "事實查核",
          icon: "🕵️",
          prompt:
            "請查核以下貼文的真實性。依序輸出：\n✅/❌ 整體判定（一句話）\n根據：列出支持或推翻的具體依據\n背景：補充必要的正確脈絡\n\n",
        },
        analysis: {
          label: "深度分析",
          icon: "📊",
          prompt:
            "請分析以下貼文：\n語氣與情緒傾向：作者用了什麼措辭？帶有哪種情緒？\n可能動機：發文者想達到什麼目的或強化什麼立場？\n潛在偏頗：有哪些資訊被刻意強調或省略？\n\n",
        },
        translate: {
          label: "自訂",
          icon: "✏️",
          prompt:
            "（可自訂的槽位，請在設定中填入你的提示詞）\n\n",
        },
        tree: {
          label: "重點摘要",
          icon: "📌",
          prompt:
            "TL;DR（一句話）：\n關鍵點 1：\n關鍵點 2：\n關鍵點 3：\n\n貼文內容：\n\n",
        },
        solution: {
          label: "反駁視角",
          icon: "⚖️",
          prompt:
            "針對以下貼文，提出最有力的反駁或另一種詮釋角度。要求：直接給出論點，不需要複述原文。\n\n",
        },
      },
      "zh-CN": {
        factcheck: {
          label: "事实核查",
          icon: "🕵️",
          prompt:
            "请核查以下帖子的真实性。依次输出：\n✅/❌ 整体判定（一句话）\n依据：列出支持或推翻的具体证据\n背景：补充必要的正确脉络\n\n",
        },
        analysis: {
          label: "深度分析",
          icon: "📊",
          prompt:
            "请分析以下帖子：\n语气与情绪倾向：作者用了什么措辞？带有哪种情绪？\n可能动机：发帖者想达到什么目的或强化什么立场？\n潜在偏颇：有哪些信息被刻意强调或省略？\n\n",
        },
        translate: {
          label: "自定义",
          icon: "✏️",
          prompt:
            "（可自定义的槽位，请在设置中填入你的提示词）\n\n",
        },
        tree: {
          label: "重点摘要",
          icon: "📌",
          prompt:
            "TL;DR（一句话）：\n关键点 1：\n关键点 2：\n关键点 3：\n\n帖子内容：\n\n",
        },
        solution: {
          label: "反驳视角",
          icon: "⚖️",
          prompt:
            "针对以下帖子，提出最有力的反驳或另一种诠释角度。要求：直接给出论点，不需要复述原文。\n\n",
        },
      },
      en: {
        factcheck: {
          label: "Fact Check",
          icon: "🕵️",
          prompt:
            "Fact-check the following post. Output in order:\n✅/❌ Verdict (one sentence)\nEvidence: specific facts that support or refute the claim\nContext: any necessary background\n\n",
        },
        analysis: {
          label: "Deep Analysis",
          icon: "📊",
          prompt:
            "Analyze the following post:\nTone & emotion: What language choices does the author make? What emotion does it carry?\nLikely intent: What is the poster trying to achieve or reinforce?\nPotential bias: What is being emphasized or left out?\n\n",
        },
        translate: {
          label: "Custom",
          icon: "✏️",
          prompt:
            "(Customizable slot — edit the prompt in Settings.)\n\n",
        },
        tree: {
          label: "Key Takeaways",
          icon: "📌",
          prompt:
            "TL;DR (one sentence):\nKey point 1:\nKey point 2:\nKey point 3:\n\nPost content:\n\n",
        },
        solution: {
          label: "Counter View",
          icon: "⚖️",
          prompt:
            "Give the strongest counterargument or alternative interpretation of the following post. Be direct — no need to restate the original.\n\n",
        },
      },
      ja: {
        factcheck: {
          label: "ファクトチェック",
          icon: "🕵️",
          prompt:
            "以下の投稿をファクトチェックしてください。次の順で出力：\n✅/❌ 判定（一文）\n根拠：主張を支持または否定する具体的な事実\n背景：必要な正確な文脈\n\n",
        },
        analysis: {
          label: "詳細分析",
          icon: "📊",
          prompt:
            "以下の投稿を分析してください：\nトーン・感情：どのような言葉を使っているか？どんな感情が込められているか？\n意図：投稿者は何を達成・強調しようとしているか？\n偏り：意図的に強調または省略されている情報は何か？\n\n",
        },
        translate: {
          label: "カスタム",
          icon: "✏️",
          prompt:
            "（カスタマイズ可能なスロット — 設定でプロンプトを編集してください）\n\n",
        },
        tree: {
          label: "要点まとめ",
          icon: "📌",
          prompt:
            "TL;DR（一文）：\n要点 1：\n要点 2：\n要点 3：\n\n投稿内容：\n\n",
        },
        solution: {
          label: "反論視点",
          icon: "⚖️",
          prompt:
            "以下の投稿に対して、最も説得力のある反論または別の解釈を示してください。原文の繰り返しは不要です。\n\n",
        },
      },
      ko: {
        factcheck: {
          label: "팩트 체크",
          icon: "🕵️",
          prompt:
            "다음 게시물을 팩트체크하세요. 순서대로 출력:\n✅/❌ 판정 (한 문장)\n근거: 주장을 지지하거나 반박하는 구체적 사실\n배경: 필요한 정확한 맥락\n\n",
        },
        analysis: {
          label: "심층 분석",
          icon: "📊",
          prompt:
            "다음 게시물을 분석하세요:\n어조·감정: 어떤 언어를 사용하는가? 어떤 감정이 담겨 있는가?\n의도: 작성자가 달성하거나 강조하려는 것은 무엇인가?\n편향: 의도적으로 강조되거나 생략된 정보는 무엇인가?\n\n",
        },
        translate: {
          label: "커스텀",
          icon: "✏️",
          prompt:
            "（커스터마이즈 가능한 슬롯 — 설정에서 프롬프트를 편집하세요）\n\n",
        },
        tree: {
          label: "핵심 요약",
          icon: "📌",
          prompt:
            "TL;DR (한 문장):\n핵심 1:\n핵심 2:\n핵심 3:\n\n게시물 내용:\n\n",
        },
        solution: {
          label: "반론 시각",
          icon: "⚖️",
          prompt:
            "다음 게시물에 대한 가장 설득력 있는 반론 또는 다른 해석을 제시하세요. 원문 반복은 불필요합니다.\n\n",
        },
      },
      es: {
        factcheck: {
          label: "Verificar datos",
          icon: "🕵️",
          prompt:
            "Verifica los hechos del siguiente post. Responde en orden:\n✅/❌ Veredicto (una frase)\nEvidencia: hechos concretos que apoyan o refutan la afirmación\nContexto: información de fondo necesaria\n\n",
        },
        analysis: {
          label: "Análisis profundo",
          icon: "📊",
          prompt:
            "Analiza el siguiente post:\nTono y emoción: ¿qué lenguaje usa el autor? ¿qué emoción transmite?\nIntención probable: ¿qué intenta lograr o reforzar?\nSesgo potencial: ¿qué se enfatiza o se omite deliberadamente?\n\n",
        },
        translate: {
          label: "Personalizado",
          icon: "✏️",
          prompt:
            "(Espacio personalizable — edita el prompt en Configuración.)\n\n",
        },
        tree: {
          label: "Puntos clave",
          icon: "📌",
          prompt:
            "TL;DR (una frase):\nPunto clave 1:\nPunto clave 2:\nPunto clave 3:\n\nContenido del post:\n\n",
        },
        solution: {
          label: "Contraargumento",
          icon: "⚖️",
          prompt:
            "Da el contraargumento más sólido o una interpretación alternativa del siguiente post. Sin repetir el original.\n\n",
        },
      },
      "pt-BR": {
        factcheck: {
          label: "Verificar fatos",
          icon: "🕵️",
          prompt:
            "Verifique os fatos do seguinte post. Responda em ordem:\n✅/❌ Veredicto (uma frase)\nEvidência: fatos concretos que apoiam ou refutam a afirmação\nContexto: informação de fundo necessária\n\n",
        },
        analysis: {
          label: "Análise profunda",
          icon: "📊",
          prompt:
            "Analise o seguinte post:\nTom e emoção: que linguagem o autor usa? Que emoção transmite?\nIntenção provável: o que tenta alcançar ou reforçar?\nViés potencial: o que é enfatizado ou omitido deliberadamente?\n\n",
        },
        translate: {
          label: "Personalizado",
          icon: "✏️",
          prompt:
            "(Slot personalizável — edite o prompt em Configurações.)\n\n",
        },
        tree: {
          label: "Pontos-chave",
          icon: "📌",
          prompt:
            "TL;DR (uma frase):\nPonto-chave 1:\nPonto-chave 2:\nPonto-chave 3:\n\nConteúdo do post:\n\n",
        },
        solution: {
          label: "Contra-argumento",
          icon: "⚖️",
          prompt:
            "Dê o contra-argumento mais forte ou uma interpretação alternativa do seguinte post. Sem repetir o original.\n\n",
        },
      },
      fr: {
        factcheck: {
          label: "Vérifier les faits",
          icon: "🕵️",
          prompt:
            "Vérifiez les faits du post suivant. Répondez dans l'ordre :\n✅/❌ Verdict (une phrase)\nPreuves : faits concrets qui soutiennent ou réfutent l'affirmation\nContexte : informations de fond nécessaires\n\n",
        },
        analysis: {
          label: "Analyse approfondie",
          icon: "📊",
          prompt:
            "Analysez le post suivant :\nTon et émotion : quel langage l'auteur utilise-t-il ? Quelle émotion transmet-il ?\nIntention probable : que cherche-t-il à accomplir ou à renforcer ?\nBiais potentiel : qu'est-ce qui est délibérément mis en avant ou omis ?\n\n",
        },
        translate: {
          label: "Personnalisé",
          icon: "✏️",
          prompt:
            "(Emplacement personnalisable — modifiez le prompt dans Paramètres.)\n\n",
        },
        tree: {
          label: "Points clés",
          icon: "📌",
          prompt:
            "TL;DR (une phrase) :\nPoint clé 1 :\nPoint clé 2 :\nPoint clé 3 :\n\nContenu du post :\n\n",
        },
        solution: {
          label: "Contre-argument",
          icon: "⚖️",
          prompt:
            "Donnez le contre-argument le plus solide ou une interprétation alternative du post suivant. Sans répéter l'original.\n\n",
        },
      },
    },
  };

  let _configCache = null;

  function migrateCustomTemplates(config) {
    const ct = config.customTemplates;
    if (ct && typeof ct._lang === "string" && !ct[ct._lang]) {
      const { _lang, ...rest } = ct;
      config.customTemplates = { [_lang]: rest };
    }
    return config;
  }

  function loadConfig() {
    if (_configCache) return _configCache;
    const saved = GM_getValue("grok_user_config", null);
    if (saved) {
      try {
        _configCache = migrateCustomTemplates(JSON.parse(saved));
        return _configCache;
      } catch (e) {
        console.warn("[Commander] Config corrupted, resetting.", e);
        GM_setValue("grok_user_config", null);
      }
    }
    _configCache = { lang: "auto", autoSend: false, customTemplates: null };
    return _configCache;
  }

  function saveConfig(config) {
    _configCache = config;
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
    const store = config.customTemplates || {};

    if (lang === "custom") {
      const pack = loadCustomLangPack();
      const base = (pack && pack.templates) ? pack.templates : DEFAULT_CONFIG.templates["en"];
      return store["custom"] || base;
    }

    const defaults =
      DEFAULT_CONFIG.templates[lang] || DEFAULT_CONFIG.templates["en"];
    return store[lang] || defaults;
  }

  const STYLES = `
        #grok-commander-menu {
            position: fixed; z-index: 99990;
            background-color: #000000; border: 1px solid #333639;
            border-radius: 12px;
            
            box-shadow:
                0 8px 16px rgba(255, 255, 255, 0.1),
                inset 0 0 0 1px rgba(255, 255, 255, 0.04),
                inset 0 1px 12px rgba(255, 255, 255, 0.03);
            padding: 8px; display: flex; flex-direction: column; gap: 4px;
            min-width: 170px; font-family: sans-serif;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.97) translateY(4px); }
            to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        #grok-commander-menu.grok-menu-expand-left {
            transform-origin: top right;
            animation: fadeInFromRight 0.15s ease-out;
        }
        #grok-commander-menu.grok-menu-expand-right {
            transform-origin: top left;
            animation: fadeInFromLeft 0.15s ease-out;
        }
        @keyframes fadeInFromRight {
            from { opacity: 0; transform: scale(0.97) translateX(6px); }
            to   { opacity: 1; transform: scale(1)    translateX(0); }
        }
        @keyframes fadeInFromLeft {
            from { opacity: 0; transform: scale(0.97) translateX(-6px); }
            to   { opacity: 1; transform: scale(1)    translateX(0); }
        }
        .grok-menu-item {
            display: flex; align-items: center; gap: 12px;
            padding: 10px 12px; color: #E7E9EA; font-size: 14px;
            border-radius: 8px; cursor: pointer; user-select: none;
            transition: background 0.1s, transform 0.1s;
        }
        .grok-menu-item:hover { background-color: #1D9BF0; color: #fff; transform: translateX(1px); }
        .grok-menu-item-label { flex: 1; }
        
        .grok-menu-item-icon {
            display: flex; align-items: center; justify-content: center;
            width: 20px; height: 20px; flex-shrink: 0; color: inherit;
        }
        .grok-menu-item-icon svg { display: block; }
        
        .grok-menu-titlebar {
            display: flex; justify-content: flex-end; align-items: center;
            padding: 2px 2px 6px;
        }
        .grok-menu-footer {
            margin-top: 4px; border-top: 1px solid #333; padding-top: 4px;
            display: flex; justify-content: space-between; align-items: center; gap: 6px;
        }
        
        .grok-privacy-btn-wrapper { position: relative; display: inline-flex; }
        
        .grok-privacy-toggle-btn {
            padding: 3px; font-size: 0; cursor: pointer; line-height: 1;
            color: #71767B; border-radius: 6px; border: 1px solid #333;
            background: transparent;
            display: inline-flex; align-items: center; justify-content: center;
            transition: background 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s;
            opacity: 0.55;
        }
        .grok-privacy-toggle-btn:hover { background: rgba(139,92,246,0.12); border-color: #a78bfa; opacity: 0.85; }
        .grok-privacy-toggle-btn.active {
            color: #a78bfa; border-color: #8b5cf6;
            background: rgba(139,92,246,0.15);
            opacity: 1;
        }
        
        .grok-privacy-toggle-btn.disabled-mode {
            cursor: default; opacity: 0.35; filter: grayscale(1);
        }
        .grok-privacy-toggle-btn.disabled-mode:hover { background: transparent; border-color: #333; opacity: 0.35; }
        
        .grok-privacy-mode-badge {
            position: absolute; top: -5px; right: -5px;
            width: 14px; height: 14px; padding: 0; font-size: 0;
            border-radius: 50%; border: 1px solid #000;
            background: rgba(113,118,123,0.7); color: #E7E9EA;
            cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none;
            transition: opacity 0.15s, background 0.15s;
        }
        .grok-privacy-btn-wrapper:hover .grok-privacy-mode-badge {
            opacity: 0.7; pointer-events: auto;
        }
        .grok-privacy-mode-badge:hover { opacity: 1; }
        .grok-privacy-mode-badge.per-item-active {
            background: rgba(139,92,246,0.85); color: #fff;
        }
        .grok-privacy-btn-wrapper:hover .grok-privacy-mode-badge.per-item-active {
            opacity: 0.9;
        }
        
        .grok-private-btn {
            font-size: 13px; padding: 4px 8px; border-radius: 6px;
            color: #1d9bf0; cursor: pointer; flex-shrink: 0;
            transition: background 0.1s, color 0.1s;
            border: 1px solid #1d9bf0;
            background: rgba(29,155,240,0.08);
            line-height: 1;
            display: inline-flex; align-items: center; justify-content: center;
        }
        .grok-private-btn:hover { background: rgba(139,92,246,0.2); color: #a78bfa; border-color: #a78bfa; }
        .grok-settings-btn {
            padding: 4px 8px; font-size: 18px; cursor: pointer;
            color: #71767B; border-radius: 4px;
        }
        .grok-settings-btn:hover { background-color: rgba(255,255,255,0.1); color: #fff; }
        @keyframes grok-settings-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(29,155,240,0.55); }
            50% { box-shadow: 0 0 0 6px rgba(29,155,240,0); }
        }
        .grok-settings-btn-highlight { border-radius: 50%; animation: grok-settings-pulse 1.6s ease-in-out infinite; }
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
            font-size: 13px; padding: 4px 8px; border-radius: 6px;
            color: #71767B; cursor: pointer; flex-shrink: 0;
            transition: background 0.1s, color 0.1s;
            border: 1px solid #333; background: transparent; line-height: 1;
            margin-left: 2px;
        }
        .grok-push-btn:hover { background: rgba(29,155,240,0.2); color: #1D9BF0; border-color: #1D9BF0; }

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
        
        .gcm-header-title { display: flex; align-items: center; gap: 8px; }
        .gcm-header-icon { display: flex; align-items: center; color: #1d9bf0; }
        .gcm-header-close {
            display: flex; align-items: center; cursor: pointer;
            color: #536471; transition: color 0.15s;
        }
        .gcm-header-close:hover { color: #E7E9EA; }
        
        .gcm-header-icon-sm {
            display: inline-flex; align-items: center; justify-content: center;
            width: 12px; height: 12px; color: inherit; margin-right: 2px;
        }
        .gcm-header-icon-sm svg { display: block; }
        .grok-modal-body {
            padding: 16px 20px !important;
            overflow-y: auto !important;
            flex: 1 !important;
            box-sizing: border-box !important;
            color: #E7E9EA !important;
            min-height: 0 !important;
            background: #080b10 !important;
        }

        .gcm-tab-bar {
            display: flex; gap: 4px; flex-shrink: 0;
            padding: 10px 20px 0; border-bottom: 1px solid #1e2532;
            background: #0d1117;
        }
        .gcm-tab-btn {
            flex: 1; background: transparent; border: none; color: #536471;
            padding: 9px 8px 11px; font-size: 12px; font-weight: 700; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 6px;
            border-bottom: 2px solid transparent; transition: color 0.15s, border-color 0.15s;
        }
        .gcm-tab-btn span.gcm-tab-icon {
            display: flex; align-items: center; justify-content: center;
            width: 14px; height: 14px; color: inherit;
        }
        .gcm-tab-btn span.gcm-tab-icon svg { display: block; }
        .gcm-tab-btn:hover { color: #E7E9EA; }
        .gcm-tab-btn.active { color: #1d9bf0; border-bottom-color: #1d9bf0; }

        .gcm-tab-pane { display: none; flex-direction: column; gap: 12px; }
        .gcm-tab-pane.active {
            display: flex;
            animation: gcm-pane-fade-in 0.2s ease-out;
        }
        @keyframes gcm-pane-fade-in {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .grok-modal-footer {
            padding: 12px 20px !important;
            border-top: 1px solid #1e2532 !important;
            display: flex !important;
            justify-content: flex-end !important;
            align-items: center !important;
            gap: 10px !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
            background: #0d1117 !important;
        }

        .grok-unsaved-dot {
            width: 8px; height: 8px; border-radius: 50%;
            background: #f0b429; margin-right: auto;
            opacity: 0; transform: scale(0.5);
            transition: opacity 0.15s ease, transform 0.15s ease;
            flex-shrink: 0;
        }
        .grok-unsaved-dot.visible { opacity: 1; transform: scale(1); }

        #grok-unsaved-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.65); z-index: 2147483645;
            display: flex; justify-content: center; align-items: center;
        }
        #grok-unsaved-box {
            background: #16181C; border: 1px solid #2f3336; border-radius: 14px;
            padding: 18px 20px; width: min(320px, 88vw);
            font-family: sans-serif; color: #E7E9EA;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
            display: flex; flex-direction: column; gap: 10px;
        }
        #grok-unsaved-box p { margin: 0 0 4px; font-size: 13px; line-height: 1.6; font-weight: 600; }
        .grok-unsaved-btn {
            padding: 9px 12px; border-radius: 10px; border: none;
            cursor: pointer; font-weight: 700; font-size: 13px;
            transition: opacity 0.15s, background 0.15s; text-align: center; width: 100%;
        }
        .grok-unsaved-btn:hover { opacity: 0.85; }
        .grok-unsaved-btn.primary { background: #1D9BF0; color: #fff; }
        .grok-unsaved-btn.danger  { background: transparent; color: #F4212E; border: 1px solid #F4212E; }
        .grok-unsaved-btn.ghost   { background: transparent; color: #8899A6; border: 1px solid #536471; }

        .grok-section-card {
            border-radius: 12px;
            margin-bottom: 14px;
            overflow: hidden;
            background: #12161f;
        }
        .grok-section-header {
            padding: 9px 16px;
            background: #171b26;
            font-size: 10px; font-weight: 700; color: #4a90d9;
            letter-spacing: 1px; text-transform: uppercase;
            display: flex; align-items: center; gap: 6px;
            border-left: 3px solid #1d9bf0;
        }
        .grok-section-body {
            padding: 14px 16px;
            display: flex; flex-direction: column; gap: 12px;
        }
        .grok-section-desc {
            font-size: 11px; color: #536471; line-height: 1.6;
            margin-bottom: 2px;
        }

        .grok-platform-badge {
            display: inline-flex; align-items: center; gap: 5px;
            font-size: 11px; font-weight: 700; padding: 2px 8px;
            border-radius: 10px; letter-spacing: 0.3px;
        }
        .grok-platform-badge.discord  { background: rgba(88,101,242,0.18); color: #8b9eff; border: 1px solid rgba(88,101,242,0.35); }
        .grok-platform-badge.telegram { background: rgba(41,182,246,0.18); color: #64c8f5; border: 1px solid rgba(41,182,246,0.35); }

        .grok-form-row { display: flex; flex-direction: column; gap: 5px; }
        .grok-form-label { font-size: 12px; font-weight: 600; color: #8899A6; }
        .grok-form-hint  { font-size: 11px; color: #3d4a55; margin-top: 2px; line-height: 1.5; }
        .grok-input-select {
            width: 100%; background: #0d1117; border: 1px solid #2f3336;
            color: #E7E9EA; padding: 8px 10px; border-radius: 8px; font-size: 13px;
            outline: none; transition: border-color 0.15s;
        }
        .grok-input-select:focus { border-color: #1d9bf0; }
        .grok-input-text {
            width: 100%; background: #0d1117; border: 1px solid #2f3336;
            color: #E7E9EA; padding: 7px 10px; border-radius: 8px; font-size: 12px;
            box-sizing: border-box; font-family: monospace; outline: none;
        }
        .grok-input-textarea {
            width: 100%; height: 80px; background: #0d1117; border: 1px solid #2f3336;
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

        .grok-push-entry { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; background: #171b26; border-radius: 8px; position: relative; }
        .grok-push-entry-header { display: flex; align-items: center; gap: 6px; }
        .grok-push-entry-label { flex: 1; background: #0d1117; border: 1px solid #2f3336; color: #E7E9EA; padding: 4px 8px; border-radius: 6px; font-size: 12px; }
        .grok-push-remove-btn {
            display: flex; align-items: center; justify-content: center;
            width: 20px; height: 20px; background: transparent; border: none;
            color: #536471; cursor: pointer; padding: 0; flex-shrink: 0;
            transition: color 0.15s;
        }
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

        .grok-tmpl-item { background: #171b26; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
        .grok-tmpl-title { font-size: 12px; font-weight: bold; color: #8899A6; margin-bottom: 2px; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
        .grok-tmpl-title-main { display: flex; align-items: center; gap: 6px; }
        .grok-tmpl-icon { display: flex; align-items: center; justify-content: center; width: 14px; height: 14px; color: inherit; flex-shrink: 0; }
        .grok-tmpl-icon svg { display: block; }
        .grok-tmpl-reset-btn {
            display: flex; align-items: center; justify-content: center;
            width: 22px; height: 22px; border-radius: 6px; background: transparent;
            color: #8899A6; cursor: pointer; padding: 0; transition: all 0.15s; flex-shrink: 0;
        }
        .grok-tmpl-reset-btn:hover { color: #1D9BF0; background: rgba(29,155,240,0.1); }
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

        #grok-confirm-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); z-index: 2147483646;
            display: flex; justify-content: center; align-items: center;
        }
        #grok-confirm-box {
            background: #16181C; border: 1px solid #2f3336; border-radius: 14px;
            padding: 18px 20px; width: min(320px, 88vw);
            font-family: sans-serif; color: #E7E9EA;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
        }
        #grok-confirm-box p { margin: 0 0 16px; font-size: 13px; line-height: 1.6; }
        .grok-confirm-btns { display: flex; justify-content: flex-end; gap: 8px; }

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
    var _unsavedGuardReady = false;

    document.getElementById("grok-commander-menu")?.remove();
    const config = loadConfig();
    const currentLang = config.lang;
    const templatesToEdit = getCurrentTemplates();

    const overlay = document.createElement("div");
    overlay.id = "grok-settings-overlay";

    const pc = loadPushConfig();
    let html = `
      <div id="grok-settings-modal">
        <div class="grok-modal-header">
          <span class="gcm-header-title">
            <span class="gcm-header-icon">${SETTINGS_ICON_SVG.gear}</span>
            <span>${t("settings_title").replace(/^\u2699\ufe0f?\s*/, "")}</span>
          </span>
          <span class="gcm-header-close" id="grok-settings-close">${SETTINGS_ICON_SVG.close}</span>
        </div>
        <div class="gcm-tab-bar">
          <button type="button" class="gcm-tab-btn active" data-tab="template">
            <span class="gcm-tab-icon">${SETTINGS_ICON_SVG.template}</span><span>${t("tab_template")}</span>
          </button>
          <button type="button" class="gcm-tab-btn" data-tab="lang_send">
            <span class="gcm-tab-icon">${SETTINGS_ICON_SVG.options}</span><span>${t("tab_options")}</span>
          </button>
          <button type="button" class="gcm-tab-btn" data-tab="push">
            <span class="gcm-tab-icon">${SETTINGS_ICON_SVG.push}</span><span>${t("tab_push")}</span>
          </button>
        </div>

        <div class="grok-modal-body">

          <div class="gcm-tab-pane active" data-pane="template">
            
            <div class="grok-section-card">
              <div class="grok-section-header"><span class="gcm-header-icon-sm">${SETTINGS_ICON_SVG.template}</span>${t("tmpl_section_label").replace(/^\u270f\ufe0f?\s*/, "")}</div>
              <div class="grok-section-body">
                <div class="grok-section-desc">${t("tmpl_section_hint")}</div>
                <div id="grok-template-editors"></div>
              </div>
            </div>
          </div>

          <div class="gcm-tab-pane" data-pane="lang_send">
            
            <div class="grok-section-card">
              <div class="grok-section-header"><span class="gcm-header-icon-sm">${SETTINGS_ICON_SVG.options}</span>${t("send_mode_label")} &amp; ${t("lang_label")}</div>
              <div class="grok-section-body">
                <div class="grok-form-row">
                  <label class="grok-form-label">${t("send_mode_label")}</label>
                  <select id="grok-autosend-select" class="grok-input-select">
                    <option value="manual" ${!config.autoSend?"selected":""}>${t("send_manual")}</option>
                    <option value="auto"   ${ config.autoSend?"selected":""}>${t("send_auto")}</option>
                  </select>
                  <div class="grok-form-hint">${t("send_mode_hint")}</div>
                </div>
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
                    <option value="custom" ${currentLang==="custom" ?"selected":""}>Custom Language</option>
                  </select>
                  <div class="grok-form-hint">${t("lang_hint")}</div>
                  <div id="grok-custom-lang-inline" style="display:${currentLang==="custom"?"flex":"none"};align-items:center;gap:8px;padding:6px 0 2px;">
                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="gcm-tab-pane" data-pane="push">
            
            <div class="grok-section-card">
              <div class="grok-section-header"><span class="gcm-header-icon-sm">${SETTINGS_ICON_SVG.push}</span>${t("push_section_label").replace(/^\ud83d\udce8\s*/,"")}</div>
              <div class="grok-section-body">
                <div class="grok-section-desc">${t("push_section_desc")}</div>
                <div class="grok-form-row">
                  <label class="grok-form-label">${t("push_url_converter")}</label>
                  <select id="grok-url-converter-select" class="grok-input-select">
                    <option value="x.com"         ${(!pc.urlConverter||pc.urlConverter==="x.com")?"selected":""}>x.com（不轉換）</option>
                    <option value="fixupx.com"    ${pc.urlConverter==="fixupx.com"   ?"selected":""}>fixupx.com</option>
                    <option value="fxtwitter.com" ${pc.urlConverter==="fxtwitter.com"?"selected":""}>fxtwitter.com</option>
                    <option value="vxtwitter.com" ${pc.urlConverter==="vxtwitter.com"?"selected":""}>vxtwitter.com</option>
                    <option value="cunnyx.com"    ${pc.urlConverter==="cunnyx.com"   ?"selected":""}>cunnyx.com</option>
                    <option value="fixvx.com"     ${pc.urlConverter==="fixvx.com"    ?"selected":""}>fixvx.com</option>
                    <option value="twitter.com"   ${pc.urlConverter==="twitter.com"  ?"selected":""}>twitter.com</option>
                  </select>
                  <div class="grok-form-hint">${t("push_url_converter_hint")}</div>
                </div>
                <div id="grok-push-discord-list"></div>
                <div id="grok-push-tg-list"></div>
              </div>
            </div>
          </div>

        </div>
        <div class="grok-modal-footer">
          <button id="grok-settings-reset"  class="grok-btn grok-btn-danger">${t("btn_reset")}</button>
          <div id="grok-unsaved-dot" class="grok-unsaved-dot" title="${escapeHtml(t("unsaved_footer_hint"))}"></div>
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
      display: "flex", justifyContent: "flex-end", gap: "10px",
      flexShrink: "0", padding: "12px 18px", boxSizing: "border-box",
      borderTop: "1px solid #2f3336", background: "#000",
    });

    const tabBtns = overlay.querySelectorAll(".gcm-tab-btn");
    const tabPanes = overlay.querySelectorAll(".gcm-tab-pane");
    function switchTab(key) {
      tabBtns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-tab") === key));
      tabPanes.forEach((p) => p.classList.toggle("active", p.getAttribute("data-pane") === key));
    }
    tabBtns.forEach((btn) => {
      btn.onclick = () => switchTab(btn.getAttribute("data-tab"));
    });

    const editorContainer = document.getElementById("grok-template-editors");

    function setUndoableValue(el, value) {
      el.focus();
      el.select();
      const ok = document.execCommand("insertText", false, value);
      if (!ok) {
        el.value = value;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    function getDefaultTemplatesForSelection() {
      const targetVal = langSelect.value;
      if (targetVal === "custom") {
        const pack = loadCustomLangPack();
        return (pack && pack.templates) ? pack.templates : DEFAULT_CONFIG.templates["en"];
      }
      const targetLang = resolveLang(targetVal);
      return DEFAULT_CONFIG.templates[targetLang] || DEFAULT_CONFIG.templates["en"];
    }

    function renderEditors(templates) {
      editorContainer.innerHTML = "";
      TEMPLATE_KEYS.forEach((key) => {
        const tmpl = templates[key];
        if (!tmpl) return;
        const div = document.createElement("div");
        div.className = "grok-tmpl-item";
        const tmplIconHtml = TEMPLATE_ICON_SVG[key] || `<span style="font-size:14px">${tmpl.icon}</span>`;
        div.innerHTML = `
          <div class="grok-tmpl-title">
            <span class="grok-tmpl-title-main"><span class="grok-tmpl-icon">${tmplIconHtml}</span>${escapeHtml(tmpl.label)}</span>
            <button type="button" class="grok-tmpl-reset-btn" data-reset-key="${key}" title="${escapeHtml(t("tmpl_reset_one_tooltip"))}">${SETTINGS_ICON_SVG.reset}</button>
          </div>
          <div class="grok-tmpl-row">
            <span>${t("label_label")}</span>
            <input type="text" class="grok-input-select" style="height:28px;padding:3px 8px;font-size:12px;flex:1;"
                   data-label-key="${key}" value="${escapeHtml(tmpl.label)}" maxlength="20">
          </div>
          <div class="grok-form-row">
            <label class="grok-form-label">${t("prompt_label")}</label>
            <textarea class="grok-input-textarea" data-key="${key}">${escapeHtml(tmpl.prompt)}</textarea>
          </div>
        `;
        editorContainer.appendChild(div);

        div.querySelector(`[data-reset-key="${key}"]`).onclick = () => {
          const labelInput = div.querySelector(`input[data-label-key="${key}"]`);
          const textarea = div.querySelector(`textarea[data-key="${key}"]`);
          const currentLabel = labelInput.value.trim() || tmpl.label;
          showCustomConfirm(t("confirm_reset_one").replace("{label}", currentLabel), () => {
            const defaults = getDefaultTemplatesForSelection();
            const def = defaults[key];
            if (!def) return;
            setUndoableValue(labelInput, def.label);
            setUndoableValue(textarea, def.prompt);
            showToast(t("toast_reset_one").replace("{label}", def.label));
          });
        };
      });
      if (_unsavedGuardReady) refreshUnsavedDot();
    }
    renderEditors(templatesToEdit);

    const MAX_PUSH = 10;

    function renderPushEntries(containerId, type, entries) {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = "";

      const header = document.createElement("div");
      header.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;";
      const badge = document.createElement("span");
      badge.className = `grok-platform-badge ${type}`;
      badge.textContent = type === "discord" ? "Discord" : "Telegram";
      header.appendChild(badge);
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
        removeBtn.innerHTML = SETTINGS_ICON_SVG.closeSmall;
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
      if (_unsavedGuardReady) refreshUnsavedDot();
    }

    const draftDiscord  = (pc.discord  || []).map(e => ({ ...e }));
    const draftTelegram = (pc.telegram || []).map(e => ({ ...e }));
    renderPushEntries("grok-push-discord-list", "discord",  draftDiscord);
    renderPushEntries("grok-push-tg-list",      "telegram", draftTelegram);

    function snapshotTemplateEditors() {
      const result = {};
      editorContainer.querySelectorAll("textarea[data-key]").forEach((ta) => {
        const key = ta.getAttribute("data-key");
        const labelInput = editorContainer.querySelector(`input[data-label-key="${key}"]`);
        result[key] = { label: labelInput ? labelInput.value : "", prompt: ta.value };
      });
      return JSON.stringify(result);
    }

    const initialSnapshot = {
      lang: document.getElementById("grok-lang-select").value,
      autoSend: document.getElementById("grok-autosend-select").value,
      templates: snapshotTemplateEditors(),
      urlConverter: document.getElementById("grok-url-converter-select").value,
      discord: JSON.stringify(draftDiscord),
      telegram: JSON.stringify(draftTelegram),
    };
    _unsavedGuardReady = true;

    function hasUnsavedChanges() {
      return (
        document.getElementById("grok-lang-select").value !== initialSnapshot.lang ||
        document.getElementById("grok-autosend-select").value !== initialSnapshot.autoSend ||
        snapshotTemplateEditors() !== initialSnapshot.templates ||
        document.getElementById("grok-url-converter-select").value !== initialSnapshot.urlConverter ||
        JSON.stringify(draftDiscord)  !== initialSnapshot.discord ||
        JSON.stringify(draftTelegram) !== initialSnapshot.telegram
      );
    }

    function refreshUnsavedDot() {
      const dotEl = document.getElementById("grok-unsaved-dot");
      if (dotEl) dotEl.classList.toggle("visible", hasUnsavedChanges());
    }
    modalEl.addEventListener("input",  refreshUnsavedDot);
    modalEl.addEventListener("change", refreshUnsavedDot);

    function attemptClose() {
      if (hasUnsavedChanges()) {
        showUnsavedCloseDialog();
      } else {
        closeSettings();
      }
    }

    function showUnsavedCloseDialog() {
      document.getElementById("grok-unsaved-overlay")?.remove();
      const dlgOverlay = document.createElement("div");
      dlgOverlay.id = "grok-unsaved-overlay";
      dlgOverlay.innerHTML = `
        <div id="grok-unsaved-box">
          <p>${t("unsaved_title")}</p>
          <button id="grok-unsaved-save-close" class="grok-unsaved-btn primary">${t("unsaved_save_close")}</button>
          <button id="grok-unsaved-discard" class="grok-unsaved-btn danger">${t("unsaved_discard")}</button>
          <button id="grok-unsaved-cancel" class="grok-unsaved-btn ghost">${t("btn_cancel")}</button>
        </div>
      `;
      document.body.appendChild(dlgOverlay);
      dlgOverlay.querySelector("#grok-unsaved-save-close").onclick = () => {
        dlgOverlay.remove();
        document.getElementById("grok-settings-save")?.click();
      };
      dlgOverlay.querySelector("#grok-unsaved-discard").onclick = () => {
        dlgOverlay.remove();
        closeSettings();
      };
      dlgOverlay.querySelector("#grok-unsaved-cancel").onclick = () => dlgOverlay.remove();
      dlgOverlay.onclick = (e) => { if (e.target === dlgOverlay) dlgOverlay.remove(); };
    }

    document.getElementById("grok-settings-close").onclick = attemptClose;
    document.getElementById("grok-settings-cancel").onclick = attemptClose;

    const settingsOverlayEl = document.getElementById("grok-settings-overlay");
    if (settingsOverlayEl) {
      settingsOverlayEl.addEventListener("click", (e) => {
        if (e.target === settingsOverlayEl) attemptClose();
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
          showToast(`✅ Loaded: ${newPack.langName}`);
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
                showToast(`✅ Restored: ${restored.langName}`);
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
      switchTab("template");
    };

    document.getElementById("grok-settings-reset").onclick = () => {
      showCustomConfirm(t("confirm_reset"), () => {
        const targetVal = langSelect.value;
        if (targetVal === "custom") {
          const pack = loadCustomLangPack();
          renderEditors((pack && pack.templates) ? pack.templates : DEFAULT_CONFIG.templates["en"]);
        } else {
          const targetLang = resolveLang(targetVal);
          renderEditors(DEFAULT_CONFIG.templates[targetLang] || DEFAULT_CONFIG.templates["en"]);
        }
      });
    };

    document.getElementById("grok-settings-save").onclick = () => {
      let selectedLang = langSelect.value;
      let realLangCode = selectedLang;

      if (selectedLang === "auto") {
        realLangCode = resolveLang("auto");
      }

      const existingConfig = loadConfig();
      const newConfig = {
        lang: selectedLang,
        autoSend:
          document.getElementById("grok-autosend-select").value === "auto",
        customTemplates: { ...(existingConfig.customTemplates || {}) },
      };

      let baseTemplates;
      if (realLangCode === "custom") {
        const pack = loadCustomLangPack();
        baseTemplates = (pack && pack.templates) ? pack.templates : DEFAULT_CONFIG.templates["en"];
      } else {
        baseTemplates = DEFAULT_CONFIG.templates[realLangCode] || DEFAULT_CONFIG.templates["en"];
      }
      const langTemplates = {};
      editorContainer.querySelectorAll("textarea").forEach((ta) => {
        const key = ta.getAttribute("data-key");
        const labelInput = editorContainer.querySelector(
          `input[data-label-key="${key}"]`,
        );
        const customLabel =
          labelInput?.value?.trim() || baseTemplates[key]?.label;
        langTemplates[key] = {
          ...baseTemplates[key],
          label: customLabel,
          prompt: ta.value,
        };
      });
      newConfig.customTemplates[realLangCode] = langTemplates;
      saveConfig(newConfig);

      savePushConfig({
        discord:      draftDiscord,
        telegram:     draftTelegram,
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

  function showCustomConfirm(message, onConfirm) {
    document.getElementById("grok-confirm-overlay")?.remove();
    const overlay = document.createElement("div");
    overlay.id = "grok-confirm-overlay";
    overlay.innerHTML = `
      <div id="grok-confirm-box">
        <p>${escapeHtml(message)}</p>
        <div class="grok-confirm-btns">
          <button id="grok-confirm-cancel" class="grok-btn grok-btn-secondary">${t("btn_cancel")}</button>
          <button id="grok-confirm-ok" class="grok-btn grok-btn-primary">${t("btn_confirm")}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector("#grok-confirm-cancel").onclick = () => overlay.remove();
    overlay.querySelector("#grok-confirm-ok").onclick = () => { overlay.remove(); onConfirm(); };
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
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
      return { discord: [], telegram: [] };
    }
  }

  function savePushConfig(cfg) {
    GM_setValue("grok_push_config", JSON.stringify(cfg));
  }

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

    if (allTargets.length === 1) { onConfirm(allTargets); return; }

    document.getElementById("grok-push-select-overlay")?.remove();
    const overlay = document.createElement("div");
    overlay.id = "grok-push-select-overlay";

    const itemsHtml = allTargets.map((target, i) => `
      <label class="grok-push-select-item">
        <input type="checkbox" data-idx="${i}" checked>
        <span style="flex:1">${escapeHtml(target.label)}</span>
        <span class="grok-push-select-badge ${target.type}">${target.type === "discord" ? "Discord" : "Telegram"}</span>
      </label>
    `).join("");

    overlay.innerHTML = `
      <div id="grok-push-select-box">
        <h3>${t("push_select_title")}</h3>
        <p>${t("push_select_hint")}<br><span style="color:#1D9BF0;word-break:break-all">${escapeHtml(convertedUrl)}</span></p>
        <div class="grok-push-select-list">${itemsHtml}</div>
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

  const TEMPLATE_KEYS = ["factcheck", "analysis", "tree", "solution", "translate"];

  const TEMPLATE_ICON_SVG = {
    factcheck:
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    analysis:
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    tree:
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14l-1.5-1.5c-.5-.5-.8-1.2-.8-2V9a4.7 4.7 0 0 0-9.4 0v4.5c0 .8-.3 1.5-.8 2z"/></svg>',
    solution:
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><line x1="5" y1="7" x2="19" y2="7"/><path d="M5 7l-3 7a3 3 0 0 0 6 0z"/><path d="M19 7l-3 7a3 3 0 0 0 6 0z"/></svg>',
    translate:
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  };

  const SETTINGS_ICON_SVG = {
    gear: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    template: TEMPLATE_ICON_SVG.translate.replace('width="16" height="16"', 'width="14" height="14"'),
    push: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>',
    reset: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
  };
  SETTINGS_ICON_SVG.options = SETTINGS_ICON_SVG.gear.replace('width="15" height="15"', 'width="14" height="14"');
  SETTINGS_ICON_SVG.closeSmall = SETTINGS_ICON_SVG.close.replace('width="16" height="16"', 'width="12" height="12"');

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
    "画像",
    "이미지",
    "생성",
  ];

  const MAX_INJECTION_ATTEMPTS = 80;

  const HEADER_POLL_MAX_ATTEMPTS = 10;

  let activeInterval = null;
  let pendingTask = null;

  let _drawerObserver = null;

  const SESSION_KEY_EVER_OPENED = "grok_ever_opened_this_page";

  function markDrawerEverOpened() {
    try {
      if (sessionStorage.getItem(SESSION_KEY_EVER_OPENED) !== "1") {
        sessionStorage.setItem(SESSION_KEY_EVER_OPENED, "1");
      }
    } catch (_) {
    }
  }

  function hasDrawerEverOpened() {
    try {
      return sessionStorage.getItem(SESSION_KEY_EVER_OPENED) === "1";
    } catch (_) {
      return false;
    }
  }

  function watchDrawerClose(ta) {
    markDrawerEverOpened();

    if (_drawerObserver) { clearInterval(_drawerObserver); _drawerObserver = null; }

    _drawerObserver = setInterval(() => {
      if (!document.contains(ta)) {
        clearInterval(_drawerObserver);
        _drawerObserver = null;
        hijackOperations();
      }
    }, 500);
  }

  let _waitTimer = null;
  let _headerPollTimer = null;

  function clearInjectionTimers() {
    if (_waitTimer) { clearInterval(_waitTimer); _waitTimer = null; }
    if (_headerPollTimer) { clearInterval(_headerPollTimer); _headerPollTimer = null; }
  }

  function resetGlobalState() {
    if (activeInterval) {
      clearInterval(activeInterval);
      activeInterval = null;
    }
    clearInjectionTimers();
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
          if (!originalBtn.closest("article").querySelector('[data-testid="tweetText"]')) return;
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

    const menu = document.createElement("div");
    menu.id = "grok-commander-menu";

    let isPrivateModeOn = GM_getValue("grok_private_mode_default", false);

    let privacyUiMode = GM_getValue("grok_privacy_ui_mode", "toggle");

    const rectWidth = 180;
    const rectHeight = 250;
    const expandLeft = x - rectWidth >= 0;
    let finalY = y;
    if (y + rectHeight > window.innerHeight) finalY = y - rectHeight;
    if (expandLeft) {
      menu.style.right = `${window.innerWidth - x}px`;
      menu.style.left = "";
    } else {
      menu.style.left = `${x}px`;
      menu.style.right = "";
    }
    menu.style.top = `${finalY}px`;
    menu.classList.add(expandLeft ? "grok-menu-expand-left" : "grok-menu-expand-right");

    const titleBar = document.createElement("div");
    titleBar.className = "grok-menu-titlebar";

    const privacyBtnWrapper = document.createElement("div");
    privacyBtnWrapper.className = "grok-privacy-btn-wrapper";

    const privacyToggleBtn = document.createElement("button");
    privacyToggleBtn.className = "grok-privacy-toggle-btn";
    privacyToggleBtn.title = t("private_tooltip");
    privacyToggleBtn.innerHTML = `<svg viewBox="0 0 20 20" width="19" height="19" aria-hidden="true"><g><mask id="gc-priv-a" fill="currentColor"><ellipse cx="8.334" cy="8.541" rx="1.042" ry="1.458"/></mask><ellipse cx="8.334" cy="8.541" fill="currentColor" rx="1.042" ry="1.458"/><path d="M9.375 8.541H8.042c0 .157-.047.244-.056.257-.003.004.016-.026.074-.06.062-.037.157-.071.274-.071v2.666c.83 0 1.455-.473 1.82-.986.369-.514.554-1.157.554-1.806H9.375zM8.334 10V8.667c.116 0 .211.034.273.071.058.034.078.064.075.06-.01-.013-.057-.1-.057-.257H5.959c0 .649.186 1.292.553 1.806.366.513.992.986 1.822.986V10zM7.292 8.54h1.333c0-.157.047-.243.057-.256.003-.004-.017.026-.075.06-.062.036-.157.071-.273.071V5.75c-.83 0-1.456.473-1.822.985-.367.515-.553 1.158-.553 1.806h1.333zm1.042-1.458v1.333c-.117 0-.212-.035-.274-.071-.058-.034-.077-.064-.074-.06.009.013.056.1.056.256h2.666c0-.648-.185-1.29-.553-1.806-.366-.512-.991-.985-1.821-.985v1.333z" fill="currentColor" mask="url(#gc-priv-a)"/><mask id="gc-priv-b" fill="currentColor"><ellipse cx="11.667" cy="8.541" rx="1.042" ry="1.458"/></mask><ellipse cx="11.667" cy="8.541" fill="currentColor" rx="1.042" ry="1.458"/><path d="M12.708 8.541h-1.333c0 .157-.047.244-.056.257-.003.004.016-.026.074-.06.062-.037.157-.071.274-.071v2.666c.83 0 1.455-.473 1.82-.986.369-.514.554-1.157.554-1.806h-1.333zM11.667 10V8.667c.116 0 .211.034.273.071.058.034.078.064.075.06-.01-.013-.057-.1-.057-.257H9.292c0 .649.186 1.292.553 1.806.366.513.992.986 1.822.986V10zm-1.042-1.46h1.333c0-.157.047-.243.057-.256.003-.004-.017.026-.075.06-.062.036-.157.071-.273.071V5.75c-.83 0-1.456.473-1.822.985-.367.515-.553 1.158-.553 1.806h1.333zm1.042-1.458v1.333c-.117 0-.212-.035-.274-.071-.058-.034-.077-.064-.075-.06.01.013.057.1.057.256h2.666c0-.648-.185-1.29-.553-1.806-.366-.512-.992-.985-1.821-.985v1.333z" fill="currentColor" mask="url(#gc-priv-b)"/><path d="M10 3.333c-6.667 0-3.27 5.601-7.5 7.5 0 1.374 1.17 1.25 1.608 2.308.367.886-.545 2.658-.775 3.525h3.334L10 17.5l3.333-.834h3.334c-.315-1.066-.993-2.38-.771-3.521.227-1.172 1.604-.86 1.604-2.312-4.23-1.899-.833-7.5-7.5-7.5z" fill="none" stroke="currentColor" stroke-width="1.333"/></g></svg>`;
    function renderPrivacyToggle() {
      privacyToggleBtn.classList.toggle("active", isPrivateModeOn);
      privacyToggleBtn.classList.toggle("disabled-mode", privacyUiMode === "per-item");
    }
    renderPrivacyToggle();
    privacyToggleBtn.onclick = (e) => {
      e.stopPropagation();
      if (privacyUiMode === "per-item") return;
      isPrivateModeOn = !isPrivateModeOn;
      GM_setValue("grok_private_mode_default", isPrivateModeOn);
      renderPrivacyToggle();
      if (findVisibleTextarea()) {
        ensureDrawerPrivacyState(isPrivateModeOn);
      }
    };
    privacyBtnWrapper.appendChild(privacyToggleBtn);

    const privacyModeBadge = document.createElement("button");
    privacyModeBadge.className = "grok-privacy-mode-badge";
    privacyModeBadge.innerHTML = `<svg viewBox="0 0 20 20" width="9" height="9" aria-hidden="true"><path fill="currentColor" d="M17.166 10.788c.03-.259.051-.52.051-.788s-.02-.529-.051-.788l1.68-1.316a.4.4 0 0 0 .096-.51l-1.591-2.755a.4.4 0 0 0-.484-.174l-1.981.796a5.85 5.85 0 0 0-1.36-.788l-.3-2.108A.39.39 0 0 0 12.84 2H9.66a.39.39 0 0 0-.386.336l-.3 2.108c-.489.203-.94.474-1.36.788l-1.98-.796a.4.4 0 0 0-.485.174L3.558 7.365a.4.4 0 0 0 .096.51l1.68 1.316c-.03.26-.051.52-.051.788s.02.529.051.788l-1.68 1.316a.4.4 0 0 0-.096.51l1.591 2.755a.4.4 0 0 0 .484.174l1.981-.796c.42.314.871.585 1.36.788l.3 2.108a.39.39 0 0 0 .386.336h3.18a.39.39 0 0 0 .386-.336l.3-2.108a5.85 5.85 0 0 0 1.36-.788l1.981.796a.4.4 0 0 0 .484-.174l1.591-2.755a.4.4 0 0 0-.096-.51l-1.68-1.316zM11.25 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>`;
    privacyModeBadge.title = t("privacy_mode_badge_tooltip");
    function renderPrivacyModeBadge() {
      privacyModeBadge.classList.toggle("per-item-active", privacyUiMode === "per-item");
    }
    renderPrivacyModeBadge();
    privacyModeBadge.onclick = (e) => {
      e.stopPropagation();
      privacyUiMode = privacyUiMode === "per-item" ? "toggle" : "per-item";
      GM_setValue("grok_privacy_ui_mode", privacyUiMode);
      renderPrivacyModeBadge();
      renderPrivacyToggle();
      showToast(privacyUiMode === "per-item" ? t("privacy_mode_switched_per_item") : t("privacy_mode_switched_toggle"));
      menuItemRefs.forEach((ref) => {
        if (privacyUiMode === "per-item") {
          if (!ref.perItemBtnEl) {
            const btn = buildPerItemPrivateBtn(ref.key, ref.tmpl);
            const pushBtnEl = ref.item.querySelector(".grok-push-btn");
            if (pushBtnEl) ref.item.insertBefore(btn, pushBtnEl);
            else ref.item.appendChild(btn);
            ref.perItemBtnEl = btn;
          }
        } else if (ref.perItemBtnEl) {
          ref.perItemBtnEl.remove();
          ref.perItemBtnEl = null;
        }
      });
    };
    privacyBtnWrapper.appendChild(privacyModeBadge);

    titleBar.appendChild(privacyBtnWrapper);
    menu.appendChild(titleBar);

    function buildPerItemPrivateBtn(key, tmpl) {
      const perItemPrivateBtn = document.createElement("button");
      perItemPrivateBtn.className = "grok-private-btn";
      perItemPrivateBtn.innerHTML = `<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" style="color:#1d9bf0"><g><mask id="gc-priv-item-a-${key}" fill="currentColor"><ellipse cx="8.334" cy="8.541" rx="1.042" ry="1.458"/></mask><ellipse cx="8.334" cy="8.541" fill="currentColor" rx="1.042" ry="1.458"/><path d="M9.375 8.541H8.042c0 .157-.047.244-.056.257-.003.004.016-.026.074-.06.062-.037.157-.071.274-.071v2.666c.83 0 1.455-.473 1.82-.986.369-.514.554-1.157.554-1.806H9.375zM8.334 10V8.667c.116 0 .211.034.273.071.058.034.078.064.075.06-.01-.013-.057-.1-.057-.257H5.959c0 .649.186 1.292.553 1.806.366.513.992.986 1.822.986V10zM7.292 8.54h1.333c0-.157.047-.243.057-.256.003-.004-.017.026-.075.06-.062.036-.157.071-.273.071V5.75c-.83 0-1.456.473-1.822.985-.367.515-.553 1.158-.553 1.806h1.333zm1.042-1.458v1.333c-.117 0-.212-.035-.274-.071-.058-.034-.077-.064-.074-.06.009.013.056.1.056.256h2.666c0-.648-.185-1.29-.553-1.806-.366-.512-.991-.985-1.821-.985v1.333z" fill="currentColor" mask="url(#gc-priv-item-a-${key})"/><mask id="gc-priv-item-b-${key}" fill="currentColor"><ellipse cx="11.667" cy="8.541" rx="1.042" ry="1.458"/></mask><ellipse cx="11.667" cy="8.541" fill="currentColor" rx="1.042" ry="1.458"/><path d="M12.708 8.541h-1.333c0 .157-.047.244-.056.257-.003.004.016-.026.074-.06.062-.037.157-.071.274-.071v2.666c.83 0 1.455-.473 1.82-.986.369-.514.554-1.157.554-1.806h-1.333zM11.667 10V8.667c.116 0 .211.034.273.071.058.034.078.064.075.06-.01-.013-.057-.1-.057-.257H9.292c0 .649.186 1.292.553 1.806.366.513.992.986 1.822.986V10zm-1.042-1.46h1.333c0-.157.047-.243.057-.256.003-.004-.017.026-.075.06-.062.036-.157.071-.273.071V5.75c-.83 0-1.456.473-1.822.985-.367.515-.553 1.158-.553 1.806h1.333zm1.042-1.458v1.333c-.117 0-.212-.035-.274-.071-.058-.034-.077-.064-.075-.06.01.013.057.1.057.256h2.666c0-.648-.185-1.29-.553-1.806-.366-.512-.992-.985-1.821-.985v1.333z" fill="currentColor" mask="url(#gc-priv-item-b-${key})"/><path d="M10 3.333c-6.667 0-3.27 5.601-7.5 7.5 0 1.374 1.17 1.25 1.608 2.308.367.886-.545 2.658-.775 3.525h3.334L10 17.5l3.333-.834h3.334c-.315-1.066-.993-2.38-.771-3.521.227-1.172 1.604-.86 1.604-2.312-4.23-1.899-.833-7.5-7.5-7.5z" fill="none" stroke="currentColor" stroke-width="1.333"/></g></svg>`;
      perItemPrivateBtn.title = t("private_tooltip");
      perItemPrivateBtn.onclick = (e) => {
        e.stopPropagation();
        resetGlobalState();
        executeCommand(tmpl.prompt, tweetData, true);
      };
      return perItemPrivateBtn;
    }

    const menuItemRefs = [];

    const menuItemsAnchor = document.createComment("grok-menu-items-anchor");
    menu.appendChild(menuItemsAnchor);

    function renderMenuItems() {
      menuItemRefs.forEach((ref) => ref.item.remove());
      menuItemRefs.length = 0;

      const templates = getCurrentTemplates();
      const keys = TEMPLATE_KEYS;
      const pushCfg = loadPushConfig();
      const hasAnyTarget =
        (pushCfg.discord  || []).some(e => e.enabled && e.url) ||
        (pushCfg.telegram || []).some(e => e.enabled && e.token && e.chat);
      keys.forEach((key) => {
        const tmpl = templates[key];
        if (!tmpl) return;
        const item = document.createElement("div");
        item.className = "grok-menu-item";

        const mainPart = document.createElement("span");
        mainPart.style.cssText =
          "display:flex;align-items:center;gap:10px;flex:1;";
        const iconHtml = TEMPLATE_ICON_SVG[key] || `<span style="font-size:16px">${tmpl.icon}</span>`;
        mainPart.innerHTML = `<span class="grok-menu-item-icon">${iconHtml}</span><span class="grok-menu-item-label">${escapeHtml(tmpl.label)}</span>`;
        mainPart.onclick = (e) => {
          e.stopPropagation();
          resetGlobalState();
          executeCommand(tmpl.prompt, tweetData, privacyUiMode === "per-item" ? false : isPrivateModeOn);
        };

        item.appendChild(mainPart);

        let perItemBtnEl = null;
        if (privacyUiMode === "per-item") {
          perItemBtnEl = buildPerItemPrivateBtn(key, tmpl);
          item.appendChild(perItemBtnEl);
        }
        menuItemRefs.push({ item, key, tmpl, get perItemBtnEl() { return perItemBtnEl; }, set perItemBtnEl(v) { perItemBtnEl = v; } });

        if (hasAnyTarget) {
          const pushBtn = document.createElement("button");
          pushBtn.className = "grok-push-btn";
          pushBtn.title = t("push_btn_tooltip");
          pushBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>`;
          pushBtn.onclick = (e) => {
            e.stopPropagation();
            showPushConfirm(tweetData.url, (targets) => doPushTargets(tweetData.url, targets));
          };
          item.appendChild(pushBtn);
        }

        menu.insertBefore(item, menuItemsAnchor);
      });
    }
    renderMenuItems();

    const footer = document.createElement("div");
    footer.className = "grok-menu-footer";

    const langBtn = document.createElement("button");
    langBtn.className = "grok-lang-quick-btn";
    let currentLangCode = resolveLang(loadConfig().lang || "auto");
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
            submenuVisible = false;
            currentLangCode = code;
            document.getElementById("grok-lang-submenu")?.remove();
            langBtn.textContent = `${LANG_FLAGS[code] ?? "🌐"} ${LANG_NAMES[code] ?? code}`;
            renderMenuItems();
            langBtn.title = t("lang_label");
            privacyToggleBtn.title = t("private_tooltip");
            privacyModeBadge.title = t("privacy_mode_badge_tooltip");
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
    if (!GM_getValue("grok_setup_complete_global", false)) {
      settingsBtn.classList.add("grok-settings-btn-highlight");
    }
    settingsBtn.title = t("settings_tooltip");
    settingsBtn.textContent = "⚙️";
    settingsBtn.onclick = (e) => {
      e.stopPropagation();
      GM_setValue("grok_setup_complete_global", true);
      overlay.remove();
      menu.remove();
      openSettings();
    };

    footer.appendChild(langBtn);
    footer.appendChild(settingsBtn);
    menu.appendChild(footer);

    document.body.appendChild(menu);
  }

  function isBottomRightFloating(btn) {
    const rect = btn.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    const nearRight = rect.right > window.innerWidth - 160;
    const nearBottom = rect.bottom > window.innerHeight - 160;
    if (!nearRight || !nearBottom) return false;
    let el = btn;
    while (el && el !== document.body) {
      const pos = getComputedStyle(el).position;
      if (pos === "fixed" || pos === "sticky") return true;
      el = el.parentElement;
    }
    return false;
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
          btn.offsetParent !== null &&
          isBottomRightFloating(btn)
        ) {
          return btn;
        }
      }
    }
    return null;
  }

  function triggerClick(element) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const pointerOpts = {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: 1,
      pointerType: "mouse",
      isPrimary: true,
      button: 0,
      clientX: cx,
      clientY: cy,
    };
    element.dispatchEvent(new PointerEvent("pointerdown", { ...pointerOpts, buttons: 1 }));
    element.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true, cancelable: true, clientX: cx, clientY: cy, button: 0 }),
    );
    element.dispatchEvent(new PointerEvent("pointerup", { ...pointerOpts, buttons: 0 }));
    element.dispatchEvent(
      new MouseEvent("mouseup", { bubbles: true, cancelable: true, clientX: cx, clientY: cy, button: 0 }),
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
    if (btn.getAttribute("aria-label") !== "私人聊天") {
      console.warn("[Commander] isDrawerPrivacyOn: unexpected aria-label on button, treated as not found", btn.getAttribute("aria-label"));
      return false;
    }
    const svg = btn.querySelector("svg");
    return svg ? svg.classList.contains("r-1cvl2hr") : false;
  }

  function ensureDrawerPrivacyState(withPrivacy) {
    const btn = findDrawerPrivacyButton();
    if (!btn) return { found: false, needsSecondClick: false };
    const currentlyOn = isDrawerPrivacyOn(btn);
    if (!withPrivacy) {
      if (currentlyOn) { triggerClick(btn); showToast(t("privacy_auto_synced")); }
      return { found: true, needsSecondClick: false };
    } else {
      if (!currentlyOn) {
        triggerClick(btn);
        showToast(t("privacy_auto_synced"));
        return { found: true, needsSecondClick: false };
      } else {
        return { found: true, needsSecondClick: false };
      }
    }
  }

  function getDrawerToggleButton() {
    const el = document.querySelector('[data-testid="GrokDrawerHeader"]');
    if (!el) return null;
    return el.tagName === "BUTTON" ? el : el.querySelector("button");
  }

  let _globalDrawerHeaderSeen = false;
  function watchGlobalDrawerCollapse() {
    setInterval(() => {
      const headerExists = !!document.querySelector('[data-testid="GrokDrawerHeader"]');
      if (_globalDrawerHeaderSeen && !headerExists) {
        hijackOperations();
      }
      _globalDrawerHeaderSeen = headerExists;
    }, 500);
  }

  function findVisibleTextarea() {
    const drawer = document.querySelector('[data-testid="GrokDrawer"]');
    const searchRoot = drawer || document;
    for (const ta of searchRoot.querySelectorAll("textarea")) {
      if (ta.offsetParent === null || !document.contains(ta)) continue;
      const rect = ta.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const style = getComputedStyle(ta);
      if (parseFloat(style.opacity) === 0) continue;
      if (style.pointerEvents === "none") continue;
      return ta;
    }
    return null;
  }

  function executeCommand(prompt, tweetData, withPrivacy = false) {
    resetGlobalState();

    const fullContent = `${prompt}\n\n[Tweet URL]: ${tweetData.url}\n[Tweet Content]: ${tweetData.text}`;
    const autoSend = loadConfig().autoSend === true;
    pendingTask = {
      content: fullContent,
      autoSend,
      withPrivacy,
      textFilled: false,
    };

    const existingTextarea = findVisibleTextarea();

    if (existingTextarea) {
      pendingTask.targetInput = existingTextarea;
      watchDrawerClose(existingTextarea);
      startInjectionDirect(existingTextarea, withPrivacy);
      return;
    }

    const drawerToggle = getDrawerToggleButton();
    if (drawerToggle) {
      triggerClick(drawerToggle);
      let waitAttempts = 0;
      _waitTimer = setInterval(() => {
        waitAttempts++;
        if (waitAttempts > 40) {
          console.warn("[Commander] Fallback path A: timed out waiting for textarea (40 x 200ms = 8s), giving up");
          clearInterval(_waitTimer); _waitTimer = null;
          return;
        }
        const ta = findVisibleTextarea();
        if (ta) {
          clearInterval(_waitTimer);
          _waitTimer = null;
          watchDrawerClose(ta);
          startInjection(withPrivacy);
        }
      }, 200);
      return;
    }

    const headerMaxAttempts = HEADER_POLL_MAX_ATTEMPTS;
    let headerPollAttempts = 0;

    function reopenViaButton(btn, source) {
      triggerClick(btn);
      let waitAttempts = 0;
      _waitTimer = setInterval(() => {
        waitAttempts++;
        if (waitAttempts > 40) {
          console.warn(`[Commander] Fallback path B(${source}): timed out waiting for textarea (40 x 200ms = 8s), giving up`);
          clearInterval(_waitTimer); _waitTimer = null;
          return;
        }
        const ta = findVisibleTextarea();
        if (ta) {
          clearInterval(_waitTimer);
          _waitTimer = null;
          watchDrawerClose(ta);
          startInjection(withPrivacy);
        }
      }, 200);
    }

    _headerPollTimer = setInterval(() => {
      headerPollAttempts++;
      if (headerPollAttempts > headerMaxAttempts) {
        clearInterval(_headerPollTimer);
        _headerPollTimer = null;
        console.warn(`[Commander] Fallback path B: ${headerMaxAttempts} polls found no collapse handle, giving up and prompting manual reopen`);
        showWarnToast(t("need_reopen"));
        return;
      }

      const btn = getDrawerToggleButton();
      if (btn) {
        clearInterval(_headerPollTimer);
        _headerPollTimer = null;
        reopenViaButton(btn, "handle");
        return;
      }

      const globalBtn = findGlobalGrokButton();
      if (globalBtn) {
        if (hasDrawerEverOpened()) {
          clearInterval(_headerPollTimer);
          _headerPollTimer = null;
          reopenViaButton(globalBtn, "global floating button (page already opened before)");
        } else {
          clearInterval(_headerPollTimer);
          _headerPollTimer = null;
          console.warn("[Commander] This page has not truly opened Grok yet, synthetic click on the floating button is known to be ineffective, prompting manual click");
          showWarnToast(t("need_reopen"));
        }
        return;
      }
    }, 100);
  }

  function findSendButton() {
    const buttons = document.querySelectorAll("button");
    for (const btn of buttons) {
      const label = btn.getAttribute("aria-label");
      if (label && BLACKLIST_LABELS.some((bad) => label.toLowerCase().includes(bad))) continue;
      if (label && SEND_BTN_LABELS.some((good) => label === good)) return btn;
      const svgPath = btn.querySelector("path");
      if (svgPath) {
        const d = svgPath.getAttribute("d");
        if (
          (d === SEND_SVG_FINGERPRINT || (d && d.startsWith("M12 3.59"))) &&
          !d.startsWith("M3 12")
        ) return btn;
      }
    }
    return null;
  }

  function startInjectionDirect(targetInput, withPrivacy = false) {
    if (activeInterval) { clearInterval(activeInterval); activeInterval = null; }
    let attempts = 0;
    let clearedInput = false;
    let privateHandled = false;
    let textareaEverSeen = !!targetInput;

    activeInterval = setInterval(() => {
      attempts++;
      if (attempts > MAX_INJECTION_ATTEMPTS || !pendingTask) {
        const neverFilled = pendingTask && !pendingTask.textFilled;
        resetGlobalState();
        if (neverFilled) showWarnToast(t("need_reopen"));
        return;
      }

      const stillVisible = targetInput && document.contains(targetInput) && targetInput.offsetParent !== null;
      if (textareaEverSeen && !stillVisible) {
        resetGlobalState();
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
        const targetBtn = findSendButton();
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
      if (attempts > MAX_INJECTION_ATTEMPTS || !pendingTask) {
        const neverFilled = pendingTask && !pendingTask.textFilled;
        console.warn(`[Commander] startInjection: ${attempts > MAX_INJECTION_ATTEMPTS ? `timed out (${MAX_INJECTION_ATTEMPTS} attempts)` : 'pendingTask was cleared'}, neverFilled:${neverFilled}`);
        resetGlobalState();
        if (neverFilled) showWarnToast(t("need_reopen"));
        return;
      }
      const mask = document.querySelector('[data-testid="mask"]');
      const closeBtn = document.querySelector(
        'button[data-testid="app-bar-close"]',
      );
      if (mask && closeBtn) {
        console.warn("[Commander] Intercepted image-generation dialog -> closing it!");
        triggerClick(closeBtn);
        return;
      }

      const textarea = findVisibleTextarea();

      if (textarea) textareaEverSeen = true;

      if (textareaEverSeen && !textarea) {
        resetGlobalState();
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

      const targetInput = textarea;

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
          simulateEnterKey(pendingTask.targetInput);
        }

        const targetBtn = findSendButton();

        if (
          targetBtn &&
          !targetBtn.disabled &&
          targetBtn.getAttribute("aria-disabled") !== "true"
        ) {
          triggerClick(targetBtn);

          setTimeout(() => {
            if (pendingTask && pendingTask.targetInput) {
              setReactValue(pendingTask.targetInput, "");
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

  let _hijackRafPending = false;
  const observer = new MutationObserver(() => {
    if (!_hijackRafPending) {
      _hijackRafPending = true;
      requestAnimationFrame(() => {
        _hijackRafPending = false;
        hijackOperations();
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(hijackOperations, 1000);
  watchGlobalDrawerCollapse();

  GM_registerMenuCommand("⚙️ Grok Commander 設定", () => openSettings());

  console.log("[Commander] Grok Commander v1.3.0.1 loaded.");
})();