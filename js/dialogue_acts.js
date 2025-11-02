// js/dialogue_acts.js - ユーザー入力を作為に変換する翻訳ロジック

/**
 * ユーザーの入力を解析し、適切な作為 (Act) を選択・実行する。
 * (ボタンクリック、または直接入力されたコマンドを処理)
 * @param {string} input - ユーザーからのコマンド文字列
 * @returns {object} - 実行結果 ({ newState, log })
 */
function processDialogueAsAct(input) {
    // ... (中略：既存のACT_DEFINITIONを参照するロジック) ...
    const parts = input.toUpperCase().split(/\s+/);
    const command = parts[0];
    // NOTE: 状態は常に最新のものを取得すべきだが、ここでは簡略化のためグローバルから取得（または関数引数で渡されるべき）
    const state = window.initialState; 

    let actId;
    let params = {};
    let isDefaultParam = false;
    
    // ----------------------------------------------------
    // 入力コマンドから作為IDへの論理的ルーティング
    // ----------------------------------------------------
    
    // MINT作為
    if (command === "MINT") {
        actId = "MINT";
        params = {
            targetAccountId: parts[1] || "USER_AUDIT_A",
            amount: parseFloat(parts[2]) || 1000
        };
        isDefaultParam = parts.length === 1;
    }
    // TRANSFER作為
    else if (command === "TRANSFER") {
        actId = "TRANSFER";
        params = {
            sourceAccountId: parts[1] || "USER_AUDIT_A",
            targetAccountId: parts[3] || "USER_AUDIT_B",
            amount: parseFloat(parts[2]) || 100
        };
        isDefaultParam = parts.length === 1;
    } 
    // ACT_Z_REMEDIATE作為 (Z-Function)
    else if (command === "ACT_Z_REMEDIATE") {
        actId = "ACT_Z_REMEDIATE";
        params = {
            triggeringLILId: parts[1] || "LIL_ZZZ",
            remediationAction: parts[2] || "HALT_AND_RESTART"
        };
        isDefaultParam = parts.length === 1;
    }
    // ACT_REQUEST_NETWORK作為 (INFRA_ACTの例)
    else if (command === "ACT_REQUEST_NETWORK") {
        actId = "ACT_REQUEST_NETWORK";
        params = {
            sourceId: parts[1] || "USER_AUDIT_A",
            targetUrl: parts[2] || "LOGOS_NET",
            dataVolume: parseFloat(parts[3]) || 50
        };
    }
    // ACT_UPDATE_CONTENT作為 (STORE_UPDATEの例)
    else if (command === "ACT_UPDATE_CONTENT") {
        actId = "ACT_UPDATE_CONTENT";
        params = {
            newContentHash: parts[1] || "NEW_HASH_XYZ",
            accessLevel: parseFloat(parts[2]) || 1.0
        };
    }
    // APPLY作為 (SOCIAL_ACTの例)
    else if (command === "APPLY") {
        actId = "ACT_ASSIGN_LABOR";
        params = {
            userId: parts[1] || "USER_AUDIT_A",
            laborActId: parts[2] || "LBA_001"
        };
    }
    // ... その他の定義された作為のルーティングロジックが続く ...
    
    // ACT_REQUEST_ENERGY作為 (INFRA_ACTの例)
    else if (command === "ACT_REQUEST_ENERGY") {
        actId = "ACT_REQUEST_ENERGY";
        params = {
            deviceId: parts[1] || "DEVICE_001",
            duration: parseFloat(parts[2]) || 10
        };
    }
    
    // ----------------------------------------------------
    // 選択された作為の実行
    // ----------------------------------------------------
    if (actId) {
        // AUDIT_ACTS_DEFINITION と INFRA_ACTS_DEFINITION は別のファイルで定義されている前提
        const actDefinition = window.AUDIT_ACTS_DEFINITION[actId] || window.INFRA_ACTS_DEFINITION[actId];
        
        if (actDefinition) {
            // ここでLIL監査と作為の実行ロジックが走ると仮定
            // NOTE: 実際には、CalcLangのコア実行関数を介してLIL監査が適用されるべきです。
            const result = actDefinition.execute(state, params); 
            // 状態をグローバルで更新（簡略化のため）
            window.initialState = result.newState;
            return result;
        } else {
            return { newState: state, log: [{ status: "FAIL", reason: `作為定義 ${actId} が存在しません` }] };
        }
    } else {
        return { newState: state, log: [{ status: "FAIL", reason: "非論理的な作為（不明なコマンド）" }] };
    }
}

// index.html のインラインスクリプトからアクセスできるように、関数をグローバルスコープに追加
window.processDialogueAsAct = processDialogueAsAct;

// グローバルスコープにAUDIT_ACTS_DEFINITIONが存在しない場合のためにINFRA_ACTS_DEFINITIONも追加
// NOTE: これは一時的な処置であり、本来はモジュール間でインポートすべきです。
// window.INFRA_ACTS_DEFINITION = INFRA_ACTS_DEFINITION; 
