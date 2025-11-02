// js/dialogue_acts.js - ユーザー入力を作為に変換する翻訳ロジック

/**
 * ユーザーの入力を解析し、適切な作為 (Act) を選択・実行する。
 * (これは、ユーザーの入力を CalcLang の論理に接続する「論理的ブリッジ」として機能する)
 * @param {string} input - ユーザーからのコマンド文字列
 * @returns {object} - 実行結果 ({ newState, log })
 */
function processDialogueAsAct(input) {
    const parts = input.toUpperCase().split(/\s+/);
    const command = parts[0];
    const state = window.initialState; // 現在の状態 (簡略化のためグローバルから取得)

    let actId;
    let params = {};
    
    // ----------------------------------------------------
    // 入力コマンドから作為IDへの論理的ルーティング
    // ----------------------------------------------------
    if (command === "TRANSFER") {
        // 例: TRANSFER USER_A 100 USER_B
        actId = "TRANSFER";
        params = {
            sourceAccountId: parts[1],
            targetAccountId: parts[3],
            amount: parseFloat(parts[2])
        };
    } else if (command === "WITHDRAW" || command === "ATM_OUT") {
        // 例: WITHDRAW 1000 JPY (論理的ブリッジ口座へのルーティング)
        actId = "ACT_BRIDGE_OUT";
        params = {
            sourceAccountId: "ACCOUNT_BRIDGE",
            amount: parseFloat(parts[1]),
        };
    } else if (command === "HIRE" || command === "APPLY") {
        // 例: HIRE USER_A LBA_001 (労働市場の鏡像へのルーティング)
        actId = "ACT_ASSIGN_LABOR";
        params = {
            userId: parts[1],
            laborActId: parts[2]
        };
    } else if (command === "RUN_PY" || command === "EXECUTE_PYTHON") {
        // 例: RUN_PY USER_A HASH_CODE_X (CALC-VMへのルーティング)
        actId = "ACT_EXECUTE_LOGOS_CODE";
        params = {
            userId: parts[1],
            languageSpec: "python_spec",
            codeHash: parts[2]
        };
    } else {
        // 不明なコマンドは非論理的として拒否
        return { newState: state, log: [{ status: "FAIL", reason: "非論理的な作為（不明なコマンド）" }] };
    }

    // ----------------------------------------------------
    // 選択された作為の実行
    // ----------------------------------------------------
    const actDefinition = AUDIT_ACTS_DEFINITION[actId] || INFRA_ACTS_DEFINITION[actId];
    if (actDefinition) {
        // ここでLIL監査と作為の実行ロジックが走ると仮定
        // (CalcLangの実行関数を通じて状態が更新される)
        return actDefinition.execute(state, params); 
    } else {
        return { newState: state, log: [{ status: "FAIL", reason: "作為定義が存在しません" }] };
    }
}
