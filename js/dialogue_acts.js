// js/dialogue_acts.js - ユーザー入力を作為に変換する翻訳ロジックの強化

/**
 * ユーザーの入力を解析し、適切な作為 (Act) を選択・実行する。
 * (ボタンクリック、または直接入力されたコマンドを処理)
 * @param {string} input - ユーザーからのコマンド文字列
 * @returns {object} - 実行結果 ({ newState, log })
 */
function processDialogueAsAct(input) {
    const parts = input.toUpperCase().split(/\s+/);
    const command = parts[0];
    const state = window.initialState; 

    let actId;
    let params = {};
    let isDefaultParam = false; // デフォルト引数を使用するかどうかを示すフラグ
    
    // ----------------------------------------------------
    // 新規追加: 論理的機能へのルーティング
    // ----------------------------------------------------
    if (command === "WITHDRAW" || command === "ATM_OUT") {
        // 例: WITHDRAW 1000 JPY (ブリッジ口座)
        actId = "ACT_BRIDGE_OUT";
        params = {
            sourceAccountId: "ACCOUNT_BRIDGE",
            amount: parseFloat(parts[1]) || 1000 // デフォルト値1000
        };
        isDefaultParam = parts.length === 1;

    } else if (command === "APPLY" || command === "HIRE") {
        // 例: APPLY (または HIRE) USER_AUDIT_A LBA_001 (労働市場)
        actId = "ACT_ASSIGN_LABOR";
        params = {
            userId: parts[1] || "USER_AUDIT_A", // デフォルトユーザー
            laborActId: parts[2] || "LBA_001" // デフォルト求人ID
        };
        isDefaultParam = parts.length === 1;
        
    } else if (command === "MATCH") {
        // 例: MATCH USER_AUDIT_A USER_AUDIT_B (感情市場)
        actId = "ACT_ASSESS_AFFINITY";
        params = {
            userAId: parts[1] || "USER_AUDIT_A",
            userBId: parts[2] || "USER_AUDIT_B"
        };
        isDefaultParam = parts.length === 1;

    } else if (command === "RUN_PY" || command === "EXECUTE_PYTHON") {
        // 例: RUN_PY USER_A HASH_CODE_X (CALC-VM)
        actId = "ACT_EXECUTE_LOGOS_CODE";
        params = {
            userId: parts[1] || "USER_AUDIT_A",
            languageSpec: "python_spec",
            codeHash: parts[2] || "PY_HASH_00A" // デフォルトコードハッシュ
        };
        isDefaultParam = parts.length === 1;
    }
    // ... 既存の "TRANSFER" などのロジックが続く ...

    // ----------------------------------------------------
    // 選択された作為の実行
    // ----------------------------------------------------
    if (actId) {
        const actDefinition = AUDIT_ACTS_DEFINITION[actId] || INFRA_ACTS_DEFINITION[actId];
        
        if (actDefinition) {
            // デフォルト引数で実行された場合は、それをログに記録
            if (isDefaultParam) {
                console.warn(`[LIL WARNING] コマンド ${command} はパラメータを省略しました。デフォルト値を使用して実行します。`);
            }
            return actDefinition.execute(state, params); 
        } else {
            return { newState: state, log: [{ status: "FAIL", reason: `作為定義 ${actId} が存在しません` }] };
        }
    } else {
        return { newState: state, log: [{ status: "FAIL", reason: "非論理的な作為（不明なコマンド）" }] };
    }
}
